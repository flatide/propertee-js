// Thread states
const ThreadState = {
    READY: 'READY',
    RUNNING: 'RUNNING',
    SLEEPING: 'SLEEPING',
    WAITING: 'WAITING',      // Waiting for child threads (SPAWN_THREADS)
    COMPLETED: 'COMPLETED',
    ERROR: 'ERROR'
};

class ThreadContext {
    constructor(id, name, generator, globalSnapshot = null) {
        this.id = id;
        this.name = name;
        this.generator = generator;
        this.state = ThreadState.READY;

        // Scope stack - thread-private local variables
        this.scopeStack = [];

        // Global snapshot (read-only for threads, mutable for main)
        this.globalSnapshot = globalSnapshot;

        // Sleep tracking
        this.sleepUntil = null;  // timestamp when sleep ends

        // Context flags
        this.inThreadContext = false;
        this.inMonitorContext = false;
        this.inMultiContext = false;

        // Current function context
        this.currentFunctionContext = null;

        // MULTI block result vars
        this.multiResultVars = new Map();

        // Thread result (set when completed)
        this.result = null;

        // Error (set on ERROR state)
        this.error = null;

        // Parent thread id (for child threads spawned by SPAWN_THREADS)
        this.parentId = null;

        // Child thread tracking
        this.waitingForChildren = null;  // Set of child thread IDs when WAITING
    }

    // --- Scope management ---

    pushScope(scope = {}) {
        this.scopeStack.push(scope);
    }

    popScope() {
        return this.scopeStack.pop();
    }

    getCurrentScope() {
        if (this.scopeStack.length > 0) {
            return this.scopeStack[this.scopeStack.length - 1];
        }
        return null;
    }

    // Look up variable through scope chain then global snapshot
    getVariable(name) {
        // Check scope stack top-down
        for (let i = this.scopeStack.length - 1; i >= 0; i--) {
            if (name in this.scopeStack[i]) {
                return { found: true, value: this.scopeStack[i][name] };
            }
        }

        // Check global snapshot
        if (this.globalSnapshot && name in this.globalSnapshot) {
            return { found: true, value: this.globalSnapshot[name] };
        }

        return { found: false, value: undefined };
    }

    // Set variable in current scope or global snapshot
    setVariable(name, value) {
        if (this.scopeStack.length > 0) {
            this.scopeStack[this.scopeStack.length - 1][name] = value;
        } else if (this.globalSnapshot) {
            this.globalSnapshot[name] = value;
        }
    }

    // Check if we're in a local scope (inside a function)
    isInLocalScope() {
        return this.scopeStack.length > 0;
    }

    // --- State transitions ---

    markRunning() {
        this.state = ThreadState.RUNNING;
    }

    markReady() {
        this.state = ThreadState.READY;
    }

    markSleeping(until) {
        this.state = ThreadState.SLEEPING;
        this.sleepUntil = until;
    }

    markWaiting(childIds) {
        this.state = ThreadState.WAITING;
        this.waitingForChildren = new Set(childIds);
    }

    markCompleted(result) {
        this.state = ThreadState.COMPLETED;
        this.result = result;
    }

    markError(error) {
        this.state = ThreadState.ERROR;
        this.error = error;
    }

    // Check if a sleeping thread should wake up
    shouldWake(now) {
        return this.state === ThreadState.SLEEPING &&
               this.sleepUntil !== null &&
               now >= this.sleepUntil;
    }

    // Check if a waiting thread's children are all done
    childCompleted(childId) {
        if (this.waitingForChildren) {
            this.waitingForChildren.delete(childId);
            if (this.waitingForChildren.size === 0) {
                this.state = ThreadState.READY;
                this.waitingForChildren = null;
                return true;  // All children done
            }
        }
        return false;
    }
}

export { ThreadContext, ThreadState };
