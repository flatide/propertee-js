# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is (v0.3.0)

ProperTee JS is a JavaScript implementation of the [ProperTee](https://github.com/flatide/ProperTee) language. It uses ANTLR4 for parsing and **generator functions (`function*`/`yield`/`yield*`) for cooperative multithreading**. Every statement visitor is a generator; a central scheduler round-robins between threads at `yield` boundaries. There is also a [Java implementation](https://github.com/flatide/propertee-java) that uses a Stepper pattern instead of generators.

## Build & Run

```bash
# Run a script
node pt.js script.tee
node pt.js -p '{"width":100}' script.tee       # with built-in properties
node pt.js -f props.json script.tee             # properties from file
node pt.js --max-iterations 5000 script.tee     # custom loop limit
node pt.js                                     # interactive REPL

# Regenerate parser from grammar (requires antlr4 CLI)
npm run build:parser    # or: antlr4 -Dlanguage=JavaScript -visitor -no-listener ProperTee.g4

# Build browser bundle (for playground)
npm run build:browser   # or: node build-browser.js

# Full build (parser + browser bundle)
npm run build           # or: ./build-all.sh
```

Each injected property (`-p`/`-f`) is accessible as an individual bare variable (`width`, ...), and the whole input set is also exposed as the reserved object **`_PROPS`** — `PRINT(_PROPS)`, `JSON_FORMAT(_PROPS)`, `KEYS(_PROPS)`, `_PROPS.width`, `return {"echo": _PROPS}`; use `::_PROPS` inside functions/`multi` setup. Injected in the `ProperTeeCustomVisitor` constructor as a snapshot that does not contain itself (no `JSON_FORMAT` cycle); a caller-supplied `_PROPS` is left as-is. Mirrors the Java implementation.

**After any grammar change** (`ProperTee.g4`), run `npm run build:parser` to regenerate `ProperTeeLexer.js`, `ProperTeeParser.js`, and `ProperTeeVisitor.js`.

**After any change to `ProperTeeCustomVisitor.js`** (or other bundled JS), rebuild the browser bundle (`npm run build:browser`) and copy it to `docs/dist/` so the playground stays in sync.

**Requirements:** Node.js (ES modules). ANTLR4 CLI for parser generation.

REPL commands: `.vars` (show variables), `.exit` (quit). Multi-line blocks are auto-detected via `do`/`if` vs `end` depth.

## Testing

```bash
# Run all tests
./test/run_tests.sh

# Run a single test
./test/run_tests.sh test/09_functions.tee
```

There are 77 test pairs in `test/` (numbered 01-78, test 31 skipped). Each `NN_name.tee` file has a matching `.expected` file. Special test cases:
- Test 34 (`builtin_properties`) — requires `-p` properties flag
- Test 41 (`result_pattern`) — uses `test/run_test41.js` to register external functions via `registerExternal()`
- Test 71 (`async_external`) — uses `test/run_test71.js` to register async external functions via `registerExternalAsync()`
- Test 72 (`shell`) — verifies `SHELL()` and `SHELL_CTX()` stubs return `{ok: false}` Result objects
- Test 78 (`task_stub`) — verifies `START_TASK()`, `TASK_STATUS()`, `TASK_RESULT()`, `WAIT_TASK()`, `CANCEL_TASK()` stubs return `{ok: false}` Result objects

The test runner (`test/run_tests.sh`) routes these special cases to their custom harnesses via a `case` statement. All other tests run via `node pt.js <file>`.

**Adding a new test:** Create `NN_name.tee` and `NN_name.expected` in `test/`. If the test needs external functions or special flags, add a case to `test/run_tests.sh`.

**Sample scripts:** `sample/01_hello.tee` through `sample/16_comments.tee` cover all language features.

## Architecture

### Execution Flow

```
Script text → ProperTeeLexer → ProperTeeParser → Parse Tree
                                                      ↓
                                          ProperTeeCustomVisitor.*visit*(tree)
                                                      ↓
                                              Generator objects (function*)
                                                      ↓
                                              Scheduler.run(mainGenerator)
                                                      ↓
                                         Round-robin generator.next() loop
```

### Generator Pattern

Every visitor method is a generator function (`function*`):

- **Statement visitors** (`*visitRoot`, `*visitBlock`, `*_callUserFunction`, `*_createThreadGenerator`) yield line numbers at statement boundaries for scheduler round-robin, then delegate to child visitors via `yield*`.
- **Expression visitors** (`*visitAdditiveExpr`, `*visitFunctionCall`, etc.) use `yield*` delegation but never yield directly — expressions are atomic.
- `yield lineNumber` = statement boundary (thread yields for scheduling)
- `yield { __schedulerCommand: true, type: '...' }` = scheduler command (SLEEP, SPAWN_THREADS, AWAIT_ASYNC)
- `return value` = generator completed with result

### Key Files

| File | Role |
|---|---|
| `ProperTee.g4` | ANTLR4 grammar — defines all syntax. Semicolons are whitespace (part of WS rule). `thread` keyword for spawning in multi blocks. `multi resultVar do ... end` syntax with optional result collection. Thread spawn keys reuse the `access` rule (same as property access): `thread key:`, `thread "key":`, `thread 42:`, `thread $var:`, `thread $::var:`, `thread $(expr):`, `thread :` (unnamed). `arrayLiteral` has two alternatives: `RangeArray` (`[start..end]` or `[start..end, step]`) and `ListArray` (`[1, 2, 3]`). Object keys must be quoted strings or integers — bare identifiers are not allowed (`{"name": "Alice"}`, not `{name: "Alice"}`). |
| `ProperTeeCustomVisitor.js` | Main visitor (~1800 lines). 41 built-in functions. All `*visit*` generator methods. `registerExternal()` for sync I/O, `registerExternalAsync()` for async I/O. Process-related functions (`SHELL`, `SHELL_CTX`, `START_TASK`, `TASK_STATUS`, `TASK_RESULT`, `WAIT_TASK`, `CANCEL_TASK`) are stubs that return `{ok: false, value: "... is not available in this environment"}` — JS runtime is for web mockup and property evaluation only. `_resolveAndValidateDynamicKey()` auto-coerces dynamic keys to string via `TO_STRING()`. `deepCopy()` at all sharing boundaries. `AsyncPendingError` class for async control flow. |
| `Scheduler.js` | Round-robin scheduler (~485 lines). Manages thread state, SLEEP timers, MULTI block spawning, async polling. Pre-builds result collection with `{status: "running", ok: false, value: {}}` entries at spawn time, updates in-place as threads complete, injects into monitor scope for live status reads. `pollAsyncFutures()` checks BLOCKED threads for resolved promises and timeouts. Debug mode support for playground stepping/breakpoints. |
| `ThreadContext.js` | Per-thread state (~170 lines): scope stack, global snapshot, sleep tracking, parent/child relationships, async state (`asyncResultCache`, `asyncResolved`, `asyncResolvedValue`, `asyncCacheKey`, `asyncTimeoutMs`, `asyncSubmitTime`). States: READY, RUNNING, SLEEPING, WAITING, BLOCKED, COMPLETED, ERROR. |
| `pt.js` | CLI entry point and interactive REPL. Parses CLI args, runs scripts or starts REPL. |
| `ProperTeeLexer.js` | ANTLR4-generated lexer (do not edit) |
| `ProperTeeParser.js` | ANTLR4-generated parser (do not edit) |
| `ProperTeeVisitor.js` | ANTLR4-generated visitor base class (do not edit) |
| `docs/index.html` | Playground — browser-based editor with syntax highlighting, debug stepping, and example scripts |
| `build-browser.js` | Bundles JS files into `browser/propertee-bundle.js` for the playground |

### Multi Block Purity Model

**Setup phase scope:** The multi block body (setup phase) runs in an isolated scope — a scope is pushed before setup and popped after. Variables created during setup don't leak into the surrounding scope. The `::` prefix is required to access globals, same as inside functions. `$::var` syntax accesses globals directly in dynamic keys (equivalent to `$(::var)`).

**Spawned thread purity:** Functions spawned inside multi blocks are pure with respect to global state:
- **Can read** globals via `::` (reads from a snapshot taken at `multi` block entry)
- **Cannot write** globals — `::x = value` is a runtime error (enforced via `inThreadContext` flag set by Scheduler)
- **Can call** any function (user-defined or built-in)
- **Can create** and modify local variables freely (plain `x` without `::`)
- **Return results** via `thread key: func()` syntax as Result objects: `{status: "done", ok: true, value: <result>}` on success, `{status: "error", ok: false, value: "<error>"}` on error. Results are pre-built with `{status: "running", ok: false, value: {}}` at spawn time and updated in-place as threads complete. The monitor clause can read `resultVar.key.status` during execution. The collection is assigned to `resultVar` after all threads finish.
- No locks, no shared mutable state

### Scope Resolution

**At top level:** global variables → built-in properties.

**Inside functions and multi setup (plain `x`):** local scopes (top of stack first) → multi result vars → error with hint to use `::x`.

**Inside functions and multi setup (`::x`):** global variables/snapshot → built-in properties.

The `::` prefix (`GLOBAL_PREFIX` token) bypasses local scopes and accesses globals directly. At top level (outside functions and multi setup), `x` and `::x` are equivalent. The `activeThread` field on the visitor routes scope access through the thread's local state when set by the scheduler.

### Scheduler (`Scheduler.js`)

The scheduler drives all execution — even single-threaded scripts run through it. Key mechanics:

**Main loop** (`async run()`):
1. Creates thread 0 (main) with the root generator
2. Loop: `wakeThreads()` → `pollAsyncFutures()` → `runMonitors()` → `selectNextThread()` → `generator.next()` → `processYield()`
3. When no READY threads exist: sleep-polls (capped at 50ms) if SLEEPING threads remain, busy-waits (1ms) if WAITING or BLOCKED threads remain, otherwise exits
4. Thread 0 errors propagate as exceptions; child thread errors go to stderr as `[THREAD ERROR]`

**Yield processing** (`processYield()`):
- `undefined` or line number → mark thread READY (statement boundary)
- `{ __schedulerCommand, type: 'SLEEP' }` → mark thread SLEEPING with wake time
- `{ __schedulerCommand, type: 'SPAWN_THREADS' }` → call `handleSpawnThreads()` (creates child threads, parent goes WAITING)
- `{ __schedulerCommand, type: 'AWAIT_ASYNC' }` → mark thread BLOCKED (waiting for async I/O)
- `{ __debugBreak }` → debug breakpoint (playground only)
- Generator done → mark COMPLETED, notify parent

**Async polling** (`pollAsyncFutures()`): Each iteration checks BLOCKED threads. If `asyncResolved === true`, caches result and marks READY. If timeout exceeded, caches `{status: "error", ok: false, value: "timeout"}` and marks READY.

**Debug mode**: Playground integration via `setDebugMode()`, `debugStep()`, `debugContinue()`, `debugStop()`. Fires `onStep` callback with thread state after each step.

### ThreadContext (`ThreadContext.js`)

Per-thread state container. Constructor takes `(id, name, generator, globalSnapshot)`.

| Field | Type | Default | Purpose |
|---|---|---|---|
| `id` | `number` | (ctor) | Unique thread ID (0 = main, -1 = monitor) |
| `name` | `string` | (ctor) | Debug name (e.g. `"worker-0"`, `"main"`, `"monitor"`) |
| `generator` | `Generator` | (ctor) | The generator driving this thread's execution |
| `state` | `ThreadState` | `READY` | Current thread state |
| `scopeStack` | `Array` | `[]` | Thread-private local variable scopes |
| `globalSnapshot` | `Object` | (ctor) | Read-only globals for thread purity (main thread uses live `variables`) |
| `sleepUntil` | `number\|null` | `null` | Absolute wake time (ms) when SLEEPING |
| `inThreadContext` | `boolean` | `false` | True for child threads — blocks `::x = val` writes |
| `inMonitorContext` | `boolean` | `false` | True for monitor execution — blocks all assignments |
| `inMultiContext` | `boolean` | `false` | True during multi setup — blocks result var access |
| `multiResultVars` | `Map` | `new Map()` | Result variables from completed multi blocks |
| `result` | `any` | `null` | Final return value when COMPLETED |
| `error` | `Error\|null` | `null` | Exception when ERROR |
| `parentId` | `number\|null` | `null` | Parent thread ID (null for main) |
| `waitingForChildren` | `Set\|null` | `null` | Child IDs still running |
| `asyncResultCache` | `Object` | `{}` | Cached results from completed async operations |
| `asyncResolved` | `boolean` | `false` | True when async Promise has resolved |
| `asyncResolvedValue` | `any` | `null` | The resolved value from the async Promise |
| `asyncCacheKey` | `string\|null` | `null` | Cache key for current pending async operation |
| `asyncTimeoutMs` | `number` | `0` | Timeout for current async operation (0 = no timeout) |
| `asyncSubmitTime` | `number` | `0` | Timestamp when async operation was submitted |

**ThreadState transitions:**
```
READY → RUNNING → READY           (normal step: boundary)
READY → RUNNING → SLEEPING        (SLEEP command)
READY → RUNNING → WAITING         (SPAWN_THREADS command, waiting for children)
READY → RUNNING → BLOCKED         (AWAIT_ASYNC command, waiting for async I/O)
READY → RUNNING → COMPLETED       (generator done)
READY → RUNNING → ERROR           (exception thrown)
WAITING → READY                    (all children completed)
SLEEPING → READY                   (sleep timer expired)
BLOCKED → READY                    (async promise resolved or timed out)
```

### Flow Control

`BreakException`, `ContinueException`, `ReturnException`, and `AsyncPendingError` propagate through generator chains. Generators catch these where appropriate: loops catch break/continue, function call generators catch return, statement-level generators catch `AsyncPendingError` and yield `AWAIT_ASYNC` to the scheduler for retry.

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
LEN(result)             // 2

// Dynamic thread keys — $var, $::var, and $(expr) syntax
names = ["alpha", "beta"]
multi result do
    loop name in ::names do
        thread $name: worker(name)             // key from variable
    end
    thread $("gamma"): worker("C")             // key from expression
end

// Conditional/dynamic spawning in multi blocks
// Setup runs in isolated scope — :: required for globals
multi result do
    if ::needsA == true then
        thread rA: workerA()
    end
    i = 1
    loop i <= 3 infinite do
        thread : workerB(i)
        i = i + 1
    end
end

// Range arrays
nums = [1..5]              // [1, 2, 3, 4, 5]
odds = [1..10, 2]          // [1, 3, 5, 7, 9]
down = [5..1]              // [5, 4, 3, 2, 1] (auto step -1)

// Loops
loop condition infinite do ... end
loop item in collection do ... end
loop key, val in collection do ... end
loop x in [1..10] do ... end  // range in loop

// Access patterns: obj.prop, arr.1, obj."key", obj.$var, obj.$::var, obj.$(expr)

// Shell commands (stubs in JS — return {ok: false} with error message)
// Real execution only in Java runtime
result = SHELL("echo hello")
ctx = SHELL_CTX("/data", {"ENV": "prod"})
result = SHELL(ctx, "./build.sh")

// Task engine (stubs in JS — return {ok: false} with error message)
// Real execution only in Java runtime
r = START_TASK("long-running-cmd")
s = TASK_STATUS(taskId)
r = TASK_RESULT(taskId)
r = WAIT_TASK(taskId, 5000)
r = CANCEL_TASK(taskId)
```

## External Functions & Result Pattern

Host applications can register external built-in functions that return result objects instead of throwing errors:

```javascript
// JS host registers an external function:
visitor.registerExternal('GET_BALANCE', (user) => {
    if (userExists(user)) return ProperTeeCustomVisitor.ok(getBalance(user));
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

### Async External Functions

`registerExternalAsync(name, func, timeoutMs = 0)` registers functions that execute asynchronously via Promises. Used for blocking I/O (DB queries, HTTP calls) so other ProperTee threads aren't frozen.

```javascript
// Register an async function (can be sync or return a Promise)
visitor.registerExternalAsync('SLOW_FETCH', async (key) => {
    const response = await fetch(`https://api.example.com/${key}`);
    return ProperTeeCustomVisitor.ok(await response.json());
}, 5000); // 5s timeout
```

**Mechanism — statement re-execution with cached results:**
1. Async wrapper submits function via `setTimeout(0)` + Promise, stores cache key on `ThreadContext`
2. Throws `AsyncPendingError` to unwind expression evaluation
3. Generator catches it at statement level, yields `{ __schedulerCommand: true, type: 'AWAIT_ASYNC' }`
4. Scheduler marks thread `BLOCKED`, polls `asyncResolved` each iteration via `pollAsyncFutures()`
5. When Promise resolves, `.then()` sets `asyncResolved = true` and `asyncResolvedValue` on ThreadContext
6. Scheduler caches result in `asyncResultCache`, clears async state, marks thread `READY`
7. Generator re-executes the **same statement** — async wrapper finds cached result, returns it immediately
8. Statement completes normally, `asyncResultCache` is cleared

**Race condition prevention:** The `.then()` callback captures the cache key and only stores the result if the thread is still waiting for that specific key. This prevents late-resolving Promises from interfering after a timeout.

**Limitations:** Side-effect replay on statement retry; sequential multi-async (not parallel); not allowed in monitors.

## Conventions

- **No implicit null** (spec v0.8.0) — the language never produces null: functions without `return` or with bare `return` produce `{}` (empty object), missing function arguments default to `{}`. The `null` literal exists purely as data for lossless JSON round-trips, represented internally by the exported `TEE_NULL` Symbol (NOT JS `null`, which the visitor uses as a statement sentinel; a Symbol naturally falls through every typeof-based check). Equality and `TYPE_OF` (→ `"null"`) work on it; conditions, logic, arithmetic, and member access on it are runtime errors.
- **Result escalation + genuine-Result brand** (spec v0.10.0) — `FAIL`/`UNWRAP` are dispatched in `visitFunctionCall` (not the builtin table) so their errors carry the call site's line:col; `OK`/`ERR`/`IS_RESULT` live in the builtin table. The brand is `TEE_RESULT = Symbol.for('propertee.result')` used as a symbol **key** (`{status, ok, value, [TEE_RESULT]: true}`) — invisible to `Object.keys`/`JSON.stringify`/display; `deepCopy` carries it explicitly (Object.keys skips symbols). `Symbol.for` (registry symbol) is deliberate: `Scheduler.js` brands its collection entries with its own `Symbol.for` lookup, no cross-module import and no bundle-ordering concern. Every Result the runtime creates must go through `makeResult()` (visitor) or carry `[TEE_RESULT]: true` (Scheduler) — a new Result construction site without the brand silently breaks `UNWRAP`/`IS_RESULT` on that path.
- **Function-name resolution** (spec v0.11.0) — `visitFunctionCall` resolves ignored check → **user-defined functions** → `FAIL`/`UNWRAP` → `this.functions` (builtins + externals). Script functions shadow everything (this runtime was builtins-first until spec v0.11.0 pinned script-first — don't move the user-defined block back down).
- **Reserved all-uppercase namespace** (spec v0.12.0) — `visitFunctionDef` rejects function names matching `^[A-Z][A-Z0-9_]*$` at definition time (fixture 105; 104 retired with the shadowing premise). ALL-CAPS is guaranteed built-in/host, so script/built-in collisions can't arise; the v0.11.0 dispatch order still matters for non-reserved host-registered names.
- **ES modules** — all files use `import`/`export`. Package type is `"module"`.
- **Plain objects for collections** — `{}` for ProperTee objects (preserves insertion order in V8/modern engines), `[]` for arrays. All runtime values are plain JS primitives/objects.
- `SLEEP()` returns a scheduler command object — the generator yields it to the scheduler
- 1-based indexing for array/string access (`.1` is the first element). `*visitArrayAccess` returns the 1-based integer; `*visitMemberAccessExpr` converts to 0-based for arrays and strings. For objects, the integer becomes the string key directly (`obj.1` reads/writes key `"1"`)
- Strict type checking: `and`/`or` require booleans, arithmetic requires numbers. Exception: `+` with at least one string coerces the other operand via `TO_STRING()` (concatenation)
- Division always produces a float
- Semicolons are optional statement separators (treated as whitespace by the lexer)
- **Deep-copy value semantics** — `this.deepCopy()` is called at all sharing boundaries: variable assignment, property/array assignment, function args, thread args, global snapshot, loop variables. No shared mutable state between variables.
- **Syntax highlighting** — ProperTee repo has Vim and VS Code syntax files. The playground (`docs/index.html`) has regex-based syntax highlighting via `highlightSyntax()` — update the `builtins` and `keywords` strings there when adding new built-in functions or keywords.
- **PRINT formatting** — `formatDisplayValue()` / `formatJsonValue()` helpers in the constructor match Java's `TypeChecker.formatValue()` output: objects `{ "key": 'val' }`, arrays `[ 1, 'hello' ]`, strings inside collections are single-quoted.

## Dependencies

- antlr4 ^4.13.2 (parser runtime, via npm)
