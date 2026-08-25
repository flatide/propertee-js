import { ThreadContext, ThreadState } from './ThreadContext.js';

// Genuine-Result origin brand (spec v0.10.0) — same registry symbol as the visitor's
// TEE_RESULT, resolved via Symbol.for so no import (and no bundling-order concern).
const TEE_RESULT = Symbol.for('propertee.result');

export default class Scheduler {
    constructor(visitor) {
        this.visitor = visitor;
        this.threads = new Map();     // id -> ThreadContext
        this.nextThreadId = 0;
        this.currentThreadId = null;

        // Monitor state
        this.monitors = [];  // { interval, blockCtx, lastRun, visitorSnapshot }

        // Debug state
        this._debugMode = false;
        this._stepping = true;       // true = pause every step; false = run to breakpoint
        this._stepThreadId = null;   // null = initial any-thread stop; otherwise stay on this thread
        this._pausedThreadId = null;
        this._breakpoints = new Set();
        this._sourceBreakpoints = new Map();
        this._stopped = false;
        this._debugResolve = null;
        this._lastLine = null;
        // callback({threadId, threadName, threadResultKey, line, variables, scopeStack,
        //           reason, willPause, done})
        this.onStep = null;
    }

    // --- Debug API ---

    setDebugMode(enabled) {
        this._debugMode = enabled;
        this._stepping = true;
        this._stepThreadId = null;
        this._pausedThreadId = null;
        this._stopped = false;
        this._debugResolve = null;
        this._lastLine = null;
    }

    setBreakpoints(lineSet, sourceId = null) {
        if (sourceId === null) this._breakpoints = lineSet;
        else this._sourceBreakpoints.set(sourceId, lineSet);
    }

    debugStep() {
        this._stepping = true;
        this._stepThreadId = this._pausedThreadId;
        if (this._debugResolve) {
            this._debugResolve();
            this._debugResolve = null;
        }
    }

    debugContinue() {
        this._stepping = false;
        this._stepThreadId = null;
        if (this._debugResolve) {
            this._debugResolve();
            this._debugResolve = null;
        }
    }

    debugStop() {
        this._stopped = true;
        if (this._debugResolve) {
            this._debugResolve();
            this._debugResolve = null;
        }
    }

    // Create a new thread and register it
    createThread(name, generator, globalSnapshot = null, moduleSnapshots = null, currentModule = null) {
        const id = this.nextThreadId++;
        const thread = new ThreadContext(id, name, generator, globalSnapshot, moduleSnapshots, currentModule);
        this.threads.set(id, thread);
        return thread;
    }

    // Select next READY thread (round-robin)
    selectNextThread() {
        const ids = Array.from(this.threads.keys()).sort((a, b) => a - b);
        if (ids.length === 0) return null;

        // Find next READY thread after current
        const startIdx = this.currentThreadId !== null
            ? ids.indexOf(this.currentThreadId)
            : -1;

        for (let i = 1; i <= ids.length; i++) {
            const idx = (startIdx + i) % ids.length;
            const thread = this.threads.get(ids[idx]);
            if (thread.state === ThreadState.READY && !thread._awaitingSlot) {   // limit gate (spec v0.19.0)
                return thread;
            }
        }
        return null;
    }

    // Wake sleeping threads whose time has come
    wakeThreads(now) {
        for (const thread of this.threads.values()) {
            if (thread.shouldWake(now)) {
                thread.sleepUntil = null;
                thread.markReady();
            }
        }
    }

    // Poll BLOCKED threads for completed async operations
    pollAsyncFutures() {
        const now = Date.now();
        for (const thread of this.threads.values()) {
            if (thread.state === ThreadState.BLOCKED) {
                // Check timeout
                if (thread.asyncTimeoutMs > 0 && (now - thread.asyncSubmitTime) > thread.asyncTimeoutMs) {
                    const timeoutResult = { status: "error", ok: false, value: "timeout", [TEE_RESULT]: true };
                    thread.asyncResultCache[thread.asyncCacheKey] = timeoutResult;
                    if (thread.asyncCacheKey && thread.asyncCacheKey.startsWith('SHELL|')) {
                        this.visitor._completeShellObservation(thread, timeoutResult);
                    }
                    thread.clearAsyncState();
                    thread.markReady();
                    continue;
                }
                // Check if promise resolved
                if (thread.asyncResolved) {
                    thread.asyncResultCache[thread.asyncCacheKey] = thread.asyncResolvedValue;
                    thread.clearAsyncState();
                    thread.markReady();
                }
            }
        }
    }

    // Check if any threads are still active (not COMPLETED/ERROR)
    hasActiveThreads() {
        for (const thread of this.threads.values()) {
            if (thread.state !== ThreadState.COMPLETED &&
                thread.state !== ThreadState.ERROR) {
                return true;
            }
        }
        return false;
    }

    // Get the minimum sleep time remaining across sleeping threads
    getMinSleepRemaining(now) {
        let min = Infinity;
        for (const thread of this.threads.values()) {
            if (thread.state === ThreadState.SLEEPING && thread.sleepUntil !== null) {
                const remaining = thread.sleepUntil - now;
                if (remaining < min) min = remaining;
            }
        }
        return min === Infinity ? null : Math.max(0, min);
    }

    // Process a yield value from a thread's generator
    processYield(thread, yieldValue) {
        // undefined yield = normal statement boundary
        if (yieldValue === undefined) {
            thread.markReady();
            return;
        }

        // Scheduler commands
        if (yieldValue && yieldValue.__schedulerCommand) {
            switch (yieldValue.type) {
                case 'SLEEP': {
                    const now = Date.now();
                    thread.markSleeping(now + yieldValue.duration);
                    return;
                }

                case 'SPAWN_THREADS': {
                    this.handleSpawnThreads(thread, yieldValue);
                    return;
                }

                case 'AWAIT_ASYNC': {
                    thread.markBlocked();
                    return;
                }

                default:
                    thread.markReady();
                    return;
            }
        }

        // Anything else, thread stays ready
        thread.markReady();
    }

    // Handle SPAWN_THREADS command from a MULTI block
    handleSpawnThreads(parentThread, command) {
        const { specs, monitorSpec, globalSnapshot, moduleSnapshots, enclosingModule,
            resultKeyNames, resultVarName, limit } = command;
        const childIds = [];

        // Store resultCollectionVarName on parent thread
        parentThread.resultCollectionVarName = resultVarName;

        // Create child threads. Under `limit K` (spec v0.19.0) every thread is still created
        // and announced (its Result entry reads "running" — a waiting thread is externally
        // indistinguishable), but only the first K are admitted; the rest carry _awaitingSlot
        // and are skipped by selectNextThread until a finishing sibling admits them.
        const cap = limit ?? Infinity;
        for (let i = 0; i < specs.length; i++) {
            const spec = specs[i];
            const childThread = this.createThread(
                spec.name || `child-${parentThread.id}-${i}`,
                spec.generator,
                globalSnapshot,
                moduleSnapshots,
                spec.module || null
            );
            childThread.parentId = parentThread.id;
            childThread.inThreadContext = true;
            childThread.functionName = spec.functionName || spec.name || '';
            childThread._resultKeyName = resultKeyNames[i];  // Track which result key
            childThread._localScope = spec.localScope;        // The scope ref for local capture
            if (i >= cap) childThread._awaitingSlot = true;   // admission gate (spec v0.19.0)
            childIds.push(childThread.id);
        }

        // Set up monitor if present
        if (monitorSpec) {
            this.monitors.push({
                interval: monitorSpec.interval,
                blockCtx: monitorSpec.blockCtx,
                lastRun: Date.now(),
                parentThreadId: parentThread.id,
                childIds: [...childIds],
                // The watchdog reads globals from the SAME multi-entry snapshot as the workers
                // (never the live variables), and stops mid-run iterations after a failure.
                globalSnapshot: globalSnapshot,
                moduleSnapshots: moduleSnapshots,
                enclosingModule: enclosingModule,
                aborted: false
            });
        }

        // Parent waits for all children
        parentThread.markWaiting(childIds);
        parentThread._childIds = childIds;
        parentThread._resultKeyNames = resultKeyNames;

        // Pre-build the live result collection with running entries
        // All keys are pre-resolved by the visitor (no nulls)
        if (resultVarName !== null) {
            const collection = {};
            for (let i = 0; i < childIds.length; i++) {
                const keyName = resultKeyNames[i];
                collection[keyName] = { status: "running", ok: false, value: {}, [TEE_RESULT]: true };
            }
            parentThread._resultCollection = collection;
        }
    }

    // Notify parent when a child thread completes
    notifyChildCompleted(childThread) {
        if (childThread.parentId === null) return;

        const parent = this.threads.get(childThread.parentId);
        if (!parent) return;

        // Update the live result collection in-place
        // All keys are pre-resolved by the visitor (no nulls)
        if (parent._resultCollection) {
            const idx = parent._childIds.indexOf(childThread.id);
            if (idx >= 0) {
                const key = parent._resultKeyNames[idx];
                if (childThread.state === ThreadState.ERROR) {
                    parent._resultCollection[key] = {
                        status: "error",
                        ok: false,
                        value: childThread.error ? childThread.error.message : 'Unknown thread error',
                        [TEE_RESULT]: true
                    };
                } else {
                    parent._resultCollection[key] = {
                        status: "done",
                        ok: true,
                        value: childThread.result,
                        [TEE_RESULT]: true
                    };
                }
            }
        }

        // spec v0.19.0 `limit K`: the freed slot admits the next waiting sibling, in spawn order
        if (parent._childIds) {
            for (const cid of parent._childIds) {
                const sib = this.threads.get(cid);
                if (sib && sib._awaitingSlot) { sib._awaitingSlot = false; break; }
            }
        }

        // Check if all children done
        const allDone = parent.childCompleted(childThread.id);
        if (allDone) {
            // Run final monitor tick
            this.runFinalMonitor(childThread.parentId);

            // Remove monitor for this parent
            this.monitors = this.monitors.filter(m => m.parentThreadId !== childThread.parentId);

            // Resume parent with collected results as payload
            parent._collectedResults = {
                resultVarName: parent.resultCollectionVarName,
                collection: parent._resultCollection
            };
        }
    }

    // Run monitor blocks (synchronously between scheduler steps)
    runMonitors() {
        const now = Date.now();
        for (const monitor of this.monitors) {
            if (monitor.aborted) continue;   // a failed iteration stops mid-run runs; final still runs
            if (now - monitor.lastRun >= monitor.interval) {
                try {
                    this.executeMonitorSync(monitor);
                } catch (e) {
                    this.visitor.stderr('[MONITOR ERROR]', e.message);
                    monitor.aborted = true;
                }
                monitor.lastRun = Date.now();   // fixed-delay: measure the interval from after the body
            }
        }
    }

    // Execute a monitor block synchronously (exhaust its generator)
    executeMonitorSync(monitor) {
        const parentThread = this.threads.get(monitor.parentThreadId);
        if (!parentThread) return;

        // Save and set monitor context on visitor
        const prevMonitor = this.visitor.activeThread?.inMonitorContext;

        // spec v0.16.0: the monitor is a watchdog thread. Each iteration runs in a fresh
        // local scope (like a function invocation) seeded with a deep-copied CAPTURE of the
        // result collection; globals are the read-only snapshot, reachable via :: only.
        const iterationScope = {};
        if (parentThread.resultCollectionVarName && parentThread._resultCollection) {
            iterationScope[parentThread.resultCollectionVarName] =
                this._monitorCollection(parentThread);
        }

        // A temporary thread context with worker purity (:: writes error) and the
        // iteration scope as its single local frame. Globals come from the multi-entry
        // snapshot stored on the monitor entry — NOT the parent thread, whose "snapshot"
        // is the live variables when the parent is the main thread.
        const monitorThread = new ThreadContext(-1, 'monitor', null,
            monitor.globalSnapshot || this.visitor.variables,
            monitor.moduleSnapshots || this.visitor._liveModuleGlobals(),
            monitor.enclosingModule || null);
        monitorThread.scopeStack.push(iterationScope);
        monitorThread.inThreadContext = true;
        monitorThread.inMonitorContext = true;

        // Set the active thread to the monitor thread
        const prevActiveThread = this.visitor.activeThread;
        this.visitor.activeThread = monitorThread;

        try {
            const gen = this.visitor.visitBlock(monitor.blockCtx);
            // Exhaust the generator synchronously
            let step = gen.next();
            while (!step.done) {
                step = gen.next();
            }
        } finally {
            this.visitor.activeThread = prevActiveThread;
            if (prevActiveThread && prevMonitor !== undefined) {
                prevActiveThread.inMonitorContext = prevMonitor;
            }
        }
    }

    // Monitor-only projection: the semantic collection is never mutated. Each copied Result keeps
    // its brand and fields, while value becomes a thread snapshot for this watchdog iteration.
    _monitorCollection(parentThread) {
        const capture = this.visitor.deepCopy(parentThread._resultCollection);
        for (let i = 0; i < parentThread._childIds.length; i++) {
            const child = this.threads.get(parentThread._childIds[i]);
            const key = parentThread._resultKeyNames[i];
            const entry = capture[key];
            if (!child || !entry) continue;
            const returnValue = entry.value;
            entry.value = {
                id: child.id,
                key: key,
                functionName: child.functionName || child.name,
                state: entry.status,
                returnValue: returnValue,
                shell: this._monitorShell(child)
            };
        }
        return capture;
    }

    _monitorShell(thread) {
        const shell = thread.shellObservation;
        if (!shell) return {};
        const updated = shell.outputRevision > shell.deliveredRevision;
        if (updated) shell.deliveredRevision = shell.outputRevision;
        const end = shell.endedAt > 0 ? shell.endedAt : Date.now();
        return {
            active: shell.active,
            taskId: this.visitor.deepCopy(shell.taskId),
            pid: this.visitor.deepCopy(shell.pid),
            status: shell.status,
            elapsedMs: Math.max(0, Math.min(2147483647, end - shell.startedAt)),
            exitCode: this.visitor.deepCopy(shell.exitCode),
            output: updated ? shell.lastLine : '',
            updated: updated,
            result: this.visitor.deepCopy(shell.result)
        };
    }

    // Run final monitor after all children complete
    runFinalMonitor(parentThreadId) {
        const monitor = this.monitors.find(m => m.parentThreadId === parentThreadId);
        if (monitor) {
            try {
                this.executeMonitorSync(monitor);
            } catch (e) {
                this.visitor.stderr('[MONITOR ERROR]', e.message);
            }
        }
    }

    // Collect current variable state for debug callback
    _getDebugVariables(thread) {
        const variables = thread.globalSnapshot || this.visitor.variables;
        const scopeStack = thread.scopeStack || [];
        return { variables, scopeStack };
    }

    // Main scheduler loop
    async run(mainGenerator) {
        // Create main thread
        const mainThread = this.createThread('main', mainGenerator, this.visitor.variables,
            this.visitor._liveModuleGlobals(), null);

        while (this.hasActiveThreads()) {
            // Check debug stop signal
            if (this._debugMode && this._stopped) break;

            const now = Date.now();

            // Wake sleeping threads
            this.wakeThreads(now);

            // Poll async futures
            this.pollAsyncFutures();

            // Run monitors
            this.runMonitors();

            // Select next thread
            const thread = this.selectNextThread();

            if (!thread) {
                // No READY threads - check if all are sleeping
                const sleepTime = this.getMinSleepRemaining(Date.now());
                if (sleepTime !== null) {
                    // Wait for shortest sleep to expire
                    await new Promise(resolve => setTimeout(resolve, Math.min(sleepTime, 50)));
                    continue;
                }

                // Check for WAITING or BLOCKED threads
                let hasWaitingOrBlocked = false;
                for (const t of this.threads.values()) {
                    if (t.state === ThreadState.WAITING || t.state === ThreadState.BLOCKED) {
                        hasWaitingOrBlocked = true;
                        break;
                    }
                }
                if (hasWaitingOrBlocked) {
                    // Small delay to prevent busy-waiting
                    await new Promise(resolve => setTimeout(resolve, 1));
                    continue;
                }

                // Deadlock or all done
                break;
            }

            this.currentThreadId = thread.id;
            thread.markRunning();

            // Set active thread on visitor
            this.visitor.activeThread = thread;

            try {
                // Step the generator
                let sendValue = undefined;

                // If thread was waiting and just became ready, send collected results
                if (thread._collectedResults) {
                    sendValue = thread._collectedResults;
                    thread._collectedResults = null;
                }

                const step = thread.generator.next(sendValue);

                if (step.done) {
                    thread.markCompleted(step.value);
                    this.notifyChildCompleted(thread);
                } else {
                    this.processYield(thread, step.value);

                    // Debug gating: pause after each step if in debug mode
                    if (this._debugMode) {
                        if (this._stopped) break;

                        // Extract line number from yield value (integers are line numbers)
                        if (typeof step.value === 'number') {
                            thread.debugLine = step.value;
                        }
                        thread.debugSourceId = thread.currentModule?.sourceId || this.visitor.sourceId;
                        // Detect explicit debug break statement
                        let forceBreak = false;
                        if (step.value && step.value.__debugBreak) {
                            thread.debugLine = step.value.line;
                            forceBreak = true;
                        }

                        this._lastLine = thread.debugLine;
                        const stepBreak = this._stepping &&
                            (this._stepThreadId === null || this._stepThreadId === thread.id);
                        const sourceBreakpoints = this._sourceBreakpoints.get(thread.debugSourceId);
                        const breakpointBreak = (thread.debugSourceId === this.visitor.sourceId
                                && this._breakpoints.has(thread.debugLine))
                            || (sourceBreakpoints?.has(thread.debugLine) ?? false);
                        const reason = forceBreak ? 'debug'
                            : (stepBreak ? 'step' : (breakpointBreak ? 'breakpoint' : null));

                        // Fire onStep callback with current state
                        if (this.onStep) {
                            const { variables, scopeStack } = this._getDebugVariables(thread);
                            this.onStep({
                                threadId: thread.id,
                                threadName: thread.functionName || thread.name,
                                threadResultKey: thread._resultKeyName || null,
                                line: thread.debugLine,
                                sourceId: thread.debugSourceId,
                                variables,
                                scopeStack,
                                reason,
                                willPause: reason !== null,
                                done: false
                            });
                        }

                        // Explicit debug/breakpoints can stop any worker. A step stays on the
                        // logical thread that armed it, so a ready sibling cannot steal it.
                        if (reason !== null) {
                            this._pausedThreadId = thread.id;
                            try {
                                await new Promise(resolve => { this._debugResolve = resolve; });
                                if (this._stopped) {
                                    throw new Error('Execution stopped by user');
                                }
                            } finally {
                                this._pausedThreadId = null;
                            }
                        }
                    }
                }
            } catch (error) {
                thread.markError(error);
                this.notifyChildCompleted(thread);

                // If main thread errors, propagate
                if (thread.id === 0) {
                    throw error;
                }
                // Print child thread errors to stderr
                this.visitor.stderr('[THREAD ERROR]', error.message);
            }
        }

        // Fire final onStep callback
        if (this._debugMode && this.onStep) {
            this.onStep({ done: true });
        }

        // Return main thread result
        const main = this.threads.get(0);
        if (main && main.state === ThreadState.ERROR) {
            throw main.error;
        }
        return main ? main.result : null;
    }
}
