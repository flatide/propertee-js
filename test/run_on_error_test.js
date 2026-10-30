// Host-API test (spec v0.37.0): `on error` as a host sees it — the error reported before the
// handler runs, how the handler ended on the thrown error (`handler`), and _ERROR's fields.
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

const failures = [];
function expectEqual(label, actual, expected) {
    const a = JSON.stringify(actual), e = JSON.stringify(expected);
    if (a !== e) failures.push(`${label}:\n  expected ${e}\n  actual   ${a}`);
}

// Runs `source`; both channels go to one list, in order. Returns {lines, error}.
async function run(source, setup = () => {}, options = {}) {
    const lines = [];
    const visitor = new ProperTeeCustomVisitor({}, {}, {
        stdout: (...args) => lines.push(args.join(' ')),
        stderr: (...args) => lines.push(args.join(' '))
    }, options);
    setup(visitor, lines);
    try {
        await new Scheduler(visitor).run(visitor.visitRoot(parse(source)));
        return { lines, error: null };
    } catch (error) {
        return { lines, error };
    }
}

// 1. The error is reported first; the handler's value rides the error; the run still fails.
{
    const { lines, error } = await run('on error do\n    PRINT("handler:", _ERROR.message)\n    return {"failed": true}\nend\nFAIL("boom")\n');
    expectEqual('reported, then the handler', lines, ['Runtime error: Runtime Error at line 5:1: boom', 'handler: boom']);
    expectEqual('handler returned', error.handler.kind, 'returned');
    expectEqual('handler value', error.handler.value, { failed: true });
    expectEqual('the original error', error.message, 'Runtime Error at line 5:1: boom');
}

// 2. Without a return the host gets {}; an error in the handler ends it.
{
    const plain = await run('on error do\n    PRINT("h")\nend\nx = 1 / 0\n');
    expectEqual('no return gives {}', plain.error.handler.value, {});
    const failed = await run('on error do\n    x = nope\nend\nFAIL("first")\n');
    expectEqual('handler error lines', failed.lines, ['Runtime error: Runtime Error at line 4:1: first',
        "[HANDLER ERROR] Runtime Error at line 2:9: Variable 'nope' is not defined"]);
    expectEqual('handler failed', failed.error.handler.kind, 'failed');
    expectEqual('the run fails with the first error', failed.error.message, 'Runtime Error at line 4:1: first');
}

// 3. A host reporter replaces the reported line; without a handler nothing is reported.
{
    const reported = [];
    const { lines, error } = await run('on error do\n    PRINT("h")\nend\nFAIL("boom")\n',
        (visitor) => { visitor.failureReporter = (e) => reported.push(e.message); });
    expectEqual('reporter got it', reported, ['Runtime Error at line 4:1: boom']);
    expectEqual('only the handler printed', lines, ['h']);
    expectEqual('handled', error.handler.kind, 'returned');
    const bare = await run('PRINT("before")\nFAIL("boom")\n');
    expectEqual('no handler, not handled', bare.error.handler, undefined);
    expectEqual('no handler, nothing reported', bare.lines, ['before']);
}

// 4. _ERROR names the module an error came from, and a module's own handler does not run.
{
    const modules = ({ moduleId }) => moduleId !== 'util' ? null : {
        moduleId, version: null, sourceId: 'module:util',
        source: 'on error do\n    PRINT("not in import mode")\nend\nfunction boom(x) do\n    return x.missing\nend\n'
    };
    const { lines } = await run('import util as u\non error do\n    PRINT(_ERROR.source, _ERROR.line, _ERROR.column)\nend\nu::boom({})\n',
        () => {}, { moduleResolver: modules });
    expectEqual('module error source', lines, [
        "Runtime error: Runtime Error at module:util line 5:12: Property 'missing' does not exist",
        'module:util 5 12']);
}

// 5. An external's Result holds what the host returns or throws, as in the reference runtime.
{
    const { lines } = await run('r = HOST_VALUE()\nPRINT(r.ok, r.value)\ne = HOST_THROWS()\nPRINT(e.ok, e.value)\nn = HOST_RESULT()\nPRINT(n.ok, n.value.ok)\n',
        (visitor) => {
            visitor.registerExternal('HOST_VALUE', () => 42);
            visitor.registerExternal('HOST_THROWS', () => { throw new Error('host down'); });
            visitor.registerExternal('HOST_RESULT', () => ProperTeeCustomVisitor.error('as data'));
        });
    expectEqual('external results', lines, ['true 42', 'false host down', 'true false']);
}

// 6. A host function's exception is a runtime error at its call: the handler sees it, and in the
//    handler it ends the handler and the run keeps the original error. A worker's has its call's
//    position too.
{
    const refuse = (visitor) => { visitor.functions.REFUSE = () => { throw new Error('REFUSE(): not allowed'); }; };
    const main = await run('on error do\n    PRINT("handler:", _ERROR.message)\nend\nx = 1 + REFUSE()\n', refuse);
    expectEqual('host exception lines', main.lines, ['Runtime error: Runtime Error at line 4:9: REFUSE(): not allowed',
        'handler: REFUSE(): not allowed']);
    expectEqual('host exception handled', main.error.handler.kind, 'returned');
    const inHandler = await run('on error do\n    REFUSE()\nend\nFAIL("first")\n', refuse);
    expectEqual('in the handler, the original error', inHandler.error.message, 'Runtime Error at line 4:1: first');
    expectEqual('in the handler, a handler error', inHandler.error.handler.kind, 'failed');
    expectEqual('the handler error', inHandler.error.handler.error.message, 'Runtime Error at line 2:5: REFUSE(): not allowed');
    const worker = await run('multi do\n    thread bad: REFUSE()\nend\n', refuse);
    expectEqual('a worker\'s host exception', worker.lines, ['[THREAD ERROR] Runtime Error at line 2:17: REFUSE(): not allowed']);
}

// 7. An `otherwise` block sets its variable itself, not in a function it calls — one in another
//    module included, whose own `x` is not the caller's.
{
    const modules = ({ moduleId }) => moduleId !== 'util' ? null : {
        moduleId, version: null, sourceId: 'module:util', source: 'function g() do\n    x = 1\n    return x\nend\n'
    };
    const { error } = await run('import util as u\nfunction f() do\n    x = 99\n    x = ERR("no x") otherwise do\n'
        + '        u::g()\n    end\n    return x\nend\nPRINT(f())\n', () => {}, { moduleResolver: modules });
    expectEqual('a module function does not set the caller\'s x', error?.message,
        "Runtime Error at line 6:5: The 'otherwise' block must set 'x' or leave with continue, break, return or FAIL");
    const setup = await run('function f() do\n    x = ERR("no x") otherwise do\n        multi do\n            x = 1\n'
        + '        end\n    end\n    return x\nend\nPRINT(f())\n');
    expectEqual('a setup\'s own x is not the function\'s', setup.error?.message,
        "Runtime Error at line 6:5: The 'otherwise' block must set 'x' or leave with continue, break, return or FAIL");
}

// 8. Stops (the debugger's Stop). One while the handler runs ends it, and the run stays failed with
//    the original error — at a breakpoint in the handler, or in its SLEEP. One before the error
//    stops the run, without the handler. A stop never ends a run as completed.
async function debugRun(source, onPause, setup = () => {}) {
    const lines = [];
    const visitor = new ProperTeeCustomVisitor({}, {}, {
        stdout: (...args) => lines.push(args.join(' ')),
        stderr: (...args) => lines.push(args.join(' '))
    });
    const scheduler = new Scheduler(visitor);
    scheduler.setDebugMode(true);
    setup(visitor, scheduler);
    scheduler.onStep = (info) => { if (info.willPause) setTimeout(() => onPause(scheduler, info)); };
    try {
        await scheduler.run(visitor.visitRoot(parse(source)));
        return { lines, error: null };
    } catch (error) {
        return { lines, error };
    }
}
{
    const handler = 'on error do\n    PRINT("handler")\n    PRINT("never")\nend\nFAIL("boom")\n';
    const atBreakpoint = await debugRun(handler, (scheduler, info) => {
        if (info.line === 2) scheduler.debugStop();
        else { scheduler.setBreakpoints(new Set([2])); scheduler.debugContinue(); }
    });
    expectEqual('stopped at a handler breakpoint', atBreakpoint.lines, ['Runtime error: Runtime Error at line 5:1: boom']);
    expectEqual('the original error stays', atBreakpoint.error.message, 'Runtime Error at line 5:1: boom');
    expectEqual('the handler was stopped', atBreakpoint.error.handler, { kind: 'stopped', value: {}, error: null });

    const inSleep = await debugRun('on error do\n    PRINT("handler")\n    SLEEP(60000)\n    PRINT("never")\nend\nFAIL("boom")\n',
        (scheduler) => { scheduler.debugContinue(); setTimeout(() => scheduler.debugStop(), 100); });
    expectEqual('stopped in the handler\'s SLEEP', inSleep.lines, ['Runtime error: Runtime Error at line 6:1: boom', 'handler']);
    expectEqual('the original error stays, after SLEEP', inSleep.error.message, 'Runtime Error at line 6:1: boom');
    expectEqual('the handler was stopped, in SLEEP', inSleep.error.handler.kind, 'stopped');

    const before = await debugRun('on error do\n    PRINT("handler")\nend\nSLEEP(60000)\nFAIL("boom")\n',
        (scheduler) => { scheduler.debugContinue(); setTimeout(() => scheduler.debugStop(), 100); });
    expectEqual('a stop before the error', before.error.message, 'Execution stopped by user');
    expectEqual('no handler after a stop', before.lines, []);

    // A host function that stops the run and then throws: the stop came first, so it is a stop.
    const halt = (visitor, scheduler) => {
        visitor.functions.HALT = () => { scheduler.debugStop(); throw new Error('killed'); };
    };
    const haltMain = await debugRun('on error do\n    PRINT("handler")\nend\nx = 1 + HALT()\n',
        (scheduler) => scheduler.debugContinue(), halt);
    expectEqual('a host function stops, then throws', haltMain.error.message, 'Execution stopped by user');
    expectEqual('no report and no handler', haltMain.lines, []);
    const haltHandler = await debugRun('on error do\n    HALT()\n    PRINT("never")\nend\nFAIL("boom")\n',
        (scheduler) => scheduler.debugContinue(), halt);
    expectEqual('in the handler, the original error stays', haltHandler.error.message, 'Runtime Error at line 5:1: boom');
    expectEqual('in the handler, stopped', haltHandler.error.handler, { kind: 'stopped', value: {}, error: null });
    expectEqual('no handler error', haltHandler.lines, ['Runtime error: Runtime Error at line 5:1: boom']);
}

if (failures.length > 0) {
    for (const f of failures) console.error(f);
    process.exit(1);
}
console.log('OK');
