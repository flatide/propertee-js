# ProperTee Language Specification

Version: 1.1  
Last Updated: 2026-01-31

## 1. Type System

### 1.1 Primitive Types
- **Number**: IEEE 754 floating-point numbers (e.g., `42`, `3.14`, `-7.5`)
- **String**: UTF-16 encoded strings (e.g., `"hello"`, `"world"`)
- **Boolean**: `true` or `false`
- **Null**: `null` (represents intentional absence of value)

### 1.2 Complex Types
- **Object**: Key-value pairs `{key: value, ...}`
- **Array**: Ordered collections `[item1, item2, ...]`

### 1.3 No Undefined
⚠️ **ProperTee does NOT have an `undefined` type.**

Any attempt to access non-existent variables or properties results in a **runtime error**.

---

## 2. Operators

### 2.1 Arithmetic Operators

#### Addition (`+`)
- **Allowed types**: 
  - `Number + Number` → Number
  - `String + String` → String (concatenation)
- **Type coercion**: ❌ None
- **Error cases**:
  - `String + Number` → Runtime Error
  - `Boolean + Number` → Runtime Error
  - Mixed types → Runtime Error

**Examples:**
```javascript
10 + 5         // ✅ 15
"Hello" + " World"  // ✅ "Hello World"
"5" + 3        // ❌ Runtime Error: Type mismatch
```

#### Subtraction (`-`)
- **Allowed types**: `Number - Number` only
- **Error cases**: Non-numeric operands → Runtime Error

**Examples:**
```javascript
10 - 3         // ✅ 7
"10" - 5       // ❌ Runtime Error
```

#### Multiplication (`*`)
- **Allowed types**: `Number * Number` only
- **Error cases**: Non-numeric operands → Runtime Error

#### Division (`/`)
- **Allowed types**: `Number / Number` only
- **Error cases**: 
  - Non-numeric operands → Runtime Error
  - **Division by zero → Runtime Error** ⚠️

**Examples:**
```javascript
10 / 2         // ✅ 5
10 / 0         // ❌ Runtime Error: Division by zero
```

#### Modulo (`%`)
- **Allowed types**: `Number % Number` only
- **Error cases**:
  - Non-numeric operands → Runtime Error
  - **Modulo by zero → Runtime Error** ⚠️

**Examples:**
```javascript
10 % 3         // ✅ 1
10 % 0         // ❌ Runtime Error: Division by zero
```

#### Unary Minus (`-`)
- **Allowed types**: `-Number` only
- Negates numeric value
- **Error cases**: Non-numeric operand → Runtime Error

**Examples:**
```javascript
x = -5        // ✅ -5
y = -(3 + 2)  // ✅ -5
z = -"10"     // ❌ Runtime Error: Unary minus requires numeric operand
```

### 2.2 Comparison Operators

All comparison operators: `==`, `!=`, `>`, `<`, `>=`, `<=`

#### Equality operators (`==`, `!=`)
- **Allowed types**: Any type (no type coercion)
- Compares values using strict equality
- Different types are never equal

**Examples:**
```javascript
5 == 5         // ✅ true
5 != 3         // ✅ true
null == null   // ✅ true
5 == "5"       // ✅ false (no type coercion)
true == 1      // ✅ false (different types)
```

#### Ordering operators (`>`, `<`, `>=`, `<=`)
- **Allowed types**: `Number` comparison `Number` only
- **Error cases**: Non-numeric operands → Runtime Error

**Examples:**
```javascript
10 > 5         // ✅ true
3.5 <= 3.5     // ✅ true
"10" > 5       // ❌ Runtime Error: Comparison requires numeric operands
```

### 2.3 Logical Operators

- `and`: Logical AND
- `or`: Logical OR
- `not`: Logical NOT

#### Type Requirements
- **Allowed types**: `Boolean` operands only
- **No truthy/falsy evaluation**: Unlike JavaScript, only `true` and `false` are valid
- **Error cases**: Non-boolean operands → Runtime Error

**Examples:**
```javascript
true and false     // ✅ false
true or false      // ✅ true
not true           // ✅ false

// Comparisons return boolean, so can be combined
(5 > 3) and (2 < 4)    // ✅ true
(x == 10) or (y == 20) // ✅ Works if x and y are defined

// These are ERRORS (no truthy/falsy)
1 and 0            // ❌ Runtime Error: Logical AND requires boolean operands
"hello" or ""      // ❌ Runtime Error: Logical OR requires boolean operands
not 0              // ❌ Runtime Error: Logical NOT requires boolean operand
```

**Short-circuit evaluation:**
- `and`: If left is `false`, right is not evaluated
- `or`: If left is `true`, right is not evaluated

---

## 3. Variables and Scope

### 3.1 Variable Declaration

Variables are created on **first assignment**. No explicit declaration keyword needed.

**Examples:**
```javascript
x = 10              // Creates variable x
myName = "Alice"    // Creates variable myName
```

### 3.2 Variable Reference

⚠️ **Error**: Accessing undefined variable → **Runtime Error**

Variables **must be assigned before use**.

**Examples:**
```javascript
x = 10
PRINT(x)           // ✅ 10

PRINT(y)           // ❌ Runtime Error: Variable 'y' is not defined
```

### 3.3 Scoping Rules

- All variables are **function-scoped** (or global in top-level)
- No block scoping
- Assignments create or update variables in current scope

### 3.4 Variable Lookup Priority

1. Local variables (`this.variables`)
2. Built-in properties (`this.properties`)

If variable not found in either → Runtime Error

---

## 4. Property Access

### 4.1 Reading Properties

**Syntax:**
- `object.property` - Static property name
- `object.1` - Numeric key (array index, **1-based**)
- `object."key-name"` - String key with special characters
- `object.$varName` - Dynamic property using variable (shorthand)
- `object.$(expression)` - Dynamic property using expression

⚠️ **Array Indexing:** ProperTee uses **1-based indexing**. Arrays start at index `1`, not `0`.

⚠️ **Error cases:**
- `null.property` → Runtime Error: "Cannot access property of null"
- `object.nonExistent` → Runtime Error: "Property does not exist"

**Examples:**
```javascript
obj = {name: "Alice", age: 30}
PRINT(obj.name)        // ✅ "Alice"
PRINT(obj.city)        // ❌ Runtime Error: Property 'city' does not exist

arr = [1, 2, 3]
PRINT(arr.1)           // ✅ 1 (첫 번째 요소)
PRINT(arr.2)           // ✅ 2 (두 번째 요소)
PRINT(arr.3)           // ✅ 3 (세 번째 요소)
PRINT(arr.10)          // ❌ Runtime Error: Property '10' does not exist

obj2 = null
PRINT(obj2.name)       // ❌ Runtime Error: Cannot access property 'name' of null
```

### 4.2 Writing Properties

**Syntax:** `object.property = value`

- **Creates new property** if it doesn't exist
- Updates existing property if it exists

⚠️ **Error cases:**
- `null.property = value` → Runtime Error
- Assigning to non-object (e.g., `5.property = 10`) → Runtime Error

**Examples:**
```javascript
obj = {name: "Alice"}
obj.age = 30           // ✅ Creates new property
obj.name = "Bob"       // ✅ Updates existing property

PRINT(obj.age)         // ✅ 30
PRINT(obj.name)        // ✅ "Bob"
```

### 4.3 Dynamic Property Access

**Using variables:**
```javascript
key = "name"
obj = {name: "Alice"}
PRINT(obj.$key)        // ✅ "Alice" (shorthand for .$(key))
PRINT(obj.$(key))      // ✅ "Alice" (full form)
```

---

## 5. Control Flow

### 5.1 If Statement

**Syntax:**
```
if condition then
    statements
else
    statements
end
```

- `else` block is optional
- Condition should evaluate to boolean

**Examples:**
```javascript
x = 10
if x > 5 then
    PRINT("Greater than 5")
end

if x == 0 then
    PRINT("Zero")
else
    PRINT("Non-zero")
end
```

### 5.2 Loop Statement

#### Condition Loop

**Syntax:**
```
loop condition do
    statements
end

loop condition infinite do
    statements
end
```

- Default iteration limit: **1000** (configurable)
- Use `infinite` keyword to remove limit

**Examples:**
```javascript
counter = 0
loop counter < 10 do
    PRINT(counter)
    counter = counter + 1
end

// Infinite loop (must have break)
loop true infinite do
    PRINT("Running...")
    if shouldStop then
        break
    end
end
```

#### Collection Loop (Value Only)

**Syntax:**
```
loop value in collection do
    statements
end
```

- Iterates over **values** only
- Arrays: iterates over elements
- Objects: iterates over property values

**Examples:**
```javascript
// Array
numbers = [10, 20, 30]
loop num in numbers do
    PRINT(num)        // 10, 20, 30
end

// Object
scores = {alice: 95, bob: 87}
loop score in scores do
    PRINT(score)      // 95, 87
end
```

#### Collection Loop (Key and Value)

**Syntax:**
```
loop key, value in collection do
    statements
end
```

- First variable = **key/index**
- Second variable = **value**
- Arrays: key is numeric index (1-based: 1, 2, 3, ...)
- Objects: key is string property name

**Examples:**
```javascript
// Array with index (1-based)
items = ["apple", "banana", "cherry"]
loop idx, item in items do
    PRINT(idx, ":", item)
    // 1 : apple
    // 2 : banana
    // 3 : cherry
end

// Object with keys
person = {name: "Alice", age: 30}
loop key, val in person do
    PRINT(key, "=", val)
    // name = Alice
    // age = 30
end
```

### 5.3 Flow Control

- `break`: Exit current loop immediately
- `continue`: Skip to next iteration
- `return`: Exit current function/script and return a value (optional)

**Examples:**
```javascript
loop i, num in numbers do
    if num < 0 then
        continue      // Skip negative numbers
    end
    
    if num > 100 then
        break         // Stop if number too large
    end
    
    PRINT(num)
end
```

### 5.4 Return Statement

The `return` statement can be used in two contexts:

#### 1. Inside Functions
Exits the current function and returns a value:

```javascript
function findMax(a, b) do
    if a > b then
        return a      // Exit function, return a
    end
    return b
end
```

#### 2. Top-Level Script
Exits the entire script execution and returns a value:

```javascript
// Script execution
x = loadConfig()

if x == null then
    return null      // Stop script, return null
end

// Continue processing...
result = process(x)
return result       // End script, return result
```

**Syntax:**
```
return              // Returns null
return expression   // Returns the evaluated expression
```

**Behavior:**
- **In functions**: Immediately exits the function and returns to the caller
- **At top-level**: Immediately stops script execution and returns to the host
- Can appear anywhere in code (inside functions, loops, conditionals, or top-level)
- Multiple return statements allowed (early returns)

**Examples:**
```javascript
// Early return from script
config = loadConfig()
if config.disabled then
    return "Feature disabled"  // Script ends here
end

// Script continues if not returned
result = performTask(config)
return result
```

### 5.5 User-Defined Functions and Threads

ProperTee has two types of callable constructs:

**1. Functions (function keyword):**
```
function name(param1, param2, ...) do
    statements
end
```

**2. Threads (thread keyword):**
```
thread name(param1, param2, ...) uses resources do
    statements
end
```

**Function Definition:**
- Functions must be defined before they are called
- Parameters are comma-separated identifiers
- Functions create a new local scope
- Return value can be explicit (`return expression`) or implicit (last evaluated expression)

**Thread Definition:**
- Threads are special functions that can run in `multi` blocks
- Must be declared with `thread` keyword
- May use `uses` clause to access SHARED resources
- Can be called both synchronously (outside multi) and asynchronously (inside multi)
- Designed for safe concurrent execution

**Key Differences:**

| Feature | function | thread |
|---------|----------|--------|
| Can be called normally | ✅ | ✅ |
| Can be used in multi | ❌ | ✅ |
| Can use `uses` clause | ❌ | ✅ |
| Access SHARED variables | ❌* | ✅ (with uses) |

*Functions cannot access SHARED variables at all, even outside multi blocks.

**Note on Parameters:**
User-defined functions and threads currently have **fixed parameter count**. Variadic arguments (like `...args`) are not yet supported. Built-in functions like `PRINT`, `PUSH`, and `CONCAT` do support variable arguments. See [Section 18.1](#181-current-limitations) for details and future plans.

**Return Behavior:**
1. **Explicit return**: `return expression` exits function/thread and returns the value
2. **Implicit return**: Last expression evaluated in the body is returned
3. **No return**: If no statements or only non-expression statements, returns `null`

#### Scoping Rules

1. **Local Scope**: Variables assigned inside a function/thread are local to that function/thread
2. **Global Access**: Functions can **read** variables from outer (global) scope
3. **Global Modification**: To modify a global variable, it must exist before function call
4. **Shadowing**: Local variables with same name as global variables shadow the global ones
5. **SHARED Access**: Only threads with `uses` clause can access SHARED variables

**Example - Local vs Global:**
```javascript
x = 100              // Global

function test() do
    x = 10           // Local (shadows global)
    y = 20           // Local
    return x + y
end

result = test()      // 30
PRINT(x)            // 100 (global unchanged)
```

**Example - Thread with SHARED:**
```javascript
shared counter = 0

thread work() uses counter do
    counter = counter + 10  // ✅ OK - declared in uses
    return counter
end

function helper() do
    counter = counter + 5   // ❌ Error - functions cannot access SHARED
end
```

**Example - Accessing Global:**
```javascript
counter = 0          // Global

function increment() do
    counter = counter + 1    // Reads global, creates local
    return counter
end

increment()          // 1 (returns local counter)
PRINT(counter)      // 0 (global unchanged)
```

**Example - Modifying Existing Variable:**
```javascript
total = 0            // Global

function addToTotal(amount) do
    // If 'total' exists in outer scope, modifies it
    // Otherwise creates local variable
    total = total + amount
    return total
end

addToTotal(10)       // 10
PRINT(total)        // 10 (global modified)
```

#### Parameter Handling

**Argument Omission:**
- If fewer arguments provided than parameters, missing ones are `null`
- If more arguments provided than parameters, error is thrown

**Examples:**
```javascript
function greet(name, title) do
    if title == null then
        return "Hello, " + name
    else
        return "Hello, " + title + " " + name
    end
end

greet("Alice")              // "Hello, Alice" (title is null)
greet("Bob", "Dr.")         // "Hello, Dr. Bob"
greet("Eve", "Ms.", "PhD")  // ❌ Error: Too many arguments
```

#### Recursion

Functions can call themselves recursively:

```javascript
function factorial(n) do
    if n <= 1 then
        return 1
    else
        return n * factorial(n - 1)
    end
end

result = factorial(5)    // 120
```

#### Recursion

ProperTee supports recursive function calls without artificial limits.

⚠️ **Important: Host Language Stack Limit**

Recursion is implemented using the host language's (JavaScript, Python, etc.) native call stack. Therefore, **the host language's stack limit applies**.

- **JavaScript (browser)**: Typically ~500-1000 calls
- **JavaScript (Node.js)**: Typically ~10,000-15,000 calls
- **Python**: Typically ~1000 calls (configurable)
- **Java/C++**: Depends on stack size configuration

**Recommendation:** For algorithms requiring deep recursion (>500 levels), **use loops instead**.

**Examples:**

**Example 1: Safe Recursion**
```javascript
function factorial(n) do
    if n <= 1 then
        return 1
    else
        return n * factorial(n - 1)
    end
end

factorial(5)     // ✅ 120
factorial(100)   // ✅ Works in most environments
factorial(10000) // ❌ May cause: RangeError (depends on host)
```

**Example 2: Converting Recursion to Loop**
```javascript
// ❌ Recursive - will fail for large n
function sum(n, acc) do
    if n <= 0 then return acc end
    return sum(n - 1, acc + n)
end

// ✅ Loop-based - no stack limit (infinite for large n)
function sum(n) do
    result = 0
    i = 1
    loop i <= n infinite do
        result = result + i
        i = i + 1
    end
    return result
end

sum(10000)  // ✅ Always works
```

**Example 3: Tail Recursion Pattern**
```javascript
// Tail-recursive fibonacci (still limited by host stack)
function fib(n, a, b) do
    if n == 0 then return a end
    if n == 1 then return b end
    return fib(n - 1, b, a + b)
end

fib(500, 0, 1)  // ✅ Usually works
fib(5000, 0, 1) // ❌ Stack overflow
```

#### Return Statement

**Syntax:**
```
return              // Returns null
return expression   // Returns the evaluated expression
```

**Behavior:**
- Immediately exits the function (or script if at top-level)
- Can appear anywhere in function body (or top-level script)
- Multiple return statements allowed (early returns)

**Examples:**
```javascript
function abs(x) do
    if x < 0 then
        return -x
    end
    return x
end

function findFirst(items, target) do
    loop item in items do
        if item == target then
            return item    // Early return
        end
    end
    return null           // Not found
end
```

#### Implicit Return

If no `return` statement is executed, the last evaluated expression is returned:

```javascript
function add(a, b) do
    a + b              // Implicitly returned
end

function calculate(x) do
    temp = x * 2
    temp + 10          // Implicitly returned
end

result1 = add(5, 3)       // 8
result2 = calculate(10)   // 30
```

**Note:** If the last statement is not an expression (e.g., assignment, loop), `null` is returned:

```javascript
function test() do
    x = 10             // Assignment, not an expression
end

result = test()        // null
```

#### Limitations

❌ **Not Supported:**
- Function overloading (same name, different parameters)
- Variable arguments (`...args`)
- Default parameter values
- Nested function definitions
- Anonymous functions / lambdas
- Closures (capturing local variables)
- First-class functions (functions as values)

---

## 6. Iteration Limits

### 6.1 Default Behavior

⚠️ All loops have a default maximum iteration count: **1000**

**Behavior when limit exceeded:**

#### Error Mode (Default) ❌
- Throws runtime error
- **Stops execution completely**
- Error message: `"Runtime Error: Loop exceeded maximum iterations (1000)..."`

**Example:**
```javascript
counter = 0
loop counter < 10000 do
    PRINT(counter)
    counter = counter + 1
end
// After 1000 iterations:
// ❌ Runtime Error: Loop exceeded maximum iterations (1000)...

PRINT("This never executes")  // ❌ NOT EXECUTED
```

#### Warning Mode (Optional) ⚠️
- Outputs warning to stderr
- **Breaks the loop** (equivalent to explicit `break`)
- **Continues with next statement**
- Warning message: `"Warning: Loop exceeded maximum iterations (1000), stopping loop"`

**Example:**
```javascript
// With iterationLimitBehavior: 'warn'

counter = 0
loop counter < 10000 do
    PRINT(counter)
    counter = counter + 1
end
// After 1000 iterations:
// ⚠️ Warning: Loop exceeded maximum iterations (1000), stopping loop

PRINT("After loop")  // ✅ This executes
```

**Configuration:**
```javascript
// Error mode (default)
const visitor = new ProperTeeCustomVisitor(
    properties,
    functions,
    ioStreams,
    { 
        maxIterations: 1000,
        iterationLimitBehavior: 'error'  // default - stops execution
    }
);

// Warning mode (lenient)
const visitor = new ProperTeeCustomVisitor(
    properties,
    functions,
    ioStreams,
    { 
        maxIterations: 1000,
        iterationLimitBehavior: 'warn'  // breaks loop, continues execution
    }
);
```

### 6.2 Infinite Loops

Use `infinite` keyword after condition to remove iteration limit:

**Syntax:**
```
loop condition infinite do
    statements
end

loop key, value in collection infinite do
    statements
end
```

⚠️ **Must include explicit `break`** to avoid true infinite loop

**Example:**
```javascript
loop true infinite do
    PRINT("Running...")
    if shouldStop then
        break  // Must have break!
    end
end
```

### 6.3 Configuration

Iteration limit can be configured when creating the visitor:

```javascript
const visitor = new ProperTeeCustomVisitor(
    properties,
    functions,
    ioStreams,
    { maxIterations: 5000 }  // Custom limit
);
```

---

## 7. Error Handling

### 7.1 Runtime Errors (Fatal)

All runtime errors **immediately halt execution**. There is no try-catch mechanism.

**Error Categories:**

1. **Division by zero**
   - `x / 0`
   - `x % 0`

2. **Undefined variable**
   - Accessing non-existent variable

3. **Property access errors**
   - Null property access: `null.property`
   - Non-existent property: `object.missingProperty`

4. **Type errors**
   - Invalid operator operands: `"hello" * 5`
   - Non-object property assignment: `5.property = 10`

5. **Loop limit exceeded** (only in 'error' mode)
   - Iteration limit reached without `infinite` keyword
   - Default behavior is 'warn' mode (non-fatal)

6. **Unknown function**
   - Calling undefined function

### 7.2 Warnings (Non-Fatal)

**Loop limit warnings** (default behavior):
- Iteration limit reached → warning to stderr, loop breaks, execution continues
- Use `infinite` keyword to remove limit
- Can be changed to error mode via `iterationLimitBehavior: 'error'`

### 7.3 No Exception Handling

ProperTee does **NOT** have try-catch exception handling.

All errors are **fatal** and stop execution immediately (warnings are non-fatal).

### 7.4 Error Output

When runtime error occurs:
- Previous output (from `PRINT`) is displayed
- Error message is shown
- Execution stops

When warning occurs:
- Warning message is output to stderr
- Loop breaks
- Execution continues with next statement

---

## 8. Type Coercion

### 8.1 Strict Type System

⚠️ ProperTee does **NOT** perform implicit type coercion.

**JavaScript behavior NOT supported:**
```javascript
// JavaScript (works with coercion)
"5" + 3        // "53"
"10" - 2       // 8
true + false   // 1
5 * "2"        // 10

// ProperTee (all errors)
"5" + 3        // ❌ Runtime Error
"10" - 2       // ❌ Runtime Error
true + false   // ❌ Runtime Error
5 * "2"        // ❌ Runtime Error
```

### 8.2 Valid Type Combinations

**Addition (`+`):**
- ✅ Number + Number → Number
- ✅ String + String → String
- ❌ Any other combination → Error

**Subtraction, Multiplication, Division, Modulo (`-`, `*`, `/`, `%`):**
- ✅ Number (operator) Number → Number
- ❌ Any other combination → Error

**Comparison (`>`, `<`, `>=`, `<=`):**
- ✅ Number (operator) Number → Boolean
- ❌ Any other combination → Error

**Equality (`==`, `!=`):**
- ✅ Any type (operator) Any type → Boolean
- Note: No type coercion, so `5 == "5"` is `false`

**Logical operators (`and`, `or`, `not`):**
- ✅ Boolean (operator) Boolean → Boolean
- ❌ Any other combination → Error

### 8.3 Explicit Conversion

Currently, ProperTee does not provide type conversion functions.

If needed in the future, consider adding:
- `TO_NUMBER(value)` - Convert to number
- `TO_STRING(value)` - Convert to string
- `TO_BOOLEAN(value)` - Convert to boolean

---

## 9. Built-in Functions

**Note on Variadic Arguments:**
Built-in functions support variable number of arguments (e.g., `PRINT`, `PUSH`, `CONCAT`). User-defined functions currently have fixed parameters only. See [Section 18.1](#181-current-limitations) for details and planned enhancements.

**Note on Async Functions:**
`SLEEP` is asynchronous and automatically awaited by the runtime. User functions calling `SLEEP` also become asynchronous implicitly, with no explicit `async` keyword needed. See [Section 18.1](#181-current-limitations) for details.

---

### 9.1 I/O Functions

#### `PRINT(...args)`
- Outputs arguments to stdout
- Multiple arguments are space-separated
- Automatically adds newline
- **Returns**: `null` (no meaningful return value)

**Examples:**
```javascript
PRINT("Hello")              // Hello
PRINT("Score:", 95)         // Score: 95
PRINT(1, 2, 3)              // 1 2 3

result = PRINT("Test")      // result is null
```

### 9.2 Math Functions

#### `SUM(...args)`
- **Returns**: Number (sum of all arguments)
- All arguments must be numbers

#### `MAX(...args)`
- **Returns**: Number (maximum value)
- All arguments must be numbers

#### `MIN(...args)`
- **Returns**: Number (minimum value)
- All arguments must be numbers

#### `ABS(n)`
- **Returns**: Number (absolute value)

#### `FLOOR(n)`
- **Returns**: Number (largest integer ≤ n)

#### `CEIL(n)`
- **Returns**: Number (smallest integer ≥ n)

#### `ROUND(n)`
- **Returns**: Number (nearest integer)

**Examples:**
```javascript
PRINT(SUM(1, 2, 3, 4))      // 10
PRINT(MAX(5, 2, 8, 1))      // 8
PRINT(MIN(5, 2, 8, 1))      // 2
PRINT(ABS(-5))              // 5
PRINT(FLOOR(3.7))           // 3
PRINT(CEIL(3.2))            // 4
PRINT(ROUND(3.6))           // 4
```

### 9.3 Utility Functions

#### `LEN(array|string)`
- **Returns**: Number (length of array or string)
- Returns 0 for other types

**Examples:**
```javascript
PRINT(LEN([1, 2, 3]))       // 3
PRINT(LEN("hello"))         // 5
```

#### `TO_NUMBER(string)`
- **Returns**: Number
- Converts string to number
- Trims whitespace before conversion
- Throws error if string cannot be converted

**Examples:**
```javascript
num = TO_NUMBER("123")      // 123
num = TO_NUMBER("45.67")    // 45.67
num = TO_NUMBER("  89  ")   // 89 (whitespace trimmed)
num = TO_NUMBER("-10")      // -10

// Errors
num = TO_NUMBER("")         // Runtime Error: cannot convert empty string
num = TO_NUMBER("abc")      // Runtime Error: cannot convert 'abc' to number
num = TO_NUMBER(123)        // Runtime Error: requires a string argument
```

#### `TO_STRING(value)`
- **Returns**: String
- Converts any value to string representation
- Works with all types: null, boolean, number, string, array, object

**Examples:**
```javascript
str = TO_STRING(123)        // "123"
str = TO_STRING(45.67)      // "45.67"
str = TO_STRING(true)       // "true"
str = TO_STRING(false)      // "false"
str = TO_STRING(null)       // "null"
str = TO_STRING("hello")    // "hello" (already string)
str = TO_STRING([1, 2, 3])  // "[1,2,3]"
str = TO_STRING({x: 10})    // "{\"x\":10}"
```

#### `SLEEP(milliseconds)`
- **Returns**: null (after delay completes)
- Pauses execution for specified milliseconds
- **Async function**: Automatically awaited in async contexts
- Useful for delays, rate limiting, or simulating I/O operations

**Important Notes:**
- `SLEEP` is the only async built-in function currently
- User functions calling `SLEEP` become asynchronous automatically
- No explicit `async`/`await` keywords needed in user code
- The runtime handles Promise resolution transparently
- See [Section 18.1](#181-current-limitations) for async function details

**Examples:**
```javascript
PRINT("Starting...")
SLEEP(1000)              // Wait 1 second
PRINT("After 1 second")

// In multi blocks - each thread sleeps independently
multi
    task1() -> r1
    SLEEP(500)           // This thread sleeps
    task2() -> r2
end

// With user functions
function delayedTask(ms) do
    SLEEP(ms)
    return "Done"
end

result = delayedTask(2000)  // Waits 2 seconds
PRINT(result)            // "Done"
```

**Error cases:**
```javascript
SLEEP(-100)              // Runtime Error: duration cannot be negative
SLEEP("1000")            // Runtime Error: requires a number argument
```

### 9.4 Array Functions

#### `PUSH(array, ...values)`
- **Returns**: New array with values appended
- Original array is not modified (immutable)
- Can append multiple values at once

**Examples:**
```javascript
arr = [1, 2, 3]
arr = PUSH(arr, 4)          // [1, 2, 3, 4]
arr = PUSH(arr, 5, 6)       // [1, 2, 3, 4, 5, 6]

// Error: first argument must be an array
result = PUSH("not array", 1)  // Runtime Error
```

#### `POP(array)`
- **Returns**: New array with last element removed
- Original array is not modified (immutable)
- Throws error if array is empty

**Examples:**
```javascript
arr = [1, 2, 3, 4]
arr = POP(arr)              // [1, 2, 3]
arr = POP(arr)              // [1, 2]

// Error: cannot pop from empty array
empty = []
result = POP(empty)         // Runtime Error
```

#### `CONCAT(...arrays)`
- **Returns**: New array with all arrays concatenated
- All arguments must be arrays
- Original arrays are not modified (immutable)

**Examples:**
```javascript
arr1 = [1, 2]
arr2 = [3, 4]
arr3 = [5]
result = CONCAT(arr1, arr2, arr3)  // [1, 2, 3, 4, 5]

// Error: all arguments must be arrays
result = CONCAT([1, 2], "not array")  // Runtime Error
```

#### `SLICE(array, start, end?)`
- **Returns**: New array containing elements from start to end
- **start**: 1-based index (required)
- **end**: 1-based index (optional, defaults to array length)
- Original array is not modified (immutable)
- Uses 1-based indexing like rest of ProperTee

**Examples:**
```javascript
arr = [10, 20, 30, 40, 50]
result = SLICE(arr, 2, 4)   // [20, 30, 40]
result = SLICE(arr, 3)      // [30, 40, 50]
result = SLICE(arr, 1, 1)   // [10]

// Empty result if start > end
result = SLICE(arr, 4, 2)   // []
```

### 9.5 String Functions

#### `CHARS(string)`
- **Returns**: Array of strings (each character as a string)
- Converts string to array of characters
- Based on Unicode code points (not UTF-16 code units)

⚠️ **Note on complex characters:**
- Emoji with modifiers (e.g., "👍🏻") will be split into multiple elements
- "👍🏻" → ["👍", "🏻"] (thumbs up + skin tone modifier = 2 elements)
- This is technically correct as they are separate Unicode code points
- For grapheme cluster support (visual characters), external library would be needed

**Examples:**
```javascript
text = "Hello"
chars = CHARS(text)
PRINT(chars)                // ["H", "e", "l", "l", "o"]

// Iterate over characters
loop char in CHARS("ProperTee") do
    PRINT(char)
end
// P, r, o, p, e, r, T, e, e

// Emoji with modifiers are split
emoji = "👍🏻"
chars = CHARS(emoji)
PRINT(LEN(chars))           // 2 (base emoji + modifier)

// Count specific character
text = "ProperTee"
count = 0
loop char in CHARS(text) do
    if char == "e" then
        count = count + 1
    end
end
PRINT(count)                // 3
```

#### `SPLIT(string, delimiter)`
- **Returns**: Array of strings
- Splits string into array by delimiter
- Both arguments must be strings

**Examples:**
```javascript
// CSV parsing
csv = "apple,banana,cherry"
items = SPLIT(csv, ",")
PRINT(items)                // ["apple", "banana", "cherry"]

// Split by space
sentence = "Hello World Test"
words = SPLIT(sentence, " ")
loop word in words do
    PRINT(word)
end
// Hello, World, Test

// Split lines
text = "line1\nline2\nline3"
lines = SPLIT(text, "\n")
PRINT(LEN(lines))           // 3
```

#### `JOIN(array, separator)`
- **Returns**: String (joined elements)
- Joins array elements into a string
- First argument must be array
- Second argument must be string (default: empty string)

**Examples:**
```javascript
words = ["Hello", "World"]
text = JOIN(words, " ")
PRINT(text)                 // "Hello World"

// With comma
items = ["apple", "banana", "cherry"]
csv = JOIN(items, ",")
PRINT(csv)                  // "apple,banana,cherry"

// Without separator
letters = ["a", "b", "c"]
combined = JOIN(letters, "")
PRINT(combined)             // "abc"
```

#### `SUBSTRING(string, start, length?)`
- **Returns**: String (extracted substring)
- Extracts substring from string
- `start`: starting index (**1-based**)
- `length`: number of characters (optional, defaults to rest of string)

**Examples:**
```javascript
text = "ProperTee"
sub1 = SUBSTRING(text, 1, 6)
PRINT(sub1)                 // "Proper"

sub2 = SUBSTRING(text, 7)
PRINT(sub2)                 // "Tee"

// Extract first character
first = SUBSTRING(text, 1, 1)
PRINT(first)                // "P"
```

#### `UPPERCASE(string)`
- **Returns**: String (uppercase version)
- Converts string to uppercase
- Argument must be string

**Examples:**
```javascript
text = "Hello World"
upper = UPPERCASE(text)
PRINT(upper)                // "HELLO WORLD"

name = "alice"
formatted = UPPERCASE(name)
PRINT(formatted)            // "ALICE"
```

#### `LOWERCASE(string)`
- **Returns**: String (lowercase version)
- Converts string to lowercase
- Argument must be string

**Examples:**
```javascript
text = "Hello World"
lower = LOWERCASE(text)
PRINT(lower)                // "hello world"

NAME = "ALICE"
normalized = LOWERCASE(NAME)
PRINT(normalized)           // "alice"
```

#### `TRIM(string)`
- **Returns**: String (trimmed version)
- Removes whitespace from both ends of string
- Argument must be string

**Examples:**
```javascript
text = "  hello  "
trimmed = TRIM(text)
PRINT(trimmed)              // "hello"

input = "\n\t  test  \n"
cleaned = TRIM(input)
PRINT(cleaned)              // "test"
```

### 9.6 Custom Functions

Custom functions can be injected via constructor:

```javascript
const customFunctions = {
    'DOUBLE': (n) => n * 2,
    'GREET': (name) => `Hello, ${name}!`
};

const visitor = new ProperTeeCustomVisitor(
    {},
    customFunctions,
    {}
);
```

---

## 10. Literals

### 10.1 Number Literals

- Integer: `42`, `-7`, `0`
- Decimal: `3.14`, `-0.5`
- Scientific notation: Not supported

### 10.2 String Literals

- Enclosed in double quotes: `"hello"`
- Escape sequences: `\"` (quote), `\\` (backslash)
- No template strings or interpolation

### 10.3 Boolean Literals

- `true`
- `false`

### 10.4 Null Literal

- `null`

### 10.5 Object Literals

**Syntax:** `{key: value, key2: value2}`

- Keys can be identifiers, strings, or numbers
- Values can be any expression

**Examples:**
```javascript
obj1 = {name: "Alice", age: 30}
obj2 = {"full-name": "Bob Smith", 0: "first"}
obj3 = {x: 1, y: 2, nested: {a: 10}}
```

### 10.6 Array Literals

**Syntax:** `[value1, value2, value3]`

- Values can be any expression

**Examples:**
```javascript
arr1 = [1, 2, 3]
arr2 = ["apple", "banana", "cherry"]
arr3 = [1, "mixed", true, null]
arr4 = [[1, 2], [3, 4]]  // Nested arrays
```

---

## 11. Comments

ProperTee supports two types of comments:

### 11.1 Single-Line Comments

**Syntax:** `// comment text`

- Starts with `//`
- Continues until the end of the line
- Ignored during parsing

**Examples:**
```javascript
// This is a single-line comment
x = 10  // Comment after code

// Multiple single-line comments
// can be used for longer explanations
```

### 11.2 Block Comments

**Syntax:** `/* comment text */`

- Starts with `/*`
- Ends with `*/`
- Can span multiple lines
- Ignored during parsing

**Examples:**
```javascript
/* This is a block comment */
x = 10

/*
This is a multi-line
block comment
*/
y = 20

z = /* inline comment */ 30
```

**Note:** Block comments do **not** nest. The first `*/` closes the comment.

```javascript
/* outer /* inner */ still in comment? */  // ⚠️ Closes at first */
```

---

## 12. Configuration Options

### 11.1 Constructor Signature

```javascript
new ProperTeeCustomVisitor(
    builtInProperties,    // Object: External properties
    builtInFunctions,     // Object: Custom functions
    ioStreams,           // Object: I/O redirection
    options              // Object: Runtime options
)
```

### 11.2 Available Options

#### `maxIterations` (number, default: 1000)
- Maximum loop iterations before limit action
- Set to `Infinity` to disable limit globally (not recommended)

#### `iterationLimitBehavior` (string, default: 'error')
- **'error'** (default): Throw runtime error and stop execution completely
- **'warn'**: Output warning to stderr, break loop, continue execution

#### `maxCallDepth` (number, default: 1000)
- Maximum function call depth (recursion limit)
- Prevents stack overflow from infinite recursion
- Can be overridden per-function using `infinite` keyword
- Set to `Infinity` to disable limit globally (not recommended)

**Examples:**
```javascript
// Error mode (default) - strict
const visitor = new ProperTeeCustomVisitor({}, {}, {}, {
    maxIterations: 1000,
    iterationLimitBehavior: 'error'  // or omit (default)
});

// Warning mode - lenient
const visitor = new ProperTeeCustomVisitor({}, {}, {}, {
    maxIterations: 1000,
    iterationLimitBehavior: 'warn'
});

// Custom iteration limit with error mode
const visitor = new ProperTeeCustomVisitor({}, {}, {}, {
    maxIterations: 5000,
    iterationLimitBehavior: 'error'
});
```

---

## 13. Implementation Notes

### 12.1 Null vs Undefined

- `null` is a **valid value** in ProperTee
- JavaScript `undefined` should **NEVER** be returned to ProperTee scripts
- Internal implementation may use `undefined`, but runtime must convert to errors

### 12.2 JavaScript Interop

When embedding ProperTee in JavaScript:

**Passing data in:**
```javascript
const properties = {
    user: { name: "Alice", score: 100 },
    config: { debug: true }
};

const visitor = new ProperTeeCustomVisitor(properties, {}, {});
```

**Custom functions:**
```javascript
const functions = {
    'LOG': (msg) => console.log('[LOG]', msg),
    'NOW': () => Date.now()
};
```

**I/O redirection:**
```javascript
const output = [];
const ioStreams = {
    stdout: (...args) => output.push(args.join(' ')),
    stderr: (...args) => console.error(...args)
};
```

### 12.3 Error Handling in JavaScript

ProperTee runtime errors throw JavaScript `Error` objects:

```javascript
try {
    const result = visitor.visit(tree);
} catch (e) {
    console.error('Runtime Error:', e.message);
}
```

### 12.4 Return Statement Implementation

The `return` statement can exit both functions and top-level scripts. Implementation should use an exception mechanism:

**ReturnException Class:**
```javascript
class ReturnException extends Error {
    constructor(value) {
        super('Return');
        this.name = 'ReturnException';
        this.value = value;
    }
}
```

**Return Statement Handler:**
```javascript
visitReturnStmt(ctx) {
    const value = ctx.expression() 
        ? this.visit(ctx.expression()) 
        : null;
    throw new ReturnException(value);
}
```

**Function Execution:**
```javascript
callUserFunction(funcName, args) {
    const funcDef = this.userDefinedFunctions[funcName];
    
    // Parameter binding and scope management
    this.scopeStack.push(localScope);
    
    try {
        // Execute function body
        let lastValue = null;
        for (let stmt of body.statement()) {
            lastValue = this.visit(stmt);
        }
        return lastValue;  // Implicit return
    } catch (e) {
        if (e instanceof ReturnException) {
            return e.value;  // Explicit return
        }
        throw e;  // Re-throw other errors
    } finally {
        this.scopeStack.pop();  // Always restore scope
    }
}
```

**Note:** ProperTee does not implement artificial recursion limits. Recursion is limited only by the host language's stack size.

**Function Definition Storage:**
```javascript
visitFuncDefStmt(ctx) {
    const funcName = ctx.funcName.text;
    const params = this.extractParams(ctx.parameterList());
    const hasInfinite = ctx.K_INFINITE() !== null;  // Check for infinite keyword
    
    this.functions[funcName] = {
        params: params,
        body: ctx.block(),
        infinite: hasInfinite  // Store infinite flag
    };
    
    return null;
}
```

**Visitor Constructor:**
```javascript
constructor(properties, globalVars, ioStreams, options = {}) {
    this.properties = properties;
    this.ioStreams = ioStreams;
    this.scopeStack = [];
    this.variables = globalVars || {};
    this.userDefinedFunctions = {};
    
    // Loop tracking
    this.maxIterations = options.maxIterations || 1000;
    this.iterationLimitBehavior = options.iterationLimitBehavior || 'warn';
}
```

**Top-Level Script Execution:**
```javascript
// Entry point
function executeScript(tree) {
    try {
        const visitor = new ProperTeeCustomVisitor(...);
        
        let lastValue = null;
        const statements = tree.statement();
        
        for (let stmt of statements) {
            lastValue = visitor.visit(stmt);
        }
        
        return lastValue;  // Implicit return
    } catch (e) {
        if (e instanceof ReturnException) {
            return e.value;  // Explicit return from script
        }
        throw e;  // Runtime error
    }
}
```

**Usage Example:**
```javascript
// Script with early return
const script = `
    config = loadConfig()
    if config == null then
        return "Config not found"
    end
    return processConfig(config)
`;

const result = executeScript(parseScript(script));
console.log(result);  // "Config not found" or processed result
```

---

## 14. Complete Examples

### 13.1 Valid Programs

#### Example 1: Basic Arithmetic
```javascript
x = 10
y = 20
sum = x + y
diff = x - y
product = x * y
quotient = y / x

PRINT("Sum:", sum)           // Sum: 30
PRINT("Difference:", diff)   // Difference: -10
PRINT("Product:", product)   // Product: 200
PRINT("Quotient:", quotient) // Quotient: 2
```

#### Example 2: Object Manipulation
```javascript
person = {name: "Alice", age: 30}
person.city = "Seoul"        // Add new property
person.age = 31             // Update property

PRINT(person.name)          // Alice
PRINT(person.age)           // 31
PRINT(person.city)          // Seoul
```

#### Example 3: Array Iteration
```javascript
numbers = [1, 2, 3, 4, 5]
sum = 0

loop num in numbers do
    sum = sum + num
end

PRINT("Sum:", sum)          // Sum: 15
```

#### Example 4: Conditional with Null Check
```javascript
obj = null

if obj != null then
    PRINT(obj.value)
else
    PRINT("Object is null")  // This executes
end
```

#### Example 5: Finding Even Numbers
```javascript
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

loop idx, num in numbers do
    if num % 2 == 0 then
        PRINT("Even number at index", idx, ":", num)
    end
end
```

#### Example 6: String Processing with CHARS
```javascript
// Count vowels
text = "ProperTee"
vowels = CHARS("aeiouAEIOU")
vowelCount = 0

loop char in CHARS(text) do
    loop vowel in vowels do
        if char == vowel then
            vowelCount = vowelCount + 1
            break
        end
    end
end

PRINT("Vowel count:", vowelCount)  // 4
```

#### Example 7: CSV Processing with SPLIT
```javascript
// Parse CSV data
csv = "name,age,city\nAlice,30,Seoul\nBob,25,Busan"
lines = SPLIT(csv, "\n")

// Skip header
firstLine = true
loop line in lines do
    if firstLine then
        firstLine = false
        continue
    end
    
    columns = SPLIT(line, ",")
    name = columns.1
    age = columns.2
    city = columns.3
    
    PRINT(name, "is", age, "years old and lives in", city)
end
// Alice is 30 years old and lives in Seoul
// Bob is 25 years old and lives in Busan
```

#### Example 8: String Formatting
```javascript
// Capitalize first letter
name = "alice"
firstChar = SUBSTRING(name, 1, 1)
restChars = SUBSTRING(name, 2)
formatted = UPPERCASE(firstChar) + LOWERCASE(restChars)
PRINT(formatted)  // "Alice"

// Create acronym
words = SPLIT("ProperTee Execution Engine", " ")
acronym = ""
loop word in words do
    firstLetter = SUBSTRING(word, 1, 1)
    acronym = acronym + UPPERCASE(firstLetter)
end
PRINT(acronym)  // "PEE"
```

#### Example 9: Top-Level Return (Script Exit)
```javascript
// Early exit from script
config = loadConfiguration()

if config == null then
    PRINT("ERROR: Configuration not found")
    return null              // Exit script, return null
end

if config.disabled then
    PRINT("INFO: Feature is disabled")
    return "disabled"        // Exit script, return status
end

// Continue if not returned
result = processWithConfig(config)
PRINT("Result:", result)
return result               // Normal script completion
```

#### Example 10: Validation Script
```javascript
// Input validation script
input = getInput()

// Check empty
if input == null or input == "" then
    return {error: "Input required", code: 400}
end

// Check length
if LEN(input) > 100 then
    return {error: "Input too long", code: 413}
end

// All checks passed
return {success: true, value: input}
```

### 13.2 Error Cases

#### Error 1: Division by Zero
```javascript
x = 10 / 0
// ❌ Runtime Error: Division by zero
```

#### Error 2: Undefined Variable
```javascript
PRINT(unknownVar)
// ❌ Runtime Error: Variable 'unknownVar' is not defined
```

#### Error 3: Non-existent Property
```javascript
obj = {name: "Test"}
PRINT(obj.age)
// ❌ Runtime Error: Property 'age' does not exist
```

#### Error 4: Type Mismatch in Addition
```javascript
result = "hello" + 5
// ❌ Runtime Error: Addition requires both operands to be numbers or both to be strings

result = 5 + "hello"
// ❌ Runtime Error: Addition requires both operands to be numbers or both to be strings
```

#### Error 5: Type Mismatch in Arithmetic
```javascript
result = "10" - 5
// ❌ Runtime Error: Subtraction requires numeric operands

result = "5" * 2
// ❌ Runtime Error: Arithmetic operator '*' requires numeric operands

result = true / false
// ❌ Runtime Error: Arithmetic operator '/' requires numeric operands
```

#### Error 6: Null Access
```javascript
obj = null
PRINT(obj.name)
// ❌ Runtime Error: Cannot access property 'name' of null
```

#### Error 7: Type Mismatch in Comparison
```javascript
result = "10" > 5
// ❌ Runtime Error: Comparison operator '>' requires numeric operands

result = true >= false
// ❌ Runtime Error: Comparison operator '>=' requires numeric operands
```

#### Error 8: Type Mismatch in Logical Operators
```javascript
result = 1 and 0
// ❌ Runtime Error: Logical AND requires boolean operands

result = "hello" or ""
// ❌ Runtime Error: Logical OR requires boolean operands

result = not 0
// ❌ Runtime Error: Logical NOT requires boolean operand
```

#### Error 9: Type Mismatch in Unary Minus
```javascript
result = -"5"
// ❌ Runtime Error: Unary minus requires numeric operand

result = -true
// ❌ Runtime Error: Unary minus requires numeric operand
```

#### Error 10: Loop Limit Exceeded (Default)
```javascript
// Default behavior (iterationLimitBehavior: 'error')

counter = 0
loop counter < 10000 do
    counter = counter + 1
end
// ❌ Runtime Error: Loop exceeded maximum iterations (1000)
```

#### Error 11: Stack Overflow (Deep Recursion)
```javascript
// Deep recursion exceeds host language stack limit
function deepRecursion(n) do
    if n <= 0 then
        return 0
    end
    return 1 + deepRecursion(n - 1)
end

deepRecursion(10000)
// ❌ RangeError: Maximum call stack size exceeded
//    (Host language's stack limit - typically ~500-15,000)
```

#### Warning 1: Loop Limit Exceeded (Warning Mode)
```javascript
// With iterationLimitBehavior: 'warn'

counter = 0
loop counter < 10000 do
    counter = counter + 1
end
// ⚠️ Warning: Loop exceeded maximum iterations (1000), stopping loop
// Execution continues

PRINT("Counter after loop:", counter)  // ✅ Prints: Counter after loop: 1001
```

---

## 15. Concurrency and Threading

ProperTee provides structured concurrency primitives for multi-threaded execution, designed for I/O-bound tasks with emphasis on safety and simplicity over performance.

### 15.1 Core Concepts

#### Thread Safety Philosophy
- **Explicit over implicit**: All shared resources must be declared
- **Safety over performance**: Automatic deadlock prevention through alphabetical lock ordering
- **Simplicity over flexibility**: Fixed thread count, no dynamic parallelism
- **Clarity over brevity**: No nested function calls in multi blocks

---

### 15.2 SHARED Declaration

**Syntax:**
```javascript
shared var1, var2, ...
shared var3 = initialValue
```

**Rules:**
- ✅ Only allowed in **global scope** (not inside functions)
- ✅ Can include optional initialization with `=` operator
- ✅ Variables without initialization default to `null`
- ✅ Multiple variables can be declared on separate lines
- ❌ Cannot declare multiple variables with initialization on same line
- ❌ Cannot be declared inside functions or blocks

**Important Notes:**
- Initialization expressions are evaluated at declaration time
- Each `shared` statement declares one or more variables
- Variables can be initialized with any valid expression (literals, arrays, objects, etc.)

**Examples:**
```javascript
// ✅ Valid - single declaration with initialization
shared counter = 0
shared accounts = []
shared data = {total: 0, count: 0}

// ✅ Valid - without initialization (defaults to null)
shared temp
shared cache

// ✅ Valid - multiple uninitialized variables
shared temp, cache, buffer

// ✅ Valid - separate declarations
shared counter = 0
shared results = []

// ❌ Invalid - multiple initializations on same line
shared counter = 0, results = []  // Parser Error

// ❌ Invalid - inside function
function worker() do
    shared local = 0  // Runtime Error: SHARED only allowed in global scope
end
```

**Error cases:**
- Declaring SHARED inside a function → **Runtime Error**
- Accessing non-SHARED variable from multiple threads → Race condition (undefined behavior)

---

### 15.3 USES Clause

**Syntax:**
```javascript
function name(params) uses resource1, resource2 do
    // function body
end
```

**Rules:**
- ✅ Declares which SHARED resources the function will access
- ✅ Only resources listed in USES can be accessed
- ✅ All listed resources must be declared with `shared`
- ✅ Function acquires **all locks in alphabetical order** before entry
- ✅ All locks released on function exit (normal or error)

**Lock Acquisition:**
1. Sort USES resources alphabetically
2. Acquire locks in sorted order (prevents deadlock)
3. Execute function body
4. Release all locks

**Examples:**
```javascript
shared counter, data

// ✅ Valid - declares USES
function increment(n) uses counter do
    counter = counter + n
    return counter
end

// ✅ Valid - multiple resources
function update(value) uses counter, data do
    counter = counter + 1
    data.values = data.values + [value]
end

// ✅ Valid - no USES (thread-local only)
function calculate(n) do
    result = n * 2
    return result
end

// ❌ Runtime Error - accessing SHARED without USES
function bad() do
    counter = counter + 1  // Runtime Error: 'counter' is SHARED but not in USES clause
end
```

**Validation:**
- USES validation occurs at **function definition time**
- Runtime Error if USES references non-SHARED variable
- Runtime Error if function accesses SHARED variable not in USES

**Deadlock Prevention:**
```javascript
shared account1, account2

// Both functions acquire locks in same order: account1 → account2
function transferAtoB() uses account1, account2 do
    // Locks: account1 first, then account2
    // ...
end

function transferBtoA() uses account2, account1 do
    // Automatically sorted: account1 first, then account2
    // No deadlock possible!
end
```

---

### 15.4 MULTI...END Blocks

**Syntax:**
```javascript
multi
    functionCall() -> result1
    functionCall() -> result2
    functionCall()  // no return value
end
```

**Execution Model:**
1. Enter MULTI block
2. Spawn thread for each function call
3. All threads execute in parallel
4. END waits for all threads to complete (join)
5. Collect results and assign to variables (using `->`)
6. Continue to next statement

**Rules:**

#### ✅ Allowed in MULTI block:
- **Thread function calls** with result assignment: `threadFunc(args) -> r`
- Thread function calls without assignment: `threadFunc(args)`
- Reading variables defined **before** MULTI block
- Built-in async functions (e.g., `SLEEP`)

#### ❌ Prohibited in MULTI block:
- **Regular functions** (only threads allowed)
- Result variable usage: `work2(r1) -> r2` where `r1` is a result variable
- Control flow statements (`if`, `loop`)
- Nested function calls: `func(helper()) -> r`
- Arithmetic or logical operations
- Variable assignments other than via `->`
- Nested MULTI blocks

**Thread Declaration:**
```javascript
// ✅ Thread - can be called in multi
thread worker(n) uses counter do
    counter = counter + n
    return counter
end

// ❌ Regular function - cannot be called in multi
function helper(x) do
    return x * 2
end

multi
    worker(10) -> r1     // ✅ OK
    helper(20) -> r2     // ❌ Runtime Error: not a thread
end
```

**Examples:**

**✅ Valid:**
```javascript
x = 10
multi
    task1(x) -> r1       // reads x from before block
    task2() -> r2         
    task3()              // return value ignored
end
PRINT(r1, r2)            // use results after end
```

**❌ Invalid:**
```javascript
multi
    if condition then    // ❌ Syntax Error: control flow not allowed
        task1() -> r1
    end
    
    loop i in items do   // ❌ Syntax Error: loop not allowed
        task(i)
    end
    
    task2(helper()) -> r2  // ❌ Syntax Error: nested function call
    
    PRINT(r1)            // ❌ Syntax Error: cannot use r1 inside MULTI
    
    task3() -> r3
    task4() -> r3        // ❌ Syntax Error: duplicate variable assignment
end
```

**Result Variable Protection:**
```javascript
multi
    work1() -> r1
    work2(r1) -> r2      // ❌ Runtime Error: r1 is not available yet
end

// ✅ Correct: use results after end
multi
    work1() -> r1
    work2() -> r2
end
process(r1, r2)          // ✅ OK - after end
```

**Variable Scope:**
```javascript
x = 10               // defined before MULTI

multi
    task1(x) -> r1   // ✅ can read x
    task2() -> r2    // r2 declared but not yet assigned
    // PRINT(r2)     // ❌ cannot use r2 here
end

// end performs: r1 = (result of task1), r2 = (result of task2)

PRINT(r1, r2)        // ✅ can use r1, r2 after end
```

---

### 15.5 Thread-Local Variables

**Automatic Thread-Local Storage:**
- Variables created inside a function are automatically thread-local
- Each thread has its own copy
- No sharing between threads
- Variables destroyed when thread exits

**Examples:**
```javascript
shared counter

thread worker(input) uses counter do
    temp = input * 2      // thread-local (independent per thread)
    result = temp + 10    // thread-local
    counter = counter + result  // shared (synchronized)
    return result
end

multi
    worker(5) -> r1   // r1's thread has temp=10, result=20
    worker(10) -> r2  // r2's thread has temp=20, result=30
end
// Each thread's temp and result are independent
```

---

### 15.6 MONITOR Blocks

**Purpose:**
Monitor blocks allow real-time observation of SHARED variables and global variables during multi-threaded execution without blocking the main tasks.

**Syntax:**
```javascript
multi
    work1() -> r1
    work2() -> r2
monitor INTERVAL
    // monitoring statements
end
```

**Execution Model:**
1. Monitor block executes periodically at specified interval (milliseconds)
2. Runs independently without blocking multi tasks
3. Executes one final time after all tasks complete
4. Provides dirty read access to SHARED variables (no locks)

**Rules:**

#### ✅ Allowed in MONITOR block:
- **Read SHARED variables** (dirty read - no lock)
- **Read global variables** (snapshot)
- **Print statements** (PRINT, etc.)
- **Pure computations** (no side effects)

#### ❌ Prohibited in MONITOR block:
- **Variable assignments** (read-only context)
- **Access result variables** (r1, r2, etc.)
- **Access thread-local variables**
- **Modify any state**

**Examples:**

**Progress Tracking:**
```javascript
shared processed = 0
shared total = 100

thread process(item) uses processed do
    doWork(item)
    processed = processed + 1
end

multi
    loop i in 1..100 do
        process(i)
    end
monitor 1000
    percent = (processed / total) * 100
    PRINT("Progress:", percent, "%")
end
// Output every 1 second
// Final output guaranteed: "Progress: 100%"
```

**Error Tracking:**
```javascript
shared errors = []
shared completed = 0

thread task(id) uses errors, completed do
    if validateTask(id) == false then
        errors = PUSH(errors, "Task " + id + " failed")
    end
    completed = completed + 1
end

multi
    task(1) -> r1
    task(2) -> r2
    task(3) -> r3
monitor 500
    PRINT("Completed:", completed, "Errors:", LEN(errors))
end
// Monitors progress every 500ms
// Final status printed after all tasks complete
```

**Global + SHARED Variables:**
```javascript
startTime = NOW()  // Global variable
shared counter = 0

thread work(n) uses counter do
    SLEEP(1000)
    counter = counter + n
end

multi
    work(10) -> r1
    work(20) -> r2
monitor 500
    elapsed = NOW() - startTime  // Read global
    PRINT("Time:", elapsed, "Counter:", counter)
end
```

**Read-Only Enforcement:**
```javascript
shared counter = 0

multi
    work() -> r1
monitor 500
    // ❌ Error: Cannot assign in monitor
    counter = counter + 1
    
    // ❌ Error: Cannot access result variable
    PRINT(r1)
    
    // ✅ OK: Read-only access
    temp = counter
    PRINT("Counter:", temp)
end
```

**Key Characteristics:**

1. **Non-blocking**: Monitor does not acquire locks on SHARED variables
2. **Dirty Read**: May see inconsistent intermediate states
3. **Final Execution**: Always runs once more after all tasks complete
4. **Error Isolation**: Monitor errors don't stop main tasks
5. **Read-Only**: Cannot modify any variables

**Use Cases:**
- Real-time progress tracking
- Performance monitoring
- Error count tracking
- Debugging concurrent execution
- Live status dashboards

---

### 15.7 Error Handling in Threads

**Error Behavior:**
- Error in one thread **does not stop other threads**
- Failed thread returns `null`
- Error logged to `stderr` with line number and thread info
- END waits for all threads (including failed ones)

**Examples:**
```javascript
thread mayFail(n) do
    if n == 0 then
        x = 10 / 0  // Runtime Error
    end
    return n * 2
end

multi
    mayFail(5) -> r1   // ✅ succeeds, r1 = 10
    mayFail(0) -> r2   // ❌ fails, r2 = null
    mayFail(10) -> r3  // ✅ succeeds, r3 = 20
end

PRINT(r1, r2, r3)  // Output: 10, null, 20
```

**Error Log Format:**
```
Runtime Error at line 3:8: Division by zero
  in function mayFail
  in thread 2 of MULTI block at line 7
```

---

### 15.7 Execution Outside MULTI

**Normal function calls (without MULTI):**
- Execute **synchronously** (not in a thread)
- Caller waits for completion
- Return value available immediately

**Examples:**
```javascript
function task(n) do
    return n * 2
end

// Synchronous execution
r1 = task(10)     // waits for completion
PRINT(r1)         // 20

r2 = task(20)     // waits for completion
PRINT(r2)         // 40

// Multi-threaded execution
multi
    task(30) -> r3
    task(40) -> r4
end
PRINT(r3, r4)     // 60, 80
```

---

### 15.8 Complete Threading Example

```javascript
shared accounts, logs

accounts = [
    {id: 1, balance: 1000},
    {id: 2, balance: 500},
    {id: 3, balance: 750}
]
logs = []

// Transfer money between accounts (thread)
thread transfer(fromIdx, toIdx, amount) uses accounts, logs do
    // Locks acquired: accounts, logs (alphabetical order)
    
    fromAccount = accounts.$fromIdx
    toAccount = accounts.$toIdx
    
    if fromAccount.balance < amount then
        return false
    end
    
    fromAccount.balance = fromAccount.balance - amount
    toAccount.balance = toAccount.balance + amount
    
    logEntry = "Transfer " + amount + " from " + fromIdx + " to " + toIdx
    logs = PUSH(logs, logEntry)
    
    return true
end

// Calculate and add interest (thread)
thread addInterest(accountIdx, rate) uses accounts do
    // Lock acquired: accounts only
    
    account = accounts.$accountIdx
    interest = account.balance * rate
    account.balance = account.balance + interest
    return interest
end

// Multi-threaded execution
multi
    transfer(1, 2, 100) -> t1      // Transfer $100 from account 1 to 2
    transfer(2, 3, 50) -> t2       // Transfer $50 from account 2 to 3
    addInterest(1, 0.05) -> i1     // 5% interest on account 1
    addInterest(2, 0.05) -> i2     // 5% interest on account 2
    addInterest(3, 0.05) -> i3     // 5% interest on account 3
end

// Results available after end
PRINT("Transfers successful:", t1, t2)
PRINT("Interest added:", i1, i2, i3)

// Print logs
loop log in logs do
    PRINT(log)
end

// Print final balances
loop account in accounts do
    PRINT("Account", account.id, "balance:", account.balance)
end
```

---

### 15.9 Design Constraints and Rationale

#### Why no conditional/loop parallelism?

**Problem with conditionals:**
```javascript
// ❌ Not allowed - variable may not be defined
multi
    task1() -> r1
end
PRINT(r1)  // r1 might not exist!
```

**Problem with loops:**
```javascript
// ❌ Not allowed - variable collision, unpredictable thread count
multi
    loop i in items do
        task(i) -> r  // which r? how many threads?
    end
end
```

**Solution:** Fixed, explicit thread count for clarity and safety.

#### Why no nested function calls?

**Problem with nested calls:**
```javascript
// ❌ Not allowed
multi
    task(helper()) -> r  // When does helper() run? What locks?
end
```

**Issues:**
1. Execution timing ambiguous (before MULTI? inside thread?)
2. Lock acquisition unpredictable
3. Can break alphabetical lock ordering → deadlock risk
4. Error tracking becomes complex

**Solution:** Force explicit evaluation:
```javascript
// ✅ Correct approach
temp = helper()
multi
    task(temp) -> r
end
```

#### Why alphabetical lock ordering?

**Prevents deadlock automatically:**
- All threads acquire locks in same order
- No circular wait possible
- User doesn't need to think about lock ordering

**Trade-off:**
- Less granular control
- May reduce parallelism in some cases
- But: **guarantees safety** without user effort

#### Why function-scope locks?

**Simplicity over performance:**
- Clear lock boundaries (function entry/exit)
- No need for manual lock/unlock
- Automatic cleanup on error
- Prevents forget-to-unlock bugs

**For fine-grained locking:**
- Create small wrapper functions
- Each wrapper has minimal lock scope

---

### 15.10 Threading Error Reference

| Error | When | Example |
|-------|------|---------|
| SHARED in function | SHARED declared inside function | `function f() do shared x end` |
| USES non-SHARED | USES references undeclared variable | `function f() uses x do` (x not SHARED) |
| Access without USES | Function accesses SHARED not in USES | `counter = counter + 1` without `uses counter` |
| Control flow in MULTI | if/loop in MULTI block | `multi if c then task() end end` |
| Nested call in MULTI | Function call in arguments | `multi f(g()) -> r end` |
| Variable use in MULTI | Using result variable inside MULTI | `multi f() -> r PRINT(r) end` |
| Duplicate assignment | Same variable assigned twice | `multi f1() -> r f2() -> r end` |
| Nested MULTI | MULTI inside MULTI | `multi function f() multi ... end end` |

---

## 16. Reserved Keywords

The following keywords are reserved and cannot be used as variable names:

- `if`, `then`, `else`, `end`
- `loop`, `in`, `do`, `infinite`
- `break`, `continue`
- `function`, `thread`, `return`
- `and`, `or`, `not`
- `true`, `false`, `null`
- `shared`, `uses`, `multi`, `monitor` (for concurrency)

**Note:** `infinite` is reserved for loop statements only (not for functions).

---

## 17. Operator Precedence

From highest to lowest priority:

1. Member access (`.`)
2. Unary operators (`-`, `not`)
3. Multiplicative (`*`, `/`, `%`)
4. Additive (`+`, `-`)
5. Comparison (`>`, `<`, `==`, `>=`, `<=`, `!=`)
6. Logical AND (`and`)
7. Logical OR (`or`)

Use parentheses `()` to override precedence.

---

## 18. Future Considerations

### 18.1 Current Limitations

#### Variadic Functions (가변 인자 함수)

**Status:** Not yet implemented for user-defined functions

**Current State:**
- ✅ Built-in functions support variadic arguments (`PUSH`, `CONCAT`, `PRINT`)
- ❌ User-defined functions have fixed parameter count

**Examples:**
```javascript
// ✅ Built-in - Works
PRINT("Value:", 1, 2, 3)          // Variable arguments
result = PUSH(arr, 10, 20, 30)    // Variable arguments
combined = CONCAT(arr1, arr2, arr3) // Variable arguments

// ❌ User function - Not supported yet
function sum(...numbers) do       // Syntax not available
    total = 0
    loop n in numbers do
        total = total + n
    end
    return total
end
```

**Current Workaround:**
```javascript
// Use arrays to pass multiple values
function sum(numbers) do
    total = 0
    loop n in numbers do
        total = total + n
    end
    return total
end

result = sum([1, 2, 3, 4, 5])  // Pass as array
```

**Planned Syntax:**
```javascript
function sum(...numbers) do
    // numbers is an array
end

function format(template, ...values) do
    // template is required, values is variadic
end
```

---

#### Async Function Declaration

**Status:** Not yet implemented (but implicitly supported)

**Current State:**
- ✅ Built-in `SLEEP` is async and properly awaited
- ✅ User functions can call async built-ins (implicitly handled)
- ❌ No explicit `async` keyword for user functions
- ❌ No explicit `await` keyword in user code

**Examples:**
```javascript
// ✅ Works now (implicitly async)
function delayedTask() do
    SLEEP(1000)      // Automatically awaited by runtime
    return "Done"
end

result = delayedTask()  // Blocks until complete
PRINT(result)           // "Done"

// ❌ Cannot explicitly declare async (future syntax)
async function fetchData() do
    data = await FETCH(url)  // await keyword not available
    return data
end
```

**Current Behavior:**
- All function calls are automatically awaited if they return Promises
- No explicit async/await syntax needed
- This is handled internally by the visitor
- Functions calling `SLEEP` or other async built-ins become async automatically

**Why No Explicit Async?**
1. **Simplicity**: Users don't need to think about async/await
2. **Consistency**: All functions behave the same way
3. **Future-proof**: Can add explicit async later without breaking changes

**Planned Enhancement:**
```javascript
// Future: Explicit async declarations
async function fetchData() do
    data = await FETCH(url)
    return data
end

// Future: Parallel async calls
async function loadAll() do
    // Run in sequence
    data1 = await fetch1()
    data2 = await fetch2()
    
    // Or use MULTI for parallel
    multi
        fetch1() -> data1
        fetch2() -> data2
    end
end
```

---

### 18.2 Other Planned Features

Features that may be added in future versions:

**Type System:**
- [ ] Type conversion functions (`TO_NUMBER`, `TO_STRING`, etc.) - Partially implemented
- [ ] Optional chaining operator (`?.`)
- [ ] Safe property check function (`HAS(obj, "property")`)

**Functions:**
- [x] Function definitions (user-defined functions) - ✅ Implemented
- [ ] Anonymous functions / Lambdas
- [ ] First-class functions (functions as values)
- [ ] Closures (capturing local variables)
- [ ] Function overloading
- [ ] Default parameter values
- [ ] **Variadic arguments** (`...args`) - See Section 18.1
- [ ] **Explicit async/await** - See Section 18.1

**Data Structures:**
- [x] Array manipulation functions (`PUSH`, `POP`, `SLICE`, `CONCAT`) - ✅ Implemented
- [x] String manipulation functions (`SPLIT`, `JOIN`, `SUBSTRING`, etc.) - ✅ Implemented

**Language Features:**
- [x] Comments in code - ✅ Implemented (single-line `//` and block `/* */`)
- [ ] Import/Export system
- [ ] Exception handling (`try/catch/finally`)

**Concurrency:**
- [x] **Basic concurrency features** - ✅ Implemented (v1.1)
  - [x] `shared` variables
  - [x] `thread` functions
  - [x] `multi` blocks
  - [x] `monitor` blocks
  - [x] Automatic deadlock prevention
  
- **Future concurrency enhancements:**
  - [ ] `READONLY` access modifier for shared resources
  - [ ] `SPAWN` keyword for async execution outside MULTI
  - [ ] Thread introspection (THREAD_ID, THREAD_COUNT)
  - [ ] Fine-grained locking (per-array-element)
  - [ ] Channels for thread communication
  - [ ] Thread pools and worker management

---

## Appendix A: Grammar Summary

For the complete ANTLR4 grammar, see `ProperTee.g4`.

Key grammar rules:
- `root`: Top-level entry point
- `statement`: Assignments, if, loop, function definitions, multi blocks, shared declarations, expressions
- `sharedDecl`: SHARED resource declarations (global scope only)
- `functionDef`: Regular user-defined functions with parameters
- `threadDef`: Thread functions with parameters and optional USES clause
- `usesClause`: Declares which SHARED resources a thread accesses
- `parallelStmt`: MULTI...END blocks for concurrent execution
- `parallelTask`: Function calls within MULTI blocks (with or without assignment)
- `monitorClause`: MONITOR block for real-time observation
- `iterationStmt`: Loop with optional `infinite` keyword
- `flowControl`: break, continue, return
- `expression`: Operators, member access, atoms
- `atom`: Literals (number, string, boolean, null, object, array), function calls

**Threading Syntax:**
```
shared var1 = init1, var2 = init2       // Shared resource declaration
function name(params) do ... end        // Regular function
thread name(params) uses res1, res2 do ... end  // Thread function
multi                                   // Multi-threaded execution block
    func1(args) -> result1
    func2(args) -> result2
monitor interval
    // monitoring statements
end
```

**Function Definition Syntax:**
```
function name(params) do ... end                // Regular functions
thread name(params) uses res do ... end         // Threads (for multi)
```

---

## Appendix B: Version History

### Version 1.1 (2026-01-31)
- **Added**: Concurrency and Threading (Section 15)
  - `shared` declaration for shared resources
  - `uses` clause for threads accessing shared resources
  - `thread` keyword for functions that can run in multi blocks (changed from `thread function`)
  - `multi...end` blocks with `->` operator for result assignment (changed from `parallel`)
  - `monitor` blocks for real-time progress tracking (dirty read, read-only)
  - Automatic deadlock prevention through alphabetical lock ordering
  - Thread-local variables
  - Error handling in multi contexts
  - Result variable usage validation in MULTI blocks
- **Added**: Array manipulation functions (Section 9.4)
  - `PUSH(array, ...values)` - Append values to array
  - `POP(array)` - Remove last element from array
  - `CONCAT(...arrays)` - Concatenate multiple arrays
  - `SLICE(array, start, end?)` - Extract subarray
- **Added**: Type conversion functions (Section 9.3)
  - `TO_NUMBER(string)` - Convert string to number
  - `TO_STRING(value)` - Convert any value to string
- **Added**: Async functions (Section 9.3)
  - `SLEEP(milliseconds)` - Pause execution with async/await support
- **Added**: New reserved keywords: `shared`, `uses`, `multi`, `thread`, `monitor`
- **Changed**: Thread declaration from `thread function` to `thread` (more concise)
- **Changed**: Multi-threading block from `parallel` to `multi` (more concise)
- **Changed**: Result assignment syntax from `r = func()` to `func() -> r`
- **Changed**: Array indexing to 1-based (arrays start at index 1)
- **Changed**: Loop indices to 1-based
- **Changed**: SUBSTRING function to 1-based indexing
- **Added**: Runtime error messages now include line numbers
- **Fixed**: async/await support for MULTI blocks in browser environment

### Version 1.0 (2026-01-25)
- Initial specification
- Basic types, operators, control flow
- Loop with `infinite` keyword
- Strict error handling (no undefined)
- Property access validation
- String manipulation functions (CHARS, SPLIT, JOIN, SUBSTRING, UPPERCASE, LOWERCASE, TRIM)
- Block comments (`/* */`) and single-line comments (`//`)
- **User-defined functions**: `function name(params) do ... end`
- **Return statement**: Explicit and implicit return values
  - Can be used inside functions to return values
  - Can be used at top-level to exit script execution
- **Function scoping**: Local scope with global access
- **Recursion support**: Functions can call themselves
  - **Default call depth limit: 1000**
  - **`infinite` keyword**: Remove call depth limit per function
  - Prevents infinite recursion and stack overflow
- **Argument omission**: Missing arguments default to `null`

---

**End of Language Specification**
