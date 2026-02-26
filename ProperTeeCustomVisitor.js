import ProperTeeVisitor from './ProperTeeVisitor.js';
import { statSync } from 'fs';
import { execSync } from 'child_process';

export default class ProperTeeCustomVisitor extends ProperTeeVisitor {
    constructor(builtInProperties = {}, builtInFunctions = {}, ioStreams = {}, options = {}) {
        super();
        this.variables = {};
        this.userDefinedFunctions = {};
        this.scopeStack = [];

        // Threading context flags (used by main thread when no scheduler)
        this.inMultiContext = false;
        this.multiResultVars = new Map();
        this.inMonitorContext = false;
        this.inThreadContext = false;
        this.currentFunctionContext = null;

        // SPAWN collection (used during multi block setup)
        this._inMultiSetup = false;
        this._collectedSpawns = null;

        // Active thread context (set by scheduler)
        this.activeThread = null;

        this.properties = builtInProperties;

        this.stdin = ioStreams.stdin || null;
        this.stdout = ioStreams.stdout || ((...args) => console.log(...args));
        this.stderr = ioStreams.stderr || ((...args) => console.error(...args));

        this.maxIterations = options.maxIterations || 1000;
        this.iterationLimitBehavior = options.iterationLimitBehavior || 'error';

        // Deep-copy helper for value semantics at sharing boundaries
        this.deepCopy = (value) => {
            if (value === null || value === undefined || typeof value !== 'object') return value;
            if (Array.isArray(value)) return value.map(item => this.deepCopy(item));
            const copy = {};
            for (const key of Object.keys(value)) copy[key] = this.deepCopy(value[key]);
            return copy;
        };

        // Format a value for display inside collections (strings get single quotes)
        const formatJsonValue = (value) => {
            if (value === null || value === undefined) return 'null';
            if (typeof value === 'string') return "'" + value + "'";
            if (typeof value === 'boolean') return String(value);
            if (typeof value === 'number') {
                if (Number.isInteger(value)) return String(value);
                return String(value);
            }
            if (Array.isArray(value)) return formatDisplayValue(value);
            if (typeof value === 'object') return formatDisplayValue(value);
            return String(value);
        };

        // Format a value for PRINT output (matching Java TypeChecker.formatValue)
        const formatDisplayValue = (value) => {
            if (value === null || value === undefined) return 'null';
            if (typeof value === 'boolean') return String(value);
            if (typeof value === 'number') {
                if (Number.isInteger(value)) return String(value);
                return String(value);
            }
            if (typeof value === 'string') return value;
            if (Array.isArray(value)) {
                if (value.length === 0) return '[]';
                return '[ ' + value.map(v => formatJsonValue(v)).join(', ') + ' ]';
            }
            if (typeof value === 'object') {
                const keys = Object.keys(value);
                if (keys.length === 0) return '{}';
                return '{ ' + keys.map(k => '"' + k + '": ' + formatJsonValue(value[k])).join(', ') + ' }';
            }
            return String(value);
        };

        const validateHomogeneous = (arr, funcName) => {
            const allNumbers = arr.every(x => typeof x === 'number');
            const allStrings = arr.every(x => typeof x === 'string');
            if (!allNumbers && !allStrings) {
                throw new Error(`Runtime Error: ${funcName}() requires all elements to be the same type (number or string)`);
            }
        };

        const validateKeyExists = (arr, key, funcName) => {
            for (let i = 0; i < arr.length; i++) {
                if (typeof arr[i] !== 'object' || arr[i] === null || Array.isArray(arr[i])) {
                    throw new Error(`Runtime Error: ${funcName}() requires an array of objects`);
                }
                if (!(key in arr[i])) {
                    throw new Error(`Runtime Error: Property '${key}' does not exist in array element at index ${i + 1}`);
                }
            }
        };

        const compareValues = (a, b) => {
            if (typeof a === 'number' && typeof b === 'number') return a - b;
            return String(a).localeCompare(String(b));
        };

        const defaultFunctions = {
            'PRINT': (...args) => { this.stdout(...args.map(a => formatDisplayValue(a))); return {}; },
            'SUM': (...args) => args.reduce((a, b) => a + b, 0),
            'MAX': (...args) => Math.max(...args),
            'MIN': (...args) => Math.min(...args),
            'ABS': (n) => Math.abs(n),
            'FLOOR': (n) => Math.floor(n),
            'CEIL': (n) => Math.ceil(n),
            'ROUND': (n) => Math.round(n),
            'LEN': (a) => {
                if (Array.isArray(a)) return a.length;
                if (typeof a === 'string') return a.length;
                if (typeof a === 'object' && a !== null) return Object.keys(a).length;
                return 0;
            },
            'TO_NUMBER': (str) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: TO_NUMBER() requires a string argument');
                const trimmed = str.trim();
                if (trimmed === '') throw new Error('Runtime Error: TO_NUMBER() cannot convert empty string');
                const num = Number(trimmed);
                if (isNaN(num)) throw new Error(`Runtime Error: TO_NUMBER() cannot convert '${str}' to number`);
                return num;
            },
            'TO_STRING': (value) => {
                if (typeof value === 'boolean') return value ? 'true' : 'false';
                if (typeof value === 'number') return String(value);
                if (typeof value === 'string') return value;
                if (Array.isArray(value)) return JSON.stringify(value);
                if (typeof value === 'object' && value !== null) return JSON.stringify(value);
                return String(value);
            },
            'SLEEP': (milliseconds) => {
                if (typeof milliseconds !== 'number') throw new Error('Runtime Error: SLEEP() requires a number argument');
                if (milliseconds < 0) throw new Error('Runtime Error: SLEEP() duration cannot be negative');
                // Returns a scheduler command instead of a Promise
                return { __schedulerCommand: true, type: 'SLEEP', duration: milliseconds };
            },
            'PUSH': (arr, ...values) => {
                if (!Array.isArray(arr)) throw new Error('Runtime Error: PUSH() first argument must be an array');
                return [...arr, ...values];
            },
            'POP': (arr) => {
                if (!Array.isArray(arr)) throw new Error('Runtime Error: POP() argument must be an array');
                if (arr.length === 0) throw new Error('Runtime Error: POP() cannot pop from empty array');
                return arr.slice(0, -1);
            },
            'CONCAT': (...arrays) => {
                for (const arr of arrays) {
                    if (!Array.isArray(arr)) throw new Error('Runtime Error: CONCAT() all arguments must be arrays');
                }
                return arrays.reduce((acc, arr) => [...acc, ...arr], []);
            },
            'SLICE': (arr, start, end) => {
                if (!Array.isArray(arr)) throw new Error('Runtime Error: SLICE() first argument must be an array');
                if (typeof start !== 'number') throw new Error('Runtime Error: SLICE() second argument must be a number');
                if (end !== undefined && typeof end !== 'number') throw new Error('Runtime Error: SLICE() third argument must be a number');
                const zeroStart = start - 1;
                const zeroEnd = end !== undefined ? end : undefined;
                return end === undefined ? arr.slice(zeroStart) : arr.slice(zeroStart, zeroEnd);
            },
            'CHARS': (str) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: CHARS() requires a string argument');
                return Array.from(str);
            },
            'SPLIT': (str, delimiter) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: SPLIT() first argument must be a string');
                if (typeof delimiter !== 'string') throw new Error('Runtime Error: SPLIT() second argument must be a string');
                return str.split(delimiter);
            },
            'JOIN': (arr, separator = '') => {
                if (!Array.isArray(arr)) throw new Error('Runtime Error: JOIN() first argument must be an array');
                if (typeof separator !== 'string') throw new Error('Runtime Error: JOIN() second argument must be a string');
                return arr.join(separator);
            },
            'SUBSTRING': (str, start, length) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: SUBSTRING() first argument must be a string');
                if (typeof start !== 'number') throw new Error('Runtime Error: SUBSTRING() second argument must be a number');
                if (length !== undefined && typeof length !== 'number') throw new Error('Runtime Error: SUBSTRING() third argument must be a number');
                const zeroBased = start - 1;
                return length === undefined ? str.substring(zeroBased) : str.substring(zeroBased, zeroBased + length);
            },
            'UPPERCASE': (str) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: UPPERCASE() requires a string argument');
                return str.toUpperCase();
            },
            'LOWERCASE': (str) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: LOWERCASE() requires a string argument');
                return str.toLowerCase();
            },
            'TRIM': (str) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: TRIM() requires a string argument');
                return str.trim();
            },
            'HAS_KEY': (obj, key) => {
                if (typeof obj !== 'object' || obj === null || Array.isArray(obj))
                    throw new Error('Runtime Error: HAS_KEY() first argument must be an object');
                if (typeof key !== 'string')
                    throw new Error('Runtime Error: HAS_KEY() second argument must be a string');
                return obj.hasOwnProperty(key);
            },
            'KEYS': (obj) => {
                if (typeof obj !== 'object' || obj === null || Array.isArray(obj))
                    throw new Error('Runtime Error: KEYS() argument must be an object');
                return Object.keys(obj);
            },
            'SORT': (arr) => {
                if (!Array.isArray(arr))
                    throw new Error('Runtime Error: SORT() requires an array argument');
                const result = [...arr];
                if (result.length <= 1) return result;
                validateHomogeneous(result, 'SORT');
                result.sort((a, b) => compareValues(a, b));
                return result;
            },
            'SORT_DESC': (arr) => {
                if (!Array.isArray(arr))
                    throw new Error('Runtime Error: SORT_DESC() requires an array argument');
                const result = [...arr];
                if (result.length <= 1) return result;
                validateHomogeneous(result, 'SORT_DESC');
                result.sort((a, b) => compareValues(b, a));
                return result;
            },
            'SORT_BY': (arr, key) => {
                if (!Array.isArray(arr))
                    throw new Error('Runtime Error: SORT_BY() requires an array argument');
                if (typeof key !== 'string')
                    throw new Error('Runtime Error: SORT_BY() second argument must be a string key');
                const result = [...arr];
                if (result.length <= 1) return result;
                validateKeyExists(result, key, 'SORT_BY');
                result.sort((a, b) => compareValues(a[key], b[key]));
                return result;
            },
            'SORT_BY_DESC': (arr, key) => {
                if (!Array.isArray(arr))
                    throw new Error('Runtime Error: SORT_BY_DESC() requires an array argument');
                if (typeof key !== 'string')
                    throw new Error('Runtime Error: SORT_BY_DESC() second argument must be a string key');
                const result = [...arr];
                if (result.length <= 1) return result;
                validateKeyExists(result, key, 'SORT_BY_DESC');
                result.sort((a, b) => compareValues(b[key], a[key]));
                return result;
            },
            'REVERSE': (arr) => {
                if (!Array.isArray(arr))
                    throw new Error('Runtime Error: REVERSE() requires an array argument');
                return [...arr].reverse();
            },
            'RANDOM': (...args) => {
                if (args.length === 0) {
                    return Math.random();
                } else if (args.length === 1) {
                    if (typeof args[0] !== 'number')
                        throw new Error('Runtime Error: RANDOM() argument must be a number');
                    const max = args[0];
                    if (max <= 0) throw new Error('Runtime Error: RANDOM() max must be positive');
                    return Math.floor(Math.random() * max);
                } else {
                    if (typeof args[0] !== 'number' || typeof args[1] !== 'number')
                        throw new Error('Runtime Error: RANDOM() arguments must be numbers');
                    const min = args[0];
                    const max = args[1];
                    if (min > max) throw new Error('Runtime Error: RANDOM() min cannot be greater than max');
                    return min + Math.floor(Math.random() * (max - min + 1));
                }
            },
            'MILTIME': () => {
                return Date.now();
            },
            'DATE': () => {
                return new Date().toISOString().slice(0, 10);
            },
            'TIME': () => {
                return new Date().toTimeString().slice(0, 8);
            }
        };

        this.functions = { ...defaultFunctions, ...builtInFunctions };

        // SHELL_CTX — sync, creates a context config object
        this.registerExternal('SHELL_CTX', (...args) => {
            if (typeof globalThis.window !== 'undefined') {
                return { status: "error", ok: false, value: "SHELL_CTX() is not available in the browser" };
            }
            if (args.length === 0) {
                return { status: "error", ok: false, value: "SHELL_CTX() requires at least 1 argument (cwd)" };
            }
            const cwd = args[0];
            if (typeof cwd !== 'string') {
                return { status: "error", ok: false, value: "SHELL_CTX() first argument must be a string (directory path)" };
            }
            try {
                const stat = statSync(cwd);
                if (!stat.isDirectory()) {
                    return { status: "error", ok: false, value: "Directory does not exist: " + cwd };
                }
            } catch (e) {
                return { status: "error", ok: false, value: "Directory does not exist: " + cwd };
            }

            const env = {};
            if (args.length >= 2) {
                const envArg = args[1];
                if (typeof envArg !== 'object' || Array.isArray(envArg)) {
                    return { status: "error", ok: false, value: "SHELL_CTX() second argument must be an object (environment variables)" };
                }
                for (const key of Object.keys(envArg)) {
                    env[key] = String(envArg[key]);
                }
            }

            return { status: "done", ok: true, value: { cwd: cwd, env: env } };
        });

        // SHELL — async, executes shell commands
        this.registerExternalAsync('SHELL', (...args) => {
            if (typeof globalThis.window !== 'undefined') {
                return { status: "error", ok: false, value: "SHELL() is not available in the browser" };
            }
            if (args.length === 0) {
                return { status: "error", ok: false, value: "SHELL() requires at least 1 argument" };
            }

            let cmd;
            let options = {};

            if (args.length === 1) {
                // One-off: SHELL(cmd)
                if (typeof args[0] !== 'string') {
                    return { status: "error", ok: false, value: "SHELL() argument must be a string command" };
                }
                cmd = args[0];
            } else {
                // Contextual: SHELL(ctx, cmd)
                let ctx = args[0];
                if (typeof ctx !== 'object' || Array.isArray(ctx)) {
                    return { status: "error", ok: false, value: "SHELL() first argument must be a context object from SHELL_CTX()" };
                }
                // Auto-unwrap Result from SHELL_CTX: {ok, value: {cwd, env}}
                if ('ok' in ctx && 'value' in ctx) {
                    if (ctx.ok === false) {
                        return { status: "error", ok: false, value: "SHELL() received a failed context: " + ctx.value };
                    }
                    if (typeof ctx.value === 'object' && !Array.isArray(ctx.value)) {
                        ctx = ctx.value;
                    }
                }
                if (typeof args[1] !== 'string') {
                    return { status: "error", ok: false, value: "SHELL() second argument must be a string command" };
                }
                cmd = args[1];

                if (typeof ctx.cwd === 'string') {
                    options.cwd = ctx.cwd;
                }
                if (ctx.env && typeof ctx.env === 'object') {
                    options.env = { ...process.env, ...ctx.env };
                }
            }

            try {
                const output = execSync(cmd, {
                    shell: '/bin/sh',
                    encoding: 'utf-8',
                    stdio: ['pipe', 'pipe', 'pipe'],
                    ...options
                });
                // Trim trailing newline
                const trimmed = output.endsWith('\n') ? output.slice(0, -1) : output;
                return { status: "done", ok: true, value: trimmed };
            } catch (e) {
                // execSync throws on non-zero exit
                let output = '';
                if (e.stdout) output = e.stdout;
                if (e.stderr) output += e.stderr;
                if (output.endsWith('\n')) output = output.slice(0, -1);
                return { status: "error", ok: false, value: output };
            }
        });
    }

    // --- Helper methods (non-generators) ---

    // Deep equality for objects and arrays (language-level == comparison)
    _deepEqual(a, b) {
        if (a === b) return true;
        if (a === null || b === null) return false;
        if (typeof a !== typeof b) return false;
        if (typeof a !== 'object') return false;

        const aIsArray = Array.isArray(a);
        const bIsArray = Array.isArray(b);
        if (aIsArray !== bIsArray) return false;

        if (aIsArray) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (!this._deepEqual(a[i], b[i])) return false;
            }
            return true;
        }

        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) return false;
        for (const key of aKeys) {
            if (!b.hasOwnProperty(key) || !this._deepEqual(a[key], b[key])) return false;
        }
        return true;
    }

    // Register an external built-in function with automatic error wrapping.
    // The function can return Result.ok(value) or Result.error(msg) explicitly,
    // or throw an exception which is automatically caught and wrapped as
    // {ok: false, value: "error message"}.
    registerExternal(name, func) {
        this.functions[name] = (...args) => {
            try {
                return func(...args);
            } catch (e) {
                return { ok: false, value: e.message };
            }
        };
    }

    // Register an async external function that executes on a background Promise.
    // Used for blocking I/O (DB queries, HTTP calls) so other ProperTee threads aren't frozen.
    // The function can be synchronous or return a Promise for truly async operations.
    registerExternalAsync(name, func, timeoutMs = 0) {
        const self = this;
        this.functions[name] = (...args) => {
            if (!self.activeThread) {
                throw new Error("Runtime Error: Async function '" + name + "' can only be called within the scheduler");
            }
            const thread = self.activeThread;
            if (thread.inMonitorContext) {
                throw new Error("Runtime Error: Async function '" + name + "' cannot be called in monitor blocks");
            }

            // Build cache key
            const formatJsonValue = (value) => {
                if (value === null || value === undefined) return 'null';
                if (typeof value === 'string') return "'" + value + "'";
                if (typeof value === 'boolean') return String(value);
                if (typeof value === 'number') return String(value);
                if (Array.isArray(value)) return '[ ' + value.map(v => formatJsonValue(v)).join(', ') + ' ]';
                if (typeof value === 'object') {
                    const keys = Object.keys(value);
                    return '{ ' + keys.map(k => '"' + k + '": ' + formatJsonValue(value[k])).join(', ') + ' }';
                }
                return String(value);
            };
            const cacheKey = name + "|" + formatJsonValue(args);

            // Check cache first (result from completed async operation)
            if (cacheKey in thread.asyncResultCache) {
                return thread.asyncResultCache[cacheKey];
            }

            // Deep-copy args for safety
            const safeCopyArgs = args.map(a => self.deepCopy(a));
            const currentCacheKey = cacheKey;

            // Execute function asynchronously via setTimeout to yield to event loop.
            // Supports both sync functions and functions that return Promises.
            const promise = new Promise((resolve) => {
                setTimeout(() => {
                    try {
                        const result = func(...safeCopyArgs);
                        if (result && typeof result.then === 'function') {
                            result.then(
                                (val) => resolve(val),
                                (err) => resolve({ status: "error", ok: false, value: err.message })
                            );
                        } else {
                            resolve(result);
                        }
                    } catch (e) {
                        resolve({ status: "error", ok: false, value: e.message });
                    }
                }, 0);
            });

            // When promise resolves, store result on thread (only if still waiting for same key)
            promise.then((result) => {
                if (thread.asyncCacheKey === currentCacheKey) {
                    thread.asyncResolved = true;
                    thread.asyncResolvedValue = result;
                }
            });

            // Store async state on thread
            thread.asyncCacheKey = cacheKey;
            thread.asyncTimeoutMs = timeoutMs;
            thread.asyncSubmitTime = Date.now();

            // Throw to unwind expression evaluation
            throw new AsyncPendingError();
        };
    }

    // No-op in JS (Promises self-clean, no executor to shut down)
    shutdown() {}

    // Result helper for external functions
    static ok(value) {
        return { status: "done", ok: true, value: value };
    }

    static error(message) {
        return { status: "error", ok: false, value: message };
    }

    getLocation(ctx) {
        if (ctx && ctx.start) {
            return `line ${ctx.start.line}:${ctx.start.column}`;
        }
        return 'unknown location';
    }

    createError(message, ctx) {
        const location = this.getLocation(ctx);
        return new Error(`Runtime Error at ${location}: ${message}`);
    }

    // Get current scope stack (from activeThread or fallback to this.scopeStack)
    _getScopeStack() {
        if (this.activeThread) return this.activeThread.scopeStack;
        return this.scopeStack;
    }

    // Get current variables store (from activeThread snapshot or this.variables)
    _getVariables() {
        if (this.activeThread && this.activeThread.globalSnapshot) {
            return this.activeThread.globalSnapshot;
        }
        return this.variables;
    }

    // Check if in thread context
    _isInThreadContext() {
        if (this.activeThread) return this.activeThread.inThreadContext;
        return this.inThreadContext;
    }

    // Check if in monitor context
    _isInMonitorContext() {
        if (this.activeThread) return this.activeThread.inMonitorContext;
        return this.inMonitorContext;
    }

    // Check if in multi context
    _isInMultiContext() {
        if (this.activeThread) return this.activeThread.inMultiContext;
        return this.inMultiContext;
    }

    // Get multi result vars
    _getMultiResultVars() {
        if (this.activeThread) return this.activeThread.multiResultVars;
        return this.multiResultVars;
    }

    _isInFunctionScope() {
        return this._getScopeStack().length > 0;
    }

    // Override the base visit() to handle generator dispatch
    visit(ctx) {
        if (!ctx) return null;
        // ANTLR4's accept() calls visitXxx(), which now returns a generator
        const result = ctx.accept(this);
        return result;
    }

    // --- Root and Block (statement-level, yield at boundaries) ---

    *visitRoot(ctx) {
        let result = null;
        const statements = ctx.statement();
        let i = 0;

        try {
            while (i < statements.length) {
                try {
                    yield statements[i].start.line;
                    result = yield* this.visit(statements[i]);
                    if (this.activeThread) this.activeThread.asyncResultCache = {};
                    i++;
                } catch (inner) {
                    if (inner instanceof AsyncPendingError) {
                        yield { __schedulerCommand: true, type: 'AWAIT_ASYNC' };
                        continue; // retry same statement
                    }
                    throw inner;
                }
            }
            return result;
        } catch (e) {
            if (e instanceof ReturnException) {
                return e.value;
            }
            throw e;
        }
    }

    *visitBlock(ctx) {
        let result = null;
        const statements = ctx.statement();
        let i = 0;

        while (i < statements.length) {
            try {
                yield statements[i].start.line;
                result = yield* this.visit(statements[i]);
                if (this.activeThread) this.activeThread.asyncResultCache = {};
                i++;
            } catch (inner) {
                if (inner instanceof AsyncPendingError) {
                    yield { __schedulerCommand: true, type: 'AWAIT_ASYNC' };
                    continue;
                }
                throw inner;
            }
        }
        return result;
    }

    // --- Statements ---

    *visitAssignStmt(ctx) {
        return yield* this.visit(ctx.assignment());
    }

    *visitAssignment(ctx) {
        if (this._isInMonitorContext()) {
            throw this.createError('Cannot assign variables in monitor block (read-only)', ctx);
        }

        const lvalueCtx = ctx.lvalue();
        const value = yield* this.visit(ctx.expression());
        const scopeStack = this._getScopeStack();
        const variables = this._getVariables();

        // Case 0: global variable assignment (::varName = value)
        if (lvalueCtx.constructor.name === 'GlobalVarLValueContext') {
            const varName = lvalueCtx.ID().getText();

            if (this._isInThreadContext()) {
                throw this.createError(
                    `Cannot assign to global variable '::${varName}' inside multi block. ` +
                    `Functions in multi blocks can only read global variables (via ::) and write to local variables.`,
                    ctx
                );
            }

            // Write directly to globals (bypasses local scopes)
            this.variables[varName] = this.deepCopy(value);
            return value;
        }

        // Case 1: variable assignment
        if (lvalueCtx.constructor.name === 'VarLValueContext') {
            const varName = lvalueCtx.ID().getText();

            // Thread purity: no global writes
            if (this._isInThreadContext() && scopeStack.length === 0) {
                throw this.createError(
                    `Cannot assign to global variable '${varName}' inside multi block. ` +
                    `Functions in multi blocks can only read global variables (via ::) and write to local variables.`,
                    ctx
                );
            }

            if (scopeStack.length > 0) {
                scopeStack[scopeStack.length - 1][varName] = this.deepCopy(value);
            } else {
                variables[varName] = this.deepCopy(value);
            }
            return value;
        }

        // Case 2: property assignment
        if (lvalueCtx.constructor.name === 'PropLValueContext') {
            const targetObj = yield* this._evaluateLValueForAssignment(lvalueCtx.lvalue());
            const key = yield* this.visit(lvalueCtx.access());

            if (typeof targetObj !== 'object' || targetObj === null) {
                throw this.createError(`Cannot set property '${key}' on non-object`, ctx);
            }
            if (typeof key === 'number' && Array.isArray(targetObj)) {
                const idx = key - 1; // 1-based to 0-based
                if (idx < 0 || idx >= targetObj.length) {
                    throw this.createError('Array index out of bounds', ctx);
                }
                targetObj[idx] = this.deepCopy(value);
            } else {
                targetObj[key] = this.deepCopy(value);
            }
            return value;
        }

        throw this.createError('Unknown lvalue type', ctx);
    }

    *_evaluateLValueForAssignment(lvalueCtx) {
        const scopeStack = this._getScopeStack();
        const variables = this._getVariables();

        if (lvalueCtx.constructor.name === 'GlobalVarLValueContext') {
            const varName = lvalueCtx.ID().getText();
            if (varName in variables) return variables[varName];
            if (varName in this.properties) return this.properties[varName];
            throw new Error(`Runtime Error: Global variable '${varName}' is not defined`);
        }

        if (lvalueCtx.constructor.name === 'VarLValueContext') {
            const varName = lvalueCtx.ID().getText();

            // Check scope stack
            for (let i = scopeStack.length - 1; i >= 0; i--) {
                if (varName in scopeStack[i]) return scopeStack[i][varName];
            }

            // Inside a function: plain variables are local-only
            if (this._isInFunctionScope()) {
                throw new Error(`Runtime Error: Variable '${varName}' is not defined in local scope. Use ::${varName} to access the global variable.`);
            }

            if (varName in variables) return variables[varName];
            if (varName in this.properties) return this.properties[varName];
            throw new Error(`Runtime Error: Variable '${varName}' is not defined`);
        }

        if (lvalueCtx.constructor.name === 'PropLValueContext') {
            const targetObj = yield* this._evaluateLValueForAssignment(lvalueCtx.lvalue());
            const key = yield* this.visit(lvalueCtx.access());
            if (targetObj === null) throw new Error(`Runtime Error: Cannot access property '${key}' of null`);
            // Array access: convert 1-based key to 0-based index
            if (typeof key === 'number' && Array.isArray(targetObj)) {
                return targetObj[key - 1];
            }
            // Object access: integer keys become string keys
            if (typeof key === 'number' && typeof targetObj === 'object') {
                return targetObj[String(key)];
            }
            return targetObj[key];
        }

        throw new Error('Runtime Error: Unknown lvalue type in assignment');
    }

    *visitVarLValue(ctx) {
        const varName = ctx.ID().getText();
        const scopeStack = this._getScopeStack();
        const variables = this._getVariables();

        for (let i = scopeStack.length - 1; i >= 0; i--) {
            if (varName in scopeStack[i]) return scopeStack[i][varName];
        }

        // Inside a function: plain variables are local-only
        if (this._isInFunctionScope()) {
            throw new Error(`Runtime Error: Variable '${varName}' is not defined in local scope. Use ::${varName} to access the global variable.`);
        }

        if (varName in variables) return variables[varName];
        if (varName in this.properties) return this.properties[varName];
        throw new Error(`Runtime Error: Variable '${varName}' is not defined`);
    }

    *visitGlobalVarLValue(ctx) {
        const varName = ctx.ID().getText();
        const variables = this._getVariables();

        if (varName in variables) return variables[varName];
        if (varName in this.properties) return this.properties[varName];
        throw new Error(`Runtime Error: Global variable '${varName}' is not defined`);
    }

    *visitPropLValue(ctx) {
        const targetObj = yield* this.visit(ctx.lvalue());
        const key = yield* this.visit(ctx.access());

        if (targetObj === null) throw new Error(`Runtime Error: Cannot access property '${key}' of null`);
        if (typeof targetObj === 'object' && !(key in targetObj)) {
            throw new Error(`Runtime Error: Property '${key}' does not exist`);
        }
        return targetObj[key];
    }

    *visitIfStmt(ctx) {
        return yield* this.visit(ctx.ifStatement());
    }

    *visitIfStatement(ctx) {
        const condition = yield* this.visit(ctx.condition);

        if (condition === true) {
            if (ctx.thenBody) {
                return yield* this.visitBlock(ctx.thenBody);
            }
            return null;
        } else if (ctx.elseBody) {
            return yield* this.visitBlock(ctx.elseBody);
        }
        return null;
    }

    *visitIterStmt(ctx) {
        return yield* this.visit(ctx.iterationStmt());
    }

    *visitConditionLoop(ctx) {
        let result = null;
        const isInfinite = ctx.K_INFINITE() !== null;
        const maxIterations = isInfinite ? Infinity : this.maxIterations;
        let iterations = 0;

        try {
            let condition = yield* this.visit(ctx.expression());

            while (condition === true) {
                if (++iterations > maxIterations) {
                    if (this.iterationLimitBehavior === 'warn') {
                        this.stderr(`Warning: Loop exceeded maximum iterations (${maxIterations}), stopping loop`);
                        break;
                    } else {
                        throw this.createError(
                            `Loop exceeded maximum iterations (${maxIterations}). Use 'loop condition infinite do' if you need unlimited iterations.`,
                            ctx
                        );
                    }
                }

                yield ctx.start.line; // Loop iteration boundary (before execution)

                try {
                    result = yield* this.visitBlock(ctx.block());
                } catch (e) {
                    if (e instanceof BreakException) break;
                    else if (e instanceof ContinueException) { /* continue */ }
                    else throw e;
                }

                condition = yield* this.visit(ctx.expression());
            }
        } catch (e) {
            if (!(e instanceof BreakException)) throw e;
        }

        return result;
    }

    *visitValueLoop(ctx) {
        const iterable = yield* this.visit(ctx.expression());
        const isInfinite = ctx.K_INFINITE() !== null;
        const maxIterations = isInfinite ? Infinity : this.maxIterations;
        let iterations = 0;
        let result = null;
        const valueVar = ctx.value.text;
        const variables = this._getVariables();
        const scopeStack = this._getScopeStack();

        if (Array.isArray(iterable)) {
            try {
                for (let i = 0; i < iterable.length; i++) {
                    if (++iterations > maxIterations) {
                        if (this.iterationLimitBehavior === 'warn') {
                            this.stderr(`Warning: Loop exceeded maximum iterations (${maxIterations}), stopping loop`);
                            break;
                        } else {
                            throw this.createError(`Loop exceeded maximum iterations (${maxIterations}). Use 'loop ... infinite do' if you need unlimited iterations.`, ctx);
                        }
                    }

                    // Set loop variable
                    if (scopeStack.length > 0) {
                        scopeStack[scopeStack.length - 1][valueVar] = this.deepCopy(iterable[i]);
                    } else {
                        variables[valueVar] = this.deepCopy(iterable[i]);
                    }

                    yield ctx.start.line; // Loop iteration boundary (before execution)

                    try {
                        result = yield* this.visitBlock(ctx.block());
                    } catch (e) {
                        if (e instanceof BreakException) break;
                        else if (e instanceof ContinueException) { /* continue */ }
                        else throw e;
                    }
                }
            } catch (e) {
                if (!(e instanceof BreakException)) throw e;
            }
        } else if (typeof iterable === 'object' && iterable !== null) {
            try {
                for (const key in iterable) {
                    if (iterable.hasOwnProperty(key)) {
                        if (++iterations > maxIterations) {
                            if (this.iterationLimitBehavior === 'warn') {
                                this.stderr(`Warning: Loop exceeded maximum iterations (${maxIterations}), stopping loop`);
                                break;
                            } else {
                                throw this.createError(`Loop exceeded maximum iterations (${maxIterations}). Use 'loop ... infinite do' if you need unlimited iterations.`, ctx);
                            }
                        }

                        if (scopeStack.length > 0) {
                            scopeStack[scopeStack.length - 1][valueVar] = this.deepCopy(iterable[key]);
                        } else {
                            variables[valueVar] = this.deepCopy(iterable[key]);
                        }

                        yield ctx.start.line; // Loop iteration boundary (before execution)

                        try {
                            result = yield* this.visitBlock(ctx.block());
                        } catch (e) {
                            if (e instanceof BreakException) break;
                            else if (e instanceof ContinueException) { /* continue */ }
                            else throw e;
                        }
                    }
                }
            } catch (e) {
                if (!(e instanceof BreakException)) throw e;
            }
        } else {
            throw new Error('Runtime Error: Cannot iterate over non-iterable value');
        }

        return result;
    }

    *visitKeyValueLoop(ctx) {
        const iterable = yield* this.visit(ctx.expression());
        const isInfinite = ctx.K_INFINITE() !== null;
        const maxIterations = isInfinite ? Infinity : this.maxIterations;
        let iterations = 0;
        let result = null;
        const keyVar = ctx.key.text;
        const valueVar = ctx.value.text;
        const variables = this._getVariables();
        const scopeStack = this._getScopeStack();

        if (Array.isArray(iterable)) {
            try {
                for (let i = 0; i < iterable.length; i++) {
                    if (++iterations > maxIterations) {
                        if (this.iterationLimitBehavior === 'warn') {
                            this.stderr(`Warning: Loop exceeded maximum iterations (${maxIterations}), stopping loop`);
                            break;
                        } else {
                            throw this.createError(`Loop exceeded maximum iterations (${maxIterations}). Use 'loop ... infinite do' if you need unlimited iterations.`, ctx);
                        }
                    }

                    if (scopeStack.length > 0) {
                        scopeStack[scopeStack.length - 1][keyVar] = i + 1;
                        scopeStack[scopeStack.length - 1][valueVar] = this.deepCopy(iterable[i]);
                    } else {
                        variables[keyVar] = i + 1;
                        variables[valueVar] = this.deepCopy(iterable[i]);
                    }

                    yield ctx.start.line; // Loop iteration boundary (before execution)

                    try {
                        result = yield* this.visitBlock(ctx.block());
                    } catch (e) {
                        if (e instanceof BreakException) break;
                        else if (e instanceof ContinueException) { /* continue */ }
                        else throw e;
                    }
                }
            } catch (e) {
                if (!(e instanceof BreakException)) throw e;
            }
        } else if (typeof iterable === 'object' && iterable !== null) {
            try {
                for (const key in iterable) {
                    if (iterable.hasOwnProperty(key)) {
                        if (++iterations > maxIterations) {
                            if (this.iterationLimitBehavior === 'warn') {
                                this.stderr(`Warning: Loop exceeded maximum iterations (${maxIterations}), stopping loop`);
                                break;
                            } else {
                                throw this.createError(`Loop exceeded maximum iterations (${maxIterations}). Use 'loop ... infinite do' if you need unlimited iterations.`, ctx);
                            }
                        }

                        if (scopeStack.length > 0) {
                            scopeStack[scopeStack.length - 1][keyVar] = key;
                            scopeStack[scopeStack.length - 1][valueVar] = this.deepCopy(iterable[key]);
                        } else {
                            variables[keyVar] = key;
                            variables[valueVar] = this.deepCopy(iterable[key]);
                        }

                        yield ctx.start.line; // Loop iteration boundary (before execution)

                        try {
                            result = yield* this.visitBlock(ctx.block());
                        } catch (e) {
                            if (e instanceof BreakException) break;
                            else if (e instanceof ContinueException) { /* continue */ }
                            else throw e;
                        }
                    }
                }
            } catch (e) {
                if (!(e instanceof BreakException)) throw e;
            }
        } else {
            throw new Error('Runtime Error: Cannot iterate over non-iterable value');
        }

        return result;
    }

    *visitFlowStmt(ctx) {
        return yield* this.visit(ctx.flowControl());
    }

    *visitBreakStmt(ctx) {
        throw new BreakException();
    }

    *visitContinueStmt(ctx) {
        throw new ContinueException();
    }

    *visitReturnStmt(ctx) {
        const value = ctx.expression() ? yield* this.visit(ctx.expression()) : {};
        throw new ReturnException(value);
    }

    *visitDebugStmt(ctx) {
        yield { __debugBreak: true, line: ctx.start.line };
    }

    // --- Function Definition ---

    *visitFuncDefStmt(ctx) {
        return yield* this.visit(ctx.functionDef());
    }

    *visitFunctionDef(ctx) {
        const funcName = ctx.funcName.text;
        const params = [];
        if (ctx.parameterList()) {
            for (const idToken of ctx.parameterList().ID()) {
                params.push(idToken.getText());
            }
        }

        this.userDefinedFunctions[funcName] = {
            params: params,
            body: ctx.block()
        };
        return null;
    }

    // --- SPAWN statements ---

    *visitSpawnExecStmt(ctx) {
        return yield* this.visit(ctx.spawnStmt());
    }

    _resolveAndValidateDynamicKey(keyValue, ctx) {
        const key = this.functions['TO_STRING'](keyValue);
        if (key.length === 0) {
            return null; // treat empty as unnamed (auto-keyed)
        }
        // Duplicate key check
        for (const existing of this._collectedSpawns) {
            if (existing.resultKey !== null && existing.resultKey === key) {
                throw this.createError(`Duplicate result key '${key}' in multi block`, ctx);
            }
        }
        return key;
    }

    _processStringEscapes(raw) {
        let result = '';
        for (let i = 0; i < raw.length; i++) {
            if (raw[i] === '\\' && i + 1 < raw.length) {
                const next = raw[i + 1];
                switch (next) {
                    case 'n': result += '\n'; break;
                    case 't': result += '\t'; break;
                    case 'r': result += '\r'; break;
                    case '\\': result += '\\'; break;
                    case '"': result += '"'; break;
                    default: result += '\\' + next; break;
                }
                i++;
            } else {
                result += raw[i];
            }
        }
        return result;
    }

    *visitSpawnKeyStmt(ctx) {
        if (!this._inMultiSetup) {
            throw this.createError('thread can only be used inside multi blocks', ctx);
        }
        const funcCallCtx = ctx.functionCall();
        const funcName = funcCallCtx.funcName.text;

        // Resolve key using access rule (same as property access)
        let keyName = null;
        const accessCtx = ctx.access();
        if (accessCtx) {
            const ctorName = accessCtx.constructor.name;
            if (ctorName === 'StaticAccessContext') {
                keyName = accessCtx.ID().getText();
            } else if (ctorName === 'StringKeyAccessContext') {
                const raw = accessCtx.STRING().getText();
                const key = this._processStringEscapes(raw.substring(1, raw.length - 1));
                keyName = key.length === 0 ? null : key; // empty string treated as unnamed
            } else if (ctorName === 'ArrayAccessContext') {
                keyName = accessCtx.INTEGER().getText();
            } else if (ctorName === 'VarEvalAccessContext') {
                const varName = accessCtx.ID().getText();
                let keyValue = undefined;

                if (accessCtx.GLOBAL_PREFIX()) {
                    // $::var — resolve from globals/properties directly
                    const variables = this._getVariables();
                    if (varName in variables) {
                        keyValue = variables[varName];
                    } else if (varName in this.properties) {
                        keyValue = this.properties[varName];
                    } else {
                        throw this.createError(`Variable '${varName}' is not defined`, ctx);
                    }
                } else {
                    const scopeStack = this._getScopeStack();
                    const variables = this._getVariables();

                    for (let i = scopeStack.length - 1; i >= 0; i--) {
                        if (varName in scopeStack[i]) {
                            keyValue = scopeStack[i][varName];
                            break;
                        }
                    }
                    if (keyValue === undefined) {
                        if (this._isInFunctionScope()) {
                            throw this.createError(
                                `Variable '${varName}' is not defined in local scope. Use ::${varName} to access the global variable.`,
                                ctx
                            );
                        }
                        if (varName in variables) {
                            keyValue = variables[varName];
                        } else if (varName in this.properties) {
                            keyValue = this.properties[varName];
                        } else {
                            throw this.createError(`Variable '${varName}' is not defined`, ctx);
                        }
                    }
                }
                keyName = this._resolveAndValidateDynamicKey(keyValue, ctx);
            } else if (ctorName === 'EvalAccessContext') {
                const keyValue = yield* this.visit(accessCtx.expression());
                keyName = this._resolveAndValidateDynamicKey(keyValue, ctx);
            }
            // Duplicate key check
            for (const existing of this._collectedSpawns) {
                if (existing.resultKey !== null && existing.resultKey === keyName) {
                    throw this.createError(`Duplicate result key '${keyName}' in multi block`, ctx);
                }
            }
        }

        // Evaluate arguments now (during setup phase)
        const args = [];
        if (funcCallCtx.expression()) {
            for (const exprCtx of funcCallCtx.expression()) {
                args.push(yield* this.visit(exprCtx));
            }
        }

        this._collectedSpawns.push({ funcName, args, resultKey: keyName, ctx: funcCallCtx });
        return null;
    }

    *visitExprStmt(ctx) {
        return yield* this.visit(ctx.expression());
    }

    // --- Expressions (use yield* delegation, no scheduler yields) ---

    *visitAtomExpr(ctx) {
        return yield* this.visit(ctx.atom());
    }

    *visitVarReference(ctx) {
        const name = ctx.ID().getText();
        const scopeStack = this._getScopeStack();
        const variables = this._getVariables();
        const multiResultVars = this._getMultiResultVars();

        // Check multi result vars (blocked inside MULTI context)
        if (this._isInMultiContext() && multiResultVars.has(name)) {
            throw this.createError(
                `Cannot use result variable '${name}' inside MULTI block. Result variables are only available after 'end'.`,
                ctx
            );
        }

        // 1. Local scopes
        for (let i = scopeStack.length - 1; i >= 0; i--) {
            if (name in scopeStack[i]) return scopeStack[i][name];
        }

        // 2. MULTI result vars
        if (multiResultVars.has(name)) {
            return multiResultVars.get(name);
        }

        // Inside a function: plain variables are local-only, no fallthrough to globals
        if (this._isInFunctionScope()) {
            throw this.createError(
                `Variable '${name}' is not defined in local scope. Use ::${name} to access the global variable.`,
                ctx
            );
        }

        // 3. Variables (global or snapshot) — top-level only
        if (name in variables) return variables[name];

        // 4. Built-in properties — top-level only
        if (name in this.properties) return this.properties[name];

        throw this.createError(`Variable '${name}' is not defined`, ctx);
    }

    *visitGlobalVarReference(ctx) {
        const name = ctx.ID().getText();
        const variables = this._getVariables();

        // Global variables
        if (name in variables) return variables[name];

        // Built-in properties
        if (name in this.properties) return this.properties[name];

        throw this.createError(`Global variable '${name}' is not defined`, ctx);
    }

    *visitIntegerAtom(ctx) {
        return parseInt(ctx.getText(), 10);
    }

    *visitDecimalAtom(ctx) {
        return parseFloat(ctx.getText());
    }

    *visitStringAtom(ctx) {
        const str = ctx.getText();
        return str.substring(1, str.length - 1);
    }

    *visitBooleanAtom(ctx) {
        return ctx.getText() === 'true';
    }

    *visitParenAtom(ctx) {
        return yield* this.visit(ctx.expression());
    }

    *visitObjectAtom(ctx) {
        return yield* this.visit(ctx.objectLiteral());
    }

    *visitObjectLiteral(ctx) {
        const obj = {};
        if (!ctx.objectEntry()) return obj;

        for (const entryCtx of ctx.objectEntry()) {
            const key = this.resolveObjectKey(entryCtx.objectKey());
            const value = yield* this.visit(entryCtx.expression());
            obj[key] = value;
        }
        return obj;
    }

    // Non-generator helper
    resolveObjectKey(ctx) {
        if (ctx.STRING()) {
            const str = ctx.STRING().getText();
            return str.substring(1, str.length - 1);
        }
        if (ctx.INTEGER()) return ctx.INTEGER().getText();
        return null;
    }

    *visitArrayAtom(ctx) {
        return yield* this.visit(ctx.arrayLiteral());
    }

    *visitListArray(ctx) {
        const arr = [];
        if (!ctx.expression()) return arr;

        for (const exprCtx of ctx.expression()) {
            arr.push(yield* this.visit(exprCtx));
        }
        return arr;
    }

    *visitRangeArray(ctx) {
        const startVal = yield* this.visit(ctx.rangeStart);
        const endVal = yield* this.visit(ctx.rangeEnd);

        if (typeof startVal !== 'number' || typeof endVal !== 'number') {
            throw this.createError('Range bounds must be numbers', ctx);
        }

        let step;
        if (ctx.rangeStep) {
            const stepVal = yield* this.visit(ctx.rangeStep);
            if (typeof stepVal !== 'number') {
                throw this.createError('Range step must be a number', ctx);
            }
            step = stepVal;
            if (step <= 0) {
                throw this.createError('Range step must be positive', ctx);
            }
        } else {
            step = 1;
        }

        // Negate step when descending
        if (startVal > endVal) {
            step = -step;
        }

        const arr = [];
        if (Number.isInteger(startVal) && Number.isInteger(endVal) && (ctx.rangeStep == null || Number.isInteger(step))) {
            if (step > 0) {
                for (let i = startVal; i <= endVal; i += step) arr.push(i);
            } else {
                for (let i = startVal; i >= endVal; i += step) arr.push(i);
            }
        } else {
            if (step > 0) {
                for (let v = startVal; v <= endVal + 1e-9; v += step) {
                    v = Math.round(v * 1e12) / 1e12;
                    if (v > endVal + 1e-9) break;
                    arr.push(v);
                }
            } else {
                for (let v = startVal; v >= endVal - 1e-9; v += step) {
                    v = Math.round(v * 1e12) / 1e12;
                    if (v < endVal - 1e-9) break;
                    arr.push(v);
                }
            }
        }
        return arr;
    }

    // Member access
    *visitMemberAccessExpr(ctx) {
        const targetObj = yield* this.visit(ctx.expression(0));
        const key = yield* this.visit(ctx.access());

        if (targetObj === null) {
            throw this.createError(`Cannot access property '${key}' of null`, ctx);
        }

        // Object access: integer keys become string keys (no positional access)
        if (typeof key === 'number' && typeof targetObj === 'object' && !Array.isArray(targetObj)) {
            const strKey = String(key);
            if (!(strKey in targetObj)) {
                throw this.createError(`Property '${key}' does not exist`, ctx);
            }
            return targetObj[strKey];
        }

        // Array access: convert 1-based to 0-based
        if (typeof key === 'number' && Array.isArray(targetObj)) {
            const idx = key - 1;
            if (idx < 0 || idx >= targetObj.length) {
                throw this.createError('Array index out of bounds', ctx);
            }
            return targetObj[idx];
        }

        // String character access: convert 1-based to 0-based
        if (typeof key === 'number' && typeof targetObj === 'string') {
            const idx = key - 1;
            if (idx < 0 || idx >= targetObj.length) {
                throw this.createError('String index out of bounds', ctx);
            }
            return targetObj[idx];
        }

        if (typeof targetObj === 'object' && !(key in targetObj)) {
            throw this.createError(`Property '${key}' does not exist`, ctx);
        }

        return targetObj[key];
    }

    // Access visitors
    *visitStaticAccess(ctx) {
        return ctx.ID().getText();
    }

    *visitVarEvalAccess(ctx) {
        const varName = ctx.ID().getText();

        // $::var — resolve from globals/properties directly (same as ::var)
        if (ctx.GLOBAL_PREFIX()) {
            const variables = this._getVariables();
            if (varName in variables) return variables[varName];
            if (varName in this.properties) return this.properties[varName];
            return undefined;
        }

        const scopeStack = this._getScopeStack();
        const variables = this._getVariables();

        // Check scope stack first
        for (let i = scopeStack.length - 1; i >= 0; i--) {
            if (varName in scopeStack[i]) return scopeStack[i][varName];
        }

        // Inside a function: $key only checks local scope
        if (this._isInFunctionScope()) return undefined;

        if (varName in variables) return variables[varName];
        if (varName in this.properties) return this.properties[varName];
        return undefined;
    }

    *visitArrayAccess(ctx) {
        return parseInt(ctx.INTEGER().getText(), 10); // 1-based; member access converts for arrays
    }

    *visitStringKeyAccess(ctx) {
        const str = ctx.STRING().getText();
        return str.substring(1, str.length - 1);
    }

    *visitEvalAccess(ctx) {
        return yield* this.visit(ctx.expression());
    }

    // Operators
    *visitUnaryMinusExpr(ctx) {
        const value = yield* this.visit(ctx.expression());
        if (typeof value !== 'number') {
            throw this.createError(`Unary minus requires numeric operand. Got -${typeof value}`, ctx);
        }
        return -value;
    }

    *visitNotExpr(ctx) {
        const value = yield* this.visit(ctx.expression());
        if (typeof value !== 'boolean') {
            throw this.createError(`Logical NOT requires boolean operand. Got not ${typeof value}`, ctx);
        }
        return !value;
    }

    *visitMultiplicativeExpr(ctx) {
        const left = yield* this.visit(ctx.expression(0));
        const right = yield* this.visit(ctx.expression(1));
        const op = ctx.children[1].getText();

        if (typeof left !== 'number' || typeof right !== 'number') {
            throw this.createError(`Arithmetic operator '${op}' requires numeric operands. Got ${typeof left} ${op} ${typeof right}`, ctx);
        }

        if (op === '*') return left * right;
        if (op === '/' || op === '%') {
            if (right === 0) throw this.createError('Division by zero', ctx);
            return op === '/' ? left / right : left % right;
        }
    }

    *visitAdditiveExpr(ctx) {
        const left = yield* this.visit(ctx.expression(0));
        const right = yield* this.visit(ctx.expression(1));
        const op = ctx.children[1].getText();

        if (op === '+') {
            if (typeof left === 'number' && typeof right === 'number') return left + right;
            if (typeof left === 'string' || typeof right === 'string') {
                return this.functions['TO_STRING'](left) + this.functions['TO_STRING'](right);
            }
            throw this.createError(`Addition requires numeric or string operands. Got ${typeof left} + ${typeof right}`, ctx);
        }
        if (op === '-') {
            if (typeof left !== 'number' || typeof right !== 'number') {
                throw this.createError(`Subtraction requires numeric operands. Got ${typeof left} - ${typeof right}`, ctx);
            }
            return left - right;
        }
    }

    *visitComparisonExpr(ctx) {
        const left = yield* this.visit(ctx.expression(0));
        const right = yield* this.visit(ctx.expression(1));
        const op = ctx.op.getText();

        if (op === '>' || op === '<' || op === '>=' || op === '<=') {
            if (typeof left !== 'number' || typeof right !== 'number') {
                throw this.createError(`Comparison operator '${op}' requires numeric operands. Got ${typeof left} ${op} ${typeof right}`, ctx);
            }
        }

        switch (op) {
            case '>': return left > right;
            case '<': return left < right;
            case '==': return this._deepEqual(left, right);
            case '>=': return left >= right;
            case '<=': return left <= right;
            case '!=': return !this._deepEqual(left, right);
            default: return false;
        }
    }

    *visitAndExpr(ctx) {
        const left = yield* this.visit(ctx.expression(0));
        const right = yield* this.visit(ctx.expression(1));

        if (typeof left !== 'boolean' || typeof right !== 'boolean') {
            throw this.createError(`Logical AND requires boolean operands. Got ${typeof left} and ${typeof right}`, ctx);
        }
        return left && right;
    }

    *visitOrExpr(ctx) {
        const left = yield* this.visit(ctx.expression(0));
        const right = yield* this.visit(ctx.expression(1));

        if (typeof left !== 'boolean' || typeof right !== 'boolean') {
            throw this.createError(`Logical OR requires boolean operands. Got ${typeof left} or ${typeof right}`, ctx);
        }
        return left || right;
    }

    // --- Function Call ---

    *visitFuncAtom(ctx) {
        return yield* this.visit(ctx.functionCall());
    }

    *visitFunctionCall(ctx) {
        const funcName = ctx.funcName.text;

        // Evaluate arguments (expressions are atomic via yield*)
        const args = [];
        if (ctx.expression()) {
            for (const exprCtx of ctx.expression()) {
                args.push(yield* this.visit(exprCtx));
            }
        }

        // Built-in function
        if (this.functions[funcName]) {
            const result = this.functions[funcName](...args);

            // SLEEP returns a scheduler command
            if (result && result.__schedulerCommand) {
                yield result; // Yield the command to the scheduler
                return {};
            }

            return result;
        }

        // User-defined function
        if (this.userDefinedFunctions[funcName]) {
            return yield* this._callUserFunction(funcName, args, ctx);
        }

        throw this.createError(`Unknown function '${funcName}'`, ctx);
    }

    // Generator-based user function call
    *_callUserFunction(funcName, args, callCtx) {
        const funcDef = this.userDefinedFunctions[funcName];
        const params = funcDef.params;
        const body = funcDef.body;
        const scopeStack = this._getScopeStack();

        // Argument count validation
        if (args.length > params.length) {
            throw this.createError(
                `Function '${funcName}' expects ${params.length} argument(s), but ${args.length} were provided`,
                callCtx
            );
        }

        // Create local scope with parameters
        const localScope = {};
        for (let i = 0; i < params.length; i++) {
            localScope[params[i]] = i < args.length ? this.deepCopy(args[i]) : {};
        }

        // Push scope
        scopeStack.push(localScope);

        const previousFunctionContext = this.currentFunctionContext;
        this.currentFunctionContext = funcDef;

        try {
            if (body.statement()) {
                const stmts = body.statement();
                let si = 0;
                while (si < stmts.length) {
                    try {
                        yield stmts[si].start.line;
                        yield* this.visit(stmts[si]);
                        if (this.activeThread) this.activeThread.asyncResultCache = {};
                        si++;
                    } catch (inner) {
                        if (inner instanceof AsyncPendingError) {
                            yield { __schedulerCommand: true, type: 'AWAIT_ASYNC' };
                            continue;
                        }
                        throw inner;
                    }
                }
            }

            // No explicit return: result is empty object {}
            return {};

        } catch (e) {
            if (e instanceof ReturnException) {
                return e.value;
            }
            throw e;
        } finally {
            scopeStack.pop();
            this.currentFunctionContext = previousFunctionContext;
        }
    }

    // --- MULTI / Parallel ---

    *visitParallelExecStmt(ctx) {
        return yield* this.visitParallelStmt(ctx.parallelStmt());
    }

    *visitParallelStmt(ctx) {
        const variables = this._getVariables();
        const scopeStack = this._getScopeStack();

        // Extract optional result collection variable name: multi result do
        const resultVarName = ctx.resultVar ? ctx.resultVar.text : null;

        // Deep-copy snapshot of globals for thread purity
        const globalSnapshot = {};
        for (const key of Object.keys(variables)) {
            globalSnapshot[key] = this.deepCopy(variables[key]);
        }

        // Setup phase: execute the block body, collecting SPAWN specs
        // Push a scope so setup variables don't leak (:: required for globals, like functions)
        this._inMultiSetup = true;
        this._collectedSpawns = [];
        scopeStack.push({});

        try {
            yield* this.visitBlock(ctx.block());
        } finally {
            scopeStack.pop();
            this._inMultiSetup = false;
        }

        // If no spawns were collected, assign empty object if resultVarName set
        if (this._collectedSpawns.length === 0) {
            this._collectedSpawns = null;
            if (resultVarName !== null) {
                if (scopeStack.length > 0) {
                    scopeStack[scopeStack.length - 1][resultVarName] = {};
                } else {
                    variables[resultVarName] = {};
                }
            }
            return null;
        }

        // Resolve auto-keys for unnamed threads and check for collisions
        const allKeys = new Set();
        let autoPos = 1;
        for (let i = 0; i < this._collectedSpawns.length; i++) {
            const spawn = this._collectedSpawns[i];
            if (spawn.resultKey !== null && spawn.resultKey !== undefined) {
                allKeys.add(spawn.resultKey);
            }
        }
        for (let i = 0; i < this._collectedSpawns.length; i++) {
            const spawn = this._collectedSpawns[i];
            if (spawn.resultKey === null || spawn.resultKey === undefined) {
                const autoKey = "#" + autoPos;
                if (allKeys.has(autoKey)) {
                    throw this.createError(`Auto-generated key '${autoKey}' conflicts with an explicit key in multi block`, spawn.ctx);
                }
                allKeys.add(autoKey);
                spawn.resultKey = autoKey;
                autoPos++;
            }
        }

        // Build thread specs from collected spawns
        const resultKeyNames = [];
        const specs = [];

        for (let i = 0; i < this._collectedSpawns.length; i++) {
            const spawn = this._collectedSpawns[i];
            resultKeyNames.push(spawn.resultKey);

            if (this.userDefinedFunctions[spawn.funcName]) {
                const funcDef = this.userDefinedFunctions[spawn.funcName];
                const params = funcDef.params;

                // Argument count validation
                if (spawn.args.length > params.length) {
                    throw this.createError(
                        `Function '${spawn.funcName}' expects ${params.length} argument(s), but ${spawn.args.length} were provided`,
                        spawn.ctx
                    );
                }

                // Create local scope for the thread
                const localScope = {};
                for (let j = 0; j < params.length; j++) {
                    localScope[params[j]] = j < spawn.args.length ? this.deepCopy(spawn.args[j]) : {};
                }

                // Create a generator for this thread's execution
                const gen = this._createThreadGenerator(funcDef, localScope, globalSnapshot);

                specs.push({
                    name: `${spawn.funcName}-${i}`,
                    generator: gen,
                    localScope: localScope
                });
            } else if (this.functions[spawn.funcName]) {
                // Built-in function: wrap in a trivial generator
                const builtInFunc = this.functions[spawn.funcName];
                const capturedArgs = spawn.args;
                specs.push({
                    name: `builtin-${spawn.funcName}-${i}`,
                    generator: (function*() {
                        return builtInFunc(...capturedArgs);
                    })(),
                    localScope: null
                });
            } else {
                throw this.createError(`Unknown function '${spawn.funcName}'`, spawn.ctx);
            }
        }

        this._collectedSpawns = null;

        // Monitor spec
        let monitorSpec = null;
        const monitorClause = ctx.monitorClause();
        if (monitorClause) {
            monitorSpec = {
                interval: parseInt(monitorClause.INTEGER().getText()),
                blockCtx: monitorClause.block()
            };
        }

        // Yield SPAWN_THREADS command to the scheduler
        const collectedResults = yield {
            __schedulerCommand: true,
            type: 'SPAWN_THREADS',
            specs: specs,
            monitorSpec: monitorSpec,
            globalSnapshot: globalSnapshot,
            resultKeyNames: resultKeyNames,
            resultVarName: resultVarName
        };

        // When we resume, collectedResults contains the payload from child threads
        if (collectedResults) {
            const payload = collectedResults;
            const payloadResultVarName = payload.resultVarName;
            const collection = payload.collection;

            if (payloadResultVarName !== null && collection !== undefined) {
                // Assign the pre-built collection to resultVarName in appropriate scope
                if (scopeStack.length > 0) {
                    scopeStack[scopeStack.length - 1][payloadResultVarName] = collection;
                } else {
                    variables[payloadResultVarName] = collection;
                }
            }
        }

        return null;
    }

    // Create a generator for a thread function execution
    *_createThreadGenerator(funcDef, localScope, globalSnapshot) {
        const body = funcDef.body;

        // The activeThread will be set by the scheduler when this runs
        // We need to push the local scope onto the active thread's scope stack
        const scopeStack = this._getScopeStack();
        scopeStack.push(localScope);

        try {
            if (body.statement()) {
                const stmts = body.statement();
                let si = 0;
                while (si < stmts.length) {
                    try {
                        yield stmts[si].start.line;
                        yield* this.visit(stmts[si]);
                        if (this.activeThread) this.activeThread.asyncResultCache = {};
                        si++;
                    } catch (inner) {
                        if (inner instanceof AsyncPendingError) {
                            yield { __schedulerCommand: true, type: 'AWAIT_ASYNC' };
                            continue;
                        }
                        throw inner;
                    }
                }
            }

            // No explicit return: result is empty object {}
            return {};

        } catch (e) {
            if (e instanceof ReturnException) {
                return e.value;
            }
            throw e;
        } finally {
            scopeStack.pop();
        }
    }
}

// Flow control exceptions
class BreakException extends Error {
    constructor() {
        super('break');
        this.name = 'BreakException';
    }
}

class ContinueException extends Error {
    constructor() {
        super('continue');
        this.name = 'ContinueException';
    }
}

class ReturnException extends Error {
    constructor(value) {
        super('return');
        this.name = 'ReturnException';
        this.value = value;
    }
}

class AsyncPendingError extends Error {
    constructor() {
        super('async pending');
        this.name = 'AsyncPendingError';
    }
}
