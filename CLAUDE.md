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

REPL commands: `.vars` (show variables), `.exit` (quit). Multi-line blocks are auto-detected via `do`/`if` vs `end` depth.

## Testing

```bash
# Run all tests (59 tests with expected output validation)
./test/run_tests.sh

# Run a single test
./test/run_tests.sh test/16_thread_basic.pt
```

Each `test/*.pt` file has a matching `.expected` file. The runner compares actual output against expected and reports PASS/FAIL. Some tests verify error messages (tests 23-29, 32). Test 41 (`result_pattern`) uses a separate harness (`test/run_test41.js`) that registers external functions via `registerExternal()`. Test 46 (`thread_error_result`) verifies that thread errors are captured as `{ok: false, value: "..."}` Result objects. Test 47 (`spawn_outside_multi`) verifies `thread` outside multi block is a runtime error. Test 48 (`has_key`) verifies `HAS_KEY()` built-in function. Tests 49-54 cover multi result collection, dynamic spawn, auto keys, duplicate key error, LEN on maps, and map positional access. Test 55 (`thread_status_field`) verifies the `status` field on thread results. Test 56 (`monitor_reads_result`) verifies that monitor clauses can read thread result status during execution. Test 57 (`dynamic_thread_keys`) verifies `$var` and `$(expr)` dynamic key syntax in thread spawns. Test 58 verifies `#`-prefixed dynamic keys work. Tests 59-60 verify dynamic key error cases: non-string key type, and duplicate dynamic key. Test 61 (`duplicate_auto_key`) verifies that an explicit key colliding with an auto-generated `#N` key is a runtime error.

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
| `ProperTee.g4` | ANTLR4 grammar — defines all syntax. Semicolons are whitespace (part of WS rule). `thread` keyword for spawning in multi blocks. `multi resultVar do ... end` syntax with optional result collection. Thread spawn syntax: `thread key: func()`, `thread "key": func()`, `thread 42: func()`, `thread true: func()`, `thread $var: func()`, `thread $(expr): func()`, `thread : func()`. `spawnStmt` rule with `spawnKey` sub-rule (6 alternatives: SpawnIdKey, SpawnStringKey, SpawnIntKey, SpawnBoolKey, SpawnVarKey, SpawnExprKey). |
| `ProperTeeCustomVisitor.js` | The interpreter. All `visit*` methods are generators. Contains built-in functions, scope management. Single `*visitSpawnKeyStmt` handles all spawn key types (ID, STRING, INTEGER, boolean, $var, $(expr), unnamed). `registerExternal()` for external functions with Result pattern. Positional map access in property access. `_resolveAndValidateDynamicKey()` auto-coerces dynamic keys to string via `TO_STRING()` (non-empty, no duplicates). |
| `Scheduler.js` | Round-robin scheduler. Calls `generator.next()` on READY threads, processes yield commands, manages SLEEP timers, spawns child threads for MULTI blocks. Pre-builds result collection with `{status: "running"}` at spawn time (unnamed threads auto-keyed as `"#1"`, `"#2"`, etc. among unnamed only), updates entries in-place as threads complete, injects result collection into monitor scope for live status reads |
| `ThreadContext.js` | Per-thread state: scope stack, thread status (READY/RUNNING/SLEEPING/WAITING/COMPLETED/ERROR), global snapshot reference, context flags. `_resultCollection` holds the live result map updated in-place by scheduler |
| `pt.js` | CLI runner: file execution and interactive REPL. Creates a visitor+scheduler per run; REPL reuses the visitor across lines for persistent state |
| `build-browser.js` | Converts ES modules to browser-compatible IIFEs and creates `browser/propertee-bundle.js` |

### Multi Block Purity Model

Functions spawned inside multi blocks are pure with respect to global state:
- **Can read** globals via `::` (reads from a snapshot taken at `multi` block entry)
- **Cannot write** globals — `::x = value` is a runtime error (enforced via `inThreadContext` flag set by Scheduler)
- **Can call** any function (user-defined or built-in)
- **Can create** and modify local variables freely (plain `x` without `::`)
- **Return results** via `thread key: func()` syntax as Result objects: `{status: "done", ok: true, value: <result>}` on success, `{status: "error", ok: false, value: "<error>"}` on error. Results are pre-built with `{status: "running", ok: false, value: {}}` at spawn time and updated in-place as threads complete. The monitor clause can read `resultVar.key.status` during execution. The collection is assigned to `resultVar` after all threads finish.
- No locks, no shared mutable state

### Scope Resolution (in `ProperTeeCustomVisitor`)

**At top level:** global variables → built-in properties.

**Inside functions (plain `x`):** local scopes (top of stack first) → multi result vars → error with hint to use `::x`.

**Inside functions (`::x`):** global variables/snapshot → built-in properties.

The `::` prefix (`GLOBAL_PREFIX` token) bypasses local scopes and accesses globals directly. At top level, `x` and `::x` are equivalent. The `_getScopeStack()` and `_getVariables()` helpers route through `this.activeThread` when set by the scheduler, falling back to `this.scopeStack`/`this.variables` for single-threaded execution.

### Scheduler (`Scheduler.js`)

The scheduler drives all execution — even single-threaded scripts run through it. The `run()` method is `async` to support sleep timing via `setTimeout` promises.

**Instance state**: `threads` (Map<id, ThreadContext>), `monitors` (Array of monitor objects), `nextThreadId` (counter), `currentThreadId` (for round-robin).

**Monitor state** (plain object in `monitors` array): `interval` (ms), `blockCtx`, `lastRun` (timestamp), `parentThreadId`, `childIds`.

**Main loop** (`async run()`):
1. Creates thread 0 (main) with the root generator
2. Loop: `wakeThreads()` → `runMonitors()` → `selectNextThread()` → `generator.next(sendValue)` → `processYield()`
3. When no READY threads exist: sleep-polls (capped at 50ms via setTimeout) if SLEEPING threads remain, busy-waits (1ms setTimeout) if WAITING threads remain, otherwise exits
4. Thread 0 errors propagate as exceptions; child thread errors go to stderr as `[THREAD ERROR]`

**Thread selection** (`selectNextThread()`): Round-robin by sorted thread ID, starting after `currentThreadId`. Only picks READY threads.

**Yield handling** (`processYield()`):
- `undefined` → mark thread READY (bare `yield` = statement boundary)
- `{ __schedulerCommand: true, type: 'SLEEP' }` → mark thread SLEEPING with wake time
- `{ __schedulerCommand: true, type: 'SPAWN_THREADS' }` → call `handleSpawnThreads()` (creates child threads, parent goes WAITING)

**Thread spawning** (`handleSpawnThreads()`):
1. Creates child ThreadContexts from specs, each with `inThreadContext = true`
2. Sets up monitor if present (stores interval, block ctx, child IDs, `lastRun` initialized to current time)
3. Marks parent WAITING with child ID set
4. Pre-builds `_resultCollection` on parent with `{status: "running", ok: false, value: {}}` entries (named keys use provided name, unnamed auto-keyed as `"#1"`, `"#2"`, etc. among unnamed)

**Child completion** (`notifyChildCompleted()`):
1. Updates parent's `_resultCollection` in-place — `{status: "done", ok: true, value}` or `{status: "error", ok: false, value}`
2. Removes child from parent's `waitingForChildren` set
3. When all children done: runs final monitor tick, removes monitor, sends `{resultVarName, collection}` payload to parent via `_collectedResults`
4. Parent wakes to READY; scheduler sends payload via `generator.next(payload)`

**Monitor execution** (`runMonitors()` + `executeMonitorSync()`): Each scheduler iteration checks all monitors — fires when `(now - lastRun >= interval)`, updates `lastRun`. `executeMonitorSync()` creates a temporary ThreadContext (id -1, name "monitor") with `inMonitorContext = true`. Copies global snapshot and injects the live `_resultCollection` under `resultCollectionVarName`. Runs the monitor block synchronously by exhausting the generator via `gen.next()` loop. Monitor errors go to stderr as `[MONITOR ERROR]`, not thrown. `runFinalMonitor()` runs one last tick when all children complete, then removes the monitor.

**Interpreter integration**: `visitor.activeThread` is set to the current thread before each step. The visitor's `_getScopeStack()`, `_getVariables()`, `_isInFunctionScope()` etc. all check `activeThread` to route scope access through the thread's local state.

### ThreadContext (`ThreadContext.js`)

Per-thread state container. Constructor takes `(id, name, generator, globalSnapshot = null)`.

| Field | Type | Default | Purpose |
|---|---|---|---|
| `id` | `number` | (ctor) | Unique thread ID (0 = main, -1 = monitor) |
| `name` | `string` | (ctor) | Debug name (e.g. `"worker-0"`, `"main"`, `"monitor"`) |
| `generator` | `Generator` | (ctor) | The generator driving this thread's execution |
| `state` | `ThreadState` | `READY` | `READY → RUNNING → READY → ... → COMPLETED/ERROR` |
| `scopeStack` | `Array` | `[]` | Thread-private local variable scopes |
| `globalSnapshot` | `Object\|null` | `null` | Read-only globals for thread purity (main thread uses live `variables`) |
| `sleepUntil` | `number\|null` | `null` | Absolute wake time (ms) when SLEEPING |
| `inThreadContext` | `boolean` | `false` | True for child threads — blocks `::x = val` writes |
| `inMonitorContext` | `boolean` | `false` | True for monitor execution — blocks all assignments |
| `inMultiContext` | `boolean` | `false` | True during multi setup — blocks result var access |
| `currentFunctionContext` | `object\|null` | `null` | Current function execution context |
| `multiResultVars` | `Map` | `new Map()` | Result variables from completed multi blocks (accessible in later code) |
| `result` | `any` | `null` | Final return value when COMPLETED |
| `error` | `Error\|null` | `null` | Exception when ERROR |
| `parentId` | `number\|null` | `null` | Parent thread ID (null for main) |
| `waitingForChildren` | `Set\|null` | `null` | Child IDs still running (null when not WAITING) |

Additional fields set dynamically by Scheduler during multi blocks:

| Field | Purpose |
|---|---|
| `_resultCollection` | Live result object updated in-place as children complete |
| `_childIds` | Ordered child thread IDs for this multi block |
| `_resultKeyNames` | Parallel list of key names (null = unnamed) |
| `resultCollectionVarName` | The `resultVar` name from `multi resultVar do` |
| `_collectedResults` | Payload sent to parent generator when all children done |
| `_resultKeyName` | This child's key in parent's collection |
| `_localScope` | Function parameters for spawned thread |

Methods: `markRunning()`, `markReady()`, `markSleeping(until)`, `markWaiting(childIds)`, `markCompleted(result)`, `markError(error)`, `shouldWake(now)`, `childCompleted(childId)` → returns true when all children done. Scope methods: `pushScope()`, `popScope()`, `getCurrentScope()`, `getVariable(name)`, `setVariable(name, value)`, `isInLocalScope()`.

**ThreadState**: `READY`, `RUNNING`, `SLEEPING`, `WAITING`, `COMPLETED`, `ERROR`.

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

// Parallel execution — results collected into result object
// Each entry is {status: "done"/"error"/"running", ok: true/false, value: ...}
multi result do
    thread a: worker("A")
    thread b: worker("B")
monitor 100
    PRINT(result.a.status)   // "running" or "done" — monitor reads live status
end
PRINT(result.a.value)   // named access
PRINT(result.1.value)   // positional access
LEN(result)             // 2

// Dynamic thread keys — $var and $(expr) syntax
names = ["alpha", "beta"]
multi result do
    loop name in names do
        thread $name: worker(name)             // key from variable
    end
    thread $("gamma"): worker("C")             // key from expression
end

// Conditional/dynamic spawning in multi blocks
multi result do
    if needsA == true then
        thread rA: workerA()
    end
    i = 1
    loop i <= 3 infinite do
        thread : workerB(i)
        i = i + 1
    end
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

- `ProperTeeCustomVisitor.ok(value)` → `{status: "done", ok: true, value: ...}`
- `ProperTeeCustomVisitor.error(message)` → `{status: "error", ok: false, value: "..."}`
- `registerExternal()` wraps the function in try-catch — thrown exceptions automatically become `{status: "error", ok: false, value: "error message"}`
- Core builtins (PRINT, SUM, LEN, etc.) return values directly and are not wrapped

## Conventions

- **No null** — the language has no null keyword. Functions without `return` or with bare `return` produce `{}` (empty object). Missing function arguments default to `{}`.
- The grammar uses Korean comments in some places (historical). New code should use English.
- `SLEEP()` returns a scheduler command object (not a Promise) — the visitor yields it to the scheduler.
- 1-based indexing for array access (`.1` is the first element).
- Strict type checking: `and`/`or` require booleans, arithmetic requires numbers. Exception: `+` with at least one string coerces the other operand via `TO_STRING()` (concatenation). Equality (`==`, `!=`) uses deep comparison for objects and arrays.
- `package.json` has `"type": "module"` — all source files use ES module imports.

## Known Limitations

- **String escapes:** The visitor does not process escape sequences (`\n`, `\t`, `\\`). Backslash characters pass through as-is. The lexer only uses `\"` to allow quotes inside strings.
- **Semicolons:** The lexer skips `;` as whitespace — semicolons are allowed but ignored.
