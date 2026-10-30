import ProperTeeVisitor from './ProperTeeVisitor.js';
import ProperTeeParser from './ProperTeeParser.js';
import ProperTeeLexer from './ProperTeeLexer.js';
import antlr4 from 'antlr4';

// Spec v0.8.0 (#4): the ProperTee null value. A Symbol, NOT JS null — the visitor
// uses JS null internally as a statement sentinel, and a Symbol naturally falls
// through every typeof-based check (deepCopy passes it through, _deepEqual matches
// it only by identity, arithmetic/logic/conditions reject it). "No implicit null":
// the language never produces this — it enters only via the `null` literal or data
// (JSON_PARSE, host values).
export const TEE_NULL = Symbol('null');

// Spec v0.10.0: the genuine-Result origin brand. A registry symbol (Symbol.for) so
// Scheduler.js brands collection entries without an import; a symbol KEY is invisible
// to Object.keys / JSON.stringify / for...in, so display, JSON, equality, and TYPE_OF
// are byte-identical — only IS_RESULT and UNWRAP observe it, and deepCopy preserves it.
// Script object literals never carry it.
export const TEE_RESULT = Symbol.for('propertee.result');

function makeResult(status, ok, value) {
    return { status: status, ok: ok, value: value, [TEE_RESULT]: true };
}

function isGenuineResult(v) {
    return v !== null && typeof v === 'object' && v[TEE_RESULT] === true;
}

// A script object's keys are its own properties. `in` would also find what every JS object
// inherits (toString, constructor, and __proto__, which leads to Object.prototype itself), and
// obj.hasOwnProperty(key) fails on data that has a "hasOwnProperty" key of its own.
function hasOwnKey(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

class ModuleErrorListener extends antlr4.error.ErrorListener {
    constructor(errors) {
        super();
        this.errors = errors;
    }
    syntaxError(_recognizer, _offendingSymbol, line, column, msg) {
        this.errors.push({ line, column, msg });
    }
}

// The integer range is ±(2^53 − 1) (spec v0.33.0; 32-bit since v0.13.0 before): every integer in it
// is exact as a number here, and it is the range RFC 8259 §6 says JSON readers agree on.
const MAX_INTEGER = Number.MAX_SAFE_INTEGER;
const INTEGER_OVERFLOW = 'Integer overflow: the result is outside ±9,007,199,254,740,991';

function literalOutOfRange(token) {
    return `Integer literal out of range: ${token} is larger than 9,007,199,254,740,991`;
}

// The integer range for integer-producing builtins (spec v0.13.0, v0.33.0); NaN is not in it.
function intResult(d) {
    if (!(Math.abs(d) <= MAX_INTEGER)) {
        throw new Error(`Runtime Error: ${INTEGER_OVERFLOW}`);
    }
    return d;
}

// Spec v0.36.0: numbers are always finite, as division by zero was always an error. A decimal
// result too large to represent is an error, as an integer one outside the range is; it used to be
// Infinity, and Infinity - Infinity NaN.
const NUMBER_OVERFLOW = 'Number overflow: the result is too large to represent';
function finiteResult(d) {
    if (!Number.isFinite(d)) throw new Error(`Runtime Error: ${NUMBER_OVERFLOW}`);
    return d;
}

// A host value holding Infinity or NaN cannot come in either (spec v0.36.0): the error, or null.
// `name` is how the script reaches the value — a property's name, `FN() result`.
function hostNonFinite(value, name) {
    const found = firstNonFinite(value, name);
    return found ? `${found.path} is ${found.number}, which ProperTee numbers cannot represent` : null;
}

// An external call's Result (spec v0.37.0, as the reference runtime gives it): whatever the host
// returned, as the value of an ok Result — a Result the host built included — or an error Result
// when the value holds Infinity or NaN (spec v0.36.0), as a thrown error gives.
function externalResult(name, value) {
    const nonFinite = hostNonFinite(value, `${name}() result`);
    return nonFinite ? makeResult('error', false, nonFinite) : makeResult('done', true, value);
}

// Spec v0.30.0: a finite number as the decimal digits PRINT shows for it — the shortest
// round-trip digits of Number::toString (spec v0.14.0) — read as ±0.digits × 10^exponent.
// digits has no leading or trailing zeros; zero has none. ROUND/FLOOR/CEIL/TRUNC with digits and
// FORMAT's .Nf round these digits, not the binary value, so FLOOR(0.29, 2) is 0.29 and the result
// is the reference runtime's (its DecimalDigits), which shows the same digits.
const ZERO_DIGITS = { negative: false, digits: '', exponent: 0 };

function decimalDigits(x) {
    if (x === 0) return ZERO_DIGITS;                        // -0 too
    const text = String(Math.abs(x));                       // "123.45", "0.0001", "1e+21", "1.5e-7"
    const e = text.indexOf('e');
    const mantissa = e < 0 ? text : text.slice(0, e);
    const dot = mantissa.indexOf('.');
    const all = dot < 0 ? mantissa : mantissa.slice(0, dot) + mantissa.slice(dot + 1);
    let pointExp = (e < 0 ? 0 : Number(text.slice(e + 1))) - (dot < 0 ? 0 : mantissa.length - dot - 1);
    let start = 0;
    while (start < all.length - 1 && all[start] === '0') start++;
    let end = all.length;
    while (end - start > 1 && all[end - 1] === '0') { end--; pointExp++; }
    const digits = all.slice(start, end);
    return { negative: x < 0, digits, exponent: pointExp + digits.length };
}

// Rounded to `places` decimal places (negative: tens, hundreds, …) in the direction `mode`
// ('HALF_UP' — a tie away from zero —, 'FLOOR', 'CEILING' or 'DOWN'). Places the digits do not
// reach change nothing; a unit above the number leaves zero or one unit.
function roundDigits(d, places, mode) {
    const k = d.digits.length;
    if (k === 0 || places >= k - d.exponent) return d;     // nothing to drop; covers any huge places
    // A unit above 1e400 exceeds every double, so clamping changes no result.
    const p = Math.max(places, -400);
    const keep = d.exponent + p;                            // leading digits at or above the unit 10^-p
    const up = mode === 'HALF_UP' ? keep >= 0 && d.digits[keep] >= '5'
        : mode === 'FLOOR' ? d.negative
        : mode === 'CEILING' ? !d.negative
        : false;                                            // a nonzero digit is always dropped
    if (keep <= 0) return up ? { negative: d.negative, digits: '1', exponent: 1 - p } : ZERO_DIGITS;
    const kept = d.digits.slice(0, keep).split('');
    let exponent = d.exponent;
    if (up) {
        let i = kept.length - 1;
        while (i >= 0 && kept[i] === '9') kept[i--] = '0';
        if (i >= 0) kept[i] = String(Number(kept[i]) + 1);
        else { kept.unshift('1'); exponent++; }             // 0.99… → 1.0: one more digit
    }
    let s = kept.join('');
    let end = s.length;
    while (end > 1 && s[end - 1] === '0') end--;
    return { negative: d.negative, digits: s.slice(0, end), exponent };
}

// The nearest number; a value beyond the double range is ±Infinity, and zero is +0.
function digitsToNumber(d) {
    if (d.digits === '') return 0;
    const v = Number('0.' + d.digits + 'e' + d.exponent);
    return v === 0 ? 0 : d.negative ? -v : v;
}

// The unsigned plain text with exactly `places` decimals and no exponent; round first.
function fixedText(d, places) {
    const k = d.digits.length;
    let out = '';
    if (d.exponent <= 0) out = '0';
    else for (let i = 0; i < d.exponent; i++) out += i < k ? d.digits[i] : '0';
    if (places > 0) {
        out += '.';
        for (let i = 0; i < places; i++) {
            const at = d.exponent + i;
            out += at >= 0 && at < k ? d.digits[at] : '0';
        }
    }
    return out;
}

function isWholeNumber(v) {
    return typeof v === 'number' && Number.isFinite(v) && Math.floor(v) === v;
}

// An integer from min to max, every one equally likely (spec v0.33.0). Scaling Math.random() skipped
// integers once the span passed its random bits (the whole range gave only odd numbers), so draw
// 32-bit chunks as a BigInt, keep the bits the span needs, and draw again past the end.
function randomInteger(min, max) {
    const size = BigInt(max) - BigInt(min) + 1n;               // up to 2^54 - 1, past a double
    const bits = BigInt((size - 1n).toString(2).length);
    for (;;) {
        let r = 0n;
        for (let have = 0n; have < bits; have += 32n) r = (r << 32n) | BigInt(Math.floor(Math.random() * 4294967296));
        r &= (1n << bits) - 1n;
        if (r < size) return Number(BigInt(min) + r);
    }
}

// The from..to span of SUBSTRING and SLICE (spec v0.34.0): start must be an integer of 1 or more and
// the length or count one of 0 or more, but past the end there is just less. String.substring is
// not used for the clamping: it turns a negative position into 0 and swaps a start past the end.
function span(fn, start, countName, count, size) {
    if (start === undefined) throw new Error(`Runtime Error: ${fn}() missing argument 2`);
    const position = (v, name, min) => {
        if (!isWholeNumber(v) || v < min) throw new Error(`Runtime Error: ${fn}() ${name} must be an integer of ${min} or more`);
        return v;
    };
    const from = Math.min(position(start, 'start', 1) - 1, size);
    return [from, count === undefined ? size : Math.min(from + position(count, countName, 0), size)];
}

// FN(n, [digits]) for FLOOR/CEIL/ROUND/TRUNC (spec v0.30.0). Without digits: an integer, ROUND's
// tie away from zero (ROUND(-2.5) is -3). With digits: a decimal rounded on the shown digits;
// Infinity/NaN come back as is. A third argument is an error, not dropped.
function rounding(fn, args, mode) {
    if (args.length > 2) throw new Error(`Runtime Error: ${fn}() takes at most 2 arguments`);
    if (args.length < 1) throw new Error(`Runtime Error: ${fn}() missing argument 1`);
    const n = args[0];
    if (typeof n !== 'number') throw new Error(`Runtime Error: ${fn}() requires numeric arguments`);
    if (args.length === 1) return intResult(wholeRound(n, mode));
    if (!isWholeNumber(args[1])) throw new Error(`Runtime Error: ${fn}() digits must be an integer`);
    return finiteResult(digitsToNumber(roundDigits(decimalDigits(n), args[1], mode)));   // CEIL(max, -308)
}

// n rounded to a whole number; the same value as rounding its shown digits at place 0.
function wholeRound(n, mode) {
    if (mode === 'FLOOR') return Math.floor(n);
    if (mode === 'CEILING') return Math.ceil(n);
    if (mode === 'DOWN') return Math.trunc(n);
    // |n| - floor(|n|) is exact, so the tie test is too (Math.round sends a tie toward +∞).
    const a = Math.abs(n);
    const f = Math.floor(a);
    const r = a - f >= 0.5 ? f + 1 : f;
    return n < 0 ? -r : r;
}

// The numbers SUM, MAX and MIN take (spec v0.36.0): each argument is a number or an array of
// numbers, as a spreadsheet's MIN(A1:A10) takes a range — MIN(prices), MAX(sizes, 0). An array
// inside an array is not a number. Before, an array was an error, so a script found a list's least
// value with a loop that started from a huge number.
function mathNumbers(fn, args) {
    const out = [];
    for (const a of args) {
        for (const n of Array.isArray(a) ? a : [a]) {
            if (typeof n !== 'number') throw new Error(`Runtime Error: ${fn}() requires numeric arguments`);
            out.push(n);
        }
    }
    return out;
}

// MAX/MIN: the first number that beats every other, checked one by one like the reference.
function minMax(fn, args, max) {
    const numbers = mathNumbers(fn, args);
    if (numbers.length === 0) throw new Error(`Runtime Error: ${fn}() requires at least one number`);
    let best;
    for (const a of numbers) {
        if (best === undefined || (max ? a > best : a < best)) best = a;
    }
    return best;
}

// Spec v0.31.0: a number pattern draws how a number is written, as a spreadsheet's number format
// does — `0` a digit always written, `#` a digit written only when there is one, `.` the decimal
// point, a `,` in the integer part groups the digits by three, a final `%` writes the number times
// 100. The integer part is `#`s then `0`s, a single comma allowed between any two of them; the
// decimals are `0`s then `#`s — (#(,?#)*(,?0)*|0(,?0)*)(\.(0+#*|#+))?%? as a regex. It replaced spec
// v0.30.0's Python-style {:spec}, which was hard to read.

// The parsed pattern — how many integer digits and decimals it always writes, and at most — or
// null if `text` is not one. A plain scan, as in the reference runtime, whose regex engine
// recursed once per symbol and overflowed on a long pattern.
function parseNumberPattern(text) {
    const n = text.length;
    let i = 0;
    let digits = 0;
    let zeros = 0;
    let group = false;
    let comma = false;                                      // the last symbol was a comma
    for (; i < n; i++) {
        const c = text[i];
        if (c === ',') {
            if (digits === 0 || comma) return null;         // a comma first, or two in a row
            group = true;
            comma = true;
        } else if (c === '0' || c === '#') {
            if (c === '#' && zeros > 0) return null;        // a # after a 0
            if (c === '0') zeros++;
            digits++;
            comma = false;
        } else {
            break;
        }
    }
    if (digits === 0 || comma) return null;                 // no digit, or a comma last
    let minFrac = 0;
    let maxFrac = 0;
    if (i < n && text[i] === '.') {
        for (i++; i < n && (text[i] === '0' || text[i] === '#'); i++) {
            if (text[i] === '0') {
                if (maxFrac > minFrac) return null;         // a 0 after a #
                minFrac++;
            }
            maxFrac++;
        }
        if (maxFrac === 0) return null;                     // a point with no decimal after it
    }
    const percent = i < n && text[i] === '%';
    if (percent) i++;
    return i === n ? { minInt: zeros, group, minFrac, maxFrac, percent } : null;
}

// n written as the pattern draws it, as the reference runtime's Builtins.shape writes it: the
// shown digits rounded to the pattern's decimals like ROUND (after a `%` moves the point two
// places, exactly, so 0.145 is 15%), the integer digits never cut and zero-filled up to the
// pattern's `0`s, `#` decimals without trailing zeros, no sign on a value rounded to zero, never
// an exponent; Infinity and NaN as PRINT shows them.
function shapeNumber(n, p) {
    if (!Number.isFinite(n)) return String(n);
    let d = decimalDigits(n);
    if (p.percent && d.digits !== '') d = { negative: d.negative, digits: d.digits, exponent: d.exponent + 2 };
    d = roundDigits(d, p.maxFrac, 'HALF_UP');
    const text = fixedText(d, p.maxFrac);
    const point = text.indexOf('.');
    let whole = point < 0 ? text : text.slice(0, point);
    const frac = point < 0 ? '' : text.slice(point + 1);
    if (whole.length < p.minInt) whole = '0'.repeat(p.minInt - whole.length) + whole;
    if (p.group) whole = groupThousands(whole);
    let end = frac.length;
    while (end > p.minFrac && frac[end - 1] === '0') end--;
    return (d.negative && d.digits !== '' ? '-' : '') + whole + (end > 0 ? '.' + frac.slice(0, end) : '')
        + (p.percent ? '%' : '');
}

// The format as literal text and placeholders, in order: a placeholder is {text, pattern}, the
// pattern null for {}.
function parseFormat(fn, format) {
    const parts = [];
    let literal = '';
    let i = 0;
    while (i < format.length) {
        const c = format[i];
        if (c === '{' && format.startsWith('{{', i)) { literal += '{'; i += 2; continue; }
        if (c === '}' && format.startsWith('}}', i)) { literal += '}'; i += 2; continue; }
        if (c === '}') throw new Error(`Runtime Error: ${fn}() invalid format: unmatched }`);
        if (c !== '{') { literal += c; i++; continue; }
        const close = format.indexOf('}', i + 1);
        if (close < 0) throw new Error(`Runtime Error: ${fn}() invalid format: unclosed {`);
        const text = format.slice(i, close + 1);
        const inner = text.slice(1, -1);
        const pattern = inner === '' ? null : parseNumberPattern(inner);
        if (inner !== '' && pattern === null) throw new Error(`Runtime Error: ${fn}() invalid format: ${text}`);
        if (literal !== '') { parts.push(literal); literal = ''; }
        parts.push({ text, pattern });
        i = close + 1;
    }
    if (literal !== '') parts.push(literal);
    return parts;
}

// "1234567" → "1,234,567".
function groupThousands(whole) {
    let out = '';
    for (let i = 0; i < whole.length; i++) {
        if (i > 0 && (whole.length - i) % 3 === 0) out += ',';
        out += whole[i];
    }
    return out;
}

// Spec v0.31.0: the columns a text takes on screen, for ALIGN_LEFT/ALIGN_RIGHT/ALIGN_CENTER — the
// reference runtime's DisplayWidth, with the same Unicode 16.0 tables. Per code point, the first
// rule that applies: 0 for a combining mark or format character (General_Category Mn, Me or Cf)
// and for a Hangul medial vowel or final consonant (U+1160–U+11FF, U+D7B0–U+D7FF); 2 for
// East_Asian_Width W or F and for the CJK ideograph blocks and planes whose unassigned code points
// default to W; 1 otherwise, a lone surrogate included. Inclusive [first, last] pairs, ascending.
const ZERO_WIDTH = [
    0x00AD, 0x00AD, 0x0300, 0x036F, 0x0483, 0x0489, 0x0591, 0x05BD, 0x05BF, 0x05BF, 0x05C1, 0x05C2,
    0x05C4, 0x05C5, 0x05C7, 0x05C7, 0x0600, 0x0605, 0x0610, 0x061A, 0x061C, 0x061C, 0x064B, 0x065F,
    0x0670, 0x0670, 0x06D6, 0x06DD, 0x06DF, 0x06E4, 0x06E7, 0x06E8, 0x06EA, 0x06ED, 0x070F, 0x070F,
    0x0711, 0x0711, 0x0730, 0x074A, 0x07A6, 0x07B0, 0x07EB, 0x07F3, 0x07FD, 0x07FD, 0x0816, 0x0819,
    0x081B, 0x0823, 0x0825, 0x0827, 0x0829, 0x082D, 0x0859, 0x085B, 0x0890, 0x0891, 0x0897, 0x089F,
    0x08CA, 0x0902, 0x093A, 0x093A, 0x093C, 0x093C, 0x0941, 0x0948, 0x094D, 0x094D, 0x0951, 0x0957,
    0x0962, 0x0963, 0x0981, 0x0981, 0x09BC, 0x09BC, 0x09C1, 0x09C4, 0x09CD, 0x09CD, 0x09E2, 0x09E3,
    0x09FE, 0x09FE, 0x0A01, 0x0A02, 0x0A3C, 0x0A3C, 0x0A41, 0x0A42, 0x0A47, 0x0A48, 0x0A4B, 0x0A4D,
    0x0A51, 0x0A51, 0x0A70, 0x0A71, 0x0A75, 0x0A75, 0x0A81, 0x0A82, 0x0ABC, 0x0ABC, 0x0AC1, 0x0AC5,
    0x0AC7, 0x0AC8, 0x0ACD, 0x0ACD, 0x0AE2, 0x0AE3, 0x0AFA, 0x0AFF, 0x0B01, 0x0B01, 0x0B3C, 0x0B3C,
    0x0B3F, 0x0B3F, 0x0B41, 0x0B44, 0x0B4D, 0x0B4D, 0x0B55, 0x0B56, 0x0B62, 0x0B63, 0x0B82, 0x0B82,
    0x0BC0, 0x0BC0, 0x0BCD, 0x0BCD, 0x0C00, 0x0C00, 0x0C04, 0x0C04, 0x0C3C, 0x0C3C, 0x0C3E, 0x0C40,
    0x0C46, 0x0C48, 0x0C4A, 0x0C4D, 0x0C55, 0x0C56, 0x0C62, 0x0C63, 0x0C81, 0x0C81, 0x0CBC, 0x0CBC,
    0x0CBF, 0x0CBF, 0x0CC6, 0x0CC6, 0x0CCC, 0x0CCD, 0x0CE2, 0x0CE3, 0x0D00, 0x0D01, 0x0D3B, 0x0D3C,
    0x0D41, 0x0D44, 0x0D4D, 0x0D4D, 0x0D62, 0x0D63, 0x0D81, 0x0D81, 0x0DCA, 0x0DCA, 0x0DD2, 0x0DD4,
    0x0DD6, 0x0DD6, 0x0E31, 0x0E31, 0x0E34, 0x0E3A, 0x0E47, 0x0E4E, 0x0EB1, 0x0EB1, 0x0EB4, 0x0EBC,
    0x0EC8, 0x0ECE, 0x0F18, 0x0F19, 0x0F35, 0x0F35, 0x0F37, 0x0F37, 0x0F39, 0x0F39, 0x0F71, 0x0F7E,
    0x0F80, 0x0F84, 0x0F86, 0x0F87, 0x0F8D, 0x0F97, 0x0F99, 0x0FBC, 0x0FC6, 0x0FC6, 0x102D, 0x1030,
    0x1032, 0x1037, 0x1039, 0x103A, 0x103D, 0x103E, 0x1058, 0x1059, 0x105E, 0x1060, 0x1071, 0x1074,
    0x1082, 0x1082, 0x1085, 0x1086, 0x108D, 0x108D, 0x109D, 0x109D, 0x1160, 0x11FF, 0x135D, 0x135F,
    0x1712, 0x1714, 0x1732, 0x1733, 0x1752, 0x1753, 0x1772, 0x1773, 0x17B4, 0x17B5, 0x17B7, 0x17BD,
    0x17C6, 0x17C6, 0x17C9, 0x17D3, 0x17DD, 0x17DD, 0x180B, 0x180F, 0x1885, 0x1886, 0x18A9, 0x18A9,
    0x1920, 0x1922, 0x1927, 0x1928, 0x1932, 0x1932, 0x1939, 0x193B, 0x1A17, 0x1A18, 0x1A1B, 0x1A1B,
    0x1A56, 0x1A56, 0x1A58, 0x1A5E, 0x1A60, 0x1A60, 0x1A62, 0x1A62, 0x1A65, 0x1A6C, 0x1A73, 0x1A7C,
    0x1A7F, 0x1A7F, 0x1AB0, 0x1ACE, 0x1B00, 0x1B03, 0x1B34, 0x1B34, 0x1B36, 0x1B3A, 0x1B3C, 0x1B3C,
    0x1B42, 0x1B42, 0x1B6B, 0x1B73, 0x1B80, 0x1B81, 0x1BA2, 0x1BA5, 0x1BA8, 0x1BA9, 0x1BAB, 0x1BAD,
    0x1BE6, 0x1BE6, 0x1BE8, 0x1BE9, 0x1BED, 0x1BED, 0x1BEF, 0x1BF1, 0x1C2C, 0x1C33, 0x1C36, 0x1C37,
    0x1CD0, 0x1CD2, 0x1CD4, 0x1CE0, 0x1CE2, 0x1CE8, 0x1CED, 0x1CED, 0x1CF4, 0x1CF4, 0x1CF8, 0x1CF9,
    0x1DC0, 0x1DFF, 0x200B, 0x200F, 0x202A, 0x202E, 0x2060, 0x2064, 0x2066, 0x206F, 0x20D0, 0x20F0,
    0x2CEF, 0x2CF1, 0x2D7F, 0x2D7F, 0x2DE0, 0x2DFF, 0x302A, 0x302D, 0x3099, 0x309A, 0xA66F, 0xA672,
    0xA674, 0xA67D, 0xA69E, 0xA69F, 0xA6F0, 0xA6F1, 0xA802, 0xA802, 0xA806, 0xA806, 0xA80B, 0xA80B,
    0xA825, 0xA826, 0xA82C, 0xA82C, 0xA8C4, 0xA8C5, 0xA8E0, 0xA8F1, 0xA8FF, 0xA8FF, 0xA926, 0xA92D,
    0xA947, 0xA951, 0xA980, 0xA982, 0xA9B3, 0xA9B3, 0xA9B6, 0xA9B9, 0xA9BC, 0xA9BD, 0xA9E5, 0xA9E5,
    0xAA29, 0xAA2E, 0xAA31, 0xAA32, 0xAA35, 0xAA36, 0xAA43, 0xAA43, 0xAA4C, 0xAA4C, 0xAA7C, 0xAA7C,
    0xAAB0, 0xAAB0, 0xAAB2, 0xAAB4, 0xAAB7, 0xAAB8, 0xAABE, 0xAABF, 0xAAC1, 0xAAC1, 0xAAEC, 0xAAED,
    0xAAF6, 0xAAF6, 0xABE5, 0xABE5, 0xABE8, 0xABE8, 0xABED, 0xABED, 0xD7B0, 0xD7FF, 0xFB1E, 0xFB1E,
    0xFE00, 0xFE0F, 0xFE20, 0xFE2F, 0xFEFF, 0xFEFF, 0xFFF9, 0xFFFB, 0x101FD, 0x101FD, 0x102E0, 0x102E0,
    0x10376, 0x1037A, 0x10A01, 0x10A03, 0x10A05, 0x10A06, 0x10A0C, 0x10A0F, 0x10A38, 0x10A3A, 0x10A3F, 0x10A3F,
    0x10AE5, 0x10AE6, 0x10D24, 0x10D27, 0x10D69, 0x10D6D, 0x10EAB, 0x10EAC, 0x10EFC, 0x10EFF, 0x10F46, 0x10F50,
    0x10F82, 0x10F85, 0x11001, 0x11001, 0x11038, 0x11046, 0x11070, 0x11070, 0x11073, 0x11074, 0x1107F, 0x11081,
    0x110B3, 0x110B6, 0x110B9, 0x110BA, 0x110BD, 0x110BD, 0x110C2, 0x110C2, 0x110CD, 0x110CD, 0x11100, 0x11102,
    0x11127, 0x1112B, 0x1112D, 0x11134, 0x11173, 0x11173, 0x11180, 0x11181, 0x111B6, 0x111BE, 0x111C9, 0x111CC,
    0x111CF, 0x111CF, 0x1122F, 0x11231, 0x11234, 0x11234, 0x11236, 0x11237, 0x1123E, 0x1123E, 0x11241, 0x11241,
    0x112DF, 0x112DF, 0x112E3, 0x112EA, 0x11300, 0x11301, 0x1133B, 0x1133C, 0x11340, 0x11340, 0x11366, 0x1136C,
    0x11370, 0x11374, 0x113BB, 0x113C0, 0x113CE, 0x113CE, 0x113D0, 0x113D0, 0x113D2, 0x113D2, 0x113E1, 0x113E2,
    0x11438, 0x1143F, 0x11442, 0x11444, 0x11446, 0x11446, 0x1145E, 0x1145E, 0x114B3, 0x114B8, 0x114BA, 0x114BA,
    0x114BF, 0x114C0, 0x114C2, 0x114C3, 0x115B2, 0x115B5, 0x115BC, 0x115BD, 0x115BF, 0x115C0, 0x115DC, 0x115DD,
    0x11633, 0x1163A, 0x1163D, 0x1163D, 0x1163F, 0x11640, 0x116AB, 0x116AB, 0x116AD, 0x116AD, 0x116B0, 0x116B5,
    0x116B7, 0x116B7, 0x1171D, 0x1171D, 0x1171F, 0x1171F, 0x11722, 0x11725, 0x11727, 0x1172B, 0x1182F, 0x11837,
    0x11839, 0x1183A, 0x1193B, 0x1193C, 0x1193E, 0x1193E, 0x11943, 0x11943, 0x119D4, 0x119D7, 0x119DA, 0x119DB,
    0x119E0, 0x119E0, 0x11A01, 0x11A0A, 0x11A33, 0x11A38, 0x11A3B, 0x11A3E, 0x11A47, 0x11A47, 0x11A51, 0x11A56,
    0x11A59, 0x11A5B, 0x11A8A, 0x11A96, 0x11A98, 0x11A99, 0x11C30, 0x11C36, 0x11C38, 0x11C3D, 0x11C3F, 0x11C3F,
    0x11C92, 0x11CA7, 0x11CAA, 0x11CB0, 0x11CB2, 0x11CB3, 0x11CB5, 0x11CB6, 0x11D31, 0x11D36, 0x11D3A, 0x11D3A,
    0x11D3C, 0x11D3D, 0x11D3F, 0x11D45, 0x11D47, 0x11D47, 0x11D90, 0x11D91, 0x11D95, 0x11D95, 0x11D97, 0x11D97,
    0x11EF3, 0x11EF4, 0x11F00, 0x11F01, 0x11F36, 0x11F3A, 0x11F40, 0x11F40, 0x11F42, 0x11F42, 0x11F5A, 0x11F5A,
    0x13430, 0x13440, 0x13447, 0x13455, 0x1611E, 0x16129, 0x1612D, 0x1612F, 0x16AF0, 0x16AF4, 0x16B30, 0x16B36,
    0x16F4F, 0x16F4F, 0x16F8F, 0x16F92, 0x16FE4, 0x16FE4, 0x1BC9D, 0x1BC9E, 0x1BCA0, 0x1BCA3, 0x1CF00, 0x1CF2D,
    0x1CF30, 0x1CF46, 0x1D167, 0x1D169, 0x1D173, 0x1D182, 0x1D185, 0x1D18B, 0x1D1AA, 0x1D1AD, 0x1D242, 0x1D244,
    0x1DA00, 0x1DA36, 0x1DA3B, 0x1DA6C, 0x1DA75, 0x1DA75, 0x1DA84, 0x1DA84, 0x1DA9B, 0x1DA9F, 0x1DAA1, 0x1DAAF,
    0x1E000, 0x1E006, 0x1E008, 0x1E018, 0x1E01B, 0x1E021, 0x1E023, 0x1E024, 0x1E026, 0x1E02A, 0x1E08F, 0x1E08F,
    0x1E130, 0x1E136, 0x1E2AE, 0x1E2AE, 0x1E2EC, 0x1E2EF, 0x1E4EC, 0x1E4EF, 0x1E5EE, 0x1E5EF, 0x1E8D0, 0x1E8D6,
    0x1E944, 0x1E94A, 0xE0001, 0xE0001, 0xE0020, 0xE007F, 0xE0100, 0xE01EF
];
const DOUBLE_WIDTH = [
    0x1100, 0x115F, 0x231A, 0x231B, 0x2329, 0x232A, 0x23E9, 0x23EC, 0x23F0, 0x23F0, 0x23F3, 0x23F3,
    0x25FD, 0x25FE, 0x2614, 0x2615, 0x2630, 0x2637, 0x2648, 0x2653, 0x267F, 0x267F, 0x268A, 0x268F,
    0x2693, 0x2693, 0x26A1, 0x26A1, 0x26AA, 0x26AB, 0x26BD, 0x26BE, 0x26C4, 0x26C5, 0x26CE, 0x26CE,
    0x26D4, 0x26D4, 0x26EA, 0x26EA, 0x26F2, 0x26F3, 0x26F5, 0x26F5, 0x26FA, 0x26FA, 0x26FD, 0x26FD,
    0x2705, 0x2705, 0x270A, 0x270B, 0x2728, 0x2728, 0x274C, 0x274C, 0x274E, 0x274E, 0x2753, 0x2755,
    0x2757, 0x2757, 0x2795, 0x2797, 0x27B0, 0x27B0, 0x27BF, 0x27BF, 0x2B1B, 0x2B1C, 0x2B50, 0x2B50,
    0x2B55, 0x2B55, 0x2E80, 0x2E99, 0x2E9B, 0x2EF3, 0x2F00, 0x2FD5, 0x2FF0, 0x3029, 0x302E, 0x303E,
    0x3041, 0x3096, 0x309B, 0x30FF, 0x3105, 0x312F, 0x3131, 0x318E, 0x3190, 0x31E5, 0x31EF, 0x321E,
    0x3220, 0x3247, 0x3250, 0xA48C, 0xA490, 0xA4C6, 0xA960, 0xA97C, 0xAC00, 0xD7A3, 0xF900, 0xFAFF,
    0xFE10, 0xFE19, 0xFE30, 0xFE52, 0xFE54, 0xFE66, 0xFE68, 0xFE6B, 0xFF01, 0xFF60, 0xFFE0, 0xFFE6,
    0x16FE0, 0x16FE3, 0x16FF0, 0x16FF1, 0x17000, 0x187F7, 0x18800, 0x18CD5, 0x18CFF, 0x18D08, 0x1AFF0, 0x1AFF3,
    0x1AFF5, 0x1AFFB, 0x1AFFD, 0x1AFFE, 0x1B000, 0x1B122, 0x1B132, 0x1B132, 0x1B150, 0x1B152, 0x1B155, 0x1B155,
    0x1B164, 0x1B167, 0x1B170, 0x1B2FB, 0x1D300, 0x1D356, 0x1D360, 0x1D376, 0x1F004, 0x1F004, 0x1F0CF, 0x1F0CF,
    0x1F18E, 0x1F18E, 0x1F191, 0x1F19A, 0x1F200, 0x1F202, 0x1F210, 0x1F23B, 0x1F240, 0x1F248, 0x1F250, 0x1F251,
    0x1F260, 0x1F265, 0x1F300, 0x1F320, 0x1F32D, 0x1F335, 0x1F337, 0x1F37C, 0x1F37E, 0x1F393, 0x1F3A0, 0x1F3CA,
    0x1F3CF, 0x1F3D3, 0x1F3E0, 0x1F3F0, 0x1F3F4, 0x1F3F4, 0x1F3F8, 0x1F43E, 0x1F440, 0x1F440, 0x1F442, 0x1F4FC,
    0x1F4FF, 0x1F53D, 0x1F54B, 0x1F54E, 0x1F550, 0x1F567, 0x1F57A, 0x1F57A, 0x1F595, 0x1F596, 0x1F5A4, 0x1F5A4,
    0x1F5FB, 0x1F64F, 0x1F680, 0x1F6C5, 0x1F6CC, 0x1F6CC, 0x1F6D0, 0x1F6D2, 0x1F6D5, 0x1F6D7, 0x1F6DC, 0x1F6DF,
    0x1F6EB, 0x1F6EC, 0x1F6F4, 0x1F6FC, 0x1F7E0, 0x1F7EB, 0x1F7F0, 0x1F7F0, 0x1F90C, 0x1F93A, 0x1F93C, 0x1F945,
    0x1F947, 0x1F9FF, 0x1FA70, 0x1FA7C, 0x1FA80, 0x1FA89, 0x1FA8F, 0x1FAC6, 0x1FACE, 0x1FADC, 0x1FADF, 0x1FAE9,
    0x1FAF0, 0x1FAF8, 0x20000, 0x2FFFD, 0x30000, 0x3FFFD
];

function inRanges(ranges, cp) {
    let lo = 0;
    let hi = ranges.length / 2 - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >>> 1;
        if (cp < ranges[2 * mid]) hi = mid - 1;
        else if (cp > ranges[2 * mid + 1]) lo = mid + 1;
        else return true;
    }
    return false;
}

function displayWidth(s) {
    let columns = 0;
    for (const ch of s) {
        const cp = ch.codePointAt(0);
        columns += inRanges(ZERO_WIDTH, cp) ? 0 : inRanges(DOUBLE_WIDTH, cp) ? 2 : 1;
    }
    return columns;
}

function countOf(n, noun) {
    return `${n} ${noun}${n === 1 ? '' : 's'}`;
}

// Spec v0.32.0: JSON has no form for Infinity, -Infinity or NaN. The first one in `value`, in the
// order JSON.stringify writes, as {path, number} — or null when there is none. The path starts at
// `name` and goes down one member at a time, 1-based (value.list.2); a key that is not a plain
// ASCII name is quoted as JSON writes a string (value."my key"). The number is as PRINT shows it.
const PLAIN_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;
export function firstNonFinite(value, name) {
    const members = [];   // filled on the way back, innermost first
    const find = (v) => {
        if (typeof v === 'number') return Number.isFinite(v) ? null : v;
        if (Array.isArray(v)) {
            for (let i = 0; i < v.length; i++) {
                const d = find(v[i]);
                if (d !== null) { members.push(String(i + 1)); return d; }
            }
        } else if (v !== null && typeof v === 'object') {
            for (const key of Object.keys(v)) {
                const d = find(v[key]);
                if (d !== null) { members.push(PLAIN_NAME.test(key) ? key : JSON.stringify(key)); return d; }
            }
        }
        return null;
    };
    const d = find(value);
    return d === null ? null : { path: [name, ...members.reverse()].join('.'), number: String(d) };
}

// Spec v0.35.0: JSON nested more than 1000 levels deep is invalid, as in the Java runtime, whose parser
// makes a call per level. JSON.parse has no such limit, so the text is scanned first; the position is
// the bracket that goes one level too deep, the same as the Java runtime's.
const JSON_MAX_DEPTH = 1000;
function jsonTooDeep(text) {
    let depth = 0;
    let inString = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inString) {
            if (c === '\\') i++;
            else if (c === '"') inString = false;
        } else if (c === '"') {
            inString = true;
        } else if (c === '[' || c === '{') {
            if (++depth > JSON_MAX_DEPTH) return i;
        } else if (c === ']' || c === '}') {
            depth--;
        }
    }
    return -1;
}

// JSON_PARSE's and READ_JSON_FILE's Result for `text`, as `fn` reports it: the value with JSON null as
// TEE_NULL (spec v0.8.0), or an error. A numeral too large to represent, which JSON.parse reads as
// Infinity, is an error naming the first one and where it is (spec v0.35.0) — it used to come through
// and fail only when written back as JSON.
function parseJson(text, fn) {
    const deep = jsonTooDeep(text);
    if (deep >= 0) return makeResult("error", false, `Invalid JSON: nested more than ${JSON_MAX_DEPTH} levels deep at position ${deep}`);
    let value;
    try {
        const convert = (v) => {
            if (v === null || v === undefined) return TEE_NULL;
            if (Array.isArray(v)) return v.map(convert);
            if (typeof v === 'object') {
                const result = {};
                for (const [k, val] of Object.entries(v)) result[k] = convert(val);
                return result;
            }
            return v;
        };
        value = convert(JSON.parse(text));
    } catch (e) {
        return makeResult("error", false, "Invalid JSON: " + e.message);
    }
    const big = firstNonFinite(value, 'value');   // JSON has no NaN to read
    if (big) return makeResult("error", false, `${fn}() ${big.path} is a number too large to represent`);
    return makeResult("done", true, value);
}

// JSON_FORMAT's text of `value` for `fn`, which calls it `name` ("value", "body"): TEE_NULL as JSON
// null, and a number JSON cannot hold a runtime error naming the first (spec v0.32.0), where
// JSON.stringify would write null.
function teeJson(value, fn, name) {
    const found = firstNonFinite(value, name);
    if (found) throw new Error(`Runtime Error: ${fn}() ${found.path} is ${found.number}, which JSON cannot represent`);
    return JSON.stringify(value === TEE_NULL ? null : value, (k, v) => v === TEE_NULL ? null : v);
}

// Spec v0.25.0: the only text TO_NUMBER reads — an optional sign, ASCII digits with an optional
// fraction (".5" and "5." included), an optional exponent. Number() alone would also read
// "0x10", "0o17", "0b101" and "Infinity" (and "" as 0), which the Java runtime rejects.
const DECIMAL_NUMERAL = /^[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/;

// Spec v0.29.0: a regex pattern is read by RegExp without flags — no `u`, so a character outside
// the BMP counts as two characters, as LANGUAGE.md documents. An invalid pattern is named in the
// message, as the reference runtime names it.
function compileRegex(fn, pattern, flags) {
    try {
        return new RegExp(pattern, flags);
    } catch (e) {
        throw new Error(`Runtime Error: ${fn}() invalid regex pattern: ${pattern}`);
    }
}

// A regex match as {match, position, groups, named} (spec v0.29.0): position is 1-based (UTF-16
// units, like FIND), groups.N is group N, named lists the named groups in pattern order; a group
// that took no part in the match is {}.
function matchObject(match) {
    const value = (v) => (v === undefined ? {} : v);
    const named = {};
    // match.groups has no prototype; its keys are the group names in pattern order.
    if (match.groups) for (const name of Object.keys(match.groups)) named[name] = value(match.groups[name]);
    return { match: match[0], position: match.index + 1, groups: match.slice(1).map(value), named };
}

// Interpreter-dispatched names cannot be replaced by host registrations (spec v0.13.0; PRINTF
// since v0.30.0).
const INTERPRETER_DISPATCHED = new Set(['PRINT', 'PRINTF', 'SLEEP', 'FAIL', 'UNWRAP']);
function requireReplaceableName(name) {
    if (INTERPRETER_DISPATCHED.has(name)) {
        throw new Error(`Cannot register an external function named '${name}': ` +
            'interpreter-dispatched names (PRINT, PRINTF, SLEEP, FAIL, UNWRAP) cannot be replaced');
    }
    return name;
}

// Nearest known name within edit distance 2, for "did you mean" suggestions (null if none).
// Smallest distance wins; ties resolve alphabetically for deterministic output.
function nearestName(name, candidates) {
    let best = null;
    let bestDist = 3;
    for (const c of candidates) {
        const d = editDistance(name, c);
        if (d < bestDist || (d === bestDist && best !== null && c < best)) {
            best = c;
            bestDist = d;
        }
    }
    return best;
}

function editDistance(a, b) {
    const m = a.length, n = b.length;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
        const cur = [i];
        for (let j = 1; j <= n; j++) {
            cur[j] = a[i - 1] === b[j - 1]
                ? prev[j - 1]
                : 1 + Math.min(prev[j - 1], prev[j], cur[j - 1]);
        }
        prev = cur;
    }
    return prev[n];
}

export default class ProperTeeCustomVisitor extends ProperTeeVisitor {
    constructor(builtInProperties = {}, builtInFunctions = {}, ioStreams = {}, options = {}) {
        super();
        this.variables = {};
        this.userDefinedFunctions = Object.create(null);
        this.moduleAliases = Object.create(null);
        this.modulesByIdentity = Object.create(null);
        this.currentModule = null;
        this.scopeStack = [];
        this.hasExplicitReturn = false;   // set by visitRoot (see scriptResult)
        this.returnValue = {};

        // Threading context flags (used by main thread when no scheduler)
        this.inMultiContext = false;
        this.multiResultVars = new Map();
        this.inMonitorContext = false;
        this.inThreadContext = false;
        this.currentFunctionContext = null;

        // SPAWN collection (used during multi block setup)
        this._inMultiSetup = false;
        this._collectedSpawns = null;

        // Active thread context (set by scheduler)
        this.activeThread = null;
        // Whether the run was asked to stop (set by the scheduler): an error after the stop is
        // the stop's, as in the reference runtime (spec v0.37.0)
        this.stopRequested = () => false;

        // Host environment restrictions
        this.hiddenKeywords = new Set();
        this.ignoredFunctions = new Set();

        // Reserved `_PROPS`: the full input set exposed as one object, so a script can print, iterate,
        // or pass along ALL inputs at once (PRINT(_PROPS), JSON_FORMAT(_PROPS), KEYS(_PROPS), _PROPS.a ...)
        // while each key also stays directly accessible as a bare variable (a, b, ...). The visitor keeps
        // its own props view so the caller's object is never mutated, and `_PROPS` holds a (shallow)
        // snapshot that does not contain itself (so JSON_FORMAT(_PROPS) cannot recurse). A caller-supplied
        // `_PROPS` key is left as-is.
        if (builtInProperties && Object.prototype.hasOwnProperty.call(builtInProperties, '_PROPS')) {
            this.properties = builtInProperties;
        } else {
            const incoming = builtInProperties || {};
            this.properties = { ...incoming, _PROPS: { ...incoming } };
        }

        // Reserved `_ARGS` (spec v0.20.0): the positional invocation arguments as a string array.
        // Always present — the empty array when none (never absent); a caller-supplied `_ARGS`
        // property wins, the same precedence rule as `_PROPS`. Deliberately NOT part of _PROPS,
        // so the iterate/dump patterns above stay pure.
        // Spec v0.36.0: numbers are finite, so a property holding Infinity or NaN is refused.
        for (const [key, value] of Object.entries(this.properties)) {
            const nonFinite = hostNonFinite(value, key);
            if (nonFinite) throw new Error(`Runtime Error: ${nonFinite}`);
        }

        this._argsFromProps = Object.prototype.hasOwnProperty.call(this.properties, '_ARGS');
        if (!this._argsFromProps) {
            this.properties = { ...this.properties, _ARGS: [] };
        }

        this.stdin = ioStreams.stdin || null;
        this.stdout = ioStreams.stdout || ((...args) => console.log(...args));
        this.stderr = ioStreams.stderr || ((...args) => console.error(...args));

        this.maxIterations = options.maxIterations || 1000;
        this.iterationLimitBehavior = options.iterationLimitBehavior || 'error';
        this.moduleResolver = options.moduleResolver || null;
        this.sourceId = options.sourceId || '<memory>';

        // Deep-copy helper for value semantics at sharing boundaries
        this.deepCopy = (value) => {
            if (value === null || value === undefined || typeof value !== 'object') return value;
            if (Array.isArray(value)) return value.map(item => this.deepCopy(item));
            const copy = {};
            for (const key of Object.keys(value)) copy[key] = this.deepCopy(value[key]);
            // A genuine Result stays genuine across copies (spec v0.10.0 — origin propagation;
            // Object.keys skips symbol keys, so carry the brand explicitly).
            if (value[TEE_RESULT] === true) copy[TEE_RESULT] = true;
            return copy;
        };

        // JSON.stringify that serializes TEE_NULL as JSON null (a bare Symbol would be
        // dropped from objects / already-null in arrays — the replacer makes it uniform)
        const teeJsonStringify = (value) =>
            JSON.stringify(value === TEE_NULL ? null : value, (k, v) => v === TEE_NULL ? null : v);

        // Format a value for display inside collections (strings get single quotes)
        const formatJsonValue = (value) => {
            if (value === TEE_NULL) return 'null';
            if (value === null || value === undefined) return 'null';
            if (typeof value === 'string') return "'" + value + "'";
            if (typeof value === 'boolean') return String(value);
            if (typeof value === 'number') {
                if (Number.isInteger(value)) return String(value);
                return String(value);
            }
            if (Array.isArray(value)) return formatDisplayValue(value);
            if (typeof value === 'object') return formatDisplayValue(value);
            return String(value);
        };

        // Format a value for PRINT output (matching Java TypeChecker.formatValue)
        const formatDisplayValue = (value) => {
            if (value === TEE_NULL) return 'null';
            if (value === null || value === undefined) return 'null';
            if (typeof value === 'boolean') return String(value);
            if (typeof value === 'number') {
                if (Number.isInteger(value)) return String(value);
                return String(value);
            }
            if (typeof value === 'string') return value;
            if (Array.isArray(value)) {
                if (value.length === 0) return '[]';
                return '[ ' + value.map(v => formatJsonValue(v)).join(', ') + ' ]';
            }
            if (typeof value === 'object') {
                const keys = Object.keys(value);
                if (keys.length === 0) return '{}';
                return '{ ' + keys.map(k => '"' + k + '": ' + formatJsonValue(value[k])).join(', ') + ' }';
            }
            return String(value);
        };

        const validateHomogeneous = (arr, funcName) => {
            const allNumbers = arr.every(x => typeof x === 'number');
            const allStrings = arr.every(x => typeof x === 'string');
            if (!allNumbers && !allStrings) {
                throw new Error(`Runtime Error: ${funcName}() requires all elements to be the same type (number or string)`);
            }
        };

        const validateKeyExists = (arr, key, funcName) => {
            for (let i = 0; i < arr.length; i++) {
                if (typeof arr[i] !== 'object' || arr[i] === null || Array.isArray(arr[i])) {
                    throw new Error(`Runtime Error: ${funcName}() requires an array of objects`);
                }
                if (!hasOwnKey(arr[i], key)) {
                    throw new Error(`Runtime Error: Property '${key}' does not exist in array element at index ${i + 1}`);
                }
            }
        };

        const compareValues = (a, b) => {
            if (typeof a === 'number' && typeof b === 'number') return a - b;
            return String(a).localeCompare(String(b));
        };

        // FORMAT(format, values...) and PRINTF's text (spec v0.30.0): each {} or {pattern} takes
        // the next value; {{ and }} are literal braces. The format is checked whole before any
        // value is used: an invalid format, then a count mismatch, then a value that is not a
        // number under a pattern. {} is the value as PRINT shows it; {pattern} is a number written
        // as the number pattern draws it (spec v0.31.0) — see shapeNumber.
        const formatText = (fn, args) => {
            if (args.length < 1) throw new Error(`Runtime Error: ${fn}() missing argument 1`);
            if (typeof args[0] !== 'string') throw new Error(`Runtime Error: ${fn}() requires a string format`);
            const parts = parseFormat(fn, args[0]);
            const placeholders = parts.filter(part => typeof part !== 'string').length;
            if (placeholders !== args.length - 1) {
                throw new Error(`Runtime Error: ${fn}() format has ${countOf(placeholders, 'placeholder')}, got ${countOf(args.length - 1, 'value')}`);
            }
            let next = 1;
            return parts.map(part => typeof part === 'string' ? part : formatValue(fn, part, args[next++])).join('');
        };
        const formatValue = (fn, p, v) => {
            if (p.pattern === null) return formatDisplayValue(v);
            if (typeof v !== 'number') {
                throw new Error(`Runtime Error: ${fn}() ${p.text} requires a number, got ${this._valueTypeName(v)}`);
            }
            return shapeNumber(v, p.pattern);
        };
        // ALIGN_LEFT/ALIGN_RIGHT/ALIGN_CENTER(value, width) (spec v0.31.0): the value as PRINT shows
        // it, padded with spaces to `width` columns — a Hangul syllable or another wide character
        // takes two (displayWidth). Longer text is not cut, and centering puts an odd space on the
        // right. A third argument is an error, so a fill character can be added later.
        const align = (fn, args) => {
            if (args.length > 2) throw new Error(`Runtime Error: ${fn}() takes at most 2 arguments`);
            if (args.length < 1) throw new Error(`Runtime Error: ${fn}() missing argument 1`);
            const text = formatDisplayValue(args[0]);
            if (args.length < 2) throw new Error(`Runtime Error: ${fn}() missing argument 2`);
            const width = args[1];
            if (!isWholeNumber(width) || width < 0 || width > 999) {
                throw new Error(`Runtime Error: ${fn}() width must be an integer from 0 to 999`);
            }
            const fill = width - displayWidth(text);
            if (fill <= 0) return text;
            if (fn === 'ALIGN_LEFT') return text + ' '.repeat(fill);
            if (fn === 'ALIGN_RIGHT') return ' '.repeat(fill) + text;
            return ' '.repeat(Math.floor(fill / 2)) + text + ' '.repeat(fill - Math.floor(fill / 2));
        };

        const defaultFunctions = {
            'PRINT': (...args) => { this.stdout(...args.map(a => formatDisplayValue(a))); return {}; },
            // PRINTF(format, values...) is one line: PRINT(FORMAT(format, values...)) (spec v0.30.0).
            'PRINTF': (...args) => { this.stdout(formatText('PRINTF', args)); return {}; },
            'FORMAT': (...args) => formatText('FORMAT', args),
            // TEXT(n, pattern) (spec v0.31.0): one number written as the pattern draws it — what
            // {pattern} writes in a format; like a format, the pattern is checked before the value.
            'TEXT': (...args) => {
                if (args.length > 2) throw new Error('Runtime Error: TEXT() takes at most 2 arguments');
                if (args.length < 1) throw new Error('Runtime Error: TEXT() missing argument 1');
                if (args.length < 2) throw new Error('Runtime Error: TEXT() missing argument 2');
                const [n, text] = args;
                if (typeof text !== 'string') throw new Error('Runtime Error: TEXT() requires a string pattern');
                const pattern = parseNumberPattern(text);
                if (pattern === null) throw new Error(`Runtime Error: TEXT() invalid pattern: '${text}'`);
                if (typeof n !== 'number') throw new Error(`Runtime Error: TEXT() requires a number, got ${this._valueTypeName(n)}`);
                return shapeNumber(n, pattern);
            },
            'ALIGN_LEFT': (...args) => align('ALIGN_LEFT', args),
            'ALIGN_RIGHT': (...args) => align('ALIGN_RIGHT', args),
            'ALIGN_CENTER': (...args) => align('ALIGN_CENTER', args),
            // The math built-ins check their arguments like the reference runtime (spec v0.30.0).
            'SUM': (...args) => {
                const numbers = mathNumbers('SUM', args);
                if (numbers.every(a => this._isIntValue(a))) {
                    // Spec v0.33.0: integers add in order, like +, and a running total outside the
                    // range is the overflow (spec v0.14.0) — so every total is exact.
                    let total = 0;
                    for (const a of numbers) {
                        total += a;
                        if (!Number.isSafeInteger(total)) throw new Error(`Runtime Error: ${INTEGER_OVERFLOW}`);
                    }
                    return total;
                }
                return finiteResult(numbers.reduce((a, b) => a + b, 0));   // too large is an error (spec v0.36.0)
            },
            'MAX': (...args) => minMax('MAX', args, true),
            'MIN': (...args) => minMax('MIN', args, false),
            // FLOOR/CEIL/ROUND/TRUNC without digits produce an integer; a result outside the integer
            // range is a loud error, never a silent promotion (spec v0.13.0, v0.33.0). The range is
            // symmetric, so ABS cannot overflow. With digits they produce a decimal (spec v0.30.0) —
            // see rounding().
            'ABS': (...args) => {
                if (args.length < 1) throw new Error('Runtime Error: ABS() missing argument 1');
                const n = args[0];
                if (typeof n !== 'number') throw new Error('Runtime Error: ABS() requires numeric arguments');
                return Math.abs(n);
            },
            'FLOOR': (...args) => rounding('FLOOR', args, 'FLOOR'),
            'CEIL': (...args) => rounding('CEIL', args, 'CEILING'),
            'ROUND': (...args) => rounding('ROUND', args, 'HALF_UP'),
            'TRUNC': (...args) => rounding('TRUNC', args, 'DOWN'),
            'LEN': (a) => {
                if (Array.isArray(a)) return a.length;
                if (typeof a === 'string') return a.length;
                if (typeof a === 'object' && a !== null) return Object.keys(a).length;
                // spec v0.7.0 (#7): non-collections are an error (was a silent 0)
                throw new Error('Runtime Error: LEN() requires a string, array, or object argument');
            },
            'TO_NUMBER': (str) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: TO_NUMBER() requires a string argument');
                const text = this._trimWhitespace(str);
                if (!DECIMAL_NUMERAL.test(text)) throw new Error(`Runtime Error: TO_NUMBER() cannot convert '${str}' to number`);
                const num = Number(text);
                if (!Number.isFinite(num)) throw new Error(`Runtime Error: TO_NUMBER() value out of range: '${str}'`);
                return num;
            },
            'TO_STRING': (value) => {
                if (value === TEE_NULL) return 'null';
                if (typeof value === 'boolean') return value ? 'true' : 'false';
                if (typeof value === 'number') return String(value);
                if (typeof value === 'string') return value;
                if (Array.isArray(value)) return teeJsonStringify(value);
                if (typeof value === 'object' && value !== null) return teeJsonStringify(value);
                return String(value);
            },
            'SLEEP': (milliseconds) => {
                if (typeof milliseconds !== 'number') throw new Error('Runtime Error: SLEEP() requires a number argument');
                if (milliseconds < 0) throw new Error('Runtime Error: SLEEP() duration cannot be negative');
                // Returns a scheduler command instead of a Promise
                return { __schedulerCommand: true, type: 'SLEEP', duration: milliseconds };
            },
            // Spec v0.10.0: genuine-Result constructors + observer. (FAIL/UNWRAP live in
            // visitFunctionCall so their errors carry the call site's line:col.)
            'OK': (value) => makeResult("done", true, value === undefined ? {} : value),
            'ERR': (value) => makeResult("error", false, value === undefined ? {} : value),
            'IS_RESULT': (value) => isGenuineResult(value),
            'PUSH': (arr, ...values) => {
                if (!Array.isArray(arr)) throw new Error('Runtime Error: PUSH() first argument must be an array');
                return [...arr, ...values];
            },
            'POP': (arr) => {
                if (!Array.isArray(arr)) throw new Error('Runtime Error: POP() argument must be an array');
                if (arr.length === 0) throw new Error('Runtime Error: POP() cannot pop from empty array');
                return arr.slice(0, -1);
            },
            'CONCAT': (...arrays) => {
                for (const arr of arrays) {
                    if (!Array.isArray(arr)) throw new Error('Runtime Error: CONCAT() all arguments must be arrays');
                }
                return arrays.reduce((acc, arr) => [...acc, ...arr], []);
            },
            'SLICE': (arr, start, count) => {
                if (arr === undefined) throw new Error('Runtime Error: SLICE() missing argument 1');
                if (!Array.isArray(arr)) throw new Error('Runtime Error: SLICE() requires an array argument');
                // spec v0.7.0 (#6): 3rd arg is a COUNT, like SUBSTRING and READ_LINES (was an end bound)
                const [from, to] = span('SLICE', start, 'count', count, arr.length);
                return arr.slice(from, to);
            },
            'CHARS': (str) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: CHARS() requires a string argument');
                return Array.from(str);
            },
            // SPLIT keeps every field — leading, interior and trailing empties — so JOIN(SPLIT(s, d), d)
            // == s; the delimiter is literal and, since spec v0.24.0, non-empty (CHARS splits characters).
            'SPLIT': (str, delimiter) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: SPLIT() first argument must be a string');
                if (typeof delimiter !== 'string') throw new Error('Runtime Error: SPLIT() second argument must be a string');
                if (delimiter === '') throw new Error('Runtime Error: SPLIT() requires a non-empty delimiter');
                return str.split(delimiter);
            },
            // WORDS (spec v0.24.0): the maximal runs of non-whitespace, in order — never an empty string.
            'WORDS': (str) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: WORDS() requires a string argument');
                const out = [];
                let i = 0;
                while (i < str.length) {
                    while (i < str.length && this._isWhitespace(str.charCodeAt(i))) i++;
                    const start = i;
                    while (i < str.length && !this._isWhitespace(str.charCodeAt(i))) i++;
                    if (i > start) out.push(str.slice(start, i));
                }
                return out;
            },
            'JOIN': (arr, separator = '') => {
                if (!Array.isArray(arr)) throw new Error('Runtime Error: JOIN() first argument must be an array');
                if (typeof separator !== 'string') throw new Error('Runtime Error: JOIN() second argument must be a string');
                return arr.join(separator);
            },
            'SUBSTRING': (str, start, length) => {
                if (str === undefined) throw new Error('Runtime Error: SUBSTRING() missing argument 1');
                if (typeof str !== 'string') throw new Error('Runtime Error: SUBSTRING() requires a string argument');
                const [from, to] = span('SUBSTRING', start, 'length', length, str.length);
                return str.substring(from, to);
            },
            'UPPERCASE': (str) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: UPPERCASE() requires a string argument');
                return str.toUpperCase();
            },
            'LOWERCASE': (str) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: LOWERCASE() requires a string argument');
                return str.toLowerCase();
            },
            'TRIM': (str) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: TRIM() requires a string argument');
                return this._trimWhitespace(str);
            },
            'HAS_KEY': (obj, key) => {
                if (typeof obj !== 'object' || obj === null || Array.isArray(obj))
                    throw new Error('Runtime Error: HAS_KEY() first argument must be an object');
                if (typeof key !== 'string')
                    throw new Error('Runtime Error: HAS_KEY() second argument must be a string');
                return hasOwnKey(obj, key);
            },
            'KEYS': (obj) => {
                if (typeof obj !== 'object' || obj === null || Array.isArray(obj))
                    throw new Error('Runtime Error: KEYS() argument must be an object');
                return Object.keys(obj);
            },
            'SORT': (arr) => {
                if (!Array.isArray(arr))
                    throw new Error('Runtime Error: SORT() requires an array argument');
                const result = [...arr];
                if (result.length <= 1) return result;
                validateHomogeneous(result, 'SORT');
                result.sort((a, b) => compareValues(a, b));
                return result;
            },
            'SORT_DESC': (arr) => {
                if (!Array.isArray(arr))
                    throw new Error('Runtime Error: SORT_DESC() requires an array argument');
                const result = [...arr];
                if (result.length <= 1) return result;
                validateHomogeneous(result, 'SORT_DESC');
                result.sort((a, b) => compareValues(b, a));
                return result;
            },
            'SORT_BY': (arr, key) => {
                if (!Array.isArray(arr))
                    throw new Error('Runtime Error: SORT_BY() requires an array argument');
                if (typeof key !== 'string')
                    throw new Error('Runtime Error: SORT_BY() second argument must be a string key');
                const result = [...arr];
                if (result.length <= 1) return result;
                validateKeyExists(result, key, 'SORT_BY');
                result.sort((a, b) => compareValues(a[key], b[key]));
                return result;
            },
            'SORT_BY_DESC': (arr, key) => {
                if (!Array.isArray(arr))
                    throw new Error('Runtime Error: SORT_BY_DESC() requires an array argument');
                if (typeof key !== 'string')
                    throw new Error('Runtime Error: SORT_BY_DESC() second argument must be a string key');
                const result = [...arr];
                if (result.length <= 1) return result;
                validateKeyExists(result, key, 'SORT_BY_DESC');
                result.sort((a, b) => compareValues(b[key], a[key]));
                return result;
            },
            'REVERSE': (arr) => {
                if (!Array.isArray(arr))
                    throw new Error('Runtime Error: REVERSE() requires an array argument');
                return [...arr].reverse();
            },
            'RANDOM': (...args) => {
                if (args.length === 0) {
                    return Math.random();
                } else if (args.length === 1) {
                    // spec v0.7.0 (#5): the single-argument form was removed
                    throw new Error('Runtime Error: RANDOM() requires zero or two arguments');
                } else {
                    if (typeof args[0] !== 'number' || typeof args[1] !== 'number')
                        throw new Error('Runtime Error: RANDOM() requires numeric arguments');
                    const min = args[0];
                    const max = args[1];
                    // Spec v0.33.0: the bounds are integers in the range (a fraction used to give a
                    // decimal result here).
                    if (!(Number.isSafeInteger(min) && Number.isSafeInteger(max))) {
                        throw new Error('Runtime Error: RANDOM() bounds must be integers within ±9,007,199,254,740,991');
                    }
                    if (min > max) throw new Error('Runtime Error: RANDOM() min cannot be greater than max');
                    return randomInteger(min, max);
                }
            },
            // --- String matching ---
            'CONTAINS': (x, item) => {
                if (Array.isArray(x)) return x.some(e => this._deepEqual(e, item));   // array membership: deep ==, spec v0.15.0
                if (typeof x === 'string') {
                    if (typeof item !== 'string') throw new Error('Runtime Error: CONTAINS() second argument must be a string');
                    return x.includes(item);
                }
                throw new Error('Runtime Error: CONTAINS() requires a string or array as its first argument');
            },
            'STARTS_WITH': (str, prefix) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: STARTS_WITH() first argument must be a string');
                if (typeof prefix !== 'string') throw new Error('Runtime Error: STARTS_WITH() second argument must be a string');
                return str.startsWith(prefix);
            },
            'ENDS_WITH': (str, suffix) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: ENDS_WITH() first argument must be a string');
                if (typeof suffix !== 'string') throw new Error('Runtime Error: ENDS_WITH() second argument must be a string');
                return str.endsWith(suffix);
            },
            // FIND family (spec v0.17.0) — literal search, 1-based positions. FIND returns ALL
            // start positions ascending, overlapping included (advance by 1), so FIND_FIRST /
            // FIND_LAST are always its first/last element. Not found -> [] / 0; empty search
            // strings are rejected (every boundary would "match").
            'FIND': (str, sub) => {
                this._checkFindArgs('FIND', str, sub);
                const out = [];
                for (let i = str.indexOf(sub); i >= 0; i = str.indexOf(sub, i + 1)) out.push(i + 1);
                return out;
            },
            'FIND_FIRST': (str, sub) => {
                this._checkFindArgs('FIND_FIRST', str, sub);
                return str.indexOf(sub) + 1;
            },
            'FIND_LAST': (str, sub) => {
                this._checkFindArgs('FIND_LAST', str, sub);
                return str.lastIndexOf(sub) + 1;
            },
            'MATCHES': (str, pattern) => {
                if (typeof str !== 'string' || typeof pattern !== 'string')
                    throw new Error('Runtime Error: MATCHES() requires a string argument');
                return compileRegex('MATCHES', pattern).test(str);
            },
            'REGEX_FIND': (str, pattern) => {
                if (typeof str !== 'string' || typeof pattern !== 'string')
                    throw new Error('Runtime Error: REGEX_FIND() requires a string argument');
                const match = compileRegex('REGEX_FIND', pattern).exec(str);
                return match ? matchObject(match) : {};
            },
            // matchAll resumes where the last match ended (one further after an empty match), so
            // matches never overlap — as the reference's repeated Matcher.find() (spec v0.29.0).
            'REGEX_FIND_ALL': (str, pattern) => {
                if (typeof str !== 'string' || typeof pattern !== 'string')
                    throw new Error('Runtime Error: REGEX_FIND_ALL() requires a string argument');
                return [...str.matchAll(compileRegex('REGEX_FIND_ALL', pattern, 'g'))].map(matchObject);
            },
            'REPLACE': (str, target, replacement) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: REPLACE() first argument must be a string');
                if (typeof target !== 'string') throw new Error('Runtime Error: REPLACE() second argument must be a string');
                if (typeof replacement !== 'string') throw new Error('Runtime Error: REPLACE() third argument must be a string');
                return str.split(target).join(replacement);
            },
            // --- Map extensions ---
            'VALUES': (obj) => {
                if (typeof obj !== 'object' || obj === null || Array.isArray(obj))
                    throw new Error('Runtime Error: VALUES() argument must be an object');
                return Object.values(obj);
            },
            'ENTRIES': (obj) => {
                if (typeof obj !== 'object' || obj === null || Array.isArray(obj))
                    throw new Error('Runtime Error: ENTRIES() argument must be an object');
                return Object.entries(obj).map(([key, value]) => ({ key, value }));
            },
            'MERGE': (obj1, obj2) => {
                if (typeof obj1 !== 'object' || obj1 === null || Array.isArray(obj1))
                    throw new Error('Runtime Error: MERGE() first argument must be an object');
                if (typeof obj2 !== 'object' || obj2 === null || Array.isArray(obj2))
                    throw new Error('Runtime Error: MERGE() second argument must be an object');
                return { ...obj1, ...obj2 };
            },
            'REMOVE_KEY': (obj, key) => {
                if (typeof obj !== 'object' || obj === null || Array.isArray(obj))
                    throw new Error('Runtime Error: REMOVE_KEY() first argument must be an object');
                if (typeof key !== 'string')
                    throw new Error('Runtime Error: REMOVE_KEY() second argument must be a string');
                const result = { ...obj };
                delete result[key];
                return result;
            },
            // --- Type ---
            'TYPE_OF': (value) => {
                if (value === TEE_NULL) return 'null';   // spec v0.8.0 (#4)
                if (typeof value === 'boolean') return 'boolean';
                if (typeof value === 'number') return 'number';
                if (typeof value === 'string') return 'string';
                if (Array.isArray(value)) return 'array';
                if (typeof value === 'object' && value !== null) return 'object';
                return 'object';
            },
            // --- JSON ---
            'JSON_PARSE': (str) => {
                if (typeof str !== 'string')
                    return makeResult("error", false, "JSON_PARSE() requires a string argument");
                return parseJson(str, 'JSON_PARSE');
            },
            'JSON_FORMAT': (value) => {
                return teeJson(value, 'JSON_FORMAT', 'value');
            },
            'MILTIME': () => {
                return Date.now();
            },
            'DATE': () => {
                return new Date().toISOString().slice(0, 10);
            },
            'TIME': () => {
                return new Date().toTimeString().slice(0, 8);
            }
        };

        this.functions = { ...defaultFunctions, ...builtInFunctions };

        // The stubs below throw: an external's throw is its error Result (spec v0.37.0).

        // SHELL_CTX — stub (no process execution in JS runtime)
        this.registerExternal('SHELL_CTX', (...args) => {
            throw new Error("SHELL_CTX() is not available in this environment");
        });

        // SHELL — stub (no process execution in JS runtime)
        this.registerExternalAsync('SHELL', (...args) => {
            throw new Error("SHELL() is not available in this environment");
        });

        // ENV — stub (no OS environment access in JS runtime)
        this.registerExternal('ENV', (...args) => {
            throw new Error("ENV() is not available in this environment");
        });

        // File I/O — stubs (no filesystem access in JS runtime)
        const fileStub = (name) => (...args) => {
            throw new Error(name + "() is not available in this environment");
        };
        for (const name of ['FILE_EXISTS', 'FILE_INFO', 'READ_FILE', 'READ_LINES', 'READ_JSON_FILE', 'WRITE_FILE', 'WRITE_JSON_FILE', 'WRITE_LINES', 'APPEND_FILE', 'MKDIR', 'LIST_DIR', 'LIST_DIR_NAMES', 'DELETE_FILE']) {
            this.registerExternal(name, fileStub(name));
        }

        // FILE_LINES (spec v0.26.0) is not a Result-returning builtin — a file it cannot read is a
        // runtime error — so its stub raises one too. A host that has files installs the real array
        // here as a builtin (not through registerExternal, whose throws become Result errors), as
        // the playground does over its virtual files.
        this.functions['FILE_LINES'] = () => {
            throw new Error('Runtime Error: FILE_LINES() is not available in this environment');
        };

        // HTTP — stubs (no network access in the JS runtime; a host or the playground provides it)
        for (const name of ['HTTP', 'HTTP_GET', 'HTTP_POST']) {
            this.registerExternal(name, fileStub(name));
        }
    }

    // --- Helper methods (non-generators) ---

    // Shared argument check for the FIND family (spec v0.17.0)
    _checkFindArgs(fn, str, sub) {
        if (typeof str !== 'string') throw new Error('Runtime Error: ' + fn + '() first argument must be a string');
        if (typeof sub !== 'string') throw new Error('Runtime Error: ' + fn + '() second argument must be a string');
        if (sub === '') throw new Error('Runtime Error: ' + fn + '() requires a non-empty search string');
    }

    // Spec v0.24.0 whitespace (TRIM, WORDS, and around a TO_NUMBER numeral since v0.25.0): exactly
    // space, \t, \n, VT, \f, \r. String.prototype.trim() would also strip U+00A0, the other Unicode
    // spaces and the BOM — characters the Java runtime keeps.
    _isWhitespace(code) {
        return code === 32 || (code >= 9 && code <= 13);
    }

    _trimWhitespace(str) {
        let from = 0, to = str.length;
        while (from < to && this._isWhitespace(str.charCodeAt(from))) from++;
        while (to > from && this._isWhitespace(str.charCodeAt(to - 1))) to--;
        return str.slice(from, to);
    }

    // Deep equality for objects and arrays (language-level == comparison)
    _deepEqual(a, b) {
        if (a === b) return true;
        if (a === null || b === null) return false;
        if (typeof a !== typeof b) return false;
        if (typeof a !== 'object') return false;

        const aIsArray = Array.isArray(a);
        const bIsArray = Array.isArray(b);
        if (aIsArray !== bIsArray) return false;

        if (aIsArray) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (!this._deepEqual(a[i], b[i])) return false;
            }
            return true;
        }

        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) return false;
        for (const key of aKeys) {
            if (!hasOwnKey(b, key) || !this._deepEqual(a[key], b[key])) return false;
        }
        return true;
    }

    // Register an external built-in function with automatic error wrapping.
    // The function can return Result.ok(value) or Result.error(msg) explicitly,
    // or throw an exception which is automatically caught and wrapped as
    // {ok: false, value: "error message"}.
    // The call gives a Result, as in the reference runtime (spec v0.37.0): what the host returns
    // is the value of an ok Result, a Result included, and what it throws an error Result. The
    // value is copied, so a host that keeps it cannot change the script's.
    registerExternal(name, func) {
        requireReplaceableName(name);   // host-API error for PRINT/PRINTF/SLEEP/FAIL/UNWRAP (spec v0.13.0)
        this.functions[name] = (...args) => {
            const shellThread = name === 'SHELL' ? this.activeThread : null;
            if (shellThread) this._startShellObservation(shellThread);
            let result;
            try {
                result = externalResult(name, this.deepCopy(func(...args)));   // no Infinity or NaN (spec v0.36.0)
            } catch (e) {
                result = makeResult('error', false, e.message);
            }
            if (shellThread) this._completeShellObservation(shellThread, result);
            return result;
        };
    }

    // Register an async external function that executes on a background Promise.
    // Used for blocking I/O (DB queries, HTTP calls) so other ProperTee threads aren't frozen.
    // The function can be synchronous or return a Promise for truly async operations.
    registerExternalAsync(name, func, timeoutMs = 0) {
        requireReplaceableName(name);   // host-API error for PRINT/PRINTF/SLEEP/FAIL/UNWRAP (spec v0.13.0)
        const self = this;
        this.functions[name] = (...args) => {
            if (!self.activeThread) {
                throw new Error("Runtime Error: Async function '" + name + "' can only be called within the scheduler");
            }
            const thread = self.activeThread;
            if (thread.inMonitorContext) {
                throw new Error("Runtime Error: Async function '" + name + "' cannot be called in monitor blocks");
            }

            // Build cache key
            const formatJsonValue = (value) => {
                if (value === null || value === undefined) return 'null';
                if (typeof value === 'string') return "'" + value + "'";
                if (typeof value === 'boolean') return String(value);
                if (typeof value === 'number') return String(value);
                if (Array.isArray(value)) return '[ ' + value.map(v => formatJsonValue(v)).join(', ') + ' ]';
                if (typeof value === 'object') {
                    const keys = Object.keys(value);
                    return '{ ' + keys.map(k => '"' + k + '": ' + formatJsonValue(value[k])).join(', ') + ' }';
                }
                return String(value);
            };
            const cacheKey = name + "|" + formatJsonValue(args);

            // Check cache first (result from completed async operation)
            if (cacheKey in thread.asyncResultCache) {
                const cached = thread.asyncResultCache[cacheKey];
                if (name === 'SHELL') self._completeShellObservation(thread, cached);
                return cached;
            }

            if (name === 'SHELL') self._startShellObservation(thread);

            // Deep-copy args for safety
            const safeCopyArgs = args.map(a => self.deepCopy(a));
            const currentCacheKey = cacheKey;

            // Execute function asynchronously via setTimeout to yield to event loop.
            // Supports both sync functions and functions that return Promises.
            const promise = new Promise((resolve) => {
                setTimeout(() => {
                    try {
                        const result = func(...safeCopyArgs);
                        if (result && typeof result.then === 'function') {
                            result.then(
                                (val) => resolve(externalResult(name, self.deepCopy(val))),
                                (err) => resolve(makeResult("error", false, err.message))
                            );
                        } else {
                            resolve(externalResult(name, self.deepCopy(result)));   // no Infinity or NaN (spec v0.36.0)
                        }
                    } catch (e) {
                        resolve(makeResult("error", false, e.message));
                    }
                }, 0);
            });

            // When promise resolves, store result on thread (only if still waiting for same key)
            promise.then((result) => {
                if (thread.asyncCacheKey === currentCacheKey) {
                    thread.asyncResolved = true;
                    thread.asyncResolvedValue = result;
                    if (name === 'SHELL') self._completeShellObservation(thread, result);
                }
            });

            // Store async state on thread
            thread.asyncCacheKey = cacheKey;
            thread.asyncTimeoutMs = timeoutMs;
            thread.asyncSubmitTime = Date.now();

            // Throw to unwind expression evaluation
            throw new AsyncPendingError();
        };
    }

    _startShellObservation(thread) {
        thread.shellObservation = {
            active: true,
            status: 'running',
            taskId: {},
            pid: {},
            exitCode: {},
            startedAt: Date.now(),
            endedAt: 0,
            result: {},
            lastLine: '',
            outputRevision: 0,
            deliveredRevision: 0
        };
    }

    _completeShellObservation(thread, result) {
        const shell = thread?.shellObservation;
        if (!shell || !shell.active) return;
        shell.active = false;
        shell.status = result && result.ok === true ? 'completed' : 'failed';
        shell.endedAt = Date.now();
        shell.result = this.deepCopy(result === undefined ? {} : result);
    }

    // No-op in JS (Promises self-clean, no executor to shut down)
    shutdown() {}

    setHiddenKeywords(keywords) { this.hiddenKeywords = new Set(keywords || []); }
    setIgnoredFunctions(functions) { this.ignoredFunctions = new Set(functions || []); }

    // Opt-in static validation pass for host restrictions (ProperTee issue #9).
    // Runtime checks fire only when a construct is reached, so a forbidden statement in an
    // untaken branch goes undetected; this scans the whole parse tree — dead branches
    // included — and returns one "line L:C: 'X' is not available in this environment"
    // entry per hidden-keyword construct / ignored-function call (empty array = clean).
    // Runtime enforcement is unchanged (backstop).
    // Scan the whole tree (dead branches included) for hidden-keyword constructs / ignored-function
    // calls; returns structured violations in document order (empty = clean).
    _blockedConstructs(tree) {
        const out = [];
        const check = (name, token) => out.push({ name, line: token.line, column: token.column });
        const checkKeyword = (keyword, ctx) => {
            if (this.hiddenKeywords.has(keyword)) check(keyword, ctx.start);
        };
        const walk = (t) => {
            if (t instanceof ProperTeeParser.IfStatementContext) checkKeyword('if', t);           // covers the elseif chain
            else if (t instanceof ProperTeeParser.IterationStmtContext) checkKeyword('loop', t);   // all three loop forms
            else if (t instanceof ProperTeeParser.FunctionDefContext) checkKeyword('function', t);
            else if (t instanceof ProperTeeParser.ParallelStmtContext) checkKeyword('multi', t);
            else if (t instanceof ProperTeeParser.SpawnStmtContext) checkKeyword('thread', t);
            else if (t instanceof ProperTeeParser.DebugStmtContext) checkKeyword('debug', t);
            else if (t instanceof ProperTeeParser.FunctionCallContext
                    && this.ignoredFunctions.has(t.funcName.text)) {
                check(t.funcName.text, t.funcName);
            }
            // Always recurse — a report on a construct does not hide violations nested inside it.
            for (const child of t.children ?? []) walk(child);
        };
        walk(tree);
        return out;
    }

    // Host API (issue #9): one "line L:C: 'X' is not available in this environment" string per
    // violation, the column from 1 (spec v0.37.0).
    validate(tree) {
        return this._blockedConstructs(tree).map(
            v => `line ${v.line}:${v.column + 1}: '${v.name}' is not available in this environment`);
    }

    // The load-time checks of spec v0.37.0, every violation as {message, line, column} (the
    // column as ANTLR counts it, from 0): `on error` comes right after the imports, at most once,
    // and names `error`; a `return` value starts on the `return` line; `break` and `continue` act
    // on a loop in the same function body — a function body and a monitor body start without one,
    // a multi setup is no boundary.
    _loadViolations(tree) {
        const out = [];
        const report = (message, token) => out.push({ message, line: token.line, column: token.column });
        const statements = tree.statement();
        const placed = statements.length > 0 && statements[0] instanceof ProperTeeParser.ErrorHandlerStmtContext
            ? statements[0].errorHandler() : null;
        const sameLine = (keyword, value) => {
            if (value && value.start.line !== keyword.line) {
                report("The value of 'return' must start on the same line", keyword);
            }
        };
        const walk = (t, loopsAround) => {
            let loops = loopsAround;
            if (t instanceof ProperTeeParser.ErrorHandlerContext) {
                if (t !== placed) {
                    report(placed ? "A script can have only one 'on error'"
                        : "'on error' must come right after the imports", t.K_ON().symbol);
                }
                if (t.ID().getText() !== 'error') report("Expected 'error' after 'on'", t.ID().symbol);
            } else if (t instanceof ProperTeeParser.BreakStmtContext || t instanceof ProperTeeParser.FallbackBreakContext) {
                if (loops === 0) report("'break' must be inside a loop", t.K_BREAK().symbol);
            } else if (t instanceof ProperTeeParser.ContinueStmtContext || t instanceof ProperTeeParser.FallbackContinueContext) {
                if (loops === 0) report("'continue' must be inside a loop", t.K_CONTINUE().symbol);
            } else if (t instanceof ProperTeeParser.ReturnStmtContext || t instanceof ProperTeeParser.FallbackReturnContext) {
                sameLine(t.K_RETURN().symbol, t.expression());
            } else if (t instanceof ProperTeeParser.BlockContext) {
                if (t.parentCtx instanceof ProperTeeParser.IterationStmtContext) loops++;
                else if (t.parentCtx instanceof ProperTeeParser.FunctionDefContext
                        || t.parentCtx instanceof ProperTeeParser.MonitorClauseContext) loops = 0;
            }
            for (const child of t.children ?? []) walk(child, loops);
        };
        walk(tree, 0);
        return out;
    }

    // Load-time rejection (spec v0.14.0, v0.37.0): throw the first violation in document order —
    // of the load-time checks, or a blocked construct — as a runtime error, matching the runtime
    // backstop's message/position, or return without throwing when clean. Called before the
    // program runs; `sourceId` names an imported module.
    _refuseAtLoad(tree, sourceId = null) {
        const found = this._loadViolations(tree);
        if (this.hiddenKeywords.size > 0 || this.ignoredFunctions.size > 0) {
            for (const v of this._blockedConstructs(tree)) {
                found.push({ message: `'${v.name}' is not available in this environment`, line: v.line, column: v.column });
            }
        }
        let first = null;
        for (const v of found) {
            if (!first || v.line < first.line || (v.line === first.line && v.column < first.column)) first = v;
        }
        if (first) throw this._errorAt(first.message, first, sourceId);
    }

    _checkKeywordAllowed(keyword, ctx) {
        if (this.hiddenKeywords.has(keyword))
            throw this.createError(`'${keyword}' is not available in this environment`, ctx);
    }

    // ---- Built-in name enumeration & typo lint (host API — reference 0.13.0 / TeeBox 1.13.0 parity) ----

    // Every ALL-CAPS name callable on this instance: the built-in catalog and host-registered
    // externals (registerExternal/registerExternalAsync write into the same `functions` table),
    // plus the interpreter-dispatched FAIL/UNWRAP (spec v0.10.0 — dispatched for line:col errors,
    // never in the table). Wiring-independent: a bare visitor enumerates the full default set.
    /** Host entry for `_ARGS` (spec v0.20.0) — ignored when a props key named _ARGS was supplied. */
    setArgs(args) {
        if (this._argsFromProps || !args) return;
        this.properties._ARGS = args.map(a => String(a));
    }

    knownFunctionNames() {
        const names = new Set(['FAIL', 'UNWRAP']);
        for (const name of Object.keys(this.functions)) {
            if (/^[A-Z][A-Z0-9_]*$/.test(name)) names.add(name);
        }
        return [...names].sort();
    }

    // Zero-false-positive typo lint: ALL-CAPS names are reserved for built-in/host functions
    // (spec v0.12.0), so an ALL-CAPS call outside knownFunctionNames() can never be a script
    // function and is a guaranteed call-time failure. Lowercase calls are never flagged (possible
    // script functions, forward references included). Scans the whole tree — dead branches and
    // `thread` spawn calls included. Returns [{name, line, column, suggestion}].
    lintUnknownFunctions(tree) {
        const known = new Set(this.knownFunctionNames());
        const out = [];
        const walk = (t) => {
            if (t instanceof ProperTeeParser.FunctionCallContext) {
                const name = t.funcName.text;
                if (/^[A-Z][A-Z0-9_]*$/.test(name) && !known.has(name)) {
                    out.push({
                        name,
                        line: t.funcName.line,
                        column: t.funcName.column,
                        suggestion: nearestName(name, known)
                    });
                }
            }
            for (const child of t.children ?? []) walk(child);
        };
        walk(tree);
        return out;
    }

    // Result helper for external functions (genuine-Result branded — spec v0.10.0)
    static ok(value) {
        return makeResult("done", true, value);
    }

    static error(message) {
        return makeResult("error", false, message);
    }

    // For hosts that write JSON (spec v0.32.0): json() is JSON_FORMAT's text, throwing
    // "Runtime Error: <fn>() <place> is NaN, which JSON cannot represent" for a number JSON cannot
    // hold; firstNonFinite() finds that number and its place without writing anything.
    static json(value, fn, name) {
        return teeJson(value, fn, name);
    }

    static firstNonFinite(value, name) {
        return firstNonFinite(value, name);
    }

    // For hosts that read JSON (spec v0.35.0): JSON_PARSE's Result for `text`, its errors naming
    // `fn` — a host's READ_JSON_FILE reads a file's text the way JSON_PARSE reads a string.
    static parseJson(text, fn) {
        return parseJson(text, fn);
    }

    getLocation(ctx) {
        if (ctx && ctx.start) {
            return `line ${ctx.start.line}:${ctx.start.column + 1}`;
        }
        return 'unknown location';
    }

    createError(message, ctx) {
        const module = this._getCurrentModule();
        return this._sourceError(message, ctx, module?.sourceId || this.sourceId);
    }

    _sourceError(message, ctx, sourceId) {
        return this._errorAt(message, ctx?.start, sourceId);
    }

    // A runtime error at a token ({line, column}, the column from 0 as ANTLR counts it). The
    // report counts the column from 1 (spec v0.37.0), and the parts ride the error as `tee`, for
    // the `on error` handler's _ERROR.
    _errorAt(message, token, sourceId) {
        const line = token?.line;
        const column = token ? token.column + 1 : undefined;
        const where = sourceId && sourceId !== '<memory>' ? `${sourceId} line` : 'line';
        const error = new Error(`Runtime Error at ${where} ${line}:${column}: ${message}`);
        error.tee = { message, line, column, sourceId: sourceId || this.sourceId };
        return error;
    }

    // Every runtime error has a position (spec v0.37.0): one raised without its own — a
    // built-in's, which carries the position of its call — gets the position of `ctx`.
    _positioned(e, ctx) {
        if (!(e instanceof Error) || e.tee || typeof e.message !== 'string'
                || !e.message.startsWith('Runtime Error: ')) return e;
        return this.createError(e.message.slice('Runtime Error: '.length), ctx);
    }

    // A built-in's error, at its call (spec v0.37.0), and so is a host function's exception, so
    // the script's `on error` sees it.
    _atCall(e, ctx) {
        if (e instanceof Error && !this._isScriptError(e)) return this.createError(e.message || e.name, ctx);
        return this._positioned(e, ctx);
    }

    // A script's runtime error, as against a control-flow signal or the scheduler's own.
    _isScriptError(e) {
        return e instanceof Error && typeof e.message === 'string' && e.message.startsWith('Runtime Error');
    }

    // ProperTee type name for error messages (same names as TYPE_OF).
    _valueTypeName(v) {
        if (v === TEE_NULL) return 'null';   // spec v0.8.0 (#4)
        if (typeof v === 'boolean') return 'boolean';
        if (typeof v === 'number') return 'number';
        if (typeof v === 'string') return 'string';
        if (Array.isArray(v)) return 'array';
        return 'object';
    }

    // Spec v0.7.0 (#1): if/loop conditions must be boolean — non-booleans are an error, not falsy.
    *_evalCondition(exprCtx) {
        const v = yield* this.visit(exprCtx);
        if (typeof v !== 'boolean') {
            throw this.createError(`Condition requires a boolean value. Got ${this._valueTypeName(v)}`, exprCtx);
        }
        return v;
    }

    // Get current scope stack (from activeThread or fallback to this.scopeStack)
    _getScopeStack() {
        if (this.activeThread) return this.activeThread.scopeStack;
        return this.scopeStack;
    }

    // Get current variables store (from activeThread snapshot or this.variables)
    _getVariables() {
        const module = this._getCurrentModule();
        if (this.activeThread) {
            if (module) {
                return this.activeThread.moduleSnapshots?.[module.identity] || module.variables;
            }
            if (this.activeThread.globalSnapshot) return this.activeThread.globalSnapshot;
        }
        if (module) return module.variables;
        return this.variables;
    }

    _getCurrentModule() {
        return this.activeThread ? this.activeThread.currentModule : this.currentModule;
    }

    _functionMap() {
        const module = this._getCurrentModule();
        return module ? module.functions : this.userDefinedFunctions;
    }

    _liveModuleGlobals() {
        const out = {};
        for (const [identity, module] of Object.entries(this.modulesByIdentity)) {
            out[identity] = module.variables;
        }
        return out;
    }

    // Check if in thread context
    _isInThreadContext() {
        if (this.activeThread) return this.activeThread.inThreadContext;
        return this.inThreadContext;
    }

    // Check if in monitor context
    _isInMonitorContext() {
        if (this.activeThread) return this.activeThread.inMonitorContext;
        return this.inMonitorContext;
    }

    // Check if in multi context
    _isInMultiContext() {
        if (this.activeThread) return this.activeThread.inMultiContext;
        return this.inMultiContext;
    }

    // Get multi result vars
    _getMultiResultVars() {
        if (this.activeThread) return this.activeThread.multiResultVars;
        return this.multiResultVars;
    }

    _isInFunctionScope() {
        return this._getScopeStack().length > 0;
    }

    // Override the base visit() to handle generator dispatch
    visit(ctx) {
        if (!ctx) return null;
        // ANTLR4's accept() calls visitXxx(), which now returns a generator
        const result = ctx.accept(this);
        return result;
    }

    // --- Root and Block (statement-level, yield at boundaries) ---

    *visitRoot(ctx) {
        this.hasExplicitReturn = false;   // per run: REPL snippets reuse one visitor
        this.returnValue = {};
        this.failureInHandler = null;
        this._loadImports(ctx);
        this._refuseAtLoad(ctx);   // spec v0.14.0, v0.37.0: refuse the whole script before any statement runs
        let result = null;
        const statements = ctx.statement();
        let i = 0;

        try {
            while (i < statements.length) {
                try {
                    yield statements[i].start.line;
                    result = yield* this.visit(statements[i]);
                    if (this.activeThread) this.activeThread.asyncResultCache = {};
                    i++;
                } catch (inner) {
                    if (inner instanceof AsyncPendingError) {
                        yield { __schedulerCommand: true, type: 'AWAIT_ASYNC' };
                        continue; // retry same statement
                    }
                    throw this._positioned(inner, statements[i]);
                }
            }
            return result;
        } catch (e) {
            if (e instanceof ReturnException) {
                this.hasExplicitReturn = true;   // a top-level return: the run's result for the host
                this.returnValue = e.value;
                return e.value;
            }
            if (this._isScriptError(e)) throw yield* this._failure(e, statements, i);
            throw e;
        }
    }

    // ---- on error (spec v0.37.0) ----

    // The main thread failed. With an `on error` handler, the error is reported — through the
    // host's failureReporter, else as the line "Runtime error: <report>" on stderr — and the
    // handler runs; the error then carries how it ended as `handler` ({kind, value, error}), and
    // a host that prints the run's error itself skips an error that has one. A stop asked for
    // before the error makes the run stopped instead, the handler not run.
    *_failure(e, statements, at) {
        if (this.stopRequested()) throw new Error('Execution stopped by user');
        if (statements.length === 0 || !(statements[0] instanceof ProperTeeParser.ErrorHandlerStmtContext)) return e;
        if (!e.tee) e = this._positioned(e, statements[at] || statements[0]);
        if (this.failureReporter) this.failureReporter(e);
        else this.stderr('Runtime error: ' + e.message);
        // A stop while the handler runs ends it, and the scheduler then fails the run with this
        // error (Scheduler.run): the run stays failed.
        this.failureInHandler = e;
        try {
            e.handler = yield* this._runHandler(statements[0].errorHandler(), e, statements, at);
        } finally {
            this.failureInHandler = null;
        }
        return e;
    }

    // The handler is top-level code. First the root definitions the run has not reached, in
    // order, as import mode registers them, so it can call a function defined below the failed
    // line. An error in it ends it ([HANDLER ERROR]), or, after a stop asked for, ends it as
    // stopped; the run fails with the original error.
    *_runHandler(handler, e, statements, at) {
        try {
            for (let i = at + 1; i < statements.length; i++) {
                if (statements[i] instanceof ProperTeeParser.FuncDefStmtContext) yield* this.visit(statements[i]);
            }
            const t = e.tee || {};
            this._getVariables()._ERROR = {
                message: t.message ?? e.message,
                line: t.line ?? 0,
                column: t.column ?? 0,
                source: t.sourceId || this.sourceId
            };
            yield* this.visitBlock(handler.block());
            return { kind: 'returned', value: {}, error: null };
        } catch (he) {
            if (he instanceof ReturnException) return { kind: 'returned', value: he.value, error: null };
            if (he instanceof BreakException || he instanceof ContinueException) {
                return { kind: 'returned', value: {}, error: null };   // unreachable: refused at load
            }
            if (!this._isScriptError(he)) throw he;
            if (this.stopRequested()) return { kind: 'stopped', value: {}, error: null };
            this.stderr('[HANDLER ERROR] ' + he.message);
            return { kind: 'failed', value: {}, error: he };
        }
    }

    // The run's result as hosts report it (TeeBox, and the Java runtime's Engine.Outcome.result()):
    // the top-level return value, else the final `result` global, else {} — absence is {}, never
    // null. Read it after the run; `node pt.js --result-only` prints it as JSON.
    scriptResult() {
        if (this.hasExplicitReturn) return this.returnValue;
        if (Object.prototype.hasOwnProperty.call(this.variables, 'result')) return this.variables.result;
        return {};
    }

    _loadImports(root) {
        const imports = root.importStmt ? root.importStmt() : [];
        if (!imports || imports.length === 0) return;
        if (!this.moduleResolver) {
            throw this.createError('import requires a module resolver', imports[0]);
        }
        const seenThisRoot = new Set();
        const seenAliases = new Set();
        const pending = [];
        for (const imp of imports) {
            const alias = imp.alias.text;
            if (Object.prototype.hasOwnProperty.call(this.moduleAliases, alias) || seenAliases.has(alias)) {
                throw this.createError(`Duplicate import alias '${alias}'`, imp);
            }
            seenAliases.add(alias);
            const moduleId = imp.modulePath().getText();
            let version = null;
            if (imp.version) {
                const text = imp.version.text;
                if (!/^[1-9][0-9]*$/.test(text) || Number(text) > 2147483647) {
                    throw this.createError('Module version must be a canonical positive integer', imp);
                }
                version = Number(text);
            }
            const request = { moduleId, version };
            let source;
            try {
                source = typeof this.moduleResolver === 'function'
                    ? this.moduleResolver(request) : this.moduleResolver.resolve(request);
            } catch (e) {
                throw this.createError(e?.message || `Cannot resolve module '${moduleId}'`, imp);
            }
            if (!source) throw this.createError(`Module '${moduleId}${version ? '.' + version : ''}' was not found`, imp);
            if (source && typeof source.then === 'function') {
                throw this.createError('JavaScript module resolvers must return source synchronously', imp);
            }
            const resolvedModuleId = source.moduleId || moduleId;
            const resolvedVersion = source.version ?? null;
            if (resolvedModuleId !== moduleId) {
                throw this.createError(`Resolver returned module '${resolvedModuleId}' for '${moduleId}'`, imp);
            }
            if (version !== null && resolvedVersion !== version) {
                throw this.createError(`Resolver returned version '${resolvedVersion}' for exact module '${moduleId}.${version}'`, imp);
            }
            if (resolvedVersion !== null && (!Number.isInteger(resolvedVersion)
                    || resolvedVersion <= 0 || resolvedVersion > 2147483647)) {
                throw this.createError(`Resolver returned invalid module version '${resolvedVersion}'`, imp);
            }
            if (typeof source.source !== 'string') {
                throw this.createError(`Resolver returned no source for module '${moduleId}'`, imp);
            }
            const identity = resolvedVersion === null ? resolvedModuleId : `${resolvedModuleId}.${resolvedVersion}`;
            if (seenThisRoot.has(identity)
                    || Object.prototype.hasOwnProperty.call(this.modulesByIdentity, identity)) {
                throw this.createError(`Duplicate import of module '${identity}'`, imp);
            }
            const sourceId = source.sourceId || identity;
            const moduleRoot = this._parseModule(String(source.source ?? ''), sourceId, identity);
            const nested = moduleRoot.importStmt ? moduleRoot.importStmt() : [];
            if (nested.length > 0) {
                throw this._sourceError(`Imported module '${identity}' cannot contain import statements`, nested[0], sourceId);
            }
            this._rejectModuleIfBlocked(moduleRoot, sourceId);
            const module = { identity, moduleId: resolvedModuleId, version: resolvedVersion,
                sourceId, variables: {}, functions: Object.create(null) };
            for (const statement of moduleRoot.statement()) {
                if (statement instanceof ProperTeeParser.FuncDefStmtContext) {
                    const def = statement.functionDef();
                    module.functions[def.funcName.text] = this._makeFunctionDef(def, module);
                }
            }
            seenThisRoot.add(identity);
            pending.push({ alias, identity, module });
        }
        // Commit only after every source resolves, parses, and validates. This also keeps a
        // persistent REPL visitor unchanged when a later import in one snippet is invalid.
        for (const { alias, identity, module } of pending) {
            this.modulesByIdentity[identity] = module;
            this.moduleAliases[alias] = module;
            if (this.activeThread && !this.activeThread.inThreadContext) {
                this.activeThread.moduleSnapshots[identity] = module.variables;
            }
        }
    }

    _parseModule(source, sourceId, identity) {
        const chars = new antlr4.InputStream(source);
        const lexer = new ProperTeeLexer(chars);
        const tokens = new antlr4.CommonTokenStream(lexer);
        const parser = new ProperTeeParser(tokens);
        lexer.removeErrorListeners();
        parser.removeErrorListeners();
        const errors = [];
        const listener = new ModuleErrorListener(errors);
        lexer.addErrorListener(listener);
        parser.addErrorListener(listener);
        const root = parser.root();
        if (errors.length > 0) {
            const e = errors[0];
            throw this._errorAt(`Invalid module '${identity}': syntax error - ${e.msg}`, e, sourceId);
        }
        return root;
    }

    _rejectModuleIfBlocked(root, sourceId) {
        this._refuseAtLoad(root, sourceId);   // the load-time checks hold in a module too (spec v0.37.0)
    }

    _makeFunctionDef(ctx, module) {
        const funcName = ctx.funcName.text;
        if (/^[A-Z][A-Z0-9_]*$/.test(funcName)) {
            throw this._sourceError(
                `Cannot define function '${funcName}': all-uppercase names are reserved for built-in and host functions`,
                ctx, module?.sourceId || this.sourceId);
        }
        const params = ctx.parameterList()
            ? ctx.parameterList().ID().map(id => id.getText()) : [];
        return { params, body: ctx.block(), module };
    }

    *visitBlock(ctx) {
        let result = null;
        const statements = ctx.statement();
        let i = 0;

        while (i < statements.length) {
            try {
                yield statements[i].start.line;
                result = yield* this.visit(statements[i]);
                if (this.activeThread) this.activeThread.asyncResultCache = {};
                i++;
            } catch (inner) {
                if (inner instanceof AsyncPendingError) {
                    yield { __schedulerCommand: true, type: 'AWAIT_ASYNC' };
                    continue;
                }
                throw this._positioned(inner, statements[i]);
            }
        }
        return result;
    }

    // --- Statements ---

    *visitAssignStmt(ctx) {
        if (!ctx.otherwiseClause()) return yield* this.visit(ctx.assignment());
        const assignment = ctx.assignment();
        const value = yield* this._valueOrFallback(assignment.expression(), ctx.otherwiseClause(),
            this._targetOf(assignment.lvalue()));
        if (value === SET_BY_BLOCK) return null;
        return yield* this._assignValue(assignment, value);
    }

    *visitAssignment(ctx) {
        const value = yield* this.visit(ctx.expression());
        return yield* this._assignValue(ctx, value);
    }

    // The right side is computed first, then the target's place (spec v0.37.0 states the order).
    *_assignValue(ctx, value) {
        // spec v0.16.0: the monitor is a watchdog thread — assignment follows the same
        // rules as workers (locals writable, :: writes error); no monitor-specific ban.
        const lvalueCtx = ctx.lvalue();
        const scopeStack = this._getScopeStack();
        const variables = this._getVariables();

        // Case 0: global variable assignment (::varName = value)
        if (lvalueCtx.constructor.name === 'GlobalVarLValueContext') {
            const varName = lvalueCtx.ID().getText();

            if (this._isInThreadContext()) {
                throw this.createError(
                    `Cannot assign to global variable '::${varName}' inside multi block. ` +
                    `Functions in multi blocks can only read global variables (via ::) and write to local variables.`,
                    ctx
                );
            }

            // Write directly to globals (bypasses local scopes)
            variables[varName] = this.deepCopy(value);
            this._noteSet(varName, variables);
            return value;
        }

        // Case 1: variable assignment
        if (lvalueCtx.constructor.name === 'VarLValueContext') {
            const varName = lvalueCtx.ID().getText();

            // Thread purity: no global writes
            if (this._isInThreadContext() && scopeStack.length === 0) {
                throw this.createError(
                    `Cannot assign to global variable '${varName}' inside multi block. ` +
                    `Functions in multi blocks can only read global variables (via ::) and write to local variables.`,
                    ctx
                );
            }

            const scope = scopeStack.length > 0 ? scopeStack[scopeStack.length - 1] : variables;
            scope[varName] = this.deepCopy(value);
            this._noteSet(varName, scope);
            return value;
        }

        // Case 2: property assignment
        if (lvalueCtx.constructor.name === 'PropLValueContext') {
            // Thread purity: a nested write whose lvalue chain is rooted at a global
            // (::g.x = ...) is a global write — same rule as workers and the monitor
            // watchdog (mirrors the reference's rootLvalue() guard).
            let root = lvalueCtx;
            while (root.constructor.name === 'PropLValueContext') root = root.lvalue();
            if (root.constructor.name === 'GlobalVarLValueContext' && this._isInThreadContext()) {
                const rootName = root.ID().getText();
                throw this.createError(
                    `Cannot assign to global variable '::${rootName}' inside multi block. ` +
                    `Functions in multi blocks can only read global variables (via ::) and write to local variables.`,
                    root
                );
            }
            const targetObj = yield* this._evaluateLValueForAssignment(lvalueCtx.lvalue());
            const key = yield* this.visit(lvalueCtx.access());

            if (typeof targetObj !== 'object' || targetObj === null) {
                throw this.createError(`Property '${key}' does not exist`, ctx);
            }
            if (Array.isArray(targetObj)) {
                this._checkIndex('Array', key, ctx);
                const idx = key - 1; // 1-based to 0-based
                if (idx < 0 || idx >= targetObj.length) {
                    throw this.createError('Array index out of bounds', ctx);
                }
                targetObj[idx] = this.deepCopy(value);
            } else {
                targetObj[key] = this.deepCopy(value);
            }
            return value;
        }

        throw this.createError('Unknown lvalue type', ctx);
    }

    *_evaluateLValueForAssignment(lvalueCtx) {
        const scopeStack = this._getScopeStack();
        const variables = this._getVariables();

        if (lvalueCtx.constructor.name === 'GlobalVarLValueContext') {
            const varName = lvalueCtx.ID().getText();
            if (varName in variables) return variables[varName];
            if (varName in this.properties) return this.properties[varName];
            throw new Error(`Runtime Error: Variable '${varName}' is not defined`);
        }

        if (lvalueCtx.constructor.name === 'VarLValueContext') {
            const varName = lvalueCtx.ID().getText();

            // Check scope stack
            for (let i = scopeStack.length - 1; i >= 0; i--) {
                if (varName in scopeStack[i]) return scopeStack[i][varName];
            }

            // Inside a function: plain variables are local-only
            if (this._isInFunctionScope()) {
                throw new Error(`Runtime Error: Variable '${varName}' is not defined in local scope. Use ::${varName} to access the global variable.`);
            }

            if (varName in variables) return variables[varName];
            if (varName in this.properties) return this.properties[varName];
            throw new Error(`Runtime Error: Variable '${varName}' is not defined`);
        }

        if (lvalueCtx.constructor.name === 'PropLValueContext') {
            const targetObj = yield* this._evaluateLValueForAssignment(lvalueCtx.lvalue());
            const key = yield* this.visit(lvalueCtx.access());
            return this._readMember(targetObj, key, lvalueCtx);
        }

        throw new Error('Runtime Error: Unknown lvalue type in assignment');
    }

    *visitVarLValue(ctx) {
        const varName = ctx.ID().getText();
        const scopeStack = this._getScopeStack();
        const variables = this._getVariables();

        for (let i = scopeStack.length - 1; i >= 0; i--) {
            if (varName in scopeStack[i]) return scopeStack[i][varName];
        }

        // Inside a function: plain variables are local-only
        if (this._isInFunctionScope()) {
            throw new Error(`Runtime Error: Variable '${varName}' is not defined in local scope. Use ::${varName} to access the global variable.`);
        }

        if (varName in variables) return variables[varName];
        if (varName in this.properties) return this.properties[varName];
        throw new Error(`Runtime Error: Variable '${varName}' is not defined`);
    }

    *visitGlobalVarLValue(ctx) {
        const varName = ctx.ID().getText();
        const variables = this._getVariables();

        if (varName in variables) return variables[varName];
        if (varName in this.properties) return this.properties[varName];
        throw new Error(`Runtime Error: Variable '${varName}' is not defined`);
    }

    *visitPropLValue(ctx) {
        const targetObj = yield* this.visit(ctx.lvalue());
        const key = yield* this.visit(ctx.access());
        return this._readMember(targetObj, key, ctx);
    }

    *visitIfStmt(ctx) {
        this._checkKeywordAllowed('if', ctx);
        return yield* this.visit(ctx.ifStatement());
    }

    *visitIfStatement(ctx) {
        const condition = yield* this._evalCondition(ctx.condition);

        if (condition) {
            if (ctx.thenBody) {
                return yield* this.visitBlock(ctx.thenBody);
            }
            return null;
        }
        // spec v0.9.0 (#3): elseif arms — first true condition wins; later conditions unevaluated
        for (let n = 0; n < ctx.elseifConds.length; n++) {
            if (yield* this._evalCondition(ctx.elseifConds[n])) {
                return yield* this.visitBlock(ctx.elseifBodies[n]);
            }
        }
        if (ctx.elseBody) {
            return yield* this.visitBlock(ctx.elseBody);
        }
        return null;
    }

    *visitIterStmt(ctx) {
        return yield* this.visit(ctx.iterationStmt());
    }

    *visitConditionLoop(ctx) {
        this._checkKeywordAllowed('loop', ctx);
        let result = null;
        const isInfinite = ctx.K_INFINITE() !== null;
        const maxIterations = isInfinite ? Infinity : this.maxIterations;
        let iterations = 0;

        try {
            let condition = yield* this._evalCondition(ctx.expression());

            while (condition) {
                if (++iterations > maxIterations) {
                    if (this.iterationLimitBehavior === 'warn') {
                        this.stderr(`Warning: Loop exceeded maximum iterations (${maxIterations}), stopping loop`);
                        break;
                    } else {
                        // spec v0.35.0: every loop suggests 'loop ... infinite do' (this one said
                        // 'loop condition infinite do')
                        throw this.createError(
                            `Loop exceeded maximum iterations (${maxIterations}). Use 'loop ... infinite do' if you need unlimited iterations.`,
                            ctx
                        );
                    }
                }

                yield ctx.start.line; // Loop iteration boundary (before execution)

                try {
                    result = yield* this.visitBlock(ctx.block());
                } catch (e) {
                    if (e instanceof BreakException) break;
                    else if (e instanceof ContinueException) { /* continue */ }
                    else throw e;
                }

                condition = yield* this._evalCondition(ctx.expression());
            }
        } catch (e) {
            if (!(e instanceof BreakException)) throw e;
        }

        return result;
    }

    *visitValueLoop(ctx) {
        this._checkKeywordAllowed('loop', ctx);
        const iterable = yield* this.visit(ctx.expression());
        const isInfinite = ctx.K_INFINITE() !== null;
        const maxIterations = isInfinite ? Infinity : this.maxIterations;
        let iterations = 0;
        let result = null;
        const valueVar = ctx.value.text;
        const variables = this._getVariables();
        const scopeStack = this._getScopeStack();

        if (Array.isArray(iterable)) {
            try {
                for (let i = 0; i < iterable.length; i++) {
                    if (++iterations > maxIterations) {
                        if (this.iterationLimitBehavior === 'warn') {
                            this.stderr(`Warning: Loop exceeded maximum iterations (${maxIterations}), stopping loop`);
                            break;
                        } else {
                            throw this.createError(`Loop exceeded maximum iterations (${maxIterations}). Use 'loop ... infinite do' if you need unlimited iterations.`, ctx);
                        }
                    }

                    // Set loop variable
                    if (scopeStack.length > 0) {
                        scopeStack[scopeStack.length - 1][valueVar] = this.deepCopy(iterable[i]);
                    } else {
                        variables[valueVar] = this.deepCopy(iterable[i]);
                    }

                    yield ctx.start.line; // Loop iteration boundary (before execution)

                    try {
                        result = yield* this.visitBlock(ctx.block());
                    } catch (e) {
                        if (e instanceof BreakException) break;
                        else if (e instanceof ContinueException) { /* continue */ }
                        else throw e;
                    }
                }
            } catch (e) {
                if (!(e instanceof BreakException)) throw e;
            }
        } else if (typeof iterable === 'object' && iterable !== null) {
            try {
                for (const key in iterable) {
                    if (hasOwnKey(iterable, key)) {
                        if (++iterations > maxIterations) {
                            if (this.iterationLimitBehavior === 'warn') {
                                this.stderr(`Warning: Loop exceeded maximum iterations (${maxIterations}), stopping loop`);
                                break;
                            } else {
                                throw this.createError(`Loop exceeded maximum iterations (${maxIterations}). Use 'loop ... infinite do' if you need unlimited iterations.`, ctx);
                            }
                        }

                        if (scopeStack.length > 0) {
                            scopeStack[scopeStack.length - 1][valueVar] = this.deepCopy(iterable[key]);
                        } else {
                            variables[valueVar] = this.deepCopy(iterable[key]);
                        }

                        yield ctx.start.line; // Loop iteration boundary (before execution)

                        try {
                            result = yield* this.visitBlock(ctx.block());
                        } catch (e) {
                            if (e instanceof BreakException) break;
                            else if (e instanceof ContinueException) { /* continue */ }
                            else throw e;
                        }
                    }
                }
            } catch (e) {
                if (!(e instanceof BreakException)) throw e;
            }
        } else {
            throw new Error('Runtime Error: Cannot iterate over non-iterable value');
        }

        return result;
    }

    *visitKeyValueLoop(ctx) {
        this._checkKeywordAllowed('loop', ctx);
        const iterable = yield* this.visit(ctx.expression());
        const isInfinite = ctx.K_INFINITE() !== null;
        const maxIterations = isInfinite ? Infinity : this.maxIterations;
        let iterations = 0;
        let result = null;
        const keyVar = ctx.key.text;
        const valueVar = ctx.value.text;
        const variables = this._getVariables();
        const scopeStack = this._getScopeStack();

        if (Array.isArray(iterable)) {
            try {
                for (let i = 0; i < iterable.length; i++) {
                    if (++iterations > maxIterations) {
                        if (this.iterationLimitBehavior === 'warn') {
                            this.stderr(`Warning: Loop exceeded maximum iterations (${maxIterations}), stopping loop`);
                            break;
                        } else {
                            throw this.createError(`Loop exceeded maximum iterations (${maxIterations}). Use 'loop ... infinite do' if you need unlimited iterations.`, ctx);
                        }
                    }

                    if (scopeStack.length > 0) {
                        scopeStack[scopeStack.length - 1][keyVar] = i + 1;
                        scopeStack[scopeStack.length - 1][valueVar] = this.deepCopy(iterable[i]);
                    } else {
                        variables[keyVar] = i + 1;
                        variables[valueVar] = this.deepCopy(iterable[i]);
                    }

                    yield ctx.start.line; // Loop iteration boundary (before execution)

                    try {
                        result = yield* this.visitBlock(ctx.block());
                    } catch (e) {
                        if (e instanceof BreakException) break;
                        else if (e instanceof ContinueException) { /* continue */ }
                        else throw e;
                    }
                }
            } catch (e) {
                if (!(e instanceof BreakException)) throw e;
            }
        } else if (typeof iterable === 'object' && iterable !== null) {
            try {
                for (const key in iterable) {
                    if (hasOwnKey(iterable, key)) {
                        if (++iterations > maxIterations) {
                            if (this.iterationLimitBehavior === 'warn') {
                                this.stderr(`Warning: Loop exceeded maximum iterations (${maxIterations}), stopping loop`);
                                break;
                            } else {
                                throw this.createError(`Loop exceeded maximum iterations (${maxIterations}). Use 'loop ... infinite do' if you need unlimited iterations.`, ctx);
                            }
                        }

                        if (scopeStack.length > 0) {
                            scopeStack[scopeStack.length - 1][keyVar] = key;
                            scopeStack[scopeStack.length - 1][valueVar] = this.deepCopy(iterable[key]);
                        } else {
                            variables[keyVar] = key;
                            variables[valueVar] = this.deepCopy(iterable[key]);
                        }

                        yield ctx.start.line; // Loop iteration boundary (before execution)

                        try {
                            result = yield* this.visitBlock(ctx.block());
                        } catch (e) {
                            if (e instanceof BreakException) break;
                            else if (e instanceof ContinueException) { /* continue */ }
                            else throw e;
                        }
                    }
                }
            } catch (e) {
                if (!(e instanceof BreakException)) throw e;
            }
        } else {
            throw new Error('Runtime Error: Cannot iterate over non-iterable value');
        }

        return result;
    }

    *visitFlowStmt(ctx) {
        return yield* this.visit(ctx.flowControl());
    }

    *visitBreakStmt(ctx) {
        throw new BreakException();
    }

    *visitContinueStmt(ctx) {
        throw new ContinueException();
    }

    *visitReturnStmt(ctx) {
        const value = !ctx.expression() ? {}
            : !ctx.otherwiseClause() ? yield* this.visit(ctx.expression())
            : yield* this._valueOrFallback(ctx.expression(), ctx.otherwiseClause(), LEAVE);
        throw new ReturnException(value);
    }

    *visitDebugStmt(ctx) {
        this._checkKeywordAllowed('debug', ctx);
        yield { __debugBreak: true, line: ctx.start.line };
    }

    // --- Function Definition ---

    *visitFuncDefStmt(ctx) {
        this._checkKeywordAllowed('function', ctx);
        return yield* this.visit(ctx.functionDef());
    }

    *visitFunctionDef(ctx) {
        const module = this._getCurrentModule();
        const def = this._makeFunctionDef(ctx, module);
        (module ? module.functions : this.userDefinedFunctions)[ctx.funcName.text] = def;
        return null;
    }

    // --- SPAWN statements ---

    *visitSpawnExecStmt(ctx) {
        return yield* this.visit(ctx.spawnStmt());
    }

    _resolveAndValidateDynamicKey(keyValue, ctx) {
        const key = this.functions['TO_STRING'](keyValue);
        if (key.length === 0) {
            return null; // treat empty as unnamed (auto-keyed)
        }
        // Duplicate key check
        for (const existing of this._collectedSpawns) {
            if (existing.resultKey !== null && existing.resultKey === key) {
                throw this.createError(`Duplicate result key '${key}' in multi block`, ctx);
            }
        }
        return key;
    }

    _processStringEscapes(raw) {
        let result = '';
        for (let i = 0; i < raw.length; i++) {
            if (raw[i] === '\\' && i + 1 < raw.length) {
                const next = raw[i + 1];
                switch (next) {
                    case 'n': result += '\n'; break;
                    case 't': result += '\t'; break;
                    case 'r': result += '\r'; break;
                    case '\\': result += '\\'; break;
                    case '"': result += '"'; break;
                    default: result += '\\' + next; break;
                }
                i++;
            } else {
                result += raw[i];
            }
        }
        return result;
    }

    *visitSpawnKeyStmt(ctx) {
        this._checkKeywordAllowed('thread', ctx);
        if (!this._inMultiSetup) {
            throw this.createError('thread can only be used inside multi blocks', ctx);
        }
        const funcCallCtx = ctx.functionCall();
        const funcName = funcCallCtx.funcName.text;
        const module = funcCallCtx.moduleAlias
            ? this._resolveModuleAlias(funcCallCtx.moduleAlias.text, funcCallCtx)
            : this._getCurrentModule();

        // Resolve key using access rule (same as property access)
        let keyName = null;
        const accessCtx = ctx.access();
        if (accessCtx) {
            const ctorName = accessCtx.constructor.name;
            if (ctorName === 'StaticAccessContext') {
                keyName = accessCtx.ID().getText();
            } else if (ctorName === 'StringKeyAccessContext') {
                const raw = accessCtx.STRING().getText();
                const key = this._processStringEscapes(raw.substring(1, raw.length - 1));
                keyName = key.length === 0 ? null : key; // empty string treated as unnamed
            } else if (ctorName === 'ArrayAccessContext') {
                // an integer literal: the integer range (spec v0.33.0), and "007" names key "7"
                keyName = String(this._intLiteral(accessCtx.INTEGER().getText(), accessCtx));
            } else if (ctorName === 'VarEvalAccessContext') {
                const varName = accessCtx.ID().getText();
                let keyValue = undefined;

                if (accessCtx.GLOBAL_PREFIX()) {
                    // $::var — resolve from globals/properties directly
                    const variables = this._getVariables();
                    if (varName in variables) {
                        keyValue = variables[varName];
                    } else if (varName in this.properties) {
                        keyValue = this.properties[varName];
                    } else {
                        throw this.createError(`Variable '${varName}' is not defined`, ctx);
                    }
                } else {
                    const scopeStack = this._getScopeStack();
                    const variables = this._getVariables();

                    for (let i = scopeStack.length - 1; i >= 0; i--) {
                        if (varName in scopeStack[i]) {
                            keyValue = scopeStack[i][varName];
                            break;
                        }
                    }
                    if (keyValue === undefined) {
                        if (this._isInFunctionScope()) {
                            throw this.createError(
                                `Variable '${varName}' is not defined in local scope. Use ::${varName} to access the global variable.`,
                                ctx
                            );
                        }
                        if (varName in variables) {
                            keyValue = variables[varName];
                        } else if (varName in this.properties) {
                            keyValue = this.properties[varName];
                        } else {
                            throw this.createError(`Variable '${varName}' is not defined`, ctx);
                        }
                    }
                }
                keyName = this._resolveAndValidateDynamicKey(keyValue, ctx);
            } else if (ctorName === 'EvalAccessContext') {
                const keyValue = yield* this.visit(accessCtx.expression());
                keyName = this._resolveAndValidateDynamicKey(keyValue, ctx);
            }
            // Duplicate key check
            for (const existing of this._collectedSpawns) {
                if (existing.resultKey !== null && existing.resultKey === keyName) {
                    throw this.createError(`Duplicate result key '${keyName}' in multi block`, ctx);
                }
            }
        }

        // Evaluate arguments now (during setup phase)
        const args = [];
        if (funcCallCtx.expression()) {
            for (const exprCtx of funcCallCtx.expression()) {
                args.push(yield* this.visit(exprCtx));
            }
        }

        this._collectedSpawns.push({ funcName, module, args, resultKey: keyName, ctx: funcCallCtx });
        return null;
    }

    *visitExprStmt(ctx) {
        if (!ctx.otherwiseClause()) return yield* this.visit(ctx.expression());
        const value = yield* this._valueOrFallback(ctx.expression(), ctx.otherwiseClause(), NONE);
        return value === SET_BY_BLOCK ? null : value;
    }

    *visitErrorHandlerStmt(ctx) {
        return null;   // the handler runs only after an error (spec v0.37.0)
    }

    // ---- otherwise (spec v0.37.0) ----

    // What the statement an `otherwise` ends asks of its block (rule 5).
    _targetOf(lvalueCtx) {
        const kind = lvalueCtx.constructor.name;
        if (kind === 'VarLValueContext') return { variable: lvalueCtx.ID().getText(), global: false, leave: false };
        if (kind === 'GlobalVarLValueContext') return { variable: lvalueCtx.ID().getText(), global: true, leave: false };
        return LEAVE;   // a member or element target
    }

    *_valueOrFallback(left, otherwiseCtx, target) {
        const value = yield* this.visit(left);
        return yield* this._otherwise(value, left, otherwiseCtx, target);
    }

    // Rule 1: the value on the left must be a genuine Result. An ok one gives its value; a failed
    // or running one gives the fallback, which runs only then (rule 3).
    *_otherwise(value, left, otherwiseCtx, target) {
        if (!isGenuineResult(value)) throw this.createError(this._needsResult(left, value), left);
        if (value.ok === true) return value.value;
        const fallback = otherwiseCtx.fallback();
        if (fallback instanceof ProperTeeParser.FallbackContinueContext) throw new ContinueException();
        if (fallback instanceof ProperTeeParser.FallbackBreakContext) throw new BreakException();
        if (fallback instanceof ProperTeeParser.FallbackReturnContext) {
            const returned = !fallback.expression() ? {}
                : !fallback.otherwiseClause() ? yield* this.visit(fallback.expression())
                : yield* this._valueOrFallback(fallback.expression(), fallback.otherwiseClause(), LEAVE);
            throw new ReturnException(returned);
        }
        if (fallback instanceof ProperTeeParser.FallbackValueContext) {
            if (fallback.otherwiseClause()) {
                return yield* this._valueOrFallback(fallback.expression(), fallback.otherwiseClause(), target);
            }
            // Rule 4: a Result as the fallback gives its value, or stops as UNWRAP would; one level
            const v = yield* this.visit(fallback.expression());
            if (!isGenuineResult(v)) return v;
            if (v.ok === true) return v.value;
            throw this.createError(this.functions['TO_STRING'](v.value), fallback.expression());
        }
        return yield* this._fallbackBlock(value, fallback, target);
    }

    // Rule 5: the block runs with the failure named, and must end as its statement needs — leave,
    // or set the statement's variable; after an expression statement it may simply end.
    *_fallbackBlock(failed, block, target) {
        if (block.name) {
            const failure = { message: this.functions['TO_STRING'](failed.value), value: failed.value };
            const scopeStack = this._getScopeStack();
            if (scopeStack.length > 0) scopeStack[scopeStack.length - 1][block.name.text] = this.deepCopy(failure);
            else this._getVariables()[block.name.text] = this.deepCopy(failure);   // the loop-variable rule
        }
        const trackers = this._setTrackers();
        const scopeStack = this._getScopeStack();
        // where the variable lives — the globals, or the function's scope — and the calls running
        // now: the block sets it itself, a multi setup in it included, not in a function it calls
        const tracker = target.variable == null ? null : {
            name: target.variable,
            scope: target.global || scopeStack.length === 0 ? this._getVariables() : scopeStack[scopeStack.length - 1],
            calls: this._trackerOwner()._calls || 0,
            set: false
        };
        if (tracker) trackers.push(tracker);
        try {
            yield* this.visitBlock(block.block());
        } finally {
            if (tracker) trackers.pop();
        }
        const end = block.K_END().symbol;
        if (tracker) {
            if (tracker.set) return SET_BY_BLOCK;
            throw this._errorAt(`The 'otherwise' block must set '${target.variable}' or leave with continue, break, return or FAIL`,
                end, this._getCurrentModule()?.sourceId || this.sourceId);
        }
        if (target.leave) {
            throw this._errorAt("The 'otherwise' block must leave with continue, break, return or FAIL",
                end, this._getCurrentModule()?.sourceId || this.sourceId);
        }
        return null;
    }

    // The thread whose open `otherwise` blocks and running calls these are.
    _trackerOwner() {
        return this.activeThread || this;
    }

    _setTrackers() {
        const owner = this._trackerOwner();
        if (!owner._setTrackers) owner._setTrackers = [];
        return owner._setTrackers;
    }

    // Mark the open blocks this assignment sets: the same variable, assigned by the block, not a call.
    _noteSet(name, scope) {
        const trackers = this._setTrackers();
        if (trackers.length === 0) return;
        const calls = this._trackerOwner()._calls || 0;
        for (const t of trackers) {
            if (t.calls === calls && t.scope === scope && t.name === name) t.set = true;
        }
    }

    // 'otherwise' needs a Result, but TO_NUMBER() gave a number — named after what was on its left.
    _needsResult(left, value) {
        const type = this._valueTypeName(value);
        const what = value === TEE_NULL ? 'null' : (/^[ao]/.test(type) ? 'an ' : 'a ') + type;
        let source = `the value on its left is ${what}`;
        if (left instanceof ProperTeeParser.AtomExprContext) {
            const atom = left.atom();
            if (atom instanceof ProperTeeParser.FuncAtomContext) source = `${atom.functionCall().funcName.text}() gave ${what}`;
            else if (atom instanceof ProperTeeParser.VarReferenceContext) source = `${atom.ID().getText()} is ${what}`;
            else if (atom instanceof ProperTeeParser.GlobalVarReferenceContext) source = `::${atom.ID().getText()} is ${what}`;
        }
        return `'otherwise' needs a Result, but ${source}`;
    }

    // --- Expressions (use yield* delegation, no scheduler yields) ---

    *visitAtomExpr(ctx) {
        return yield* this.visit(ctx.atom());
    }

    *visitVarReference(ctx) {
        const name = ctx.ID().getText();
        const scopeStack = this._getScopeStack();
        const variables = this._getVariables();
        const multiResultVars = this._getMultiResultVars();

        // Check multi result vars (blocked inside MULTI context)
        if (this._isInMultiContext() && multiResultVars.has(name)) {
            throw this.createError(
                `Cannot use result variable '${name}' inside MULTI block. Result variables are only available after 'end'.`,
                ctx
            );
        }

        // 1. Local scopes
        for (let i = scopeStack.length - 1; i >= 0; i--) {
            if (name in scopeStack[i]) return scopeStack[i][name];
        }

        // 2. MULTI result vars
        if (multiResultVars.has(name)) {
            return multiResultVars.get(name);
        }

        // Inside a function: plain variables are local-only, no fallthrough to globals
        if (this._isInFunctionScope()) {
            throw this.createError(
                `Variable '${name}' is not defined in local scope. Use ::${name} to access the global variable.`,
                ctx
            );
        }

        // 3. Variables (global or snapshot) — top-level only
        if (name in variables) return variables[name];

        // 4. Built-in properties — top-level only
        if (name in this.properties) return this.properties[name];

        throw this.createError(`Variable '${name}' is not defined`, ctx);
    }

    *visitGlobalVarReference(ctx) {
        const name = ctx.ID().getText();
        const variables = this._getVariables();

        // Global variables
        if (name in variables) return variables[name];

        // Built-in properties
        if (name in this.properties) return this.properties[name];

        throw this.createError(`Variable '${name}' is not defined`, ctx);
    }

    *visitIntegerAtom(ctx) {
        return this._intLiteral(ctx.getText(), ctx);
    }

    // Spec v0.13.0, v0.33.0: integer literals must fit the integer range (tokens are unsigned
    // digits). A token past 2^53 parses to a number at least 2^53, so the test is exact.
    _intLiteral(token, ctx) {
        const value = parseInt(token, 10);
        if (value > MAX_INTEGER) {
            throw this.createError(literalOutOfRange(token), ctx);
        }
        return value;
    }

    // Spec v0.13.0, v0.33.0: a value is "an integer" when it is whole AND in the integer range —
    // JS has one number type, so integral values outside it (which can only enter as data, e.g.
    // JSON_PARSE) count as decimals, exactly like the Java runtime's Double promotion.
    _isIntValue(v) {
        return Number.isSafeInteger(v);
    }

    /**
     * Integer-integer +,-,* stay integers and must fit the integer range (spec v0.13.0, v0.33.0).
     * A true result inside the range is exact here; one outside rounds to at least 2^53 in size,
     * so it is never a safe integer.
     */
    // A decimal result too large to represent is an error (spec v0.36.0), as an integer one outside
    // the range is.
    _finite(d, ctx) {
        if (!Number.isFinite(d)) throw this.createError(NUMBER_OVERFLOW, ctx);
        return d;
    }

    _intArith(l, r, op, ctx) {
        const result = op === '+' ? l + r : op === '-' ? l - r : l * r;
        if (!Number.isSafeInteger(result)) {
            throw this.createError(INTEGER_OVERFLOW, ctx);
        }
        return result;
    }

    *visitDecimalAtom(ctx) {
        return parseFloat(ctx.getText());
    }

    *visitStringAtom(ctx) {
        const str = ctx.getText();
        return this._processStringEscapes(str.substring(1, str.length - 1));
    }

    *visitBooleanAtom(ctx) {
        return ctx.getText() === 'true';
    }

    *visitNullAtom(ctx) {
        return TEE_NULL;   // spec v0.8.0 (#4): the null literal
    }

    *visitParenAtom(ctx) {
        return yield* this.visit(ctx.expression());
    }

    *visitObjectAtom(ctx) {
        return yield* this.visit(ctx.objectLiteral());
    }

    *visitObjectLiteral(ctx) {
        const obj = {};
        if (!ctx.objectEntry()) return obj;

        for (const entryCtx of ctx.objectEntry()) {
            const key = this.resolveObjectKey(entryCtx.objectKey());
            const value = yield* this.visit(entryCtx.expression());
            obj[key] = value;
        }
        return obj;
    }

    // Non-generator helper
    resolveObjectKey(ctx) {
        if (ctx.STRING()) {
            const str = ctx.STRING().getText();
            return this._processStringEscapes(str.substring(1, str.length - 1));
        }
        // an integer literal: the integer range (spec v0.33.0), and "007" names key "7"
        if (ctx.INTEGER()) return String(this._intLiteral(ctx.INTEGER().getText(), ctx));
        return null;
    }

    *visitArrayAtom(ctx) {
        return yield* this.visit(ctx.arrayLiteral());
    }

    *visitListArray(ctx) {
        const arr = [];
        if (!ctx.expression()) return arr;

        for (const exprCtx of ctx.expression()) {
            arr.push(yield* this.visit(exprCtx));
        }
        return arr;
    }

    *visitRangeArray(ctx) {
        const startVal = yield* this.visit(ctx.rangeStart);
        const endVal = yield* this.visit(ctx.rangeEnd);

        if (typeof startVal !== 'number' || typeof endVal !== 'number') {
            throw this.createError('Range bounds must be numbers', ctx);
        }

        let stepVal = 1;
        if (ctx.rangeStep) {
            stepVal = yield* this.visit(ctx.rangeStep);
            if (typeof stepVal !== 'number') {
                throw this.createError('Range step must be a number', ctx);
            }
            if (stepVal <= 0) {
                throw this.createError('Range step must be positive', ctx);
            }
        }

        const { scale, start, end, step } = this.scaleRangeNumbers(startVal, endVal, stepVal);
        const increment = start > end ? -step : step;
        const arr = [];

        if (increment > 0n) {
            for (let value = start; value <= end; value += increment) {
                arr.push(this.unscaleRangeNumber(value, scale));
            }
        } else {
            for (let value = start; value >= end; value += increment) {
                arr.push(this.unscaleRangeNumber(value, scale));
            }
        }
        return arr;
    }

    scaleRangeNumbers(startVal, endVal, stepVal) {
        const startText = this.toPlainNumberString(startVal);
        const endText = this.toPlainNumberString(endVal);
        const stepText = this.toPlainNumberString(stepVal);
        const scale = Math.max(
            this.getRangeScale(startText),
            this.getRangeScale(endText),
            this.getRangeScale(stepText)
        );

        return {
            scale,
            start: this.scaleRangeNumber(startText, scale),
            end: this.scaleRangeNumber(endText, scale),
            step: this.scaleRangeNumber(stepText, scale)
        };
    }

    toPlainNumberString(value) {
        const text = String(value);
        if (!/[eE]/.test(text)) return text;

        const negative = text.startsWith('-');
        const unsigned = negative ? text.slice(1) : text;
        const [mantissa, exponentText] = unsigned.split(/[eE]/);
        const exponent = Number(exponentText);
        const [wholePart, fractionPart = ''] = mantissa.split('.');
        const digits = wholePart + fractionPart;
        const decimalIndex = wholePart.length + exponent;
        let plain;

        if (decimalIndex <= 0) {
            plain = '0.' + '0'.repeat(-decimalIndex) + digits;
        } else if (decimalIndex >= digits.length) {
            plain = digits + '0'.repeat(decimalIndex - digits.length);
        } else {
            plain = digits.slice(0, decimalIndex) + '.' + digits.slice(decimalIndex);
        }

        if (plain.startsWith('.')) {
            plain = '0' + plain;
        }

        return negative && plain !== '0' ? '-' + plain : plain;
    }

    getRangeScale(valueText) {
        const parts = valueText.split('.');
        return parts.length === 2 ? parts[1].length : 0;
    }

    scaleRangeNumber(valueText, scale) {
        const negative = valueText.startsWith('-');
        const unsigned = negative ? valueText.slice(1) : valueText;
        const [wholePart, fractionPart = ''] = unsigned.split('.');
        const digits = (wholePart || '0') + fractionPart.padEnd(scale, '0');
        const scaled = BigInt(digits);
        return negative ? -scaled : scaled;
    }

    unscaleRangeNumber(value, scale) {
        if (scale === 0) return Number(value);

        const negative = value < 0n;
        let digits = (negative ? -value : value).toString();
        if (digits.length <= scale) {
            digits = '0'.repeat(scale - digits.length + 1) + digits;
        }

        const wholePart = digits.slice(0, digits.length - scale);
        const fractionPart = digits.slice(digits.length - scale).replace(/0+$/, '');
        const text = fractionPart.length === 0 ? wholePart : wholePart + '.' + fractionPart;
        return Number(negative ? '-' + text : text);
    }

    // Member access
    *visitMemberAccessExpr(ctx) {
        const targetObj = yield* this.visit(ctx.expression(0));
        const key = yield* this.visit(ctx.access());
        return this._readMember(targetObj, key, ctx);
    }

    // obj.key, for an expression and for each link of an assignment chain, as the reference reads
    // both. An object has only its own keys; a number or boolean has no properties at all.
    _readMember(targetObj, key, ctx) {
        if (targetObj === null) {
            throw this.createError(`Cannot access property '${key}' of null`, ctx);
        }

        // spec v0.8.0 (#4): member access on the null value fails like a missing property
        if (targetObj === TEE_NULL) {
            throw this.createError(`Property '${key}' does not exist`, ctx);
        }

        // Object access: integer keys become string keys (no positional access)
        if (typeof key === 'number' && typeof targetObj === 'object' && !Array.isArray(targetObj)) {
            const strKey = String(key);
            if (!hasOwnKey(targetObj, strKey)) {
                throw this.createError(`Property '${key}' does not exist`, ctx);
            }
            return targetObj[strKey];
        }

        // Array access: convert 1-based to 0-based
        if (Array.isArray(targetObj)) {
            this._checkIndex('Array', key, ctx);
            const idx = key - 1;
            if (idx < 0 || idx >= targetObj.length) {
                throw this.createError('Array index out of bounds', ctx);
            }
            return targetObj[idx];
        }

        // String character access: convert 1-based to 0-based
        if (typeof targetObj === 'string') {
            this._checkIndex('String', key, ctx);
            const idx = key - 1;
            if (idx < 0 || idx >= targetObj.length) {
                throw this.createError('String index out of bounds', ctx);
            }
            return targetObj[idx];
        }

        if (typeof targetObj !== 'object' || !hasOwnKey(targetObj, key)) {
            throw this.createError(`Property '${key}' does not exist`, ctx);
        }

        return targetObj[key];
    }

    // An array or string index (spec v0.34.0) is an integer: a fraction is an error, where
    // targetObj[0.5] would read undefined and an assignment would add a hidden property.
    _checkIndex(what, key, ctx) {
        if (typeof key !== 'number') throw this.createError(`${what} index must be a number`, ctx);
        if (!Number.isInteger(key)) throw this.createError(`${what} index must be an integer`, ctx);
    }

    // Access visitors
    *visitStaticAccess(ctx) {
        return ctx.ID().getText();
    }

    *visitVarEvalAccess(ctx) {
        const varName = ctx.ID().getText();

        // $::var — resolve from globals/properties directly (same as ::var)
        if (ctx.GLOBAL_PREFIX()) {
            const variables = this._getVariables();
            if (varName in variables) return variables[varName];
            if (varName in this.properties) return this.properties[varName];
            return undefined;
        }

        const scopeStack = this._getScopeStack();
        const variables = this._getVariables();

        // Check scope stack first
        for (let i = scopeStack.length - 1; i >= 0; i--) {
            if (varName in scopeStack[i]) return scopeStack[i][varName];
        }

        // Inside a function: $key only checks local scope
        if (this._isInFunctionScope()) return undefined;

        if (varName in variables) return variables[varName];
        if (varName in this.properties) return this.properties[varName];
        return undefined;
    }

    *visitArrayAccess(ctx) {
        return this._intLiteral(ctx.INTEGER().getText(), ctx); // 1-based; member access converts for arrays
    }

    *visitStringKeyAccess(ctx) {
        const str = ctx.STRING().getText();
        return this._processStringEscapes(str.substring(1, str.length - 1));
    }

    *visitEvalAccess(ctx) {
        return yield* this.visit(ctx.expression());
    }

    // Operators
    *visitUnaryMinusExpr(ctx) {
        const value = yield* this.visit(ctx.expression());
        if (typeof value !== 'number') {
            throw this.createError(`Unary minus requires numeric operand. Got -${typeof value}`, ctx);
        }
        return -value;   // the integer range is symmetric (spec v0.33.0)
    }

    *visitNotExpr(ctx) {
        const value = yield* this.visit(ctx.expression());
        if (typeof value !== 'boolean') {
            throw this.createError(`Logical NOT requires boolean operand. Got not ${typeof value}`, ctx);
        }
        return !value;
    }

    *visitMultiplicativeExpr(ctx) {
        const left = yield* this.visit(ctx.expression(0));
        const right = yield* this.visit(ctx.expression(1));
        const op = ctx.children[1].getText();

        if (typeof left !== 'number' || typeof right !== 'number') {
            throw this.createError(`Arithmetic operator '${op}' requires numeric operands. Got ${typeof left} ${op} ${typeof right}`, ctx);
        }

        if (op === '*') {
            if (this._isIntValue(left) && this._isIntValue(right)) {
                return this._intArith(left, right, '*', ctx);   // 32-bit envelope (spec v0.13.0)
            }
            return this._finite(left * right, ctx);
        }
        if (op === '/' || op === '%') {
            if (right === 0) throw this.createError('Division by zero', ctx);
            return this._finite(op === '/' ? left / right : left % right, ctx);
        }
    }

    *visitAdditiveExpr(ctx) {
        const left = yield* this.visit(ctx.expression(0));
        const right = yield* this.visit(ctx.expression(1));
        const op = ctx.children[1].getText();

        if (op === '+') {
            if (typeof left === 'number' && typeof right === 'number') {
                if (this._isIntValue(left) && this._isIntValue(right)) {
                    return this._intArith(left, right, '+', ctx);   // 32-bit envelope (spec v0.13.0)
                }
                return this._finite(left + right, ctx);
            }
            if (typeof left === 'string' || typeof right === 'string') {
                return this.functions['TO_STRING'](left) + this.functions['TO_STRING'](right);
            }
            throw this.createError(`Addition requires numeric or string operands. Got ${typeof left} + ${typeof right}`, ctx);
        }
        if (op === '-') {
            if (typeof left !== 'number' || typeof right !== 'number') {
                throw this.createError(`Subtraction requires numeric operands. Got ${typeof left} - ${typeof right}`, ctx);
            }
            if (this._isIntValue(left) && this._isIntValue(right)) {
                return this._intArith(left, right, '-', ctx);   // 32-bit envelope (spec v0.13.0)
            }
            return this._finite(left - right, ctx);
        }
    }

    *visitComparisonExpr(ctx) {
        const left = yield* this.visit(ctx.expression(0));
        const right = yield* this.visit(ctx.expression(1));
        const op = ctx.op.getText();

        if (op === '>' || op === '<' || op === '>=' || op === '<=') {
            if (typeof left !== 'number' || typeof right !== 'number') {
                throw this.createError(`Comparison operator '${op}' requires numeric operands. Got ${typeof left} ${op} ${typeof right}`, ctx);
            }
        }

        switch (op) {
            case '>': return left > right;
            case '<': return left < right;
            case '==': return this._deepEqual(left, right);
            case '>=': return left >= right;
            case '<=': return left <= right;
            case '!=': return !this._deepEqual(left, right);
            default: return false;
        }
    }

    // Spec v0.7.0 (#2): and/or SHORT-CIRCUIT left to right — the right operand is not evaluated
    // (side effects included) when the left side decides; operands are type-checked only when evaluated.
    *visitAndExpr(ctx) {
        const left = yield* this.visit(ctx.expression(0));
        if (typeof left !== 'boolean') {
            throw this.createError(`Logical AND requires boolean operands. Got ${this._valueTypeName(left)}`, ctx);
        }
        if (!left) return false;
        const right = yield* this.visit(ctx.expression(1));
        if (typeof right !== 'boolean') {
            throw this.createError(`Logical AND requires boolean operands. Got ${this._valueTypeName(right)}`, ctx);
        }
        return right;
    }

    *visitOrExpr(ctx) {
        const left = yield* this.visit(ctx.expression(0));
        if (typeof left !== 'boolean') {
            throw this.createError(`Logical OR requires boolean operands. Got ${this._valueTypeName(left)}`, ctx);
        }
        if (left) return true;
        const right = yield* this.visit(ctx.expression(1));
        if (typeof right !== 'boolean') {
            throw this.createError(`Logical OR requires boolean operands. Got ${this._valueTypeName(right)}`, ctx);
        }
        return right;
    }

    // --- Function Call ---

    *visitFuncAtom(ctx) {
        return yield* this.visit(ctx.functionCall());
    }

    *visitFunctionCall(ctx) {
        const funcName = ctx.funcName.text;

        if (this.ignoredFunctions.has(funcName))
            throw this.createError(`'${funcName}' is not available in this environment`, ctx);

        // Evaluate arguments (expressions are atomic via yield*)
        const args = [];
        if (ctx.expression()) {
            for (const exprCtx of ctx.expression()) {
                args.push(yield* this.visit(exprCtx));
            }
        }

        if (ctx.moduleAlias) {
            const module = this._resolveModuleAlias(ctx.moduleAlias.text, ctx);
            const funcDef = module.functions[funcName];
            if (!funcDef) {
                throw this.createError(`Unknown function '${ctx.moduleAlias.text}::${funcName}'`, ctx);
            }
            // _callUserFunction performs the return copy when crossing into the module context.
            return yield* this._callUserFunction(funcName, args, ctx, module);
        }

        // User-defined function (spec v0.11.0: name resolution is host-blocked ->
        // script-defined functions -> built-ins/externals, so a script function
        // shadows any same-named built-in or external)
        const functionMap = this._functionMap();
        if (functionMap[funcName]) {
            return yield* this._callUserFunction(funcName, args, ctx, this._getCurrentModule());
        }

        // FAIL/UNWRAP (spec v0.10.0) are dispatched here — not via the builtin table —
        // so their errors carry the call site's line:col (interpreter-level builtins,
        // like the reference runtime's PRINT/SLEEP dispatch).
        if (funcName === 'FAIL') {
            if (args.length !== 1) throw this.createError('FAIL() requires a message argument', ctx);
            throw this.createError(this.functions['TO_STRING'](args[0]), ctx);
        }
        if (funcName === 'UNWRAP') {
            if (args.length < 1 || args.length > 2) throw this.createError('UNWRAP() requires (result, [message])', ctx);
            const res = args[0];
            if (!isGenuineResult(res)) throw this.createError('UNWRAP() requires a Result', ctx);
            if (res.ok === true) return res.value;
            const valueText = this.functions['TO_STRING'](res.value);
            throw this.createError(
                args.length > 1 ? this.functions['TO_STRING'](args[1]) + ': ' + valueText : valueText, ctx);
        }

        // SLEEP's argument errors carry the call site's line:col too, as in the reference runtime
        // (spec v0.36.0); the builtin table entry still makes the scheduler command.
        if (funcName === 'SLEEP') {
            if (typeof args[0] !== 'number') throw this.createError('SLEEP() requires a number argument', ctx);
            if (args[0] < 0) throw this.createError('SLEEP() duration cannot be negative', ctx);
        }

        // Built-in function. Its error carries the position of the call (spec v0.37.0), and so
        // does a host function's exception, so the script's `on error` sees it.
        if (this.functions[funcName]) {
            let result;
            try {
                result = this.functions[funcName](...args);
            } catch (e) {
                if (e instanceof AsyncPendingError) throw e;
                throw this._atCall(e, ctx);
            }

            // SLEEP returns a scheduler command
            if (result && result.__schedulerCommand) {
                yield result; // Yield the command to the scheduler
                return {};
            }

            return result;
        }

        throw this.createError(`Unknown function '${funcName}'`, ctx);
    }

    _resolveModuleAlias(alias, ctx) {
        if (this._getCurrentModule()) {
            throw this.createError('Imported modules cannot call entry import aliases', ctx);
        }
        const module = this.moduleAliases[alias];
        if (!module) throw this.createError(`Unknown module alias '${alias}'`, ctx);
        return module;
    }

    // Generator-based user function call
    *_callUserFunction(funcName, args, callCtx, module = this._getCurrentModule()) {
        const funcDef = (module ? module.functions : this.userDefinedFunctions)[funcName];
        const params = funcDef.params;
        const body = funcDef.body;

        // Validate at the caller before switching source/module context; an arity error belongs
        // to the call site, not to the callee source.
        if (args.length > params.length) {
            throw this.createError(
                `Function '${funcName}' expects ${params.length} argument(s), but ${args.length} were provided`,
                callCtx
            );
        }
        const previousModule = this._getCurrentModule();
        const crossingModuleBoundary = previousModule !== module;
        let previousScopeStack = null;
        if (crossingModuleBoundary) {
            if (this.activeThread) {
                previousScopeStack = this.activeThread.scopeStack;
                this.activeThread.scopeStack = [];
                this.activeThread.currentModule = module;
            } else {
                previousScopeStack = this.scopeStack;
                this.scopeStack = [];
                this.currentModule = module;
            }
        }
        const scopeStack = this._getScopeStack();

        // Create local scope with parameters
        const localScope = {};
        for (let i = 0; i < params.length; i++) {
            localScope[params[i]] = i < args.length ? this.deepCopy(args[i]) : {};
        }

        // Push scope
        scopeStack.push(localScope);
        const owner = this._trackerOwner();   // a call an `otherwise` block makes does not set its variable
        owner._calls = (owner._calls || 0) + 1;

        const previousFunctionContext = this.currentFunctionContext;
        this.currentFunctionContext = funcDef;

        try {
            if (body.statement()) {
                const stmts = body.statement();
                let si = 0;
                while (si < stmts.length) {
                    try {
                        yield stmts[si].start.line;
                        yield* this.visit(stmts[si]);
                        if (this.activeThread) this.activeThread.asyncResultCache = {};
                        si++;
                    } catch (inner) {
                        if (inner instanceof AsyncPendingError) {
                            yield { __schedulerCommand: true, type: 'AWAIT_ASYNC' };
                            continue;
                        }
                        throw this._positioned(inner, stmts[si]);
                    }
                }
            }

            // No explicit return: result is empty object {}
            return {};

        } catch (e) {
            if (e instanceof ReturnException) {
                return crossingModuleBoundary ? this.deepCopy(e.value) : e.value;
            }
            throw e;
        } finally {
            scopeStack.pop();
            owner._calls--;
            if (crossingModuleBoundary) {
                if (this.activeThread) {
                    this.activeThread.scopeStack = previousScopeStack;
                    this.activeThread.currentModule = previousModule;
                } else {
                    this.scopeStack = previousScopeStack;
                    this.currentModule = previousModule;
                }
            }
            this.currentFunctionContext = previousFunctionContext;
        }
    }

    // --- MULTI / Parallel ---

    *visitParallelExecStmt(ctx) {
        return yield* this.visitParallelStmt(ctx.parallelStmt());
    }

    *visitParallelStmt(ctx) {
        this._checkKeywordAllowed('multi', ctx);
        const variables = this._getVariables();
        const scopeStack = this._getScopeStack();
        const enclosingModule = this._getCurrentModule();

        // Extract optional result collection variable name: multi result do
        const resultVarName = ctx.resultVar ? ctx.resultVar.text : null;

        // spec v0.19.0: optional concurrency cap — evaluated once at multi entry, in textual
        // order (before the global snapshot and the setup phase). Must be a positive integer;
        // there is no "0 = unlimited". (Nominal identity is value-based here, like the rest of
        // this runtime — the `limit 2.0` corner tracks fixture 114's pending status.)
        let limit = Infinity;
        if (ctx.limitExpr) {
            const v = yield* this.visit(ctx.limitExpr);
            if (!this._isIntValue(v) || v <= 0) {
                throw this.createError('multi limit must be a positive integer', ctx.limitExpr);
            }
            limit = v;
        }

        // The monitor interval is checked here too, before the setup and before the first worker
        // starts (spec v0.37.0, as the reference runtime) — an interval out of range starts none.
        const monitorClause = ctx.monitorClause();
        const monitorInterval = monitorClause
            ? this._intLiteral(monitorClause.INTEGER().getText(), monitorClause)   // an INTEGER literal (the integer range)
            : 0;

        // Deep-copy snapshot of globals for thread purity
        const rootVariables = this.activeThread?.rootGlobalSnapshot || this.variables;
        const globalSnapshot = {};
        for (const key of Object.keys(rootVariables)) {
            globalSnapshot[key] = this.deepCopy(rootVariables[key]);
        }
        const sourceModuleViews = this.activeThread?.moduleSnapshots || this._liveModuleGlobals();
        const moduleSnapshots = {};
        for (const [identity, moduleGlobals] of Object.entries(sourceModuleViews)) {
            moduleSnapshots[identity] = this.deepCopy(moduleGlobals);
        }

        // Setup phase: execute the block body, collecting SPAWN specs
        // Push a scope so setup variables don't leak (:: required for globals, like functions)
        this._inMultiSetup = true;
        this._collectedSpawns = [];
        scopeStack.push({});

        try {
            yield* this.visitBlock(ctx.block());
        } finally {
            scopeStack.pop();
            this._inMultiSetup = false;
        }

        // If no spawns were collected, assign empty object if resultVarName set
        if (this._collectedSpawns.length === 0) {
            this._collectedSpawns = null;
            if (resultVarName !== null) {
                if (scopeStack.length > 0) {
                    scopeStack[scopeStack.length - 1][resultVarName] = {};
                } else {
                    variables[resultVarName] = {};
                }
            }
            return null;
        }

        // Resolve auto-keys for unnamed threads and check for collisions
        const allKeys = new Set();
        let autoPos = 1;
        for (let i = 0; i < this._collectedSpawns.length; i++) {
            const spawn = this._collectedSpawns[i];
            if (spawn.resultKey !== null && spawn.resultKey !== undefined) {
                allKeys.add(spawn.resultKey);
            }
        }
        for (let i = 0; i < this._collectedSpawns.length; i++) {
            const spawn = this._collectedSpawns[i];
            if (spawn.resultKey === null || spawn.resultKey === undefined) {
                const autoKey = "#" + autoPos;
                if (allKeys.has(autoKey)) {
                    throw this.createError(`Auto-generated key '${autoKey}' conflicts with an explicit key in multi block`, spawn.ctx);
                }
                allKeys.add(autoKey);
                spawn.resultKey = autoKey;
                autoPos++;
            }
        }

        // Build thread specs from collected spawns
        const resultKeyNames = [];
        const specs = [];

        for (let i = 0; i < this._collectedSpawns.length; i++) {
            const spawn = this._collectedSpawns[i];
            resultKeyNames.push(spawn.resultKey);

            if (this.ignoredFunctions.has(spawn.funcName)) {
                // Spec v0.13.0: a blocked function reached via a thread spawn fails THAT worker
                // only — a generator that throws on its first slice rides the scheduler's normal
                // worker-error path ([THREAD ERROR] + error Result, run continues). Previously
                // this threw here, failing the whole run during spawn processing.
                const blocked = this.createError(`'${spawn.funcName}' is not available in this environment`, spawn.ctx);
                specs.push({
                    name: `blocked-${spawn.funcName}-${i}`,
                    functionName: spawn.funcName,
                    generator: (function*() { throw blocked; })(),
                    localScope: null,
                    module: spawn.module
                });
                continue;
            }

            const spawnFunctionMap = spawn.module ? spawn.module.functions : this.userDefinedFunctions;
            if (spawnFunctionMap[spawn.funcName]) {
                const funcDef = spawnFunctionMap[spawn.funcName];
                const params = funcDef.params;

                // Argument count validation
                if (spawn.args.length > params.length) {
                    throw this.createError(
                        `Function '${spawn.funcName}' expects ${params.length} argument(s), but ${spawn.args.length} were provided`,
                        spawn.ctx
                    );
                }

                // Create local scope for the thread
                const localScope = {};
                for (let j = 0; j < params.length; j++) {
                    localScope[params[j]] = j < spawn.args.length ? this.deepCopy(spawn.args[j]) : {};
                }

                // Create a generator for this thread's execution
                const gen = this._createThreadGenerator(funcDef, localScope);

                specs.push({
                    name: `${spawn.funcName}-${i}`,
                    functionName: spawn.funcName,
                    generator: gen,
                    localScope: localScope,
                    module: spawn.module
                });
            } else if (this.functions[spawn.funcName]) {
                // Built-in function: wrap in a trivial generator. SLEEP's scheduler command is
                // yielded as at a call (spec v0.36.0): `thread t: SLEEP(300)` returned the command
                // object without sleeping, and its argument errors carry the spawn's position.
                const builtInFunc = this.functions[spawn.funcName];
                const capturedArgs = spawn.args;
                const self = this;
                const funcName = spawn.funcName;
                const spawnCtx = spawn.ctx;
                specs.push({
                    name: `builtin-${spawn.funcName}-${i}`,
                    functionName: spawn.funcName,
                    generator: (function*() {
                        if (funcName === 'SLEEP') {
                            if (typeof capturedArgs[0] !== 'number') throw self.createError('SLEEP() requires a number argument', spawnCtx);
                            if (capturedArgs[0] < 0) throw self.createError('SLEEP() duration cannot be negative', spawnCtx);
                        }
                        let result;
                        try {
                            result = builtInFunc(...capturedArgs);
                        } catch (e) {
                            if (e instanceof AsyncPendingError) throw e;
                            throw self._atCall(e, spawnCtx);   // at the spawn (spec v0.37.0)
                        }
                        if (result && result.__schedulerCommand) {
                            yield result;
                            return {};
                        }
                        return result;
                    })(),
                    localScope: null,
                    module: spawn.module
                });
            } else {
                throw this.createError(`Unknown function '${spawn.funcName}'`, spawn.ctx);
            }
        }

        this._collectedSpawns = null;

        // Monitor spec
        let monitorSpec = null;
        if (monitorClause) {
            monitorSpec = {
                interval: monitorInterval,
                blockCtx: monitorClause.block()
            };
        }

        // Yield SPAWN_THREADS command to the scheduler
        const collectedResults = yield {
            __schedulerCommand: true,
            type: 'SPAWN_THREADS',
            specs: specs,
            monitorSpec: monitorSpec,
            globalSnapshot: globalSnapshot,
            moduleSnapshots: moduleSnapshots,
            enclosingModule: enclosingModule,
            resultKeyNames: resultKeyNames,
            resultVarName: resultVarName,
            limit: limit
        };

        // When we resume, collectedResults contains the payload from child threads
        if (collectedResults) {
            const payload = collectedResults;
            const payloadResultVarName = payload.resultVarName;
            const collection = payload.collection;

            if (payloadResultVarName !== null && collection !== undefined) {
                // Assign the pre-built collection to resultVarName in appropriate scope
                if (scopeStack.length > 0) {
                    scopeStack[scopeStack.length - 1][payloadResultVarName] = collection;
                } else {
                    variables[payloadResultVarName] = collection;
                }
            }
        }

        return null;
    }

    // Create a generator for a thread function execution
    *_createThreadGenerator(funcDef, localScope) {
        const body = funcDef.body;

        // The activeThread will be set by the scheduler when this runs
        // We need to push the local scope onto the active thread's scope stack
        const scopeStack = this._getScopeStack();
        scopeStack.push(localScope);

        try {
            if (body.statement()) {
                const stmts = body.statement();
                let si = 0;
                while (si < stmts.length) {
                    try {
                        yield stmts[si].start.line;
                        yield* this.visit(stmts[si]);
                        if (this.activeThread) this.activeThread.asyncResultCache = {};
                        si++;
                    } catch (inner) {
                        if (inner instanceof AsyncPendingError) {
                            yield { __schedulerCommand: true, type: 'AWAIT_ASYNC' };
                            continue;
                        }
                        throw this._positioned(inner, stmts[si]);
                    }
                }
            }

            // No explicit return: result is empty object {}
            return {};

        } catch (e) {
            if (e instanceof ReturnException) {
                return e.value;
            }
            throw e;
        } finally {
            scopeStack.pop();
        }
    }
}

// What an `otherwise` block's statement asks of it (spec v0.37.0): nothing after an expression
// statement; leaving after a return or a member/element target; a variable target is
// {variable, global, leave: false}. SET_BY_BLOCK: the block set the variable itself.
const NONE = { variable: null, global: false, leave: false };
const LEAVE = { variable: null, global: false, leave: true };
const SET_BY_BLOCK = Symbol('set by the otherwise block');

// Flow control exceptions
class BreakException extends Error {
    constructor() {
        super('break');
        this.name = 'BreakException';
    }
}

class ContinueException extends Error {
    constructor() {
        super('continue');
        this.name = 'ContinueException';
    }
}

class ReturnException extends Error {
    constructor(value) {
        super('return');
        this.name = 'ReturnException';
        this.value = value;
    }
}

class AsyncPendingError extends Error {
    constructor() {
        super('async pending');
        this.name = 'AsyncPendingError';
    }
}
