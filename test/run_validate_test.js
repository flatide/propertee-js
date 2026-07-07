#!/usr/bin/env node
// Host-API test: opt-in static validation pass (ProperTee issue #9).
// Asserts visitor.validate(tree) reports hidden-keyword constructs and
// ignored-function calls in dead branches (which the runtime alone misses),
// then prints OK. Any mismatch prints a diff and exits nonzero.
import antlr4 from 'antlr4';
import ProperTeeLexer from '../ProperTeeLexer.js';
import ProperTeeParser from '../ProperTeeParser.js';
import ProperTeeCustomVisitor from '../ProperTeeCustomVisitor.js';
import Scheduler from '../Scheduler.js';

function parse(scriptText) {
    const chars = new antlr4.InputStream(scriptText);
    const lexer = new ProperTeeLexer(chars);
    lexer.removeErrorListeners();
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new ProperTeeParser(tokens);
    parser.removeErrorListeners();
    return parser.root();
}

let failures = 0;
function expectEqual(label, actual, expected) {
    const a = JSON.stringify(actual), e = JSON.stringify(expected);
    if (a !== e) {
        failures++;
        console.error(`${label}:\n  expected ${e}\n  actual   ${a}`);
    }
}

// 1. The issue's motivating case: forbidden constructs in an untaken branch.
const deadBranch = `mode = "safe"
if mode == "safe" then
    PRINT("ok")
else
    multi r do
        thread : SHELL("rm -rf /")
    end
end
`;
{
    const visitor = new ProperTeeCustomVisitor({}, {}, {stdout: () => {}, stderr: () => {}}, {});
    visitor.setHiddenKeywords(['multi']);
    visitor.setIgnoredFunctions(['SHELL']);
    expectEqual('dead-branch detection', visitor.validate(parse(deadBranch)), [
        "line 5:4: 'multi' is not available in this environment",
        "line 6:17: 'SHELL' is not available in this environment",
    ]);

    // spec v0.14.0: running the script is now REFUSED at load — the dead-branch violation rejects
    // the whole run before the "ok" branch executes, on the first violation in document order
    // (multi at 5:4). "ok" never prints; validate() above still lists every violation.
    let rejected = null;
    const runVisitor = new ProperTeeCustomVisitor({}, {}, {stdout: () => {}, stderr: () => {}}, {});
    runVisitor.setHiddenKeywords(['multi']);
    runVisitor.setIgnoredFunctions(['SHELL']);
    try {
        await new Scheduler(runVisitor).run(runVisitor.visitRoot(parse(deadBranch)));
    } catch (e) {
        rejected = e.message;
    }
    expectEqual('load-time rejection', rejected, "Runtime Error at line 5:4: 'multi' is not available in this environment");
}

// 2. All six hideable keywords, each construct reported with its position.
{
    const script = `function w() do
    return 1
end
if true then PRINT(1) end
loop i in [1] do PRINT(i) end
debug
multi r do
    thread : w()
end
`;
    const visitor = new ProperTeeCustomVisitor({}, {}, {stdout: () => {}, stderr: () => {}}, {});
    visitor.setHiddenKeywords(['if', 'loop', 'function', 'multi', 'thread', 'debug']);
    expectEqual('all six keywords', visitor.validate(parse(script)), [
        "line 1:0: 'function' is not available in this environment",
        "line 4:0: 'if' is not available in this environment",
        "line 5:0: 'loop' is not available in this environment",
        "line 6:0: 'debug' is not available in this environment",
        "line 7:0: 'multi' is not available in this environment",
        "line 8:4: 'thread' is not available in this environment",
    ]);
}

// 3. Hiding "if" reports an elseif chain once; clean script reports nothing.
{
    const visitor = new ProperTeeCustomVisitor({}, {}, {stdout: () => {}, stderr: () => {}}, {});
    visitor.setHiddenKeywords(['if']);
    expectEqual('elseif chain once', visitor.validate(parse(
        'x = 2\nif x == 1 then PRINT(1)\nelseif x == 2 then PRINT(2)\nelse PRINT(3)\nend\n')), [
        "line 2:0: 'if' is not available in this environment",
    ]);
    expectEqual('clean script', visitor.validate(parse('PRINT(LEN([1, 2, 3]))\n')), []);
}

if (failures > 0) process.exit(1);
console.log('OK');
