#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';
import antlr4 from 'antlr4';
import ProperTeeLexer from './ProperTeeLexer.js';
import ProperTeeParser from './ProperTeeParser.js';
import ProperTeeCustomVisitor from './ProperTeeCustomVisitor.js';
import Scheduler from './Scheduler.js';

// Parse CLI args
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node pt.js [options] [script.pt]');
    console.log('');
    console.log('  If no script file is given (or the file does not exist),');
    console.log('  starts an interactive REPL.');
    console.log('');
    console.log('Options:');
    console.log('  -p, --props <json>    Built-in properties as JSON string');
    console.log('  -f, --props-file <f>  Built-in properties from JSON file');
    console.log('  --max-iterations <n>  Max loop iterations (default: 1000)');
    console.log('  --warn-loops          Warn instead of error on loop limit');
    console.log('  -h, --help            Show this help');
    process.exit(0);
}

let propsJson = '{}';
let maxIterations = 1000;
let iterationLimitBehavior = 'error';
let scriptFile = null;

for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
        case '-p':
        case '--props':
            propsJson = args[++i];
            break;
        case '-f':
        case '--props-file':
            propsJson = readFileSync(resolve(args[++i]), 'utf-8');
            break;
        case '--max-iterations':
            maxIterations = parseInt(args[++i], 10);
            break;
        case '--warn-loops':
            iterationLimitBehavior = 'warn';
            break;
        default:
            scriptFile = args[i];
    }
}

// Parse properties
let properties;
try {
    properties = JSON.parse(propsJson);
} catch (e) {
    console.error(`Error: Invalid properties JSON: ${e.message}`);
    process.exit(1);
}

// Error listener
class ErrorListener extends antlr4.error.ErrorListener {
    constructor() {
        super();
        this.errors = [];
    }
    syntaxError(recognizer, offendingSymbol, line, column, msg) {
        this.errors.push(`Line ${line}:${column} - ${msg}`);
    }
}

// Shared setup
const ioStreams = {
    stdout: (...args) => console.log(...args),
    stderr: (...args) => console.error(...args)
};
const options = { maxIterations, iterationLimitBehavior };

// --- Parse and run a script string, returning the result ---
function parseScript(scriptText) {
    const chars = new antlr4.InputStream(scriptText);
    const lexer = new ProperTeeLexer(chars);
    const lexerErrors = new ErrorListener();
    lexer.removeErrorListeners();
    lexer.addErrorListener(lexerErrors);

    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new ProperTeeParser(tokens);
    const parserErrors = new ErrorListener();
    parser.removeErrorListeners();
    parser.addErrorListener(parserErrors);

    const tree = parser.root();

    if (lexerErrors.errors.length > 0) {
        return { error: 'Lexer errors:\n' + lexerErrors.errors.map(e => '  ' + e).join('\n') };
    }
    if (parserErrors.errors.length > 0) {
        return { error: 'Parser errors:\n' + parserErrors.errors.map(e => '  ' + e).join('\n') };
    }

    return { tree };
}

// --- File mode ---
if (scriptFile && existsSync(resolve(scriptFile))) {
    let scriptText;
    try {
        scriptText = readFileSync(resolve(scriptFile), 'utf-8');
    } catch (e) {
        console.error(`Error: Cannot read file '${scriptFile}': ${e.message}`);
        process.exit(1);
    }

    const { tree, error } = parseScript(scriptText);
    if (error) {
        console.error(error);
        process.exit(1);
    }

    const visitor = new ProperTeeCustomVisitor(properties, {}, ioStreams, options);
    const scheduler = new Scheduler(visitor);
    const mainGenerator = visitor.visitRoot(tree);

    try {
        const result = await scheduler.run(mainGenerator);
        if (result !== null && result !== undefined &&
            !(typeof result === 'object' && !Array.isArray(result) && Object.keys(result).length === 0)) {
            console.log('Result:', result);
        }
    } catch (e) {
        console.error(`Runtime error: ${e.message}`);
        process.exit(1);
    }

} else {
    // --- Interactive REPL mode ---
    if (scriptFile) {
        console.error(`File '${scriptFile}' not found. Entering interactive mode.\n`);
    }

    console.log('ProperTee Interactive Mode');
    console.log('Type ProperTee statements. Multi-line blocks auto-detected (do/end, if/end, multi/end).');
    console.log('Type .exit to quit, .vars to show variables.\n');

    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'pt> '
    });

    // Single persistent visitor so state carries across lines
    const visitor = new ProperTeeCustomVisitor(properties, {}, ioStreams, options);

    let buffer = '';
    let depth = 0;

    function countDepth(line) {
        const tokens = line.trim().split(/\s+/);
        let delta = 0;
        for (const tok of tokens) {
            if (['do', 'if', 'multi'].includes(tok)) delta++;
            if (tok === 'end') delta--;
        }
        return delta;
    }

    async function executeBuffer(text) {
        const { tree, error } = parseScript(text);
        if (error) {
            console.error(error);
            return;
        }

        const scheduler = new Scheduler(visitor);
        const mainGenerator = visitor.visitRoot(tree);

        try {
            const result = await scheduler.run(mainGenerator);
            if (result !== null && result !== undefined &&
                !(typeof result === 'object' && !Array.isArray(result) && Object.keys(result).length === 0)) {
                console.log('=>', result);
            }
        } catch (e) {
            console.error(`Runtime error: ${e.message}`);
        }
    }

    rl.prompt();

    rl.on('line', async (line) => {
        // Commands
        const trimmed = line.trim();
        if (trimmed === '.exit') {
            rl.close();
            return;
        }
        if (trimmed === '.vars') {
            const vars = visitor.variables;
            if (Object.keys(vars).length === 0) {
                console.log('(no variables)');
            } else {
                for (const [k, v] of Object.entries(vars)) {
                    console.log(`  ${k} = ${JSON.stringify(v)}`);
                }
            }
            rl.prompt();
            return;
        }

        // Accumulate buffer
        buffer += (buffer ? '\n' : '') + line;
        depth += countDepth(line);

        if (depth > 0) {
            // Inside a block, keep collecting
            rl.setPrompt('... ');
            rl.prompt();
            return;
        }

        // depth <= 0, execute the accumulated buffer
        depth = 0;
        const text = buffer;
        buffer = '';
        rl.setPrompt('pt> ');

        if (text.trim() === '') {
            rl.prompt();
            return;
        }

        await executeBuffer(text);
        rl.prompt();
    });

    rl.on('close', () => {
        console.log('\nBye.');
        process.exit(0);
    });
}
