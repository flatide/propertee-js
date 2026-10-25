#!/usr/bin/env node
// Host-API test (spec v0.36.0): numbers are finite, so a host's Infinity or NaN is refused where it
// comes in — an external's return becomes an error Result, a property stops the run before it
// starts — the same messages as the Java runtime's InterpreterTest and FacadeTest.
// Prints "OK" when every case behaves.
import antlr4 from 'antlr4';
import ProperTeeLexer from '../ProperTeeLexer.js';
import ProperTeeParser from '../ProperTeeParser.js';
import ProperTeeCustomVisitor from '../ProperTeeCustomVisitor.js';
import Scheduler from '../Scheduler.js';

const failures = [];
function errorOf(fn) {
    try {
        fn();
        return 'no error';
    } catch (e) {
        return e.message;
    }
}

async function run(source, setup) {
    const out = [];
    const visitor = new ProperTeeCustomVisitor({}, {}, { stdout: (...a) => out.push(a.join(' ')), stderr: (...a) => out.push(a.join(' ')) }, {});
    setup(visitor);
    const tree = new ProperTeeParser(new antlr4.CommonTokenStream(new ProperTeeLexer(new antlr4.InputStream(source)))).root();
    await new Scheduler(visitor).run(visitor.visitRoot(tree));
    return out.join('\n');
}

const externals = await run('r = NOTHING()\nPRINT(r.ok, r.value)\nr = ROWS()\nPRINT(r.ok, r.value)\nr = FINE()\nPRINT(r.ok, r.value)\nr = LATER()\nPRINT(r.ok, r.value)\n', (v) => {
    v.registerExternal('NOTHING', () => NaN);
    v.registerExternal('ROWS', () => ProperTeeCustomVisitor.ok([1, { rate: -Infinity }]));
    v.registerExternal('FINE', () => ProperTeeCustomVisitor.ok(Number.MAX_VALUE));
    v.registerExternalAsync('LATER', async () => ProperTeeCustomVisitor.ok(Infinity));
});
const wantExternals = [
    'false NOTHING() result is NaN, which ProperTee numbers cannot represent',
    'false ROWS() result.2.rate is -Infinity, which ProperTee numbers cannot represent',
    'true 1.7976931348623157e+308',
    'false LATER() result is Infinity, which ProperTee numbers cannot represent'
].join('\n');
if (externals !== wantExternals) failures.push(`externals:\n${externals}\nwant\n${wantExternals}`);

const props = errorOf(() => new ProperTeeCustomVisitor({ rates: [0.5, Infinity] }, {}, { stdout: () => {}, stderr: () => {} }, {}));
const wantProps = 'Runtime Error: rates.2 is Infinity, which ProperTee numbers cannot represent';
if (props !== wantProps) failures.push(`props: ${props}, want ${wantProps}`);

if (failures.length === 0) {
    console.log('OK');
} else {
    for (const f of failures) console.error(f);
    process.exit(1);
}
