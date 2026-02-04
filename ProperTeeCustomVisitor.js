import ProperTeeVisitor from './ProperTeeVisitor.js';

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

        // Active thread context (set by scheduler)
        this.activeThread = null;

        this.properties = builtInProperties;

        this.stdin = ioStreams.stdin || null;
        this.stdout = ioStreams.stdout || ((...args) => console.log(...args));
        this.stderr = ioStreams.stderr || ((...args) => console.error(...args));

        this.maxIterations = options.maxIterations || 1000;
        this.iterationLimitBehavior = options.iterationLimitBehavior || 'error';

        const defaultFunctions = {
            'PRINT': (...args) => { this.stdout(...args); return {}; },
            'SUM': (...args) => args.reduce((a, b) => a + b, 0),
            'MAX': (...args) => Math.max(...args),
            'MIN': (...args) => Math.min(...args),
            'ABS': (n) => Math.abs(n),
            'FLOOR': (n) => Math.floor(n),
            'CEIL': (n) => Math.ceil(n),
            'ROUND': (n) => Math.round(n),
            'LEN': (arr) => Array.isArray(arr) ? arr.length : (typeof arr === 'string' ? arr.length : 0),
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
            }
        };

        this.functions = { ...defaultFunctions, ...builtInFunctions };
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

    // Result helper for external functions
    static ok(value) {
        return { ok: true, value: value };
    }

    static error(message) {
        return { ok: false, value: message };
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

        try {
            for (const stmt of statements) {
                result = yield* this.visit(stmt);
                yield; // Statement boundary yield
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
        for (const stmt of ctx.statement()) {
            result = yield* this.visit(stmt);
            yield; // Statement boundary yield
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

        // Case 1: variable assignment
        if (lvalueCtx.constructor.name === 'VarLValueContext') {
            const varName = lvalueCtx.ID().getText();

            // Thread purity: no global writes
            if (this._isInThreadContext() && scopeStack.length === 0) {
                throw this.createError(
                    `Cannot assign to global variable '${varName}' inside thread function. ` +
                    `Thread functions can only read global variables and write to thread-local variables.`,
                    ctx
                );
            }

            if (scopeStack.length > 0) {
                scopeStack[scopeStack.length - 1][varName] = value;
            } else {
                variables[varName] = value;
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
            targetObj[key] = value;
            return value;
        }

        throw this.createError('Unknown lvalue type', ctx);
    }

    *_evaluateLValueForAssignment(lvalueCtx) {
        const scopeStack = this._getScopeStack();
        const variables = this._getVariables();

        if (lvalueCtx.constructor.name === 'VarLValueContext') {
            const varName = lvalueCtx.ID().getText();

            // Check scope stack
            for (let i = scopeStack.length - 1; i >= 0; i--) {
                if (varName in scopeStack[i]) return scopeStack[i][varName];
            }
            if (varName in variables) return variables[varName];
            if (varName in this.properties) return this.properties[varName];
            throw new Error(`Runtime Error: Variable '${varName}' is not defined`);
        }

        if (lvalueCtx.constructor.name === 'PropLValueContext') {
            const targetObj = yield* this._evaluateLValueForAssignment(lvalueCtx.lvalue());
            const key = yield* this.visit(lvalueCtx.access());
            if (targetObj === null) throw new Error(`Runtime Error: Cannot access property '${key}' of null`);
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
        if (varName in variables) return variables[varName];
        if (varName in this.properties) return this.properties[varName];
        throw new Error(`Runtime Error: Variable '${varName}' is not defined`);
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

        if (condition) {
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

                try {
                    result = yield* this.visitBlock(ctx.block());
                } catch (e) {
                    if (e instanceof BreakException) break;
                    else if (e instanceof ContinueException) { /* continue */ }
                    else throw e;
                }

                yield; // Loop iteration boundary

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
                        scopeStack[scopeStack.length - 1][valueVar] = iterable[i];
                    } else {
                        variables[valueVar] = iterable[i];
                    }

                    try {
                        result = yield* this.visitBlock(ctx.block());
                    } catch (e) {
                        if (e instanceof BreakException) break;
                        else if (e instanceof ContinueException) { /* continue */ }
                        else throw e;
                    }

                    yield; // Loop iteration boundary
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
                            scopeStack[scopeStack.length - 1][valueVar] = iterable[key];
                        } else {
                            variables[valueVar] = iterable[key];
                        }

                        try {
                            result = yield* this.visitBlock(ctx.block());
                        } catch (e) {
                            if (e instanceof BreakException) break;
                            else if (e instanceof ContinueException) { /* continue */ }
                            else throw e;
                        }

                        yield; // Loop iteration boundary
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
                        scopeStack[scopeStack.length - 1][valueVar] = iterable[i];
                    } else {
                        variables[keyVar] = i + 1;
                        variables[valueVar] = iterable[i];
                    }

                    try {
                        result = yield* this.visitBlock(ctx.block());
                    } catch (e) {
                        if (e instanceof BreakException) break;
                        else if (e instanceof ContinueException) { /* continue */ }
                        else throw e;
                    }

                    yield; // Loop iteration boundary
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
                            scopeStack[scopeStack.length - 1][valueVar] = iterable[key];
                        } else {
                            variables[keyVar] = key;
                            variables[valueVar] = iterable[key];
                        }

                        try {
                            result = yield* this.visitBlock(ctx.block());
                        } catch (e) {
                            if (e instanceof BreakException) break;
                            else if (e instanceof ContinueException) { /* continue */ }
                            else throw e;
                        }

                        yield; // Loop iteration boundary
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
            usesResources: [],
            body: ctx.block(),
            isThread: false
        };
        return null;
    }

    *visitThreadDefStmt(ctx) {
        return yield* this.visit(ctx.threadDef());
    }

    *visitThreadDef(ctx) {
        const funcName = ctx.funcName.text;
        const params = [];
        if (ctx.parameterList()) {
            for (const idToken of ctx.parameterList().ID()) {
                params.push(idToken.getText());
            }
        }

        this.userDefinedFunctions[funcName] = {
            params: params,
            body: ctx.block(),
            isThread: true
        };
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

        // 3. Variables (global or snapshot)
        if (name in variables) return variables[name];

        // 4. Built-in properties
        if (name in this.properties) return this.properties[name];

        throw this.createError(`Variable '${name}' is not defined`, ctx);
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
        if (ctx.ID()) return ctx.ID().getText();
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

    *visitArrayLiteral(ctx) {
        const arr = [];
        if (!ctx.expression()) return arr;

        for (const exprCtx of ctx.expression()) {
            arr.push(yield* this.visit(exprCtx));
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

        // Thread result {local, result} access
        if (typeof targetObj === 'object' &&
            'local' in targetObj &&
            'result' in targetObj &&
            (key === 'local' || key === 'result')) {
            return targetObj[key];
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
        const scopeStack = this._getScopeStack();
        const variables = this._getVariables();

        // Check scope stack first
        for (let i = scopeStack.length - 1; i >= 0; i--) {
            if (varName in scopeStack[i]) return scopeStack[i][varName];
        }
        if (varName in variables) return variables[varName];
        if (varName in this.properties) return this.properties[varName];
        return undefined;
    }

    *visitArrayAccess(ctx) {
        const oneBased = parseInt(ctx.INTEGER().getText(), 10);
        return oneBased - 1;
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
            if (typeof left === 'string' && typeof right === 'string') return left + right;
            throw this.createError(`Addition requires both operands to be numbers or both to be strings. Got ${typeof left} + ${typeof right}`, ctx);
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
        const isThread = funcDef.isThread || false;
        const scopeStack = this._getScopeStack();

        // Thread purity: threads can only call thread functions or built-ins
        if (this._isInThreadContext() && !isThread && !this.functions[funcName]) {
            throw this.createError(
                `Thread functions can only call other thread functions or built-in functions. Cannot call regular function '${funcName}'.`,
                callCtx
            );
        }

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
            localScope[params[i]] = i < args.length ? args[i] : {};
        }

        // Push scope
        scopeStack.push(localScope);

        // Save and set thread context
        const previousThreadContext = this._isInThreadContext();
        const previousFunctionContext = this.currentFunctionContext;
        this.currentFunctionContext = funcDef;

        if (this.activeThread) {
            if (isThread) this.activeThread.inThreadContext = true;
        } else {
            if (isThread) this.inThreadContext = true;
        }

        try {
            let result = null;

            if (body.statement()) {
                for (const stmtCtx of body.statement()) {
                    result = yield* this.visit(stmtCtx);
                    yield; // Statement boundary
                }
            }

            if (isThread) {
                return { local: {...localScope}, result: result };
            }
            return result;

        } catch (e) {
            if (e instanceof ReturnException) {
                if (isThread) {
                    return { local: {...localScope}, result: e.value };
                }
                return e.value;
            }
            throw e;
        } finally {
            scopeStack.pop();
            this.currentFunctionContext = previousFunctionContext;

            if (this.activeThread) {
                this.activeThread.inThreadContext = previousThreadContext;
            } else {
                this.inThreadContext = previousThreadContext;
            }
        }
    }

    // --- MULTI / Parallel ---

    *visitParallelExecStmt(ctx) {
        return yield* this.visitParallelStmt(ctx.parallelStmt());
    }

    *visitParallelStmt(ctx) {
        const tasks = ctx.parallelTask();
        const resultVarNames = [];
        const variables = this._getVariables();
        const scopeStack = this._getScopeStack();

        // Snapshot globals for threads
        const globalSnapshot = {...variables};

        // Validate tasks and collect result var names
        for (const taskCtx of tasks) {
            const isAssign = taskCtx.constructor.name === 'ParallelAssignTaskContext';
            const funcCallCtx = taskCtx.functionCall();
            const funcName = funcCallCtx.funcName.text;

            // Validate thread function
            if (this.userDefinedFunctions[funcName]) {
                const funcDef = this.userDefinedFunctions[funcName];
                if (!funcDef.isThread) {
                    throw this.createError(
                        `Function '${funcName}' is not a thread function. Only thread functions can be used in MULTI blocks.`,
                        funcCallCtx
                    );
                }
            }

            if (isAssign) {
                const varName = taskCtx.ID().getText();
                resultVarNames.push(varName);
            } else {
                resultVarNames.push(null);
            }
        }

        // Build thread specs (each spec has a generator for the thread body)
        const specs = [];
        for (let i = 0; i < tasks.length; i++) {
            const taskCtx = tasks[i];
            const funcCallCtx = taskCtx.functionCall();
            const funcName = funcCallCtx.funcName.text;

            // Evaluate args now (before spawning)
            const args = [];
            if (funcCallCtx.expression()) {
                for (const exprCtx of funcCallCtx.expression()) {
                    args.push(yield* this.visit(exprCtx));
                }
            }

            if (this.userDefinedFunctions[funcName]) {
                const funcDef = this.userDefinedFunctions[funcName];
                const params = funcDef.params;

                // Create local scope for the thread
                const localScope = {};
                for (let j = 0; j < params.length; j++) {
                    localScope[params[j]] = j < args.length ? args[j] : {};
                }

                // Create a generator for this thread's execution
                const gen = this._createThreadGenerator(funcDef, localScope, globalSnapshot);

                specs.push({
                    name: `${funcName}-${i}`,
                    generator: gen,
                    localScope: localScope
                });
            } else if (this.functions[funcName]) {
                // Built-in function: wrap in a trivial generator
                const self = this;
                const builtInFunc = this.functions[funcName];
                const capturedArgs = args;
                specs.push({
                    name: `builtin-${funcName}-${i}`,
                    generator: (function*() {
                        const result = builtInFunc(...capturedArgs);
                        return { local: null, result: result };
                    })(),
                    localScope: null
                });
            } else {
                throw this.createError(`Unknown function '${funcName}'`, funcCallCtx);
            }
        }

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
            resultVarNames: resultVarNames
        };

        // When we resume, collectedResults contains the results from child threads
        // Assign results to variables
        if (collectedResults && Array.isArray(collectedResults)) {
            for (const entry of collectedResults) {
                if (entry.varName) {
                    const threadResult = entry.result;
                    const finalValue = (threadResult && typeof threadResult === 'object' && 'result' in threadResult)
                        ? threadResult.result
                        : threadResult;

                    if (scopeStack.length > 0) {
                        scopeStack[scopeStack.length - 1][entry.varName] = finalValue;
                    } else {
                        variables[entry.varName] = finalValue;
                    }
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
            let result = null;

            if (body.statement()) {
                for (const stmtCtx of body.statement()) {
                    result = yield* this.visit(stmtCtx);
                    yield; // Statement boundary
                }
            }

            return { local: {...localScope}, result: result };

        } catch (e) {
            if (e instanceof ReturnException) {
                return { local: {...localScope}, result: e.value };
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
