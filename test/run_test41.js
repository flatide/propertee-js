#!/usr/bin/env node
// Test harness for test 41 (result_pattern)
// Registers external functions and runs the test script
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import antlr4 from 'antlr4';
import ProperTeeLexer from '../ProperTeeLexer.js';
import ProperTeeParser from '../ProperTeeParser.js';
import ProperTeeCustomVisitor from '../ProperTeeCustomVisitor.js';
import Scheduler from '../Scheduler.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptFile = resolve(__dirname, '41_result_pattern.pt');
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

// Register external functions using registerExternal
const balances = { alice: 3000, bob: 0 };

visitor.registerExternal('GET_BALANCE', (user) => {
    if (balances.hasOwnProperty(user)) {
        return ProperTeeCustomVisitor.ok(balances[user]);
    }
    return ProperTeeCustomVisitor.error('account not found');
});

visitor.registerExternal('DIVIDE_SAFE', (a, b) => {
    if (b === 0) throw new Error('division by zero');
    return ProperTeeCustomVisitor.ok(a / b);
});

// Run
const scheduler = new Scheduler(visitor);
const mainGenerator = visitor.visitRoot(tree);

try {
    await scheduler.run(mainGenerator);
} catch (e) {
    console.error(`Runtime error: ${e.message}`);
    process.exit(1);
}
