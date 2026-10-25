# ProperTee Language Specification v0.35.0

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
- Integers run from −9,007,199,254,740,991 to 9,007,199,254,740,991 and are always exact; integer
  arithmetic that leaves this range is an error ([The integer range](#the-integer-range-spec-v0130-widened-in-v0330))
- Arithmetic that produces a whole number result displays without a decimal point: `10 / 2` displays as `5`
- Division always produces a decimal internally: `7 / 2` → `3.5`
- Whole-number results of other operations display as integers: `1.0 + 2.0` → `3`
- Decimal arithmetic past the range of numbers gives `Infinity` or `-Infinity`
  (`TO_NUMBER("1e308") * 10`), and `Infinity - Infinity` gives `NaN`. Text does not turn into
  them: `TO_NUMBER`, `JSON_PARSE` and `READ_JSON_FILE` refuse a numeral too large to represent,
  such as `1e999`. They display as `Infinity`, `-Infinity` and `NaN`, but JSON has no form for them
  ([Numbers JSON cannot hold](#numbers-json-cannot-hold)). Division by zero is an error, not
  infinity.

#### Integer vs decimal is nominal (spec v0.14.0)

Whether a number is an **integer** or a **decimal** is fixed *where the value is produced* — by the
operation's structure, not by whether the runtime value happens to be whole. A decimal that lands on
a whole value (`1.5 + 1.5`) stays a decimal; it never turns back into an integer.

- **Integers** come from: integer literals; integer-with-integer `+`, `-`, `*`, `%`, and unary `-`
  (`+`, `-` and `*` overflow-checked, below); and integer-producing built-ins (`LEN`, `FLOOR`, `CEIL`, `ROUND` and
  `TRUNC` without `digits`, `ABS` of an integer, and the like).
- **Decimals** come from: decimal literals (including whole ones like `3.0`); any `/`; any operation
  with a decimal operand (`2 + 3.0` → decimal `5`); decimal-producing built-ins (`RANDOM`, `FLOOR`,
  `CEIL`, `ROUND` and `TRUNC` with `digits`, …); and
  data whose text carries a fraction or exponent — `JSON_PARSE`/`TO_NUMBER` of a token containing
  `.`, `e`, or `E`, or of an integer numeral outside the integer range.

The only places this distinction is observable are the **integer-overflow rule** (next section) and
**display of extreme magnitudes** (§Output Formatting): whether an expression *can* overflow is
decided by its structure, never by the data flowing through it, so `2.0 * 4503599627370496` is the
plain decimal `9007199254740992` while `2 * 4503599627370496` (both integers) overflows. Everything
else treats the two alike — `TYPE_OF` is `"number"` for both, `2 == 2.0` is `true`, and a whole value displays the same
either way. Where an **integer is required** (indexing, dynamic keys, integer built-in arguments) a
whole decimal is accepted by coercion; a non-whole decimal is an error, as before.

#### The integer range (spec v0.13.0, widened in v0.33.0)

Integers run from **−9,007,199,254,740,991 to 9,007,199,254,740,991** — ±(2⁵³ − 1), about nine
quadrillion. That holds a file size up to 8 PiB in bytes, a time in epoch milliseconds for the next
285,000 years, or an amount of money in cents. Every integer in the range is exact and stays exact
as a decimal, and it is the range JSON readers agree on (RFC 8259 §6), so an integer a script writes
reads back the same in any of them. (Until v0.32.0 integers were 32-bit, ±2,147,483,647, so a total
of file sizes past 2 GiB had to start from `0.0`.)

Like every other type rule in ProperTee, leaving the range fails loudly at the point of use — there
is no silent wrap-around and no silent promotion to a decimal:

- An integer **literal** must fit the range. A larger one is a runtime error:
  `Integer literal out of range: 9007199254740992 is larger than 9,007,199,254,740,991`. The range
  is symmetric, so `-9007199254740991` is written directly.
- Integer **arithmetic** (`+`, `-`, `*`) whose result leaves the range is a runtime error:
  `Integer overflow: the result is outside ±9,007,199,254,740,991`. Unary minus and `%` cannot
  overflow, and `/` always produces a decimal.
- `SUM` of integers adds them in order, like `+`, and a running total outside the range is the same
  error, even when later arguments would bring it back: `SUM(9007199254740991, 1, -1)` fails.
- The built-ins that produce an integer — `FLOOR`, `CEIL`, `ROUND` and `TRUNC` (from a decimal,
  without `digits`) — raise the same error when the result does not fit. `ABS` cannot overflow. With
  `digits` the four rounding built-ins produce a decimal and cannot overflow
  ([Rounding to digits](#rounding-to-digits)).
- **Data and the host.** `JSON_PARSE` and `TO_NUMBER` read an integer numeral inside the range as an
  integer, and one outside it as a decimal — data conversion is not script arithmetic, and JSON keeps
  round-tripping. A decimal holds about 16 significant digits, so such a numeral becomes the nearest
  decimal: `9007199254740993` reads as `9007199254740992`. Numbers a host supplies — `MILTIME()`, a
  file's size and time, values passed in — are integers inside the range too.

To go past the range, compute with a decimal: `MILTIME() * 1000000` (nanoseconds) is an overflow,
while `MILTIME() * 1000000.0` is a decimal of about 16 significant digits. (The JavaScript runtime
does not yet keep a whole decimal such as `1000000.0` apart from an integer, so there this is still
an overflow; see the [v0.33.0 changelog](#v0330--integers-up-to-9007199254740991).)

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

The position must be an integer from 1 to `LEN(s)`: `s.0`, `s.6`, and `s.$i` with `i = 1.5` are
runtime errors (`String index out of bounds`, `String index must be an integer`).

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

The index must be an integer from 1 to `LEN(nums)`, when reading and when assigning: `nums.0`,
`nums.4`, and `nums.$i` with `i = 1.5` are runtime errors (`Array index out of bounds`,
`Array index must be an integer`). A whole decimal such as `2.0` is the index `2`.

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

In debug mode, explicit `debug` statements and line breakpoints apply to the main logical thread
and to functions running as `multi` workers. Each stop identifies the logical thread and exposes
that worker's own locals, global snapshot, and call stack. A step stays scoped to the worker that
armed it, although an explicit breakpoint may still stop another worker. Monitor iterations are
deliberately excluded: `debug` in a monitor body remains a no-op even in debug mode.

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

A script-defined function therefore **shadows** any same-named built-in or external function — and a spec release adding new built-ins can never change what an existing script's calls resolve to. Within step 3, an external registered under a catalog built-in's name replaces that built-in. The **interpreter-dispatched names** — `PRINT`, `PRINTF`, `SLEEP`, `FAIL`, `UNWRAP` — cannot be replaced at all: registering an external under one of them is a **host-API error** at registration time (spec v0.13.0, `PRINTF` since v0.30.0; previously `PRINT`/`SLEEP` were implementation-defined and a `FAIL`/`UNWRAP` registration was silently ignored).

Since spec v0.12.0 a script cannot define an all-uppercase function name at all (see [Reserved Function Names](#reserved-function-names)), so a script function can never collide with a built-in in the first place; the order above still governs the residual case of host-registered externals with non-reserved names.

### Reserved Function Names

The all-uppercase namespace belongs to the runtime and the host (spec v0.12.0). A script cannot define a function whose name is all-uppercase — an uppercase letter followed only by uppercase letters, digits, or underscores (`^[A-Z][A-Z0-9_]*$`). The definition itself is a runtime error at the definition site:

```
function LEN(x) do    // Runtime error: Cannot define function 'LEN':
    return 0          //   all-uppercase names are reserved for built-in
end                   //   and host functions
```

The rule applies to **every** all-uppercase name, not just names that currently exist as built-ins — so a future spec release can add new built-ins without ever colliding with script code. What this buys: an ALL-CAPS call is always a built-in or host-provided function, guaranteed — the naming convention is a fact, not a custom. Mixed-case and lowercase names (`Foo`, `getBalance`, `get_balance`) are unrestricted. Variable names are unaffected (`MAX = 10` is legal — variables and functions are separate namespaces).

## Imports and Modules

Imports let an entry script call reusable functions from another ProperTee source without exposing
that source's globals:

```
import util.file as file
import util.file.1 as file_v1

file::init("/data")
text = file::read("input.txt")
```

### Syntax and load rules

- An import is `import ID ('.' ID)* ('.' N)? as alias`. Segments are unquoted identifiers;
  dynamic and quoted segments are not allowed.
- A final numeric segment is an exact version. `N` is a canonical positive 32-bit integer:
  `.1` is valid; `.0` and `.01` are invalid.
- Imports may appear only at the start of a source, before all statements. `import` and `as`
  are reserved words.
- An imported source may not contain imports. Import depth is exactly one.
- There is no `library` declaration. Any source with no imports can be either executed directly
  or imported.
- Every import is resolved, parsed, and validated before the entry's first statement runs. A
  missing resolver/module, invalid module, duplicate alias, or duplicate resolved module/version
  refuses the whole run before output or side effects.

A host resolver maps `(moduleId, requestedVersion)` to immutable source plus a stable source id
and resolved version. Omitting a version means the host chooses its active/latest version; writing
`.N` requires that exact version. The reference CLI maps `util.file` to `util/file.N.tee`,
chooses the greatest numeric `N`, and falls back to `util/file.tee` only when no versioned file
exists. TeeBox maps the module id directly to `scriptId`, uses the active version when omitted,
and accepts only numeric script versions.

### Execution and visibility

Direct execution is unchanged: all top-level statements run. Import mode executes no top-level
statements; it registers only function definitions directly under the source root. This lets the
same source keep top-level self-test code without running that code when imported. Initialization
is explicit through an ordinary function such as `file::init(...)`.

Only `alias::function(...)` is visible across the boundary. Imported globals cannot be read or
written by the entry, and imported code cannot call entry functions or import aliases. Each
resolved module/version has isolated globals, initially empty, and same-module unqualified helper
calls resolve within that module. Arguments and return values are deep-copied at the module
boundary.

A `multi` entry snapshots the entry globals and every loaded module's globals together. A worker
calling an imported function reads that module snapshot and cannot write module globals, under the
same purity error as `::` writes in entry functions. Monitor iterations use the same snapshots
and remain excluded from debugging. Debug-capable hosts identify stops, errors, and call sites by
source id plus line and column, so imported functions—including functions running as workers—can
be inspected without confusing their lines with the entry source.


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

**Monitor-only thread values (spec v0.21.0):** The capture keeps every collection entry as a
genuine Result and keeps its `status`/`ok` fields unchanged, but replaces that copied entry's
`value` with a thread-information object for the duration of the monitor iteration:

```
{
    "id": 1,
    "key": "build",
    "functionName": "build_worker",
    "state": "running",
    "returnValue": {},
    "shell": {
        "active": true,
        "taskId": "task-1",
        "pid": 1234,
        "status": "running",
        "elapsedMs": 850,
        "exitCode": {},
        "output": "compiling module 42",
        "updated": true,
        "result": {}
    }
}
```

- `state` repeats the enclosing Result's `status`; `returnValue` is that Result's ordinary
  semantic `value` at capture time. Thus `UNWRAP(result.build)` inside the monitor returns the
  thread-information object, while `result.build.value.returnValue` reaches the ordinary value.
- `shell` is `{}` until that worker calls `SHELL`. It is one observation slot, not a history:
  a later sequential `SHELL` replaces it, and the last call remains observable through the final
  monitor iteration.
- `output` is a default **one-line tail**; there is no monitor-tail syntax or line-count option.
  When bounded SHELL output changed since the previous monitor capture, it contains the newest
  logical line (a not-yet-newline-terminated partial line counts). With no change it is `""` and
  `updated` is `false`. `updated` distinguishes no update from a newly emitted empty line.
- `taskId`, `pid`, `exitCode`, and live output are host capabilities. A runtime/host that cannot
  provide one uses `{}`; the remaining fields and final SHELL Result still apply. The standard
  JavaScript runtime's SHELL stub therefore reports the portable fields but no process metadata.
- This is a projection, not a temporary mutation of the live collection. After `multi ... end`,
  the assigned result collection has the ordinary Result shape and ordinary worker value; no
  thread-information object leaks into the script result or host result data.

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

Built-in functions are **runtime primitives** — provided by the runtime or the host, not written in ProperTee. Some of them **suspend**: a call that has to wait — `SLEEP`, `SHELL`/`SHELL_CTX`, `HTTP`/`HTTP_GET`/`HTTP_POST`, the file-I/O built-ins (reading a `FILE_LINES` array included), and asynchronous host-registered external functions — pauses only the calling thread and yields to sibling threads until the wait is over. There is no `await`-style marker: suspension is a property of the call, not of the syntax, and any function may transitively suspend by calling one of these.

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
| `PRINTF(format, values...)` | Print one line made from `format` and the values — what `PRINT(FORMAT(format, values...))` prints (spec v0.30.0). Returns `{}`. See [Formatted output](#formatted-output). |

#### Formatted output

`FORMAT(format, values...)` returns a string made from `format`, with each placeholder in it
replaced by the next value (spec v0.30.0). `PRINTF(format, values...)` prints that string as one
line, as `PRINT` does, and returns `{}`; unlike C's `printf`, it ends the line. A placeholder can
hold a [number pattern](#number-patterns), a picture of how the number is written — `0.00`,
`#,##0` — with the symbols of a spreadsheet's number format (spec v0.31.0).

```
PRINTF("{} items, average {0.00}", 3, 3.4)     // 3 items, average 3.40
PRINTF("Total: {#,##0} won", 1234567)          // Total: 1,234,567 won
PRINTF("Done: {0.0%}", 0.4567)                 // Done: 45.7%
line = FORMAT("Order {00000}", 42)             // "Order 00042"
```

| Placeholder | Meaning |
|---|---|
| `{}` | The next value as `PRINT` shows it — a string without quotes, an array or object as `PRINT` writes it. |
| `{pattern}` | The next value, a number, written as the [number pattern](#number-patterns) draws it — `{0.00}`, `{#,##0}`. This is the text `TEXT(value, "pattern")` returns. |
| `{{` and `}}` | A literal `{` and `}`. |

Nothing else goes between the braces — not a space, and not a position such as `{1}`, which would
read like the pattern `{0}`. A name such as `{total}` is an error today, so a later version can
give it a meaning without changing what an existing script does. To line values up in columns, use
[`ALIGN_LEFT`, `ALIGN_RIGHT` and `ALIGN_CENTER`](#aligning-text).

The format is checked as a whole before any value is used, and errors are reported in this order —
the three kinds of invalid format as they occur from left to right:

| Case | Error |
|---|---|
| no `format` | `FORMAT() missing argument 1` |
| `format` not a string | `FORMAT() requires a string format` |
| a placeholder that is neither `{}` nor a number pattern — `{:.2f}`, `{1}`, `{x}`, `{ 0.00 }` | `FORMAT() invalid format: {:.2f}` |
| a `{` with no `}` after it | `FORMAT() invalid format: unclosed {` |
| a `}` outside a placeholder that is not `}}` | `FORMAT() invalid format: unmatched }` |
| more or fewer values than placeholders | `FORMAT() format has 2 placeholders, got 3 values` |
| a value that is not a number under a pattern | `FORMAT() {0.00} requires a number, got string` |

`PRINTF` reports the same errors under its own name — `PRINTF() invalid format: {x}` — and, like
the other built-ins' errors, without a line number.

#### Number patterns

A number pattern draws how a number is written. It uses the symbols of a spreadsheet's number
format — Excel's custom formats and its `TEXT` function — so the pattern looks like the text it
makes (spec v0.31.0). `TEXT(n, pattern)` writes one number this way, and a `{pattern}` placeholder
writes the next value of a format this way.

| Symbol | Meaning |
|---|---|
| `0` | A digit, always written: where the number has no digit, a `0` is written |
| `#` | A digit, written only where the number has one |
| `.` | The decimal point; the `0`s and `#`s after it are the decimals |
| `,` | In the integer part: the digits are separated into groups of three with commas |
| `%` | At the end only: the number is written times 100, followed by `%` |

| Number | Pattern | Text |
|---|---|---|
| `3.14159` | `0.00` | `3.14` |
| `3.4` | `0.00` | `3.40` |
| `1234567.891` | `#,##0.00` | `1,234,567.89` |
| `87.6` | `0` | `88` |
| `7` | `000` | `007` |
| `0.4567` | `0.0%` | `45.7%` |
| `3.5`, `3` | `0.##` | `3.5`, `3` |

- **Rounding** is `ROUND`'s: the digits `PRINT` shows are rounded to the pattern's decimals, a tie
  away from zero ([Rounding to digits](#rounding-to-digits)). `1.005` with `0.00` is `1.01`,
  `-2.5` with `0` is `-3`, and `9.995` with `0.00` is `10.00`.
- **The integer digits are never cut.** The `0`s set the least number of digits, so `1234` with
  `000` is `1234`, and at least one integer digit is written: `0.5` with `#.##` is `0.5`. Zeros
  fill after the sign — `-7` with `000` is `-007` — and a `,` groups them with the other digits:
  `7` with `0,000` is `0,007`.
- **A `#` decimal** drops a trailing zero: with `0.0#`, `3.1` is `3.1` and `3` is `3.0`. When no
  decimal is left, the decimal point is dropped too.
- **`%`** moves the decimal point of the shown digits two places, so nothing is lost: `0.145` with
  `0%` is `15%`, where multiplying the binary value by 100 gives 14.499999999999998.
- A number that rounds to zero has no sign: `-0.004` with `0.00` is `0.00`. A large number is
  written in full, never with an exponent: `1e21` with `#,##0` is `1,000,000,000,000,000,000,000`.
- `Infinity`, `-Infinity` and `NaN` are written as `PRINT` shows them, whatever the pattern.
- The integer part is `#`s followed by `0`s, and a comma may stand between two of them — never
  first, last, or two in a row; the decimals are `0`s followed by `#`s. Precisely, a pattern matches
  the regular expression `(#(,?#)*(,?0)*|0(,?0)*)(\.(0+#*|#+))?%?`. Anything else is not a pattern —
  another character, `0#`, `0.#0`, `0.`, `.00`, `,0`, `0,` or `0,,0`.

Patterns take only the part of a spreadsheet's number format that writes a number, and they differ
from Excel where Excel surprises:

- `3` with `0.##` is `3`, not Excel's `3.`, and `0.5` with `#.##` is `0.5`, not `.5`.
- A trailing comma (`#,##0,`), which Excel uses to divide by 1000, is not a pattern.
- A pattern holds no text (`#,##0" won"`), no section for negative numbers (`0;-0`), no color and
  no date. Text goes around the placeholder: `{#,##0} won`.
- A value that is not a number is an error, numeric text such as `"3.4"` included. Excel's `TEXT`
  converts numeric text and passes other text through, but ProperTee converts no value silently, as
  `5 == "5"` is `false`.

`TEXT` checks its pattern before its number:

| Case | Error |
|---|---|
| a missing argument | `TEXT() missing argument 2` |
| a third argument | `TEXT() takes at most 2 arguments` |
| `pattern` not a string | `TEXT() requires a string pattern` |
| `pattern` not a number pattern | `TEXT() invalid pattern: '0.0.0'` |
| `n` not a number | `TEXT() requires a number, got string` |

#### Aligning text

`ALIGN_LEFT(value, width)`, `ALIGN_RIGHT(value, width)` and `ALIGN_CENTER(value, width)` write the
value as `PRINT` shows it and pad it with spaces to `width` columns, as a word processor's
alignment buttons line text up (spec v0.31.0). Longer text is not cut, and centering puts an odd
space on the right. `width` is an integer from 0 to 999.

```
loop row in [["사과", 3, 1500], ["배", 12, 25000], ["apple", 100, 1234567]] do
    PRINT(ALIGN_LEFT(row.1, 6), ALIGN_RIGHT(row.2, 3), ALIGN_RIGHT(TEXT(row.3, "#,##0"), 9))
end
// 사과     3     1,500
// 배      12    25,000
// apple  100 1,234,567
```

The width counts **columns on screen**, so a table holding Hangul or Chinese text lines up in a
terminal. Each code point is counted on its own, by the first of these rules that applies:

- A combining mark or a format character (General_Category Mn, Me or Cf) takes none, and so does a
  Hangul medial vowel or final consonant (U+1160–U+11FF, U+D7B0–U+D7FF), which joins the letter
  before it into one syllable. A combining mark that is also wide, such as U+3099, takes none.
- A character whose Unicode East_Asian_Width is W or F — Hangul syllables, Han characters, kana,
  fullwidth forms, most emoji — takes two columns, and so does any code point in U+3400–U+4DBF,
  U+4E00–U+9FFF, U+F900–U+FAFF, U+20000–U+2FFFD and U+30000–U+3FFFD.
- Every other code point takes one, an unpaired surrogate (`SUBSTRING("😀", 1, 1)`) included.

The data is Unicode 16.0, fixed so that every runtime counts alike. Because each code point counts
alone, an emoji sequence may not match what a terminal draws: `❤️` (U+2764 U+FE0F) counts one
column, and a family emoji such as `👨‍👩‍👧` counts six. `LEN` counts differently, in UTF-16 code
units: `LEN("사과")` is 2, while `ALIGN_LEFT("사과", 6)` adds two spaces. Whether the columns line up
on screen also depends on the font — a terminal draws a Hangul syllable two columns wide, but a web
page whose monospace font has no Hangul may not.

| Case | Error |
|---|---|
| a missing argument | `ALIGN_LEFT() missing argument 2` |
| a third argument | `ALIGN_LEFT() takes at most 2 arguments` |
| `width` not an integer from 0 to 999 | `ALIGN_LEFT() width must be an integer from 0 to 999` |

A third argument is an error today, so a later version can add a fill character without changing
what an existing script does.

### Math

| Function | Description |
|---|---|
| `SUM(args...)` | Sum of all numeric arguments |
| `MAX(args...)` | Maximum of all numeric arguments |
| `MIN(args...)` | Minimum of all numeric arguments |
| `ABS(n)` | Absolute value |
| `ROUND(n, [digits])` | Round to the nearest; a tie goes away from zero — `ROUND(2.5)` → `3`, `ROUND(-2.5)` → `-3` |
| `FLOOR(n, [digits])` | Round down, toward −∞ |
| `CEIL(n, [digits])` | Round up, toward +∞ |
| `TRUNC(n, [digits])` | Round toward zero, cutting the digits off (spec v0.30.0) |
| `RANDOM()` | Random decimal between 0.0 (inclusive) and 1.0 (exclusive) |
| `RANDOM(min, max)` | Random integer from `min` to `max` (both inclusive), each equally likely. Both must be integers within the [integer range](#the-integer-range-spec-v0130-widened-in-v0330) (a whole decimal such as `2.0` will do), and `min` may not be greater than `max`. |

Without `digits`, `ROUND`, `FLOOR`, `CEIL` and `TRUNC` return an integer; with it they keep that
many decimal places — see [Rounding to digits](#rounding-to-digits).

`SUM`, `MAX`, `MIN`, `ABS`, `ROUND`, `FLOOR`, `CEIL` and `TRUNC` take numbers: a value that is not
a number is an error — `SUM("a", 1)` → `SUM() requires numeric arguments` — and `MAX` and `MIN`
need at least one argument: `MAX() requires at least one argument`.

The single-argument form `RANDOM(max)` was **removed in v0.7.0** — its exclusive upper bound clashed with the inclusive two-argument form. Calling `RANDOM` with one argument is a runtime error; write `RANDOM(0, max - 1)` for the old meaning.

#### Rounding to digits

`ROUND`, `FLOOR`, `CEIL` and `TRUNC` take an optional second argument, `digits`: the number of
decimal places to keep (spec v0.30.0). `0` keeps none, and a negative `digits` rounds to tens,
hundreds, and so on.

| Function | `3.48`, `1` | `-3.48`, `1` |
|---|---|---|
| `ROUND` — to the nearest | `3.5` | `-3.5` |
| `FLOOR` — toward −∞ | `3.4` | `-3.5` |
| `CEIL` — toward +∞ | `3.5` | `-3.4` |
| `TRUNC` — toward zero | `3.4` | `-3.4` |

```
PRINT(ROUND(1234.5, -2), CEIL(1201, -2))    // 1200 1300
PRINT(TRUNC(3.48, 1), TRUNC(-3.9))          // 3.4 -3
```

**The shown digits are rounded.** `n` is read as the decimal number `PRINT` shows for it — the
shortest digits that round-trip ([Number display](#number-display-spec-v0140)) — and that decimal
is rounded at the place `digits` names. The result is the number nearest to the rounded decimal, so
`PRINT` shows the rounded decimal exactly when it has at most 15 significant digits.

```
PRINT(FLOOR(0.29, 2), FLOOR(4.35, 2))       // 0.29 4.35
PRINT(ROUND(1.005, 2), ROUND(2.675, 2))     // 1.01 2.68
PRINT(ROUND(10 / 3, 2))                     // 3.33
PRINT(CEIL(0.1 + 0.2, 1))                   // 0.4 — 0.1 + 0.2 shows as 0.30000000000000004
```

The binary value behind most short decimals is a little above or below them — the double nearest
`0.29` is 0.28999… — so rounding that value moves some numbers one step down or up; multiplying by
100 to round does this: `FLOOR(0.29 * 100) / 100` is `0.28`. Rounding the shown digits avoids it,
and gives the same result in every runtime.

**Ties.** When the shown digits lie exactly halfway, `ROUND` goes away from zero, with or without
`digits`, so `ROUND(-x, d)` is always `-ROUND(x, d)`: `ROUND(2.5)` → `3`, `ROUND(-2.5)` → `-3`,
`ROUND(1.005, 2)` → `1.01`, `ROUND(-1.005, 2)` → `-1.01`. Until v0.29.0 a tie went toward +∞, so
`ROUND(-2.5)` was `-2`.

**The result.** Without `digits` the result is an integer, and one outside the
[integer range](#the-integer-range-spec-v0130-widened-in-v0330) is an `Integer overflow` error, as
before. With `digits` it is a decimal — for `digits` `0` too — and never overflows:
`ROUND(10000000000000000.7)` is an error, `ROUND(10000000000000000.7, 0)` is `10000000000000000`. A
whole result shows without a fraction (`ROUND(3.0, 2)` → `3`); to show trailing zeros, use
[`TEXT`](#number-patterns): `TEXT(3.0, "0.00")` → `"3.00"`.

- `digits` must be an integer; a whole decimal such as `2.0` is accepted, as wherever an integer is
  required. Any integer will do. Places past the number's last digit change nothing
  (`ROUND(3.48, 400)` → `3.48`); a place above its first digit leaves `0` or one unit of that place
  (`ROUND(3.48, -5)` → `0`, `CEIL(3.48, -5)` → `100000`).
- A result beyond the range of numbers is `Infinity`, as in arithmetic:
  `CEIL(TO_NUMBER("1.7976931348623157e308"), -308)` → `Infinity`. With `digits`, `Infinity`,
  `-Infinity` and `NaN` come back unchanged.
- A result of zero has no sign: `CEIL(-0.001, 2)` → `0`.

| Case | Error |
|---|---|
| no argument | `ROUND() missing argument 1` |
| `n` not a number | `ROUND() requires numeric arguments` |
| `digits` not an integer | `ROUND() digits must be an integer` |
| three or more arguments | `ROUND() takes at most 2 arguments` |

A third argument is an error rather than ignored: until v0.29.0 these functions silently dropped
their second argument, so `ROUND(3.48, 1)` was `3`.

### Type Conversion

| Function | Description |
|---|---|
| `TO_NUMBER(s)` | Convert a decimal numeral to a number — the exact syntax is [below](#numeric-text) (spec v0.25.0). Any other text is a runtime error. |
| `TO_STRING(v)` | Convert any value to its string representation |

#### Numeric text

`TO_NUMBER` accepts exactly a **decimal numeral** (spec v0.25.0), ignoring leading and trailing
[whitespace](#whitespace) — the same six characters `TRIM` removes. A decimal numeral is:

- an optional sign, `+` or `-`;
- then digits with an optional fraction — `42`, `3.14`, `5.` — or a fraction alone — `.5`;
- then an optional exponent: `e` or `E`, an optional sign, and digits — `1e3`, `2.5E-4`.

Digits are the ASCII digits `0`–`9`, and leading zeros are allowed (`"007"` → `7`). Nothing else
converts: not hexadecimal, octal, or binary (`"0x10"`, `"0o17"`, `"0b101"`), not type suffixes
(`"1f"`, `"1.5d"`), not `"Infinity"` or `"NaN"`, not digit separators (`"1_000"`, `"1,000"`), not
non-ASCII digits (`"１２"`), not whitespace inside the numeral (`"- 5"`), and not empty or
all-whitespace text.

- **Integer or decimal**: a numeral with no `.`, `e`, or `E` whose value fits the integer range is
  an integer; every other numeral is a decimal — `"5.0"`, `"1e3"`, `"9007199254740992"` (see
  [Number Representation](#number-representation)).
- **Rounding**: a decimal is the nearest double-precision value, so digits beyond its precision
  are rounded off and a magnitude too small to represent becomes `0` (`"1e-999"` → `0`).
- **Range**: a numeral too large to represent (`"1e999"`) is a runtime error — `TO_NUMBER` never
  produces infinity.

| Argument | Error |
|---|---|
| not a string | `TO_NUMBER() requires a string argument` |
| not a decimal numeral | `TO_NUMBER() cannot convert 'x' to number` |
| too large to represent | `TO_NUMBER() value out of range: 'x'` |

`x` is the argument exactly as given, surrounding whitespace included.

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
| `TRIM(s)` | Remove leading/trailing whitespace — the six ASCII characters defined [below](#whitespace) (spec v0.24.0). |
| `SUBSTRING(s, start, [length])` | Up to `length` characters of `s` from position `start` (1-based); omit `length` for the rest of `s`. `start` must be an integer of 1 or more and `length` an integer of 0 or more, or it is a runtime error (spec v0.34.0): `SUBSTRING("hello", 0, 3)` fails instead of guessing what was meant. Past the end there is just less: `SUBSTRING("hello", 4, 10)` → `"lo"`, `SUBSTRING("hello", 6)` → `""`. |
| `SPLIT(s, delimiter)` | Split `s` at every occurrence of the literal `delimiter` (not regex; occurrences are found left to right without overlap — `SPLIT("aaa", "aa")` → `["", "a"]`). **Every** field is kept — leading, interior, and trailing empty strings included — so `SPLIT(",a,,b,", ",")` → `["", "a", "", "b", ""]`, `SPLIT("", ",")` → `[""]`, and `JOIN(SPLIT(s, d), d) == s` always holds. An empty `delimiter` is a runtime error (spec v0.24.0) — use `CHARS` to split into characters. |
| `WORDS(s)` | Split `s` into its whitespace-separated words (spec v0.24.0): runs of [whitespace](#whitespace) separate words and leading/trailing whitespace is ignored, so no element is ever an empty string — `WORDS("    test 1  2")` → `["test", "1", "2"]`. Empty or all-whitespace `s` → `[]`. |
| `JOIN(arr, [separator])` | Join array elements into string. Default separator is `""`. |
| `CHARS(s)` | Split string into array of single characters |
| `CONTAINS(s, sub)` | Returns `true` if string `s` contains substring `sub`. Also accepts an array as the first argument — see [Array Functions](#array-functions). |
| `STARTS_WITH(s, prefix)` | Returns `true` if `s` starts with `prefix` |
| `ENDS_WITH(s, suffix)` | Returns `true` if `s` ends with `suffix` |
| `FIND(s, sub)` | Array of **all** 1-based positions where `sub` occurs in `s`, ascending, overlapping occurrences included — `FIND("aaa", "aa")` → `[1, 2]`; no occurrence → `[]`. Literal string match, not regex (spec v0.17.0). An empty `sub` is a runtime error. |
| `FIND_FIRST(s, sub)` | 1-based position of the first occurrence of `sub` in `s`, or `0` if absent (spec v0.17.0). Always equals the first element of `FIND(s, sub)`. Empty `sub` is a runtime error. |
| `FIND_LAST(s, sub)` | 1-based position of the last occurrence of `sub` in `s`, or `0` if absent (spec v0.17.0). Always equals the last element of `FIND(s, sub)`. Empty `sub` is a runtime error. |
| `MATCHES(s, pattern)` | Returns `true` if regex `pattern` matches anywhere in `s` |
| `REGEX_FIND(s, pattern)` | The first match of regex `pattern` in `s`, as a [match object](#regular-expressions) `{match, position, groups, named}`; `{}` if there is none (spec v0.29.0). |
| `REGEX_FIND_ALL(s, pattern)` | Every match of `pattern` in `s`, left to right and without overlap, as an array of match objects; `[]` if there is none (spec v0.29.0). |
| `REPLACE(s, target, replacement)` | Replace all occurrences of `target` with `replacement`. Literal string match (not regex). |
| `FORMAT(format, values...)` | A string made from `format`, each `{}` or `{pattern}` placeholder replaced by the next value — `FORMAT("{0.00} won", 3.4)` → `"3.40 won"` (spec v0.30.0; number patterns since v0.31.0). See [Formatted output](#formatted-output). |
| `TEXT(n, pattern)` | The number `n` written as the [number pattern](#number-patterns) draws it — `TEXT(1234.5, "#,##0.00")` → `"1,234.50"` (spec v0.31.0). |
| `ALIGN_LEFT(value, width)` | The value as `PRINT` shows it, padded with spaces on the right to `width` screen columns, a Hangul syllable taking two — `ALIGN_LEFT("ab", 4)` → `"ab  "` (spec v0.31.0). See [Aligning text](#aligning-text). |
| `ALIGN_RIGHT(value, width)` | Likewise, padded on the left — `ALIGN_RIGHT(42, 5)` → `"   42"` (spec v0.31.0). |
| `ALIGN_CENTER(value, width)` | Likewise, padded on both sides, an odd space on the right — `ALIGN_CENTER("ab", 5)` → `" ab  "` (spec v0.31.0). |

#### Whitespace

For `TRIM` and `WORDS`, whitespace is exactly six ASCII characters (spec v0.24.0): space
(U+0020), tab `\t` (U+0009), line feed `\n` (U+000A), vertical tab (U+000B), form feed (U+000C),
and carriage return `\r` (U+000D). No other character counts — not the no-break space U+00A0,
not the other control characters, not the other Unicode spaces, and not the byte-order mark
U+FEFF — so both functions behave identically in every runtime. `TO_NUMBER` ignores the same six
around a numeral (spec v0.25.0).

`SPLIT(s, " ")` and `WORDS(s)` answer different questions: `SPLIT` is lossless field splitting
(every empty field kept — what CSV-style data needs), while `WORDS` tokenizes text into words
(never an empty string).

#### Regular expressions

`MATCHES`, `REGEX_FIND` and `REGEX_FIND_ALL` take a regular expression. A pattern that is not
valid is a runtime error naming the pattern — `REGEX_FIND() invalid regex pattern: ([a-z]`; a
pattern that does not match is not an error.

`REGEX_FIND` and `REGEX_FIND_ALL` describe each match as a **match object** (spec v0.29.0), with
these four fields in this order:

| Field | Value |
|---|---|
| `match` | The text the whole pattern matched. |
| `position` | The 1-based position where `match` starts, counted as `LEN`, `SUBSTRING` and `FIND` count. An empty match at the end of `s` is at `LEN(s) + 1`. |
| `groups` | The capturing groups in order — `groups.N` is group N. A named group has a number too and appears here as well. A group that took no part in the match is `{}`; a pattern without groups gives `[]`. |
| `named` | The named groups `(?<name>…)` by name, in the order they appear in the pattern. A group that took no part in the match is `{}`; a pattern without named groups gives `{}`. |

```
m = REGEX_FIND("2024-01-15", "(?<year>[0-9]{4})-(?<month>[0-9]{2})")
PRINT(m.match, m.position)          // 2024-01 1
PRINT(m.groups.1, m.named.month)    // 2024 01
PRINT(REGEX_FIND("abc", "x") == {}) // true
```

`SUBSTRING(s, m.position, LEN(m.match)) == m.match` always holds, as does
`m.groups.N == m.named.name` when the group named `name` is group N.

`REGEX_FIND_ALL` searches `s` from the start; each further search begins where the previous match
ended, or one position later after an empty match. Matches therefore never overlap, and a pattern
that can match the empty string still comes to an end: `REGEX_FIND_ALL("aaa", "aa")` finds one
match — unlike the literal `FIND("aaa", "aa")`, which counts overlapping occurrences (`[1, 2]`) —
and `REGEX_FIND_ALL("baaac", "a*")` finds `""` at 1, `"aaa"` at 2, `""` at 5 and `""` at 6. `^`
matches only at the start of `s`, not where a later search begins. When there is a match,
`REGEX_FIND(s, p) == REGEX_FIND_ALL(s, p).1`.

```
loop m in REGEX_FIND_ALL("2026-10-22 2027-01-05", "(?<year>[0-9]{4})-(?<month>[0-9]{2})") do
    PRINT(m.position, m.named.year, m.named.month)
end
// 1 2026 10
// 12 2027 01
```

**Pattern syntax.** A pattern is read by the runtime's own regular-expression engine —
`java.util.regex` in the Java runtime, an ECMAScript `RegExp` without flags in the JavaScript
runtime. Character classes, quantifiers, groups, alternation, `^`, `$`, `\b`, lookahead and
lookbehind, named groups and the backreferences `\1` and `\k<name>` read the same in both. Name a
group with an ASCII letter followed by ASCII letters and digits, and use each name once: the Java
runtime rejects a name such as `first_name`, and a name used twice even in different
alternatives, both of which JavaScript accepts.

Positions and lengths count UTF-16 code units in both runtimes, as `LEN`, `SUBSTRING` and `FIND`
do, so an emoji counts as 2. **Characters outside the Basic Multilingual Plane** — most emoji,
some CJK extension characters — match differently: the Java runtime reads one as a single
character in `.`, `[^…]` and the like, while the JavaScript runtime reads each of its two halves
as a character. `REGEX_FIND("😀!", ".")` matches the whole emoji on Java (`LEN(m.match)` is 2) and
half of it on JavaScript (1), and `REGEX_FIND_ALL` can find a different number of matches. A
script that must behave the same in both should not apply `.` or a negated class to such text,
and should spell such characters out instead.

Other known differences: on Java `$` also matches just before a final line break, so
`REGEX_FIND("a\n", "a$")` matches only there; `a{` is a literal on JavaScript and an invalid
pattern on Java; the possessive `a++` and inline flags such as `(?i)` exist only on Java and are
invalid patterns on JavaScript; `\A` and `\Z` mark the start and end of input on Java but read as
the letters `A` and `Z` on JavaScript.

### Array Functions

| Function | Description |
|---|---|
| `PUSH(arr, values...)` | Returns new array with values appended. Original unchanged. |
| `POP(arr)` | Returns new array with last element removed. Original unchanged. |
| `CONCAT(arrs...)` | Returns new array concatenating all input arrays |
| `SLICE(arr, start, [count])` | Returns a sub-array of up to `count` elements starting at `start` (1-based); omit `count` for the rest of the array. Same start+count convention as `SUBSTRING` and `READ_LINES`: `start` must be an integer of 1 or more and `count` an integer of 0 or more (spec v0.34.0), and past the end there are just fewer elements. |
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
| `JSON_PARSE(s)` | Parse JSON string. Returns Result: `ok` with parsed value, `error` on invalid JSON ([JSON text](#json-text)) or on a numeral too large to represent ([below](#numbers-json-cannot-hold), spec v0.35.0). JSON `null` is preserved as `null` (was normalized to `{}` until spec v0.7.0). |
| `JSON_FORMAT(v)` | Convert any value to JSON string. `null` serializes as `null`, so `JSON_PARSE`/`JSON_FORMAT` round-trip losslessly. A value holding `Infinity`, `-Infinity` or `NaN` is a runtime error (spec v0.32.0); see [below](#numbers-json-cannot-hold). |

#### JSON text

`JSON_PARSE` and `READ_JSON_FILE` read JSON as RFC 8259 defines it, and anything else is invalid
JSON (spec v0.35.0):

- A number is an optional `-`, then `0` or digits that do not start with `0`, then an optional
  fraction (`.` and at least one digit) and an optional exponent (`e` or `E`, an optional sign, at
  least one digit). `01`, `.5`, `1.`, `+1` and `1e` are not numbers, and neither are `Infinity`
  and `NaN`.
- Whitespace between tokens is space, tab, line feed and carriage return only. (`READ_JSON_FILE`
  also ignores a leading UTF-8 BOM.)
- A string holds no raw control character (U+0000–U+001F); it is written as an escape such as `\t`
  or `\u0009`. `\u` takes exactly four hex digits.
- Nesting is at most 1000 levels deep. One level more fails with
  `Invalid JSON: nested more than 1000 levels deep at position 1000`, where the position is that of
  the bracket that goes too deep, counted from 0 as JSON readers count.

Invalid JSON gives an error Result whose message starts with `Invalid JSON: `. Apart from the
nesting message, the rest is the runtime's own wording and differs between runtimes.

#### Numbers JSON cannot hold

JSON has no way to write `Infinity`, `-Infinity` or `NaN`, which decimal arithmetic past the range
of numbers produces. Turning a value that holds one into JSON is therefore a runtime error
(spec v0.32.0), wherever it happens: in `JSON_FORMAT`, in `WRITE_JSON_FILE`, which then writes
nothing, and in an HTTP request body that is not a string, which is then not sent. The error names
the first such number, in the order the JSON would be written, and where it is:

```
data = {"rows": [{"rate": 0.5}, {"rate": TO_NUMBER("1e308") * 10}]}
PRINT(JSON_FORMAT(data))
// Runtime Error: JSON_FORMAT() value.rows.2.rate is Infinity, which JSON cannot represent
```

- The place starts at `value` (`body` for an HTTP request body) and goes down one member at a
  time, the way a script reaches it: `value.rows.2.rate` is `data.rows.2.rate`. Array positions
  count from 1.
- A key that is a plain name — an ASCII letter or `_`, then ASCII letters, digits or `_` — is
  written as it is. Any other key is written in double quotes, as JSON writes a string:
  `value."unit price"`, `value."2"`, `value."합계"`.
- A value without such a number is written exactly as before. `PRINT`, `FORMAT` and `TEXT` still
  show the three as `Infinity`, `-Infinity` and `NaN`, so a script that wants to keep one in JSON
  can store the number as text: `TO_STRING(x)` is `"Infinity"`.

Reading meets the same gap from the other side. A numeral too large to represent, such as `1e999`,
is valid JSON, but no number can hold it, so `JSON_PARSE` and `READ_JSON_FILE` return an error
Result naming the first one and where it is, the place written as above (spec v0.35.0):

```
res = JSON_PARSE("{\"rows\": [{\"size\": 1}, {\"size\": 1e999}]}")
PRINT(res.ok, res.value)
// false JSON_PARSE() value.rows.2.size is a number too large to represent
```

A numeral too small to represent, such as `1e-999`, reads as `0`, and an integer numeral outside
the integer range as the nearest decimal, as with `TO_NUMBER`.

### File I/O

| Function | Description |
|---|---|
| `FILE_EXISTS(path)` | Returns `true` if file or directory exists. |
| `FILE_INFO(path)` | Returns Result: `ok` with `{type, size, modified}` — `size` in bytes and `modified` in epoch milliseconds, both integers — `error` if not found. |
| `READ_LINES(path, [start], [count])` | Read lines from file. `start` is 1-based (default 1). `count` limits lines read. Returns Result with string array. To go through a whole file line by line, `FILE_LINES` is simpler. |
| `FILE_LINES(path)` | The file's lines as an array of strings (spec v0.26.0) — a plain array, not a Result: a file that cannot be read is a runtime error. The file is read as the array is used, so a file of any size can be gone through with a loop; see [Going through a file line by line](#going-through-a-file-line-by-line). |
| `READ_FILE(path)` | Read the whole file as one string (spec v0.18.0). Returns Result: `ok` with the file content (UTF-8, content-exact), `error` on a read failure. The counterpart of `WRITE_FILE`; for large files use `FILE_LINES`. |
| `READ_JSON_FILE(path)` | Read a JSON file and parse it in one call (spec v0.18.0). Returns Result: `ok` with the parsed value (object, array, or scalar — same conversion as `JSON_PARSE`), `error` on a read failure, invalid JSON, or a numeral too large to represent (`READ_JSON_FILE() value.size is a number too large to represent`, spec v0.35.0). A leading UTF-8 BOM is ignored. Replaces the `READ_LINES` + `JOIN` + `JSON_PARSE` idiom. |
| `WRITE_FILE(path, content)` | Write string to file (overwrite). Returns Result. |
| `WRITE_LINES(path, lines)` | Write array of strings as lines (each followed by newline). Returns Result. |
| `WRITE_JSON_FILE(path, value)` | Serialize `value` as JSON — the same output as `JSON_FORMAT` — and write it to the file with a trailing newline, overwriting (spec v0.18.0). Returns Result: `ok` with `{}`. The counterpart of `READ_JSON_FILE`: the round-trip is lossless, first-class `null` included. A value holding `Infinity`, `-Infinity` or `NaN` is a runtime error, and nothing is written ([Numbers JSON cannot hold](#numbers-json-cannot-hold), spec v0.32.0). |
| `APPEND_FILE(path, content)` | Append string to file. Returns Result. |
| `MKDIR(path)` | Create directory (including parents). Returns Result. |
| `LIST_DIR(path, [pattern])` | List directory entries. Returns Result with array of `{name, type, size}` objects, sorted by name. `type` is `"dir"`, `"file"` or `"link"`; `pattern` keeps only the entries whose names match it, like `"*.csv"` (spec v0.27.0). See [Listing a directory](#listing-a-directory). |
| `LIST_DIR_NAMES(path, [pattern])` | Each entry's name and its own type, as an array of `{name, type}` objects sorted by name (spec v0.28.0; the names alone in v0.27.0). Returns Result. Links are not followed — every link is `"link"` — so it is much faster than `LIST_DIR` on a large directory or one full of links. See [Listing a directory](#listing-a-directory). |
| `DELETE_FILE(path)` | Delete a single file. Directories are rejected. Returns Result. |

```
// Write and read lines
WRITE_LINES("/data/output.csv", ["name,age", "Alice,30", "Bob,25"])
res = READ_LINES("/data/output.csv", 2, 1)    // skip header, read 1 line
PRINT(res.value.1)                              // "Alice,30"

// Going through a large file: FILE_LINES reads it as the loop advances
loop line in FILE_LINES("/data/big.log") infinite do
    if CONTAINS(line, "ERROR") then
        PRINT(line)
    end
end

// Directory operations
MKDIR("/data/reports/2024")
res = LIST_DIR("/data/reports")
loop entry in res.value do
    PRINT(entry.name, entry.type)
end

// Only the CSV files, without following links
loop entry in UNWRAP(LIST_DIR_NAMES("/data/reports", "*.csv")) do
    PRINT(entry.name, entry.type)
end
```

#### Going through a file line by line

`FILE_LINES(path)` returns the lines of a file as an ordinary array of strings — the array
`UNWRAP(READ_LINES(path))` would give, with two differences: a file that cannot be read is a
runtime error rather than an error Result, and a leading UTF-8 byte-order mark is dropped.

```
lines = FILE_LINES("/data/users.csv")
PRINT(LEN(lines), lines.1)
loop n, line in lines infinite do
    if n == 1 then continue end        // the header
    PRINT(n, line)
end
```

What sets it apart is *when* the file is read: not at the call, but as the array is used, and only
as far as the use needs. A loop over the array reads the file a piece at a time and keeps only the
current line, and `LEN` counts the lines without keeping any, so a file of any size can be gone
through with a loop — this is the way to process a large file. Copying the array (assignment,
arguments, return values, thread snapshots) copies nothing from the file.

Using the array **as a whole** — an element (`lines.3`), `SLICE`, `SORT`, `JOIN`, `PRINT`,
`JSON_FORMAT`, `==`, assigning an element, passing it to an external function, returning it as the
script's result — reads the whole file into memory first. For a file larger than the host's
whole-use limit (64 MB by default) that is a runtime error: `FILE_LINES() '/data/big.log' is too
large to use as a whole (494 MB, the limit is 64 MB) — go through it with a loop: loop line in ...
do`. Below the limit the array behaves exactly like any other array.

The array is the file **as it was at the call**:

- Lines appended to the file afterwards are not part of it — a loop never sees them, so a file
  that is still being written to (a live log) can be read safely, and appending to the file being
  looped over does not prolong the loop.
- A file that has otherwise changed — truncated, rewritten, replaced, deleted — when the runtime
  comes to read it fails that read with a runtime error (`FILE_LINES() cannot read '...': it was
  modified after FILE_LINES() was called — call FILE_LINES() again`; `truncated`, `rewritten` or
  `deleted` when the runtime can tell) rather than yielding mixed content. The runtime compares the
  file's size, modification time and a sample of its content with what it saw at the call, so a
  change that leaves all of these the same goes unnoticed.
- Writes to the same file by another thread of a `multi` block are not synchronized with reads,
  as for every file built-in.

Other rules:

- Lines end at `\n`, `\r\n` or `\r`; the terminator is not part of the line. A final line without
  a terminator still counts; a trailing terminator does not add an empty line. An empty file has
  no lines.
- A file that does not exist, is a directory, or cannot be opened is a runtime error at the call
  (`FILE_LINES() cannot read '/data/users.csv': no such file`). Invalid UTF-8 and a line longer
  than the host's line limit (16 MB by default) are runtime errors raised when that line is
  reached — a loop has by then processed the lines before it.
- Reading the file suspends the calling thread like the other file built-ins ([Blocking and
  Suspension](#blocking-and-suspension)); a `multi` worker looping over a file does not stall its
  siblings.
- The loop-iteration cap applies as to any array: more than 1000 lines need `infinite`.

#### Listing a directory

`LIST_DIR(path)` lists every entry of the directory except `.` and `..` — names that start with a
dot included — sorted by name, each as `{name, type, size}`:

- `type` is `"dir"` for a directory and `"file"` for anything else.
- A symbolic link is followed: a link to a file is listed as `"file"` with the size of the file it
  points to, a link to a directory as `"dir"`. A link that cannot be followed — what it points to
  does not exist or cannot be accessed, or links point at each other — is listed with type
  `"link"` instead of failing the call, so one broken link does not hide the rest of the
  directory (spec v0.27.0).
- `size` is the file's size in bytes, and `0` for a `"dir"` or a `"link"`.
- An entry removed while the directory is being read is left out.
- A `path` that does not exist, is not a directory, or cannot be read gives an error Result whose
  message names the reason and the path, such as `No such file or directory: /data/in`.

`LIST_DIR_NAMES(path)` lists the same entries, sorted by name, each as `{name, type}` — without
following links (spec v0.28.0):

- `type` is the entry's own: `"dir"` for a directory, `"link"` for a symbolic link, and `"file"`
  for anything else. Every link is `"link"`, whether it points to a file, a directory or nothing —
  unlike `LIST_DIR`, where `"link"` marks only a link that cannot be followed.
- What a link points to is never looked at, and there is no `size`. Following each link is what
  makes `LIST_DIR` slow on a directory of many links to files elsewhere, so there
  `LIST_DIR_NAMES` is much faster. Use it when names and types are enough.
- As with `LIST_DIR`, an entry removed while the directory is being read is left out, and a
  `path` that cannot be listed gives an error Result — as does a directory whose entries cannot
  be examined, such as one with read but not execute permission.

Both take an optional `pattern`: a glob matched against each entry's name, keeping only the
entries that match.

| Pattern | Matches |
|---|---|
| `*` | any run of characters, including none and a leading `.` |
| `?` | exactly one character |
| `[abc]`, `[a-z]` | one character of the set or range |
| `[!abc]` | one character not in the set |
| `{csv,txt}` | one of the comma-separated alternatives |
| `\` | makes the next character literal: `"\\[x].csv"` matches the name `[x].csv` |

```
csvs = UNWRAP(LIST_DIR_NAMES("/data/in", "*.csv"))
logs = UNWRAP(LIST_DIR("/data/logs", "app-2024-0?.{log,txt}"))
```

Matching is case-sensitive, except on Windows, where it ignores case as the file system does. The
pattern is matched against names only — the directory listed is always `path` — so a pattern that
is empty or contains `/` is an error Result, as is one that is not well formed (an unclosed `[` or
`{`). A pattern that matches nothing gives an empty array.

### Timing

| Function | Description |
|---|---|
| `SLEEP(ms)` | Pause current thread for `ms` milliseconds |
| `MILTIME()` | Current time as epoch milliseconds (an integer) |
| `DATE()` | Current date as `"YYYY-MM-DD"` string |
| `TIME()` | Current time of day as `"HH:MM:SS"` string |

### Shell

| Function | Description |
|---|---|
| `SHELL(cmd)` | Execute a shell command. Returns Result: `ok` with stdout on exit 0, `error` with output on non-zero exit. |
| `SHELL(ctx, cmd)` | Execute a shell command using a context from `SHELL_CTX()`. Pass the Result directly — `SHELL` auto-unwraps it. |
| `SHELL_CTX(cwd)` | Create a shell context with working directory `cwd`. Returns Result: `ok` with context object, `error` if directory doesn't exist. |
| `SHELL_CTX(cwd, env)` | Create a shell context with working directory and environment variables. `env` is an object of key-value pairs. |

SHELL output capture is bounded by the host/runtime. When that bound is exceeded, the oldest
captured bytes may be omitted and the returned Result contains the newest retained suffix. A
script that needs complete large output should redirect the command to a file (or use a
host-provided streaming facility) and read it explicitly. The monitor's `shell.output` is only a
one-line progress tail and is never a complete-output contract.

Each `SHELL()` call creates a fresh process via `/bin/sh -c <cmd>`. There are no persistent sessions. The context from `SHELL_CTX()` is just a configuration object — it doesn't hold any process state. When passing a context to `SHELL()`, pass the Result from `SHELL_CTX()` directly — `SHELL` auto-unwraps the Result to extract the context.

### HTTP

| Function | Description |
|---|---|
| `HTTP_GET(url, [options])` | HTTP GET. Returns Result (see below). |
| `HTTP_POST(url, body, [options])` | HTTP POST with a string `body`. Returns Result. |
| `HTTP(method, url, [options])` | General request for any method (PUT/DELETE/PATCH/...). `options.body` carries the request body. |

`options` is an object: `{"headers": {"Key": "Value", ...}, "timeout": <ms>, "body": <for HTTP()>}` — all optional. (`"header"` is also accepted for `"headers"`.)

**Request body.** A string body is sent as-is; any other value (object/array/number/boolean) is serialized as JSON. So `HTTP_POST(url, {"a": 1})` sends `{"a":1}` (not the bare `a=1` form). Set `"Content-Type": "application/json"` in `headers` if the server requires it. A body holding `Infinity`, `-Infinity` or `NaN` is a runtime error, and the request is not sent ([Numbers JSON cannot hold](#numbers-json-cannot-hold), spec v0.32.0).

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

**Genuine Results.** Result objects created by the runtime — Result-returning built-ins (`JSON_PARSE`, `SHELL`/`SHELL_CTX`, `HTTP`/`HTTP_GET`/`HTTP_POST`, the file-I/O group — all but `FILE_EXISTS`, which returns a plain boolean, and `FILE_LINES`, which returns a plain array), external function calls (sync and async, including timeout errors), and `multi` thread collection entries — and by the `OK`/`ERR` constructors are *genuine Results*: the runtime remembers their origin. A script object literal with the same three fields is a plain object, **not** a genuine Result.

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

Both built-in and external functions can be ignored. The check applies to normal function calls and to function calls inside multi block `thread` spawns. Each name is blocked on its own: ignoring `PRINT` leaves `PRINTF` available, so a host that wants no script output ignores both.

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

To round a value to a number of decimal places, use `ROUND(x, 2)` and its kin
([Rounding to digits](#rounding-to-digits)); to show a fixed number of decimals, trailing zeros
included, use `TEXT(x, "0.00")` ([Number patterns](#number-patterns)).

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
| A `RANDOM` bound that is not an integer within the integer range | RANDOM() bounds must be integers within ±9,007,199,254,740,991 |
| `RANDOM` with `min` greater than `max` | RANDOM() min cannot be greater than max |
| Division by zero | Division by zero |
| Missing property | Property 'x' does not exist |
| Array out of bounds | Array index out of bounds |
| Array index that is not an integer | Array index must be an integer |
| String index out of bounds, or not an integer | String index out of bounds, String index must be an integer |
| A `SUBSTRING`/`SLICE` start that is not an integer of 1 or more | SUBSTRING() start must be an integer of 1 or more |
| A `SUBSTRING` length or `SLICE` count that is not an integer of 0 or more | SUBSTRING() length must be an integer of 0 or more (SLICE() count must be …) |
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
| Integer literal too large | Integer literal out of range: 9007199254740992 is larger than 9,007,199,254,740,991 |
| Integer arithmetic overflow (`+` `-` `*`, `FLOOR`/`CEIL`/`ROUND`/`TRUNC` without digits, `SUM`) | Integer overflow: the result is outside ±9,007,199,254,740,991 |
| `SUM`/`MAX`/`MIN`/`ABS`/`ROUND`/`FLOOR`/`CEIL`/`TRUNC` given a value that is not a number | SUM() requires numeric arguments |
| `digits` that is not an integer | ROUND() digits must be an integer |
| A third argument to `ROUND`/`FLOOR`/`CEIL`/`TRUNC` | ROUND() takes at most 2 arguments |
| A `FORMAT`/`PRINTF` format that is not valid | FORMAT() invalid format: {:.2f} |
| `FORMAT`/`PRINTF` placeholders and values that do not match in number | FORMAT() format has 2 placeholders, got 3 values |
| A `TEXT` pattern that is not a number pattern | TEXT() invalid pattern: '0.0.0' |
| An `ALIGN_LEFT`/`ALIGN_RIGHT`/`ALIGN_CENTER` width that is not an integer from 0 to 999 | ALIGN_LEFT() width must be an integer from 0 to 999 |
| `TO_NUMBER` of text that is not a decimal numeral | TO_NUMBER() cannot convert 'x' to number |
| `TO_NUMBER` of a numeral too large to represent | TO_NUMBER() value out of range: 'x' |
| `JSON_FORMAT`, `WRITE_JSON_FILE` or an HTTP request body given a value holding `Infinity`, `-Infinity` or `NaN` | JSON_FORMAT() value.rows.2.rate is Infinity, which JSON cannot represent |
| `FILE_LINES` of a file that cannot be read | FILE_LINES() cannot read 'x': no such file |
| `FILE_LINES` array used as a whole beyond the host's limit | FILE_LINES() 'x' is too large to use as a whole (494 MB, the limit is 64 MB) — go through it with a loop: loop line in ... do |
| `FILE_LINES` array read after its file changed | FILE_LINES() cannot read 'x': it was modified after FILE_LINES() was called — call FILE_LINES() again |
| Blocked construct present (hidden keyword / ignored function, anywhere) | 'X' is not available in this environment |

### Resource Limits

The loop-iteration cap is part of the language (default 1000, host-configurable, `infinite` opts
out — see [Infinite Loops](#infinite-loops)). Other resource limits — recursion depth, memory —
are **host/runtime discretion**: exhausting them fails the run, but the exact error surface is
implementation-defined. Scripts should not rely on any particular recursion depth. The `FILE_LINES`
whole-use limit (64 MB) and line-length limit (16 MB) are likewise host-configurable defaults
([Going through a file line by line](#going-through-a-file-line-by-line)). JSON text is read to a
fixed depth of 1000 levels in every runtime ([JSON text](#json-text)).

---

## Changelog

### v0.35.0 — `JSON_PARSE` refuses numbers too large to represent

Mildly breaking, no grammar change. `1e999` is valid JSON, but no number can hold it, and
`JSON_PARSE` and `READ_JSON_FILE` read it as `Infinity`. It came through without a word and showed
itself later, far from where it came in: arithmetic gave `Infinity` or `NaN`, `FLOOR` reported an
integer overflow, and writing the data back as JSON failed (spec v0.32.0). `TO_NUMBER` has refused
such a numeral since v0.25.0.

- `JSON_PARSE` and `READ_JSON_FILE` return an error Result for a numeral too large to represent,
  naming the first one and where it is, as the JSON writers do:
  `JSON_PARSE() value.rows.2.size is a number too large to represent`. A numeral too small to
  represent still reads as `0`.
- The text must be JSON as RFC 8259 defines it ([JSON text](#json-text)). The JavaScript runtime
  already read it so. The Java 25 runtime also took `01`, `.5`, `1.` and `1.e5`, Unicode spaces
  between tokens, raw control characters in a string and `\u+041`; and a malformed number such as
  `1e` or `[1, 2e]`, a malformed `\u` escape, or very deep nesting ended the whole run with a Java
  exception instead of giving an error Result.
- Nesting is at most 1000 levels deep in both runtimes:
  `Invalid JSON: nested more than 1000 levels deep at position 1000`. Before, the Java 25 runtime
  overflowed its stack and the JavaScript runtime gave its own error, each at a depth that depended
  on the machine.
- The command-line runtimes refuse such a numeral in `-p` properties too, as TeeBox already refused
  it in run input.
- The loop-limit error suggests `Use 'loop ... infinite do'` for every loop in both runtimes. The
  Java 25 runtime suggested `loop condition infinite do` for every loop, which reads wrong for a loop
  over an array or object, and the JavaScript runtime did for a condition loop.

Migration: a script that read such a numeral got `Infinity`; it now gets an error Result, which the
`res.ok` check or `UNWRAP` it has for invalid JSON already handles. JSON that only the Java 25
runtime accepted has to be made valid JSON.

The Java 25 runtime and the JavaScript runtime implement this; the frozen Java 7/8 runtime does not.

### v0.34.0 — Positions must be integers in range

Breaking, no grammar change. A position that could not be meant was quietly turned into one that
could, and the two runtimes did not even agree on which: `SUBSTRING("hello", 0, 3)` and
`SUBSTRING("hello", -1, 3)` gave `"hel"` in the Java 25 runtime and `"he"` and `"h"` in the
JavaScript runtime, and an array index of `1.5` read the first element in one and `null` in the
other. A mistake in working out a position went unnoticed. Now it stops the script where it happens,
as `nums.0` and `READ_LINES(path, 0)` already did.

- `SUBSTRING(s, start, [length])` and `SLICE(arr, start, [count])`: `start` must be an integer of 1
  or more, and `length` or `count` an integer of 0 or more; a whole decimal such as `2.0` will do.
  The errors are `SUBSTRING() start must be an integer of 1 or more` and
  `SUBSTRING() length must be an integer of 0 or more`, and the same for `SLICE()` with `count`.
  Past the end is still fine and gives less: `SUBSTRING(s, p + 1)` is `""` when `p` is the last
  position, and `SUBSTRING(name, 1, 20)` keeps a short name whole. A negative `length` gave `""` in
  the Java 25 runtime and, in the JavaScript runtime, the characters before `start`.
- An array or string index must be an integer, when reading and when assigning: `nums.$i` with
  `i = 1.5` fails with `Array index must be an integer`, where the Java 25 runtime cut it to `1` and
  the JavaScript runtime read `null` and ignored an assignment. A string gives
  `String index must be an integer`.
- A string index error says `String index …` in both runtimes; the Java 25 runtime said
  `Array index out of bounds` and `Array index must be a number` for a string too. The JavaScript
  runtime's `must be a number` errors drop the hint the Java 25 runtime did not give
  (`, got string. Use arr.1 not arr."1"`).

Migration: a script that gave a start below 1, a negative length or count, or a fractional position
now stops at that line with one of these errors. Give the start that was meant — `1`, or
`MAX(1, start)` where a calculation can go below it, which is what the Java 25 runtime did — and
make a fraction whole with `FLOOR`, `ROUND` or `TRUNC` where one can arise. Code that matched the
old index error text exactly needs the new wording.

Fixed in both runtimes too, with no rule change: `RANDOM(min, max)` scaled a random decimal, so over
a span past 2⁵³ it skipped integers — `RANDOM(-9007199254740991, 9007199254740991)` gave only odd
numbers. Every integer from `min` to `max` now comes up equally often.

The Java 25 runtime and the JavaScript runtime implement this; the frozen Java 7/8 runtime does not.

### v0.33.0 — Integers up to 9,007,199,254,740,991

Mildly breaking, no grammar change. Since v0.13.0 integers were 32-bit, ±2,147,483,647 — too small
for everyday sizes. Two files of 1.5 GB added up to an `Integer overflow`, so did
`2 * 1024 * 1024 * 1024`, and 1 TiB could not be written at all. A script had to start a total at
`0.0` instead of `0`, which people who are not programmers have no reason to know. Now integers run
to ±9,007,199,254,740,991 (2⁵³ − 1): the largest range in which every integer is exact as a decimal
too, and the one JSON readers agree on. See
[The integer range](#the-integer-range-spec-v0130-widened-in-v0330).

- Literals, `+`, `-`, `*`, `SUM`, and `FLOOR`/`CEIL`/`ROUND`/`TRUNC` without digits follow the new
  range. The range is symmetric, so unary minus and `ABS` can no longer overflow. `SUM` checks its
  running total, as `+` does.
- The errors say where the limit is: `Integer overflow: the result is outside
  ±9,007,199,254,740,991`, and `Integer literal out of range: 9007199254740992 is larger than
  9,007,199,254,740,991`. They were `Integer overflow` and `Integer literal out of range: …`.
- `MILTIME()`, `FILE_INFO`'s `size` and `modified`, `LIST_DIR`'s `size`, and `JSON_PARSE` and
  `TO_NUMBER` of integer text give integers inside the range, where they gave decimals past 32 bits.
- `RANDOM(min, max)` takes integer bounds anywhere in the range; the Java 25 runtime cut a bound past
  32 bits to 2,147,483,647. A bound that is not an integer in the range now fails
  (`RANDOM() bounds must be integers within ±9,007,199,254,740,991`): the Java 25 runtime cut a
  fraction toward zero, so `RANDOM(1.2, 1.5)` gave `1`, and the JavaScript runtime returned a
  decimal. So does `min` greater than `max` (`RANDOM() min cannot be greater than max`), where the
  Java 25 runtime returned a number outside the bounds.
- `SUBSTRING` and `SLICE` positions past 32 bits clamp like any other position past the end; the
  Java 25 runtime wrapped them around and returned nothing.

Migration: a script that stopped at an overflow between 2³¹ and 2⁵³ now runs on. A value that was a
decimal past 32 bits — `MILTIME()`, a file size over 2 GiB, a JSON integer over 2,147,483,647 — is
now an integer, so arithmetic on it is checked against the new range: `MILTIME() * 1000000`
(nanoseconds) is now an overflow, and `MILTIME() * 1000000.0` computes it as a decimal. Code that
matched the old error text exactly needs the new wording. A total started at `0.0` keeps working.

The Java 25 runtime and the JavaScript runtime implement this; the frozen Java 7/8 runtime does not.
The JavaScript runtime still treats a whole decimal such as `1000000.0` as an integer
([Integer vs decimal is nominal](#integer-vs-decimal-is-nominal-spec-v0140)), so past the range it
reports an overflow where the Java 25 runtime computes a decimal.

### v0.32.0 — JSON has no `Infinity` or `NaN`

Mildly breaking, no grammar change. Decimal arithmetic past the range of numbers gives `Infinity`
or `-Infinity`, and `Infinity - Infinity` gives `NaN`, but JSON has no way to write them. Until now
each runtime wrote them its own way, and neither wrote JSON:

- The Java 25 runtime wrote the tokens `Infinity`, `-Infinity` and `NaN`, which JSON readers
  reject. `READ_JSON_FILE` rejected them too, so a file `WRITE_JSON_FILE` had just written could
  not be read back.
- The JavaScript runtime wrote `null`. That turned a number into a different value without a word,
  although the language never produces `null` on its own ([no implicit null](#values-and-types)).

Now `JSON_FORMAT`, `WRITE_JSON_FILE` and an HTTP request body that is not a string fail with a
runtime error that names the first such number and where it is:
`JSON_FORMAT() value.rows.2.rate is Infinity, which JSON cannot represent`. `WRITE_JSON_FILE` writes
nothing, and the HTTP request is not sent. See [Numbers JSON cannot hold](#numbers-json-cannot-hold).

Migration: a script that wrote such a value now stops at that point instead of producing text that
is not JSON. The error says where the number is, so its source can be fixed; to keep the number,
store it as text with `TO_STRING`. Every value without one is written exactly as before.

The Java 25 runtime and the JavaScript runtime implement this; the frozen Java 7/8 runtime does not.

### v0.31.0 — Number patterns, `TEXT`, and `ALIGN_LEFT`/`ALIGN_RIGHT`/`ALIGN_CENTER`

Breaking for `FORMAT` and `PRINTF` placeholders; four new built-ins; no grammar change. The
v0.30.0 placeholders came from Python's format specification — `{:>10,.2f}` — whose symbols have to
be learned before they can be read. That does not suit a language meant to be read by people who
are not programmers.

- **Number patterns** replace `{:spec}`: a placeholder holds a picture of the number drawn with the
  symbols of a spreadsheet's number format — `{0.00}`, `{#,##0}`, `{000}`, `{0.0%}`. See
  [Number patterns](#number-patterns).
- **`TEXT(n, pattern)`** writes one number as a pattern draws it, as Excel's `TEXT` does:
  `TEXT(1234.5, "#,##0.00")` → `"1,234.50"`.
- **`ALIGN_LEFT`, `ALIGN_RIGHT` and `ALIGN_CENTER(value, width)`** pad a value with spaces to a
  width counted in screen columns — a Hangul syllable takes two — and take over the alignment and
  width of the v0.30.0 placeholders. See [Aligning text](#aligning-text).
- `{}`, `{{` and `}}`, the names and arguments of `FORMAT` and `PRINTF`, and the rounding functions
  are unchanged. A host external named `TEXT` or `ALIGN_LEFT`, `ALIGN_RIGHT`, `ALIGN_CENTER`
  replaces the new built-in, as for any catalog name.

Migration: a v0.30.0 placeholder with a spec is now the error `FORMAT() invalid format: {:.2f}`,
so no script changes its output silently.

| v0.30.0 | v0.31.0 |
|---|---|
| `{:.2f}` | `{0.00}` |
| `{:,}` | `{#,##0}` — a pattern sets the decimals: `{#,##0.##}` keeps up to two |
| `{:,.2f}` | `{#,##0.00}` |
| `{:05}` | `{00000}` for an integer — the zeros count digits, not the sign; a pattern also sets the decimals |
| `{:10}` | `ALIGN_RIGHT(value, 10)` for a number, `ALIGN_LEFT(value, 10)` for anything else — v0.30.0's defaults |
| `{:>10}`, `{:<10}`, `{:^10}` | `ALIGN_RIGHT(value, 10)`, `ALIGN_LEFT(value, 10)`, `ALIGN_CENTER(value, 10)` |
| `{:>10.2f}` | `ALIGN_RIGHT(TEXT(value, "0.00"), 10)` |

The width of `ALIGN_*` counts screen columns, where v0.30.0 counted UTF-16 code units, so text with
Hangul or other wide characters gets fewer spaces: `FORMAT("{:>6}", "사과")` was `"    사과"`, and
`ALIGN_RIGHT("사과", 6)` is `"  사과"`.

The Java 25 runtime and the JavaScript runtime implement this; the frozen Java 7/8 runtime does not.

### v0.30.0 — Rounding to digits, `TRUNC`, and formatted output

Breaking for `ROUND` of a negative tie; three new built-ins; no grammar change. There was no way
to keep a number of decimal places: `ROUND(3.48, 1)` silently dropped its second argument and
returned `3`, rounding by multiplying went wrong (`FLOOR(0.29 * 100) / 100` is `0.28`), nothing
rounded toward zero, and trailing zeros could not be shown.

- **`ROUND`, `FLOOR` and `CEIL(n, [digits])`** take the number of decimal places to keep, and the
  new **`TRUNC(n, [digits])`** rounds toward zero. They round the digits `PRINT` shows, so
  `FLOOR(0.29, 2)` is `0.29` in every runtime. With `digits` the result is a decimal, and a third
  argument is an error. See [Rounding to digits](#rounding-to-digits).
- **`ROUND` sends a tie away from zero**, with or without `digits`: `ROUND(-2.5)` is `-3`, where
  it was `-2`, so `ROUND(-x)` is `-ROUND(x)`. Positive numbers round as before.
- **`FORMAT(format, values...)`** builds a string from `{}` and `{:spec}` placeholders — alignment,
  width, zero padding, thousands separators and a fixed number of decimals (`{:.2f}`) — and
  **`PRINTF(format, values...)`** prints it as one line. See [Formatted output](#formatted-output).
  `PRINT` itself is unchanged: reading its first argument as a format would silently change what
  `PRINT("{}", x)` prints today. (v0.31.0 replaced the `{:spec}` placeholders with number
  patterns.)
- `PRINTF` is an interpreter-dispatched name, like `PRINT`, so registering a host external under
  it is now a host-API error. A host external named `TRUNC` or `FORMAT` replaces the new built-in,
  as for any catalog name. A host that ignores `PRINT` to keep scripts quiet must ignore `PRINTF`
  too.
- The JavaScript runtime's `SUM`, `MAX`, `MIN`, `ABS`, `FLOOR`, `CEIL` and `ROUND` check their
  arguments as the Java runtime always has: `SUM("a", 1)` is the error
  `SUM() requires numeric arguments` instead of `"0a1"`, and `ROUND()` is
  `ROUND() missing argument 1` instead of `NaN`.

Migration: only `ROUND` of a negative number exactly halfway between two integers changes —
`ROUND(-0.5)`, `ROUND(-1.5)`, `ROUND(-2.5)` are now `-1`, `-2`, `-3` — and it changes without an
error, so check scripts that round negative numbers. A script that passed a second argument to
`ROUND`, `FLOOR` or `CEIL` was getting a whole number; it now gets that many decimal places. The
Java 25 runtime and the JavaScript runtime implement this; the frozen Java 7/8 runtime does not.

### v0.29.0 — Regular-expression matches as objects, and `REGEX_FIND_ALL`

Breaking for `REGEX_FIND`; one new built-in; no grammar change. `REGEX_FIND` returned
`[fullMatch, group1, …]`, so in a language that counts from 1, group 1 was `.2`. It gave only the
first match, without its position, and named groups lost their names.

- **`REGEX_FIND(s, pattern)`** returns the first match as a match object —
  `{match, position, groups, named}`: `groups.N` is group N and `named` holds the named groups by
  name — or `{}` when there is no match.
- **`REGEX_FIND_ALL(s, pattern)`** returns every match, left to right and without overlap, as an
  array of match objects (`[]` when there is none).
- A new [Regular expressions](#regular-expressions) section pins the match object, the search
  order and empty matches. It also documents where the two runtimes' pattern engines differ —
  characters outside the Basic Multilingual Plane among them — without changing either.
- `MATCHES`, `REGEX_FIND` and `REGEX_FIND_ALL` report the same errors in both runtimes:
  `REGEX_FIND() requires a string argument` and `REGEX_FIND() invalid regex pattern: <pattern>`.

Migration: `res.1` becomes `res.match`, and a group — `res.2`, `res.3`, … — becomes
`res.groups.1`, `res.groups.2`, … (or `res.named.name`). Those old accesses fail with
`Property '1' does not exist` and the like, but three uses do not fail: `loop v in res` now goes
over the four fields, `"…" + res` joins the object's text, and `LEN(res)` is 4. `res == {}` still
tests for no match. The Java 25 runtime and the JavaScript runtime implement this; the frozen
Java 7/8 runtime does not.

### v0.28.0 — `LIST_DIR_NAMES` gives each entry's type

Breaking for `LIST_DIR_NAMES` only, no grammar change. In v0.27.0 `LIST_DIR_NAMES` returned the
names alone, so on a large directory of links a script that had to tell a directory from a file
was back to the slow `LIST_DIR`, which follows every link. `LIST_DIR_NAMES` now returns
`{name, type}` objects, sorted by name, where `type` is the entry's own: `"dir"`, `"file"`, or
`"link"` for every symbolic link — links are still not followed. Each entry is now examined, so it
is somewhat slower than the names alone were, but what links point to is never looked at.

Migration: where a v0.27.0 script used an element as a name, use its `name` field —
`loop entry in UNWRAP(LIST_DIR_NAMES(dir)) do PRINT(entry.name) end`. An element joined to a string
with `+` does not fail — the object's text is joined instead — so look for such places. A
directory that can be read but whose entries cannot be examined now gives an error Result, as it
does from `LIST_DIR`. See [Listing a directory](#listing-a-directory). The Java 25 runtime
implements this; the JavaScript playground lists its virtual files, which have no links, the same
way. The frozen Java 7/8 runtime does not implement it.

### v0.27.0 — `LIST_DIR`: links that cannot be followed, name patterns, names only

No grammar change; one new built-in. A user listed a directory of links in which one link pointed
at a file that no longer existed: the whole `LIST_DIR` call failed, its message only the link's
path. On a directory of many links even a working listing was slow, because every link is
followed to read its type and size.

- **A link that cannot be followed** — what it points to is missing or cannot be accessed, or
  links point at each other — is listed with the new type `"link"` and size `0` instead of failing
  the call. A link that can be followed is listed as before, as the file or directory it points
  to. A directory's `size` is `0`, and an entry removed while the directory is read is left out.
- **`LIST_DIR(path, pattern)`**: an optional glob — `*`, `?`, `[...]`, `[!...]`, `{a,b}` — keeps
  only the entries whose names match. A pattern that is empty, contains `/` or is not well formed
  is an error Result.
- **`LIST_DIR_NAMES(path, [pattern])`** returns the names alone, without examining the entries or
  following links, which is much faster on a large directory.
- A `path` that does not exist, is not a directory or cannot be read gives an error Result whose
  message names the reason and the path (`No such file or directory: /data/in`).

See [Listing a directory](#listing-a-directory). A script changes behavior only if it relied on
such a link making `LIST_DIR` fail, or on it being listed as an empty `"file"`. The Java 25 runtime
implements this. The JavaScript runtime has no file system; its playground implements the
patterns and `LIST_DIR_NAMES` over its virtual files, which have no links. The frozen Java 7/8
runtime does not implement it.

### v0.26.0 — `FILE_LINES`: a file as an array, read as it is used

Non-breaking: one built-in, no grammar change. `READ_LINES` windows were the only way through a
file too large to hold in memory, and the window idiom — an offset, a count, an inner loop, a
check for the empty window — is both awkward and slow (each window re-reads the file from the
start, so a whole pass is quadratic). The new built-in makes the plain loop the right tool:

- **`FILE_LINES(path)`** returns the file's lines as an ordinary array of strings — `TYPE_OF`
  `"array"`, `LEN`, indexing, `SLICE`, `==`, `JSON_FORMAT`, loops, copies — but the runtime reads
  the file *as the array is used*: a loop reads it a piece at a time and keeps only the current
  line, `LEN` counts without keeping, and a copy copies nothing. A file of any size can be gone
  through with `loop line in FILE_LINES(path) infinite do`. Using the array as a whole (an element,
  a sort, printing it, returning it to the host) reads the file fully and is a runtime error above
  the host's whole-use limit (64 MB by default). See
  [Going through a file line by line](#going-through-a-file-line-by-line).
- The array is the file as it was at the call: lines appended later are not part of it, and a
  file truncated, rewritten, replaced or deleted since fails the next read with
  `FILE_LINES() cannot read '...': it was modified after FILE_LINES() was called — call
  FILE_LINES() again` instead of yielding mixed content.
- Unlike the other file built-ins it does not return a Result: a file that cannot be read is a
  runtime error at the call (`FILE_LINES() cannot read '...': no such file`), and invalid UTF-8 or
  a line longer than the host's line limit (16 MB by default) is a runtime error when that line is
  reached. A leading UTF-8 BOM is dropped. Reading suspends the calling thread like the other file
  built-ins.

`READ_LINES`, `READ_FILE` and `READ_JSON_FILE` are unchanged. The Java 25 runtime implements
this. The JavaScript runtime has no file system, so there the built-in is a runtime error unless
the host provides it (the playground does, over its virtual files); the frozen Java 7/8 runtime
does not implement it.

### v0.25.0 — `TO_NUMBER` reads exactly a decimal numeral

Mildly breaking, no grammar change. `TO_NUMBER` used to say only "Error if not valid numeric
string", and each runtime left the meaning to its host platform's number parser. Both runtimes
accepted the same decimal numerals, but outside them they disagreed. The new rule
([Numeric text](#numeric-text)) keeps every numeral both runtimes accepted and settles the rest:

- **Decimal numerals only.** The JavaScript runtime also read `0x`/`0X` hexadecimal, `0o` octal,
  and `0b` binary (`"0x10"` → `16`). The Java 25 runtime also read the type suffixes
  `f`/`F`/`d`/`D` (`"1f"` → `1`), hexadecimal floating point (`"0x1p3"` → `8`), `"NaN"`, and
  non-ASCII digits in integer text (`"１２"` → `12`). All of these are now runtime errors.
- **The surrounding whitespace is the `TRIM` set.** The Java 25 runtime also ignored the other C0
  control characters (U+0000–U+0008, U+000E–U+001F). The JavaScript runtime also ignored the
  no-break space U+00A0, the other Unicode spaces and separators, and the BOM U+FEFF. Only the six
  [whitespace](#whitespace) characters are ignored now; remove anything else first (e.g. with
  `REPLACE`).
- **No infinity.** Both runtimes turned `"Infinity"`, `"-Infinity"`, and numerals too large to
  represent (`"1e999"`) into infinity, which `JSON_FORMAT` then wrote as the invalid JSON token
  `Infinity` on Java 25 and as `null` on JavaScript (an error since
  [v0.32.0](#v0320--json-has-no-infinity-or-nan)). `"Infinity"` now fails like any other
  non-numeral, and a numeral too large to represent fails with
  `TO_NUMBER() value out of range: '1e999'`. This is the only change to behavior the two runtimes
  shared.
- **One message.** Text that does not convert reports `TO_NUMBER() cannot convert 'x' to number`
  with the argument as given. It replaces Java 25's `Cannot convert 'x' to number` and
  JavaScript's `TO_NUMBER() cannot convert empty string`.

The active Java 25 and JavaScript runtimes implement this; the frozen Java 7/8 runtime does not.

### v0.24.0 — `WORDS`, a pinned whitespace set, and no empty `SPLIT` delimiter

Mildly breaking, no grammar change. Three string-function items, prompted by
`SPLIT("    test 1  2", " ")` returning `["", "", "", "", "test", "1", "", "2"]` when the words
`["test", "1", "2"]` were wanted:

- **`WORDS(s)`** (additive) splits at runs of whitespace and ignores leading/trailing
  whitespace, so it never yields an empty string: `WORDS("    test 1  2")` → `["test", "1", "2"]`;
  empty or all-whitespace input → `[]`. `SPLIT` itself keeps its lossless contract — every empty
  field is kept, so `JOIN(SPLIT(s, d), d) == s` holds and CSV-style empty fields survive — and its
  row now spells that contract out (the old text mentioned only trailing empty strings). A
  one-argument `SPLIT(s)` was rejected: its empty-field policy would hinge on the argument count,
  the kind of arity-dependent rule v0.7.0 removed from `RANDOM`.
- **Whitespace is pinned** for `TRIM` and `WORDS` to six ASCII characters: space, `\t`, `\n`,
  vertical tab U+000B, form feed U+000C, `\r`. `TRIM` used to say only "whitespace", and the
  runtimes disagreed beyond these six: the Java 25 runtime also stripped the other C0 control
  characters (U+0000–U+0008, U+000E–U+001F), while the JavaScript runtime also stripped the
  no-break space U+00A0, the Unicode spaces U+1680, U+2000–U+200A, U+202F, U+205F, U+3000, the
  separators U+2028/U+2029, and the BOM U+FEFF. The six are exactly the characters both runtimes
  already stripped, so only the disagreements change; a script that relied on the extra
  stripping must remove those characters itself (e.g. with `REPLACE`) before calling `TRIM`.
- **An empty `SPLIT` delimiter is a runtime error** (`SPLIT() requires a non-empty delimiter`),
  like the empty search string of `FIND` (v0.17.0). The case was unspecified and the runtimes
  diverged — `SPLIT("abc", "")` gave `["a", "b", "c", ""]` on Java 25 but `["a", "b", "c"]` on
  JavaScript, and `SPLIT("", "")` gave `[""]` vs `[]`. Use `CHARS(s)` to split into characters.

The active Java 25 and JavaScript runtimes implement this batch; the frozen Java 7/8 runtime does
not.

### v0.23.0 — imports and function-only modules

Adds top-level `import module.path[.N] as alias` and qualified `alias::function(...)` calls.
Imported sources expose only root-level functions; top-level code is skipped, globals are isolated,
and nested imports are rejected before entry execution. Module boundaries deep-copy arguments and
returns, and `multi` snapshots module globals under the existing worker/monitor purity model. Hosts
own module/version resolution; the active Java 25 and JavaScript runtimes implement imports, while
the frozen Java 7/8 runtime does not.

Mildly breaking at the grammar level: `import` and `as` become reserved words. Scripts that used
either as a variable, function, parameter, or other identifier must rename it. This is the same
compatibility class as `elseif` in v0.9.0 and `limit` in v0.19.0.

### v0.22.0 — worker-thread debugging; monitor excluded

Additive, no grammar or normal-execution change. In a host debug mode, `debug` statements and
line breakpoints apply to the main logical thread and every `multi` worker. A stop identifies its
logical thread and exposes that worker's locals, global snapshot, and call stack. A step remains
scoped to the worker that armed it, while explicit breaks may still stop any worker. Monitor
iterations never stop and their `debug` statements remain no-ops. The active Java 25 and
JavaScript runtimes implement this behavior; the frozen Java 7/8 runtime does not.

### v0.21.0 — monitor thread information and one-line SHELL progress

Mildly breaking for code that reads a thread Result's `value` *inside* a monitor; grammar and
post-`multi` results are unchanged. Every monitor capture now projects each copied Result value to
`{id, key, functionName, state, returnValue, shell}`. The worker's actual value remains under
`returnValue`, and the live/final semantic collection is never mutated. `shell` keeps only the
worker's current or most recent SHELL call. Its `output` is the newest one-line tail only when
output changed since the preceding capture (`updated=true`), otherwise `""`; no `tail` clause
was added. Process fields unavailable from a host are `{}`. Bounded SHELL capture keeps the newest
suffix when its limit is exceeded, so earlier output may be omitted. The active Java 25 and
JavaScript runtimes implement this batch; the frozen Java 7/8 runtime does not.

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

- **The integer range is pinned**: 32-bit signed (widened to ±(2⁵³ − 1) in
  [v0.33.0](#v0330--integers-up-to-9007199254740991)). Out-of-range integer literals and overflowing
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
