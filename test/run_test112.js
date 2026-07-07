#!/usr/bin/env node
// Test harness for test 112 (load_reject_dead_branch)
// Ignores the "SHELL" function; spec v0.14.0: a blocked construct anywhere — even in a dead
// branch — rejects the whole script at load, before any statement runs.
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import antlr4 from 'antlr4';
import ProperTeeLexer from '../ProperTeeLexer.js';
import ProperTeeParser from '../ProperTeeParser.js';
import ProperTeeCustomVisitor from '../ProperTeeCustomVisitor.js';
import Scheduler from '../Scheduler.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptFile = resolve(__dirname, '112_load_reject_dead_branch.tee');
const scriptText = readFileSync(scriptFile, 'utf-8');

// Parse
const chars = new antlr4.InputStream(scriptText);
const lexer = new ProperTeeLexer(chars);
lexer.removeErrorListeners();
const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new ProperTeeParser(tokens);
parser.removeErrorListeners();
const tree = parser.root();

// Create visitor with ignored functions
const ioStreams = {
    stdout: (...args) => console.log(...args),
    stderr: (...args) => console.error(...args)
};
const visitor = new ProperTeeCustomVisitor({}, {}, ioStreams, {});
visitor.setIgnoredFunctions(["SHELL"]);

// Run
const scheduler = new Scheduler(visitor);
const mainGenerator = visitor.visitRoot(tree);

try {
    await scheduler.run(mainGenerator);
} catch (e) {
    console.error(`Runtime error: ${e.message}`);
    process.exit(1);
}
