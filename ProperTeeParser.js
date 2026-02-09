// Generated from ProperTee.g4 by ANTLR 4.13.2
// jshint ignore: start
import antlr4 from 'antlr4';
import ProperTeeVisitor from './ProperTeeVisitor.js';

const serializedATN = [4,1,50,305,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,
4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,
2,13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,
20,7,20,2,21,7,21,1,0,5,0,46,8,0,10,0,12,0,49,9,0,1,0,1,0,1,1,1,1,1,1,1,
1,1,1,1,1,1,1,1,1,3,1,61,8,1,1,2,1,2,1,2,1,2,1,3,1,3,1,3,1,3,3,3,71,8,3,
1,3,1,3,1,3,5,3,76,8,3,10,3,12,3,79,9,3,1,4,5,4,82,8,4,10,4,12,4,85,9,4,
1,5,1,5,1,5,1,5,1,5,1,5,3,5,93,8,5,1,5,1,5,1,6,1,6,1,6,1,6,3,6,101,8,6,1,
6,1,6,1,6,1,6,1,6,1,7,1,7,1,7,5,7,111,8,7,10,7,12,7,114,9,7,1,8,1,8,3,8,
118,8,8,1,8,1,8,1,8,3,8,123,8,8,1,8,1,8,1,9,1,9,1,9,1,9,1,10,1,10,3,10,133,
8,10,1,10,1,10,1,10,1,11,1,11,1,11,3,11,141,8,11,1,11,1,11,1,11,1,11,1,11,
1,11,1,11,1,11,1,11,3,11,152,8,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,
1,11,1,11,1,11,3,11,165,8,11,1,11,1,11,1,11,1,11,3,11,171,8,11,1,12,1,12,
1,12,1,12,3,12,177,8,12,3,12,179,8,12,1,13,1,13,1,13,1,13,1,13,1,13,3,13,
187,8,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,
1,13,1,13,1,13,1,13,1,13,1,13,5,13,208,8,13,10,13,12,13,211,9,13,1,14,1,
14,1,14,1,14,1,14,3,14,218,8,14,1,14,1,14,1,14,1,14,1,14,1,14,3,14,226,8,
14,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,
1,15,1,15,3,15,244,8,15,1,16,1,16,1,16,1,16,1,16,5,16,251,8,16,10,16,12,
16,254,9,16,3,16,256,8,16,1,16,1,16,1,17,1,17,1,17,1,17,5,17,264,8,17,10,
17,12,17,267,9,17,3,17,269,8,17,1,17,1,17,1,18,1,18,1,18,1,18,1,19,1,19,
1,20,1,20,1,20,1,20,1,20,1,20,3,20,285,8,20,1,20,1,20,1,20,1,20,1,20,1,20,
5,20,293,8,20,10,20,12,20,296,9,20,3,20,298,8,20,1,20,3,20,301,8,20,1,21,
1,21,1,21,0,2,6,26,22,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,
38,40,42,0,5,1,0,8,10,2,0,7,7,11,11,1,0,39,40,1,0,45,47,1,0,18,23,337,0,
47,1,0,0,0,2,60,1,0,0,0,4,62,1,0,0,0,6,70,1,0,0,0,8,83,1,0,0,0,10,86,1,0,
0,0,12,96,1,0,0,0,14,107,1,0,0,0,16,115,1,0,0,0,18,126,1,0,0,0,20,130,1,
0,0,0,22,170,1,0,0,0,24,178,1,0,0,0,26,186,1,0,0,0,28,225,1,0,0,0,30,243,
1,0,0,0,32,245,1,0,0,0,34,259,1,0,0,0,36,272,1,0,0,0,38,276,1,0,0,0,40,300,
1,0,0,0,42,302,1,0,0,0,44,46,3,2,1,0,45,44,1,0,0,0,46,49,1,0,0,0,47,45,1,
0,0,0,47,48,1,0,0,0,48,50,1,0,0,0,49,47,1,0,0,0,50,51,5,0,0,1,51,1,1,0,0,
0,52,61,3,4,2,0,53,61,3,10,5,0,54,61,3,22,11,0,55,61,3,12,6,0,56,61,3,16,
8,0,57,61,3,20,10,0,58,61,3,24,12,0,59,61,3,26,13,0,60,52,1,0,0,0,60,53,
1,0,0,0,60,54,1,0,0,0,60,55,1,0,0,0,60,56,1,0,0,0,60,57,1,0,0,0,60,58,1,
0,0,0,60,59,1,0,0,0,61,3,1,0,0,0,62,63,3,6,3,0,63,64,5,1,0,0,64,65,3,26,
13,0,65,5,1,0,0,0,66,67,6,3,-1,0,67,71,5,45,0,0,68,69,5,44,0,0,69,71,5,45,
0,0,70,66,1,0,0,0,70,68,1,0,0,0,71,77,1,0,0,0,72,73,10,1,0,0,73,74,5,2,0,
0,74,76,3,28,14,0,75,72,1,0,0,0,76,79,1,0,0,0,77,75,1,0,0,0,77,78,1,0,0,
0,78,7,1,0,0,0,79,77,1,0,0,0,80,82,3,2,1,0,81,80,1,0,0,0,82,85,1,0,0,0,83,
81,1,0,0,0,83,84,1,0,0,0,84,9,1,0,0,0,85,83,1,0,0,0,86,87,5,24,0,0,87,88,
3,26,13,0,88,89,5,25,0,0,89,92,3,8,4,0,90,91,5,26,0,0,91,93,3,8,4,0,92,90,
1,0,0,0,92,93,1,0,0,0,93,94,1,0,0,0,94,95,5,27,0,0,95,11,1,0,0,0,96,97,5,
33,0,0,97,98,5,45,0,0,98,100,5,3,0,0,99,101,3,14,7,0,100,99,1,0,0,0,100,
101,1,0,0,0,101,102,1,0,0,0,102,103,5,4,0,0,103,104,5,30,0,0,104,105,3,8,
4,0,105,106,5,27,0,0,106,13,1,0,0,0,107,112,5,45,0,0,108,109,5,5,0,0,109,
111,5,45,0,0,110,108,1,0,0,0,111,114,1,0,0,0,112,110,1,0,0,0,112,113,1,0,
0,0,113,15,1,0,0,0,114,112,1,0,0,0,115,117,5,42,0,0,116,118,5,45,0,0,117,
116,1,0,0,0,117,118,1,0,0,0,118,119,1,0,0,0,119,120,5,30,0,0,120,122,3,8,
4,0,121,123,3,18,9,0,122,121,1,0,0,0,122,123,1,0,0,0,123,124,1,0,0,0,124,
125,5,27,0,0,125,17,1,0,0,0,126,127,5,43,0,0,127,128,5,46,0,0,128,129,3,
8,4,0,129,19,1,0,0,0,130,132,5,34,0,0,131,133,3,28,14,0,132,131,1,0,0,0,
132,133,1,0,0,0,133,134,1,0,0,0,134,135,5,6,0,0,135,136,3,32,16,0,136,21,
1,0,0,0,137,138,5,28,0,0,138,140,3,26,13,0,139,141,5,41,0,0,140,139,1,0,
0,0,140,141,1,0,0,0,141,142,1,0,0,0,142,143,5,30,0,0,143,144,3,8,4,0,144,
145,5,27,0,0,145,171,1,0,0,0,146,147,5,28,0,0,147,148,5,45,0,0,148,149,5,
29,0,0,149,151,3,26,13,0,150,152,5,41,0,0,151,150,1,0,0,0,151,152,1,0,0,
0,152,153,1,0,0,0,153,154,5,30,0,0,154,155,3,8,4,0,155,156,5,27,0,0,156,
171,1,0,0,0,157,158,5,28,0,0,158,159,5,45,0,0,159,160,5,5,0,0,160,161,5,
45,0,0,161,162,5,29,0,0,162,164,3,26,13,0,163,165,5,41,0,0,164,163,1,0,0,
0,164,165,1,0,0,0,165,166,1,0,0,0,166,167,5,30,0,0,167,168,3,8,4,0,168,169,
5,27,0,0,169,171,1,0,0,0,170,137,1,0,0,0,170,146,1,0,0,0,170,157,1,0,0,0,
171,23,1,0,0,0,172,179,5,31,0,0,173,179,5,32,0,0,174,176,5,35,0,0,175,177,
3,26,13,0,176,175,1,0,0,0,176,177,1,0,0,0,177,179,1,0,0,0,178,172,1,0,0,
0,178,173,1,0,0,0,178,174,1,0,0,0,179,25,1,0,0,0,180,181,6,13,-1,0,181,187,
3,30,15,0,182,183,5,7,0,0,183,187,3,26,13,7,184,185,5,36,0,0,185,187,3,26,
13,6,186,180,1,0,0,0,186,182,1,0,0,0,186,184,1,0,0,0,187,209,1,0,0,0,188,
189,10,5,0,0,189,190,7,0,0,0,190,208,3,26,13,6,191,192,10,4,0,0,192,193,
7,1,0,0,193,208,3,26,13,5,194,195,10,3,0,0,195,196,3,42,21,0,196,197,3,26,
13,4,197,208,1,0,0,0,198,199,10,2,0,0,199,200,5,37,0,0,200,208,3,26,13,3,
201,202,10,1,0,0,202,203,5,38,0,0,203,208,3,26,13,2,204,205,10,8,0,0,205,
206,5,2,0,0,206,208,3,28,14,0,207,188,1,0,0,0,207,191,1,0,0,0,207,194,1,
0,0,0,207,198,1,0,0,0,207,201,1,0,0,0,207,204,1,0,0,0,208,211,1,0,0,0,209,
207,1,0,0,0,209,210,1,0,0,0,210,27,1,0,0,0,211,209,1,0,0,0,212,226,5,45,
0,0,213,226,5,46,0,0,214,226,5,47,0,0,215,217,5,12,0,0,216,218,5,44,0,0,
217,216,1,0,0,0,217,218,1,0,0,0,218,219,1,0,0,0,219,226,5,45,0,0,220,221,
5,12,0,0,221,222,5,3,0,0,222,223,3,26,13,0,223,224,5,4,0,0,224,226,1,0,0,
0,225,212,1,0,0,0,225,213,1,0,0,0,225,214,1,0,0,0,225,215,1,0,0,0,225,220,
1,0,0,0,226,29,1,0,0,0,227,244,3,32,16,0,228,229,5,44,0,0,229,244,5,45,0,
0,230,244,5,45,0,0,231,232,5,46,0,0,232,233,5,2,0,0,233,244,5,46,0,0,234,
244,5,46,0,0,235,244,5,47,0,0,236,244,7,2,0,0,237,244,3,34,17,0,238,244,
3,40,20,0,239,240,5,3,0,0,240,241,3,26,13,0,241,242,5,4,0,0,242,244,1,0,
0,0,243,227,1,0,0,0,243,228,1,0,0,0,243,230,1,0,0,0,243,231,1,0,0,0,243,
234,1,0,0,0,243,235,1,0,0,0,243,236,1,0,0,0,243,237,1,0,0,0,243,238,1,0,
0,0,243,239,1,0,0,0,244,31,1,0,0,0,245,246,5,45,0,0,246,255,5,3,0,0,247,
252,3,26,13,0,248,249,5,5,0,0,249,251,3,26,13,0,250,248,1,0,0,0,251,254,
1,0,0,0,252,250,1,0,0,0,252,253,1,0,0,0,253,256,1,0,0,0,254,252,1,0,0,0,
255,247,1,0,0,0,255,256,1,0,0,0,256,257,1,0,0,0,257,258,5,4,0,0,258,33,1,
0,0,0,259,268,5,13,0,0,260,265,3,36,18,0,261,262,5,5,0,0,262,264,3,36,18,
0,263,261,1,0,0,0,264,267,1,0,0,0,265,263,1,0,0,0,265,266,1,0,0,0,266,269,
1,0,0,0,267,265,1,0,0,0,268,260,1,0,0,0,268,269,1,0,0,0,269,270,1,0,0,0,
270,271,5,14,0,0,271,35,1,0,0,0,272,273,3,38,19,0,273,274,5,6,0,0,274,275,
3,26,13,0,275,37,1,0,0,0,276,277,7,3,0,0,277,39,1,0,0,0,278,279,5,15,0,0,
279,280,3,26,13,0,280,281,5,16,0,0,281,284,3,26,13,0,282,283,5,5,0,0,283,
285,3,26,13,0,284,282,1,0,0,0,284,285,1,0,0,0,285,286,1,0,0,0,286,287,5,
17,0,0,287,301,1,0,0,0,288,297,5,15,0,0,289,294,3,26,13,0,290,291,5,5,0,
0,291,293,3,26,13,0,292,290,1,0,0,0,293,296,1,0,0,0,294,292,1,0,0,0,294,
295,1,0,0,0,295,298,1,0,0,0,296,294,1,0,0,0,297,289,1,0,0,0,297,298,1,0,
0,0,298,299,1,0,0,0,299,301,5,17,0,0,300,278,1,0,0,0,300,288,1,0,0,0,301,
41,1,0,0,0,302,303,7,4,0,0,303,43,1,0,0,0,31,47,60,70,77,83,92,100,112,117,
122,132,140,151,164,170,176,178,186,207,209,217,225,243,252,255,265,268,
284,294,297,300];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.atn.PredictionContextCache();

export default class ProperTeeParser extends antlr4.Parser {

    static grammarFileName = "ProperTee.g4";
    static literalNames = [ null, "'='", "'.'", "'('", "')'", "','", "':'", 
                            "'-'", "'*'", "'/'", "'%'", "'+'", "'$'", "'{'", 
                            "'}'", "'['", "'~'", "']'", "'>'", "'<'", "'=='", 
                            "'>='", "'<='", "'!='", "'if'", "'then'", "'else'", 
                            "'end'", "'loop'", "'in'", "'do'", "'break'", 
                            "'continue'", "'function'", "'thread'", "'return'", 
                            "'not'", "'and'", "'or'", "'true'", "'false'", 
                            "'infinite'", "'multi'", "'monitor'", "'::'" ];
    static symbolicNames = [ null, null, null, null, null, null, null, null, 
                             null, null, null, null, null, null, null, null, 
                             null, null, null, null, null, null, null, null, 
                             "K_IF", "K_THEN", "K_ELSE", "K_END", "K_LOOP", 
                             "K_IN", "K_DO", "K_BREAK", "K_CONTINUE", "K_FUNCTION", 
                             "K_SPAWN", "K_RETURN", "K_NOT", "K_AND", "K_OR", 
                             "K_TRUE", "K_FALSE", "K_INFINITE", "K_MULTI", 
                             "K_MONITOR", "GLOBAL_PREFIX", "ID", "INTEGER", 
                             "STRING", "COMMENT", "BLOCK_COMMENT", "WS" ];
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
	        while((((_la) & ~0x1f) === 0 && ((1 << _la) & 2432737416) !== 0) || ((((_la - 32)) & ~0x1f) === 0 && ((1 << (_la - 32)) & 62879) !== 0)) {
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
	        case 45:
	            localctx = new VarLValueContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;

	            this.state = 67;
	            this.match(ProperTeeParser.ID);
	            break;
	        case 44:
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
	        while((((_la) & ~0x1f) === 0 && ((1 << _la) & 2432737416) !== 0) || ((((_la - 32)) & ~0x1f) === 0 && ((1 << (_la - 32)) & 62879) !== 0)) {
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
	        this.state = 92;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===26) {
	            this.state = 90;
	            this.match(ProperTeeParser.K_ELSE);
	            this.state = 91;
	            localctx.elseBody = this.block();
	        }

	        this.state = 94;
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
	        this.state = 96;
	        this.match(ProperTeeParser.K_FUNCTION);
	        this.state = 97;
	        localctx.funcName = this.match(ProperTeeParser.ID);
	        this.state = 98;
	        this.match(ProperTeeParser.T__2);
	        this.state = 100;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===45) {
	            this.state = 99;
	            this.parameterList();
	        }

	        this.state = 102;
	        this.match(ProperTeeParser.T__3);
	        this.state = 103;
	        this.match(ProperTeeParser.K_DO);
	        this.state = 104;
	        this.block();
	        this.state = 105;
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
	        this.state = 107;
	        this.match(ProperTeeParser.ID);
	        this.state = 112;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===5) {
	            this.state = 108;
	            this.match(ProperTeeParser.T__4);
	            this.state = 109;
	            this.match(ProperTeeParser.ID);
	            this.state = 114;
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
	        this.state = 115;
	        this.match(ProperTeeParser.K_MULTI);
	        this.state = 117;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===45) {
	            this.state = 116;
	            localctx.resultVar = this.match(ProperTeeParser.ID);
	        }

	        this.state = 119;
	        this.match(ProperTeeParser.K_DO);
	        this.state = 120;
	        this.block();
	        this.state = 122;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===43) {
	            this.state = 121;
	            this.monitorClause();
	        }

	        this.state = 124;
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
	        this.state = 126;
	        this.match(ProperTeeParser.K_MONITOR);
	        this.state = 127;
	        this.match(ProperTeeParser.INTEGER);
	        this.state = 128;
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
	        this.state = 130;
	        this.match(ProperTeeParser.K_SPAWN);
	        this.state = 132;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===12 || ((((_la - 45)) & ~0x1f) === 0 && ((1 << (_la - 45)) & 7) !== 0)) {
	            this.state = 131;
	            this.access();
	        }

	        this.state = 134;
	        this.match(ProperTeeParser.T__5);
	        this.state = 135;
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
	        this.state = 170;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,14,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new ConditionLoopContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 137;
	            this.match(ProperTeeParser.K_LOOP);
	            this.state = 138;
	            this.expression(0);
	            this.state = 140;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===41) {
	                this.state = 139;
	                this.match(ProperTeeParser.K_INFINITE);
	            }

	            this.state = 142;
	            this.match(ProperTeeParser.K_DO);
	            this.state = 143;
	            this.block();
	            this.state = 144;
	            this.match(ProperTeeParser.K_END);
	            break;

	        case 2:
	            localctx = new ValueLoopContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 146;
	            this.match(ProperTeeParser.K_LOOP);
	            this.state = 147;
	            localctx.value = this.match(ProperTeeParser.ID);
	            this.state = 148;
	            this.match(ProperTeeParser.K_IN);
	            this.state = 149;
	            this.expression(0);
	            this.state = 151;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===41) {
	                this.state = 150;
	                this.match(ProperTeeParser.K_INFINITE);
	            }

	            this.state = 153;
	            this.match(ProperTeeParser.K_DO);
	            this.state = 154;
	            this.block();
	            this.state = 155;
	            this.match(ProperTeeParser.K_END);
	            break;

	        case 3:
	            localctx = new KeyValueLoopContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 157;
	            this.match(ProperTeeParser.K_LOOP);
	            this.state = 158;
	            localctx.key = this.match(ProperTeeParser.ID);
	            this.state = 159;
	            this.match(ProperTeeParser.T__4);
	            this.state = 160;
	            localctx.value = this.match(ProperTeeParser.ID);
	            this.state = 161;
	            this.match(ProperTeeParser.K_IN);
	            this.state = 162;
	            this.expression(0);
	            this.state = 164;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===41) {
	                this.state = 163;
	                this.match(ProperTeeParser.K_INFINITE);
	            }

	            this.state = 166;
	            this.match(ProperTeeParser.K_DO);
	            this.state = 167;
	            this.block();
	            this.state = 168;
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
	        this.state = 178;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 31:
	            localctx = new BreakStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 172;
	            this.match(ProperTeeParser.K_BREAK);
	            break;
	        case 32:
	            localctx = new ContinueStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 173;
	            this.match(ProperTeeParser.K_CONTINUE);
	            break;
	        case 35:
	            localctx = new ReturnStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 174;
	            this.match(ProperTeeParser.K_RETURN);
	            this.state = 176;
	            this._errHandler.sync(this);
	            var la_ = this._interp.adaptivePredict(this._input,15,this._ctx);
	            if(la_===1) {
	                this.state = 175;
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
	    const _startState = 26;
	    this.enterRecursionRule(localctx, 26, ProperTeeParser.RULE_expression, _p);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 186;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 3:
	        case 13:
	        case 15:
	        case 39:
	        case 40:
	        case 44:
	        case 45:
	        case 46:
	        case 47:
	            localctx = new AtomExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;

	            this.state = 181;
	            this.atom();
	            break;
	        case 7:
	            localctx = new UnaryMinusExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 182;
	            this.match(ProperTeeParser.T__6);
	            this.state = 183;
	            this.expression(7);
	            break;
	        case 36:
	            localctx = new NotExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 184;
	            this.match(ProperTeeParser.K_NOT);
	            this.state = 185;
	            this.expression(6);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	        this._ctx.stop = this._input.LT(-1);
	        this.state = 209;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,19,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                if(this._parseListeners!==null) {
	                    this.triggerExitRuleEvent();
	                }
	                _prevctx = localctx;
	                this.state = 207;
	                this._errHandler.sync(this);
	                var la_ = this._interp.adaptivePredict(this._input,18,this._ctx);
	                switch(la_) {
	                case 1:
	                    localctx = new MultiplicativeExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 188;
	                    if (!( this.precpred(this._ctx, 5))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
	                    }
	                    this.state = 189;
	                    _la = this._input.LA(1);
	                    if(!((((_la) & ~0x1f) === 0 && ((1 << _la) & 1792) !== 0))) {
	                    this._errHandler.recoverInline(this);
	                    }
	                    else {
	                    	this._errHandler.reportMatch(this);
	                        this.consume();
	                    }
	                    this.state = 190;
	                    this.expression(6);
	                    break;

	                case 2:
	                    localctx = new AdditiveExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 191;
	                    if (!( this.precpred(this._ctx, 4))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
	                    }
	                    this.state = 192;
	                    _la = this._input.LA(1);
	                    if(!(_la===7 || _la===11)) {
	                    this._errHandler.recoverInline(this);
	                    }
	                    else {
	                    	this._errHandler.reportMatch(this);
	                        this.consume();
	                    }
	                    this.state = 193;
	                    this.expression(5);
	                    break;

	                case 3:
	                    localctx = new ComparisonExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 194;
	                    if (!( this.precpred(this._ctx, 3))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
	                    }
	                    this.state = 195;
	                    localctx.op = this.comparisonOp();
	                    this.state = 196;
	                    this.expression(4);
	                    break;

	                case 4:
	                    localctx = new AndExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 198;
	                    if (!( this.precpred(this._ctx, 2))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
	                    }
	                    this.state = 199;
	                    this.match(ProperTeeParser.K_AND);
	                    this.state = 200;
	                    this.expression(3);
	                    break;

	                case 5:
	                    localctx = new OrExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 201;
	                    if (!( this.precpred(this._ctx, 1))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
	                    }
	                    this.state = 202;
	                    this.match(ProperTeeParser.K_OR);
	                    this.state = 203;
	                    this.expression(2);
	                    break;

	                case 6:
	                    localctx = new MemberAccessExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 204;
	                    if (!( this.precpred(this._ctx, 8))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 8)");
	                    }
	                    this.state = 205;
	                    this.match(ProperTeeParser.T__1);
	                    this.state = 206;
	                    this.access();
	                    break;

	                } 
	            }
	            this.state = 211;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,19,this._ctx);
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
	        this.state = 225;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,21,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new StaticAccessContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 212;
	            this.match(ProperTeeParser.ID);
	            break;

	        case 2:
	            localctx = new ArrayAccessContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 213;
	            this.match(ProperTeeParser.INTEGER);
	            break;

	        case 3:
	            localctx = new StringKeyAccessContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 214;
	            this.match(ProperTeeParser.STRING);
	            break;

	        case 4:
	            localctx = new VarEvalAccessContext(this, localctx);
	            this.enterOuterAlt(localctx, 4);
	            this.state = 215;
	            this.match(ProperTeeParser.T__11);
	            this.state = 217;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===44) {
	                this.state = 216;
	                this.match(ProperTeeParser.GLOBAL_PREFIX);
	            }

	            this.state = 219;
	            this.match(ProperTeeParser.ID);
	            break;

	        case 5:
	            localctx = new EvalAccessContext(this, localctx);
	            this.enterOuterAlt(localctx, 5);
	            this.state = 220;
	            this.match(ProperTeeParser.T__11);
	            this.state = 221;
	            this.match(ProperTeeParser.T__2);
	            this.state = 222;
	            this.expression(0);
	            this.state = 223;
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
	        this.state = 243;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,22,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new FuncAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 227;
	            this.functionCall();
	            break;

	        case 2:
	            localctx = new GlobalVarReferenceContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 228;
	            this.match(ProperTeeParser.GLOBAL_PREFIX);
	            this.state = 229;
	            this.match(ProperTeeParser.ID);
	            break;

	        case 3:
	            localctx = new VarReferenceContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 230;
	            this.match(ProperTeeParser.ID);
	            break;

	        case 4:
	            localctx = new DecimalAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 4);
	            this.state = 231;
	            this.match(ProperTeeParser.INTEGER);
	            this.state = 232;
	            this.match(ProperTeeParser.T__1);
	            this.state = 233;
	            this.match(ProperTeeParser.INTEGER);
	            break;

	        case 5:
	            localctx = new IntegerAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 5);
	            this.state = 234;
	            this.match(ProperTeeParser.INTEGER);
	            break;

	        case 6:
	            localctx = new StringAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 6);
	            this.state = 235;
	            this.match(ProperTeeParser.STRING);
	            break;

	        case 7:
	            localctx = new BooleanAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 7);
	            this.state = 236;
	            _la = this._input.LA(1);
	            if(!(_la===39 || _la===40)) {
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
	            this.state = 237;
	            this.objectLiteral();
	            break;

	        case 9:
	            localctx = new ArrayAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 9);
	            this.state = 238;
	            this.arrayLiteral();
	            break;

	        case 10:
	            localctx = new ParenAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 10);
	            this.state = 239;
	            this.match(ProperTeeParser.T__2);
	            this.state = 240;
	            this.expression(0);
	            this.state = 241;
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
	        this.state = 245;
	        localctx.funcName = this.match(ProperTeeParser.ID);
	        this.state = 246;
	        this.match(ProperTeeParser.T__2);
	        this.state = 255;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if((((_la) & ~0x1f) === 0 && ((1 << _la) & 41096) !== 0) || ((((_la - 36)) & ~0x1f) === 0 && ((1 << (_la - 36)) & 3865) !== 0)) {
	            this.state = 247;
	            this.expression(0);
	            this.state = 252;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===5) {
	                this.state = 248;
	                this.match(ProperTeeParser.T__4);
	                this.state = 249;
	                this.expression(0);
	                this.state = 254;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	        }

	        this.state = 257;
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
	        this.state = 259;
	        this.match(ProperTeeParser.T__12);
	        this.state = 268;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(((((_la - 45)) & ~0x1f) === 0 && ((1 << (_la - 45)) & 7) !== 0)) {
	            this.state = 260;
	            this.objectEntry();
	            this.state = 265;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===5) {
	                this.state = 261;
	                this.match(ProperTeeParser.T__4);
	                this.state = 262;
	                this.objectEntry();
	                this.state = 267;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	        }

	        this.state = 270;
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
	        this.state = 272;
	        this.objectKey();
	        this.state = 273;
	        this.match(ProperTeeParser.T__5);
	        this.state = 274;
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
	        this.state = 276;
	        _la = this._input.LA(1);
	        if(!(((((_la - 45)) & ~0x1f) === 0 && ((1 << (_la - 45)) & 7) !== 0))) {
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
	        this.state = 300;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,30,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new RangeArrayContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 278;
	            this.match(ProperTeeParser.T__14);
	            this.state = 279;
	            localctx.rangeStart = this.expression(0);
	            this.state = 280;
	            this.match(ProperTeeParser.T__15);
	            this.state = 281;
	            localctx.rangeEnd = this.expression(0);
	            this.state = 284;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===5) {
	                this.state = 282;
	                this.match(ProperTeeParser.T__4);
	                this.state = 283;
	                localctx.rangeStep = this.expression(0);
	            }

	            this.state = 286;
	            this.match(ProperTeeParser.T__16);
	            break;

	        case 2:
	            localctx = new ListArrayContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 288;
	            this.match(ProperTeeParser.T__14);
	            this.state = 297;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if((((_la) & ~0x1f) === 0 && ((1 << _la) & 41096) !== 0) || ((((_la - 36)) & ~0x1f) === 0 && ((1 << (_la - 36)) & 3865) !== 0)) {
	                this.state = 289;
	                this.expression(0);
	                this.state = 294;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	                while(_la===5) {
	                    this.state = 290;
	                    this.match(ProperTeeParser.T__4);
	                    this.state = 291;
	                    this.expression(0);
	                    this.state = 296;
	                    this._errHandler.sync(this);
	                    _la = this._input.LA(1);
	                }
	            }

	            this.state = 299;
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
	        this.state = 302;
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
ProperTeeParser.K_ELSE = 26;
ProperTeeParser.K_END = 27;
ProperTeeParser.K_LOOP = 28;
ProperTeeParser.K_IN = 29;
ProperTeeParser.K_DO = 30;
ProperTeeParser.K_BREAK = 31;
ProperTeeParser.K_CONTINUE = 32;
ProperTeeParser.K_FUNCTION = 33;
ProperTeeParser.K_SPAWN = 34;
ProperTeeParser.K_RETURN = 35;
ProperTeeParser.K_NOT = 36;
ProperTeeParser.K_AND = 37;
ProperTeeParser.K_OR = 38;
ProperTeeParser.K_TRUE = 39;
ProperTeeParser.K_FALSE = 40;
ProperTeeParser.K_INFINITE = 41;
ProperTeeParser.K_MULTI = 42;
ProperTeeParser.K_MONITOR = 43;
ProperTeeParser.GLOBAL_PREFIX = 44;
ProperTeeParser.ID = 45;
ProperTeeParser.INTEGER = 46;
ProperTeeParser.STRING = 47;
ProperTeeParser.COMMENT = 48;
ProperTeeParser.BLOCK_COMMENT = 49;
ProperTeeParser.WS = 50;

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
