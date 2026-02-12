# ProperTee Language Specification

## Overview

ProperTee is a small, safe scripting language designed for embedding in host applications. It features cooperative multithreading with a thread purity model — threads cannot mutate shared state, eliminating data races by design. There are no locks, no shared mutable state, and no null.

## Values and Types

ProperTee has six types:

| Type | Examples | Notes |
|---|---|---|
| number (integer) | `0`, `42`, `-7` | Whole numbers |
| number (decimal) | `3.14`, `0.5` | Floating-point numbers |
| string | `"hello"`, `"it's \"quoted\""` | Double-quoted, `\"` for embedded quotes |
| boolean | `true`, `false` | |
| array | `[1, 2, 3]`, `[]` | Ordered, 1-based indexing, heterogeneous |
| object | `{name: "Alice", age: 30}`, `{}` | Ordered key-value pairs, string keys |

There is **no null**. The empty object `{}` serves as the "no value" sentinel throughout the language.

### Number Representation

- Integer and decimal are both "number" but stored differently
- Arithmetic that produces a whole number result displays without a decimal point: `10 / 2` displays as `5`
- Division always produces a decimal internally: `7 / 2` → `3.5`
- Whole-number results of other operations display as integers: `1.0 + 2.0` → `3`

### Truthiness

Used in `if` conditions and `loop` conditions:

- **Truthy:** `true` only
- **Falsy:** everything else — including `false`, `0`, `""`, `[]`, `{}`

Note: Conditions must use explicit boolean comparisons (e.g., `if x == true then` or `if x != false then`).

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
a = {x: 1}
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

Equality (`==`, `!=`) works across all types. Values are compared by content, not identity — `{} == {}` is `true`. Relational operators (`>`, `<`, `>=`, `<=`) require both operands to be numbers.

### Logical

| Operator | Operation | Operand Types |
|---|---|---|
| `and` | logical AND | boolean and boolean |
| `or` | logical OR | boolean or boolean |
| `not` | logical NOT | not boolean |

All logical operators **require boolean operands**. Using a number or string with `and`/`or` is a runtime error. Both sides are always evaluated (no short-circuit).

### Precedence (lowest to highest)

1. `or`
2. `and`
3. `==` `!=` `>` `<` `>=` `<=`
4. `+` `-`
5. `*` `/` `%`
6. `-` (unary), `not`
7. `.` (member access)

Parentheses `()` override precedence.

## Strings

Strings are double-quoted. Supported escape sequences:

| Escape | Character |
|---|---|
| `\"` | double quote |
| `\\` | backslash |

```
msg = "She said \"hello\""
path = "C:\\Users\\file"
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
person = {name: "Alice", age: 30}
config = {"special-key": true, 1: "one"}
empty = {}
```

Object keys can be bare identifiers, quoted strings, or integers (stored as string keys).

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
data = {users: [{name: "Alice"}, {name: "Bob"}]}
data.users.1.name    // "Alice"
data.users.2.name    // "Bob"
```

## Control Flow

### If / Else

```
if condition then
    // statements
end

if condition then
    // statements
else
    // statements
end
```

### Loops

**Condition loop** — repeats while condition is truthy:

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
loop k, v in {x: 1, y: 2} do
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

## Multi Blocks (Parallel Execution)

Any function can be run concurrently inside a `multi` block using the `thread` keyword. Results are collected into a single object.

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
multi resultVar do             // resultVar is optional
    thread key: funcCall()     // named result entry
    thread : funcCall()        // unnamed (auto-keyed by position)
monitor intervalMs             // optional monitor clause
    // monitor body
end
```

- `resultVar` — the variable that receives the result collection after all threads complete. Optional; omit for fire-and-forget (`multi do ... end`).
- `do` — required keyword after the optional result variable.

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

All collected `thread` calls fire simultaneously when the setup phase ends (at `end` or `monitor`).

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

### Thread Purity

Functions running inside multi blocks enforce a purity model:

- **Can read** global variables via `::` (reads from a snapshot taken when the `multi` block starts)
- **Cannot write** global variables — `::x = value` is a runtime error
- **Can call** any other function (user-defined or built-in)
- **Can create** and modify local variables freely (plain `x` without `::`)

This guarantees no data races — threads never see each other's modifications.

### Semantics

1. The multi block body executes as a setup phase in an isolated scope (like a function), collecting `thread` calls
2. A snapshot of global variables is taken at `multi` entry — all threads see this snapshot
3. All spawned functions launch concurrently after setup completes
4. The result collection is pre-built with `"running"` entries at spawn time
5. Threads execute cooperatively, interleaving at statement boundaries
6. As each thread completes, its result entry is updated in-place to `"done"` or `"error"`
7. The monitor clause can read the live result collection during execution
8. All threads must complete before execution continues past `end`
9. The result collection is assigned to `resultVar` after **all** threads finish

### Monitor Clause

An optional `monitor` clause runs code periodically while threads execute:

```
multi result do
    thread resultA: worker("A")
    thread resultB: worker("B")
monitor 100
    PRINT("[heartbeat]")
end
```

- The number after `monitor` is the interval in milliseconds
- Monitor code is **read-only** — variable assignment inside a monitor is a runtime error
- Monitor can call built-in functions (e.g., `PRINT`)
- Monitor can read the result collection variable to check thread status (e.g., `result.key.status`)
- Monitor can read global variables (via `::` prefix) but **cannot** access setup phase locals — the monitor runs in its own scope containing only globals and the result variable
- Monitor runs one final time after all threads complete

```
multi result do
    thread r: slowWorker()
monitor 100
    PRINT("status:", result.r.status)   // "running" or "done"
end
```

**How the monitor accesses `result`:** In the code above, the monitor body references `result` even though `result` is only assigned after all threads finish (at `end`). This works because the scheduler **injects** the live result collection into the monitor's scope under the `resultVar` name at each monitor tick. The monitor does not read the final assigned variable — it reads a live, in-place-updated map that the scheduler maintains as threads complete. This is why the monitor can see `"running"` entries transition to `"done"` in real time, even though the `result = ...` assignment hasn't happened yet.

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

## Built-in Functions

All built-in function names are UPPERCASE.

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
| `RANDOM(max)` | Random integer from 0 (inclusive) to `max` (exclusive). `max` must be positive. |
| `RANDOM(min, max)` | Random integer from `min` to `max` (both inclusive). |

### Type Conversion

| Function | Description |
|---|---|
| `TO_NUMBER(s)` | Convert string to number. Error if not valid numeric string. |
| `TO_STRING(v)` | Convert any value to its string representation |

### String Functions

| Function | Description |
|---|---|
| `LEN(s)` | Length of string, array, or object (number of entries). Returns `0` for other types. |
| `UPPERCASE(s)` | Convert to uppercase |
| `LOWERCASE(s)` | Convert to lowercase |
| `TRIM(s)` | Remove leading/trailing whitespace |
| `SUBSTRING(s, start, [length])` | Extract substring. `start` is 1-based. |
| `SPLIT(s, delimiter)` | Split string into array. Preserves trailing empty strings. |
| `JOIN(arr, [separator])` | Join array elements into string. Default separator is `""`. |
| `CHARS(s)` | Split string into array of single characters |

### Array Functions

| Function | Description |
|---|---|
| `PUSH(arr, values...)` | Returns new array with values appended. Original unchanged. |
| `POP(arr)` | Returns new array with last element removed. Original unchanged. |
| `CONCAT(arrs...)` | Returns new array concatenating all input arrays |
| `SLICE(arr, start, [end])` | Returns sub-array. `start` is 1-based. `end` is exclusive. |
| `SORT(arr)` | Returns new array sorted ascending. All elements must be the same type (number or string). |
| `SORT_DESC(arr)` | Returns new array sorted descending. Same type restriction as `SORT`. |
| `SORT_BY(arr, key)` | Returns new array of objects sorted ascending by the given key. |
| `SORT_BY_DESC(arr, key)` | Returns new array of objects sorted descending by the given key. |
| `REVERSE(arr)` | Returns new array with elements in reverse order. No type restriction. |

### Object Functions

| Function | Description |
|---|---|
| `HAS_KEY(obj, key)` | Returns `true` if `obj` contains `key`, `false` otherwise. Both arguments required: `obj` must be an object, `key` must be a string. |
| `KEYS(obj)` | Returns an array of the object's keys in insertion order. `obj` must be an object. |

### Timing

| Function | Description |
|---|---|
| `SLEEP(ms)` | Pause current thread for `ms` milliseconds |
| `MILTIME()` | Current time as epoch milliseconds (number) |
| `DATE()` | Current date as `"YYYY-MM-DD"` string |
| `TIME()` | Current time of day as `"HH:MM:SS"` string |

## Built-in Properties

The host application can inject read-only properties accessible as global variables:

```bash
# Command line
java -jar propertee.jar -p '{"width": 100, "height": 200}' script.pt
```

```
// In script
area = width * height    // 20000
```

Properties are read-only and sit at the bottom of the variable lookup chain — any local or global variable with the same name takes precedence.

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
| Division by zero | Division by zero |
| Missing property | Property 'x' does not exist |
| Array out of bounds | Array index out of bounds |
| Loop limit exceeded | Loop exceeded maximum iterations (1000) |
| Global write in multi block | Cannot assign to global variable '::x' inside multi block |
| Global without `::` in local scope | Variable 'x' is not defined in local scope. Use ::x to access the global variable |
| Assignment in monitor | Cannot assign variables in monitor block (read-only) |
| thread outside multi | thread can only be used inside multi blocks |
| Duplicate result key | Duplicate result key 'x' in multi block |
| Too many arguments | Function 'foo' expects 2 argument(s), but 3 were provided |
| Mixed type sort | SORT() requires all elements to be the same type (number or string) |
| SORT_BY key missing | Property 'x' does not exist in array element at index N |
| Non-array sort | SORT() requires an array argument |
| Range step not positive | Range step must be positive |
| Range bounds not numbers | Range bounds must be numbers |
| Range step not a number | Range step must be a number |
