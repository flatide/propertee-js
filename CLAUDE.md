# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

ProperTee Java is a Java implementation of the [ProperTee](https://github.com/flatide/ProperTee) language. It uses ANTLR4 for parsing and a **Stepper interface pattern for cooperative multithreading** (replacing the JavaScript generator-based approach from [propertee-js](https://github.com/flatide/propertee-js)). Every statement visitor produces a Stepper object; a central scheduler round-robins between threads at statement boundaries.

## Build Commands

```bash
# Full build (generate parser + compile + test + JAR)
./gradlew clean build

# Individual steps:
./gradlew generateGrammarSource   # regenerate parser/lexer/visitor from grammar
./gradlew classes                 # compile Java sources
./gradlew jar                     # create fat JAR (build/libs/propertee-java.jar)
./gradlew test                    # run JUnit tests

# Dual-target fat JARs:
./gradlew jar7                    # Java 7 fat JAR → build/libs/propertee-java-java7.jar
./gradlew jar8                    # Java 8 fat JAR → build/libs/propertee-java-java8.jar
./gradlew jarAll                  # Both JARs

# Run a script via Gradle
./gradlew run --args="sample/01_hello.pt"
```

**After any grammar change** (`grammar/ProperTee.g4`), run `./gradlew generateGrammarSource` to regenerate parser files.

**Build requirements:** JDK 8+ for building (JDK 8 required to produce Java 7 bytecode via `-source 1.7 -target 1.7`). Gradle (wrapper included). Target runtime is **Java 7 (1.7)**.

## CLI Runner

`Main.java` runs `.pt` scripts from the command line. Falls back to an interactive REPL when no file is given.

```bash
java -jar build/libs/propertee-java.jar script.pt                          # run a script
java -jar build/libs/propertee-java.jar -p '{"width":100}' script.pt       # with built-in properties
java -jar build/libs/propertee-java.jar -f props.json script.pt            # properties from file
java -jar build/libs/propertee-java.jar --max-iterations 5000 script.pt    # custom loop limit
java -jar build/libs/propertee-java.jar                                    # interactive REPL
```

REPL commands: `.vars` (show variables), `.exit` (quit). Multi-line blocks are auto-detected via `do`/`if` vs `end` depth.

## Testing

```bash
# Run all tests via JUnit (integrated with build)
./gradlew test

# Run a single test by name (parameterized test filter)
./gradlew test --tests "com.propertee.tests.ScriptTest.testScript[09_functions]"

# Run all tests via shell script (compares JAR output against .expected files)
./test_all.sh
```

There are 69 test pairs in `src/test/resources/tests/` (numbered 01-70, test 31 skipped). Each `NN_name.pt` file has a matching `.expected` file. Test 34 (`builtin_properties`) requires properties passed via `-p`. Test 41 (`result_pattern`) registers external functions via `registerExternal`. Test 46 (`thread_error_result`) verifies that thread errors are captured as `{ok: false, value: "..."}` Result objects. Test 47 (`spawn_outside_multi`) verifies `thread` outside multi block is a runtime error. Test 48 (`has_key`) verifies `HAS_KEY()` built-in function. Tests 49-54 cover multi result collection, dynamic spawn, auto keys, duplicate key error, LEN on maps, and integer-as-string-key access on objects. Test 55 (`thread_status_field`) verifies the `status` field on thread results. Test 56 (`monitor_reads_result`) verifies that monitor clauses can read thread result status during execution. Test 57 (`dynamic_thread_keys`) verifies `$var`, `$::var`, and `$(expr)` dynamic key syntax in thread spawns. Test 58 verifies `#`-prefixed dynamic keys work. Test 59 verifies all spawn key types (dynamic `$var`/`$::var`, expression `$(expr)`, integer literal, string literal) with auto-coercion to string. Test 60 verifies duplicate dynamic key error. Test 61 (`duplicate_auto_key`) verifies that an explicit key colliding with an auto-generated `#N` key is a runtime error. Test 62 (`range_array`) verifies range array literal syntax `[start..end]` and `[start..end, step]`. Test 63 (`range_step_zero`) verifies that step=0 is a runtime error. Test 64 (`time_functions`) verifies `RANDOM()`, `MILTIME()`, `DATE()`, and `TIME()` built-in functions. Test 65 (`keys`) verifies `KEYS()` built-in function. Test 66 (`sort`) verifies `SORT()`, `SORT_DESC()`, `SORT_BY()`, `SORT_BY_DESC()`, and `REVERSE()` built-in functions. Test 67 (`sort_errors`) verifies sort error cases (mixed types, non-array, missing key). Test 68 (`cow_semantics`) verifies deep-copy value semantics: variable assignment isolation, nested mutation isolation, function parameter isolation, array isolation, object-in-array isolation, deep nesting isolation, and loop variable isolation. Test 69 (`thread_isolation`) verifies that thread global snapshots are deep copies (thread mutations don't affect caller's globals). Test 70 (`debug_statement`) verifies that `debug` is valid syntax and a no-op in normal execution.

**Adding a new test:** Create `NN_name.pt` and `NN_name.expected` in `src/test/resources/tests/`, then add the test name string to the `testNames` array in `ScriptTest.java`. The test list is hardcoded — tests won't be discovered automatically.

**Sample scripts:** `sample/01_hello.pt` through `sample/16_comments.pt` cover all language features.

## Architecture

### Execution Flow

```
Script text → ProperTeeLexer → ProperTeeParser → Parse Tree
                                                      ↓
                                          ProperTeeInterpreter.visit*(tree)
                                                      ↓
                                              Stepper objects (state machines)
                                                      ↓
                                              Scheduler.run(mainStepper)
                                                      ↓
                                         Round-robin stepper.step() loop
```

### Stepper Pattern (replaces JS generators)

The `Stepper` interface replaces JavaScript's `function*`/`yield`/`yield*`:

```java
interface Stepper {
    StepResult step();           // advance one step
    boolean isDone();            // completed?
    Object getResult();          // final value
    void setSendValue(Object v); // scheduler sends data back (MULTI results)
}
```

- **Statement visitors** return multi-step Steppers (`BlockStepper`, `RootStepper`, `FunctionCallStepper`, etc.) that yield `StepResult.BOUNDARY` between statements.
- **Expression visitors** evaluate eagerly via `eval()` — expressions are atomic, never yielding mid-evaluation.
- `StepResult.boundary()` = statement boundary (thread stays READY)
- `StepResult.command(cmd)` = scheduler command (SLEEP, SPAWN_THREADS)
- `StepResult.done(value)` = stepper completed with result

### Package Structure

| Package | Role |
|---|---|
| `com.propertee.cli` | CLI entry point (`Main.java`) and interactive REPL (`Repl.java`) |
| `com.propertee.interpreter` | Core interpreter (`ProperTeeInterpreter.java` ~1610 lines), built-in functions, scope management, function definitions |
| `com.propertee.stepper` | Stepper interface, StepResult, SchedulerCommand — the cooperative multithreading API |
| `com.propertee.scheduler` | Round-robin scheduler, ThreadContext, ThreadState — manages thread lifecycle |
| `com.propertee.runtime` | Type checking, error types (ProperTeeError, BreakException, ContinueException, ReturnException), Result pattern |
| `com.propertee.parser` | ANTLR4-generated code (do not edit — regenerated from `grammar/ProperTee.g4`) |

### Key Files

| File | Role |
|---|---|
| `grammar/ProperTee.g4` | ANTLR4 grammar — defines all syntax. Semicolons are whitespace (part of WS rule). `thread` keyword for spawning in multi blocks. `multi resultVar do ... end` syntax with optional result collection. Thread spawn keys reuse the `access` rule (same as property access): `thread key:`, `thread "key":`, `thread 42:`, `thread $var:`, `thread $::var:`, `thread $(expr):`, `thread :` (unnamed). `arrayLiteral` has two alternatives: `RangeArray` (`[start..end]` or `[start..end, step]`) and `ListArray` (`[1, 2, 3]`). |
| `ProperTeeInterpreter.java` | Main visitor. All `visit*` methods plus inner Stepper classes (RootStepper, BlockStepper, FunctionCallStepper, ThreadGeneratorStepper). `visitSpawnKeyStmt` resolves key from `access` context (StaticAccess, StringKeyAccess, ArrayAccess, VarEvalAccess, EvalAccess). `visitParallelStmt` resolves auto-keys (`#1`, `#2`) for unnamed threads and detects collisions with explicit keys before passing to scheduler. `eval()` for expressions, `createStepper()` for statements. Integer keys on objects become string keys in `getProperty()`. `resolveAndValidateDynamicKey()` auto-coerces dynamic keys to string via `TO_STRING()` (empty treated as unnamed, no duplicates). |
| `BuiltinFunctions.java` | 34 built-in functions (PRINT, SUM, MAX, MIN, LEN, PUSH, SPLIT, JOIN, HAS_KEY, KEYS, SORT, SORT_DESC, SORT_BY, SORT_BY_DESC, REVERSE, RANDOM, MILTIME, DATE, TIME, etc.). LEN supports strings, arrays, and objects. `registerExternal()` for I/O functions with result pattern. `PrintFunction` interface takes `Object[]` args, not `String` |
| `Scheduler.java` | Round-robin scheduler. Manages thread state, SLEEP timers, MULTI block spawning. Pre-builds result collection with `Result.running()` at spawn time (all keys pre-resolved by interpreter, including auto-keys `"#1"`, `"#2"` for unnamed threads), updates entries in-place as threads complete, injects result collection into monitor scope for live status reads |
| `ThreadContext.java` | Per-thread state: scope stack, global snapshot, sleep tracking, parent/child relationships, `resultCollection` (live map updated in-place by scheduler) |
| `TypeChecker.java` | Runtime type checks, number formatting, value formatting |
| `ScopeStack.java` | Scope chain with UNDEFINED sentinel |

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

The `::` prefix (`GLOBAL_PREFIX` token) bypasses local scopes and accesses globals directly. At top level (outside functions and multi setup), `x` and `::x` are equivalent. The `activeThread` field on the interpreter routes scope access through the thread's local state when set by the scheduler.

### Scheduler (`Scheduler.java`)

The scheduler drives all execution — even single-threaded scripts run through it. Key mechanics:

**Instance state**: `threads` (LinkedHashMap<Integer, ThreadContext>), `monitors` (ArrayList<MonitorState>), `nextThreadId` (counter), `currentThreadId` (for round-robin).

**MonitorState** (inner class): `interval` (ms), `blockCtx`, `lastRun` (timestamp), `parentThreadId`, `childIds`.

**Main loop** (`run()`):
1. Creates thread 0 (main) with the root stepper
2. Loop: `wakeThreads()` → `runMonitors()` → `selectNextThread()` → `step()` → `processStepResult()`
3. When no READY threads exist: sleep-polls (capped at 50ms) if SLEEPING threads remain, busy-waits (1ms) if WAITING threads remain, otherwise exits
4. Thread 0 errors propagate as exceptions; child thread errors go to stderr as `[THREAD ERROR]`

**Thread selection** (`selectNextThread()`): Round-robin by sorted thread ID, starting after `currentThreadId`. Only picks READY threads.

**Step result handling** (`processStepResult()`):
- `BOUNDARY` → mark thread READY (yield point for scheduling)
- `COMMAND(SLEEP)` → mark thread SLEEPING with wake time
- `COMMAND(SPAWN_THREADS)` → call `handleSpawnThreads()` (creates child threads, parent goes WAITING)
- `DONE` → mark COMPLETED, notify parent via `notifyChildCompleted()`

**Thread spawning** (`handleSpawnThreads()`):
1. Creates child ThreadContexts from specs, each with `inThreadContext = true`
2. Sets up monitor if present (stores interval, block ctx, child IDs in MonitorState, `lastRun` initialized to current time)
3. Marks parent WAITING with child ID set
4. Pre-builds `resultCollection` on parent with `Result.running()` entries (all keys pre-resolved by interpreter, including auto-keys `"#1"`, `"#2"` for unnamed threads)

**Child completion** (`notifyChildCompleted()`):
1. Updates parent's `resultCollection` in-place — `Result.ok()` or `Result.error()`
2. Removes child from parent's `waitingForChildren` set
3. When all children done: runs final monitor tick, removes monitor, sends `{resultVarName, collection}` payload to parent via `collectedResults`
4. Parent wakes to READY; scheduler sends payload via `stepper.setSendValue()`

**Monitor execution** (`runMonitors()` + `executeMonitorSync()`): Each scheduler iteration checks all monitors — fires when `(now - lastRun >= interval)`, updates `lastRun`. `executeMonitorSync()` creates a temporary ThreadContext (id -1, name "monitor") with `inMonitorContext = true`. Copies global snapshot and injects the live `resultCollection` under `resultCollectionVarName`. Runs the monitor block synchronously via `visitor.evalBlock()`. Monitor errors go to stderr as `[MONITOR ERROR]`, not thrown. `runFinalMonitor()` runs one last tick when all children complete, then removes the monitor.

**Interpreter integration**: `visitor.activeThread` is set to the current thread before each step. The interpreter's `getScopeStack()`, `getVariables()`, `isInFunctionScope()` etc. all check `activeThread` to route scope access through the thread's local state.

### ThreadContext (`ThreadContext.java`)

Per-thread state container. Constructor takes `(int id, String name, Stepper stepper, Map<String, Object> globalSnapshot)`. All fields are public (scheduler accesses them directly).

| Field | Type | Default | Purpose |
|---|---|---|---|
| `id` | `int` | (ctor) | Unique thread ID (0 = main, -1 = monitor) |
| `name` | `String` | (ctor) | Debug name (e.g. `"worker-0"`, `"main"`, `"monitor"`) |
| `stepper` | `Stepper` | (ctor) | The stepper driving this thread's execution |
| `state` | `ThreadState` | `READY` | `READY → RUNNING → READY → ... → COMPLETED/ERROR` |
| `scopeStack` | `ScopeStack` | `new ScopeStack()` | Thread-private local variable scopes |
| `globalSnapshot` | `Map<String, Object>` | (ctor) | Read-only globals for thread purity (main thread uses live `variables`) |
| `sleepUntil` | `Long` | `null` | Absolute wake time (ms) when SLEEPING |
| `inThreadContext` | `boolean` | `false` | True for child threads — blocks `::x = val` writes |
| `inMonitorContext` | `boolean` | `false` | True for monitor execution — blocks all assignments |
| `inMultiContext` | `boolean` | `false` | True during multi setup — blocks result var access |
| `multiResultVars` | `Map<String, Object>` | `{}` | Result variables from completed multi blocks (accessible in later code) |
| `result` | `Object` | `null` | Final return value when COMPLETED |
| `error` | `Throwable` | `null` | Exception when ERROR |
| `parentId` | `Integer` | `null` | Parent thread ID (null for main) |
| `waitingForChildren` | `Set<Integer>` | `null` | Child IDs still running (null when not WAITING) |
| `resultCollection` | `Map<String, Object>` | `null` | Live result map updated in-place as children complete |
| `childIds` | `List<Integer>` | `null` | Ordered child thread IDs for this multi block |
| `resultKeyNames` | `List<String>` | `null` | Parallel list of key names (all pre-resolved by interpreter, including auto-keys `"#N"`) |
| `resultCollectionVarName` | `String` | `null` | The `resultVar` name from `multi resultVar do` |
| `collectedResults` | `Object` | `null` | Payload sent to parent stepper via `setSendValue()` when all children done |
| `resultKeyName` | `String` | `null` | This child's key in parent's collection |
| `localScope` | `Map<String, Object>` | `null` | Function parameters for spawned thread |

Methods: `markRunning()`, `markReady()`, `markSleeping(long)`, `markWaiting(List<Integer>)`, `markCompleted(Object)`, `markError(Throwable)`, `shouldWake(long)`, `childCompleted(int)` → returns true when all children done.

**ThreadState transitions:**
```
READY → RUNNING → READY           (normal step: boundary)
READY → RUNNING → SLEEPING        (SLEEP command)
READY → RUNNING → WAITING         (SPAWN_THREADS command, waiting for children)
READY → RUNNING → COMPLETED       (stepper done)
READY → RUNNING → ERROR           (exception thrown)
WAITING → READY                    (all children completed)
SLEEPING → READY                   (sleep timer expired)
```

### SchedulerCommand & StepResult

**StepResult** — returned by `Stepper.step()`:
- `StepResult.BOUNDARY` — statement boundary, thread yields for round-robin
- `StepResult.done(value)` — stepper completed with final value
- `StepResult.command(cmd)` — scheduler command requiring action

**SchedulerCommand** — two types:
- `SchedulerCommand.sleep(durationMs)` — pause current thread
- `SchedulerCommand.spawnThreads(specs, monitorSpec, globalSnapshot, resultKeyNames, resultVarName)` — spawn child threads for multi block

**SchedulerCommand.ThreadSpec** — per-thread spawn data: `{name, stepper, localScope}`

**SchedulerCommand.MonitorSpec** — monitor config: `{interval, blockCtx}`

### Flow Control

`BreakException`, `ContinueException`, and `ReturnException` propagate through stepper chains. Steppers catch these where appropriate (loops catch break/continue, function call steppers catch return).

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
```

## External Functions & Result Pattern

Host applications can register external built-in functions that return result objects instead of throwing errors:

```java
// Java host registers an external function:
interpreter.builtins.registerExternal("GET_BALANCE", new BuiltinFunction() {
    public Object call(List<Object> args) {
        String user = (String) args.get(0);
        if (userExists(user)) return Result.ok(getBalance(user));
        return Result.error("account not found");
    }
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

- `Result.running()` → `{status: "running", ok: false, value: {}}`
- `Result.ok(value)` → `{status: "done", ok: true, value: ...}`
- `Result.error(message)` → `{status: "error", ok: false, value: "..."}`
- `registerExternal()` wraps the function in try-catch — thrown exceptions automatically become `{status: "error", ok: false, value: "error message"}`
- Core builtins (PRINT, SUM, LEN, etc.) return values directly and are not wrapped

## Conventions

- **No null** — the language has no null keyword. Functions without `return` or with bare `return` produce `{}` (empty object). Missing function arguments default to `{}`.
- **Java 7 target compatibility** — no lambdas, no streams, no Java 8 APIs. Use anonymous inner classes throughout. Build currently set to `-source 1.8 -target 1.8` for JDK 9+ compatibility; switch to `VERSION_1_7` when building with JDK 8.
- **Collections** — use `LinkedHashMap<String, Object>` for objects (preserves insertion order), `ArrayList<Object>` for lists. The `Object` type represents all values at runtime.
- `SLEEP()` returns a `SchedulerCommand` — the stepper yields it to the scheduler
- 1-based indexing for array/string access (`.1` is the first element). `visitArrayAccess` returns the 1-based integer; consumers (`getProperty`, `setProperty`) convert to 0-based for arrays and strings. For objects, the integer becomes the string key directly (`obj.1` reads/writes key `"1"`)
- Strict type checking: `and`/`or` require booleans, arithmetic requires numbers. Exception: `+` with at least one string coerces the other operand via `TO_STRING()` (concatenation)
- Numbers: `Integer` for whole numbers, `Double` for decimals. Format helper strips `.0`
- Division always produces `Double`
- Semicolons are optional statement separators (treated as whitespace by the lexer)
- **Syntax highlighting** — ProperTee repo has Vim (`editors/vim/syntax/propertee.vim`) and VS Code (`editors/vscode/syntaxes/propertee.tmLanguage.json`) syntax files. Update when adding keywords or built-in functions.

## Dependencies

- ANTLR 4.9.3 (parser generation and runtime — last version supporting Java 7 runtime)
- Gson 2.8.9 (JSON parsing for `-p`/`-f` properties — last version supporting Java 7)
- JUnit 4.13.2 (testing)
