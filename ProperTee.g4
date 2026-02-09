grammar ProperTee ;

root : statement* EOF ;

statement
    : assignment    # AssignStmt
    | ifStatement   # IfStmt
    | iterationStmt # iterStmt
    | functionDef   # FuncDefStmt
    | parallelStmt  # ParallelExecStmt
    | spawnStmt     # SpawnExecStmt
    | flowControl   # FlowStmt
    | expression    # ExprStmt
    ;

assignment
    : lvalue '=' expression
    ;

lvalue
    : ID                                     # VarLValue
    | GLOBAL_PREFIX ID                       # GlobalVarLValue
    | lvalue '.' access                      # PropLValue
    ;

block : statement* ;

ifStatement
    : K_IF condition=expression K_THEN thenBody=block (K_ELSE elseBody=block)? K_END
    ;

functionDef
    : K_FUNCTION funcName=ID '(' parameterList? ')' K_DO block K_END
    ;

parameterList
    : ID (',' ID)*
    ;

parallelStmt
    : K_MULTI resultVar=ID? K_DO block monitorClause? K_END
    ;

monitorClause
    : K_MONITOR INTEGER block
    ;

spawnStmt
    : K_SPAWN access? ':' functionCall                   # SpawnKeyStmt
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
    : ID                                    # StaticAccess
    | INTEGER                               # ArrayAccess
    | STRING                                # StringKeyAccess
    | '$' GLOBAL_PREFIX? ID                 # VarEvalAccess
    | '$' '(' expression ')'                # EvalAccess
    ;

atom
    : functionCall           # FuncAtom
    | GLOBAL_PREFIX ID       # GlobalVarReference
    | ID                     # VarReference
    | INTEGER '.' INTEGER    # DecimalAtom
    | INTEGER                # IntegerAtom
    | STRING                 # StringAtom
    | (K_TRUE | K_FALSE)     # BooleanAtom
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
    : ID
    | STRING
    | INTEGER
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
K_SPAWN     : 'thread';
K_RETURN    : 'return';
K_NOT       : 'not';
K_AND       : 'and';
K_OR        : 'or';
K_TRUE      : 'true';
K_FALSE     : 'false';
K_INFINITE  : 'infinite';
K_MULTI     : 'multi';
K_MONITOR   : 'monitor';

GLOBAL_PREFIX : '::' ;
ID : [a-zA-Z_][a-zA-Z0-9_]* ;
INTEGER : [0-9]+ ;
STRING : '"' ( '\\' . | ~["\\] )* '"' ;

COMMENT : '//' ~[\r\n]* -> skip ;
BLOCK_COMMENT : '/*' .*? '*/' -> skip ;
WS : [ \t\r\n;]+ -> skip ;
