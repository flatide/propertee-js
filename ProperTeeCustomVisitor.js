import ProperTeeVisitor from './ProperTeeVisitor.js';

export default class ProperTeeCustomVisitor extends ProperTeeVisitor {
    /**
     * @param {Object} builtInProperties - 외부에서 주입된 내장 프로퍼티
     * @param {Object} builtInFunctions - 외부에서 주입된 내장 함수
     * @param {Object} ioStreams - 입출력 스트림 { stdin, stdout, stderr }
     * @param {Object} options - 실행 옵션 { maxIterations: number, iterationLimitBehavior: 'warn'|'error' }
     */
    constructor(builtInProperties = {}, builtInFunctions = {}, ioStreams = {}, options = {}) {
        super();
        // 로컬 변수 저장소 (스크립트 내에서 생성된 변수)
        this.variables = {};
        
        // 사용자 정의 함수 저장소 (스크립트 내에서 정의된 함수)
        this.userDefinedFunctions = {};
        
        // 스코프 스택 (함수 호출 시 로컬 스코프 관리)
        this.scopeStack = [];
        
        // Threading: Thread 실행 관리
        this.inMultiContext = false;        // MULTI 블록 내부 여부
        this.multiResultVars = new Map();   // MULTI 블록의 결과 변수 (name -> {local, result, status})
        this.inMonitorContext = false;      // MONITOR 블록 내부 여부
        this.inThreadContext = false;       // Thread 함수 내부 여부
        this.currentFunctionContext = null; // 현재 실행 중인 함수 정보
        
        // 내장 프로퍼티 (외부에서 주입된 객체/값)
        this.properties = builtInProperties;
        
        // 입출력 스트림 설정 (기본값: console)
        this.stdin = ioStreams.stdin || null;
        this.stdout = ioStreams.stdout || ((...args) => console.log(...args));
        this.stderr = ioStreams.stderr || ((...args) => console.error(...args));
        
        // 루프 제한 설정 (기본값: 1000)
        this.maxIterations = options.maxIterations || 1000;
        
        // 루프 제한 초과 시 동작 (기본값: 'error')
        this.iterationLimitBehavior = options.iterationLimitBehavior || 'error';
        
        // 기본 내장 함수 정의
        const defaultFunctions = {
            'PRINT': (...args) => { this.stdout(...args); return null; },
            'SUM': (...args) => args.reduce((a, b) => a + b, 0),
            'MAX': (...args) => Math.max(...args),
            'MIN': (...args) => Math.min(...args),
            'ABS': (n) => Math.abs(n),
            'FLOOR': (n) => Math.floor(n),
            'CEIL': (n) => Math.ceil(n),
            'ROUND': (n) => Math.round(n),
            'LEN': (arr) => Array.isArray(arr) ? arr.length : (typeof arr === 'string' ? arr.length : 0),
            
            // 타입 변환 함수
            'TO_NUMBER': (str) => {
                if (typeof str !== 'string') {
                    throw new Error('Runtime Error: TO_NUMBER() requires a string argument');
                }
                const trimmed = str.trim();
                if (trimmed === '') {
                    throw new Error('Runtime Error: TO_NUMBER() cannot convert empty string');
                }
                const num = Number(trimmed);
                if (isNaN(num)) {
                    throw new Error(`Runtime Error: TO_NUMBER() cannot convert '${str}' to number`);
                }
                return num;
            },
            'TO_STRING': (value) => {
                if (value === null) {
                    return 'null';
                }
                if (typeof value === 'boolean') {
                    return value ? 'true' : 'false';
                }
                if (typeof value === 'number') {
                    return String(value);
                }
                if (typeof value === 'string') {
                    return value;
                }
                if (Array.isArray(value)) {
                    return JSON.stringify(value);
                }
                if (typeof value === 'object') {
                    return JSON.stringify(value);
                }
                return String(value);
            },
            
            // 비동기 함수
            'SLEEP': async (milliseconds) => {
                if (typeof milliseconds !== 'number') {
                    throw new Error('Runtime Error: SLEEP() requires a number argument');
                }
                if (milliseconds < 0) {
                    throw new Error('Runtime Error: SLEEP() duration cannot be negative');
                }
                return new Promise(resolve => setTimeout(resolve, milliseconds));
            },
            
            // 배열 함수
            'PUSH': (arr, ...values) => {
                if (!Array.isArray(arr)) {
                    throw new Error('Runtime Error: PUSH() first argument must be an array');
                }
                return [...arr, ...values];
            },
            'POP': (arr) => {
                if (!Array.isArray(arr)) {
                    throw new Error('Runtime Error: POP() argument must be an array');
                }
                if (arr.length === 0) {
                    throw new Error('Runtime Error: POP() cannot pop from empty array');
                }
                return arr.slice(0, -1);
            },
            'CONCAT': (...arrays) => {
                for (const arr of arrays) {
                    if (!Array.isArray(arr)) {
                        throw new Error('Runtime Error: CONCAT() all arguments must be arrays');
                    }
                }
                return arrays.reduce((acc, arr) => [...acc, ...arr], []);
            },
            'SLICE': (arr, start, end) => {
                if (!Array.isArray(arr)) {
                    throw new Error('Runtime Error: SLICE() first argument must be an array');
                }
                if (typeof start !== 'number') {
                    throw new Error('Runtime Error: SLICE() second argument must be a number');
                }
                if (end !== undefined && typeof end !== 'number') {
                    throw new Error('Runtime Error: SLICE() third argument must be a number');
                }
                // 1-based를 0-based로 변환
                const zeroStart = start - 1;
                const zeroEnd = end !== undefined ? end : undefined;
                return end === undefined ? arr.slice(zeroStart) : arr.slice(zeroStart, zeroEnd);
            },
            
            // 문자열 함수
            'CHARS': (str) => {
                if (typeof str !== 'string') {
                    throw new Error('Runtime Error: CHARS() requires a string argument');
                }
                return Array.from(str);  // Unicode-safe
            },
            'SPLIT': (str, delimiter) => {
                if (typeof str !== 'string') {
                    throw new Error('Runtime Error: SPLIT() first argument must be a string');
                }
                if (typeof delimiter !== 'string') {
                    throw new Error('Runtime Error: SPLIT() second argument must be a string');
                }
                return str.split(delimiter);
            },
            'JOIN': (arr, separator = '') => {
                if (!Array.isArray(arr)) {
                    throw new Error('Runtime Error: JOIN() first argument must be an array');
                }
                if (typeof separator !== 'string') {
                    throw new Error('Runtime Error: JOIN() second argument must be a string');
                }
                return arr.join(separator);
            },
            'SUBSTRING': (str, start, length) => {
                if (typeof str !== 'string') {
                    throw new Error('Runtime Error: SUBSTRING() first argument must be a string');
                }
                if (typeof start !== 'number') {
                    throw new Error('Runtime Error: SUBSTRING() second argument must be a number');
                }
                if (length !== undefined && typeof length !== 'number') {
                    throw new Error('Runtime Error: SUBSTRING() third argument must be a number');
                }
                // 1-based를 0-based로 변환
                const zeroBased = start - 1;
                return length === undefined ? str.substring(zeroBased) : str.substring(zeroBased, zeroBased + length);
            },
            'UPPERCASE': (str) => {
                if (typeof str !== 'string') {
                    throw new Error('Runtime Error: UPPERCASE() requires a string argument');
                }
                return str.toUpperCase();
            },
            'LOWERCASE': (str) => {
                if (typeof str !== 'string') {
                    throw new Error('Runtime Error: LOWERCASE() requires a string argument');
                }
                return str.toLowerCase();
            },
            'TRIM': (str) => {
                if (typeof str !== 'string') {
                    throw new Error('Runtime Error: TRIM() requires a string argument');
                }
                return str.trim();
            }
        };
        
        // 기본 함수와 주입된 함수를 병합 (주입된 함수가 우선)
        this.functions = { ...defaultFunctions, ...builtInFunctions };
    }

    // --- Helper 메서드 ---
    
    // Context에서 위치 정보 추출
    getLocation(ctx) {
        if (ctx && ctx.start) {
            return `line ${ctx.start.line}:${ctx.start.column}`;
        }
        return 'unknown location';
    }
    
    // 위치 정보를 포함한 에러 생성
    createError(message, ctx) {
        const location = this.getLocation(ctx);
        return new Error(`Runtime Error at ${location}: ${message}`);
    }

// --- 기본 구조 ---

    async visitRoot(ctx) {
        let result = null;
        const statements = ctx.statement();
        
        try {
            // 모든 statement를 순회하면서 실행
            for (const stmt of statements) {
                const stmtResult = this.visit(stmt);
                // Promise인 경우 await
                if (stmtResult && typeof stmtResult.then === 'function') {
                    result = await stmtResult;
                } else {
                    result = stmtResult;
                }
            }
            
            // 마지막 statement의 평가 값 반환
            return result;
            
        } catch (e) {
            // top-level에서 return 문 처리
            if (e instanceof ReturnException) {
                return e.value;
            }
            // 다른 예외는 그대로 전파
            throw e;
        }
    }

    // SHARED 선언 처리

    visitBlock(ctx) {
        let result = null;
        for (const stmt of ctx.statement()) {
            result = this.visit(stmt);
        }
        return result;
    }

    // --- 문 (Statements) ---

    // 할당문: L-Value 로직이 핵심
    visitAssignStmt(ctx) {
        return this.visit(ctx.assignment());
    }

    async visitAssignment(ctx) {
        // Monitor 컨텍스트에서는 할당 불가 (read-only)
        if (this.inMonitorContext) {
            throw this.createError(
                'Cannot assign variables in monitor block (read-only)',
                ctx
            );
        }
        
        const lvalueCtx = ctx.lvalue();
        let value = this.visit(ctx.expression()); // 우변 값 평가
        
        // Promise인 경우 await
        if (value && typeof value.then === 'function') {
            value = await value;
        }

        // Case 1: 일반 변수 할당 (ID = val)
        if (lvalueCtx.constructor.name === 'VarLValueContext') {
            const varName = lvalueCtx.ID().getText();
            
            // Thread 내부에서 전역변수 쓰기 금지
            if (this.inThreadContext && this.scopeStack.length === 0) {
                throw this.createError(
                    `Cannot assign to global variable '${varName}' inside thread function. ` +
                    `Thread functions can only read global variables and write to thread-local variables.`,
                    ctx
                );
            }
            
            // 함수 로컬 스코프에 있으면 로컬 스코프에 할당
            if (this.scopeStack.length > 0) {
                const currentScope = this.scopeStack[this.scopeStack.length - 1];
                currentScope[varName] = value;
            } else {
                // 전역 스코프에 할당
                this.variables[varName] = value;
            }
            
            return value;
        }
        
        // Case 2: 객체 프로퍼티 할당 (lvalue.access = val)
        if (lvalueCtx.constructor.name === 'PropLValueContext') {
            // lvalue 재귀 평가 - 객체 참조만 필요 (속성 존재 체크 안 함)
            const targetObj = this.evaluateLValueForAssignment(lvalueCtx.lvalue());
            const key = this.visit(lvalueCtx.access());

            if (typeof targetObj !== 'object' || targetObj === null) {
                throw this.createError(`Cannot set property '${key}' on non-object`, ctx);
            }

            // 속성이 없어도 생성 가능 (할당)
            targetObj[key] = value;
            return value;
        }
        
        throw this.createError('Unknown lvalue type', ctx);
    }

    // 할당을 위한 lvalue 평가 (속성 존재 체크 없이 객체 참조만 반환)
    evaluateLValueForAssignment(lvalueCtx) {
        // VarLValue: 변수 값 반환
        if (lvalueCtx.constructor.name === 'VarLValueContext') {
            const varName = lvalueCtx.ID().getText();
            
            if (varName in this.variables) {
                return this.variables[varName];
            }
            
            if (varName in this.properties) {
                return this.properties[varName];
            }
            
            throw new Error(`Runtime Error: Variable '${varName}' is not defined`);
        }
        
        // PropLValue: 재귀적으로 평가하여 객체 참조 반환
        if (lvalueCtx.constructor.name === 'PropLValueContext') {
            const targetObj = this.evaluateLValueForAssignment(lvalueCtx.lvalue());
            const key = this.visit(lvalueCtx.access());
            
            if (targetObj === null) {
                throw new Error(`Runtime Error: Cannot access property '${key}' of null`);
            }
            
            // 속성이 없어도 괜찮음 (할당 목적)
            return targetObj[key];
        }
        
        throw new Error('Runtime Error: Unknown lvalue type in assignment');
    }

    // LValue를 값으로 평가 (읽기용)
    visitVarLValue(ctx) {
        const varName = ctx.ID().getText();
        
        // 변수 조회
        if (varName in this.variables) {
            return this.variables[varName];
        }
        
        if (varName in this.properties) {
            return this.properties[varName];
        }
        
        throw new Error(`Runtime Error: Variable '${varName}' is not defined`);
    }

    visitPropLValue(ctx) {
        // lvalue.access 형태를 값으로 평가 (읽기용)
        const targetObj = this.visit(ctx.lvalue());
        const key = this.visit(ctx.access());
        
        // null 접근 체크
        if (targetObj === null) {
            throw new Error(`Runtime Error: Cannot access property '${key}' of null`);
        }
        
        // 읽기 시에는 속성 존재 여부 체크
        if (typeof targetObj === 'object' && !(key in targetObj)) {
            throw new Error(`Runtime Error: Property '${key}' does not exist`);
        }
        
        return targetObj[key];
    }

    visitIfStmt(ctx) {
        // IfStmtContext에서 IfStatementContext로 이동
        return this.visit(ctx.ifStatement());
    }
    
    async visitIfStatement(ctx) {
        // IfStatementContext에서 labeled element 접근
        let condition = this.visit(ctx.condition);
        if (condition && typeof condition.then === 'function') {
            condition = await condition;
        }
        
        if (condition) {
            // then 블록 실행
            if (ctx.thenBody) {
                const result = this.visit(ctx.thenBody);
                if (result && typeof result.then === 'function') {
                    return await result;
                }
                return result;
            }
            return null;
        } else if (ctx.elseBody) {
            // else 블록 실행 (있으면)
            const result = this.visit(ctx.elseBody);
            if (result && typeof result.then === 'function') {
                return await result;
            }
            return result;
        }
        return null;
    }

    visitIterStmt(ctx) {
        return this.visit(ctx.iterationStmt());
    }

    async visitConditionLoop(ctx) {
        let result = null;
        const isInfinite = ctx.K_INFINITE() !== null;
        const maxIterations = isInfinite ? Infinity : this.maxIterations;
        let iterations = 0;
        
        try {
            let condition = this.visit(ctx.expression());
            if (condition && typeof condition.then === 'function') {
                condition = await condition;
            }
            
            while (condition) {
                if (++iterations > maxIterations) {
                    if (this.iterationLimitBehavior === 'warn') {
                        // 경고 출력 후 루프만 종료
                        this.stderr(
                            `Warning: Loop exceeded maximum iterations (${maxIterations}), stopping loop`
                        );
                        break;  // 루프만 종료, 다음 코드 계속 실행
                    } else {
                        // 에러 발생 (error 모드)
                        throw this.createError(
                            `Loop exceeded maximum iterations (${maxIterations}). Use 'loop condition infinite do' if you need unlimited iterations.`,
                            ctx
                        );
                    }
                }
                
                try {
                    result = this.visit(ctx.block());
                    if (result && typeof result.then === 'function') {
                        result = await result;
                    }
                } catch (e) {
                    if (e instanceof BreakException) {
                        break;
                    } else if (e instanceof ContinueException) {
                        continue;
                    } else {
                        throw e;
                    }
                }
                
                // 조건 재평가
                condition = this.visit(ctx.expression());
                if (condition && typeof condition.then === 'function') {
                    condition = await condition;
                }
            }
        } catch (e) {
            // break가 loop 밖으로 던져진 경우 재처리
            if (!(e instanceof BreakException)) {
                throw e;
            }
        }
        
        return result;
    }

    async visitValueLoop(ctx) {
        let iterable = this.visit(ctx.expression());
        if (iterable && typeof iterable.then === 'function') {
            iterable = await iterable;
        }
        
        const isInfinite = ctx.K_INFINITE() !== null;
        const maxIterations = isInfinite ? Infinity : this.maxIterations;
        let iterations = 0;
        let result = null;
        
        const valueVar = ctx.value.text;
        
        if (Array.isArray(iterable)) {
            // 배열 순회 - 값만
            try {
                for (let i = 0; i < iterable.length; i++) {
                    if (++iterations > maxIterations) {
                        if (this.iterationLimitBehavior === 'warn') {
                            this.stderr(
                                `Warning: Loop exceeded maximum iterations (${maxIterations}), stopping loop`
                            );
                            break;
                        } else {
                            throw this.createError(
                                `Loop exceeded maximum iterations (${maxIterations}). Use 'loop ... infinite do' if you need unlimited iterations.`,
                                ctx
                            );
                        }
                    }
                    
                    this.variables[valueVar] = iterable[i];
                    
                    try {
                        result = this.visit(ctx.block());
                        if (result && typeof result.then === 'function') {
                            result = await result;
                        }
                    } catch (e) {
                        if (e instanceof BreakException) {
                            break;
                        } else if (e instanceof ContinueException) {
                            continue;
                        } else {
                            throw e;
                        }
                    }
                }
            } catch (e) {
                if (!(e instanceof BreakException)) {
                    throw e;
                }
            }
        } else if (typeof iterable === 'object' && iterable !== null) {
            // 객체 순회 - 값만
            try {
                for (const key in iterable) {
                    if (iterable.hasOwnProperty(key)) {
                        if (++iterations > maxIterations) {
                            if (this.iterationLimitBehavior === 'warn') {
                                this.stderr(
                                    `Warning: Loop exceeded maximum iterations (${maxIterations}), stopping loop`
                                );
                                break;
                            } else {
                                throw this.createError(
                                    `Loop exceeded maximum iterations (${maxIterations}). Use 'loop ... infinite do' if you need unlimited iterations.`,
                                    ctx
                                );
                            }
                        }
                        
                        this.variables[valueVar] = iterable[key];
                        
                        try {
                            result = this.visit(ctx.block());
                        } catch (e) {
                            if (e instanceof BreakException) {
                                break;
                            } else if (e instanceof ContinueException) {
                                continue;
                            } else {
                                throw e;
                            }
                        }
                    }
                }
            } catch (e) {
                if (!(e instanceof BreakException)) {
                    throw e;
                }
            }
        } else {
            throw new Error(`Runtime Error: Cannot iterate over non-iterable value`);
        }
        
        return result;
    }

    async visitKeyValueLoop(ctx) {
        let iterable = this.visit(ctx.expression());
        if (iterable && typeof iterable.then === 'function') {
            iterable = await iterable;
        }
        
        const isInfinite = ctx.K_INFINITE() !== null;
        const maxIterations = isInfinite ? Infinity : this.maxIterations;
        let iterations = 0;
        let result = null;
        
        const keyVar = ctx.key.text;
        const valueVar = ctx.value.text;
        
        if (Array.isArray(iterable)) {
            // 배열 순회 - 인덱스(1-based), 값
            try {
                for (let i = 0; i < iterable.length; i++) {
                    if (++iterations > maxIterations) {
                        if (this.iterationLimitBehavior === 'warn') {
                            this.stderr(
                                `Warning: Loop exceeded maximum iterations (${maxIterations}), stopping loop`
                            );
                            break;
                        } else {
                            throw this.createError(
                                `Loop exceeded maximum iterations (${maxIterations}). Use 'loop ... infinite do' if you need unlimited iterations.`,
                                ctx
                            );
                        }
                    }
                    
                    this.variables[keyVar] = i + 1;  // 1-based 인덱스
                    this.variables[valueVar] = iterable[i];

                    try {
                        result = this.visit(ctx.block());
                        if (result && typeof result.then === 'function') {
                            result = await result;
                        }
                    } catch (e) {
                        if (e instanceof BreakException) {
                            break;
                        } else if (e instanceof ContinueException) {
                            continue;
                        } else {
                            throw e;
                        }
                    }
                }
            } catch (e) {
                if (!(e instanceof BreakException)) {
                    throw e;
                }
            }
        } else if (typeof iterable === 'object' && iterable !== null) {
            // 객체 순회 - 키, 값
            try {
                for (const key in iterable) {
                    if (iterable.hasOwnProperty(key)) {
                        if (++iterations > maxIterations) {
                            if (this.iterationLimitBehavior === 'warn') {
                                this.stderr(
                                    `Warning: Loop exceeded maximum iterations (${maxIterations}), stopping loop`
                                );
                                break;
                            } else {
                                throw this.createError(
                                    `Loop exceeded maximum iterations (${maxIterations}). Use 'loop ... infinite do' if you need unlimited iterations.`,
                                    ctx
                                );
                            }
                        }
                        
                        this.variables[keyVar] = key;
                        this.variables[valueVar] = iterable[key];
                        
                        try {
                            result = this.visit(ctx.block());
                        } catch (e) {
                            if (e instanceof BreakException) {
                                break;
                            } else if (e instanceof ContinueException) {
                                continue;
                            } else {
                                throw e;
                            }
                        }
                    }
                }
            } catch (e) {
                if (!(e instanceof BreakException)) {
                    throw e;
                }
            }
        } else {
            throw new Error(`Runtime Error: Cannot iterate over non-iterable value`);
        }
        
        return result;
    }

    visitFlowStmt(ctx) {
        return this.visit(ctx.flowControl());
    }

    visitBreakStmt(ctx) {
        throw new BreakException();
    }

    visitContinueStmt(ctx) {
        throw new ContinueException();
    }

    visitReturnStmt(ctx) {
        // return 값이 있으면 평가, 없으면 null
        const value = ctx.expression() ? this.visit(ctx.expression()) : null;
        throw new ReturnException(value);
    }

    // --- 함수 정의 (Function Definition) ---
    
    visitFuncDefStmt(ctx) {
        return this.visit(ctx.functionDef());
    }

    visitFunctionDef(ctx) {
        const funcName = ctx.funcName.text;
        
        // 파라미터 리스트 추출
        const params = [];
        if (ctx.parameterList()) {
            const paramListCtx = ctx.parameterList();
            for (const idToken of paramListCtx.ID()) {
                params.push(idToken.getText());
            }
        }
        
        // 일반 함수 저장 (uses 없음, thread 아님)
        this.userDefinedFunctions[funcName] = {
            params: params,
            usesResources: [],
            body: ctx.block(),
            isThread: false
        };
        
        // 함수 정의는 null 반환
        return null;
    }
    
    visitThreadDef(ctx) {
        const funcName = ctx.funcName.text;
        
        // 파라미터 리스트 추출
        const params = [];
        if (ctx.parameterList()) {
            const paramListCtx = ctx.parameterList();
            for (const idToken of paramListCtx.ID()) {
                params.push(idToken.getText());
            }
        }
        
        // Thread 함수 저장
        this.userDefinedFunctions[funcName] = {
            params: params,
            body: ctx.block(),
            isThread: true
        };
        
        return null;
    }

    visitExprStmt(ctx) {
        return this.visit(ctx.expression());
    }

    // --- 표현식 (Expressions) ---

    // 1. 값 (Atom)
    visitAtomExpr(ctx) {
        return this.visit(ctx.atom());
    }

    visitVarReference(ctx) {
        const name = ctx.ID().getText();
        
        // Result 변수 체크 (MULTI 블록 내부에서)
        if (this.inMultiContext && this.multiResultVars.has(name)) {
            throw this.createError(
                `Cannot use result variable '${name}' inside MULTI block. ` +
                `Result variables are only available after 'end'.`,
                ctx
            );
        }
        
        // 1순위: 함수 로컬 스코프 확인 (스택의 맨 위부터)
        for (let i = this.scopeStack.length - 1; i >= 0; i--) {
            if (name in this.scopeStack[i]) {
                return this.scopeStack[i][name];
            }
        }
        
        // 2순위: MULTI result 변수 확인
        if (this.multiResultVars.has(name)) {
            return this.multiResultVars.get(name);
        }
        
        // 3순위: 전역 변수 확인
        if (name in this.variables) {
            return this.variables[name];
        }
        
        // 4순위: 내장 프로퍼티 확인
        if (name in this.properties) {
            return this.properties[name];
        }
        
        // 정의되지 않은 변수 - 에러 발생
        throw this.createError(`Variable '${name}' is not defined`, ctx);
    }

    visitNumberAtom(ctx) {
        return parseFloat(ctx.getText());
    }

    visitStringAtom(ctx) {
        // 따옴표 제거 ("text" -> text)
        const str = ctx.getText();
        return str.substring(1, str.length - 1);
    }
    
    visitBooleanAtom(ctx) {
        // 'true' 또는 'false' 문자열을 boolean 값으로 변환
        return ctx.getText() === 'true';
    }

    visitNullAtom(ctx) {
        // 'null' 키워드를 JavaScript null 값으로 변환
        return null;
    }

    visitParenAtom(ctx) {
        return this.visit(ctx.expression());
    }

    visitObjectAtom(ctx) {
        return this.visit(ctx.objectLiteral());
    }

    visitObjectLiteral(ctx) {
        const obj = {};
        
        // objectEntry가 없으면 빈 객체 반환
        if (!ctx.objectEntry()) {
            return obj;
        }
        
        // 각 objectEntry 처리
        for (const entryCtx of ctx.objectEntry()) {
            const key = this.resolveObjectKey(entryCtx.objectKey());
            const value = this.visit(entryCtx.expression());
            obj[key] = value;
        }
        
        return obj;
    }

    // [헬퍼] ObjectKey를 문자열로 해석
    resolveObjectKey(ctx) {
        if (ctx.ID()) {
            return ctx.ID().getText();
        }
        if (ctx.STRING()) {
            const str = ctx.STRING().getText();
            return str.substring(1, str.length - 1);  // 따옴표 제거
        }
        if (ctx.NUMBER()) {
            return ctx.NUMBER().getText();  // 숫자 키는 문자열로
        }
        return null;
    }

    visitArrayAtom(ctx) {
        return this.visit(ctx.arrayLiteral());
    }

    visitArrayLiteral(ctx) {
        const arr = [];
        
        // expression이 없으면 빈 배열 반환
        if (!ctx.expression()) {
            return arr;
        }
        
        // 각 expression 평가
        for (const exprCtx of ctx.expression()) {
            arr.push(this.visit(exprCtx));
        }
        
        return arr;
    }

    // 2. 멤버 접근 (Getter)
    visitMemberAccessExpr(ctx) {
        const targetObj = this.visit(ctx.expression(0)); // 좌측 표현식 평가
        const key = this.visit(ctx.access());            // 우측 접근자 키 해석

        // null 접근 체크
        if (targetObj === null) {
            throw this.createError(`Cannot access property '${key}' of null`, ctx);
        }
        
        // Thread result variable의 {local, result} 접근 처리
        if (typeof targetObj === 'object' && 
            'local' in targetObj && 
            'result' in targetObj &&
            (key === 'local' || key === 'result')) {
            return targetObj[key];
        }
        
        // 속성 존재 여부 체크
        if (typeof targetObj === 'object' && !(key in targetObj)) {
            throw this.createError(`Property '${key}' does not exist`, ctx);
        }
        
        return targetObj[key];
    }

    // === Access 규칙 Visitor 메서드들 (ANTLR4 labeled alternatives 활용) ===
    
    // StaticAccess: .width -> "width"
    visitStaticAccess(ctx) {
        return ctx.ID().getText();  // ✅ StaticAccessContext는 항상 ID() 메서드 보유
    }

    // VarEvalAccess: .$key -> variable 'key'의 값을 평가 (축약형)
    visitVarEvalAccess(ctx) {
        const varName = ctx.ID().getText();  // ✅ VarEvalAccessContext는 항상 ID() 메서드 보유
        
        // 로컬 변수 우선, 없으면 내장 프로퍼티 확인
        if (varName in this.variables) {
            return this.variables[varName];
        }
        if (varName in this.properties) {
            return this.properties[varName];
        }
        return undefined;
    }

    // ArrayAccess: .1 -> 0 (1-based를 0-based로 변환)
    visitArrayAccess(ctx) {
        const oneBased = parseFloat(ctx.NUMBER().getText());
        return oneBased - 1;  // 1-based를 0-based로 변환
    }

    // StringKeyAccess: ."key" -> "key"
    visitStringKeyAccess(ctx) {
        const str = ctx.STRING().getText();  // ✅ StringKeyAccessContext는 항상 STRING() 메서드 보유
        return str.substring(1, str.length - 1);
    }

    // EvalAccess: .$(expr) -> 표현식을 평가한 결과 (완전형)
    visitEvalAccess(ctx) {
        return this.visit(ctx.expression());  // ✅ EvalAccessContext는 항상 expression() 메서드 보유
    }

    // 3. 연산자들
    
    // 단항 마이너스 (-expression)
    visitUnaryMinusExpr(ctx) {
        const value = this.visit(ctx.expression());
        
        // 타입 체크: 숫자만 허용
        if (typeof value !== 'number') {
            throw this.createError(
                `Unary minus requires numeric operand. Got -${typeof value}`,
                ctx
            );
        }
        
        return -value;
    }

    // 논리 NOT (not expression)
    visitNotExpr(ctx) {
        const value = this.visit(ctx.expression());
        
        // 타입 체크: boolean만 허용
        if (typeof value !== 'boolean') {
            throw this.createError(
                `Logical NOT requires boolean operand. Got not ${typeof value}`,
                ctx
            );
        }
        
        return !value;
    }

    visitMultiplicativeExpr(ctx) {
        const left = this.visit(ctx.expression(0));
        const right = this.visit(ctx.expression(1));
        const op = ctx.children[1].getText();
        
        // 타입 체크: 모두 숫자여야 함
        if (typeof left !== 'number' || typeof right !== 'number') {
            throw this.createError(
                `Arithmetic operator '${op}' requires numeric operands. Got ${typeof left} ${op} ${typeof right}`,
                ctx
            );
        }
        
        if (op === '*') return left * right;
        
        if (op === '/' || op === '%') {
            if (right === 0) {
                throw this.createError(`Division by zero`, ctx);
            }
            return op === '/' ? left / right : left % right;
        }
    }

    visitAdditiveExpr(ctx) {
        const left = this.visit(ctx.expression(0));
        const right = this.visit(ctx.expression(1));
        const op = ctx.children[1].getText();
        
        if (op === '+') {
            // Number + Number
            if (typeof left === 'number' && typeof right === 'number') {
                return left + right;
            }
            // String + String
            if (typeof left === 'string' && typeof right === 'string') {
                return left + right;
            }
            // 그 외는 에러
            throw this.createError(
                `Addition requires both operands to be numbers or both to be strings. Got ${typeof left} + ${typeof right}`,
                ctx
            );
        }
        
        if (op === '-') {
            // Number - Number only
            if (typeof left !== 'number' || typeof right !== 'number') {
                throw this.createError(
                    `Subtraction requires numeric operands. Got ${typeof left} - ${typeof right}`,
                    ctx
                );
            }
            return left - right;
        }
    }

    visitComparisonExpr(ctx) {
        const left = this.visit(ctx.expression(0));
        const right = this.visit(ctx.expression(1));
        const op = ctx.op.getText();
        
        // 숫자 비교 연산자는 숫자만 허용
        if (op === '>' || op === '<' || op === '>=' || op === '<=') {
            if (typeof left !== 'number' || typeof right !== 'number') {
                throw this.createError(
                    `Comparison operator '${op}' requires numeric operands. Got ${typeof left} ${op} ${typeof right}`,
                    ctx
                );
            }
        }

        switch (op) {
            case '>': return left > right;
            case '<': return left < right;
            case '==': return left === right;
            case '>=': return left >= right;
            case '<=': return left <= right;
            case '!=': return left !== right;
            default: return false;
        }
    }

    // 논리 AND (expression and expression)
    visitAndExpr(ctx) {
        const left = this.visit(ctx.expression(0));
        const right = this.visit(ctx.expression(1));
        
        // 타입 체크: boolean만 허용
        if (typeof left !== 'boolean' || typeof right !== 'boolean') {
            throw this.createError(
                `Logical AND requires boolean operands. Got ${typeof left} and ${typeof right}`,
                ctx
            );
        }
        
        return left && right;
    }

    // 논리 OR (expression or expression)
    visitOrExpr(ctx) {
        const left = this.visit(ctx.expression(0));
        const right = this.visit(ctx.expression(1));
        
        // 타입 체크: boolean만 허용
        if (typeof left !== 'boolean' || typeof right !== 'boolean') {
            throw this.createError(
                `Logical OR requires boolean operands. Got ${typeof left} or ${typeof right}`,
                ctx
            );
        }
        
        return left || right;
    }

    // 4. 함수 호출
    visitFuncAtom(ctx) {
        return this.visit(ctx.functionCall());
    }

    async visitFunctionCall(ctx) {
        const funcName = ctx.funcName.text;  // 토큰이므로 .text 사용
        
        // 인자 평가
        const args = [];
        if (ctx.expression()) {
            for (const exprCtx of ctx.expression()) {
                const arg = this.visit(exprCtx);
                // Promise인 경우 await
                if (arg && typeof arg.then === 'function') {
                    args.push(await arg);
                } else {
                    args.push(arg);
                }
            }
        }

        // 내장 함수 확인
        if (this.functions[funcName]) {
            const result = this.functions[funcName](...args);
            // 내장 함수도 async일 수 있음 (예: SLEEP)
            if (result && typeof result.then === 'function') {
                return await result;
            }
            return result;
        }
        
        // 사용자 정의 함수 확인
        if (this.userDefinedFunctions[funcName]) {
            return await this.callUserFunction(funcName, args, ctx);
        }
        
        throw this.createError(`Unknown function '${funcName}'`, ctx);
    }

    // 사용자 정의 함수 호출
    async callUserFunction(funcName, args, callCtx, globalSnapshot = null) {
        const funcDef = this.userDefinedFunctions[funcName];
        const params = funcDef.params;
        const body = funcDef.body;
        const isThread = funcDef.isThread || false;
        
        // Thread 내에서 function 호출 체크
        if (this.inThreadContext && !isThread && !this.functions[funcName]) {
            throw this.createError(
                `Thread functions can only call other thread functions or built-in functions. ` +
                `Cannot call regular function '${funcName}'.`,
                callCtx
            );
        }
        
        // 인자 개수 검증
        if (args.length > params.length) {
            throw this.createError(
                `Function '${funcName}' expects ${params.length} argument(s), but ${args.length} were provided`,
                callCtx
            );
        }
        
        // Thread 함수 실행 시 전역변수 스냅샷 사용
        let previousVariables = null;
        if (isThread && globalSnapshot) {
            previousVariables = this.variables;
            this.variables = globalSnapshot; // 스냅샷으로 교체
        }
        
        // 새 로컬 스코프 생성
        const localScope = {};
        
        // 파라미터를 로컬 스코프에 바인딩 (누락된 인자는 null)
        for (let i = 0; i < params.length; i++) {
            localScope[params[i]] = i < args.length ? args[i] : null;
        }
        
        // 스코프 스택에 푸시
        this.scopeStack.push(localScope);
        
        // 함수 컨텍스트 설정
        const previousContext = this.currentFunctionContext;
        const previousThreadContext = this.inThreadContext;
        this.currentFunctionContext = funcDef;
        if (isThread) {
            this.inThreadContext = true;
        }
        
        try {
            // 함수 본문 실행
            let result = null;
            
            if (body.statement()) {
                for (const stmtCtx of body.statement()) {
                    result = this.visit(stmtCtx);
                    // Promise인 경우 await
                    if (result && typeof result.then === 'function') {
                        result = await result;
                    }
                }
            }
            
            // Thread 함수는 {local, result} 반환
            if (isThread) {
                return {
                    local: {...localScope}, // 로컬 스코프 복사
                    result: result
                };
            }
            
            // 명시적 return이 없으면 마지막 표현식의 값 반환 (또는 null)
            return result;
            
        } catch (e) {
            if (e instanceof ReturnException) {
                // Thread 함수는 {local, result} 반환
                if (isThread) {
                    return {
                        local: {...localScope},
                        result: e.value
                    };
                }
                // return 문으로 인한 정상 종료
                return e.value;
            }
            // 다른 예외는 그대로 전파
            throw e;
        } finally {
            // 스코프 복원
            this.scopeStack.pop();
            this.currentFunctionContext = previousContext;
            this.inThreadContext = previousThreadContext;
            
            // 전역변수 복원
            if (previousVariables !== null) {
                this.variables = previousVariables;
            }
        }
    }
    
    
    // PARALLEL 블록 처리
    async visitParallelExecStmt(ctx) {
        return await this.visitParallelStmt(ctx.parallelStmt());
    }
    
    async visitParallelStmt(ctx) {
        this.inMultiContext = true;
        
        const tasks = ctx.parallelTask();
        const promises = [];
        const resultVarsList = [];
        
        // 전역변수 스냅샷 생성 (thread들이 공유할 읽기 전용 복사본)
        const globalSnapshot = {...this.variables};
        
        // Monitor 설정
        const monitorClause = ctx.monitorClause();
        let monitorTimer = null;
        let monitorBlock = null;
        let monitorInterval = null;
        
        if (monitorClause) {
            monitorInterval = parseInt(monitorClause.NUMBER().getText());
            monitorBlock = monitorClause.block();
            
            // Monitor 주기적 실행
            monitorTimer = setInterval(async () => {
                try {
                    await this.executeMonitor(monitorBlock);
                } catch (e) {
                    // Monitor 에러는 로그만 (메인 작업에 영향 없음)
                    this.stderr('[MONITOR ERROR]', e.message);
                }
            }, monitorInterval);
        }
        
        // 1단계: 결과 변수 수집 및 thread 함수 검증
        for (const taskCtx of tasks) {
            const isAssign = taskCtx.constructor.name === 'ParallelAssignTaskContext';
            const funcCallCtx = taskCtx.functionCall();
            const funcName = funcCallCtx.funcName.text;
            
            // thread 함수 검증
            if (this.userDefinedFunctions[funcName]) {
                const funcDef = this.userDefinedFunctions[funcName];
                if (!funcDef.isThread) {
                    throw this.createError(
                        `Function '${funcName}' is not a thread function. ` +
                        `Only thread functions can be used in MULTI blocks.`,
                        funcCallCtx
                    );
                }
            }
            // 내장 함수는 허용
            
            if (isAssign) {
                const varName = taskCtx.ID().getText();
                // 중복 변수 검증
                if (this.multiResultVars.has(varName)) {
                    throw this.createError(
                        `Variable '${varName}' is assigned multiple times in MULTI block`,
                        taskCtx
                    );
                }
                
                // {local: null, result: null} 초기화
                this.multiResultVars.set(varName, {local: null, result: null});
                resultVarsList.push(varName);
            } else {
                resultVarsList.push(null); // 결과 무시
            }
        }
        
        try {
            // 2단계: Promise 생성 및 실행
            for (const taskCtx of tasks) {
                const funcCallCtx = taskCtx.functionCall();
                const promise = this.executeParallelTask(funcCallCtx, globalSnapshot);
                promises.push(promise);
            }
            
            // 3단계: 모든 task를 병렬로 실행하고 결과 대기
            const threadResults = await Promise.all(promises);
            
            // 4단계: 결과를 multiResultVars에 저장
            for (let i = 0; i < resultVarsList.length; i++) {
                const varName = resultVarsList[i];
                if (varName !== null) {
                    const threadResult = threadResults[i];
                    this.multiResultVars.set(varName, threadResult); // {local, result}
                }
            }
            
            // 5단계: Monitor 정리 및 최종 실행
            if (monitorTimer) {
                clearInterval(monitorTimer);
                try {
                    await this.executeMonitor(monitorBlock);  // 최종 실행
                } catch (e) {
                    this.stderr('[MONITOR ERROR]', e.message);
                }
            }
            
            // 6단계: result를 최종 변수에 할당 (end 후)
            for (let i = 0; i < resultVarsList.length; i++) {
                const varName = resultVarsList[i];
                if (varName !== null) {
                    const threadResult = this.multiResultVars.get(varName);
                    const finalValue = threadResult.result;
                    
                    if (this.scopeStack.length > 0) {
                        const currentScope = this.scopeStack[this.scopeStack.length - 1];
                        currentScope[varName] = finalValue;
                    } else {
                        this.variables[varName] = finalValue;
                    }
                }
            }
            
        } catch (e) {
            // 에러 발생 시에도 monitor 정리
            if (monitorTimer) {
                clearInterval(monitorTimer);
            }
            throw e;
        } finally {
            // 정리
            this.inMultiContext = false;
            this.multiResultVars = new Map();
        }
        
        return null;
    }
    
    // Monitor 블록 실행
    async executeMonitor(monitorBlock) {
        const previousContext = this.inMonitorContext;
        this.inMonitorContext = true;
        
        try {
            // 블록 실행
            if (monitorBlock.statement()) {
                for (const stmt of monitorBlock.statement()) {
                    const result = this.visit(stmt);
                    // Promise인 경우 await
                    if (result && typeof result.then === 'function') {
                        await result;
                    }
                }
            }
        } finally {
            this.inMonitorContext = previousContext;
        }
    }
    
    // PARALLEL task 실행
    async executeParallelTask(funcCallCtx, globalSnapshot) {
        const funcName = funcCallCtx.funcName.text;
        
        // 인자 평가
        const args = [];
        if (funcCallCtx.expression()) {
            for (const exprCtx of funcCallCtx.expression()) {
                args.push(this.visit(exprCtx));
            }
        }
        
        // 사용자 정의 함수인 경우
        if (this.userDefinedFunctions[funcName]) {
            const funcDef = this.userDefinedFunctions[funcName];
            if (!funcDef.isThread) {
                throw this.createError(
                    `Function '${funcName}' is not a thread function. ` +
                    `Only thread functions can be used in MULTI blocks.`,
                    funcCallCtx
                );
            }
            return await this.callUserFunction(funcName, args, funcCallCtx, globalSnapshot);
        }
        
        // 내장 함수 (순수 함수로 취급, 스냅샷 불필요)
        if (this.functions[funcName]) {
            try {
                const result = this.functions[funcName](...args);
                // 내장 함수는 단순 값 반환, {local: null, result} 형태로 래핑
                return {
                    local: null,
                    result: result instanceof Promise ? await result : result
                };
            } catch (e) {
                const location = this.getLocation(funcCallCtx);
                this.stderr(`Runtime Error in thread at ${location}: ${e.message}`);
                return {local: null, result: null};
            }
        }
        
        throw this.createError(`Unknown function '${funcName}'`, funcCallCtx);
    }
}


// Flow control exceptions for break and continue
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