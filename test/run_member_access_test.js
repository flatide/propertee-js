#!/usr/bin/env node
// Runtime test: obj.key fails as on the Java runtime when the key is not there. A number or boolean
// has no properties, and an object has only its own keys, so the names every JS object inherits
// (toString, constructor, __proto__) are missing too and no assignment chain reaches
// Object.prototype. The expected messages are the Java runtime's. Prints "OK" when every case behaves.
import antlr4 from 'antlr4';
import ProperTeeLexer from '../ProperTeeLexer.js';
import ProperTeeParser from '../ProperTeeParser.js';
import ProperTeeCustomVisitor from '../ProperTeeCustomVisitor.js';
import Scheduler from '../Scheduler.js';

function parse(source) {
    const lexer = new ProperTeeLexer(new antlr4.InputStream(source));
    const parser = new ProperTeeParser(new antlr4.CommonTokenStream(lexer));
    lexer.removeErrorListeners();
    parser.removeErrorListeners();
    return parser.root();
}

// The script's printed lines, then its error message if it fails.
async function run(source) {
    const lines = [];
    const visitor = new ProperTeeCustomVisitor({}, {}, {
        stdout: (...args) => lines.push(args.join(' ')),
        stderr: () => {}
    }, {});
    try {
        await new Scheduler(visitor).run(visitor.visitRoot(parse(source)));
    } catch (e) {
        lines.push(e.message);
    }
    return lines.join('\n');
}

const failures = [];
async function expect(source, expected) {
    const actual = await run(source);
    if (actual !== expected) {
        failures.push(`${JSON.stringify(source)}:\n  expected ${JSON.stringify(expected)}\n  actual   ${JSON.stringify(actual)}`);
    }
}
const missing = (at, key) => `Runtime Error at line ${at}: Property '${key}' does not exist`;

// A number or boolean has no properties, read or written; nor does a string or null take one.
await expect('x = 1\nPRINT(x.foo)', missing('2:7', 'foo'));
await expect('x = 1.5\nPRINT(x.$(1))', missing('2:7', '1'));
await expect('b = false\nk = "z"\nPRINT(b.$k)', missing('3:7', 'z'));
await expect('x = 1\nx.foo = 2', missing('2:1', 'foo'));
await expect('o = {"n": 1}\no.n.k = 2', missing('2:1', 'k'));
await expect('s = "abc"\ns.x = 1', missing('2:1', 'x'));
await expect('n = null\nn.x = 1', missing('2:1', 'x'));

// Names an object inherits from Object.prototype are not its keys.
await expect('o = {"a": 1}\nPRINT(o.toString)', missing('2:7', 'toString'));
await expect('o = {"a": 1}\nPRINT(o.constructor)', missing('2:7', 'constructor'));
await expect('o = {"a": 1}\nPRINT(o."__proto__")', missing('2:7', '__proto__'));
await expect('PRINT(SORT_BY([{"a": 2}, {"a": 1}], "toString"))',
    "Runtime Error at line 1:7: Property 'toString' does not exist in array element at index 1");   // at the call (spec v0.37.0)

// Each link of an assignment chain is read the same way, so the chain cannot reach Object.prototype.
await expect('o = {}\no."__proto__".polluted = 1', missing('2:1', '__proto__'));
await expect('o = {}\no.constructor.x = 1', missing('2:1', 'constructor'));
if ({}.polluted !== undefined || {}.x !== undefined) failures.push('Object.prototype was written');
await expect('a = {}\na.b.c = 1', missing('2:1', 'b'));
await expect('a = [1]\na.5.x = 1', 'Runtime Error at line 2:1: Array index out of bounds');

// A key named like an Object.prototype method is ordinary data.
const data = 'o = JSON_PARSE("{\\"hasOwnProperty\\": 1, \\"a\\": 2}").value\n';
await expect(data + 'PRINT(HAS_KEY(o, "a"), HAS_KEY(o, "b"), HAS_KEY({}, "constructor"))', 'true false false');
await expect(data + 'loop k, v in o do\n    PRINT(k, v)\nend', 'hasOwnProperty 1\na 2');
await expect(data + 'PRINT(o == {"hasOwnProperty": 1, "a": 2}, o.hasOwnProperty)', 'true 1');

// Keys that exist read and write as before.
await expect('o = {"1": "one", "a": {"b": [10, 20]}}\nk = "a"\nPRINT(o.1, o.a.b.2, o.$k.b.1)\n' +
    'o.a.b.2 = 99\no.a.c = {}\no.a.c.d = 5\nPRINT(o)',
    'one 20 10\n{ "1": \'one\', "a": { "b": [ 10, 99 ], "c": { "d": 5 } } }');

if (failures.length === 0) {
    console.log('OK');
} else {
    for (const f of failures) console.error(f);
    process.exit(1);
}
