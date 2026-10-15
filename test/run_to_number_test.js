#!/usr/bin/env node
// Builtin test (spec v0.25.0): TO_NUMBER reads exactly a decimal numeral. The shared fixtures
// 136/137 keep their .expected ASCII, so the non-ASCII digits and the characters only one runtime's
// trim used to ignore are checked here — the same list as the Java runtime's BuiltinsTest.
// Prints "OK" when every case behaves.
import ProperTeeCustomVisitor from '../ProperTeeCustomVisitor.js';

const visitor = new ProperTeeCustomVisitor({}, {}, {
    stdout: () => {},
    stderr: () => {}
}, {});
const TO_NUMBER = visitor.functions.TO_NUMBER;

const failures = [];
function errorOf(fn) {
    try {
        fn();
        return 'no error';
    } catch (e) {
        return e.message;
    }
}

const accepted = [
    ['42', 42], ['+5', 5], ['-5', -5], ['007', 7], ['-0', 0], ['2147483647', 2147483647],
    ['-2147483648', -2147483648], ['2147483648', 2147483648], ['5.0', 5], ['.5', 0.5], ['5.', 5],
    ['1e3', 1000], ['1E-3', 0.001], ['+.5e+2', 50], ['1e-999', 0], [' \t\n\u000B\f\r42\r\n', 42]
];
for (const [text, want] of accepted) {
    const got = TO_NUMBER(text);
    if (got !== want) failures.push(`TO_NUMBER(${JSON.stringify(text)}) = ${got}, want ${want}`);
}

const rejected = [
    '0x10', '0X10', '0o17', '0b101',                                   // js Number() read these
    '1f', '1.5d', '1D', '0x1p3', 'NaN', '１２', '١٢', // Java's parsers read these
    'Infinity', '-Infinity', '+Infinity',                              // both read these
    '', '   ', '1_000', '1,000', '.', '+', 'e5', '1e', '1e+', '- 5', '1 000', '++5', '5..0',
    ' 42', '﻿42', '42 ', '\u000142', '42\u001F'           // not TRIM whitespace
];
for (const text of rejected) {
    const got = errorOf(() => TO_NUMBER(text));
    if (got !== `Runtime Error: TO_NUMBER() cannot convert '${text}' to number`)
        failures.push(`TO_NUMBER(${JSON.stringify(text)}): ${got}`);
}

for (const text of ['1e999', ' -1e999 ', '9'.repeat(400)]) {
    const got = errorOf(() => TO_NUMBER(text));
    if (got !== `Runtime Error: TO_NUMBER() value out of range: '${text}'`)
        failures.push(`TO_NUMBER(${JSON.stringify(text)}): ${got}`);
}

const nonString = errorOf(() => TO_NUMBER(42));
if (nonString !== 'Runtime Error: TO_NUMBER() requires a string argument')
    failures.push(`TO_NUMBER(42): ${nonString}`);

if (failures.length === 0) {
    console.log('OK');
} else {
    for (const f of failures) console.error(f);
    process.exit(1);
}
