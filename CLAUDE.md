# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

ProperTee JS is a JavaScript implementation of the [ProperTee](https://github.com/flatide/ProperTee) language using ANTLR4 for parsing and **JavaScript generators for cooperative multithreading**. Every `visit*` method is a generator function, enabling a central scheduler to round-robin between threads at statement boundaries.

## Build Commands

```bash
# Full build (regenerate parser + browser bundle + dist)
./build-all.sh

# Individual steps:
antlr4 -Dlanguage=JavaScript -visitor -no-listener ProperTee.g4   # regenerate parser/lexer/visitor
node wrap-antlr4.js                                                 # wrap antlr4 runtime for browser
node build-browser.js                                               # generate browser/propertee-bundle.js

# Prerequisites: antlr4 CLI (brew install antlr), npm install
```

**After any grammar change** (`ProperTee.g4`), you must run `./build-all.sh` to regenerate `ProperTeeLexer.js`, `ProperTeeParser.js`, and `ProperTeeVisitor.js`.

**After any change to `.js` source files** (visitor, scheduler, thread context), run `node build-browser.js` to regenerate the browser bundle.

## CLI Runner

`pt.js` runs `.pt` scripts from the command line. Falls back to an interactive REPL when no file is given.

```bash
node pt.js script.pt                          # run a script
node pt.js -p '{"width":100}' script.pt       # with built-in properties
node pt.js -f props.json script.pt             # properties from file
node pt.js --max-iterations 5000 script.pt     # custom loop limit
node pt.js                                     # interactive REPL
```

REPL commands: `.vars` (show variables), `.exit` (quit). Multi-line blocks are auto-detected via `do`/`if`/`multi` vs `end` depth.

## Testing

```bash
# Run all tests (46 tests with expected output validation)
./test/run_tests.sh

# Run a single test
./test/run_tests.sh test/16_thread_basic.pt
```

Each `test/*.pt` file has a matching `.expected` file. The runner compares actual output against expected and reports PASS/FAIL. Some tests verify error messages (tests 23-29, 32). Test 41 (`result_pattern`) uses a separate harness (`test/run_test41.js`) that registers external functions via `registerExternal()`. Test 46 (`thread_error_result`) verifies that thread errors are captured as `{ok: false, value: "..."}` Result objects. Test 47 (`spawn_outside_multi`) verifies `thread` outside multi block is a runtime error.

**Browser testing:** Open `scratch.html` (or `docs/dist/scratch.html`) for interactive testing with demo buttons. Open `docs/index.html` for the full playground.

**Sample scripts:** `sample/01_hello.pt` through `sample/16_comments.pt` cover all language features as beginner-friendly examples.

## Architecture

### Execution Flow

```
Script text → ProperTeeLexer → ProperTeeParser → Parse Tree
                                                      ↓
                                          ProperTeeCustomVisitor.visitRoot(tree)
                                                      ↓ (returns generator)
                                              Scheduler.run(mainGenerator)
                                                      ↓
                                         Round-robin generator.next() loop
```

### Generator-Based Cooperative Scheduling

Every `visit*` method in `ProperTeeCustomVisitor.js` is a `function*` generator:

- **Statement visitors** (`visitBlock`, `visitRoot`, loops, function bodies) do `yield` after each statement — this is the scheduling point where the scheduler can switch threads.
- **Expression visitors** (`visitAdditiveExpr`, `visitFunctionCall`, etc.) use only `yield*` delegation — expressions evaluate atomically, never yielding to the scheduler mid-expression.
- The `visit()` override returns the generator object from `ctx.accept(this)`. All callers use `yield*` to consume it.

### Yield Protocol

Generators communicate with the scheduler via yield values:

| Yield Value | Meaning |
|---|---|
| `undefined` (bare `yield`) | Statement boundary — thread stays READY |
| `{ __schedulerCommand: true, type: 'SLEEP', duration }` | Thread enters SLEEPING state |
| `{ __schedulerCommand: true, type: 'SPAWN_THREADS', specs, ... }` | Create child threads for MULTI block; parent enters WAITING |

### Key Files

| File | Role |
|---|---|
| `ProperTee.g4` | ANTLR4 grammar — defines all syntax. Keywords: `function`, `thread`, `multi`, `monitor`, `infinite` |
| `ProperTeeCustomVisitor.js` | The interpreter. All `visit*` methods are generators. Contains built-in functions, scope management, `thread` spawn collection during multi setup, `registerExternal()` for external functions with Result pattern |
| `Scheduler.js` | Round-robin scheduler. Calls `generator.next()` on READY threads, processes yield commands, manages SLEEP timers, spawns child threads for MULTI blocks, runs monitor ticks |
| `ThreadContext.js` | Per-thread state: scope stack, thread status (READY/RUNNING/SLEEPING/WAITING/COMPLETED/ERROR), global snapshot reference, context flags |
| `pt.js` | CLI runner: file execution and interactive REPL. Creates a visitor+scheduler per run; REPL reuses the visitor across lines for persistent state |
| `build-browser.js` | Converts ES modules to browser-compatible IIFEs and creates `browser/propertee-bundle.js` |

### Multi Block Purity Model

Functions spawned inside multi blocks are pure with respect to global state:
- **Can read** globals via `::` (reads from a snapshot taken at `multi` block entry)
- **Cannot write** globals — `::x = value` is a runtime error (enforced via `inThreadContext` flag set by Scheduler)
- **Can call** any function (user-defined or built-in)
- **Can create** and modify local variables freely (plain `x` without `::`)
- **Return results** via `thread func() -> var` syntax as Result objects: `{ok: true, value: <result>}` on success, `{ok: false, value: "<error>"}` on error. Results assigned only after all threads complete
- No locks, no shared mutable state

### Scope Resolution (in `ProperTeeCustomVisitor`)

**At top level:** global variables → built-in properties.

**Inside functions (plain `x`):** local scopes (top of stack first) → multi result vars → error with hint to use `::x`.

**Inside functions (`::x`):** global variables/snapshot → built-in properties.

The `::` prefix (`GLOBAL_PREFIX` token) bypasses local scopes and accesses globals directly. At top level, `x` and `::x` are equivalent. The `_getScopeStack()` and `_getVariables()` helpers route through `this.activeThread` when set by the scheduler, falling back to `this.scopeStack`/`this.variables` for single-threaded execution.

### Flow Control

`BreakException`, `ContinueException`, and `ReturnException` propagate through generator chains via `yield*` delegation — generators support try/catch natively, so these work without modification.

### Browser Bundle

`build-browser.js` strips ES module syntax and wraps each file in an IIFE that registers on `window`. The bundle exposes globals: `antlr4`, `ProperTeeLexer`, `ProperTeeParser`, `ProperTeeVisitor`, `ProperTeeCustomVisitor`, `ThreadContext`, `ThreadState`, `Scheduler`.

## Language Quick Reference

```
// Variables
x = 10

// Global access inside functions (:: prefix)
function readX() do return ::x end
function setX(v) do ::x = v end

// Functions
function add(a, b) do return a + b end

// Any function can run in multi blocks via thread keyword
function worker(name) do
    PRINT(name + " working")
    return 42
end

// Parallel execution (results are {ok, value} objects)
multi
    thread worker("A") -> resultA
    thread worker("B") -> resultB
monitor 100
    PRINT("[tick]")
end
PRINT(resultA.value)  // access return value

// Conditional spawning in multi blocks
multi
    if needsA == true then
        thread workerA() -> rA
    end
    thread workerB() -> rB
end

// Loops
loop condition infinite do ... end
loop item in collection do ... end
loop key, val in collection do ... end

// Access patterns: obj.prop, arr.1, obj."key", obj.$var, obj.$(expr)
```

## External Functions & Result Pattern

Host applications can register external built-in functions that return result objects instead of throwing errors:

```javascript
// JavaScript host registers an external function:
visitor.registerExternal('GET_BALANCE', (user) => {
    if (balances[user] !== undefined) {
        return ProperTeeCustomVisitor.ok(balances[user]);
    }
    return ProperTeeCustomVisitor.error('account not found');
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

- `ProperTeeCustomVisitor.ok(value)` → `{ok: true, value: ...}`
- `ProperTeeCustomVisitor.error(message)` → `{ok: false, value: "..."}`
- `registerExternal()` wraps the function in try-catch — thrown exceptions automatically become `{ok: false, value: "error message"}`
- Core builtins (PRINT, SUM, LEN, etc.) return values directly and are not wrapped

## Conventions

- **No null** — the language has no null keyword. Functions without `return` or with bare `return` produce `{}` (empty object). Missing function arguments default to `{}`.
- The grammar uses Korean comments in some places (historical). New code should use English.
- `SLEEP()` returns a scheduler command object (not a Promise) — the visitor yields it to the scheduler.
- 1-based indexing for array access (`.1` is the first element).
- Strict type checking: no coercion, `and`/`or` require booleans, arithmetic requires numbers. Equality (`==`, `!=`) uses deep comparison for objects and arrays.
- `package.json` has `"type": "module"` — all source files use ES module imports.

## Known Limitations

- **String escapes:** The visitor does not process escape sequences (`\n`, `\t`, `\\`). Backslash characters pass through as-is. The lexer only uses `\"` to allow quotes inside strings.
- **Semicolons:** The lexer skips `;` as whitespace — semicolons are allowed but ignored.
