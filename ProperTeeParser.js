// Generated from ProperTee.g4 by ANTLR 4.13.2
// jshint ignore: start
import antlr4 from 'antlr4';
import ProperTeeVisitor from './ProperTeeVisitor.js';

const serializedATN = [4,1,49,306,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,
4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,
2,13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,
20,7,20,2,21,7,21,2,22,7,22,1,0,5,0,48,8,0,10,0,12,0,51,9,0,1,0,1,0,1,1,
1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,63,8,1,1,2,1,2,1,2,1,2,1,3,1,3,1,3,1,3,3,
3,73,8,3,1,3,1,3,1,3,5,3,78,8,3,10,3,12,3,81,9,3,1,4,5,4,84,8,4,10,4,12,
4,87,9,4,1,5,1,5,1,5,1,5,1,5,1,5,3,5,95,8,5,1,5,1,5,1,6,1,6,1,6,1,6,3,6,
103,8,6,1,6,1,6,1,6,1,6,1,6,1,7,1,7,1,7,5,7,113,8,7,10,7,12,7,116,9,7,1,
8,1,8,3,8,120,8,8,1,8,1,8,1,8,3,8,125,8,8,1,8,1,8,1,9,1,9,1,9,1,9,1,10,1,
10,3,10,135,8,10,1,10,1,10,1,10,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,
1,11,1,11,1,11,3,11,151,8,11,1,12,1,12,1,12,3,12,156,8,12,1,12,1,12,1,12,
1,12,1,12,1,12,1,12,1,12,1,12,3,12,167,8,12,1,12,1,12,1,12,1,12,1,12,1,12,
1,12,1,12,1,12,1,12,1,12,3,12,180,8,12,1,12,1,12,1,12,1,12,3,12,186,8,12,
1,13,1,13,1,13,1,13,3,13,192,8,13,3,13,194,8,13,1,14,1,14,1,14,1,14,1,14,
1,14,3,14,202,8,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,
1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,5,14,223,8,14,10,14,12,14,226,9,
14,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,3,15,238,8,15,1,16,
1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,
16,3,16,256,8,16,1,17,1,17,1,17,1,17,1,17,5,17,263,8,17,10,17,12,17,266,
9,17,3,17,268,8,17,1,17,1,17,1,18,1,18,1,18,1,18,5,18,276,8,18,10,18,12,
18,279,9,18,3,18,281,8,18,1,18,1,18,1,19,1,19,1,19,1,19,1,20,1,20,1,21,1,
21,1,21,1,21,5,21,295,8,21,10,21,12,21,298,9,21,3,21,300,8,21,1,21,1,21,
1,22,1,22,1,22,0,2,6,28,23,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,
34,36,38,40,42,44,0,5,1,0,38,39,1,0,9,11,2,0,8,8,12,12,1,0,44,46,1,0,17,
22,339,0,49,1,0,0,0,2,62,1,0,0,0,4,64,1,0,0,0,6,72,1,0,0,0,8,85,1,0,0,0,
10,88,1,0,0,0,12,98,1,0,0,0,14,109,1,0,0,0,16,117,1,0,0,0,18,128,1,0,0,0,
20,132,1,0,0,0,22,150,1,0,0,0,24,185,1,0,0,0,26,193,1,0,0,0,28,201,1,0,0,
0,30,237,1,0,0,0,32,255,1,0,0,0,34,257,1,0,0,0,36,271,1,0,0,0,38,284,1,0,
0,0,40,288,1,0,0,0,42,290,1,0,0,0,44,303,1,0,0,0,46,48,3,2,1,0,47,46,1,0,
0,0,48,51,1,0,0,0,49,47,1,0,0,0,49,50,1,0,0,0,50,52,1,0,0,0,51,49,1,0,0,
0,52,53,5,0,0,1,53,1,1,0,0,0,54,63,3,4,2,0,55,63,3,10,5,0,56,63,3,24,12,
0,57,63,3,12,6,0,58,63,3,16,8,0,59,63,3,20,10,0,60,63,3,26,13,0,61,63,3,
28,14,0,62,54,1,0,0,0,62,55,1,0,0,0,62,56,1,0,0,0,62,57,1,0,0,0,62,58,1,
0,0,0,62,59,1,0,0,0,62,60,1,0,0,0,62,61,1,0,0,0,63,3,1,0,0,0,64,65,3,6,3,
0,65,66,5,1,0,0,66,67,3,28,14,0,67,5,1,0,0,0,68,69,6,3,-1,0,69,73,5,44,0,
0,70,71,5,43,0,0,71,73,5,44,0,0,72,68,1,0,0,0,72,70,1,0,0,0,73,79,1,0,0,
0,74,75,10,1,0,0,75,76,5,2,0,0,76,78,3,30,15,0,77,74,1,0,0,0,78,81,1,0,0,
0,79,77,1,0,0,0,79,80,1,0,0,0,80,7,1,0,0,0,81,79,1,0,0,0,82,84,3,2,1,0,83,
82,1,0,0,0,84,87,1,0,0,0,85,83,1,0,0,0,85,86,1,0,0,0,86,9,1,0,0,0,87,85,
1,0,0,0,88,89,5,23,0,0,89,90,3,28,14,0,90,91,5,24,0,0,91,94,3,8,4,0,92,93,
5,25,0,0,93,95,3,8,4,0,94,92,1,0,0,0,94,95,1,0,0,0,95,96,1,0,0,0,96,97,5,
26,0,0,97,11,1,0,0,0,98,99,5,32,0,0,99,100,5,44,0,0,100,102,5,3,0,0,101,
103,3,14,7,0,102,101,1,0,0,0,102,103,1,0,0,0,103,104,1,0,0,0,104,105,5,4,
0,0,105,106,5,29,0,0,106,107,3,8,4,0,107,108,5,26,0,0,108,13,1,0,0,0,109,
114,5,44,0,0,110,111,5,5,0,0,111,113,5,44,0,0,112,110,1,0,0,0,113,116,1,
0,0,0,114,112,1,0,0,0,114,115,1,0,0,0,115,15,1,0,0,0,116,114,1,0,0,0,117,
119,5,41,0,0,118,120,5,44,0,0,119,118,1,0,0,0,119,120,1,0,0,0,120,121,1,
0,0,0,121,122,5,29,0,0,122,124,3,8,4,0,123,125,3,18,9,0,124,123,1,0,0,0,
124,125,1,0,0,0,125,126,1,0,0,0,126,127,5,26,0,0,127,17,1,0,0,0,128,129,
5,42,0,0,129,130,5,45,0,0,130,131,3,8,4,0,131,19,1,0,0,0,132,134,5,33,0,
0,133,135,3,22,11,0,134,133,1,0,0,0,134,135,1,0,0,0,135,136,1,0,0,0,136,
137,5,6,0,0,137,138,3,34,17,0,138,21,1,0,0,0,139,151,5,44,0,0,140,151,5,
46,0,0,141,151,5,45,0,0,142,151,7,0,0,0,143,144,5,7,0,0,144,151,5,44,0,0,
145,146,5,7,0,0,146,147,5,3,0,0,147,148,3,28,14,0,148,149,5,4,0,0,149,151,
1,0,0,0,150,139,1,0,0,0,150,140,1,0,0,0,150,141,1,0,0,0,150,142,1,0,0,0,
150,143,1,0,0,0,150,145,1,0,0,0,151,23,1,0,0,0,152,153,5,27,0,0,153,155,
3,28,14,0,154,156,5,40,0,0,155,154,1,0,0,0,155,156,1,0,0,0,156,157,1,0,0,
0,157,158,5,29,0,0,158,159,3,8,4,0,159,160,5,26,0,0,160,186,1,0,0,0,161,
162,5,27,0,0,162,163,5,44,0,0,163,164,5,28,0,0,164,166,3,28,14,0,165,167,
5,40,0,0,166,165,1,0,0,0,166,167,1,0,0,0,167,168,1,0,0,0,168,169,5,29,0,
0,169,170,3,8,4,0,170,171,5,26,0,0,171,186,1,0,0,0,172,173,5,27,0,0,173,
174,5,44,0,0,174,175,5,5,0,0,175,176,5,44,0,0,176,177,5,28,0,0,177,179,3,
28,14,0,178,180,5,40,0,0,179,178,1,0,0,0,179,180,1,0,0,0,180,181,1,0,0,0,
181,182,5,29,0,0,182,183,3,8,4,0,183,184,5,26,0,0,184,186,1,0,0,0,185,152,
1,0,0,0,185,161,1,0,0,0,185,172,1,0,0,0,186,25,1,0,0,0,187,194,5,30,0,0,
188,194,5,31,0,0,189,191,5,34,0,0,190,192,3,28,14,0,191,190,1,0,0,0,191,
192,1,0,0,0,192,194,1,0,0,0,193,187,1,0,0,0,193,188,1,0,0,0,193,189,1,0,
0,0,194,27,1,0,0,0,195,196,6,14,-1,0,196,202,3,32,16,0,197,198,5,8,0,0,198,
202,3,28,14,7,199,200,5,35,0,0,200,202,3,28,14,6,201,195,1,0,0,0,201,197,
1,0,0,0,201,199,1,0,0,0,202,224,1,0,0,0,203,204,10,5,0,0,204,205,7,1,0,0,
205,223,3,28,14,6,206,207,10,4,0,0,207,208,7,2,0,0,208,223,3,28,14,5,209,
210,10,3,0,0,210,211,3,44,22,0,211,212,3,28,14,4,212,223,1,0,0,0,213,214,
10,2,0,0,214,215,5,36,0,0,215,223,3,28,14,3,216,217,10,1,0,0,217,218,5,37,
0,0,218,223,3,28,14,2,219,220,10,8,0,0,220,221,5,2,0,0,221,223,3,30,15,0,
222,203,1,0,0,0,222,206,1,0,0,0,222,209,1,0,0,0,222,213,1,0,0,0,222,216,
1,0,0,0,222,219,1,0,0,0,223,226,1,0,0,0,224,222,1,0,0,0,224,225,1,0,0,0,
225,29,1,0,0,0,226,224,1,0,0,0,227,238,5,44,0,0,228,238,5,45,0,0,229,238,
5,46,0,0,230,231,5,7,0,0,231,238,5,44,0,0,232,233,5,7,0,0,233,234,5,3,0,
0,234,235,3,28,14,0,235,236,5,4,0,0,236,238,1,0,0,0,237,227,1,0,0,0,237,
228,1,0,0,0,237,229,1,0,0,0,237,230,1,0,0,0,237,232,1,0,0,0,238,31,1,0,0,
0,239,256,3,34,17,0,240,241,5,43,0,0,241,256,5,44,0,0,242,256,5,44,0,0,243,
244,5,45,0,0,244,245,5,2,0,0,245,256,5,45,0,0,246,256,5,45,0,0,247,256,5,
46,0,0,248,256,7,0,0,0,249,256,3,36,18,0,250,256,3,42,21,0,251,252,5,3,0,
0,252,253,3,28,14,0,253,254,5,4,0,0,254,256,1,0,0,0,255,239,1,0,0,0,255,
240,1,0,0,0,255,242,1,0,0,0,255,243,1,0,0,0,255,246,1,0,0,0,255,247,1,0,
0,0,255,248,1,0,0,0,255,249,1,0,0,0,255,250,1,0,0,0,255,251,1,0,0,0,256,
33,1,0,0,0,257,258,5,44,0,0,258,267,5,3,0,0,259,264,3,28,14,0,260,261,5,
5,0,0,261,263,3,28,14,0,262,260,1,0,0,0,263,266,1,0,0,0,264,262,1,0,0,0,
264,265,1,0,0,0,265,268,1,0,0,0,266,264,1,0,0,0,267,259,1,0,0,0,267,268,
1,0,0,0,268,269,1,0,0,0,269,270,5,4,0,0,270,35,1,0,0,0,271,280,5,13,0,0,
272,277,3,38,19,0,273,274,5,5,0,0,274,276,3,38,19,0,275,273,1,0,0,0,276,
279,1,0,0,0,277,275,1,0,0,0,277,278,1,0,0,0,278,281,1,0,0,0,279,277,1,0,
0,0,280,272,1,0,0,0,280,281,1,0,0,0,281,282,1,0,0,0,282,283,5,14,0,0,283,
37,1,0,0,0,284,285,3,40,20,0,285,286,5,6,0,0,286,287,3,28,14,0,287,39,1,
0,0,0,288,289,7,3,0,0,289,41,1,0,0,0,290,299,5,15,0,0,291,296,3,28,14,0,
292,293,5,5,0,0,293,295,3,28,14,0,294,292,1,0,0,0,295,298,1,0,0,0,296,294,
1,0,0,0,296,297,1,0,0,0,297,300,1,0,0,0,298,296,1,0,0,0,299,291,1,0,0,0,
299,300,1,0,0,0,300,301,1,0,0,0,301,302,5,16,0,0,302,43,1,0,0,0,303,304,
7,4,0,0,304,45,1,0,0,0,29,49,62,72,79,85,94,102,114,119,124,134,150,155,
166,179,185,191,193,201,222,224,237,255,264,267,277,280,296,299];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.atn.PredictionContextCache();

export default class ProperTeeParser extends antlr4.Parser {

    static grammarFileName = "ProperTee.g4";
    static literalNames = [ null, "'='", "'.'", "'('", "')'", "','", "':'", 
                            "'$'", "'-'", "'*'", "'/'", "'%'", "'+'", "'{'", 
                            "'}'", "'['", "']'", "'>'", "'<'", "'=='", "'>='", 
                            "'<='", "'!='", "'if'", "'then'", "'else'", 
                            "'end'", "'loop'", "'in'", "'do'", "'break'", 
                            "'continue'", "'function'", "'thread'", "'return'", 
                            "'not'", "'and'", "'or'", "'true'", "'false'", 
                            "'infinite'", "'multi'", "'monitor'", "'::'" ];
    static symbolicNames = [ null, null, null, null, null, null, null, null, 
                             null, null, null, null, null, null, null, null, 
                             null, null, null, null, null, null, null, "K_IF", 
                             "K_THEN", "K_ELSE", "K_END", "K_LOOP", "K_IN", 
                             "K_DO", "K_BREAK", "K_CONTINUE", "K_FUNCTION", 
                             "K_SPAWN", "K_RETURN", "K_NOT", "K_AND", "K_OR", 
                             "K_TRUE", "K_FALSE", "K_INFINITE", "K_MULTI", 
                             "K_MONITOR", "GLOBAL_PREFIX", "ID", "INTEGER", 
                             "STRING", "COMMENT", "BLOCK_COMMENT", "WS" ];
    static ruleNames = [ "root", "statement", "assignment", "lvalue", "block", 
                         "ifStatement", "functionDef", "parameterList", 
                         "parallelStmt", "monitorClause", "spawnStmt", "spawnKey", 
                         "iterationStmt", "flowControl", "expression", "access", 
                         "atom", "functionCall", "objectLiteral", "objectEntry", 
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
    	case 14:
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
	        this.state = 49;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while((((_la) & ~0x1f) === 0 && ((1 << _la) & 3363873032) !== 0) || ((((_la - 32)) & ~0x1f) === 0 && ((1 << (_la - 32)) & 31439) !== 0)) {
	            this.state = 46;
	            this.statement();
	            this.state = 51;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 52;
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
	        this.state = 62;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,1,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new AssignStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 54;
	            this.assignment();
	            break;

	        case 2:
	            localctx = new IfStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 55;
	            this.ifStatement();
	            break;

	        case 3:
	            localctx = new IterStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 56;
	            this.iterationStmt();
	            break;

	        case 4:
	            localctx = new FuncDefStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 4);
	            this.state = 57;
	            this.functionDef();
	            break;

	        case 5:
	            localctx = new ParallelExecStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 5);
	            this.state = 58;
	            this.parallelStmt();
	            break;

	        case 6:
	            localctx = new SpawnExecStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 6);
	            this.state = 59;
	            this.spawnStmt();
	            break;

	        case 7:
	            localctx = new FlowStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 7);
	            this.state = 60;
	            this.flowControl();
	            break;

	        case 8:
	            localctx = new ExprStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 8);
	            this.state = 61;
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
	        this.state = 64;
	        this.lvalue(0);
	        this.state = 65;
	        this.match(ProperTeeParser.T__0);
	        this.state = 66;
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
	        this.state = 72;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 44:
	            localctx = new VarLValueContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;

	            this.state = 69;
	            this.match(ProperTeeParser.ID);
	            break;
	        case 43:
	            localctx = new GlobalVarLValueContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 70;
	            this.match(ProperTeeParser.GLOBAL_PREFIX);
	            this.state = 71;
	            this.match(ProperTeeParser.ID);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	        this._ctx.stop = this._input.LT(-1);
	        this.state = 79;
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
	                this.state = 74;
	                if (!( this.precpred(this._ctx, 1))) {
	                    throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
	                }
	                this.state = 75;
	                this.match(ProperTeeParser.T__1);
	                this.state = 76;
	                this.access(); 
	            }
	            this.state = 81;
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
	        this.state = 85;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while((((_la) & ~0x1f) === 0 && ((1 << _la) & 3363873032) !== 0) || ((((_la - 32)) & ~0x1f) === 0 && ((1 << (_la - 32)) & 31439) !== 0)) {
	            this.state = 82;
	            this.statement();
	            this.state = 87;
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
	        this.state = 88;
	        this.match(ProperTeeParser.K_IF);
	        this.state = 89;
	        localctx.condition = this.expression(0);
	        this.state = 90;
	        this.match(ProperTeeParser.K_THEN);
	        this.state = 91;
	        localctx.thenBody = this.block();
	        this.state = 94;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===25) {
	            this.state = 92;
	            this.match(ProperTeeParser.K_ELSE);
	            this.state = 93;
	            localctx.elseBody = this.block();
	        }

	        this.state = 96;
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
	        this.state = 98;
	        this.match(ProperTeeParser.K_FUNCTION);
	        this.state = 99;
	        localctx.funcName = this.match(ProperTeeParser.ID);
	        this.state = 100;
	        this.match(ProperTeeParser.T__2);
	        this.state = 102;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===44) {
	            this.state = 101;
	            this.parameterList();
	        }

	        this.state = 104;
	        this.match(ProperTeeParser.T__3);
	        this.state = 105;
	        this.match(ProperTeeParser.K_DO);
	        this.state = 106;
	        this.block();
	        this.state = 107;
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
	        this.state = 109;
	        this.match(ProperTeeParser.ID);
	        this.state = 114;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===5) {
	            this.state = 110;
	            this.match(ProperTeeParser.T__4);
	            this.state = 111;
	            this.match(ProperTeeParser.ID);
	            this.state = 116;
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
	        this.state = 117;
	        this.match(ProperTeeParser.K_MULTI);
	        this.state = 119;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===44) {
	            this.state = 118;
	            localctx.resultVar = this.match(ProperTeeParser.ID);
	        }

	        this.state = 121;
	        this.match(ProperTeeParser.K_DO);
	        this.state = 122;
	        this.block();
	        this.state = 124;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===42) {
	            this.state = 123;
	            this.monitorClause();
	        }

	        this.state = 126;
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
	        this.state = 128;
	        this.match(ProperTeeParser.K_MONITOR);
	        this.state = 129;
	        this.match(ProperTeeParser.INTEGER);
	        this.state = 130;
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
	        this.state = 132;
	        this.match(ProperTeeParser.K_SPAWN);
	        this.state = 134;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===7 || ((((_la - 38)) & ~0x1f) === 0 && ((1 << (_la - 38)) & 451) !== 0)) {
	            this.state = 133;
	            this.spawnKey();
	        }

	        this.state = 136;
	        this.match(ProperTeeParser.T__5);
	        this.state = 137;
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



	spawnKey() {
	    let localctx = new SpawnKeyContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 22, ProperTeeParser.RULE_spawnKey);
	    var _la = 0;
	    try {
	        this.state = 150;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,11,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new SpawnIdKeyContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 139;
	            this.match(ProperTeeParser.ID);
	            break;

	        case 2:
	            localctx = new SpawnStringKeyContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 140;
	            this.match(ProperTeeParser.STRING);
	            break;

	        case 3:
	            localctx = new SpawnIntKeyContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 141;
	            this.match(ProperTeeParser.INTEGER);
	            break;

	        case 4:
	            localctx = new SpawnBoolKeyContext(this, localctx);
	            this.enterOuterAlt(localctx, 4);
	            this.state = 142;
	            _la = this._input.LA(1);
	            if(!(_la===38 || _la===39)) {
	            this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            break;

	        case 5:
	            localctx = new SpawnVarKeyContext(this, localctx);
	            this.enterOuterAlt(localctx, 5);
	            this.state = 143;
	            this.match(ProperTeeParser.T__6);
	            this.state = 144;
	            localctx.varKey = this.match(ProperTeeParser.ID);
	            break;

	        case 6:
	            localctx = new SpawnExprKeyContext(this, localctx);
	            this.enterOuterAlt(localctx, 6);
	            this.state = 145;
	            this.match(ProperTeeParser.T__6);
	            this.state = 146;
	            this.match(ProperTeeParser.T__2);
	            this.state = 147;
	            this.expression(0);
	            this.state = 148;
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



	iterationStmt() {
	    let localctx = new IterationStmtContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 24, ProperTeeParser.RULE_iterationStmt);
	    var _la = 0;
	    try {
	        this.state = 185;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,15,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new ConditionLoopContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 152;
	            this.match(ProperTeeParser.K_LOOP);
	            this.state = 153;
	            this.expression(0);
	            this.state = 155;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===40) {
	                this.state = 154;
	                this.match(ProperTeeParser.K_INFINITE);
	            }

	            this.state = 157;
	            this.match(ProperTeeParser.K_DO);
	            this.state = 158;
	            this.block();
	            this.state = 159;
	            this.match(ProperTeeParser.K_END);
	            break;

	        case 2:
	            localctx = new ValueLoopContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 161;
	            this.match(ProperTeeParser.K_LOOP);
	            this.state = 162;
	            localctx.value = this.match(ProperTeeParser.ID);
	            this.state = 163;
	            this.match(ProperTeeParser.K_IN);
	            this.state = 164;
	            this.expression(0);
	            this.state = 166;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===40) {
	                this.state = 165;
	                this.match(ProperTeeParser.K_INFINITE);
	            }

	            this.state = 168;
	            this.match(ProperTeeParser.K_DO);
	            this.state = 169;
	            this.block();
	            this.state = 170;
	            this.match(ProperTeeParser.K_END);
	            break;

	        case 3:
	            localctx = new KeyValueLoopContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 172;
	            this.match(ProperTeeParser.K_LOOP);
	            this.state = 173;
	            localctx.key = this.match(ProperTeeParser.ID);
	            this.state = 174;
	            this.match(ProperTeeParser.T__4);
	            this.state = 175;
	            localctx.value = this.match(ProperTeeParser.ID);
	            this.state = 176;
	            this.match(ProperTeeParser.K_IN);
	            this.state = 177;
	            this.expression(0);
	            this.state = 179;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===40) {
	                this.state = 178;
	                this.match(ProperTeeParser.K_INFINITE);
	            }

	            this.state = 181;
	            this.match(ProperTeeParser.K_DO);
	            this.state = 182;
	            this.block();
	            this.state = 183;
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
	    this.enterRule(localctx, 26, ProperTeeParser.RULE_flowControl);
	    try {
	        this.state = 193;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 30:
	            localctx = new BreakStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 187;
	            this.match(ProperTeeParser.K_BREAK);
	            break;
	        case 31:
	            localctx = new ContinueStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 188;
	            this.match(ProperTeeParser.K_CONTINUE);
	            break;
	        case 34:
	            localctx = new ReturnStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 189;
	            this.match(ProperTeeParser.K_RETURN);
	            this.state = 191;
	            this._errHandler.sync(this);
	            var la_ = this._interp.adaptivePredict(this._input,16,this._ctx);
	            if(la_===1) {
	                this.state = 190;
	                this.expression(0);

	            }
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
	    const _startState = 28;
	    this.enterRecursionRule(localctx, 28, ProperTeeParser.RULE_expression, _p);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 201;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 3:
	        case 13:
	        case 15:
	        case 38:
	        case 39:
	        case 43:
	        case 44:
	        case 45:
	        case 46:
	            localctx = new AtomExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;

	            this.state = 196;
	            this.atom();
	            break;
	        case 8:
	            localctx = new UnaryMinusExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 197;
	            this.match(ProperTeeParser.T__7);
	            this.state = 198;
	            this.expression(7);
	            break;
	        case 35:
	            localctx = new NotExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 199;
	            this.match(ProperTeeParser.K_NOT);
	            this.state = 200;
	            this.expression(6);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	        this._ctx.stop = this._input.LT(-1);
	        this.state = 224;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,20,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                if(this._parseListeners!==null) {
	                    this.triggerExitRuleEvent();
	                }
	                _prevctx = localctx;
	                this.state = 222;
	                this._errHandler.sync(this);
	                var la_ = this._interp.adaptivePredict(this._input,19,this._ctx);
	                switch(la_) {
	                case 1:
	                    localctx = new MultiplicativeExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 203;
	                    if (!( this.precpred(this._ctx, 5))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
	                    }
	                    this.state = 204;
	                    _la = this._input.LA(1);
	                    if(!((((_la) & ~0x1f) === 0 && ((1 << _la) & 3584) !== 0))) {
	                    this._errHandler.recoverInline(this);
	                    }
	                    else {
	                    	this._errHandler.reportMatch(this);
	                        this.consume();
	                    }
	                    this.state = 205;
	                    this.expression(6);
	                    break;

	                case 2:
	                    localctx = new AdditiveExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 206;
	                    if (!( this.precpred(this._ctx, 4))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
	                    }
	                    this.state = 207;
	                    _la = this._input.LA(1);
	                    if(!(_la===8 || _la===12)) {
	                    this._errHandler.recoverInline(this);
	                    }
	                    else {
	                    	this._errHandler.reportMatch(this);
	                        this.consume();
	                    }
	                    this.state = 208;
	                    this.expression(5);
	                    break;

	                case 3:
	                    localctx = new ComparisonExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 209;
	                    if (!( this.precpred(this._ctx, 3))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
	                    }
	                    this.state = 210;
	                    localctx.op = this.comparisonOp();
	                    this.state = 211;
	                    this.expression(4);
	                    break;

	                case 4:
	                    localctx = new AndExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 213;
	                    if (!( this.precpred(this._ctx, 2))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
	                    }
	                    this.state = 214;
	                    this.match(ProperTeeParser.K_AND);
	                    this.state = 215;
	                    this.expression(3);
	                    break;

	                case 5:
	                    localctx = new OrExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 216;
	                    if (!( this.precpred(this._ctx, 1))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
	                    }
	                    this.state = 217;
	                    this.match(ProperTeeParser.K_OR);
	                    this.state = 218;
	                    this.expression(2);
	                    break;

	                case 6:
	                    localctx = new MemberAccessExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 219;
	                    if (!( this.precpred(this._ctx, 8))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 8)");
	                    }
	                    this.state = 220;
	                    this.match(ProperTeeParser.T__1);
	                    this.state = 221;
	                    this.access();
	                    break;

	                } 
	            }
	            this.state = 226;
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
	    this.enterRule(localctx, 30, ProperTeeParser.RULE_access);
	    try {
	        this.state = 237;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,21,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new StaticAccessContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 227;
	            this.match(ProperTeeParser.ID);
	            break;

	        case 2:
	            localctx = new ArrayAccessContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 228;
	            this.match(ProperTeeParser.INTEGER);
	            break;

	        case 3:
	            localctx = new StringKeyAccessContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 229;
	            this.match(ProperTeeParser.STRING);
	            break;

	        case 4:
	            localctx = new VarEvalAccessContext(this, localctx);
	            this.enterOuterAlt(localctx, 4);
	            this.state = 230;
	            this.match(ProperTeeParser.T__6);
	            this.state = 231;
	            this.match(ProperTeeParser.ID);
	            break;

	        case 5:
	            localctx = new EvalAccessContext(this, localctx);
	            this.enterOuterAlt(localctx, 5);
	            this.state = 232;
	            this.match(ProperTeeParser.T__6);
	            this.state = 233;
	            this.match(ProperTeeParser.T__2);
	            this.state = 234;
	            this.expression(0);
	            this.state = 235;
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
	    this.enterRule(localctx, 32, ProperTeeParser.RULE_atom);
	    var _la = 0;
	    try {
	        this.state = 255;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,22,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new FuncAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 239;
	            this.functionCall();
	            break;

	        case 2:
	            localctx = new GlobalVarReferenceContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 240;
	            this.match(ProperTeeParser.GLOBAL_PREFIX);
	            this.state = 241;
	            this.match(ProperTeeParser.ID);
	            break;

	        case 3:
	            localctx = new VarReferenceContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 242;
	            this.match(ProperTeeParser.ID);
	            break;

	        case 4:
	            localctx = new DecimalAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 4);
	            this.state = 243;
	            this.match(ProperTeeParser.INTEGER);
	            this.state = 244;
	            this.match(ProperTeeParser.T__1);
	            this.state = 245;
	            this.match(ProperTeeParser.INTEGER);
	            break;

	        case 5:
	            localctx = new IntegerAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 5);
	            this.state = 246;
	            this.match(ProperTeeParser.INTEGER);
	            break;

	        case 6:
	            localctx = new StringAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 6);
	            this.state = 247;
	            this.match(ProperTeeParser.STRING);
	            break;

	        case 7:
	            localctx = new BooleanAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 7);
	            this.state = 248;
	            _la = this._input.LA(1);
	            if(!(_la===38 || _la===39)) {
	            this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            break;

	        case 8:
	            localctx = new ObjectAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 8);
	            this.state = 249;
	            this.objectLiteral();
	            break;

	        case 9:
	            localctx = new ArrayAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 9);
	            this.state = 250;
	            this.arrayLiteral();
	            break;

	        case 10:
	            localctx = new ParenAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 10);
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
	    this.enterRule(localctx, 34, ProperTeeParser.RULE_functionCall);
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
	        if((((_la) & ~0x1f) === 0 && ((1 << _la) & 41224) !== 0) || ((((_la - 35)) & ~0x1f) === 0 && ((1 << (_la - 35)) & 3865) !== 0)) {
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
	    this.enterRule(localctx, 36, ProperTeeParser.RULE_objectLiteral);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 271;
	        this.match(ProperTeeParser.T__12);
	        this.state = 280;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(((((_la - 44)) & ~0x1f) === 0 && ((1 << (_la - 44)) & 7) !== 0)) {
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
	    this.enterRule(localctx, 38, ProperTeeParser.RULE_objectEntry);
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
	    this.enterRule(localctx, 40, ProperTeeParser.RULE_objectKey);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 288;
	        _la = this._input.LA(1);
	        if(!(((((_la - 44)) & ~0x1f) === 0 && ((1 << (_la - 44)) & 7) !== 0))) {
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
	    this.enterRule(localctx, 42, ProperTeeParser.RULE_arrayLiteral);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 290;
	        this.match(ProperTeeParser.T__14);
	        this.state = 299;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if((((_la) & ~0x1f) === 0 && ((1 << _la) & 41224) !== 0) || ((((_la - 35)) & ~0x1f) === 0 && ((1 << (_la - 35)) & 3865) !== 0)) {
	            this.state = 291;
	            this.expression(0);
	            this.state = 296;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===5) {
	                this.state = 292;
	                this.match(ProperTeeParser.T__4);
	                this.state = 293;
	                this.expression(0);
	                this.state = 298;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	        }

	        this.state = 301;
	        this.match(ProperTeeParser.T__15);
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
	    this.enterRule(localctx, 44, ProperTeeParser.RULE_comparisonOp);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 303;
	        _la = this._input.LA(1);
	        if(!((((_la) & ~0x1f) === 0 && ((1 << _la) & 8257536) !== 0))) {
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
ProperTeeParser.K_IF = 23;
ProperTeeParser.K_THEN = 24;
ProperTeeParser.K_ELSE = 25;
ProperTeeParser.K_END = 26;
ProperTeeParser.K_LOOP = 27;
ProperTeeParser.K_IN = 28;
ProperTeeParser.K_DO = 29;
ProperTeeParser.K_BREAK = 30;
ProperTeeParser.K_CONTINUE = 31;
ProperTeeParser.K_FUNCTION = 32;
ProperTeeParser.K_SPAWN = 33;
ProperTeeParser.K_RETURN = 34;
ProperTeeParser.K_NOT = 35;
ProperTeeParser.K_AND = 36;
ProperTeeParser.K_OR = 37;
ProperTeeParser.K_TRUE = 38;
ProperTeeParser.K_FALSE = 39;
ProperTeeParser.K_INFINITE = 40;
ProperTeeParser.K_MULTI = 41;
ProperTeeParser.K_MONITOR = 42;
ProperTeeParser.GLOBAL_PREFIX = 43;
ProperTeeParser.ID = 44;
ProperTeeParser.INTEGER = 45;
ProperTeeParser.STRING = 46;
ProperTeeParser.COMMENT = 47;
ProperTeeParser.BLOCK_COMMENT = 48;
ProperTeeParser.WS = 49;

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
ProperTeeParser.RULE_spawnKey = 11;
ProperTeeParser.RULE_iterationStmt = 12;
ProperTeeParser.RULE_flowControl = 13;
ProperTeeParser.RULE_expression = 14;
ProperTeeParser.RULE_access = 15;
ProperTeeParser.RULE_atom = 16;
ProperTeeParser.RULE_functionCall = 17;
ProperTeeParser.RULE_objectLiteral = 18;
ProperTeeParser.RULE_objectEntry = 19;
ProperTeeParser.RULE_objectKey = 20;
ProperTeeParser.RULE_arrayLiteral = 21;
ProperTeeParser.RULE_comparisonOp = 22;

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
        this.elseBody = null;
    }

	K_IF() {
	    return this.getToken(ProperTeeParser.K_IF, 0);
	};

	K_THEN() {
	    return this.getToken(ProperTeeParser.K_THEN, 0);
	};

	K_END() {
	    return this.getToken(ProperTeeParser.K_END, 0);
	};

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
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

	spawnKey() {
	    return this.getTypedRuleContext(SpawnKeyContext,0);
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

class SpawnKeyContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_spawnKey;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class SpawnStringKeyContext extends SpawnKeyContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	STRING() {
	    return this.getToken(ProperTeeParser.STRING, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitSpawnStringKey(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.SpawnStringKeyContext = SpawnStringKeyContext;

class SpawnExprKeyContext extends SpawnKeyContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitSpawnExprKey(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.SpawnExprKeyContext = SpawnExprKeyContext;

class SpawnBoolKeyContext extends SpawnKeyContext {

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
	        return visitor.visitSpawnBoolKey(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.SpawnBoolKeyContext = SpawnBoolKeyContext;

class SpawnVarKeyContext extends SpawnKeyContext {

    constructor(parser, ctx) {
        super(parser);
        this.varKey = null;;
        super.copyFrom(ctx);
    }

	ID() {
	    return this.getToken(ProperTeeParser.ID, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitSpawnVarKey(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.SpawnVarKeyContext = SpawnVarKeyContext;

class SpawnIdKeyContext extends SpawnKeyContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	ID() {
	    return this.getToken(ProperTeeParser.ID, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitSpawnIdKey(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.SpawnIdKeyContext = SpawnIdKeyContext;

class SpawnIntKeyContext extends SpawnKeyContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	INTEGER() {
	    return this.getToken(ProperTeeParser.INTEGER, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitSpawnIntKey(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.SpawnIntKeyContext = SpawnIntKeyContext;

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

	ID() {
	    return this.getToken(ProperTeeParser.ID, 0);
	};

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
	        return visitor.visitArrayLiteral(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



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
ProperTeeParser.SpawnKeyContext = SpawnKeyContext; 
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
