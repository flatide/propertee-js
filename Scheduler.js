import { ThreadContext, ThreadState } from './ThreadContext.js';

export default class Scheduler {
    constructor(visitor) {
        this.visitor = visitor;
        this.threads = new Map();     // id -> ThreadContext
        this.nextThreadId = 0;
        this.currentThreadId = null;

        // Monitor state
        this.monitors = [];  // { interval, blockCtx, lastRun, visitorSnapshot }
    }

    // Create a new thread and register it
    createThread(name, generator, globalSnapshot = null) {
        const id = this.nextThreadId++;
        const thread = new ThreadContext(id, name, generator, globalSnapshot);
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
            if (thread.state === ThreadState.READY) {
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
        const { specs, monitorSpec, globalSnapshot, resultVarNames } = command;
        const childIds = [];

        // Create child threads
        for (let i = 0; i < specs.length; i++) {
            const spec = specs[i];
            const childThread = this.createThread(
                spec.name || `child-${parentThread.id}-${i}`,
                spec.generator,
                globalSnapshot
            );
            childThread.parentId = parentThread.id;
            childThread.inThreadContext = true;
            childThread._resultVarName = resultVarNames[i];  // Track which result var
            childThread._localScope = spec.localScope;        // The scope ref for local capture
            childIds.push(childThread.id);
        }

        // Set up monitor if present
        if (monitorSpec) {
            this.monitors.push({
                interval: monitorSpec.interval,
                blockCtx: monitorSpec.blockCtx,
                lastRun: Date.now(),
                parentThreadId: parentThread.id,
                childIds: [...childIds]
            });
        }

        // Parent waits for all children
        parentThread.markWaiting(childIds);
        parentThread._childResults = new Map();  // childId -> result
        parentThread._childIds = childIds;
        parentThread._resultVarNames = resultVarNames;
    }

    // Notify parent when a child thread completes
    notifyChildCompleted(childThread) {
        if (childThread.parentId === null) return;

        const parent = this.threads.get(childThread.parentId);
        if (!parent) return;

        // Store child result
        if (parent._childResults) {
            parent._childResults.set(childThread.id, childThread.result);
        }

        // Check if all children done
        const allDone = parent.childCompleted(childThread.id);
        if (allDone) {
            // Collect results in order and send back to parent generator
            const results = [];
            for (const cid of parent._childIds) {
                results.push({
                    result: parent._childResults.get(cid),
                    varName: this.threads.get(cid)?._resultVarName || null,
                    localScope: this.threads.get(cid)?._localScope || null
                });
            }

            // Run final monitor tick
            this.runFinalMonitor(childThread.parentId);

            // Remove monitor for this parent
            this.monitors = this.monitors.filter(m => m.parentThreadId !== childThread.parentId);

            // Resume parent with collected results
            parent._collectedResults = results;
        }
    }

    // Run monitor blocks (synchronously between scheduler steps)
    runMonitors() {
        const now = Date.now();
        for (const monitor of this.monitors) {
            if (now - monitor.lastRun >= monitor.interval) {
                monitor.lastRun = now;
                try {
                    this.executeMonitorSync(monitor);
                } catch (e) {
                    this.visitor.stderr('[MONITOR ERROR]', e.message);
                }
            }
        }
    }

    // Execute a monitor block synchronously (exhaust its generator)
    executeMonitorSync(monitor) {
        const parentThread = this.threads.get(monitor.parentThreadId);
        if (!parentThread) return;

        // Save and set monitor context on visitor
        const prevMonitor = this.visitor.activeThread?.inMonitorContext;

        // Create a temporary thread context for monitor execution
        const monitorThread = new ThreadContext(-1, 'monitor', null, parentThread.globalSnapshot || this.visitor.variables);
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

    // Main scheduler loop
    async run(mainGenerator) {
        // Create main thread
        const mainThread = this.createThread('main', mainGenerator, this.visitor.variables);

        while (this.hasActiveThreads()) {
            const now = Date.now();

            // Wake sleeping threads
            this.wakeThreads(now);

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

                // Check for WAITING threads (they'll be woken by child completion)
                let hasWaiting = false;
                for (const t of this.threads.values()) {
                    if (t.state === ThreadState.WAITING) {
                        hasWaiting = true;
                        break;
                    }
                }
                if (hasWaiting) {
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
                }
            } catch (error) {
                thread.markError(error);
                this.notifyChildCompleted(thread);

                // If main thread errors, propagate
                if (thread.id === 0) {
                    throw error;
                }
            }
        }

        // Return main thread result
        const main = this.threads.get(0);
        if (main && main.state === ThreadState.ERROR) {
            throw main.error;
        }
        return main ? main.result : null;
    }
}
