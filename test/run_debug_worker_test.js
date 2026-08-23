#!/usr/bin/env node
// Host-API debugger contract: worker debug/step stops carry logical-thread identity,
// stepping stays on the paused worker, and monitor bodies never stop.
import antlr4 from 'antlr4';
import ProperTeeLexer from '../ProperTeeLexer.js';
import ProperTeeParser from '../ProperTeeParser.js';
import ProperTeeCustomVisitor from '../ProperTeeCustomVisitor.js';
import Scheduler from '../Scheduler.js';

function parse(source) {
    const chars = new antlr4.InputStream(source);
    const lexer = new ProperTeeLexer(chars);
    lexer.removeErrorListeners();
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new ProperTeeParser(tokens);
    parser.removeErrorListeners();
    return parser.root();
}

const source = `function worker(n) do
    debug
    x = n + 1
    return x
end
multi r limit 1 do
    thread a: worker(1)
    thread b: worker(10)
monitor 1
    debug
end
PRINT(r.a.value, r.b.value)
`;

const stdout = [];
const stderr = [];
const visitor = new ProperTeeCustomVisitor({}, {}, {
    stdout: (...args) => stdout.push(args.join(' ')),
    stderr: (...args) => stderr.push(args.join(' '))
}, {});
const scheduler = new Scheduler(visitor);
const pauses = [];

scheduler.setDebugMode(true);
scheduler.setBreakpoints(new Set([4]));
scheduler.debugContinue();              // run to explicit debug; do not stop at program entry
scheduler.onStep = event => {
    if (!event.willPause) return;
    pauses.push({
        reason: event.reason,
        threadId: event.threadId,
        threadName: event.threadName,
        key: event.threadResultKey,
        line: event.line
    });
    // The resume command is asynchronous, like a UI/DAP request arriving after the stop event.
    setTimeout(() => {
        if (event.reason === 'debug') scheduler.debugStep();
        else scheduler.debugContinue();
    }, 0);
};

await scheduler.run(visitor.visitRoot(parse(source)));

const expectedPauses = [
    { reason: 'debug', threadId: 1, threadName: 'worker', key: 'a', line: 2 },
    { reason: 'step', threadId: 1, threadName: 'worker', key: 'a', line: 3 },
    { reason: 'breakpoint', threadId: 1, threadName: 'worker', key: 'a', line: 4 },
    { reason: 'debug', threadId: 2, threadName: 'worker', key: 'b', line: 2 },
    { reason: 'step', threadId: 2, threadName: 'worker', key: 'b', line: 3 },
    { reason: 'breakpoint', threadId: 2, threadName: 'worker', key: 'b', line: 4 }
];

if (JSON.stringify(pauses) !== JSON.stringify(expectedPauses)
        || JSON.stringify(stdout) !== JSON.stringify(['2 11'])
        || stderr.length !== 0) {
    console.error('worker debug mismatch');
    console.error('pauses', JSON.stringify(pauses));
    console.error('stdout', JSON.stringify(stdout));
    console.error('stderr', JSON.stringify(stderr));
    process.exit(1);
}

console.log('OK');
