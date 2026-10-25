#!/usr/bin/env node
// Builtin test (spec v0.33.0): RANDOM(min, max) can give every integer from min to max. It used to
// scale Math.random(), whose 52 random bits step by 2 once the span passes 2^52, so the whole range
// gave only odd numbers — the same check as the Java runtime's BuiltinsTest.
// Prints "OK" when every case behaves.
import ProperTeeCustomVisitor from '../ProperTeeCustomVisitor.js';

const visitor = new ProperTeeCustomVisitor({}, {}, {
    stdout: () => {},
    stderr: () => {}
}, {});
const RANDOM = visitor.functions.RANDOM;
const MAX = 9007199254740991;

const failures = [];

for (const [min, max] of [[-MAX, MAX], [0, MAX], [-MAX, 0], [4000000000, 5000000000]]) {
    const parity = new Set();
    for (let k = 0; k < 200; k++) {
        const r = RANDOM(min, max);
        if (!Number.isSafeInteger(r) || r < min || r > max) failures.push(`RANDOM(${min}, ${max}) = ${r}`);
        parity.add(Math.abs(r % 2));
    }
    if (parity.size !== 2) failures.push(`RANDOM(${min}, ${max}) gave only ${[...parity][0] ? 'odd' : 'even'} numbers`);
}

const seen = new Set();
for (let k = 0; k < 300; k++) seen.add(RANDOM(1, 3));
if ([...seen].sort().join() !== '1,2,3') failures.push(`RANDOM(1, 3) gave ${[...seen].sort()}`);

for (const n of [MAX, -MAX, 0, 7]) {
    if (RANDOM(n, n) !== n) failures.push(`RANDOM(${n}, ${n}) = ${RANDOM(n, n)}`);
}
if (RANDOM(3.0, 3) !== 3) failures.push('RANDOM(3.0, 3) is not 3');

if (failures.length === 0) {
    console.log('OK');
} else {
    for (const f of failures) console.error(f);
    process.exit(1);
}
