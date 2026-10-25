#!/usr/bin/env node
// CLI test: `node pt.js --result-only script.tee` prints only the run's result, as JSON — the
// top-level return value, else the final `result` global, else {} (the Java CLI's rule). PRINT
// output is discarded; stderr diagnostics are kept; a runtime error goes to stderr with exit 1.
// Prints "OK" when every case behaves.
import { spawnSync } from 'child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const PT = join(dirname(fileURLToPath(import.meta.url)), '..', 'pt.js');
const dir = mkdtempSync(join(tmpdir(), 'pt-result-only-'));
const failures = [];

function run(source, args = ['--result-only']) {
    const file = join(dir, `s${Math.random().toString(36).slice(2)}.tee`);
    writeFileSync(file, source);
    const r = spawnSync(process.execPath, [PT, ...args, file], { encoding: 'utf-8' });
    return { code: r.status, out: r.stdout, err: r.stderr };
}

function expect(label, actual, expected) {
    const a = JSON.stringify(actual), e = JSON.stringify(expected);
    if (a !== e) failures.push(`${label}:\n  expected ${e}\n  actual   ${a}`);
}

try {
    expect('return value as JSON, PRINT discarded',
        run('PRINT("noise")\nreturn {"ok": true, "s": "a\\"b", "z": null}\n'),
        { code: 0, out: '{"ok":true,"s":"a\\"b","z":null}\n', err: '' });
    expect('return true', run('PRINT("hello")\nreturn true\n'), { code: 0, out: 'true\n', err: '' });
    expect('no return: the result global', run('PRINT(1)\nresult = [1, 2]\n').out, '[1,2]\n');
    expect('neither: {}', run('PRINT(1)\nx = 1\n').out, '{}\n');
    expect('an explicit return beats result', run('result = 5\nreturn\n').out, '{}\n');

    const threadErr = run('function bad() do\n    ::x = 1\nend\nmulti m do\n    thread w: bad()\nend\n'
        + 'PRINT("noise")\nreturn m.w.ok\n');
    expect('stderr kept: stdout', [threadErr.code, threadErr.out], [0, 'false\n']);
    expect('stderr kept: [THREAD ERROR]',
        threadErr.err.startsWith('[THREAD ERROR] Runtime Error at line 2:4: Cannot assign'), true);

    expect('runtime error: stderr, exit 1', run('PRINT("before")\ny = nope + 1\nreturn 1\n'),
        { code: 1, out: '', err: "Runtime error: Runtime Error at line 2:4: Variable 'nope' is not defined\n" });

    // spec v0.32.0: stdout carries only JSON, which has no form for Infinity or NaN — and since
    // spec v0.36.0 a script cannot make one: the arithmetic fails, as any runtime error does
    expect('a number too large to represent: a runtime error, exit 1', run('PRINT("noise")\nreturn TO_NUMBER("1e308") * 10\n'),
        { code: 1, out: '', err: 'Runtime error: Runtime Error at line 2:7: Number overflow: the result is too large to represent\n' });
    expect('the largest decimal is written', run('return TO_NUMBER("1.7976931348623157e308")\n'),
        { code: 0, out: '1.7976931348623157e+308\n', err: '' });

    const noScript = spawnSync(process.execPath, [PT, '--result-only'], { encoding: 'utf-8' });
    expect('no script: usage error', [noScript.status, noScript.stdout, noScript.stderr],
        [2, '', 'Error: --result-only needs a script file\n']);
    const missing = spawnSync(process.execPath, [PT, '--result-only', join(dir, 'missing.tee')],
        { encoding: 'utf-8' });
    expect('missing script: no REPL fallback', [missing.status, missing.stdout], [1, '']);

    // without the option nothing changes: program output, no result
    expect('default mode', run('PRINT("hello")\nreturn true\n', []), { code: 0, out: 'hello\n', err: '' });
} finally {
    rmSync(dir, { recursive: true, force: true });
}

if (failures.length === 0) {
    console.log('OK');
} else {
    for (const f of failures) console.error(f);
    process.exit(1);
}
