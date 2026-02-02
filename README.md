# ProperTee Concurrent

A DSL interpreter with **generator-based cooperative multithreading**. Built with ANTLR4 for parsing and JavaScript generators for scheduling — every interpreter method is a generator function, enabling a central scheduler to round-robin between threads at statement boundaries.

Forked from [propertee-js](https://github.com/flatide/propertee-js).

**[Try the Playground](https://flatide.github.io/propertee-js-concurrency/)**

## Quick Start

```bash
npm install
./build-all.sh

# Run a script
node pt.js script.pt

# Interactive REPL
node pt.js
```

## Language Overview

```
// Variables and expressions
x = 10
name = "Alice"
items = [1, 2, 3]
config = {host: "localhost", port: 8080}

// Functions
function add(a, b) do
    return a + b
end

// Conditionals
if x > 5 then
    PRINT("big")
else
    PRINT("small")
end

// Loops
loop item in items do
    PRINT(item)
end

loop x > 0 infinite do
    x = x - 1
end

// Thread functions (pure with respect to globals)
thread worker(name) do
    PRINT(name + " working")
    SLEEP(100)
    return 42
end

// Parallel execution with interleaved scheduling
multi
    worker("A") -> resultA
    worker("B") -> resultB
monitor 100
    PRINT("[tick]")
end

PRINT("Results:", resultA, resultB)

// Access patterns
obj.prop        // static property
arr.1           // 1-based array index
obj."key"       // string key
obj.$var        // dynamic access via variable
obj.$(expr)     // dynamic access via expression
```

## How Concurrency Works

Every `visit*` method in the interpreter is a `function*` generator:

- **Statement visitors** `yield` after each statement -- the scheduler can switch threads here
- **Expression visitors** use `yield*` delegation -- expressions evaluate atomically
- Threads communicate with the scheduler via yield values (`SLEEP`, `SPAWN_THREADS`)

Thread functions are **pure** with respect to global state:
- Can read globals via a snapshot taken at `multi` block entry
- Cannot write globals (enforced at runtime)
- Return results via `->` syntax; results assigned only after all threads complete
- No locks, no shared mutable state

## Built-in Functions

| Function | Description |
|---|---|
| `PRINT(...)` | Print values to stdout |
| `SLEEP(ms)` | Suspend thread for ms milliseconds |
| `SUM(...)`, `MAX(...)`, `MIN(...)` | Aggregate functions |
| `ABS(n)`, `FLOOR(n)`, `CEIL(n)`, `ROUND(n)` | Math functions |
| `LEN(v)` | Length of array or string |
| `TO_NUMBER(v)`, `TO_STRING(v)` | Type conversion |
| `PUSH(arr, v)`, `POP(arr)`, `CONCAT(a, b)`, `SLICE(arr, start, end)` | Array operations |
| `CHARS(s)`, `SPLIT(s, sep)`, `JOIN(arr, sep)` | String/array conversion |
| `SUBSTRING(s, start, end)`, `UPPERCASE(s)`, `LOWERCASE(s)`, `TRIM(s)` | String operations |

## CLI Usage

```bash
node pt.js script.pt                          # run a script
node pt.js -p '{"width":100}' script.pt       # with built-in properties
node pt.js -f props.json script.pt             # properties from JSON file
node pt.js --max-iterations 5000 script.pt     # custom loop limit
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
# Run all 40 tests
npm test

# Run a single test
./test/run_tests.sh test/16_thread_basic.pt
```

Each `test/*.pt` file has a matching `.expected` file. Sample scripts in `sample/` cover all language features.

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
