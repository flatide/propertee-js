// Generated from ProperTee.g4 by ANTLR 4.13.2
// jshint ignore: start
import antlr4 from 'antlr4';
import ProperTeeVisitor from './ProperTeeVisitor.js';

const serializedATN = [4,1,53,317,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,
4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,
2,13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,
20,7,20,2,21,7,21,1,0,5,0,46,8,0,10,0,12,0,49,9,0,1,0,1,0,1,1,1,1,1,1,1,
1,1,1,1,1,1,1,1,1,3,1,61,8,1,1,2,1,2,1,2,1,2,1,3,1,3,1,3,1,3,3,3,71,8,3,
1,3,1,3,1,3,5,3,76,8,3,10,3,12,3,79,9,3,1,4,5,4,82,8,4,10,4,12,4,85,9,4,
1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,5,5,96,8,5,10,5,12,5,99,9,5,1,5,1,5,
3,5,103,8,5,1,5,1,5,1,6,1,6,1,6,1,6,3,6,111,8,6,1,6,1,6,1,6,1,6,1,6,1,7,
1,7,1,7,5,7,121,8,7,10,7,12,7,124,9,7,1,8,1,8,3,8,128,8,8,1,8,1,8,1,8,3,
8,133,8,8,1,8,1,8,1,9,1,9,1,9,1,9,1,10,1,10,3,10,143,8,10,1,10,1,10,1,10,
1,11,1,11,1,11,3,11,151,8,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,
3,11,162,8,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,3,11,
175,8,11,1,11,1,11,1,11,1,11,3,11,181,8,11,1,12,1,12,1,12,1,12,3,12,187,
8,12,1,12,3,12,190,8,12,1,13,1,13,1,13,1,13,1,13,1,13,3,13,198,8,13,1,13,
1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,
13,1,13,1,13,1,13,5,13,219,8,13,10,13,12,13,222,9,13,1,14,1,14,1,14,1,14,
1,14,3,14,229,8,14,1,14,1,14,1,14,1,14,1,14,1,14,3,14,237,8,14,1,15,1,15,
1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,
15,3,15,256,8,15,1,16,1,16,1,16,1,16,1,16,5,16,263,8,16,10,16,12,16,266,
9,16,3,16,268,8,16,1,16,1,16,1,17,1,17,1,17,1,17,5,17,276,8,17,10,17,12,
17,279,9,17,3,17,281,8,17,1,17,1,17,1,18,1,18,1,18,1,18,1,19,1,19,1,20,1,
20,1,20,1,20,1,20,1,20,3,20,297,8,20,1,20,1,20,1,20,1,20,1,20,1,20,5,20,
305,8,20,10,20,12,20,308,9,20,3,20,310,8,20,1,20,3,20,313,8,20,1,21,1,21,
1,21,0,2,6,26,22,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,
40,42,0,5,1,0,8,10,2,0,7,7,11,11,1,0,40,41,1,0,49,50,1,0,18,23,352,0,47,
1,0,0,0,2,60,1,0,0,0,4,62,1,0,0,0,6,70,1,0,0,0,8,83,1,0,0,0,10,86,1,0,0,
0,12,106,1,0,0,0,14,117,1,0,0,0,16,125,1,0,0,0,18,136,1,0,0,0,20,140,1,0,
0,0,22,180,1,0,0,0,24,189,1,0,0,0,26,197,1,0,0,0,28,236,1,0,0,0,30,255,1,
0,0,0,32,257,1,0,0,0,34,271,1,0,0,0,36,284,1,0,0,0,38,288,1,0,0,0,40,312,
1,0,0,0,42,314,1,0,0,0,44,46,3,2,1,0,45,44,1,0,0,0,46,49,1,0,0,0,47,45,1,
0,0,0,47,48,1,0,0,0,48,50,1,0,0,0,49,47,1,0,0,0,50,51,5,0,0,1,51,1,1,0,0,
0,52,61,3,4,2,0,53,61,3,10,5,0,54,61,3,22,11,0,55,61,3,12,6,0,56,61,3,16,
8,0,57,61,3,20,10,0,58,61,3,24,12,0,59,61,3,26,13,0,60,52,1,0,0,0,60,53,
1,0,0,0,60,54,1,0,0,0,60,55,1,0,0,0,60,56,1,0,0,0,60,57,1,0,0,0,60,58,1,
0,0,0,60,59,1,0,0,0,61,3,1,0,0,0,62,63,3,6,3,0,63,64,5,1,0,0,64,65,3,26,
13,0,65,5,1,0,0,0,66,67,6,3,-1,0,67,71,5,48,0,0,68,69,5,47,0,0,69,71,5,48,
0,0,70,66,1,0,0,0,70,68,1,0,0,0,71,77,1,0,0,0,72,73,10,1,0,0,73,74,5,2,0,
0,74,76,3,28,14,0,75,72,1,0,0,0,76,79,1,0,0,0,77,75,1,0,0,0,77,78,1,0,0,
0,78,7,1,0,0,0,79,77,1,0,0,0,80,82,3,2,1,0,81,80,1,0,0,0,82,85,1,0,0,0,83,
81,1,0,0,0,83,84,1,0,0,0,84,9,1,0,0,0,85,83,1,0,0,0,86,87,5,24,0,0,87,88,
3,26,13,0,88,89,5,25,0,0,89,97,3,8,4,0,90,91,5,26,0,0,91,92,3,26,13,0,92,
93,5,25,0,0,93,94,3,8,4,0,94,96,1,0,0,0,95,90,1,0,0,0,96,99,1,0,0,0,97,95,
1,0,0,0,97,98,1,0,0,0,98,102,1,0,0,0,99,97,1,0,0,0,100,101,5,27,0,0,101,
103,3,8,4,0,102,100,1,0,0,0,102,103,1,0,0,0,103,104,1,0,0,0,104,105,5,28,
0,0,105,11,1,0,0,0,106,107,5,34,0,0,107,108,5,48,0,0,108,110,5,3,0,0,109,
111,3,14,7,0,110,109,1,0,0,0,110,111,1,0,0,0,111,112,1,0,0,0,112,113,5,4,
0,0,113,114,5,31,0,0,114,115,3,8,4,0,115,116,5,28,0,0,116,13,1,0,0,0,117,
122,5,48,0,0,118,119,5,5,0,0,119,121,5,48,0,0,120,118,1,0,0,0,121,124,1,
0,0,0,122,120,1,0,0,0,122,123,1,0,0,0,123,15,1,0,0,0,124,122,1,0,0,0,125,
127,5,44,0,0,126,128,5,48,0,0,127,126,1,0,0,0,127,128,1,0,0,0,128,129,1,
0,0,0,129,130,5,31,0,0,130,132,3,8,4,0,131,133,3,18,9,0,132,131,1,0,0,0,
132,133,1,0,0,0,133,134,1,0,0,0,134,135,5,28,0,0,135,17,1,0,0,0,136,137,
5,45,0,0,137,138,5,49,0,0,138,139,3,8,4,0,139,19,1,0,0,0,140,142,5,35,0,
0,141,143,3,28,14,0,142,141,1,0,0,0,142,143,1,0,0,0,143,144,1,0,0,0,144,
145,5,6,0,0,145,146,3,32,16,0,146,21,1,0,0,0,147,148,5,29,0,0,148,150,3,
26,13,0,149,151,5,43,0,0,150,149,1,0,0,0,150,151,1,0,0,0,151,152,1,0,0,0,
152,153,5,31,0,0,153,154,3,8,4,0,154,155,5,28,0,0,155,181,1,0,0,0,156,157,
5,29,0,0,157,158,5,48,0,0,158,159,5,30,0,0,159,161,3,26,13,0,160,162,5,43,
0,0,161,160,1,0,0,0,161,162,1,0,0,0,162,163,1,0,0,0,163,164,5,31,0,0,164,
165,3,8,4,0,165,166,5,28,0,0,166,181,1,0,0,0,167,168,5,29,0,0,168,169,5,
48,0,0,169,170,5,5,0,0,170,171,5,48,0,0,171,172,5,30,0,0,172,174,3,26,13,
0,173,175,5,43,0,0,174,173,1,0,0,0,174,175,1,0,0,0,175,176,1,0,0,0,176,177,
5,31,0,0,177,178,3,8,4,0,178,179,5,28,0,0,179,181,1,0,0,0,180,147,1,0,0,
0,180,156,1,0,0,0,180,167,1,0,0,0,181,23,1,0,0,0,182,190,5,32,0,0,183,190,
5,33,0,0,184,186,5,36,0,0,185,187,3,26,13,0,186,185,1,0,0,0,186,187,1,0,
0,0,187,190,1,0,0,0,188,190,5,46,0,0,189,182,1,0,0,0,189,183,1,0,0,0,189,
184,1,0,0,0,189,188,1,0,0,0,190,25,1,0,0,0,191,192,6,13,-1,0,192,198,3,30,
15,0,193,194,5,7,0,0,194,198,3,26,13,7,195,196,5,37,0,0,196,198,3,26,13,
6,197,191,1,0,0,0,197,193,1,0,0,0,197,195,1,0,0,0,198,220,1,0,0,0,199,200,
10,5,0,0,200,201,7,0,0,0,201,219,3,26,13,6,202,203,10,4,0,0,203,204,7,1,
0,0,204,219,3,26,13,5,205,206,10,3,0,0,206,207,3,42,21,0,207,208,3,26,13,
4,208,219,1,0,0,0,209,210,10,2,0,0,210,211,5,38,0,0,211,219,3,26,13,3,212,
213,10,1,0,0,213,214,5,39,0,0,214,219,3,26,13,2,215,216,10,8,0,0,216,217,
5,2,0,0,217,219,3,28,14,0,218,199,1,0,0,0,218,202,1,0,0,0,218,205,1,0,0,
0,218,209,1,0,0,0,218,212,1,0,0,0,218,215,1,0,0,0,219,222,1,0,0,0,220,218,
1,0,0,0,220,221,1,0,0,0,221,27,1,0,0,0,222,220,1,0,0,0,223,237,5,48,0,0,
224,237,5,49,0,0,225,237,5,50,0,0,226,228,5,12,0,0,227,229,5,47,0,0,228,
227,1,0,0,0,228,229,1,0,0,0,229,230,1,0,0,0,230,237,5,48,0,0,231,232,5,12,
0,0,232,233,5,3,0,0,233,234,3,26,13,0,234,235,5,4,0,0,235,237,1,0,0,0,236,
223,1,0,0,0,236,224,1,0,0,0,236,225,1,0,0,0,236,226,1,0,0,0,236,231,1,0,
0,0,237,29,1,0,0,0,238,256,3,32,16,0,239,240,5,47,0,0,240,256,5,48,0,0,241,
256,5,48,0,0,242,243,5,49,0,0,243,244,5,2,0,0,244,256,5,49,0,0,245,256,5,
49,0,0,246,256,5,50,0,0,247,256,7,2,0,0,248,256,5,42,0,0,249,256,3,34,17,
0,250,256,3,40,20,0,251,252,5,3,0,0,252,253,3,26,13,0,253,254,5,4,0,0,254,
256,1,0,0,0,255,238,1,0,0,0,255,239,1,0,0,0,255,241,1,0,0,0,255,242,1,0,
0,0,255,245,1,0,0,0,255,246,1,0,0,0,255,247,1,0,0,0,255,248,1,0,0,0,255,
249,1,0,0,0,255,250,1,0,0,0,255,251,1,0,0,0,256,31,1,0,0,0,257,258,5,48,
0,0,258,267,5,3,0,0,259,264,3,26,13,0,260,261,5,5,0,0,261,263,3,26,13,0,
262,260,1,0,0,0,263,266,1,0,0,0,264,262,1,0,0,0,264,265,1,0,0,0,265,268,
1,0,0,0,266,264,1,0,0,0,267,259,1,0,0,0,267,268,1,0,0,0,268,269,1,0,0,0,
269,270,5,4,0,0,270,33,1,0,0,0,271,280,5,13,0,0,272,277,3,36,18,0,273,274,
5,5,0,0,274,276,3,36,18,0,275,273,1,0,0,0,276,279,1,0,0,0,277,275,1,0,0,
0,277,278,1,0,0,0,278,281,1,0,0,0,279,277,1,0,0,0,280,272,1,0,0,0,280,281,
1,0,0,0,281,282,1,0,0,0,282,283,5,14,0,0,283,35,1,0,0,0,284,285,3,38,19,
0,285,286,5,6,0,0,286,287,3,26,13,0,287,37,1,0,0,0,288,289,7,3,0,0,289,39,
1,0,0,0,290,291,5,15,0,0,291,292,3,26,13,0,292,293,5,16,0,0,293,296,3,26,
13,0,294,295,5,5,0,0,295,297,3,26,13,0,296,294,1,0,0,0,296,297,1,0,0,0,297,
298,1,0,0,0,298,299,5,17,0,0,299,313,1,0,0,0,300,309,5,15,0,0,301,306,3,
26,13,0,302,303,5,5,0,0,303,305,3,26,13,0,304,302,1,0,0,0,305,308,1,0,0,
0,306,304,1,0,0,0,306,307,1,0,0,0,307,310,1,0,0,0,308,306,1,0,0,0,309,301,
1,0,0,0,309,310,1,0,0,0,310,311,1,0,0,0,311,313,5,17,0,0,312,290,1,0,0,0,
312,300,1,0,0,0,313,41,1,0,0,0,314,315,7,4,0,0,315,43,1,0,0,0,32,47,60,70,
77,83,97,102,110,122,127,132,142,150,161,174,180,186,189,197,218,220,228,
236,255,264,267,277,280,296,306,309,312];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.atn.PredictionContextCache();

export default class ProperTeeParser extends antlr4.Parser {

    static grammarFileName = "ProperTee.g4";
    static literalNames = [ null, "'='", "'.'", "'('", "')'", "','", "':'", 
                            "'-'", "'*'", "'/'", "'%'", "'+'", "'$'", "'{'", 
                            "'}'", "'['", "'..'", "']'", "'>'", "'<'", "'=='", 
                            "'>='", "'<='", "'!='", "'if'", "'then'", "'elseif'", 
                            "'else'", "'end'", "'loop'", "'in'", "'do'", 
                            "'break'", "'continue'", "'function'", "'thread'", 
                            "'return'", "'not'", "'and'", "'or'", "'true'", 
                            "'false'", "'null'", "'infinite'", "'multi'", 
                            "'monitor'", "'debug'", "'::'" ];
    static symbolicNames = [ null, null, null, null, null, null, null, null, 
                             null, null, null, null, null, null, null, null, 
                             null, null, null, null, null, null, null, null, 
                             "K_IF", "K_THEN", "K_ELSEIF", "K_ELSE", "K_END", 
                             "K_LOOP", "K_IN", "K_DO", "K_BREAK", "K_CONTINUE", 
                             "K_FUNCTION", "K_SPAWN", "K_RETURN", "K_NOT", 
                             "K_AND", "K_OR", "K_TRUE", "K_FALSE", "K_NULL", 
                             "K_INFINITE", "K_MULTI", "K_MONITOR", "K_DEBUG", 
                             "GLOBAL_PREFIX", "ID", "INTEGER", "STRING", 
                             "COMMENT", "BLOCK_COMMENT", "WS" ];
    static ruleNames = [ "root", "statement", "assignment", "lvalue", "block", 
                         "ifStatement", "functionDef", "parameterList", 
                         "parallelStmt", "monitorClause", "spawnStmt", "iterationStmt", 
                         "flowControl", "expression", "access", "atom", 
                         "functionCall", "objectLiteral", "objectEntry", 
                         "objectKey", "arrayLiteral", "comparisonOp" ];

    constructor(input) {
        super(input);
        this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = ProperTeeParser.ruleNames;
        this.literalNames = ProperTeeParser.literalNames;
        this.symbolicNames = ProperTeeParser.symbolicNames;
    }

    sempred(localctx, ruleIndex, predIndex) {
    	switch(ruleIndex) {
    	case 3:
    	    		return this.lvalue_sempred(localctx, predIndex);
    	case 13:
    	    		return this.expression_sempred(localctx, predIndex);
        default:
            throw "No predicate with index:" + ruleIndex;
       }
    }

    lvalue_sempred(localctx, predIndex) {
    	switch(predIndex) {
    		case 0:
    			return this.precpred(this._ctx, 1);
    		default:
    			throw "No predicate with index:" + predIndex;
    	}
    };

    expression_sempred(localctx, predIndex) {
    	switch(predIndex) {
    		case 1:
    			return this.precpred(this._ctx, 5);
    		case 2:
    			return this.precpred(this._ctx, 4);
    		case 3:
    			return this.precpred(this._ctx, 3);
    		case 4:
    			return this.precpred(this._ctx, 2);
    		case 5:
    			return this.precpred(this._ctx, 1);
    		case 6:
    			return this.precpred(this._ctx, 8);
    		default:
    			throw "No predicate with index:" + predIndex;
    	}
    };




	root() {
	    let localctx = new RootContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, ProperTeeParser.RULE_root);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 47;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while((((_la) & ~0x1f) === 0 && ((1 << _la) & 553689224) !== 0) || ((((_la - 32)) & ~0x1f) === 0 && ((1 << (_la - 32)) & 513855) !== 0)) {
	            this.state = 44;
	            this.statement();
	            this.state = 49;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 50;
	        this.match(ProperTeeParser.EOF);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	statement() {
	    let localctx = new StatementContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 2, ProperTeeParser.RULE_statement);
	    try {
	        this.state = 60;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,1,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new AssignStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 52;
	            this.assignment();
	            break;

	        case 2:
	            localctx = new IfStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 53;
	            this.ifStatement();
	            break;

	        case 3:
	            localctx = new IterStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 54;
	            this.iterationStmt();
	            break;

	        case 4:
	            localctx = new FuncDefStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 4);
	            this.state = 55;
	            this.functionDef();
	            break;

	        case 5:
	            localctx = new ParallelExecStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 5);
	            this.state = 56;
	            this.parallelStmt();
	            break;

	        case 6:
	            localctx = new SpawnExecStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 6);
	            this.state = 57;
	            this.spawnStmt();
	            break;

	        case 7:
	            localctx = new FlowStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 7);
	            this.state = 58;
	            this.flowControl();
	            break;

	        case 8:
	            localctx = new ExprStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 8);
	            this.state = 59;
	            this.expression(0);
	            break;

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	assignment() {
	    let localctx = new AssignmentContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 4, ProperTeeParser.RULE_assignment);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 62;
	        this.lvalue(0);
	        this.state = 63;
	        this.match(ProperTeeParser.T__0);
	        this.state = 64;
	        this.expression(0);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	lvalue(_p) {
		if(_p===undefined) {
		    _p = 0;
		}
	    const _parentctx = this._ctx;
	    const _parentState = this.state;
	    let localctx = new LvalueContext(this, this._ctx, _parentState);
	    let _prevctx = localctx;
	    const _startState = 6;
	    this.enterRecursionRule(localctx, 6, ProperTeeParser.RULE_lvalue, _p);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 70;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 48:
	            localctx = new VarLValueContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;

	            this.state = 67;
	            this.match(ProperTeeParser.ID);
	            break;
	        case 47:
	            localctx = new GlobalVarLValueContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 68;
	            this.match(ProperTeeParser.GLOBAL_PREFIX);
	            this.state = 69;
	            this.match(ProperTeeParser.ID);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	        this._ctx.stop = this._input.LT(-1);
	        this.state = 77;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,3,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                if(this._parseListeners!==null) {
	                    this.triggerExitRuleEvent();
	                }
	                _prevctx = localctx;
	                localctx = new PropLValueContext(this, new LvalueContext(this, _parentctx, _parentState));
	                this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_lvalue);
	                this.state = 72;
	                if (!( this.precpred(this._ctx, 1))) {
	                    throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
	                }
	                this.state = 73;
	                this.match(ProperTeeParser.T__1);
	                this.state = 74;
	                this.access(); 
	            }
	            this.state = 79;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,3,this._ctx);
	        }

	    } catch( error) {
	        if(error instanceof antlr4.error.RecognitionException) {
		        localctx.exception = error;
		        this._errHandler.reportError(this, error);
		        this._errHandler.recover(this, error);
		    } else {
		    	throw error;
		    }
	    } finally {
	        this.unrollRecursionContexts(_parentctx)
	    }
	    return localctx;
	}



	block() {
	    let localctx = new BlockContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 8, ProperTeeParser.RULE_block);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 83;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while((((_la) & ~0x1f) === 0 && ((1 << _la) & 553689224) !== 0) || ((((_la - 32)) & ~0x1f) === 0 && ((1 << (_la - 32)) & 513855) !== 0)) {
	            this.state = 80;
	            this.statement();
	            this.state = 85;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	ifStatement() {
	    let localctx = new IfStatementContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 10, ProperTeeParser.RULE_ifStatement);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 86;
	        this.match(ProperTeeParser.K_IF);
	        this.state = 87;
	        localctx.condition = this.expression(0);
	        this.state = 88;
	        this.match(ProperTeeParser.K_THEN);
	        this.state = 89;
	        localctx.thenBody = this.block();
	        this.state = 97;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===26) {
	            this.state = 90;
	            this.match(ProperTeeParser.K_ELSEIF);
	            this.state = 91;
	            localctx._expression = this.expression(0);
	            localctx.elseifConds.push(localctx._expression);
	            this.state = 92;
	            this.match(ProperTeeParser.K_THEN);
	            this.state = 93;
	            localctx._block = this.block();
	            localctx.elseifBodies.push(localctx._block);
	            this.state = 99;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 102;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===27) {
	            this.state = 100;
	            this.match(ProperTeeParser.K_ELSE);
	            this.state = 101;
	            localctx.elseBody = this.block();
	        }

	        this.state = 104;
	        this.match(ProperTeeParser.K_END);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	functionDef() {
	    let localctx = new FunctionDefContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 12, ProperTeeParser.RULE_functionDef);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 106;
	        this.match(ProperTeeParser.K_FUNCTION);
	        this.state = 107;
	        localctx.funcName = this.match(ProperTeeParser.ID);
	        this.state = 108;
	        this.match(ProperTeeParser.T__2);
	        this.state = 110;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===48) {
	            this.state = 109;
	            this.parameterList();
	        }

	        this.state = 112;
	        this.match(ProperTeeParser.T__3);
	        this.state = 113;
	        this.match(ProperTeeParser.K_DO);
	        this.state = 114;
	        this.block();
	        this.state = 115;
	        this.match(ProperTeeParser.K_END);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	parameterList() {
	    let localctx = new ParameterListContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 14, ProperTeeParser.RULE_parameterList);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 117;
	        this.match(ProperTeeParser.ID);
	        this.state = 122;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===5) {
	            this.state = 118;
	            this.match(ProperTeeParser.T__4);
	            this.state = 119;
	            this.match(ProperTeeParser.ID);
	            this.state = 124;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	parallelStmt() {
	    let localctx = new ParallelStmtContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 16, ProperTeeParser.RULE_parallelStmt);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 125;
	        this.match(ProperTeeParser.K_MULTI);
	        this.state = 127;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===48) {
	            this.state = 126;
	            localctx.resultVar = this.match(ProperTeeParser.ID);
	        }

	        this.state = 129;
	        this.match(ProperTeeParser.K_DO);
	        this.state = 130;
	        this.block();
	        this.state = 132;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===45) {
	            this.state = 131;
	            this.monitorClause();
	        }

	        this.state = 134;
	        this.match(ProperTeeParser.K_END);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	monitorClause() {
	    let localctx = new MonitorClauseContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 18, ProperTeeParser.RULE_monitorClause);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 136;
	        this.match(ProperTeeParser.K_MONITOR);
	        this.state = 137;
	        this.match(ProperTeeParser.INTEGER);
	        this.state = 138;
	        this.block();
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	spawnStmt() {
	    let localctx = new SpawnStmtContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 20, ProperTeeParser.RULE_spawnStmt);
	    var _la = 0;
	    try {
	        localctx = new SpawnKeyStmtContext(this, localctx);
	        this.enterOuterAlt(localctx, 1);
	        this.state = 140;
	        this.match(ProperTeeParser.K_SPAWN);
	        this.state = 142;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===12 || ((((_la - 48)) & ~0x1f) === 0 && ((1 << (_la - 48)) & 7) !== 0)) {
	            this.state = 141;
	            this.access();
	        }

	        this.state = 144;
	        this.match(ProperTeeParser.T__5);
	        this.state = 145;
	        this.functionCall();
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	iterationStmt() {
	    let localctx = new IterationStmtContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 22, ProperTeeParser.RULE_iterationStmt);
	    var _la = 0;
	    try {
	        this.state = 180;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,15,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new ConditionLoopContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 147;
	            this.match(ProperTeeParser.K_LOOP);
	            this.state = 148;
	            this.expression(0);
	            this.state = 150;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===43) {
	                this.state = 149;
	                this.match(ProperTeeParser.K_INFINITE);
	            }

	            this.state = 152;
	            this.match(ProperTeeParser.K_DO);
	            this.state = 153;
	            this.block();
	            this.state = 154;
	            this.match(ProperTeeParser.K_END);
	            break;

	        case 2:
	            localctx = new ValueLoopContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 156;
	            this.match(ProperTeeParser.K_LOOP);
	            this.state = 157;
	            localctx.value = this.match(ProperTeeParser.ID);
	            this.state = 158;
	            this.match(ProperTeeParser.K_IN);
	            this.state = 159;
	            this.expression(0);
	            this.state = 161;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===43) {
	                this.state = 160;
	                this.match(ProperTeeParser.K_INFINITE);
	            }

	            this.state = 163;
	            this.match(ProperTeeParser.K_DO);
	            this.state = 164;
	            this.block();
	            this.state = 165;
	            this.match(ProperTeeParser.K_END);
	            break;

	        case 3:
	            localctx = new KeyValueLoopContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 167;
	            this.match(ProperTeeParser.K_LOOP);
	            this.state = 168;
	            localctx.key = this.match(ProperTeeParser.ID);
	            this.state = 169;
	            this.match(ProperTeeParser.T__4);
	            this.state = 170;
	            localctx.value = this.match(ProperTeeParser.ID);
	            this.state = 171;
	            this.match(ProperTeeParser.K_IN);
	            this.state = 172;
	            this.expression(0);
	            this.state = 174;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===43) {
	                this.state = 173;
	                this.match(ProperTeeParser.K_INFINITE);
	            }

	            this.state = 176;
	            this.match(ProperTeeParser.K_DO);
	            this.state = 177;
	            this.block();
	            this.state = 178;
	            this.match(ProperTeeParser.K_END);
	            break;

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	flowControl() {
	    let localctx = new FlowControlContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 24, ProperTeeParser.RULE_flowControl);
	    try {
	        this.state = 189;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 32:
	            localctx = new BreakStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 182;
	            this.match(ProperTeeParser.K_BREAK);
	            break;
	        case 33:
	            localctx = new ContinueStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 183;
	            this.match(ProperTeeParser.K_CONTINUE);
	            break;
	        case 36:
	            localctx = new ReturnStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 184;
	            this.match(ProperTeeParser.K_RETURN);
	            this.state = 186;
	            this._errHandler.sync(this);
	            var la_ = this._interp.adaptivePredict(this._input,16,this._ctx);
	            if(la_===1) {
	                this.state = 185;
	                this.expression(0);

	            }
	            break;
	        case 46:
	            localctx = new DebugStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 4);
	            this.state = 188;
	            this.match(ProperTeeParser.K_DEBUG);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	expression(_p) {
		if(_p===undefined) {
		    _p = 0;
		}
	    const _parentctx = this._ctx;
	    const _parentState = this.state;
	    let localctx = new ExpressionContext(this, this._ctx, _parentState);
	    let _prevctx = localctx;
	    const _startState = 26;
	    this.enterRecursionRule(localctx, 26, ProperTeeParser.RULE_expression, _p);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 197;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 3:
	        case 13:
	        case 15:
	        case 40:
	        case 41:
	        case 42:
	        case 47:
	        case 48:
	        case 49:
	        case 50:
	            localctx = new AtomExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;

	            this.state = 192;
	            this.atom();
	            break;
	        case 7:
	            localctx = new UnaryMinusExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 193;
	            this.match(ProperTeeParser.T__6);
	            this.state = 194;
	            this.expression(7);
	            break;
	        case 37:
	            localctx = new NotExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 195;
	            this.match(ProperTeeParser.K_NOT);
	            this.state = 196;
	            this.expression(6);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	        this._ctx.stop = this._input.LT(-1);
	        this.state = 220;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,20,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                if(this._parseListeners!==null) {
	                    this.triggerExitRuleEvent();
	                }
	                _prevctx = localctx;
	                this.state = 218;
	                this._errHandler.sync(this);
	                var la_ = this._interp.adaptivePredict(this._input,19,this._ctx);
	                switch(la_) {
	                case 1:
	                    localctx = new MultiplicativeExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 199;
	                    if (!( this.precpred(this._ctx, 5))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
	                    }
	                    this.state = 200;
	                    _la = this._input.LA(1);
	                    if(!((((_la) & ~0x1f) === 0 && ((1 << _la) & 1792) !== 0))) {
	                    this._errHandler.recoverInline(this);
	                    }
	                    else {
	                    	this._errHandler.reportMatch(this);
	                        this.consume();
	                    }
	                    this.state = 201;
	                    this.expression(6);
	                    break;

	                case 2:
	                    localctx = new AdditiveExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 202;
	                    if (!( this.precpred(this._ctx, 4))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
	                    }
	                    this.state = 203;
	                    _la = this._input.LA(1);
	                    if(!(_la===7 || _la===11)) {
	                    this._errHandler.recoverInline(this);
	                    }
	                    else {
	                    	this._errHandler.reportMatch(this);
	                        this.consume();
	                    }
	                    this.state = 204;
	                    this.expression(5);
	                    break;

	                case 3:
	                    localctx = new ComparisonExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 205;
	                    if (!( this.precpred(this._ctx, 3))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
	                    }
	                    this.state = 206;
	                    localctx.op = this.comparisonOp();
	                    this.state = 207;
	                    this.expression(4);
	                    break;

	                case 4:
	                    localctx = new AndExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 209;
	                    if (!( this.precpred(this._ctx, 2))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
	                    }
	                    this.state = 210;
	                    this.match(ProperTeeParser.K_AND);
	                    this.state = 211;
	                    this.expression(3);
	                    break;

	                case 5:
	                    localctx = new OrExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 212;
	                    if (!( this.precpred(this._ctx, 1))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
	                    }
	                    this.state = 213;
	                    this.match(ProperTeeParser.K_OR);
	                    this.state = 214;
	                    this.expression(2);
	                    break;

	                case 6:
	                    localctx = new MemberAccessExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 215;
	                    if (!( this.precpred(this._ctx, 8))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 8)");
	                    }
	                    this.state = 216;
	                    this.match(ProperTeeParser.T__1);
	                    this.state = 217;
	                    this.access();
	                    break;

	                } 
	            }
	            this.state = 222;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,20,this._ctx);
	        }

	    } catch( error) {
	        if(error instanceof antlr4.error.RecognitionException) {
		        localctx.exception = error;
		        this._errHandler.reportError(this, error);
		        this._errHandler.recover(this, error);
		    } else {
		    	throw error;
		    }
	    } finally {
	        this.unrollRecursionContexts(_parentctx)
	    }
	    return localctx;
	}



	access() {
	    let localctx = new AccessContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 28, ProperTeeParser.RULE_access);
	    var _la = 0;
	    try {
	        this.state = 236;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,22,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new StaticAccessContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 223;
	            this.match(ProperTeeParser.ID);
	            break;

	        case 2:
	            localctx = new ArrayAccessContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 224;
	            this.match(ProperTeeParser.INTEGER);
	            break;

	        case 3:
	            localctx = new StringKeyAccessContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 225;
	            this.match(ProperTeeParser.STRING);
	            break;

	        case 4:
	            localctx = new VarEvalAccessContext(this, localctx);
	            this.enterOuterAlt(localctx, 4);
	            this.state = 226;
	            this.match(ProperTeeParser.T__11);
	            this.state = 228;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===47) {
	                this.state = 227;
	                this.match(ProperTeeParser.GLOBAL_PREFIX);
	            }

	            this.state = 230;
	            this.match(ProperTeeParser.ID);
	            break;

	        case 5:
	            localctx = new EvalAccessContext(this, localctx);
	            this.enterOuterAlt(localctx, 5);
	            this.state = 231;
	            this.match(ProperTeeParser.T__11);
	            this.state = 232;
	            this.match(ProperTeeParser.T__2);
	            this.state = 233;
	            this.expression(0);
	            this.state = 234;
	            this.match(ProperTeeParser.T__3);
	            break;

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	atom() {
	    let localctx = new AtomContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 30, ProperTeeParser.RULE_atom);
	    var _la = 0;
	    try {
	        this.state = 255;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,23,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new FuncAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 238;
	            this.functionCall();
	            break;

	        case 2:
	            localctx = new GlobalVarReferenceContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 239;
	            this.match(ProperTeeParser.GLOBAL_PREFIX);
	            this.state = 240;
	            this.match(ProperTeeParser.ID);
	            break;

	        case 3:
	            localctx = new VarReferenceContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 241;
	            this.match(ProperTeeParser.ID);
	            break;

	        case 4:
	            localctx = new DecimalAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 4);
	            this.state = 242;
	            this.match(ProperTeeParser.INTEGER);
	            this.state = 243;
	            this.match(ProperTeeParser.T__1);
	            this.state = 244;
	            this.match(ProperTeeParser.INTEGER);
	            break;

	        case 5:
	            localctx = new IntegerAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 5);
	            this.state = 245;
	            this.match(ProperTeeParser.INTEGER);
	            break;

	        case 6:
	            localctx = new StringAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 6);
	            this.state = 246;
	            this.match(ProperTeeParser.STRING);
	            break;

	        case 7:
	            localctx = new BooleanAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 7);
	            this.state = 247;
	            _la = this._input.LA(1);
	            if(!(_la===40 || _la===41)) {
	            this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            break;

	        case 8:
	            localctx = new NullAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 8);
	            this.state = 248;
	            this.match(ProperTeeParser.K_NULL);
	            break;

	        case 9:
	            localctx = new ObjectAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 9);
	            this.state = 249;
	            this.objectLiteral();
	            break;

	        case 10:
	            localctx = new ArrayAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 10);
	            this.state = 250;
	            this.arrayLiteral();
	            break;

	        case 11:
	            localctx = new ParenAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 11);
	            this.state = 251;
	            this.match(ProperTeeParser.T__2);
	            this.state = 252;
	            this.expression(0);
	            this.state = 253;
	            this.match(ProperTeeParser.T__3);
	            break;

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	functionCall() {
	    let localctx = new FunctionCallContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 32, ProperTeeParser.RULE_functionCall);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 257;
	        localctx.funcName = this.match(ProperTeeParser.ID);
	        this.state = 258;
	        this.match(ProperTeeParser.T__2);
	        this.state = 267;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if((((_la) & ~0x1f) === 0 && ((1 << _la) & 41096) !== 0) || ((((_la - 37)) & ~0x1f) === 0 && ((1 << (_la - 37)) & 15417) !== 0)) {
	            this.state = 259;
	            this.expression(0);
	            this.state = 264;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===5) {
	                this.state = 260;
	                this.match(ProperTeeParser.T__4);
	                this.state = 261;
	                this.expression(0);
	                this.state = 266;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	        }

	        this.state = 269;
	        this.match(ProperTeeParser.T__3);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	objectLiteral() {
	    let localctx = new ObjectLiteralContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 34, ProperTeeParser.RULE_objectLiteral);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 271;
	        this.match(ProperTeeParser.T__12);
	        this.state = 280;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===49 || _la===50) {
	            this.state = 272;
	            this.objectEntry();
	            this.state = 277;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===5) {
	                this.state = 273;
	                this.match(ProperTeeParser.T__4);
	                this.state = 274;
	                this.objectEntry();
	                this.state = 279;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	        }

	        this.state = 282;
	        this.match(ProperTeeParser.T__13);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	objectEntry() {
	    let localctx = new ObjectEntryContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 36, ProperTeeParser.RULE_objectEntry);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 284;
	        this.objectKey();
	        this.state = 285;
	        this.match(ProperTeeParser.T__5);
	        this.state = 286;
	        this.expression(0);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	objectKey() {
	    let localctx = new ObjectKeyContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 38, ProperTeeParser.RULE_objectKey);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 288;
	        _la = this._input.LA(1);
	        if(!(_la===49 || _la===50)) {
	        this._errHandler.recoverInline(this);
	        }
	        else {
	        	this._errHandler.reportMatch(this);
	            this.consume();
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	arrayLiteral() {
	    let localctx = new ArrayLiteralContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 40, ProperTeeParser.RULE_arrayLiteral);
	    var _la = 0;
	    try {
	        this.state = 312;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,31,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new RangeArrayContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 290;
	            this.match(ProperTeeParser.T__14);
	            this.state = 291;
	            localctx.rangeStart = this.expression(0);
	            this.state = 292;
	            this.match(ProperTeeParser.T__15);
	            this.state = 293;
	            localctx.rangeEnd = this.expression(0);
	            this.state = 296;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===5) {
	                this.state = 294;
	                this.match(ProperTeeParser.T__4);
	                this.state = 295;
	                localctx.rangeStep = this.expression(0);
	            }

	            this.state = 298;
	            this.match(ProperTeeParser.T__16);
	            break;

	        case 2:
	            localctx = new ListArrayContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 300;
	            this.match(ProperTeeParser.T__14);
	            this.state = 309;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if((((_la) & ~0x1f) === 0 && ((1 << _la) & 41096) !== 0) || ((((_la - 37)) & ~0x1f) === 0 && ((1 << (_la - 37)) & 15417) !== 0)) {
	                this.state = 301;
	                this.expression(0);
	                this.state = 306;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	                while(_la===5) {
	                    this.state = 302;
	                    this.match(ProperTeeParser.T__4);
	                    this.state = 303;
	                    this.expression(0);
	                    this.state = 308;
	                    this._errHandler.sync(this);
	                    _la = this._input.LA(1);
	                }
	            }

	            this.state = 311;
	            this.match(ProperTeeParser.T__16);
	            break;

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	comparisonOp() {
	    let localctx = new ComparisonOpContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 42, ProperTeeParser.RULE_comparisonOp);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 314;
	        _la = this._input.LA(1);
	        if(!((((_la) & ~0x1f) === 0 && ((1 << _la) & 16515072) !== 0))) {
	        this._errHandler.recoverInline(this);
	        }
	        else {
	        	this._errHandler.reportMatch(this);
	            this.consume();
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


}

ProperTeeParser.EOF = antlr4.Token.EOF;
ProperTeeParser.T__0 = 1;
ProperTeeParser.T__1 = 2;
ProperTeeParser.T__2 = 3;
ProperTeeParser.T__3 = 4;
ProperTeeParser.T__4 = 5;
ProperTeeParser.T__5 = 6;
ProperTeeParser.T__6 = 7;
ProperTeeParser.T__7 = 8;
ProperTeeParser.T__8 = 9;
ProperTeeParser.T__9 = 10;
ProperTeeParser.T__10 = 11;
ProperTeeParser.T__11 = 12;
ProperTeeParser.T__12 = 13;
ProperTeeParser.T__13 = 14;
ProperTeeParser.T__14 = 15;
ProperTeeParser.T__15 = 16;
ProperTeeParser.T__16 = 17;
ProperTeeParser.T__17 = 18;
ProperTeeParser.T__18 = 19;
ProperTeeParser.T__19 = 20;
ProperTeeParser.T__20 = 21;
ProperTeeParser.T__21 = 22;
ProperTeeParser.T__22 = 23;
ProperTeeParser.K_IF = 24;
ProperTeeParser.K_THEN = 25;
ProperTeeParser.K_ELSEIF = 26;
ProperTeeParser.K_ELSE = 27;
ProperTeeParser.K_END = 28;
ProperTeeParser.K_LOOP = 29;
ProperTeeParser.K_IN = 30;
ProperTeeParser.K_DO = 31;
ProperTeeParser.K_BREAK = 32;
ProperTeeParser.K_CONTINUE = 33;
ProperTeeParser.K_FUNCTION = 34;
ProperTeeParser.K_SPAWN = 35;
ProperTeeParser.K_RETURN = 36;
ProperTeeParser.K_NOT = 37;
ProperTeeParser.K_AND = 38;
ProperTeeParser.K_OR = 39;
ProperTeeParser.K_TRUE = 40;
ProperTeeParser.K_FALSE = 41;
ProperTeeParser.K_NULL = 42;
ProperTeeParser.K_INFINITE = 43;
ProperTeeParser.K_MULTI = 44;
ProperTeeParser.K_MONITOR = 45;
ProperTeeParser.K_DEBUG = 46;
ProperTeeParser.GLOBAL_PREFIX = 47;
ProperTeeParser.ID = 48;
ProperTeeParser.INTEGER = 49;
ProperTeeParser.STRING = 50;
ProperTeeParser.COMMENT = 51;
ProperTeeParser.BLOCK_COMMENT = 52;
ProperTeeParser.WS = 53;

ProperTeeParser.RULE_root = 0;
ProperTeeParser.RULE_statement = 1;
ProperTeeParser.RULE_assignment = 2;
ProperTeeParser.RULE_lvalue = 3;
ProperTeeParser.RULE_block = 4;
ProperTeeParser.RULE_ifStatement = 5;
ProperTeeParser.RULE_functionDef = 6;
ProperTeeParser.RULE_parameterList = 7;
ProperTeeParser.RULE_parallelStmt = 8;
ProperTeeParser.RULE_monitorClause = 9;
ProperTeeParser.RULE_spawnStmt = 10;
ProperTeeParser.RULE_iterationStmt = 11;
ProperTeeParser.RULE_flowControl = 12;
ProperTeeParser.RULE_expression = 13;
ProperTeeParser.RULE_access = 14;
ProperTeeParser.RULE_atom = 15;
ProperTeeParser.RULE_functionCall = 16;
ProperTeeParser.RULE_objectLiteral = 17;
ProperTeeParser.RULE_objectEntry = 18;
ProperTeeParser.RULE_objectKey = 19;
ProperTeeParser.RULE_arrayLiteral = 20;
ProperTeeParser.RULE_comparisonOp = 21;

class RootContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_root;
    }

	EOF() {
	    return this.getToken(ProperTeeParser.EOF, 0);
	};

	statement = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(StatementContext);
	    } else {
	        return this.getTypedRuleContext(StatementContext,i);
	    }
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitRoot(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class StatementContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_statement;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class FuncDefStmtContext extends StatementContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	functionDef() {
	    return this.getTypedRuleContext(FunctionDefContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitFuncDefStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.FuncDefStmtContext = FuncDefStmtContext;

class IfStmtContext extends StatementContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	ifStatement() {
	    return this.getTypedRuleContext(IfStatementContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitIfStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.IfStmtContext = IfStmtContext;

class SpawnExecStmtContext extends StatementContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	spawnStmt() {
	    return this.getTypedRuleContext(SpawnStmtContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitSpawnExecStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.SpawnExecStmtContext = SpawnExecStmtContext;

class ExprStmtContext extends StatementContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitExprStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.ExprStmtContext = ExprStmtContext;

class IterStmtContext extends StatementContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	iterationStmt() {
	    return this.getTypedRuleContext(IterationStmtContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitIterStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.IterStmtContext = IterStmtContext;

class AssignStmtContext extends StatementContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	assignment() {
	    return this.getTypedRuleContext(AssignmentContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitAssignStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.AssignStmtContext = AssignStmtContext;

class FlowStmtContext extends StatementContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	flowControl() {
	    return this.getTypedRuleContext(FlowControlContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitFlowStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.FlowStmtContext = FlowStmtContext;

class ParallelExecStmtContext extends StatementContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	parallelStmt() {
	    return this.getTypedRuleContext(ParallelStmtContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitParallelExecStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.ParallelExecStmtContext = ParallelExecStmtContext;

class AssignmentContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_assignment;
    }

	lvalue() {
	    return this.getTypedRuleContext(LvalueContext,0);
	};

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitAssignment(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class LvalueContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_lvalue;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class VarLValueContext extends LvalueContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	ID() {
	    return this.getToken(ProperTeeParser.ID, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitVarLValue(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.VarLValueContext = VarLValueContext;

class GlobalVarLValueContext extends LvalueContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	GLOBAL_PREFIX() {
	    return this.getToken(ProperTeeParser.GLOBAL_PREFIX, 0);
	};

	ID() {
	    return this.getToken(ProperTeeParser.ID, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitGlobalVarLValue(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.GlobalVarLValueContext = GlobalVarLValueContext;

class PropLValueContext extends LvalueContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	lvalue() {
	    return this.getTypedRuleContext(LvalueContext,0);
	};

	access() {
	    return this.getTypedRuleContext(AccessContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitPropLValue(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.PropLValueContext = PropLValueContext;

class BlockContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_block;
    }

	statement = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(StatementContext);
	    } else {
	        return this.getTypedRuleContext(StatementContext,i);
	    }
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitBlock(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class IfStatementContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_ifStatement;
        this.condition = null;
        this.thenBody = null;
        this._expression = null;
        this.elseifConds = [];
        this._block = null;
        this.elseifBodies = [];
        this.elseBody = null;
    }

	K_IF() {
	    return this.getToken(ProperTeeParser.K_IF, 0);
	};

	K_THEN = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(ProperTeeParser.K_THEN);
	    } else {
	        return this.getToken(ProperTeeParser.K_THEN, i);
	    }
	};


	K_END() {
	    return this.getToken(ProperTeeParser.K_END, 0);
	};

	expression = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExpressionContext);
	    } else {
	        return this.getTypedRuleContext(ExpressionContext,i);
	    }
	};

	block = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(BlockContext);
	    } else {
	        return this.getTypedRuleContext(BlockContext,i);
	    }
	};

	K_ELSEIF = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(ProperTeeParser.K_ELSEIF);
	    } else {
	        return this.getToken(ProperTeeParser.K_ELSEIF, i);
	    }
	};


	K_ELSE() {
	    return this.getToken(ProperTeeParser.K_ELSE, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitIfStatement(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class FunctionDefContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_functionDef;
        this.funcName = null;
    }

	K_FUNCTION() {
	    return this.getToken(ProperTeeParser.K_FUNCTION, 0);
	};

	K_DO() {
	    return this.getToken(ProperTeeParser.K_DO, 0);
	};

	block() {
	    return this.getTypedRuleContext(BlockContext,0);
	};

	K_END() {
	    return this.getToken(ProperTeeParser.K_END, 0);
	};

	ID() {
	    return this.getToken(ProperTeeParser.ID, 0);
	};

	parameterList() {
	    return this.getTypedRuleContext(ParameterListContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitFunctionDef(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class ParameterListContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_parameterList;
    }

	ID = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(ProperTeeParser.ID);
	    } else {
	        return this.getToken(ProperTeeParser.ID, i);
	    }
	};


	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitParameterList(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class ParallelStmtContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_parallelStmt;
        this.resultVar = null;
    }

	K_MULTI() {
	    return this.getToken(ProperTeeParser.K_MULTI, 0);
	};

	K_DO() {
	    return this.getToken(ProperTeeParser.K_DO, 0);
	};

	block() {
	    return this.getTypedRuleContext(BlockContext,0);
	};

	K_END() {
	    return this.getToken(ProperTeeParser.K_END, 0);
	};

	monitorClause() {
	    return this.getTypedRuleContext(MonitorClauseContext,0);
	};

	ID() {
	    return this.getToken(ProperTeeParser.ID, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitParallelStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class MonitorClauseContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_monitorClause;
    }

	K_MONITOR() {
	    return this.getToken(ProperTeeParser.K_MONITOR, 0);
	};

	INTEGER() {
	    return this.getToken(ProperTeeParser.INTEGER, 0);
	};

	block() {
	    return this.getTypedRuleContext(BlockContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitMonitorClause(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class SpawnStmtContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_spawnStmt;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class SpawnKeyStmtContext extends SpawnStmtContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	K_SPAWN() {
	    return this.getToken(ProperTeeParser.K_SPAWN, 0);
	};

	functionCall() {
	    return this.getTypedRuleContext(FunctionCallContext,0);
	};

	access() {
	    return this.getTypedRuleContext(AccessContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitSpawnKeyStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.SpawnKeyStmtContext = SpawnKeyStmtContext;

class IterationStmtContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_iterationStmt;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class KeyValueLoopContext extends IterationStmtContext {

    constructor(parser, ctx) {
        super(parser);
        this.key = null;;
        this.value = null;;
        super.copyFrom(ctx);
    }

	K_LOOP() {
	    return this.getToken(ProperTeeParser.K_LOOP, 0);
	};

	K_IN() {
	    return this.getToken(ProperTeeParser.K_IN, 0);
	};

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	K_DO() {
	    return this.getToken(ProperTeeParser.K_DO, 0);
	};

	block() {
	    return this.getTypedRuleContext(BlockContext,0);
	};

	K_END() {
	    return this.getToken(ProperTeeParser.K_END, 0);
	};

	ID = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(ProperTeeParser.ID);
	    } else {
	        return this.getToken(ProperTeeParser.ID, i);
	    }
	};


	K_INFINITE() {
	    return this.getToken(ProperTeeParser.K_INFINITE, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitKeyValueLoop(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.KeyValueLoopContext = KeyValueLoopContext;

class ConditionLoopContext extends IterationStmtContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	K_LOOP() {
	    return this.getToken(ProperTeeParser.K_LOOP, 0);
	};

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	K_DO() {
	    return this.getToken(ProperTeeParser.K_DO, 0);
	};

	block() {
	    return this.getTypedRuleContext(BlockContext,0);
	};

	K_END() {
	    return this.getToken(ProperTeeParser.K_END, 0);
	};

	K_INFINITE() {
	    return this.getToken(ProperTeeParser.K_INFINITE, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitConditionLoop(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.ConditionLoopContext = ConditionLoopContext;

class ValueLoopContext extends IterationStmtContext {

    constructor(parser, ctx) {
        super(parser);
        this.value = null;;
        super.copyFrom(ctx);
    }

	K_LOOP() {
	    return this.getToken(ProperTeeParser.K_LOOP, 0);
	};

	K_IN() {
	    return this.getToken(ProperTeeParser.K_IN, 0);
	};

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	K_DO() {
	    return this.getToken(ProperTeeParser.K_DO, 0);
	};

	block() {
	    return this.getTypedRuleContext(BlockContext,0);
	};

	K_END() {
	    return this.getToken(ProperTeeParser.K_END, 0);
	};

	ID() {
	    return this.getToken(ProperTeeParser.ID, 0);
	};

	K_INFINITE() {
	    return this.getToken(ProperTeeParser.K_INFINITE, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitValueLoop(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.ValueLoopContext = ValueLoopContext;

class FlowControlContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_flowControl;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class ContinueStmtContext extends FlowControlContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	K_CONTINUE() {
	    return this.getToken(ProperTeeParser.K_CONTINUE, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitContinueStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.ContinueStmtContext = ContinueStmtContext;

class BreakStmtContext extends FlowControlContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	K_BREAK() {
	    return this.getToken(ProperTeeParser.K_BREAK, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitBreakStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.BreakStmtContext = BreakStmtContext;

class DebugStmtContext extends FlowControlContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	K_DEBUG() {
	    return this.getToken(ProperTeeParser.K_DEBUG, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitDebugStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.DebugStmtContext = DebugStmtContext;

class ReturnStmtContext extends FlowControlContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	K_RETURN() {
	    return this.getToken(ProperTeeParser.K_RETURN, 0);
	};

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitReturnStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.ReturnStmtContext = ReturnStmtContext;

class ExpressionContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_expression;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class AndExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	expression = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExpressionContext);
	    } else {
	        return this.getTypedRuleContext(ExpressionContext,i);
	    }
	};

	K_AND() {
	    return this.getToken(ProperTeeParser.K_AND, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitAndExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.AndExprContext = AndExprContext;

class MultiplicativeExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	expression = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExpressionContext);
	    } else {
	        return this.getTypedRuleContext(ExpressionContext,i);
	    }
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitMultiplicativeExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.MultiplicativeExprContext = MultiplicativeExprContext;

class AdditiveExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	expression = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExpressionContext);
	    } else {
	        return this.getTypedRuleContext(ExpressionContext,i);
	    }
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitAdditiveExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.AdditiveExprContext = AdditiveExprContext;

class ComparisonExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        this.op = null;;
        super.copyFrom(ctx);
    }

	expression = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExpressionContext);
	    } else {
	        return this.getTypedRuleContext(ExpressionContext,i);
	    }
	};

	comparisonOp() {
	    return this.getTypedRuleContext(ComparisonOpContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitComparisonExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.ComparisonExprContext = ComparisonExprContext;

class NotExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	K_NOT() {
	    return this.getToken(ProperTeeParser.K_NOT, 0);
	};

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitNotExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.NotExprContext = NotExprContext;

class AtomExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	atom() {
	    return this.getTypedRuleContext(AtomContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitAtomExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.AtomExprContext = AtomExprContext;

class MemberAccessExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	access() {
	    return this.getTypedRuleContext(AccessContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitMemberAccessExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.MemberAccessExprContext = MemberAccessExprContext;

class OrExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	expression = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExpressionContext);
	    } else {
	        return this.getTypedRuleContext(ExpressionContext,i);
	    }
	};

	K_OR() {
	    return this.getToken(ProperTeeParser.K_OR, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitOrExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.OrExprContext = OrExprContext;

class UnaryMinusExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitUnaryMinusExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.UnaryMinusExprContext = UnaryMinusExprContext;

class AccessContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_access;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class StaticAccessContext extends AccessContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	ID() {
	    return this.getToken(ProperTeeParser.ID, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitStaticAccess(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.StaticAccessContext = StaticAccessContext;

class ArrayAccessContext extends AccessContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	INTEGER() {
	    return this.getToken(ProperTeeParser.INTEGER, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitArrayAccess(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.ArrayAccessContext = ArrayAccessContext;

class VarEvalAccessContext extends AccessContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	ID() {
	    return this.getToken(ProperTeeParser.ID, 0);
	};

	GLOBAL_PREFIX() {
	    return this.getToken(ProperTeeParser.GLOBAL_PREFIX, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitVarEvalAccess(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.VarEvalAccessContext = VarEvalAccessContext;

class EvalAccessContext extends AccessContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitEvalAccess(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.EvalAccessContext = EvalAccessContext;

class StringKeyAccessContext extends AccessContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	STRING() {
	    return this.getToken(ProperTeeParser.STRING, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitStringKeyAccess(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.StringKeyAccessContext = StringKeyAccessContext;

class AtomContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_atom;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class IntegerAtomContext extends AtomContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	INTEGER() {
	    return this.getToken(ProperTeeParser.INTEGER, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitIntegerAtom(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.IntegerAtomContext = IntegerAtomContext;

class ObjectAtomContext extends AtomContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	objectLiteral() {
	    return this.getTypedRuleContext(ObjectLiteralContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitObjectAtom(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.ObjectAtomContext = ObjectAtomContext;

class ArrayAtomContext extends AtomContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	arrayLiteral() {
	    return this.getTypedRuleContext(ArrayLiteralContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitArrayAtom(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.ArrayAtomContext = ArrayAtomContext;

class GlobalVarReferenceContext extends AtomContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	GLOBAL_PREFIX() {
	    return this.getToken(ProperTeeParser.GLOBAL_PREFIX, 0);
	};

	ID() {
	    return this.getToken(ProperTeeParser.ID, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitGlobalVarReference(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.GlobalVarReferenceContext = GlobalVarReferenceContext;

class VarReferenceContext extends AtomContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	ID() {
	    return this.getToken(ProperTeeParser.ID, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitVarReference(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.VarReferenceContext = VarReferenceContext;

class StringAtomContext extends AtomContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	STRING() {
	    return this.getToken(ProperTeeParser.STRING, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitStringAtom(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.StringAtomContext = StringAtomContext;

class FuncAtomContext extends AtomContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	functionCall() {
	    return this.getTypedRuleContext(FunctionCallContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitFuncAtom(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.FuncAtomContext = FuncAtomContext;

class NullAtomContext extends AtomContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	K_NULL() {
	    return this.getToken(ProperTeeParser.K_NULL, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitNullAtom(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.NullAtomContext = NullAtomContext;

class ParenAtomContext extends AtomContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitParenAtom(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.ParenAtomContext = ParenAtomContext;

class DecimalAtomContext extends AtomContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	INTEGER = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(ProperTeeParser.INTEGER);
	    } else {
	        return this.getToken(ProperTeeParser.INTEGER, i);
	    }
	};


	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitDecimalAtom(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.DecimalAtomContext = DecimalAtomContext;

class BooleanAtomContext extends AtomContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	K_TRUE() {
	    return this.getToken(ProperTeeParser.K_TRUE, 0);
	};

	K_FALSE() {
	    return this.getToken(ProperTeeParser.K_FALSE, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitBooleanAtom(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.BooleanAtomContext = BooleanAtomContext;

class FunctionCallContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_functionCall;
        this.funcName = null;
    }

	ID() {
	    return this.getToken(ProperTeeParser.ID, 0);
	};

	expression = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExpressionContext);
	    } else {
	        return this.getTypedRuleContext(ExpressionContext,i);
	    }
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitFunctionCall(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class ObjectLiteralContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_objectLiteral;
    }

	objectEntry = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ObjectEntryContext);
	    } else {
	        return this.getTypedRuleContext(ObjectEntryContext,i);
	    }
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitObjectLiteral(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class ObjectEntryContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_objectEntry;
    }

	objectKey() {
	    return this.getTypedRuleContext(ObjectKeyContext,0);
	};

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitObjectEntry(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class ObjectKeyContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_objectKey;
    }

	STRING() {
	    return this.getToken(ProperTeeParser.STRING, 0);
	};

	INTEGER() {
	    return this.getToken(ProperTeeParser.INTEGER, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitObjectKey(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class ArrayLiteralContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_arrayLiteral;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class RangeArrayContext extends ArrayLiteralContext {

    constructor(parser, ctx) {
        super(parser);
        this.rangeStart = null;;
        this.rangeEnd = null;;
        this.rangeStep = null;;
        super.copyFrom(ctx);
    }

	expression = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExpressionContext);
	    } else {
	        return this.getTypedRuleContext(ExpressionContext,i);
	    }
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitRangeArray(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.RangeArrayContext = RangeArrayContext;

class ListArrayContext extends ArrayLiteralContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	expression = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExpressionContext);
	    } else {
	        return this.getTypedRuleContext(ExpressionContext,i);
	    }
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitListArray(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.ListArrayContext = ListArrayContext;

class ComparisonOpContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_comparisonOp;
    }


	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitComparisonOp(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}




ProperTeeParser.RootContext = RootContext; 
ProperTeeParser.StatementContext = StatementContext; 
ProperTeeParser.AssignmentContext = AssignmentContext; 
ProperTeeParser.LvalueContext = LvalueContext; 
ProperTeeParser.BlockContext = BlockContext; 
ProperTeeParser.IfStatementContext = IfStatementContext; 
ProperTeeParser.FunctionDefContext = FunctionDefContext; 
ProperTeeParser.ParameterListContext = ParameterListContext; 
ProperTeeParser.ParallelStmtContext = ParallelStmtContext; 
ProperTeeParser.MonitorClauseContext = MonitorClauseContext; 
ProperTeeParser.SpawnStmtContext = SpawnStmtContext; 
ProperTeeParser.IterationStmtContext = IterationStmtContext; 
ProperTeeParser.FlowControlContext = FlowControlContext; 
ProperTeeParser.ExpressionContext = ExpressionContext; 
ProperTeeParser.AccessContext = AccessContext; 
ProperTeeParser.AtomContext = AtomContext; 
ProperTeeParser.FunctionCallContext = FunctionCallContext; 
ProperTeeParser.ObjectLiteralContext = ObjectLiteralContext; 
ProperTeeParser.ObjectEntryContext = ObjectEntryContext; 
ProperTeeParser.ObjectKeyContext = ObjectKeyContext; 
ProperTeeParser.ArrayLiteralContext = ArrayLiteralContext; 
ProperTeeParser.ComparisonOpContext = ComparisonOpContext; 
