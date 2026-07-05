# ProperTee for JavaScript v0.3.0

A JavaScript implementation of the [ProperTee](https://github.com/flatide/ProperTee) language using **generator-based cooperative multithreading**. Built with ANTLR4 for parsing and JavaScript generators for scheduling — every interpreter method is a generator function, enabling a central scheduler to round-robin between threads at statement boundaries.

For language specification, syntax reference, and built-in functions, see the [ProperTee Language Home](https://github.com/flatide/ProperTee). See the [Changelog](LANGUAGE.md#changelog) for what's new.

**[Try the Playground](https://flatide.github.io/propertee-js/)**

## Quick Start

```bash
npm install
./build-all.sh

# Run a script
node pt.js script.tee

# Interactive REPL
node pt.js
```

## How Concurrency Works

Every `visit*` method in the interpreter is a `function*` generator:

- **Statement visitors** `yield` after each statement -- the scheduler can switch threads here
- **Expression visitors** use `yield*` delegation -- expressions evaluate atomically
- Threads communicate with the scheduler via yield values (`SLEEP`, `SPAWN_THREADS`)

Thread functions are **pure** with respect to global state:
- Can read globals via a snapshot taken at `multi` block entry
- Cannot write globals (enforced at runtime)
- Return results via `thread key: func()` syntax; results assigned only after all threads complete
- No locks, no shared mutable state

## External Functions & Result Pattern

Host applications can register external functions that return result objects:

```javascript
import ProperTeeCustomVisitor from './ProperTeeCustomVisitor.js';

const interpreter = new ProperTeeCustomVisitor();

interpreter.registerExternal("GET_BALANCE", (user) => {
    if (userExists(user)) return ProperTeeCustomVisitor.ok(getBalance(user));
    return ProperTeeCustomVisitor.error("account not found");
});
```

```
// ProperTee script checks the result:
res = GET_BALANCE("alice")
if res.ok == true then
    PRINT("Balance:", res.value)
else
    PRINT("Error:", res.value)
end
```

## CLI Usage

```bash
node pt.js script.tee                          # run a script
node pt.js -p '{"width":100}' script.tee       # with built-in properties
node pt.js -f props.json script.tee             # properties from JSON file
node pt.js --max-iterations 5000 script.tee     # custom loop limit
node pt.js                                     # interactive REPL
```

REPL commands: `.vars` (show variables), `.exit` (quit).

## Build

```bash
# Full build (parser + browser bundle + docs)
./build-all.sh

# Or use npm scripts:
npm run build              # full build
npm run build:parser       # ANTLR4 parser regeneration only
npm run build:browser      # browser bundle only
npm run setup:antlr4       # one-time: wrap antlr4 runtime for browser
```

Prerequisites: [antlr4 CLI](https://www.antlr.org/) (`brew install antlr` on macOS), Node.js, `npm install`.

## Testing

```bash
# Run all 99 tests
npm test

# Run a single test
./test/run_tests.sh test/16_thread_basic.tee
```

Each `test/*.tee` file has a matching `.expected` file. Sample scripts in `sample/` cover all language features.

## Embedding in a Web Page

```html
<script src="propertee-bundle.js"></script>

<script>
const properties = { user: { name: "Test", score: 100 } };
const scriptText = `
PRINT("Hello,", user.name)
user.score = user.score + 10
PRINT("New score:", user.score)
`;

const chars = new antlr4.InputStream(scriptText);
const lexer = new ProperTeeLexer(chars);
const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new ProperTeeParser(tokens);
const tree = parser.root();

const visitor = new ProperTeeCustomVisitor(properties, {}, {
    stdout: (...args) => console.log(...args),
    stderr: (...args) => console.error(...args)
});
const scheduler = new Scheduler(visitor);
const mainGenerator = visitor.visitRoot(tree);
const result = await scheduler.run(mainGenerator);
</script>
```

Full example: [scratch.html](https://github.com/flatide/propertee-js/blob/main/docs/dist/scratch.html)

## Restricting Language Features

Hide keywords and block functions to create sandboxed environments:

```javascript
// Hide language keywords — scripts using them get a runtime error
visitor.setHiddenKeywords(["multi", "loop"]);

// Block specific functions
visitor.setIgnoredFunctions(["SHELL", "SLEEP"]);
```

Keywords that can be hidden: `if`, `loop`, `function`, `multi`, `thread`, `debug`. Both built-in and external functions can be blocked. Using a hidden keyword or blocked function produces a runtime error: `'X' is not available in this environment`.

## Project Structure

| File | Role |
|---|---|
| `ProperTee.g4` | ANTLR4 grammar |
| `ProperTeeCustomVisitor.js` | Generator-based interpreter |
| `Scheduler.js` | Round-robin cooperative scheduler |
| `ThreadContext.js` | Per-thread state management |
| `pt.js` | CLI runner and REPL |
| `build-browser.js` | Browser bundle generator |
| `docs/index.html` | Playground (GitHub Pages) |

## License

BSD 3-Clause License. See [LICENSE](LICENSE).
