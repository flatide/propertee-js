#!/usr/bin/env node
// Host-API test: checkScript(source) — syntax + built-in typo lint in one call,
// and the visitor's knownFunctionNames()/lintUnknownFunctions() it is built on.
// Prints OK, or a diff per failure and exits nonzero.
import checkScript from '../checkScript.js';
import ProperTeeCustomVisitor from '../ProperTeeCustomVisitor.js';

let failures = 0;
function expectEqual(label, actual, expected) {
    const a = JSON.stringify(actual), e = JSON.stringify(expected);
    if (a !== e) {
        failures++;
        console.error(`${label}:\n  expected ${e}\n  actual   ${a}`);
    }
}

// 1. Clean script (dispatched FAIL is known; lowercase calls are never flagged,
//    including calls to functions that do not exist — they may be script functions).
{
    const r = checkScript('function helper() do\n    return 1\nend\nPRINT(LEN([1, 2]))\nhelper()\nnope()\n');
    expectEqual('clean script ok', r.ok, true);
    expectEqual('clean script problems', r.problems, []);
    expectEqual('FAIL/UNWRAP known', checkScript('FAIL("boom")\n').ok, true);
}

// 2. Typo with a suggestion, position at the call site.
{
    const r = checkScript('x = SHEL("echo hi")\n');
    expectEqual('typo flagged', r.problems, [{
        kind: 'unknown-function', line: 1, column: 5,   // from 1, as the error report (spec v0.37.0)
        message: "unknown function 'SHEL' (did you mean 'SHELL'?)",
        name: 'SHEL', suggestion: 'SHELL'
    }]);
}

// 3. Dead branches and thread spawns are scanned; distance-2 suggestions work.
{
    const r = checkScript(
        'if false then\n    JSON_PRASE("{}")\nend\nmulti r do\n    thread a: SHELLL("x")\nend\n');
    expectEqual('dead branch + spawn', r.problems.map(p => [p.name, p.line, p.suggestion]), [
        ['JSON_PRASE', 2, 'JSON_PARSE'],
        ['SHELLL', 5, 'SHELL']
    ]);
}

// 4. No suggestion when nothing is within edit distance 2.
{
    const r = checkScript('TOTALLY_NOT_A_FN()\n');
    expectEqual('no suggestion', r.problems[0].suggestion, null);
    expectEqual('no suggestion message', r.problems[0].message, "unknown function 'TOTALLY_NOT_A_FN'");
}

// 5. Syntax errors are reported alone — the lint needs a clean tree.
{
    const r = checkScript('if x then\nSHEL("x")\n');   // missing end AND a typo
    expectEqual('syntax reported', r.ok, false);
    expectEqual('syntax only (lint skipped)', r.problems.every(p => p.kind === 'syntax'), true);
}

// 6. Host-registered externals are known when the host's visitor is passed in.
{
    const visitor = new ProperTeeCustomVisitor({}, {}, { stdout() {}, stderr() {} }, {});
    visitor.registerExternal('MY_FN', () => 1);
    expectEqual('host external known', checkScript('MY_FN()\n', { visitor }).ok, true);
    expectEqual('host external absent on bare visitor', checkScript('MY_FN()\n').ok, false);
    expectEqual('knownFunctionNames includes it',
        visitor.knownFunctionNames().includes('MY_FN'), true);
}

// 7. knownFunctionNames: dispatched names present, full set enumerated on a bare visitor.
{
    const names = new ProperTeeCustomVisitor({}, {}, { stdout() {}, stderr() {} }, {}).knownFunctionNames();
    expectEqual('dispatched names present',
        ['FAIL', 'UNWRAP', 'PRINT', 'PRINTF', 'SLEEP'].every(n => names.includes(n)), true);
    expectEqual('catalog sample present',
        ['ALIGN_LEFT', 'CONTAINS', 'FILE_LINES', 'FORMAT', 'JSON_PARSE', 'LIST_DIR_NAMES', 'SHELL', 'TEXT', 'TRUNC', 'TYPE_OF'].every(n => names.includes(n)), true);
}

// 8. Load-time rules (spec v0.37.0) are problems too, from 1 like the rest.
{
    const r = checkScript('function f(r) do\n    v = r otherwise return\n    PRINT(v)\nend\nbreak\n');
    expectEqual('load rules flagged', r.problems, [
        { kind: 'load', line: 2, column: 21, message: "The value of 'return' must start on the same line" },
        { kind: 'load', line: 5, column: 1, message: "'break' must be inside a loop" }
    ]);
    expectEqual('a handler right after the imports is fine',
        checkScript('on error do\n    PRINT(_ERROR.message)\nend\nPRINT(1)\n').ok, true);
    expectEqual('a syntax error counts from 1',
        checkScript('x = (1\n').problems[0].column >= 1, true);
}

if (failures > 0) process.exit(1);
console.log('OK');
