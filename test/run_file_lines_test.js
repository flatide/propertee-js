#!/usr/bin/env node
// Builtin test (spec v0.26.0): FILE_LINES is a plain-array builtin, not a Result one. This runtime
// has no file system, so its stub raises a runtime error (a host installs the real array as a
// builtin, as the playground does), the lint knows the name, and a script hitting the stub ends
// as any runtime error does. Prints "OK" when every case behaves.
import { spawnSync } from 'child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import ProperTeeCustomVisitor from '../ProperTeeCustomVisitor.js';
import checkScript from '../checkScript.js';

const failures = [];
function expect(label, actual, expected) {
    const a = JSON.stringify(actual), e = JSON.stringify(expected);
    if (a !== e) failures.push(`${label}:\n  expected ${e}\n  actual   ${a}`);
}

const visitor = new ProperTeeCustomVisitor({}, {}, { stdout: () => {}, stderr: () => {} }, {});
let message = 'no error';
try {
    visitor.functions.FILE_LINES('/data/a.txt');
} catch (e) {
    message = e.message;
}
expect('the stub raises a runtime error', message,
    'Runtime Error: FILE_LINES() is not available in this environment');
expect('known to the lint', visitor.knownFunctionNames().includes('FILE_LINES'), true);
expect('a loop over it lints clean',
    checkScript('loop line in FILE_LINES("/data/a.txt") infinite do\n    PRINT(line)\nend\n').ok, true);

// a host installs the real thing as a builtin: a plain array, and a missing file a runtime error
visitor.functions.FILE_LINES = (p) => {
    if (p !== '/data/a.txt') throw new Error("Runtime Error: FILE_LINES() cannot read '" + p + "': no such file");
    return ['a', 'b'];
};
expect('host-provided array', visitor.functions.FILE_LINES('/data/a.txt'), ['a', 'b']);

// end to end: the stub's error ends the script like any runtime error
const PT = join(dirname(fileURLToPath(import.meta.url)), '..', 'pt.js');
const dir = mkdtempSync(join(tmpdir(), 'pt-file-lines-'));
try {
    const file = join(dir, 's.tee');
    writeFileSync(file, 'PRINT("before")\nloop line in FILE_LINES("/data/a.txt") do\n    PRINT(line)\nend\nPRINT("never")\n');
    const r = spawnSync(process.execPath, [PT, file], { encoding: 'utf-8' });
    expect('script: output before the error', r.stdout, 'before\n');
    expect('script: the error line', r.stderr.trim(),   // at the call (spec v0.37.0)
        'Runtime error: Runtime Error at line 2:14: FILE_LINES() is not available in this environment');
    expect('script: exit code', r.status, 1);
} finally {
    rmSync(dir, { recursive: true, force: true });
}

if (failures.length === 0) {
    console.log('OK');
} else {
    for (const f of failures) console.error(f);
    process.exit(1);
}
