# ProperTee Language Specification v0.20.0

## Overview

ProperTee is a small, safe scripting language designed for embedding in host applications. It features cooperative multithreading with a thread purity model — threads cannot mutate shared state, eliminating data races by design. There are no locks, no shared mutable state, and no implicit null.

## Values and Types

ProperTee has seven types:

| Type | Examples | Notes |
|---|---|---|
| number (integer) | `0`, `42`, `-7` | Whole numbers |
| number (decimal) | `3.14`, `0.5` | Floating-point numbers |
| string | `"hello"`, `"it's \"quoted\""` | Double-quoted, `\"` for embedded quotes |
| boolean | `true`, `false` | |
| array | `[1, 2, 3]`, `[]` | Ordered, 1-based indexing, heterogeneous |
| object | `{"name": "Alice", "age": 30}`, `{}` | Ordered key-value pairs, string keys |
| null | `null` | JSON's explicit "no value" — data, not a language mechanism |

There is **no implicit null**. The language itself never produces `null`: a missing argument defaults to `{}`, a function without a `return` returns `{}`, and no operation quietly yields `null`. The empty object `{}` remains the language's "no value" sentinel. `null` exists so that JSON — where `null` is a standard, meaningful value — round-trips losslessly: it enters a program only through the `null` literal or through data (`JSON_PARSE`, host-injected values), and it stays inert wherever it lands:

- `TYPE_OF(null)` → `"null"`; it displays and JSON-formats as `null` (unquoted).
- Equality works: `null == null` is `true`, `null == {}` is `false`, `null == 0` is `false`.
- Everything else is a runtime error — `null` in a condition (`Condition requires a boolean value. Got null`), in arithmetic or logic, or member access on it. There is no null propagation: misuse fails loudly at the point of use.

Scripts that don't touch JSON `null` never see it; check for it explicitly (`if x == null then`) at data boundaries.

### Number Representation

- Integer and decimal are both "number" but stored differently
- Arithmetic that produces a whole number result displays without a decimal point: `10 / 2` displays as `5`
- Division always produces a decimal internally: `7 / 2` → `3.5`
- Whole-number results of other operations display as integers: `1.0 + 2.0` → `3`

#### Integer vs decimal is nominal (spec v0.14.0)

Whether a number is an **integer** or a **decimal** is fixed *where the value is produced* — by the
operation's structure, not by whether the runtime value happens to be whole. A decimal that lands on
a whole value (`1.5 + 1.5`) stays a decimal; it never turns back into an integer.

- **Integers** come from: integer literals; integer-with-integer `+`, `-`, `*`, `%`, and unary `-`
  (overflow-checked, below); and integer-producing built-ins (`LEN`, `FLOOR`, `CEIL`, `ROUND`,
  `ABS` of an integer, and the like).
- **Decimals** come from: decimal literals (including whole ones like `3.0`); any `/`; any operation
  with a decimal operand (`2 + 3.0` → decimal `5`); decimal-producing built-ins (`RANDOM`, …); and
  data whose text carries a fraction or exponent — `JSON_PARSE`/`TO_NUMBER` of a token containing
  `.`, `e`, or `E`, or of an integer literal outside the 32-bit range.

The only places this distinction is observable are the **integer-overflow rule** (next section) and
**display of extreme magnitudes** (§Output Formatting): whether an expression *can* overflow is
decided by its structure, never by the data flowing through it, so `2.0 * 1500000000` is the plain
decimal `3000000000` while `2 * 1500000000` (both integers) overflows. Everything else treats the two
alike — `TYPE_OF` is `"number"` for both, `2 == 2.0` is `true`, and a whole value displays the same
either way. Where an **integer is required** (indexing, dynamic keys, integer built-in arguments) a
whole decimal is accepted by coercion; a non-whole decimal is an error, as before.

#### The integer range (spec v0.13.0)

Integers are **32-bit signed** values: −2,147,483,648 … 2,147,483,647. Like every other type rule
in ProperTee, leaving the range fails loudly at the point of use — there is no silent wrap-around
and no silent promotion to a decimal:

- An integer **literal** must fit the range. Literal tokens are unsigned, so the largest literal is
  `2147483647`; a larger one is a runtime error: `Integer literal out of range: 9999999999`. The
  most negative integer −2³¹ cannot be written directly (the minus sign is an operator), but it is
  a perfectly valid value — reach it with arithmetic: `-2147483647 - 1`.
- Integer **arithmetic** (`+`, `-`, `*`, unary `-`) whose result leaves the range is a runtime
  error: `Integer overflow`. (`/` always produces a decimal and cannot overflow; `%` cannot
  overflow.)
- The built-ins that produce an integer — `FLOOR`, `CEIL`, `ROUND` (from a decimal) and `ABS` (|−2³¹| does not fit) — raise the same `Integer overflow` error when the result does not fit.
- **Data is unaffected**: `JSON_PARSE` and `TO_NUMBER` keep representing integral values beyond
  the range as decimals — data conversion is not script arithmetic, and JSON keeps round-tripping.

### Truthiness

`if` conditions and `loop` conditions require a **boolean** value:

- `true` — take the branch / continue the loop
- `false` — skip the branch / stop the loop
- **Any other type is a runtime error:** `Condition requires a boolean value`

There is no implicit coercion — `0`, `""`, `[]`, `{}` are not "falsy", they are type errors in a condition, matching the strictness of the logical operators. (Until spec v0.6.0, non-booleans in conditions were silently falsy; v0.7.0 made them loud — see the changelog migration note.)

## Variables

Variables are created by assignment. No declaration keyword is needed.

```
x = 10
name = "Alice"
items = [1, 2, 3]
```

Referencing an undefined variable is a runtime error.

### Value Semantics

All assignments produce a **deep copy** of the right-hand side. Modifying a variable never affects any other variable, even for objects and arrays:

```
a = {"x": 1}
b = a           // b is an independent copy
b.x = 99
PRINT(a.x)      // 1 — a is unchanged
```

This applies everywhere values cross boundaries: variable assignment, property/element assignment, function arguments, loop variables, and thread global snapshots.

### `::` Global Variable Prefix

Inside functions, plain variable names only access **local** variables. To read or write a global variable from within a function, use the `::` prefix:

```
x = 10

function readGlobal() do
    return ::x          // reads global x
end

function writeGlobal() do
    ::x = 42            // writes global x
end

function localOnly() do
    x = "local"         // creates a LOCAL x
    return x            // returns "local"
end

readGlobal()             // 10
writeGlobal()
PRINT(x)                 // 42
localOnly()
PRINT(x)                 // 42 (unchanged by localOnly)
```

At the **top level** (outside functions), `x` and `::x` are equivalent — both access globals.

**Rules:**
- Inside functions and multi setup: plain `x` is local-only. Use `::x` to access globals.
- In spawned threads: `::x` reads from the global snapshot. `::x = value` is a runtime error (thread purity).
- Built-in properties (host-injected via `-p`): require `::` inside functions and multi setup.
- Multi result variables and loop variables: accessible without `::` (they are local).
- Function names and built-in functions: resolved separately, no `::` needed.

## Operators

### Arithmetic

| Operator | Operation | Operand Types | Result |
|---|---|---|---|
| `+` | addition | number + number | number |
| `+` | concatenation | string + any | string |
| `+` | concatenation | any + string | string |
| `-` | subtraction | number - number | number |
| `*` | multiplication | number * number | number |
| `/` | division | number / number | number (always decimal) |
| `%` | modulo | number % number | number |
| `-` (unary) | negation | number | number |

When `+` has at least one string operand, the other value is coerced to string using `TO_STRING()` internally. Non-string, non-number combinations (e.g., `boolean + boolean`) are a runtime error.

Division by zero is a runtime error.

### Comparison

| Operator | Operation | Operand Types |
|---|---|---|
| `==` | equal | any == any |
| `!=` | not equal | any != any |
| `>` | greater than | number > number |
| `<` | less than | number < number |
| `>=` | greater or equal | number >= number |
| `<=` | less or equal | number <= number |

Equality (`==`, `!=`) works across all types. Values are compared by content, not identity — `{} == {}` is `true`. `null` equals only itself: `null == null` is `true`; against any other value (including `{}`) it is `false`. Relational operators (`>`, `<`, `>=`, `<=`) require both operands to be numbers.

### Logical

| Operator | Operation | Operand Types |
|---|---|---|
| `and` | logical AND | boolean and boolean |
| `or` | logical OR | boolean or boolean |
| `not` | logical NOT | not boolean |

All logical operators **require boolean operands**. Using a number or string with `and`/`or` is a runtime error.

Evaluation **short-circuits** left to right: `false and X` and `true or X` do not evaluate `X` at all — side effects included — and an operand is type-checked only when it is evaluated. This enables the presence-guard idiom:

```
if HAS_KEY(obj, "k") and obj.k == 1 then   // obj.k is never touched when "k" is absent
    ...
end
```

(Until spec v0.6.0 both sides were always evaluated.)

### Precedence (lowest to highest)

1. `or`
2. `and`
3. `==` `!=` `>` `<` `>=` `<=`
4. `+` `-`
5. `*` `/` `%`
6. `-` (unary), `not`
7. `.` (member access)

Parentheses `()` override precedence.

> **⚠️ `not` binds tighter than comparison** (as in Lua): `not a == b` parses as `(not a) == b`, **not** `not (a == b)`. When `a` is not a boolean this fails loudly (`not` requires a boolean), and when both sides are booleans the two readings coincidentally agree — but when `a` is a boolean and `b` is not, the expression silently always yields `false`, because equality across types is legal and a boolean never equals a non-boolean:
>
> ```
> status = true
> if not status == "done" then    // (not status) == "done" → false, for ANY status
>     PRINT("never runs")
> end
> ```
>
> For inequality, write `a != b` (preferred) or `not (a == b)`.

## Strings

Strings are double-quoted. Supported escape sequences:

| Escape | Character |
|---|---|
| `\"` | double quote |
| `\\` | backslash |
| `\n` | newline |
| `\t` | tab |
| `\r` | carriage return |

Unrecognized escapes (e.g., `\d`) are preserved as-is (literal backslash + character).

```
msg = "She said \"hello\""
path = "C:\\Users\\file"
multiline = "line1\nline2"
```

Strings are **not** mutable. String operations return new strings.

### String Indexing

Strings support 1-based character access via the `.` operator:

```
s = "hello"
s.1     // "h"
s.5     // "o"
```

## Arrays

Arrays are ordered, 1-based, and can contain mixed types.

```
nums = [10, 20, 30]
mixed = [1, "two", true, [4, 5]]
empty = []
```

### Array Access (1-based)

```
nums.1      // 10 (first element)
nums.3      // 30 (third element)
```

Out-of-bounds access is a runtime error.

### Array Mutation

Direct element assignment mutates the array:

```
nums.1 = 99     // nums is now [99, 20, 30]
```

Built-in array functions (`PUSH`, `POP`, `CONCAT`, `SLICE`) return **new** arrays and do not mutate the original.

### Range Arrays

`[start..end]` creates an array from `start` to `end` (inclusive). An optional step controls the increment:

| Syntax | Result |
|---|---|
| `[1..5]` | `[1, 2, 3, 4, 5]` |
| `[1..6, 2]` | `[1, 3, 5]` |
| `[10..5, 1]` | `[10, 9, 8, 7, 6, 5]` |
| `[0.0..0.3, 0.1]` | `[0.0, 0.1, 0.2, 0.3]` |
| `[5..1]` | `[5, 4, 3, 2, 1]` (auto step -1) |

- Both bounds and step must be numbers
- Step must be positive (defaults to `1`). Direction is inferred from start vs end
- Step of `0` or negative is a runtime error
- Bounds and step can be expressions: `[1..n]`, `[a..b, c]`

## Objects

Objects are ordered key-value pairs with string keys.

```
person = {"name": "Alice", "age": 30}
config = {"special-key": true, 1: "one"}
empty = {}
```

Object keys must be quoted strings or integers (stored as string keys). Bare identifiers are not allowed as keys.

### Object Access

| Pattern | Syntax | Use Case |
|---|---|---|
| Static | `obj.name` | Known property name |
| Quoted key | `obj."special-key"` | Keys with special characters |
| Variable key | `obj.$varName` or `obj.$::varName` | Key name stored in a variable (`$::` for globals) |
| Computed key | `obj.$(expression)` | Key determined by an expression |
| Numeric key | `obj.1` | 1-based index for arrays and strings. For objects, the integer becomes string key `"1"` (both read and write). |

```
key = "name"
person.$key          // "Alice" (same as person.name)
person.$("na" + "me") // "Alice"
```

`$::var` accesses a global variable as a key (equivalent to `$(::var)`).

Accessing a property that doesn't exist is a runtime error.

### Object Mutation

Properties can be added or modified by assignment:

```
person.email = "alice@example.com"    // adds new property
person.age = 31                       // modifies existing
```

Integer keys become string keys on both read and write:

```
obj = {}
obj.1 = "first"      // obj is {"1": "first"}
obj.2 = "second"     // obj is {"1": "first", "2": "second"}
PRINT(obj.1)          // "first" (reads key "1")
PRINT(obj."1")        // "first" (same thing)
```

### Nested Access

Access patterns chain for nested structures:

```
data = {"users": [{"name": "Alice"}, {"name": "Bob"}]}
data.users.1.name    // "Alice"
data.users.2.name    // "Bob"
```

## Control Flow

### If / Elseif / Else

```
if condition then
    // statements
end

if condition then
    // statements
else
    // statements
end

if condition then
    // statements
elseif condition then
    // statements
elseif condition then
    // statements
else
    // statements
end
```

Conditions are checked top to bottom; the first `true` arm runs and everything after it — later conditions included — is skipped (an `elseif` condition is only evaluated, and only type-checked, when reached). The optional `else` arm runs when no condition matched. Each evaluated condition must be a boolean (see Truthiness). One `end` closes the whole chain — `elseif` was added in spec v0.9.0; previously multi-way branches had to nest `else if ... end` with stacked `end`s (that form still works).

### Loops

**Condition loop** — repeats while the condition is `true` (a non-boolean condition is a runtime error, as in `if`):

```
i = 0
loop i < 10 do
    i = i + 1
end
```

**Value loop** — iterates over a collection:

```
loop item in [10, 20, 30] do
    PRINT(item)
end
```

**Key-value loop** — iterates with keys/indices:

```
// Arrays: key is 1-based index
loop i, val in ["a", "b", "c"] do
    PRINT(i, val)    // 1 a, 2 b, 3 c
end

// Objects: key is property name
loop k, v in {"x": 1, "y": 2} do
    PRINT(k, v)      // x 1, y 2
end
```

### Infinite Loops

By default, loops are limited to 1000 iterations (configurable by the host). To allow unlimited iterations, add the `infinite` keyword:

```
loop condition infinite do
    // runs until condition is false or break
end

loop item in collection infinite do
    // runs through entire collection regardless of size
end
```

Exceeding the iteration limit without `infinite` is a runtime error.

### Break and Continue

```
loop i < 100 do
    if i == 5 then break end        // exit loop
    if i % 2 == 0 then continue end // skip to next iteration
    PRINT(i)
end
```

`break` and `continue` affect the innermost enclosing loop only.

### Debug Statement

`debug` — Explicit breakpoint for the debugger. In the playground's debug mode,
execution pauses at each `debug` statement. In normal execution, `debug` is a
no-op (does nothing). Can be placed anywhere a statement is valid.

## Functions

```
function add(a, b) do
    return a + b
end

result = add(3, 4)    // 7
```

### Return Values

- `return value` — returns the specified value
- `return` (bare) — returns `{}`
- No return statement — returns `{}`

### Arguments

- Missing arguments default to `{}` (empty object)
- Extra arguments beyond the declared parameters are a runtime error
- All arguments are **call-by-value** — the function receives a copy. Modifications to parameters inside the function do not affect the caller's variables.

```
function greet(name, title) do
    if title == {} then
        return "Hello, " + name
    end
    return "Hello, " + title + " " + name
end

greet("Alice", "Dr.")    // "Hello, Dr. Alice"
greet("Bob")             // "Hello, Bob" (title defaults to {})
```

### Recursion

Functions can call themselves recursively:

```
function factorial(n) do
    if n <= 1 then return 1 end
    return n * factorial(n - 1)
end
```

### Name Resolution

A function call `NAME(...)` resolves in this order (specified since spec v0.11.0):

1. If the host has blocked `NAME` (ignored functions), the call is invalid — its mere presence refuses the whole script at load (spec v0.14.0): `'NAME' is not available in this environment`. See [Host Environment Restrictions](#host-environment-restrictions).
2. A script-defined function named `NAME`.
3. Built-in functions and host-registered external functions.

A script-defined function therefore **shadows** any same-named built-in or external function — and a spec release adding new built-ins can never change what an existing script's calls resolve to. Within step 3, an external registered under a catalog built-in's name replaces that built-in. The **interpreter-dispatched names** — `PRINT`, `SLEEP`, `FAIL`, `UNWRAP` — cannot be replaced at all: registering an external under one of them is a **host-API error** at registration time (spec v0.13.0; previously `PRINT`/`SLEEP` were implementation-defined and a `FAIL`/`UNWRAP` registration was silently ignored).

Since spec v0.12.0 a script cannot define an all-uppercase function name at all (see [Reserved Function Names](#reserved-function-names)), so a script function can never collide with a built-in in the first place; the order above still governs the residual case of host-registered externals with non-reserved names.

### Reserved Function Names

The all-uppercase namespace belongs to the runtime and the host (spec v0.12.0). A script cannot define a function whose name is all-uppercase — an uppercase letter followed only by uppercase letters, digits, or underscores (`^[A-Z][A-Z0-9_]*$`). The definition itself is a runtime error at the definition site:

```
function LEN(x) do    // Runtime error: Cannot define function 'LEN':
    return 0          //   all-uppercase names are reserved for built-in
end                   //   and host functions
```

The rule applies to **every** all-uppercase name, not just names that currently exist as built-ins — so a future spec release can add new built-ins without ever colliding with script code. What this buys: an ALL-CAPS call is always a built-in or host-provided function, guaranteed — the naming convention is a fact, not a custom. Mixed-case and lowercase names (`Foo`, `getBalance`, `get_balance`) are unrestricted. Variable names are unaffected (`MAX = 10` is legal — variables and functions are separate namespaces).

## Variable Scope

### Global and Local

Variables assigned at the top level are **global**. Variables assigned inside a function are **local** to that function call. Inside functions, globals are only accessible via the `::` prefix.

```
x = "global"

function example() do
    x = "local"       // creates a LOCAL x
    PRINT(x)           // "local"
    PRINT(::x)         // "global" (reads global via ::)
end

example()
PRINT(x)               // "global" (unchanged)
```

### Lookup Order

**At top level:**

1. Global variables
2. Built-in properties

**Inside functions and multi setup (plain `x`):**

1. Local scopes (innermost first — nested function calls)
2. Multi-block result variables
3. Error if not found (with hint to use `::`)

**Inside functions and multi setup (`::x`):**

1. Global variables (or thread snapshot in multi context)
2. Built-in properties

### Scope in Loops

Loop variables (`item`, `key`, `val`) follow the same scoping rules — local if inside a function, global otherwise. They are always accessible without `::`.

## Multi Blocks (Cooperative Concurrency)

Any function can be run concurrently inside a `multi` block using the `thread` keyword. Results are collected into a single object.

**Concurrency, not parallelism.** ProperTee threads are cooperatively scheduled: only one thread executes at any moment, interleaving at statement boundaries in a deterministic round-robin order. A `multi` block therefore does not make CPU-bound work faster. Its benefit is overlapping *waits* — while one thread is blocked in `SLEEP`, `SHELL`, `HTTP*`, an async external function, or host I/O, the other threads keep running. What you get in exchange is reproducibility: the same script produces the same interleaving and the same output order on every run, with no data races and no locks.

```
function worker(name) do
    PRINT(name + " started")
    return name + " done"
end

multi result do
    thread resultA: worker("A")
    thread resultB: worker("B")
end

PRINT(result.resultA.value)   // "A done"
PRINT(result.resultB.value)   // "B done"
```

### Syntax

```
multi resultVar limit K do     // resultVar and the limit clause are optional
    thread key: funcCall()     // named result entry
    thread : funcCall()        // unnamed (auto-keyed by position)
monitor intervalMs             // optional monitor clause
    // monitor body
end
```

- `resultVar` — the variable that receives the result collection after all threads complete. Optional; omit for fire-and-forget (`multi do ... end`).
- `limit K` — optional concurrency cap (spec v0.19.0): at most `K` threads run concurrently; the rest wait in spawn order. See [Concurrency Limit](#concurrency-limit-limit).
- `do` — required keyword after the optional result variable and limit clause.

### thread

`thread` is used inside multi blocks to schedule function calls for concurrent execution:

- `thread key: funcCall()` — bare identifier key (string `"key"`)
- `thread "key": funcCall()` — string literal key (allows special characters)
- `thread 42: funcCall()` — integer literal key (string `"42"`)
- `thread $var: funcCall()` — variable key (auto-coerced to string via `TO_STRING()`)
- `thread $::var: funcCall()` — global variable key (same as `$var` but accesses globals directly)
- `thread $(expr): funcCall()` — expression key (auto-coerced to string via `TO_STRING()`)
- `thread : funcCall()` — unnamed, auto-keyed as `"#1"`, `"#2"`, etc.
- `thread "": funcCall()` — also treated as unnamed (empty string key = unnamed)

Thread spawn keys use the same `access` syntax as property access (`obj.key`, `obj."key"`, `obj.1`, `obj.$var`, `obj.$::var`, `obj.$(expr)`). All keys are strings internally.
- `thread` can only appear inside multi blocks — using it elsewhere is a runtime error
- Duplicate key names within the same multi block are a runtime error (including dynamic keys)

The multi block body runs as a **setup phase** before threads launch. Regular code (if/else, loops, PRINT) executes immediately during setup, while `thread` statements collect function calls to run concurrently.

**Setup scope isolation:** The setup phase runs in an isolated local scope, the same as inside a function. Variables created during setup do not leak into the surrounding scope. The `::` prefix is required to access global variables.

```
multi result do
    if ::needsWorkerA == true then   // :: required to read globals
        thread rA: workerA()
    end
    thread rB: workerB()
    PRINT("setup done")
    i = 1                            // local to setup, does not leak
end
// i is not defined here
```

All collected `thread` calls fire simultaneously when the setup phase ends (at `end` or `monitor`) — unless a `limit` clause caps how many run at once (see [Concurrency Limit](#concurrency-limit-limit)).

### Result Collection

The `resultVar` receives a **map/object** containing all thread results:

- **Named threads** (`key: func()`): the key in the collection is the name you provide
- **Unnamed threads**: the key is `"#"` followed by the 1-based position among unnamed threads (`"#1"`, `"#2"`, etc.) — named threads do not consume positional slots
- Each entry is a **Result object** with three fields:

| status | ok | value |
|---|---|---|
| `"running"` | `false` | `{}` |
| `"done"` | `true` | return value |
| `"error"` | `false` | error message string |

The collection is pre-built at spawn time with `"running"` entries. As threads complete, entries are updated in-place. After the multi block ends, all entries will be `"done"` or `"error"`.

**Result variable scoping:** `resultVar` is assigned to the current scope when the multi block completes — at top level it becomes a global variable, inside a function it becomes a local variable in that function's scope. This follows the same rules as regular variable assignment.

```
multi result do
    thread a: funcA()         // result.a
    thread : funcB()          // result."#1" (auto-key: 1st unnamed thread)
    thread c: funcC()         // result.c
end

result.a.status               // "done"
result.a.value                // named access
LEN(result)                   // 3
loop key, val in result do    // iterate all results
    PRINT(key, val.status, val.value)
end
```

### Dynamic Spawning

The setup phase supports loops, enabling dynamic thread spawning. Since setup runs in an isolated scope, loop variables stay local:

```
multi result do
    i = 1
    loop i <= 5 infinite do
        thread : worker(i)
        i = i + 1
    end
end

// Access by position (all unnamed, auto-keyed "#1" through "#5")
loop r in result do
    PRINT(r.value)
end
```

### Dynamic Thread Keys

Thread keys can be computed at runtime using `$var`, `$::var`, or `$(expr)` syntax (matching property access patterns):

```
names = ["alpha", "beta", "gamma"]
multi result do
    loop name in ::names do
        thread $name: worker(name)           // key from variable
    end
    thread $("delta"): worker("x")           // key from expression
end
PRINT(result.alpha.value)
PRINT(result.delta.value)
```

**Validation rules** for dynamic keys:
- Values are **auto-coerced to string** via `TO_STRING()` — numbers, booleans, objects, arrays all become their string representation
- **Empty string** is treated as unnamed (auto-keyed `"#1"`, `"#2"`, etc.)
- Must be **unique** within the multi block — duplicate keys (including duplicates between static and dynamic keys) are a runtime error

### Concurrency Limit (`limit`)

An optional `limit K` clause between the result variable and `do` caps how many threads run
concurrently (spec v0.19.0). Threads beyond the cap wait, and each finishing thread **admits the
next waiting one, in spawn order** — deterministically, like everything else in the model.

Because ProperTee threads only overlap on *waits* (see above), the cap is really a bound on
concurrent blocking operations: `limit 3` over a list of `SHELL` jobs means at most 3 processes
exist at once. This makes the natural one-thread-per-job shape safe for arbitrarily long job
lists — the runtime balances the load (a freed slot immediately takes the next job), which a
script cannot do itself under thread purity:

```
multi result limit 3 do
    loop job in ::jobs do
        thread $(job.name): runJob(job)    // N jobs, at most 3 in flight
    end
end
```

Rules:

- The limit expression is evaluated **once, at `multi` entry** — in textual order: before the
  global snapshot is taken and before the setup phase runs.
- It must evaluate to a **positive integer**. Zero, negative, decimal, or non-number values are
  a runtime error (`multi limit must be a positive integer`) — there is no "0 = unlimited".
  Nominal number identity applies (spec v0.14.0): `limit 2.0` is an error even though the value
  is whole.
- `limit K` where `K >=` the number of spawned threads behaves exactly like no limit.
  `limit 1` runs the threads sequentially, in spawn order.
- The setup phase is unchanged: every `thread` statement still evaluates (and deep-copies) its
  arguments at the spawn statement and pre-registers its `"running"` result entry. Only the
  *start* of the thread's body is deferred. A waiting thread is externally indistinguishable
  from a running one — its Result entry reads `"running"`; there is no new status.
- The [monitor watchdog](#monitor-clause) does **not** consume a slot: it is spawned and ticks
  regardless of the cap.
- A thread that ends in an error frees its slot like any other completion; `[THREAD ERROR]`
  reporting and admission both continue.
- `limit` is a reserved word (like `elseif` since v0.9.0): scripts using it as an identifier
  must rename.

### Thread Purity

Functions running inside multi blocks enforce a purity model:

- **Can read** global variables via `::` (reads from a snapshot taken when the `multi` block starts)
- **Cannot write** global variables — `::x = value` is a runtime error
- **Can call** any other function (user-defined or built-in)
- **Can create** and modify local variables freely (plain `x` without `::`)

This guarantees no data races — threads never see each other's modifications.

### Semantics

1. The multi block body executes as a setup phase in an isolated scope (like a function), collecting `thread` calls
2. A snapshot of global variables is taken at `multi` entry, **before the setup phase runs** — all threads (and the monitor watchdog) see this snapshot. A `::` write in the setup phase updates the real globals (visible after the block) but is **not** visible to the threads
3. All spawned functions launch concurrently after setup completes — under a `limit K` clause, at most `K` at a time, each finishing thread admitting the next in spawn order (spec v0.19.0)
4. The result collection is pre-built with `"running"` entries at spawn time
5. Threads execute cooperatively, interleaving at statement boundaries
6. As each thread completes, its result entry is updated in-place to `"done"` or `"error"`
7. The monitor watchdog observes the result collection through a captured snapshot taken at the start of each of its iterations (spec v0.16.0)
8. All threads must complete before execution continues past `end`
9. The result collection is assigned to `resultVar` after **all** threads finish

### Monitor Clause

An optional `monitor` clause attaches a **watchdog thread** to the multi block — a thread the runtime spawns and manages automatically alongside the workers (spec v0.16.0):

```
multi result do
    thread resultA: worker("A")
    thread resultB: worker("B")
monitor 100
    PRINT("[heartbeat]")
end
```

- The number after `monitor` is the watchdog's **sleep interval** in milliseconds: the watchdog repeatedly sleeps for the interval, then runs its body once. The body's own execution (and any suspension inside it) adds to the cycle — this is a sleep *between* iterations, not a fixed-rate timer.
- Once every worker has finished, the watchdog runs the body **one final time** and ends; the multi block completes after that final iteration. The final run is guaranteed — the watchdog always observes the finished collection at least once, even if an earlier iteration failed. (*When* the final run starts — immediately on the last worker's completion, or at the watchdog's next wake-up — is implementation timing; the spec promises only that it runs.)
- The watchdog follows the **same purity rules as worker threads**: globals are a read-only snapshot (`::` reads work; a `::` write is the same runtime error as in a worker), and plain names are locals. It cannot see setup-phase locals.
- Each iteration runs like a function invocation, in a **fresh local scope** — locals do not carry over between iterations. Local assignment, loops, and function calls are all allowed in the body.
- The iteration's scope starts with one binding: the result collection variable, holding a **captured snapshot** (deep copy) of the collection taken as the iteration starts.
- If an iteration fails, the error is reported (`[MONITOR ERROR] ...`), remaining mid-run iterations are skipped, and the final iteration still runs.
- The watchdog is exempt from the block's `limit` clause (spec v0.19.0): it does not consume a concurrency slot, and it observes waiting-for-admission threads as ordinary `"running"` entries.

```
multi result do
    thread r: slowWorker()
monitor 100
    PRINT("status:", result.r.status)   // "running" or "done"
end
```

**How the watchdog sees `result`:** In the code above, the monitor body references `result` even though `result` is only assigned after all threads finish (at `end`). Each watchdog iteration starts by **capturing** the in-progress result collection — a deep-copied snapshot bound under the `resultVar` name in the iteration's scope. The capture is consistent for the whole iteration, even if the body suspends (e.g. `SLEEP`, a blocking call) while workers keep completing; the next iteration takes a fresh capture, which is how the watchdog sees `"running"` entries become `"done"` across iterations. The guaranteed final iteration captures the finished collection. (Before spec v0.16.0 the monitor read a live view instead and could not assign at all — see the changelog.)

### Sequential Multi Blocks

Multiple `multi` blocks can chain results:

```
multi r1 do
    thread a: compute(10)
end

multi r2 do
    thread b: compute(r1.a.value)
end
```

### SLEEP

`SLEEP(milliseconds)` pauses the current thread without blocking others:

```
function slow_worker() do
    SLEEP(500)
    return "done"
end
```

Only meaningful inside functions running within a `multi` block.

### Blocking and Suspension

Built-in functions are **runtime primitives** — provided by the runtime or the host, not written in ProperTee. Some of them **suspend**: a call that has to wait — `SLEEP`, `SHELL`/`SHELL_CTX`, `HTTP`/`HTTP_GET`/`HTTP_POST`, the file-I/O built-ins, and asynchronous host-registered external functions — pauses only the calling thread and yields to sibling threads until the wait is over. There is no `await`-style marker: suspension is a property of the call, not of the syntax, and any function may transitively suspend by calling one of these.

`SLEEP` is simply the smallest suspension primitive (a pure timer). Scripts cannot suspend by any other means — waiting abstractions are *composed on top of* `SLEEP`:

```
// a polling wait, built from SLEEP
function wait_until(flag_file) do
    loop not FILE_EXISTS(flag_file) infinite do
        SLEEP(100)
    end
end
```

Hosts can create their own suspension primitives: an asynchronous external function gets the same contract as the suspending built-ins — the calling thread is suspended, siblings keep running, and the outcome is delivered as a Result object.

## Built-in Functions

All built-in function names are UPPERCASE, and the all-uppercase namespace is reserved for built-in and host functions — scripts cannot define such names (see [Reserved Function Names](#reserved-function-names)).

### Output

| Function | Description |
|---|---|
| `PRINT(args...)` | Print values separated by spaces. Returns `{}`. |

### Math

| Function | Description |
|---|---|
| `SUM(args...)` | Sum of all numeric arguments |
| `MAX(args...)` | Maximum of all numeric arguments |
| `MIN(args...)` | Minimum of all numeric arguments |
| `ABS(n)` | Absolute value |
| `FLOOR(n)` | Round down |
| `CEIL(n)` | Round up |
| `ROUND(n)` | Round to nearest integer |
| `RANDOM()` | Random decimal between 0.0 (inclusive) and 1.0 (exclusive) |
| `RANDOM(min, max)` | Random integer from `min` to `max` (both inclusive). |

The single-argument form `RANDOM(max)` was **removed in v0.7.0** — its exclusive upper bound clashed with the inclusive two-argument form. Calling `RANDOM` with one argument is a runtime error; write `RANDOM(0, max - 1)` for the old meaning.

### Type Conversion

| Function | Description |
|---|---|
| `TO_NUMBER(s)` | Convert string to number. Error if not valid numeric string. |
| `TO_STRING(v)` | Convert any value to its string representation |

### Type

| Function | Description |
|---|---|
| `TYPE_OF(v)` | Returns type name: `"number"`, `"string"`, `"boolean"`, `"array"`, `"object"`, `"null"` |

### String Functions

| Function | Description |
|---|---|
| `LEN(s)` | Length of a string, array, or object (number of entries). Any other type is a runtime error. |
| `UPPERCASE(s)` | Convert to uppercase |
| `LOWERCASE(s)` | Convert to lowercase |
| `TRIM(s)` | Remove leading/trailing whitespace |
| `SUBSTRING(s, start, [length])` | Extract substring. `start` is 1-based. |
| `SPLIT(s, delimiter)` | Split string into array. Preserves trailing empty strings. |
| `JOIN(arr, [separator])` | Join array elements into string. Default separator is `""`. |
| `CHARS(s)` | Split string into array of single characters |
| `CONTAINS(s, sub)` | Returns `true` if string `s` contains substring `sub`. Also accepts an array as the first argument — see [Array Functions](#array-functions). |
| `STARTS_WITH(s, prefix)` | Returns `true` if `s` starts with `prefix` |
| `ENDS_WITH(s, suffix)` | Returns `true` if `s` ends with `suffix` |
| `FIND(s, sub)` | Array of **all** 1-based positions where `sub` occurs in `s`, ascending, overlapping occurrences included — `FIND("aaa", "aa")` → `[1, 2]`; no occurrence → `[]`. Literal string match, not regex (spec v0.17.0). An empty `sub` is a runtime error. |
| `FIND_FIRST(s, sub)` | 1-based position of the first occurrence of `sub` in `s`, or `0` if absent (spec v0.17.0). Always equals the first element of `FIND(s, sub)`. Empty `sub` is a runtime error. |
| `FIND_LAST(s, sub)` | 1-based position of the last occurrence of `sub` in `s`, or `0` if absent (spec v0.17.0). Always equals the last element of `FIND(s, sub)`. Empty `sub` is a runtime error. |
| `MATCHES(s, pattern)` | Returns `true` if regex `pattern` matches anywhere in `s` |
| `REGEX_FIND(s, pattern)` | Returns array of [fullMatch, group1, group2, ...] or `{}` if no match. 1-based array. |
| `REPLACE(s, target, replacement)` | Replace all occurrences of `target` with `replacement`. Literal string match (not regex). |

### Array Functions

| Function | Description |
|---|---|
| `PUSH(arr, values...)` | Returns new array with values appended. Original unchanged. |
| `POP(arr)` | Returns new array with last element removed. Original unchanged. |
| `CONCAT(arrs...)` | Returns new array concatenating all input arrays |
| `SLICE(arr, start, [count])` | Returns a sub-array of up to `count` elements starting at `start` (1-based); omit `count` for the rest of the array. Same start+count convention as `SUBSTRING` and `READ_LINES`. |
| `SORT(arr)` | Returns new array sorted ascending. All elements must be the same type (number or string). |
| `SORT_DESC(arr)` | Returns new array sorted descending. Same type restriction as `SORT`. |
| `SORT_BY(arr, key)` | Returns new array of objects sorted ascending by the given key. |
| `SORT_BY_DESC(arr, key)` | Returns new array of objects sorted descending by the given key. |
| `REVERSE(arr)` | Returns new array with elements in reverse order. No type restriction. |
| `CONTAINS(arr, item)` | Returns `true` if `item` is an element of `arr` (spec v0.15.0). Elements are compared with `==` — so it is by value and deep for objects/arrays (`CONTAINS([{"a":1}], {"a":1})` → `true`), and strict across types (`CONTAINS([1,2], "2")` → `false`). Same built-in as the string-substring `CONTAINS` above, dispatched on the first argument's type. |

### Object Functions

| Function | Description |
|---|---|
| `HAS_KEY(obj, key)` | Returns `true` if `obj` contains `key`, `false` otherwise. Both arguments required: `obj` must be an object, `key` must be a string. |
| `KEYS(obj)` | Returns an array of the object's keys in insertion order. `obj` must be an object. |
| `VALUES(obj)` | Returns an array of the object's values in insertion order. |
| `ENTRIES(obj)` | Returns array of `{"key": k, "value": v}` objects in insertion order. |
| `MERGE(obj1, obj2)` | Returns new object with all entries from both. `obj2` values override `obj1` on key conflict. |
| `REMOVE_KEY(obj, key)` | Returns new object without the specified key. No error if key absent. |

### Results and Error Escalation

Added in spec v0.10.0. See [Genuine Results, `FAIL`, and `UNWRAP`](#genuine-results-fail-and-unwrap) for the semantics.

| Function | Description |
|---|---|
| `FAIL(message)` | Raise a runtime error at the call site with `message` (non-string coerced via `TO_STRING`). The script terminates exactly as with any runtime error — `Runtime Error at line L:C: <message>`; inside a `multi` thread, only that thread fails (collected as `{status: "error"}`). Never returns. |
| `UNWRAP(res[, message])` | If `res` is a genuine Result with `ok` true, evaluates to `res.value`. If `ok` is false (including `"running"`), raises a runtime error with `TO_STRING(res.value)` — prefixed `message + ": "` when the second argument is given. A value that is not a genuine Result is a runtime error (`UNWRAP() requires a Result`). |
| `OK([value])` | Construct a genuine Result `{status: "done", ok: true, value: value}`. Missing argument → `value` is `{}`. |
| `ERR([value])` | Construct a genuine Result `{status: "error", ok: false, value: value}`. Missing argument → `value` is `{}`. `value` may be any type (structured errors, as with HTTP error Results). |
| `IS_RESULT(x)` | `true` if `x` is a genuine Result (runtime-created or `OK`/`ERR`-constructed), else `false`. Accepts any value; never errors. |

### Environment

| Function | Description |
|---|---|
| `ENV(name)` | Read environment variable. Returns `{}` if not set. |
| `ENV(name, default)` | Read environment variable with fallback. Returns `default` if not set. |

### JSON

| Function | Description |
|---|---|
| `JSON_PARSE(s)` | Parse JSON string. Returns Result: `ok` with parsed value, `error` on invalid JSON. JSON `null` is preserved as `null` (was normalized to `{}` until spec v0.7.0). |
| `JSON_FORMAT(v)` | Convert any value to JSON string. `null` serializes as `null`, so `JSON_PARSE`/`JSON_FORMAT` round-trip losslessly. |

### File I/O

| Function | Description |
|---|---|
| `FILE_EXISTS(path)` | Returns `true` if file or directory exists. |
| `FILE_INFO(path)` | Returns Result: `ok` with `{type, size, modified}`, `error` if not found. |
| `READ_LINES(path, [start], [count])` | Read lines from file. `start` is 1-based (default 1). `count` limits lines read. Returns Result with string array. |
| `READ_FILE(path)` | Read the whole file as one string (spec v0.18.0). Returns Result: `ok` with the file content (UTF-8, content-exact), `error` on a read failure. The counterpart of `WRITE_FILE`; for large files prefer `READ_LINES` windows. |
| `READ_JSON_FILE(path)` | Read a JSON file and parse it in one call (spec v0.18.0). Returns Result: `ok` with the parsed value (object, array, or scalar — same conversion as `JSON_PARSE`), `error` on a read failure or invalid JSON. A leading UTF-8 BOM is ignored. Replaces the `READ_LINES` + `JOIN` + `JSON_PARSE` idiom. |
| `WRITE_FILE(path, content)` | Write string to file (overwrite). Returns Result. |
| `WRITE_LINES(path, lines)` | Write array of strings as lines (each followed by newline). Returns Result. |
| `WRITE_JSON_FILE(path, value)` | Serialize `value` as JSON — the same output as `JSON_FORMAT` — and write it to the file with a trailing newline, overwriting (spec v0.18.0). Returns Result: `ok` with `{}`. The counterpart of `READ_JSON_FILE`: the round-trip is lossless, first-class `null` included. |
| `APPEND_FILE(path, content)` | Append string to file. Returns Result. |
| `MKDIR(path)` | Create directory (including parents). Returns Result. |
| `LIST_DIR(path)` | List directory entries. Returns Result with array of `{name, type, size}` objects, sorted by name. |
| `DELETE_FILE(path)` | Delete a single file. Directories are rejected. Returns Result. |

```
// Write and read lines
WRITE_LINES("/data/output.csv", ["name,age", "Alice,30", "Bob,25"])
res = READ_LINES("/data/output.csv", 2, 1)    // skip header, read 1 line
PRINT(res.value.1)                              // "Alice,30"

// Large file iteration
offset = 1
loop true infinite do
    res = READ_LINES("/data/big.log", offset, 500)
    if res.ok == false then break end
    lines = res.value
    if LEN(lines) == 0 then break end
    loop line in lines do
        if CONTAINS(line, "ERROR") == true then
            PRINT(line)
        end
    end
    offset = offset + LEN(lines)
end

// Directory operations
MKDIR("/data/reports/2024")
res = LIST_DIR("/data/reports")
loop entry in res.value do
    PRINT(entry.name, entry.type)
end
```

### Timing

| Function | Description |
|---|---|
| `SLEEP(ms)` | Pause current thread for `ms` milliseconds |
| `MILTIME()` | Current time as epoch milliseconds (number) |
| `DATE()` | Current date as `"YYYY-MM-DD"` string |
| `TIME()` | Current time of day as `"HH:MM:SS"` string |

### Shell

| Function | Description |
|---|---|
| `SHELL(cmd)` | Execute a shell command. Returns Result: `ok` with stdout on exit 0, `error` with output on non-zero exit. |
| `SHELL(ctx, cmd)` | Execute a shell command using a context from `SHELL_CTX()`. Pass the Result directly — `SHELL` auto-unwraps it. |
| `SHELL_CTX(cwd)` | Create a shell context with working directory `cwd`. Returns Result: `ok` with context object, `error` if directory doesn't exist. |
| `SHELL_CTX(cwd, env)` | Create a shell context with working directory and environment variables. `env` is an object of key-value pairs. |

Each `SHELL()` call creates a fresh process via `/bin/sh -c <cmd>`. There are no persistent sessions. The context from `SHELL_CTX()` is just a configuration object — it doesn't hold any process state. When passing a context to `SHELL()`, pass the Result from `SHELL_CTX()` directly — `SHELL` auto-unwraps the Result to extract the context.

### HTTP

| Function | Description |
|---|---|
| `HTTP_GET(url, [options])` | HTTP GET. Returns Result (see below). |
| `HTTP_POST(url, body, [options])` | HTTP POST with a string `body`. Returns Result. |
| `HTTP(method, url, [options])` | General request for any method (PUT/DELETE/PATCH/...). `options.body` carries the request body. |

`options` is an object: `{"headers": {"Key": "Value", ...}, "timeout": <ms>, "body": <for HTTP()>}` — all optional. (`"header"` is also accepted for `"headers"`.)

**Request body.** A string body is sent as-is; any other value (object/array/number/boolean) is serialized as JSON. So `HTTP_POST(url, {"a": 1})` sends `{"a":1}` (not the bare `a=1` form). Set `"Content-Type": "application/json"` in `headers` if the server requires it.

**Result shape.** A request that completes returns `{status, body, headers}` as `value`, with `ok` true only for a 2xx status (4xx/5xx keep the full `value` with `ok` false). A transport-level failure (bad URL, DNS, connection refused, timeout) returns `ok` false with `value = {"status": 0, "body": "<error message>", "headers": {}}`. So `res.value` is always that object — check `res.ok` and `res.value.status`.

```
res = HTTP_GET("http://service/health")
if res.ok == true then
    PRINT(res.value.body)
end
PRINT("status", res.value.status)
```

HTTP is a host-provided capability (a `PlatformProvider`), like file I/O — environments without one return the unsupported error.

```
// One-off command
result = SHELL("echo hello")
PRINT(result.value)              // "hello"

// With context (working directory + env)
ctx = SHELL_CTX("/data/project", {"ENV": "prod"})
result = SHELL(ctx, "./build.sh")

// Error handling
result = SHELL("exit 1")
if result.ok == false then
    PRINT("Command failed")
end
```

`SHELL()` is async — in multi blocks, other threads continue while a shell command runs. Outside multi blocks, the script simply waits.

> **Runtime availability:** Shell functions require a host-provided `TaskRunner`. File I/O and ENV require a `PlatformProvider`. In the JavaScript runtime (browser/Node.js), these functions are stubs that return `{ok: false, value: "... is not available in this environment"}`.

## Built-in Properties

The host application can inject read-only properties accessible as global variables:

```bash
# Command line
java -jar propertee.jar -p '{"width": 100, "height": 200}' script.tee
```

```
// In script
area = width * height    // 20000
```

Properties are read-only and sit at the bottom of the variable lookup chain — any local or global variable with the same name takes precedence.

### `_PROPS` — all inputs as one object

Every injected property is also available as a member of the reserved object **`_PROPS`**, so a script can print, iterate, or pass along the whole input set at once while still reading each key directly:

```
PRINT(a)                                 // individual key (as before)
PRINT(_PROPS.a)                          // same value via the object
PRINT(JSON_FORMAT(_PROPS))               // {"a":40,"b":2}  — dump all inputs (debugging)
loop k in KEYS(_PROPS) do PRINT(k) end   // iterate input names
return { "echo": _PROPS }                // forward all inputs to a caller/system
```

`_PROPS` is a snapshot of the inputs (it does not contain itself, so `JSON_FORMAT(_PROPS)` is safe). Inside a function or `multi` setup it follows the same rule as other properties — use `::_PROPS`. If an input is literally named `_PROPS`, that caller-supplied value is used as-is.

### `_ARGS` — positional invocation arguments

The reserved array **`_ARGS`** (spec v0.20.0) carries the positional arguments of the invocation
— on the CLI, everything after the script path (option parsing stops there):

```
$ propertee2 deploy.tee prod eu-west 42
```

```
PRINT(LEN(_ARGS))                 // 3
PRINT(_ARGS.1)                    // "prod"      — 1-based, like all arrays
target = _ARGS.2                  // "eu-west"
n = TO_NUMBER(_ARGS.3)            // arguments are STRINGS; number entry is explicit
loop a in _ARGS do PRINT(a) end   // iterate them all
```

- `_ARGS` is **always present**: with no arguments it is the empty array `[]` (never absent —
  `LEN(_ARGS)` is always safe). All elements are strings, in invocation order.
- It is an ordinary global otherwise: `::_ARGS` inside functions and `multi` setup; workers and
  the monitor watchdog read it from the multi-entry snapshot like any global.
- Arguments are **positional and separate from properties**: they do not appear in `_PROPS`, so
  the iterate/dump patterns above stay pure. Named configuration belongs in `-p` properties;
  `_ARGS` is for what a caller would put on the command line.
- If an input property is literally named `_ARGS`, that caller-supplied value is used as-is —
  the same precedence rule as `_PROPS`.
- How arguments are supplied is host-defined: the reference CLI takes them after the script
  path (`-i` included, shared with the REPL session); its DAP server takes the launch
  configuration's `args`; embedding hosts call `Engine.setArgs`.

## External Functions and the Result Pattern

Host applications can register custom functions. These use the **Result pattern** for error handling instead of throwing runtime errors:

```
// Calling an external function
res = GET_BALANCE("alice")

if res.ok == true then
    PRINT("Balance:", res.value)
else
    PRINT("Error:", res.value)
end
```

Result objects have three fields:
- `ok` — `true` for success, `false` for failure or in-progress
- `value` — the result value on success, error message string on failure, or `{}` while in-progress
- `status` — `"done"`, `"error"`, or `"running"` (in-progress threads in multi blocks)

For external function results, `ok` is sufficient — check `res.ok == true`. The `status` field exists primarily for multi block thread results, where it distinguishes between `"running"` (not yet finished) and `"error"` (finished with failure) — both have `ok: false`.

### Genuine Results, `FAIL`, and `UNWRAP`

Added in spec v0.10.0.

**Genuine Results.** Result objects created by the runtime — Result-returning built-ins (`JSON_PARSE`, `SHELL`/`SHELL_CTX`, `HTTP`/`HTTP_GET`/`HTTP_POST`, the file-I/O group — all but `FILE_EXISTS`, which returns a plain boolean), external function calls (sync and async, including timeout errors), and `multi` thread collection entries — and by the `OK`/`ERR` constructors are *genuine Results*: the runtime remembers their origin. A script object literal with the same three fields is a plain object, **not** a genuine Result.

The distinction is invisible to `TYPE_OF` (still `"object"`), display, equality, and JSON serialization; it is observed only by `IS_RESULT` and `UNWRAP`. Copies of a genuine Result (assignment, argument passing, `PUSH`, deep copy) are genuine Results; field mutation does not remove the origin. The origin does not survive JSON: `JSON_FORMAT` renders a genuine Result as the plain three-field object, and nothing inside `JSON_PARSE`d data is a genuine Result (the wrapping Result returned by `JSON_PARSE` itself is genuine).

**Escalation.** The Result pattern makes recoverable errors explicit values; `FAIL` is the explicit escalation for the errors a script decides are fatal — it raises an ordinary runtime error at the call site, so the run fails exactly as with any other runtime error:

```
res = HTTP_GET(url)
if not res.ok then
    FAIL("upstream failed: " + res.value.body)
end
```

`UNWRAP` compresses the check-then-escalate chain to one call per step — it is not a separate error mechanism; it desugars to `FAIL`:

```
// UNWRAP(res) ≡  if not res.ok then FAIL(TO_STRING(res.value)) end  ... then res.value
user = UNWRAP(fetch(1))
data = UNWRAP(JSON_PARSE(text), "config parse")   // error message: "config parse: <parse error>"
```

Inside a `multi` thread, `FAIL` (and an escalating `UNWRAP`) fails only that thread — the failure is collected as `{status: "error", ok: false, value: <message>}` and the run continues, like any worker runtime error.

Scripts that need to hand a **structured** error to the host (not just a message) should return a Result as data instead of escalating — `FAIL`/`UNWRAP` flatten the failure to a message string.

### Async External Functions

Host applications can register **async external functions** for blocking I/O (database queries, HTTP requests, file reads) that don't freeze other ProperTee threads. Use `registerExternalAsync()` instead of `registerExternal()`:

```java
// Java host — async function with 5-second timeout
interpreter.builtins.registerExternalAsync("DB_QUERY", new BuiltinFunction() {
    public Object call(List<Object> args) {
        String sql = (String) args.get(0);
        // This runs on a background thread — blocking is OK
        return Result.ok(database.execute(sql));
    }
}, 5000);
```

```javascript
// JavaScript host — async function (no timeout)
visitor.registerExternalAsync("HTTP_GET", (url) => {
    const response = await fetch(url);
    return Result.ok(response.json());
});
```

From the script side, async functions look identical to sync external functions:

```
// Script doesn't know (or care) whether GET_BALANCE is sync or async
res = GET_BALANCE("alice")
if res.ok == true then
    PRINT("Balance:", res.value)
end
```

**Behavior:**
- The calling thread **blocks** until the async operation completes (or times out)
- Other threads in a `multi` block **continue executing** — only the calling thread is paused
- Outside a `multi` block, the script simply waits (no other threads to run)
- Results use the same Result pattern: `{ok: true, value: ...}` on success, `{ok: false, value: "error message"}` on failure
- Thrown exceptions inside async functions are automatically wrapped as `Result.error(message)`

**Timeout:** The optional timeout parameter (milliseconds) limits how long the thread will wait. If the operation exceeds the timeout, the function returns `{status: "error", ok: false, value: "timeout"}`:

```
// Host registers with 100ms timeout
// registerExternalAsync("FAST_LOOKUP", func, 100)

res = FAST_LOOKUP("key")
if res.ok == true then
    PRINT(res.value)
else
    PRINT("Timed out or error:", res.value)   // "timeout"
end
```

**Restrictions:**
- Async functions cannot be called inside `monitor` blocks (runtime error)
- Multiple async calls in the same statement are not supported — use separate statements
- The async function receives deep-copied arguments (thread-safe)

### Host Environment Restrictions

Host applications can restrict which language keywords and built-in functions are available:

```
// Java host
Set<String> hidden = new HashSet<String>();
hidden.add("multi");
hidden.add("loop");
interpreter.setHiddenKeywords(hidden);

Set<String> ignored = new HashSet<String>();
ignored.add("SHELL");
interpreter.setIgnoredFunctions(ignored);

// JavaScript host
visitor.setHiddenKeywords(["multi", "loop"]);
visitor.setIgnoredFunctions(["SHELL"]);
```

**Hidden keywords** make a script that uses the statement refuse to run:

```
// With "if" hidden:
x = 10
if x == 10 then    // 'if' is not available in this environment — the whole script is refused
    PRINT(x)
end
```

Keywords that can be hidden: `if`, `loop`, `function`, `multi`, `thread`, `debug`. Hiding `if` covers the whole `if`/`elseif`/`else` statement.

**Ignored functions** make a script that calls the function refuse to run:

```
// With "SHELL" ignored:
x = SHELL("echo hello")   // 'SHELL' is not available in this environment — the whole script is refused
```

Both built-in and external functions can be ignored. The check applies to normal function calls and to function calls inside multi block `thread` spawns.

**Load-time rejection (spec v0.14.0).** A script that names *any* blocked construct — a hidden keyword or an ignored-function call, **anywhere in the source, dead branches included** — does not run at all. The run is refused **before the first statement executes**, failing on the **first violation in document order** with `Runtime Error at line L:C: 'X' is not available in this environment`. Nothing before the offending construct runs — no output, no side effects — so in the examples above `x = 10` never executes. Because the check scans the whole tree, a blocked construct in an untaken branch (`if false then SHELL(...) end`) still refuses the script, and a blocked function reached only through a `thread` spawn (`thread a: blocked_fn()`) is rejected at load rather than inside the worker (this supersedes the spec v0.13.0 worker-containment behavior — the worker is never reached). The language has no indirect calls (call sites are literal names) and its keywords are static, so this scan is exact.

The same scan is also exposed as a **host API** that returns *all* violations at once — `Engine.validate(source)` in the reference runtime, `interpreter.validate(tree)` in propertee-java, `visitor.validate(tree)` in propertee-js — each yielding one `line L:C: 'X' is not available in this environment` entry per hidden-keyword construct and ignored-function call, for hosts that want to inspect a script (e.g. report every problem in an editor) without running it.

## Comments

```
// Single-line comment

/* Multi-line
   comment */
```

## Semicolons

Semicolons are optional and treated as whitespace. These are equivalent:

```
x = 1; y = 2; z = 3
```

```
x = 1
y = 2
z = 3
```

## Output Formatting

When values are printed or displayed:

| Type | Format | Example |
|---|---|---|
| integer | no decimal | `42` |
| decimal (whole) | no decimal | `5` (not `5.0`) |
| decimal (fractional) | with decimal | `3.14` |
| string | no quotes | `hello` |
| boolean | lowercase | `true` |
| empty object | braces | `{}` |
| array | bracketed | `[ 1, 2, 'hello' ]` |
| object | braced | `{ "name": 'Alice', "age": 30 }` |

Strings inside arrays and objects are displayed with single quotes. Top-level strings printed via `PRINT` have no quotes.

### Number display (spec v0.14.0)

Numbers render by **ECMA-262 `Number::toString`**, uniformly across `PRINT`, `TO_STRING`,
`JSON_FORMAT`, and rendering inside arrays/objects. In practice:

- The **shortest decimal digits** that round-trip back to the same value — `10 / 3` →
  `3.3333333333333335`, `0.1 + 0.2` → `0.30000000000000004`. A whole value shows no fraction
  (`5`, not `5.0`), which is why the rows above hold.
- **Plain** (non-exponential) form for magnitudes in the range `[1e-6, 1e21)`: `0.0001`,
  `15000000.5`, `6000000000`, `123456789012345680000`. This keeps the everyday bands — timestamps,
  small rates, ids — readable, and the output is valid JSON.
- **Exponential** form outside that range, written `e+`/`e-` with no superfluous mantissa point:
  `1e+21`, `1e-7`, `1e+300`.

> Significant digits are the *shortest round-tripping* decimal for the value. A few values at the
> very edge of the subnormal range (near `5e-324`) are where a host platform's own shortest-digit
> routine may differ by one digit; those are implementation-defined and outside the conformance
> suite. No value an ordinary program produces is affected.

## Runtime Errors

ProperTee reports errors with line and column information:

```
Runtime Error at line 5:3: Variable 'x' is not defined
```

Common error conditions:

| Condition | Error |
|---|---|
| Undefined variable | Variable 'x' is not defined |
| Undefined function | Unknown function 'foo' |
| Type mismatch in arithmetic | Arithmetic operator '+' requires numeric operands |
| Non-coercible `+` operands | Addition requires numeric or string operands |
| Non-boolean in `and`/`or` | Logical AND requires boolean operands |
| Non-boolean `if`/`loop` condition | Condition requires a boolean value |
| `LEN` on a non-collection | LEN() requires a string, array, or object argument |
| Single-argument `RANDOM` | RANDOM() requires zero or two arguments |
| Division by zero | Division by zero |
| Missing property | Property 'x' does not exist |
| Array out of bounds | Array index out of bounds |
| Loop limit exceeded | Loop exceeded maximum iterations (1000) |
| Global write in multi block (worker or monitor watchdog) | Cannot assign to global variable '::x' inside multi block |
| Global without `::` in local scope | Variable 'x' is not defined in local scope. Use ::x to access the global variable |
| thread outside multi | thread can only be used inside multi blocks |
| Duplicate result key | Duplicate result key 'x' in multi block |
| Too many arguments | Function 'foo' expects 2 argument(s), but 3 were provided |
| Mixed type sort | SORT() requires all elements to be the same type (number or string) |
| SORT_BY key missing | Property 'x' does not exist in array element at index N |
| Non-array sort | SORT() requires an array argument |
| Range step not positive | Range step must be positive |
| Range bounds not numbers | Range bounds must be numbers |
| Range step not a number | Range step must be a number |
| Deliberate failure | `FAIL(msg)` raises `msg` itself (script-chosen text) |
| `UNWRAP` on a non-Result | UNWRAP() requires a Result |
| `FAIL` without a message | FAIL() requires a message argument |
| All-uppercase function definition | Cannot define function 'X': all-uppercase names are reserved for built-in and host functions |
| Integer literal too large | Integer literal out of range: 9999999999 |
| Integer arithmetic overflow (`+` `-` `*`, unary `-`, `FLOOR`/`CEIL`/`ROUND`/`ABS`, `SUM`) | Integer overflow |
| Blocked construct present (hidden keyword / ignored function, anywhere) | 'X' is not available in this environment |

### Resource Limits

The loop-iteration cap is part of the language (default 1000, host-configurable, `infinite` opts
out — see [Infinite Loops](#infinite-loops)). Other resource limits — recursion depth, memory —
are **host/runtime discretion**: exhausting them fails the run, but the exact error surface is
implementation-defined. Scripts should not rely on any particular recursion depth.

---

## Changelog

### v0.20.0 — `_ARGS`: positional invocation arguments

Additive, non-breaking (no new grammar; `_ARGS` joins `_PROPS` as a reserved global). The
positional arguments of the invocation — on the reference CLI, everything after the script path
— are exposed as the string array `_ARGS`: 1-based, iterable, always present (empty array when
none). Arguments deliberately stay out of `_PROPS` (the documented iterate/dump patterns remain
pure), and a caller-supplied property named `_ARGS` wins, the same precedence rule as `_PROPS`.
Elements are strings; converting to numbers is explicit (`TO_NUMBER`), consistent with nominal
number identity (v0.14.0).

### v0.19.0 — `multi ... limit K`: a concurrency cap on the multi block

Nearly non-breaking (`limit` becomes a reserved word — scripts using it as an identifier must
rename, the same class as `elseif` in v0.9.0). Design arc in
`docs/design-draft-multi-limit.md`.

An optional `limit K` clause on `multi` caps how many threads run concurrently: the first `K`
start at spawn, each finishing thread admits the next **in spawn order**, deterministically.
This makes the natural one-thread-per-job worker pool safe and self-balancing — previously the
only way to run N jobs on K threads was a hand-written striping idiom (stride arithmetic,
dynamic indexing, per-worker slice functions), which also could not rebalance load and put no
bound on concurrent `SHELL`/`HTTP` operations.

- The limit expression is evaluated once at `multi` entry (textual order: before the global
  snapshot and setup); it must be a positive integer — zero/negative/decimal/non-number are a
  runtime error, and nominal identity (v0.14.0) makes `limit 2.0` an error too.
- Setup is unchanged: arguments are still captured at the `thread` statement and `"running"`
  entries pre-registered. Only body start is deferred; a waiting thread reads `"running"` — no
  new Result status.
- `K >=` spawn count ≡ no limit; `limit 1` = sequential in spawn order.
- The monitor watchdog does not consume a slot.

### v0.18.0 — whole-file and JSON file I/O: READ_FILE, READ_JSON_FILE, WRITE_JSON_FILE

Additive, non-breaking. Three File-I/O built-ins that complete the group's symmetry, all
host-gated and Result-returning like the rest of it:

- `READ_FILE(path)` — the counterpart `WRITE_FILE` never had: the whole file as one string
  (UTF-8, content-exact). `ok` with the content, `error` on a read failure. For large files the
  windowed `READ_LINES` remains the right tool.
- `READ_JSON_FILE(path)` — read + JSON-parse in one call. `ok` with the parsed value — the same
  conversion `JSON_PARSE` performs (objects, arrays, scalars, first-class `null`) — or `error`
  when the file cannot be read or its content is not valid JSON (the message is the read
  failure's or the parser's). A leading UTF-8 BOM is ignored, as RFC 8259 permits. Replaces the
  three-step `JSON_PARSE(JOIN(UNWRAP(READ_LINES(path)), "\n"))` idiom, which silently
  normalized the file's newlines and failed with unrelated positioned errors instead of a Result.
- `WRITE_JSON_FILE(path, value)` — the counterpart of `READ_JSON_FILE`: serialize `value` exactly
  as `JSON_FORMAT` would and write it (overwrite) with a trailing newline (a POSIX text file).
  The `WRITE_JSON_FILE` → `READ_JSON_FILE` round-trip is lossless, first-class `null` included.
  For byte-exact output without the trailing newline, `WRITE_FILE(path, JSON_FORMAT(value))`
  remains available.

### v0.17.0 — plain-text position search: FIND, FIND_FIRST, FIND_LAST

Additive, non-breaking. Three literal (non-regex) string-search built-ins that report **1-based
positions**: `FIND(s, sub)` returns an array of *all* start positions of `sub` in `s`, ascending,
**overlapping occurrences included** — `FIND("aaa", "aa")` → `[1, 2]`; no occurrence → `[]`.
`FIND_FIRST(s, sub)` / `FIND_LAST(s, sub)` return the first / last position, or `0` when absent
(under 1-based indexing `0` can never be a valid position, so `if FIND_FIRST(s, sub) > 0` is the
presence idiom — or just use `CONTAINS`). Counting overlaps is what keeps the trio mutually
consistent: `FIND_FIRST`/`FIND_LAST` are by definition the first/last element of `FIND`, and
`FIND_LAST` agrees with the conventional `lastIndexOf` (which scans overlapping). Both arguments
must be strings; the search string must be **non-empty** — an empty `sub` is a runtime error
(every boundary would "match", so no useful position list exists).

### v0.16.0 — the monitor is a watchdog thread

The `monitor` clause is re-specified as what its name suggests: a **watchdog thread** the runtime
spawns and manages automatically alongside the workers (see [Monitor Clause](#monitor-clause)).
`monitor 500` means the watchdog **sleeps 500 ms between iterations** (fixed-delay, like a thread
running `SLEEP` in a loop) — not "poll every 500 ms". The watchdog follows the same purity rules
as worker threads and observes the other threads through **captured snapshots**:

- **Iteration scope**: each iteration runs like a function invocation in a fresh local scope —
  local assignment, loops, and function calls are now allowed in the body (previously *any*
  assignment was a runtime error). Locals do not carry over between iterations.
- **Worker purity**: a `::` global write raises the same error as in a worker
  (`Cannot assign to global variable '::x' inside multi block. ...`); the dedicated
  "read-only monitor" error is gone. Globals are readable via `::` only — the undocumented
  fallthrough that let a monitor read globals by bare name is removed (bare names are locals,
  exactly as inside a function).
- **Capture, not live view**: the result collection variable now holds a deep-copied snapshot
  taken as the iteration starts, so reads are consistent for the whole iteration even if the body
  suspends; the next iteration captures fresh. (Observable only in bodies that suspend —
  per-iteration values are unchanged.)
- **Unchanged**: the sleep-first cadence, the guaranteed final iteration after all workers
  finish, `[MONITOR ERROR]` reporting (a failing iteration stops mid-run iterations; the final
  one still runs), and the no-setup-locals rule.

Alongside the re-specification, the batch **pins the snapshot's timing**: it is taken at `multi`
entry, before the setup phase runs (see [Semantics](#semantics)). The spec always said "at multi
entry" and v1/js behaved that way, but the reference runtime had silently drifted to
snapshotting after setup — a setup-phase `::` write was visible to its workers. The reference is
restored to entry-time; fixture 121 pins it.

**Breaking, mildly**: scripts that *relied on the error* (none realistically) or read globals
bare inside a monitor must switch to `::`. Everything else is strictly more permissive.
Migration: none expected. Fixture 32 re-pins the global-write error; 117 pins iteration locals,
loops, and function calls in the body plus the capture read; 118 pins capture-vs-live under
suspension; 119 pins the nested `::g.x` member-write guard (error, position, and the untouched
global); 120 is the fresh-scope discriminator (a mid-run iteration's local is undefined in the
final one); 121 pins the entry-time snapshot.

### v0.15.0 — CONTAINS checks array membership

Additive, non-breaking. `CONTAINS` now also accepts an **array** as its first argument and
returns `true` when the second argument is an element of it — `CONTAINS([1, 2, 3], 2)` → `true`.
Membership uses `==`, so it is by value and deep for objects/arrays and strict across types. The
existing string-substring form is unchanged; the built-in dispatches on the first argument's type.

### v0.14.0 — the number model & load-time rejection pinned (the last v1.0-gate item)

Closes the final open corner of the v1.0-readiness review (`docs/design-draft-v1.0-gate.md` item 4,
plus a revision of item 2). **Breaking only in corners no fixture-covered script reaches.**

- **Integer vs decimal is nominal (provenance-based)**: a number's kind is fixed where it is
  produced, not by whether its value is whole. `2.0 * 1500000000` is the decimal `3000000000`
  (never overflows), while `2 * 1500000000` (both integers) overflows; `JSON_PARSE`/`TO_NUMBER` of a
  token with `.`/`e`/`E` is a decimal even when whole (`"2.0"`, `"2e0"`). Previously v1 re-boxed
  whole results to integers (and even promoted overflow silently) while js made overflow
  data-dependent; both now match the reference. `SUM` over integers joins the overflow rule.
- **Display is ECMA-262 `Number::toString`**, uniform across `PRINT`/`TO_STRING`/`JSON_FORMAT`:
  shortest round-trip digits, plain form in `[1e-6, 1e21)`, exponential (`1e+21`, `1e-7`) outside.
  Everyday bands (`0.0001`, epoch-ms timestamps, `6000000000`) now render plain instead of leaking
  scientific notation.
- **Blocked constructs are rejected at load** (revises v0.13.0 item 2): a script naming any hidden
  keyword or ignored function — anywhere, dead branches and `thread` spawns included — does not run
  at all; it is refused before the first statement, on the first violation in document order. This
  replaces both the per-call runtime error and the v0.13.0 worker-containment behavior with one
  rule: presence anywhere means the script is invalid in this environment.

### v0.13.0 — the edges pinned: integer envelope, spawn containment, dispatch names

Grown from the v1.0-readiness review (`docs/design-draft-v1.0-gate.md`): probing the corners the
fixture suite never covered exposed three-way runtime divergence, now specified. **Breaking in
those corners only** — no fixture-covered behavior changes.

- **The integer range is pinned**: 32-bit signed. Out-of-range integer literals and overflowing
  integer arithmetic (`+`, `-`, `*`, unary `-`, and the integer-producing `FLOOR`/`CEIL`/`ROUND`/`ABS`)
  are runtime errors (`Integer literal out of range: …` / `Integer overflow`) — previously the
  reference wrapped (or clamped) silently, v1 promoted to scientific-notation decimals, and js
  produced out-of-range integers. Data conversion (`JSON_PARSE`/`TO_NUMBER`) still promotes to
  decimals — JSON round-trips are untouched.
- **Blocked functions in `thread` spawns are worker-contained**: a hidden/ignored function reached
  through a spawn fails that worker (`[THREAD ERROR]` + error Result), not the whole run —
  consistent with every other worker error. Previously v1/js failed the run during spawn
  processing.
- **Interpreter-dispatched names are fully reserved at the host boundary**: registering an
  external function named `PRINT`, `SLEEP`, `FAIL`, or `UNWRAP` is now a host-API error
  (previously implementation-defined for `PRINT`/`SLEEP`, silently ignored for `FAIL`/`UNWRAP`).
- Non-normative: resource limits (recursion depth, memory) are explicitly documented as host
  discretion; the loop-iteration cap remains as specified.

### v0.12.0 — the all-uppercase function namespace is reserved

A script can no longer define a function whose name is all-uppercase (`^[A-Z][A-Z0-9_]*$`) — the definition itself is a runtime error at the definition site (see [Reserved Function Names](#reserved-function-names)). The naming convention becomes a guarantee: an ALL-CAPS call is always a built-in or host-provided function, the way a keyword is always the language's — while staying a function (composable, blockable via the host's ignored-functions list). Where built-ins are concerned this supersedes the practical need for v0.11.0's shadowing rule: a script-function/built-in collision can no longer exist, so future built-in additions are structurally non-breaking. Analyzed in `docs/design-draft-reserved-uppercase-namespace.md` (which also records the rejected `sleep`-keyword proposal that started the discussion, and the suspension model now documented in [Blocking and Suspension](#blocking-and-suspension)).

**Migration note (breaking):** rename any script-defined all-uppercase function — the error pinpoints the definition line. A corpus audit at adoption time found no such definitions outside the conformance suite itself. The shadow-mocking pattern (`function SLEEP(...)` to stub a built-in) is no longer possible — inject a host external or use a lowercase wrapper instead. Variable names are unaffected.

### v0.11.0 — function-name resolution pinned

A function call now resolves in a specified order — host-blocked check → script-defined functions → built-ins/externals (see [Name Resolution](#name-resolution)) — so a script-defined function shadows any same-named built-in or external in every runtime. Previously this was implementation-defined: the reference runtime already resolved script functions first, while the v1/js runtimes resolved built-ins first (a script's own `OK`, `LEN`, ... silently resolved to the built-in there). Pinning script-functions-first also makes future built-in additions genuinely non-breaking.

**Migration note (v1/js runtimes only):** a script that defines a function under a built-in name *and relied on the built-in winning* must rename that function. No grammar or keyword changes; existing fixtures are byte-identical.

### v0.10.0 — Result escalation (`FAIL`/`UNWRAP`) and genuine Results

Five new built-ins — `FAIL`, `UNWRAP`, `OK`, `ERR`, `IS_RESULT` — and the *genuine Result* origin rule (see [Genuine Results, `FAIL`, and `UNWRAP`](#genuine-results-fail-and-unwrap)). The Result pattern handles recoverable errors; this batch adds the missing **escalation** direction: a script can now declare an error fatal (`FAIL`), and `UNWRAP` compresses the check-then-escalate chain to one call. `OK`/`ERR` construct genuine Results (for returning structured results and for mocking Result-returning calls); `IS_RESULT` observes the origin.

**Non-breaking**: no grammar or keyword changes; no existing behavior changes; existing fixtures are byte-identical. Hosts that had registered external functions named `OK`/`ERR`/`IS_RESULT` keep their existing behavior (the registration shadows the new built-ins); externally registered `FAIL`/`UNWRAP` are shadowed by the built-ins, which are interpreter-dispatched like `PRINT`/`SLEEP`. Whether a *script-defined* function shadows a built-in name is implementation-defined (runtimes differ on whether script functions or built-ins win) — a script that defines its own function named `OK`/`ERR`/`IS_RESULT` should rename it. `UNWRAP` accepts only genuine Results — replace hand-built `{"status": ..., "ok": ..., "value": ...}` literals with `OK(v)`/`ERR(v)` where they must interoperate with `UNWRAP`.

### v0.9.0 — `elseif`

Lua-style `elseif` ([#3](https://github.com/flatide/ProperTee/issues/3)): multi-way branches no longer nest `else if ... end` with stacked `end`s — one chain, one `end`. Conditions are checked top to bottom; the first `true` arm wins and later conditions are not evaluated (and so not type-checked). The strict-boolean rule (spec v0.7.0) applies to each evaluated condition, and hiding the `if` keyword covers the whole chain.

**Migration note:** `elseif` is now a reserved word — a script using it as a variable or function name must rename it. Existing nested `else if ... end` chains keep working unchanged.

### v0.8.0 — first-class `null`

`null` is now the seventh value type ([#4](https://github.com/flatide/ProperTee/issues/4)), added so JSON round-trips losslessly — JSON is central to ProperTee, and `null` is a standard, meaningful JSON value that previously could not be represented (`JSON_PARSE` collapsed it into `{}`, and `JSON_FORMAT` could never emit it).

The design principle is **no implicit null**: the language itself never produces `null` (missing arguments and bare `return` still yield `{}`), so variables don't become nullable by accident — `null` enters a program only through the `null` literal or through data (`JSON_PARSE`, host-injected values). Once present it is inert data: equality and `TYPE_OF` (→ `"null"`) work; conditions, logic, arithmetic, and member access on `null` are runtime errors (the spec v0.7.0 strictness applies unchanged), so there is no null propagation.

**Migration note:**

- **`null` is now a reserved word.** A script using `null` as a variable or function name must rename it (previously it parsed as an ordinary identifier).
- **`JSON_PARSE` no longer normalizes JSON `null` to `{}`.** Code that tested a parsed field with `== {}` to detect JSON `null` must now compare with `== null`. Fields that are genuinely `{}` in the JSON are unaffected.

### v0.7.0 — breaking-change batch

Five coordinated breaking changes ([#1](https://github.com/flatide/ProperTee/issues/1), [#2](https://github.com/flatide/ProperTee/issues/2), [#5](https://github.com/flatide/ProperTee/issues/5), [#6](https://github.com/flatide/ProperTee/issues/6), [#7](https://github.com/flatide/ProperTee/issues/7)) landed together so scripts migrate once. **Migration note:**

- **Strict conditions** (#1): a non-boolean `if`/`loop` condition is now a runtime error (`Condition requires a boolean value`). Previously non-booleans were silently falsy — `if LEN(arr) then` never ran; it now fails loudly. Write explicit comparisons (`if LEN(arr) > 0 then`).
- **Short-circuit `and`/`or`** (#2): evaluation is left to right and stops as soon as the result is decided — `false and X` / `true or X` no longer evaluate `X`, side effects included. This enables `if HAS_KEY(obj, "k") and obj.k == 1 then`. Operand type errors now report only the evaluated operand's type (`Got number`, not `Got number and number`).
- **`RANDOM(max)` removed** (#5): the single-argument form (0 to max−1, exclusive) clashed with the inclusive two-argument form. Calling `RANDOM` with one argument is a runtime error; use `RANDOM(0, max - 1)` for the old meaning.
- **`SLICE(arr, start, count)`** (#6): the third argument is now a **count**, unified with `SUBSTRING` and `READ_LINES`. The old third argument was in practice a 1-based *inclusive* end (the previous spec text "end is exclusive" described the 0-based internal bound), so migrate `SLICE(a, s, e)` → `SLICE(a, s, e - s + 1)`.
- **Strict `LEN`** (#7): `LEN` on a number or boolean is now a runtime error (`LEN() requires a string, array, or object argument`) instead of silently returning `0`.

### v0.6.0

- **HTTP built-ins**: `HTTP_GET(url, [options])`, `HTTP_POST(url, body, [options])`, and the general `HTTP(method, url, [options])`. Host-provided capability (`PlatformProvider`). Returns a Result whose `value` is `{status, body, headers}`; `ok` is true only for 2xx, and a transport failure yields `{status: 0, body: <message>, headers: {}}`.

### v0.5.0

- **`_PROPS` reserved object**: all host-injected properties are now also reachable as one object, `_PROPS` (e.g. `PRINT(_PROPS)`, `JSON_FORMAT(_PROPS)`, `KEYS(_PROPS)`, `_PROPS.a`), so a script can dump/iterate/forward the whole input set while each key stays directly accessible. Use `::_PROPS` inside functions/`multi` setup. A caller-supplied `_PROPS` input is left as-is.

### v0.4.0

- **File I/O built-ins**: `FILE_EXISTS()`, `FILE_INFO()`, `READ_LINES()`, `WRITE_FILE()`, `WRITE_LINES()`, `APPEND_FILE()`, `MKDIR()`, `LIST_DIR()`, `DELETE_FILE()` for file system operations. `READ_LINES` uses 1-based offset with count limit to avoid loading entire files into memory. All I/O functions return Result pattern for error handling.
- **String matching built-ins**: `CONTAINS()`, `STARTS_WITH()`, `ENDS_WITH()` for simple checks. `MATCHES()` and `REGEX_FIND()` for regex. `REPLACE()` for string substitution.
- **Object extensions**: `VALUES()`, `ENTRIES()`, `MERGE()`, `REMOVE_KEY()` for richer object manipulation.
- **JSON built-ins**: `JSON_PARSE()` converts JSON string to ProperTee values (JSON `null` → `{}`). `JSON_FORMAT()` converts any value to JSON string.
- **Environment**: `ENV(name, [default])` reads environment variables. Returns `{}` if not set and no default provided.
- **Type introspection**: `TYPE_OF()` returns type name as string.
- **String escape processing**: String literals now process escape sequences (`\"`, `\\`, `\n`, `\t`, `\r`) in all contexts — expressions, object keys, and property access. Previously, only thread spawn keys processed escapes.

### v0.3.0

- **Host environment restrictions**: `setHiddenKeywords()` hides language keywords (`if`, `loop`, `function`, `multi`, `thread`, `debug`). `setIgnoredFunctions()` blocks built-in or external function calls. Both produce runtime errors when used.
- **`SHELL()` and `SHELL_CTX()` built-ins**: Execute shell commands from scripts. `SHELL(cmd)` for one-off commands, `SHELL(ctx, cmd)` with a context from `SHELL_CTX(cwd[, env])` for working directory and environment variable control. Async execution — other threads in multi blocks continue while shell commands run.
- **No bare identifier keys**: Object keys must be quoted strings or integers. `{"name": "Alice"}` is valid; `{name: "Alice"}` is now a parse error.
- **`debug` statement**: New keyword for explicit breakpoints in the playground debugger. No-op in normal execution.
- **Deep-copy value semantics**: All assignments (variables, properties, function args, thread args, loop variables) produce independent deep copies. No shared mutable state between variables.
- **Range syntax `..`**: Range array syntax changed from `[start~end]` to `[start..end]` and `[start..end, step]`.
- **Sort functions**: Added `SORT()`, `SORT_DESC()`, `SORT_BY()`, `SORT_BY_DESC()`, and `REVERSE()` built-in functions.
- **No object positional access**: Integer keys on objects always resolve as string keys. `obj.1` reads key `"1"`, not the first entry by insertion order.
- **`KEYS()` built-in**: `KEYS(obj)` returns an array of the object's keys in insertion order.

### v0.2.0

- **`RANDOM()`, `MILTIME()`, `DATE()`, `TIME()` built-ins**: Random numbers, epoch milliseconds, formatted date and time strings.
- **Range array literals**: `[1..5]` produces `[1, 2, 3, 4, 5]`. Optional step: `[1..10, 2]`.
- **`$::var` syntax**: Global variable access in dynamic keys and property access. `obj.$::var` and `thread $::var: func()`.
- **Multi block setup scope isolation**: Setup phase runs in isolated scope. `::` required for global access.
- **Empty dynamic key as unnamed**: Empty `$var`/`$(expr)` key treated as unnamed (auto-keyed `#1`, `#2`).
- **Thread spawn key syntax**: `thread key: func()` prefix syntax. Keys reuse the `access` rule.
- **Auto-key `#` prefix**: Unnamed thread results keyed as `"#1"`, `"#2"` instead of `"1"`, `"2"`.
- **Dynamic thread keys**: `$var` and `$(expr)` syntax for computed keys in thread spawns.
- **Thread status field**: `status` field on Result objects (`"running"`, `"done"`, `"error"`).
- **Multi block result collection**: `multi resultVar do ... end` collects all thread results.
- **`HAS_KEY()` built-in**: `HAS_KEY(obj, key)` returns `true`/`false`.
- **`thread` keyword for spawning**: `thread` repurposed as spawn keyword inside multi blocks.
- **`::` global prefix**: Inside functions, `::x` accesses globals. Thread purity enforced.
- **Truthiness**: Only `true` is truthy.
- **Implicit return**: Functions without `return` produce `{}`.

### v0.1.0

- Initial release with variables, functions, loops, conditionals, arrays, objects, strings, cooperative multithreading, and 30 built-in functions.
