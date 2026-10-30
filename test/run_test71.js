#!/usr/bin/env node
// Test harness for test 71 (async_external)
// Registers async external functions and runs the test script
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import antlr4 from 'antlr4';
import ProperTeeLexer from '../ProperTeeLexer.js';
import ProperTeeParser from '../ProperTeeParser.js';
import ProperTeeCustomVisitor from '../ProperTeeCustomVisitor.js';
import Scheduler from '../Scheduler.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptFile = resolve(__dirname, '71_async_external.tee');
const scriptText = readFileSync(scriptFile, 'utf-8');

// Parse
const chars = new antlr4.InputStream(scriptText);
const lexer = new ProperTeeLexer(chars);
lexer.removeErrorListeners();
const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new ProperTeeParser(tokens);
parser.removeErrorListeners();
const tree = parser.root();

// Create visitor with external functions
const ioStreams = {
    stdout: (...args) => console.log(...args),
    stderr: (...args) => console.error(...args)
};
const visitor = new ProperTeeCustomVisitor({}, {}, ioStreams, {});

// Helper: create a delayed Promise (truly async in JS)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Register async external functions using registerExternalAsync
// Functions return Promises for truly async behavior in JS
// The call's Result holds what a function resolves to, and what it rejects with as an error
// (spec v0.37.0, as in the reference runtime).
visitor.registerExternalAsync('SLOW_FETCH', async (key) => {
    await delay(50);
    if (key === 'error') throw new Error('fetch error: error');
    return key + '_data';
});

visitor.registerExternalAsync('SLOW_COMPUTE', async (n) => {
    await delay(30);
    return n * 10;
});

visitor.registerExternalAsync('SLOW_TIMEOUT', async (key) => {
    await delay(500);
    return 'should not reach';
}, 100);

// Run
const scheduler = new Scheduler(visitor);
const mainGenerator = visitor.visitRoot(tree);

try {
    await scheduler.run(mainGenerator);
} catch (e) {
    console.error(`Runtime error: ${e.message}`);
    process.exit(1);
}
