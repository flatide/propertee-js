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

function resolver(sources) {
    return ({ moduleId, version }) => {
        const identity = version === null ? moduleId : `${moduleId}.${version}`;
        if (!Object.prototype.hasOwnProperty.call(sources, identity)) return null;
        return { moduleId, version, sourceId: `module:${identity}`, source: sources[identity] };
    };
}

async function evaluate(visitor, source) {
    return new Scheduler(visitor).run(visitor.visitRoot(parse(source)));
}

function check(condition, message) {
    if (!condition) throw new Error(message);
}

const output = [];
const modules = resolver({
    ok: 'function value() do return 7 end\n',
    outer: 'import inner as i\nfunction value() do return 1 end\n',
    isolated: 'function read() do return ::secret end\n'
});
const visitor = new ProperTeeCustomVisitor({}, {}, {
    stdout: (...args) => output.push(args.join(' ')),
    stderr: () => {}
}, { sourceId: 'entry.tee', moduleResolver: modules });

// A later invalid import cannot execute entry code or leave an earlier alias installed.
let failed = false;
try {
    await evaluate(visitor, 'import ok as good\nimport outer as bad\nPRINT("must not run")\n');
} catch (e) {
    failed = e.message.includes("module:outer line 1:0")
        && e.message.includes('cannot contain import statements');
}
check(failed, 'nested import was not rejected with module source identity');
check(output.length === 0, 'entry side effect ran before all imports validated');

await evaluate(visitor, 'import ok as good\nPRINT(good::value())\n');
check(output.join('\n') === '7', 'failed import polluted the persistent visitor namespace');

// Entry globals are not visible through an imported function.
const isolated = new ProperTeeCustomVisitor({}, {}, { stdout: () => {}, stderr: () => {} },
    { sourceId: 'entry.tee', moduleResolver: modules });
let isolatedFailure = false;
try {
    await evaluate(isolated,
        'import isolated as lib\nsecret = 99\nPRINT(lib::read())\n');
} catch (e) {
    isolatedFailure = e.message.includes('module:isolated line 1:26')
        && e.message.includes("Global variable 'secret' is not defined");
}
check(isolatedFailure, 'module globals were not isolated from entry globals');

console.log('OK');
