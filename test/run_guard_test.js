#!/usr/bin/env node
// Host-API test (spec v0.13.0): interpreter-dispatched names (PRINT, SLEEP, FAIL, UNWRAP)
// cannot be replaced — registering an external under one of them throws at registration time.
// Prints "OK" when every case behaves.
import ProperTeeCustomVisitor from '../ProperTeeCustomVisitor.js';

const visitor = new ProperTeeCustomVisitor({}, {}, {
    stdout: () => {},
    stderr: () => {}
}, {});

const failures = [];

for (const name of ['PRINT', 'SLEEP', 'FAIL', 'UNWRAP']) {
    try {
        visitor.registerExternal(name, () => 1);
        failures.push(`registerExternal(${name}) did not throw`);
    } catch (e) {
        if (!e.message.includes(`'${name}'`)) failures.push(`registerExternal(${name}): ${e.message}`);
    }
    try {
        visitor.registerExternalAsync(name, () => 1);
        failures.push(`registerExternalAsync(${name}) did not throw`);
    } catch (e) {
        if (!e.message.includes(`'${name}'`)) failures.push(`registerExternalAsync(${name}): ${e.message}`);
    }
}

// A non-reserved ALL-CAPS name still registers fine (that namespace belongs to the host).
try {
    visitor.registerExternal('ANSWER', () => 42);
} catch (e) {
    failures.push(`registerExternal(ANSWER) should be allowed: ${e.message}`);
}

if (failures.length === 0) {
    console.log('OK');
} else {
    for (const f of failures) console.error(f);
    process.exit(1);
}
