grammar ProperTee ;

root : statement* EOF ;

statement
    : assignment    # AssignStmt
    | ifStatement   # IfStmt
    | iterationStmt # iterStmt
    | functionDef   # FuncDefStmt
    | threadDef     # ThreadDefStmt
    | parallelStmt  # ParallelExecStmt
    | flowControl   # FlowStmt
    | expression    # ExprStmt
    ;

// 가능: myVar = 10, prop.width = 20, prop.$width = 30

// 불가능: 10 = 20, (a+b) = 30

assignment
    : lvalue '=' expression
    ;

lvalue
    : ID                                     # VarLValue       // 예: width = 10
    | lvalue '.' access                      # PropLValue      // 예: obj.x = 10
    ;

block : statement* ;

ifStatement
    : K_IF condition=expression K_THEN thenBody=block (K_ELSE elseBody=block)? K_END
    ;

functionDef
    : K_FUNCTION funcName=ID '(' parameterList? ')' K_DO block K_END
    ;

threadDef
    : K_THREAD funcName=ID '(' parameterList? ')' K_DO block K_END
    ;

parameterList
    : ID (',' ID)*
    ;

parallelStmt
    : K_MULTI parallelTask+ monitorClause? K_END
    ;

monitorClause
    : K_MONITOR INTEGER block
    ;

parallelTask
    : functionCall '->' ID    # ParallelAssignTask
    | functionCall            # ParallelCallTask
    ;

iterationStmt
    : K_LOOP expression K_INFINITE? K_DO block K_END                          # ConditionLoop
    | K_LOOP value=ID K_IN expression K_INFINITE? K_DO block K_END            # ValueLoop
    | K_LOOP key=ID ',' value=ID K_IN expression K_INFINITE? K_DO block K_END # KeyValueLoop
    ;

flowControl
    : K_BREAK              # BreakStmt
    | K_CONTINUE           # ContinueStmt
    | K_RETURN expression? # ReturnStmt
    ;

expression
    : atom                                  # AtomExpr
    | expression '.' access                 # MemberAccessExpr
    | '-' expression                        # UnaryMinusExpr
    | K_NOT expression                      # NotExpr
    | expression ('*' | '/' | '%') expression     # MultiplicativeExpr
    | expression ('+' | '-') expression     # AdditiveExpr
    | expression op=comparisonOp expression # ComparisonExpr
    | expression K_AND expression           # AndExpr
    | expression K_OR expression            # OrExpr
    ;


access
    : ID                                    # StaticAccess      // .width
    | INTEGER                               # ArrayAccess       // .1 (1-based indexing)
    | STRING                                # StringKeyAccess   // ."key"
    | '$' ID                                # VarEvalAccess     // .$key (축약형: .$(key))
    | '$' '(' expression ')'                # EvalAccess        // .$(expr) (완전형)
    ;

atom
    : functionCall           # FuncAtom
    | ID                     # VarReference
    | INTEGER '.' INTEGER    # DecimalAtom
    | INTEGER                # IntegerAtom
    | STRING                 # StringAtom
    | (K_TRUE | K_FALSE)     # BooleanAtom
    | K_NULL                 # NullAtom
    | objectLiteral          # ObjectAtom
    | arrayLiteral           # ArrayAtom
    | '(' expression ')'     # ParenAtom
    ;

functionCall
    : funcName=ID '(' (expression (',' expression)*)? ')'
    ;

objectLiteral
    : '{' (objectEntry (',' objectEntry)*)? '}'
    ;

objectEntry
    : objectKey ':' expression
    ;

objectKey
    : ID                     // member: value
    | STRING                 // "key-name": value
    | INTEGER                // 1: value (1-based indexing for array-like objects)
    ;

arrayLiteral
    : '[' (expression (',' expression)*)? ']'
    ;

comparisonOp : '>' | '<' | '==' | '>=' | '<=' | '!=' ;

// Lexer Rules

K_IF        : 'if';
K_THEN      : 'then';
K_ELSE      : 'else';
K_END       : 'end';
K_LOOP      : 'loop';
K_IN        : 'in';
K_DO        : 'do';
K_BREAK     : 'break';
K_CONTINUE  : 'continue';
K_FUNCTION  : 'function';
K_THREAD    : 'thread';
K_RETURN    : 'return';
K_NOT       : 'not';
K_AND       : 'and';
K_OR        : 'or';
K_TRUE      : 'true';
K_FALSE     : 'false';
K_NULL      : 'null';
K_INFINITE  : 'infinite';
K_MULTI     : 'multi';
K_MONITOR   : 'monitor';

ID : [a-zA-Z_][a-zA-Z0-9_]* ;          // 일반 식별자 (나중에 정의)
INTEGER : [0-9]+ ;
STRING : '"' ( '\\' . | ~["\\] )* '"' ;

// 주석과 공백 처리
COMMENT : '//' ~[\r\n]* -> skip ;           // 한 줄 주석
BLOCK_COMMENT : '/*' .*? '*/' -> skip ;     // 블럭 주석
WS : [ \t\r\n;]+ -> skip ;