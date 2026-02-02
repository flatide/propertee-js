# ProperTee Threading Implementation Constraints

This document describes the implementation constraints for ProperTee's threading system, intended for reference when porting to other languages.

## 1. Overview

ProperTee implements **simulated concurrency** using asynchronous execution rather than true OS threads. This approach is optimal for I/O-bound tasks while maintaining simplicity and safety.

## 2. Data Structures

### 2.1 Shared Resource Storage
```javascript
sharedResources: Set<string>       // Names of SHARED variables
sharedValues: Map<string, any>     // Actual values of SHARED variables
```

**Rules:**
- SHARED variables stored separately from regular variables
- Only accessible through USES clause in functions
- Validated at both function definition and runtime

### 2.2 Lock Manager
```javascript
locks: Map<string, {locked: boolean, queue: Array<Function>}>
```

**Behavior:**
- Each SHARED resource has independent lock
- Queue maintains pending lock requests
- Locks acquired in alphabetical order (deadlock prevention)
- Locks released in reverse order (stack unwinding)

### 2.3 Execution Context
```javascript
inParallelContext: boolean         // Whether currently in PARALLEL block
currentFunctionStack: Array        // Track function call stack for USES validation
```

## 3. Lock Acquisition Algorithm

### 3.1 Alphabetical Ordering
```
Input: usesResources = ["logs", "accounts", "counter"]
Step 1: Sort alphabetically -> ["accounts", "counter", "logs"]
Step 2: Acquire locks in order
Step 3: Execute function
Step 4: Release locks in reverse order
```

**Why alphabetical?**
- Guarantees all threads acquire locks in same order
- Prevents circular wait condition
- Simple and deterministic

### 3.2 Lock Queue
```
Thread 1: Requests [accounts, logs]
Thread 2: Requests [logs, counter]

Timeline:
1. Thread 1 acquires "accounts" lock
2. Thread 1 acquires "logs" lock
3. Thread 2 waits for "logs" lock (queued)
4. Thread 1 executes and releases locks
5. Thread 2 acquires "logs" lock from queue
6. Thread 2 acquires "counter" lock
7. Thread 2 executes and releases locks
```

## 4. Validation Rules

### 4.1 SHARED Declaration Validation
- **When**: At statement execution (visitSharedDeclStmt)
- **Check**: Only in global scope (scopeStack.length === 0)
- **Error**: "SHARED declaration is only allowed in global scope"

### 4.2 USES Clause Validation
- **When**: At function definition (visitFunctionDef)
- **Check**: All USES resources must be declared as SHARED
- **Error**: "USES references 'X' which is not declared as SHARED"

### 4.3 SHARED Access Validation
- **When**: At variable access (visitVarReference, visitAssignment)
- **Check**: 
  - If accessing SHARED variable from function
  - Must be listed in function's USES clause
- **Error**: "Variable 'X' is SHARED but not declared in USES clause"

### 4.4 PARALLEL Block Validation
- **Check 1**: No nested function calls (e.g., `func(helper())`)
- **Check 2**: No control flow (if, loop)
- **Check 3**: No variable references to PARALLEL results inside block
- **Check 4**: No duplicate result variable assignments

## 5. Parallel Execution Flow

### 5.1 Task Spawning
```
PARALLEL
    r1 = task1()
    r2 = task2()
END

Implementation:
1. Parse all tasks in PARALLEL block
2. Create Promise for each task
3. Evaluate function arguments (before spawn)
4. Spawn all tasks simultaneously (Promise.all)
5. Wait for all tasks to complete
6. Collect results and assign to variables
7. Continue to next statement
```

### 5.2 Task Execution
```
For each task:
1. Validate function exists
2. Evaluate arguments
3. If USES clause exists:
   a. Sort resources alphabetically
   b. Acquire locks in order (await if needed)
4. Create local scope
5. Bind parameters
6. Execute function body
7. Catch errors (log to stderr, return null)
8. Release locks (in finally block)
9. Return result
```

## 6. Error Handling

### 6.1 Thread-Level Errors
**Behavior:**
- Error in one thread does not stop other threads
- Failed thread logs error to stderr
- Failed thread returns `null` as result
- Other threads continue execution

**Example:**
```javascript
PARALLEL
    r1 = task1()  // succeeds, returns 10
    r2 = task2()  // fails, returns null
    r3 = task3()  // succeeds, returns 30
END
// r1 = 10, r2 = null, r3 = 30
```

### 6.2 Error Message Format
```
Runtime Error in thread: <error message>
  at line X:Y
  in function <funcName>
  in PARALLEL block at line Z
```

## 7. Variable Scoping

### 7.1 Scope Resolution Order
```
1. Function local scope (scopeStack, innermost first)
2. SHARED resources (sharedValues)
3. Global variables (variables)
4. Built-in properties (properties)
```

### 7.2 Thread-Local Variables
- Variables created inside function are automatically thread-local
- Each thread has independent scopeStack
- No sharing between threads
- Destroyed when thread exits

## 8. Asynchronous Execution Model

### 8.1 Promise-Based Concurrency
```javascript
async visitParallelStmt(ctx) {
    const promises = tasks.map(task => executeTask(task));
    const results = await Promise.all(promises);
    // Assign results
}
```

**Benefits:**
- Natural fit for I/O-bound operations
- No true thread overhead
- Cooperative multitasking
- JavaScript event loop handles scheduling

**Limitations:**
- Not true parallelism (single-threaded JavaScript)
- CPU-intensive tasks won't benefit
- Long-running synchronous code blocks event loop

### 8.2 Lock Implementation
```javascript
async acquireSingleLock(name) {
    if (!locked) {
        locked = true;
        return;
    }
    
    // Wait for lock by queuing a Promise
    await new Promise(resolve => {
        queue.push(resolve);
    });
}
```

## 9. Memory Model

### 9.1 Shared State Access
- SHARED variables accessed through `sharedValues` map
- No direct memory sharing (JavaScript limitation)
- All access is synchronized through lock manager
- No dirty reads (unlike MONITOR proposal)

### 9.2 Message Passing
- Function arguments passed by value (JavaScript semantics)
- Objects/arrays passed by reference
- Return values collected after task completion
- No shared mutable state except through SHARED variables

## 10. Performance Considerations

### 10.1 Lock Overhead
- Every USES function call acquires/releases locks
- Lock queue operations are O(1)
- Alphabetical sorting is O(n log n) where n = number of USES resources
- Typically small n (1-5 resources)

### 10.2 Concurrency vs Parallelism
- **Concurrent**: Multiple tasks in progress (ProperTee)
- **Parallel**: Multiple tasks executing simultaneously (not ProperTee)
- ProperTee is concurrent but not parallel
- Optimal for I/O, network, file operations
- Not optimal for CPU-intensive computation

## 11. Testing Considerations

### 11.1 Unit Tests
- Test lock ordering (alphabetical)
- Test deadlock prevention
- Test error isolation between threads
- Test USES validation
- Test SHARED access control

### 11.2 Integration Tests
- Test multiple threads accessing same SHARED resource
- Test lock contention scenarios
- Test error handling in parallel context
- Test result collection and assignment

## 12. Future Enhancements

### 12.1 Possible Improvements
- Read-write locks (READONLY modifier)
- Fine-grained locking (per-array-element)
- Lock timeout and detection
- Thread monitoring (MONITOR keyword)
- Thread pools for efficiency

### 12.2 True Parallelism (Optional)
If porting to language with true threads:
- Use OS threads instead of async/await
- Use mutex/semaphore instead of Promise queues
- Keep alphabetical lock ordering
- Keep error isolation behavior
- Maintain same API/semantics

## 13. Implementation Checklist

- [ ] LockManager class with acquire/release methods
- [ ] sharedResources Set and sharedValues Map
- [ ] visitSharedDeclStmt for SHARED declarations
- [ ] visitFunctionDef with USES validation
- [ ] visitParallelStmt for PARALLEL blocks
- [ ] executeParallelTask for task execution
- [ ] callUserFunctionAsync with lock management
- [ ] visitVarReference with SHARED access validation
- [ ] visitAssignment with SHARED write validation
- [ ] Error handling with thread isolation
- [ ] Result collection and assignment
- [ ] PARALLEL block syntax validation

## 14. Common Pitfalls

### 14.1 Forgetting Lock Release
**Wrong:**
```javascript
await lockManager.acquireLocks(resources);
executeFunction();
// Missing: lockManager.releaseLocks(resources);
```

**Correct:**
```javascript
try {
    await lockManager.acquireLocks(resources);
    executeFunction();
} finally {
    lockManager.releaseLocks(resources);
}
```

### 14.2 Lock Ordering Violation
**Wrong:**
```javascript
// Thread 1: acquires [B, A]
// Thread 2: acquires [A, B]
// Deadlock!
```

**Correct:**
```javascript
// Always sort first
const sorted = resources.sort();
// Thread 1: acquires [A, B]
// Thread 2: acquires [A, B]
// No deadlock
```

### 14.3 Accessing SHARED Without USES
**Wrong:**
```javascript
function bad() do
    counter = counter + 1  // counter is SHARED
end
```

**Correct:**
```javascript
function good() USES counter do
    counter = counter + 1
end
```

---

**End of Implementation Constraints**
