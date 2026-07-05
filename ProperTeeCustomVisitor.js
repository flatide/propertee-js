import ProperTeeVisitor from './ProperTeeVisitor.js';

// Spec v0.8.0 (#4): the ProperTee null value. A Symbol, NOT JS null — the visitor
// uses JS null internally as a statement sentinel, and a Symbol naturally falls
// through every typeof-based check (deepCopy passes it through, _deepEqual matches
// it only by identity, arithmetic/logic/conditions reject it). "No implicit null":
// the language never produces this — it enters only via the `null` literal or data
// (JSON_PARSE, host values).
export const TEE_NULL = Symbol('null');

// Spec v0.10.0: the genuine-Result origin brand. A registry symbol (Symbol.for) so
// Scheduler.js brands collection entries without an import; a symbol KEY is invisible
// to Object.keys / JSON.stringify / for...in, so display, JSON, equality, and TYPE_OF
// are byte-identical — only IS_RESULT and UNWRAP observe it, and deepCopy preserves it.
// Script object literals never carry it.
export const TEE_RESULT = Symbol.for('propertee.result');

function makeResult(status, ok, value) {
    return { status: status, ok: ok, value: value, [TEE_RESULT]: true };
}

function isGenuineResult(v) {
    return v !== null && typeof v === 'object' && v[TEE_RESULT] === true;
}

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

        // Host environment restrictions
        this.hiddenKeywords = new Set();
        this.ignoredFunctions = new Set();

        // Reserved `_PROPS`: the full input set exposed as one object, so a script can print, iterate,
        // or pass along ALL inputs at once (PRINT(_PROPS), JSON_FORMAT(_PROPS), KEYS(_PROPS), _PROPS.a ...)
        // while each key also stays directly accessible as a bare variable (a, b, ...). The visitor keeps
        // its own props view so the caller's object is never mutated, and `_PROPS` holds a (shallow)
        // snapshot that does not contain itself (so JSON_FORMAT(_PROPS) cannot recurse). A caller-supplied
        // `_PROPS` key is left as-is.
        if (builtInProperties && Object.prototype.hasOwnProperty.call(builtInProperties, '_PROPS')) {
            this.properties = builtInProperties;
        } else {
            const incoming = builtInProperties || {};
            this.properties = { ...incoming, _PROPS: { ...incoming } };
        }

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
            // A genuine Result stays genuine across copies (spec v0.10.0 — origin propagation;
            // Object.keys skips symbol keys, so carry the brand explicitly).
            if (value[TEE_RESULT] === true) copy[TEE_RESULT] = true;
            return copy;
        };

        // JSON.stringify that serializes TEE_NULL as JSON null (a bare Symbol would be
        // dropped from objects / already-null in arrays — the replacer makes it uniform)
        const teeJsonStringify = (value) =>
            JSON.stringify(value === TEE_NULL ? null : value, (k, v) => v === TEE_NULL ? null : v);

        // Format a value for display inside collections (strings get single quotes)
        const formatJsonValue = (value) => {
            if (value === TEE_NULL) return 'null';
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
            if (value === TEE_NULL) return 'null';
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
                // spec v0.7.0 (#7): non-collections are an error (was a silent 0)
                throw new Error('Runtime Error: LEN() requires a string, array, or object argument');
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
                if (value === TEE_NULL) return 'null';
                if (typeof value === 'boolean') return value ? 'true' : 'false';
                if (typeof value === 'number') return String(value);
                if (typeof value === 'string') return value;
                if (Array.isArray(value)) return teeJsonStringify(value);
                if (typeof value === 'object' && value !== null) return teeJsonStringify(value);
                return String(value);
            },
            'SLEEP': (milliseconds) => {
                if (typeof milliseconds !== 'number') throw new Error('Runtime Error: SLEEP() requires a number argument');
                if (milliseconds < 0) throw new Error('Runtime Error: SLEEP() duration cannot be negative');
                // Returns a scheduler command instead of a Promise
                return { __schedulerCommand: true, type: 'SLEEP', duration: milliseconds };
            },
            // Spec v0.10.0: genuine-Result constructors + observer. (FAIL/UNWRAP live in
            // visitFunctionCall so their errors carry the call site's line:col.)
            'OK': (value) => makeResult("done", true, value === undefined ? {} : value),
            'ERR': (value) => makeResult("error", false, value === undefined ? {} : value),
            'IS_RESULT': (value) => isGenuineResult(value),
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
            'SLICE': (arr, start, count) => {
                if (!Array.isArray(arr)) throw new Error('Runtime Error: SLICE() first argument must be an array');
                if (typeof start !== 'number') throw new Error('Runtime Error: SLICE() second argument must be a number');
                if (count !== undefined && typeof count !== 'number') throw new Error('Runtime Error: SLICE() third argument must be a number');
                // spec v0.7.0 (#6): 3rd arg is a COUNT, like SUBSTRING and READ_LINES (was an end bound)
                const zeroStart = Math.max(0, start - 1);
                return count === undefined ? arr.slice(zeroStart) : arr.slice(zeroStart, zeroStart + Math.max(0, count));
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
                    // spec v0.7.0 (#5): the single-argument form was removed
                    throw new Error('Runtime Error: RANDOM() requires zero or two arguments');
                } else {
                    if (typeof args[0] !== 'number' || typeof args[1] !== 'number')
                        throw new Error('Runtime Error: RANDOM() arguments must be numbers');
                    const min = args[0];
                    const max = args[1];
                    if (min > max) throw new Error('Runtime Error: RANDOM() min cannot be greater than max');
                    return min + Math.floor(Math.random() * (max - min + 1));
                }
            },
            // --- String matching ---
            'CONTAINS': (str, sub) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: CONTAINS() first argument must be a string');
                if (typeof sub !== 'string') throw new Error('Runtime Error: CONTAINS() second argument must be a string');
                return str.includes(sub);
            },
            'STARTS_WITH': (str, prefix) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: STARTS_WITH() first argument must be a string');
                if (typeof prefix !== 'string') throw new Error('Runtime Error: STARTS_WITH() second argument must be a string');
                return str.startsWith(prefix);
            },
            'ENDS_WITH': (str, suffix) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: ENDS_WITH() first argument must be a string');
                if (typeof suffix !== 'string') throw new Error('Runtime Error: ENDS_WITH() second argument must be a string');
                return str.endsWith(suffix);
            },
            'MATCHES': (str, pattern) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: MATCHES() first argument must be a string');
                if (typeof pattern !== 'string') throw new Error('Runtime Error: MATCHES() second argument must be a string');
                try {
                    return new RegExp(pattern).test(str);
                } catch (e) {
                    throw new Error('Runtime Error: MATCHES() invalid regex pattern: ' + e.message);
                }
            },
            'REGEX_FIND': (str, pattern) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: REGEX_FIND() first argument must be a string');
                if (typeof pattern !== 'string') throw new Error('Runtime Error: REGEX_FIND() second argument must be a string');
                try {
                    const match = new RegExp(pattern).exec(str);
                    if (!match) return {};
                    const groups = [];
                    for (let i = 0; i <= match.length - 1; i++) {
                        groups.push(match[i] !== undefined && match[i] !== null ? match[i] : {});
                    }
                    return groups;
                } catch (e) {
                    throw new Error('Runtime Error: REGEX_FIND() invalid regex pattern: ' + e.message);
                }
            },
            'REPLACE': (str, target, replacement) => {
                if (typeof str !== 'string') throw new Error('Runtime Error: REPLACE() first argument must be a string');
                if (typeof target !== 'string') throw new Error('Runtime Error: REPLACE() second argument must be a string');
                if (typeof replacement !== 'string') throw new Error('Runtime Error: REPLACE() third argument must be a string');
                return str.split(target).join(replacement);
            },
            // --- Map extensions ---
            'VALUES': (obj) => {
                if (typeof obj !== 'object' || obj === null || Array.isArray(obj))
                    throw new Error('Runtime Error: VALUES() argument must be an object');
                return Object.values(obj);
            },
            'ENTRIES': (obj) => {
                if (typeof obj !== 'object' || obj === null || Array.isArray(obj))
                    throw new Error('Runtime Error: ENTRIES() argument must be an object');
                return Object.entries(obj).map(([key, value]) => ({ key, value }));
            },
            'MERGE': (obj1, obj2) => {
                if (typeof obj1 !== 'object' || obj1 === null || Array.isArray(obj1))
                    throw new Error('Runtime Error: MERGE() first argument must be an object');
                if (typeof obj2 !== 'object' || obj2 === null || Array.isArray(obj2))
                    throw new Error('Runtime Error: MERGE() second argument must be an object');
                return { ...obj1, ...obj2 };
            },
            'REMOVE_KEY': (obj, key) => {
                if (typeof obj !== 'object' || obj === null || Array.isArray(obj))
                    throw new Error('Runtime Error: REMOVE_KEY() first argument must be an object');
                if (typeof key !== 'string')
                    throw new Error('Runtime Error: REMOVE_KEY() second argument must be a string');
                const result = { ...obj };
                delete result[key];
                return result;
            },
            // --- Type ---
            'TYPE_OF': (value) => {
                if (value === TEE_NULL) return 'null';   // spec v0.8.0 (#4)
                if (typeof value === 'boolean') return 'boolean';
                if (typeof value === 'number') return 'number';
                if (typeof value === 'string') return 'string';
                if (Array.isArray(value)) return 'array';
                if (typeof value === 'object' && value !== null) return 'object';
                return 'object';
            },
            // --- JSON ---
            'JSON_PARSE': (str) => {
                if (typeof str !== 'string')
                    return makeResult("error", false, "JSON_PARSE() requires a string argument");
                try {
                    const parsed = JSON.parse(str);
                    const convert = (v) => {
                        // spec v0.8.0 (#4): JSON null is preserved (was normalized to {})
                        if (v === null || v === undefined) return TEE_NULL;
                        if (Array.isArray(v)) return v.map(convert);
                        if (typeof v === 'object') {
                            const result = {};
                            for (const [k, val] of Object.entries(v)) {
                                result[k] = convert(val);
                            }
                            return result;
                        }
                        return v;
                    };
                    return makeResult("done", true, convert(parsed));
                } catch (e) {
                    return makeResult("error", false, "Invalid JSON: " + e.message);
                }
            },
            'JSON_FORMAT': (value) => {
                return teeJsonStringify(value);
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

        // SHELL_CTX — stub (no process execution in JS runtime)
        this.registerExternal('SHELL_CTX', (...args) => {
            return makeResult("error", false, "SHELL_CTX() is not available in this environment");
        });

        // SHELL — stub (no process execution in JS runtime)
        this.registerExternalAsync('SHELL', (...args) => {
            return makeResult("error", false, "SHELL() is not available in this environment");
        });

        // ENV — stub (no OS environment access in JS runtime)
        this.registerExternal('ENV', (...args) => {
            return makeResult("error", false, "ENV() is not available in this environment");
        });

        // File I/O — stubs (no filesystem access in JS runtime)
        const fileStub = (name) => (...args) => {
            return makeResult("error", false, name + "() is not available in this environment");
        };
        for (const name of ['FILE_EXISTS', 'FILE_INFO', 'READ_LINES', 'WRITE_FILE', 'WRITE_LINES', 'APPEND_FILE', 'MKDIR', 'LIST_DIR', 'DELETE_FILE']) {
            this.registerExternal(name, fileStub(name));
        }

        // HTTP — stubs (no network access in the JS runtime; a host or the playground provides it)
        for (const name of ['HTTP', 'HTTP_GET', 'HTTP_POST']) {
            this.registerExternal(name, fileStub(name));
        }
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
                // Keep the historical key shape (no `status`); brand only (spec v0.10.0).
                return { ok: false, value: e.message, [TEE_RESULT]: true };
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
                                (err) => resolve(makeResult("error", false, err.message))
                            );
                        } else {
                            resolve(result);
                        }
                    } catch (e) {
                        resolve(makeResult("error", false, e.message));
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

    setHiddenKeywords(keywords) { this.hiddenKeywords = new Set(keywords || []); }
    setIgnoredFunctions(functions) { this.ignoredFunctions = new Set(functions || []); }

    _checkKeywordAllowed(keyword, ctx) {
        if (this.hiddenKeywords.has(keyword))
            throw this.createError(`'${keyword}' is not available in this environment`, ctx);
    }

    // Result helper for external functions (genuine-Result branded — spec v0.10.0)
    static ok(value) {
        return makeResult("done", true, value);
    }

    static error(message) {
        return makeResult("error", false, message);
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

    // ProperTee type name for error messages (same names as TYPE_OF).
    _valueTypeName(v) {
        if (v === TEE_NULL) return 'null';   // spec v0.8.0 (#4)
        if (typeof v === 'boolean') return 'boolean';
        if (typeof v === 'number') return 'number';
        if (typeof v === 'string') return 'string';
        if (Array.isArray(v)) return 'array';
        return 'object';
    }

    // Spec v0.7.0 (#1): if/loop conditions must be boolean — non-booleans are an error, not falsy.
    *_evalCondition(exprCtx) {
        const v = yield* this.visit(exprCtx);
        if (typeof v !== 'boolean') {
            throw this.createError(`Condition requires a boolean value. Got ${this._valueTypeName(v)}`, exprCtx);
        }
        return v;
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
            if (Array.isArray(targetObj)) {
                if (typeof key !== 'number') {
                    throw this.createError('Array index must be a number, got string. Use arr.1 not arr."1"', ctx);
                }
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
        if (Array.isArray(targetObj) && typeof key !== 'number') {
            throw this.createError('Array index must be a number, got string. Use arr.1 not arr."1"', ctx);
        }
        if (typeof targetObj === 'string' && typeof key !== 'number') {
            throw this.createError('String index must be a number, got string. Use str.1 not str."1"', ctx);
        }
        if (typeof targetObj === 'object' && !(key in targetObj)) {
            throw new Error(`Runtime Error: Property '${key}' does not exist`);
        }
        return targetObj[key];
    }

    *visitIfStmt(ctx) {
        this._checkKeywordAllowed('if', ctx);
        return yield* this.visit(ctx.ifStatement());
    }

    *visitIfStatement(ctx) {
        const condition = yield* this._evalCondition(ctx.condition);

        if (condition) {
            if (ctx.thenBody) {
                return yield* this.visitBlock(ctx.thenBody);
            }
            return null;
        }
        // spec v0.9.0 (#3): elseif arms — first true condition wins; later conditions unevaluated
        for (let n = 0; n < ctx.elseifConds.length; n++) {
            if (yield* this._evalCondition(ctx.elseifConds[n])) {
                return yield* this.visitBlock(ctx.elseifBodies[n]);
            }
        }
        if (ctx.elseBody) {
            return yield* this.visitBlock(ctx.elseBody);
        }
        return null;
    }

    *visitIterStmt(ctx) {
        return yield* this.visit(ctx.iterationStmt());
    }

    *visitConditionLoop(ctx) {
        this._checkKeywordAllowed('loop', ctx);
        let result = null;
        const isInfinite = ctx.K_INFINITE() !== null;
        const maxIterations = isInfinite ? Infinity : this.maxIterations;
        let iterations = 0;

        try {
            let condition = yield* this._evalCondition(ctx.expression());

            while (condition) {
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

                condition = yield* this._evalCondition(ctx.expression());
            }
        } catch (e) {
            if (!(e instanceof BreakException)) throw e;
        }

        return result;
    }

    *visitValueLoop(ctx) {
        this._checkKeywordAllowed('loop', ctx);
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
        this._checkKeywordAllowed('loop', ctx);
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
        this._checkKeywordAllowed('debug', ctx);
        yield { __debugBreak: true, line: ctx.start.line };
    }

    // --- Function Definition ---

    *visitFuncDefStmt(ctx) {
        this._checkKeywordAllowed('function', ctx);
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
        this._checkKeywordAllowed('thread', ctx);
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
        return this._processStringEscapes(str.substring(1, str.length - 1));
    }

    *visitBooleanAtom(ctx) {
        return ctx.getText() === 'true';
    }

    *visitNullAtom(ctx) {
        return TEE_NULL;   // spec v0.8.0 (#4): the null literal
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
            return this._processStringEscapes(str.substring(1, str.length - 1));
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

        let stepVal = 1;
        if (ctx.rangeStep) {
            stepVal = yield* this.visit(ctx.rangeStep);
            if (typeof stepVal !== 'number') {
                throw this.createError('Range step must be a number', ctx);
            }
            if (stepVal <= 0) {
                throw this.createError('Range step must be positive', ctx);
            }
        }

        const { scale, start, end, step } = this.scaleRangeNumbers(startVal, endVal, stepVal);
        const increment = start > end ? -step : step;
        const arr = [];

        if (increment > 0n) {
            for (let value = start; value <= end; value += increment) {
                arr.push(this.unscaleRangeNumber(value, scale));
            }
        } else {
            for (let value = start; value >= end; value += increment) {
                arr.push(this.unscaleRangeNumber(value, scale));
            }
        }
        return arr;
    }

    scaleRangeNumbers(startVal, endVal, stepVal) {
        const startText = this.toPlainNumberString(startVal);
        const endText = this.toPlainNumberString(endVal);
        const stepText = this.toPlainNumberString(stepVal);
        const scale = Math.max(
            this.getRangeScale(startText),
            this.getRangeScale(endText),
            this.getRangeScale(stepText)
        );

        return {
            scale,
            start: this.scaleRangeNumber(startText, scale),
            end: this.scaleRangeNumber(endText, scale),
            step: this.scaleRangeNumber(stepText, scale)
        };
    }

    toPlainNumberString(value) {
        const text = String(value);
        if (!/[eE]/.test(text)) return text;

        const negative = text.startsWith('-');
        const unsigned = negative ? text.slice(1) : text;
        const [mantissa, exponentText] = unsigned.split(/[eE]/);
        const exponent = Number(exponentText);
        const [wholePart, fractionPart = ''] = mantissa.split('.');
        const digits = wholePart + fractionPart;
        const decimalIndex = wholePart.length + exponent;
        let plain;

        if (decimalIndex <= 0) {
            plain = '0.' + '0'.repeat(-decimalIndex) + digits;
        } else if (decimalIndex >= digits.length) {
            plain = digits + '0'.repeat(decimalIndex - digits.length);
        } else {
            plain = digits.slice(0, decimalIndex) + '.' + digits.slice(decimalIndex);
        }

        if (plain.startsWith('.')) {
            plain = '0' + plain;
        }

        return negative && plain !== '0' ? '-' + plain : plain;
    }

    getRangeScale(valueText) {
        const parts = valueText.split('.');
        return parts.length === 2 ? parts[1].length : 0;
    }

    scaleRangeNumber(valueText, scale) {
        const negative = valueText.startsWith('-');
        const unsigned = negative ? valueText.slice(1) : valueText;
        const [wholePart, fractionPart = ''] = unsigned.split('.');
        const digits = (wholePart || '0') + fractionPart.padEnd(scale, '0');
        const scaled = BigInt(digits);
        return negative ? -scaled : scaled;
    }

    unscaleRangeNumber(value, scale) {
        if (scale === 0) return Number(value);

        const negative = value < 0n;
        let digits = (negative ? -value : value).toString();
        if (digits.length <= scale) {
            digits = '0'.repeat(scale - digits.length + 1) + digits;
        }

        const wholePart = digits.slice(0, digits.length - scale);
        const fractionPart = digits.slice(digits.length - scale).replace(/0+$/, '');
        const text = fractionPart.length === 0 ? wholePart : wholePart + '.' + fractionPart;
        return Number(negative ? '-' + text : text);
    }

    // Member access
    *visitMemberAccessExpr(ctx) {
        const targetObj = yield* this.visit(ctx.expression(0));
        const key = yield* this.visit(ctx.access());

        if (targetObj === null) {
            throw this.createError(`Cannot access property '${key}' of null`, ctx);
        }

        // spec v0.8.0 (#4): member access on the null value fails like a missing property
        if (targetObj === TEE_NULL) {
            throw this.createError(`Property '${key}' does not exist`, ctx);
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
        if (Array.isArray(targetObj)) {
            if (typeof key !== 'number') {
                throw this.createError('Array index must be a number, got string. Use arr.1 not arr."1"', ctx);
            }
            const idx = key - 1;
            if (idx < 0 || idx >= targetObj.length) {
                throw this.createError('Array index out of bounds', ctx);
            }
            return targetObj[idx];
        }

        // String character access: convert 1-based to 0-based
        if (typeof targetObj === 'string') {
            if (typeof key !== 'number') {
                throw this.createError('String index must be a number, got string. Use str.1 not str."1"', ctx);
            }
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
        return this._processStringEscapes(str.substring(1, str.length - 1));
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

    // Spec v0.7.0 (#2): and/or SHORT-CIRCUIT left to right — the right operand is not evaluated
    // (side effects included) when the left side decides; operands are type-checked only when evaluated.
    *visitAndExpr(ctx) {
        const left = yield* this.visit(ctx.expression(0));
        if (typeof left !== 'boolean') {
            throw this.createError(`Logical AND requires boolean operands. Got ${this._valueTypeName(left)}`, ctx);
        }
        if (!left) return false;
        const right = yield* this.visit(ctx.expression(1));
        if (typeof right !== 'boolean') {
            throw this.createError(`Logical AND requires boolean operands. Got ${this._valueTypeName(right)}`, ctx);
        }
        return right;
    }

    *visitOrExpr(ctx) {
        const left = yield* this.visit(ctx.expression(0));
        if (typeof left !== 'boolean') {
            throw this.createError(`Logical OR requires boolean operands. Got ${this._valueTypeName(left)}`, ctx);
        }
        if (left) return true;
        const right = yield* this.visit(ctx.expression(1));
        if (typeof right !== 'boolean') {
            throw this.createError(`Logical OR requires boolean operands. Got ${this._valueTypeName(right)}`, ctx);
        }
        return right;
    }

    // --- Function Call ---

    *visitFuncAtom(ctx) {
        return yield* this.visit(ctx.functionCall());
    }

    *visitFunctionCall(ctx) {
        const funcName = ctx.funcName.text;

        if (this.ignoredFunctions.has(funcName))
            throw this.createError(`'${funcName}' is not available in this environment`, ctx);

        // Evaluate arguments (expressions are atomic via yield*)
        const args = [];
        if (ctx.expression()) {
            for (const exprCtx of ctx.expression()) {
                args.push(yield* this.visit(exprCtx));
            }
        }

        // User-defined function (spec v0.11.0: name resolution is host-blocked ->
        // script-defined functions -> built-ins/externals, so a script function
        // shadows any same-named built-in or external)
        if (this.userDefinedFunctions[funcName]) {
            return yield* this._callUserFunction(funcName, args, ctx);
        }

        // FAIL/UNWRAP (spec v0.10.0) are dispatched here — not via the builtin table —
        // so their errors carry the call site's line:col (interpreter-level builtins,
        // like the reference runtime's PRINT/SLEEP dispatch).
        if (funcName === 'FAIL') {
            if (args.length !== 1) throw this.createError('FAIL() requires a message argument', ctx);
            throw this.createError(this.functions['TO_STRING'](args[0]), ctx);
        }
        if (funcName === 'UNWRAP') {
            if (args.length < 1 || args.length > 2) throw this.createError('UNWRAP() requires (result, [message])', ctx);
            const res = args[0];
            if (!isGenuineResult(res)) throw this.createError('UNWRAP() requires a Result', ctx);
            if (res.ok === true) return res.value;
            const valueText = this.functions['TO_STRING'](res.value);
            throw this.createError(
                args.length > 1 ? this.functions['TO_STRING'](args[1]) + ': ' + valueText : valueText, ctx);
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
        this._checkKeywordAllowed('multi', ctx);
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

            if (this.ignoredFunctions.has(spawn.funcName)) {
                throw this.createError(`'${spawn.funcName}' is not available in this environment`, spawn.ctx);
            }

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
