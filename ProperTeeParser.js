// Generated from ProperTee.g4 by ANTLR 4.13.2
// jshint ignore: start
import antlr4 from 'antlr4';
import ProperTeeVisitor from './ProperTeeVisitor.js';

const serializedATN = [4,1,56,352,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,
4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,
2,13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,
20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,1,0,5,0,50,8,0,10,0,12,0,53,9,0,1,
0,5,0,56,8,0,10,0,12,0,59,9,0,1,0,1,0,1,1,1,1,1,1,1,1,3,1,67,8,1,1,1,1,1,
1,1,1,2,1,2,1,2,5,2,75,8,2,10,2,12,2,78,9,2,1,3,1,3,1,3,1,3,1,3,1,3,1,3,
1,3,3,3,88,8,3,1,4,1,4,1,4,1,4,1,5,1,5,1,5,1,5,3,5,98,8,5,1,5,1,5,1,5,5,
5,103,8,5,10,5,12,5,106,9,5,1,6,5,6,109,8,6,10,6,12,6,112,9,6,1,7,1,7,1,
7,1,7,1,7,1,7,1,7,1,7,1,7,5,7,123,8,7,10,7,12,7,126,9,7,1,7,1,7,3,7,130,
8,7,1,7,1,7,1,8,1,8,1,8,1,8,3,8,138,8,8,1,8,1,8,1,8,1,8,1,8,1,9,1,9,1,9,
5,9,148,8,9,10,9,12,9,151,9,9,1,10,1,10,3,10,155,8,10,1,10,1,10,3,10,159,
8,10,1,10,1,10,1,10,3,10,164,8,10,1,10,1,10,1,11,1,11,1,11,1,11,1,12,1,12,
3,12,174,8,12,1,12,1,12,1,12,1,13,1,13,1,13,3,13,182,8,13,1,13,1,13,1,13,
1,13,1,13,1,13,1,13,1,13,1,13,3,13,193,8,13,1,13,1,13,1,13,1,13,1,13,1,13,
1,13,1,13,1,13,1,13,1,13,3,13,206,8,13,1,13,1,13,1,13,1,13,3,13,212,8,13,
1,14,1,14,1,14,1,14,3,14,218,8,14,1,14,3,14,221,8,14,1,15,1,15,1,15,1,15,
1,15,1,15,3,15,229,8,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,
1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,5,15,250,8,15,10,15,12,15,253,
9,15,1,16,1,16,1,16,1,16,1,16,3,16,260,8,16,1,16,1,16,1,16,1,16,1,16,1,16,
3,16,268,8,16,1,17,1,17,1,17,1,17,1,17,1,17,1,17,1,17,1,17,1,17,1,17,1,17,
1,17,1,17,1,17,1,17,1,17,3,17,287,8,17,1,18,1,18,3,18,291,8,18,1,18,1,18,
1,18,1,18,1,18,5,18,298,8,18,10,18,12,18,301,9,18,3,18,303,8,18,1,18,1,18,
1,19,1,19,1,19,1,19,5,19,311,8,19,10,19,12,19,314,9,19,3,19,316,8,19,1,19,
1,19,1,20,1,20,1,20,1,20,1,21,1,21,1,22,1,22,1,22,1,22,1,22,1,22,3,22,332,
8,22,1,22,1,22,1,22,1,22,1,22,1,22,5,22,340,8,22,10,22,12,22,343,9,22,3,
22,345,8,22,1,22,3,22,348,8,22,1,23,1,23,1,23,0,2,10,30,24,0,2,4,6,8,10,
12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,0,5,1,0,8,10,2,0,7,
7,11,11,1,0,40,41,1,0,52,53,1,0,18,23,390,0,51,1,0,0,0,2,62,1,0,0,0,4,71,
1,0,0,0,6,87,1,0,0,0,8,89,1,0,0,0,10,97,1,0,0,0,12,110,1,0,0,0,14,113,1,
0,0,0,16,133,1,0,0,0,18,144,1,0,0,0,20,152,1,0,0,0,22,167,1,0,0,0,24,171,
1,0,0,0,26,211,1,0,0,0,28,220,1,0,0,0,30,228,1,0,0,0,32,267,1,0,0,0,34,286,
1,0,0,0,36,290,1,0,0,0,38,306,1,0,0,0,40,319,1,0,0,0,42,323,1,0,0,0,44,347,
1,0,0,0,46,349,1,0,0,0,48,50,3,2,1,0,49,48,1,0,0,0,50,53,1,0,0,0,51,49,1,
0,0,0,51,52,1,0,0,0,52,57,1,0,0,0,53,51,1,0,0,0,54,56,3,6,3,0,55,54,1,0,
0,0,56,59,1,0,0,0,57,55,1,0,0,0,57,58,1,0,0,0,58,60,1,0,0,0,59,57,1,0,0,
0,60,61,5,0,0,1,61,1,1,0,0,0,62,63,5,48,0,0,63,66,3,4,2,0,64,65,5,1,0,0,
65,67,5,52,0,0,66,64,1,0,0,0,66,67,1,0,0,0,67,68,1,0,0,0,68,69,5,49,0,0,
69,70,5,51,0,0,70,3,1,0,0,0,71,76,5,51,0,0,72,73,5,1,0,0,73,75,5,51,0,0,
74,72,1,0,0,0,75,78,1,0,0,0,76,74,1,0,0,0,76,77,1,0,0,0,77,5,1,0,0,0,78,
76,1,0,0,0,79,88,3,8,4,0,80,88,3,14,7,0,81,88,3,26,13,0,82,88,3,16,8,0,83,
88,3,20,10,0,84,88,3,24,12,0,85,88,3,28,14,0,86,88,3,30,15,0,87,79,1,0,0,
0,87,80,1,0,0,0,87,81,1,0,0,0,87,82,1,0,0,0,87,83,1,0,0,0,87,84,1,0,0,0,
87,85,1,0,0,0,87,86,1,0,0,0,88,7,1,0,0,0,89,90,3,10,5,0,90,91,5,2,0,0,91,
92,3,30,15,0,92,9,1,0,0,0,93,94,6,5,-1,0,94,98,5,51,0,0,95,96,5,50,0,0,96,
98,5,51,0,0,97,93,1,0,0,0,97,95,1,0,0,0,98,104,1,0,0,0,99,100,10,1,0,0,100,
101,5,1,0,0,101,103,3,32,16,0,102,99,1,0,0,0,103,106,1,0,0,0,104,102,1,0,
0,0,104,105,1,0,0,0,105,11,1,0,0,0,106,104,1,0,0,0,107,109,3,6,3,0,108,107,
1,0,0,0,109,112,1,0,0,0,110,108,1,0,0,0,110,111,1,0,0,0,111,13,1,0,0,0,112,
110,1,0,0,0,113,114,5,24,0,0,114,115,3,30,15,0,115,116,5,25,0,0,116,124,
3,12,6,0,117,118,5,26,0,0,118,119,3,30,15,0,119,120,5,25,0,0,120,121,3,12,
6,0,121,123,1,0,0,0,122,117,1,0,0,0,123,126,1,0,0,0,124,122,1,0,0,0,124,
125,1,0,0,0,125,129,1,0,0,0,126,124,1,0,0,0,127,128,5,27,0,0,128,130,3,12,
6,0,129,127,1,0,0,0,129,130,1,0,0,0,130,131,1,0,0,0,131,132,5,28,0,0,132,
15,1,0,0,0,133,134,5,34,0,0,134,135,5,51,0,0,135,137,5,3,0,0,136,138,3,18,
9,0,137,136,1,0,0,0,137,138,1,0,0,0,138,139,1,0,0,0,139,140,5,4,0,0,140,
141,5,31,0,0,141,142,3,12,6,0,142,143,5,28,0,0,143,17,1,0,0,0,144,149,5,
51,0,0,145,146,5,5,0,0,146,148,5,51,0,0,147,145,1,0,0,0,148,151,1,0,0,0,
149,147,1,0,0,0,149,150,1,0,0,0,150,19,1,0,0,0,151,149,1,0,0,0,152,154,5,
45,0,0,153,155,5,51,0,0,154,153,1,0,0,0,154,155,1,0,0,0,155,158,1,0,0,0,
156,157,5,44,0,0,157,159,3,30,15,0,158,156,1,0,0,0,158,159,1,0,0,0,159,160,
1,0,0,0,160,161,5,31,0,0,161,163,3,12,6,0,162,164,3,22,11,0,163,162,1,0,
0,0,163,164,1,0,0,0,164,165,1,0,0,0,165,166,5,28,0,0,166,21,1,0,0,0,167,
168,5,46,0,0,168,169,5,52,0,0,169,170,3,12,6,0,170,23,1,0,0,0,171,173,5,
35,0,0,172,174,3,32,16,0,173,172,1,0,0,0,173,174,1,0,0,0,174,175,1,0,0,0,
175,176,5,6,0,0,176,177,3,36,18,0,177,25,1,0,0,0,178,179,5,29,0,0,179,181,
3,30,15,0,180,182,5,43,0,0,181,180,1,0,0,0,181,182,1,0,0,0,182,183,1,0,0,
0,183,184,5,31,0,0,184,185,3,12,6,0,185,186,5,28,0,0,186,212,1,0,0,0,187,
188,5,29,0,0,188,189,5,51,0,0,189,190,5,30,0,0,190,192,3,30,15,0,191,193,
5,43,0,0,192,191,1,0,0,0,192,193,1,0,0,0,193,194,1,0,0,0,194,195,5,31,0,
0,195,196,3,12,6,0,196,197,5,28,0,0,197,212,1,0,0,0,198,199,5,29,0,0,199,
200,5,51,0,0,200,201,5,5,0,0,201,202,5,51,0,0,202,203,5,30,0,0,203,205,3,
30,15,0,204,206,5,43,0,0,205,204,1,0,0,0,205,206,1,0,0,0,206,207,1,0,0,0,
207,208,5,31,0,0,208,209,3,12,6,0,209,210,5,28,0,0,210,212,1,0,0,0,211,178,
1,0,0,0,211,187,1,0,0,0,211,198,1,0,0,0,212,27,1,0,0,0,213,221,5,32,0,0,
214,221,5,33,0,0,215,217,5,36,0,0,216,218,3,30,15,0,217,216,1,0,0,0,217,
218,1,0,0,0,218,221,1,0,0,0,219,221,5,47,0,0,220,213,1,0,0,0,220,214,1,0,
0,0,220,215,1,0,0,0,220,219,1,0,0,0,221,29,1,0,0,0,222,223,6,15,-1,0,223,
229,3,34,17,0,224,225,5,7,0,0,225,229,3,30,15,7,226,227,5,37,0,0,227,229,
3,30,15,6,228,222,1,0,0,0,228,224,1,0,0,0,228,226,1,0,0,0,229,251,1,0,0,
0,230,231,10,5,0,0,231,232,7,0,0,0,232,250,3,30,15,6,233,234,10,4,0,0,234,
235,7,1,0,0,235,250,3,30,15,5,236,237,10,3,0,0,237,238,3,46,23,0,238,239,
3,30,15,4,239,250,1,0,0,0,240,241,10,2,0,0,241,242,5,38,0,0,242,250,3,30,
15,3,243,244,10,1,0,0,244,245,5,39,0,0,245,250,3,30,15,2,246,247,10,8,0,
0,247,248,5,1,0,0,248,250,3,32,16,0,249,230,1,0,0,0,249,233,1,0,0,0,249,
236,1,0,0,0,249,240,1,0,0,0,249,243,1,0,0,0,249,246,1,0,0,0,250,253,1,0,
0,0,251,249,1,0,0,0,251,252,1,0,0,0,252,31,1,0,0,0,253,251,1,0,0,0,254,268,
5,51,0,0,255,268,5,52,0,0,256,268,5,53,0,0,257,259,5,12,0,0,258,260,5,50,
0,0,259,258,1,0,0,0,259,260,1,0,0,0,260,261,1,0,0,0,261,268,5,51,0,0,262,
263,5,12,0,0,263,264,5,3,0,0,264,265,3,30,15,0,265,266,5,4,0,0,266,268,1,
0,0,0,267,254,1,0,0,0,267,255,1,0,0,0,267,256,1,0,0,0,267,257,1,0,0,0,267,
262,1,0,0,0,268,33,1,0,0,0,269,287,3,36,18,0,270,271,5,50,0,0,271,287,5,
51,0,0,272,287,5,51,0,0,273,274,5,52,0,0,274,275,5,1,0,0,275,287,5,52,0,
0,276,287,5,52,0,0,277,287,5,53,0,0,278,287,7,2,0,0,279,287,5,42,0,0,280,
287,3,38,19,0,281,287,3,44,22,0,282,283,5,3,0,0,283,284,3,30,15,0,284,285,
5,4,0,0,285,287,1,0,0,0,286,269,1,0,0,0,286,270,1,0,0,0,286,272,1,0,0,0,
286,273,1,0,0,0,286,276,1,0,0,0,286,277,1,0,0,0,286,278,1,0,0,0,286,279,
1,0,0,0,286,280,1,0,0,0,286,281,1,0,0,0,286,282,1,0,0,0,287,35,1,0,0,0,288,
289,5,51,0,0,289,291,5,50,0,0,290,288,1,0,0,0,290,291,1,0,0,0,291,292,1,
0,0,0,292,293,5,51,0,0,293,302,5,3,0,0,294,299,3,30,15,0,295,296,5,5,0,0,
296,298,3,30,15,0,297,295,1,0,0,0,298,301,1,0,0,0,299,297,1,0,0,0,299,300,
1,0,0,0,300,303,1,0,0,0,301,299,1,0,0,0,302,294,1,0,0,0,302,303,1,0,0,0,
303,304,1,0,0,0,304,305,5,4,0,0,305,37,1,0,0,0,306,315,5,13,0,0,307,312,
3,40,20,0,308,309,5,5,0,0,309,311,3,40,20,0,310,308,1,0,0,0,311,314,1,0,
0,0,312,310,1,0,0,0,312,313,1,0,0,0,313,316,1,0,0,0,314,312,1,0,0,0,315,
307,1,0,0,0,315,316,1,0,0,0,316,317,1,0,0,0,317,318,5,14,0,0,318,39,1,0,
0,0,319,320,3,42,21,0,320,321,5,6,0,0,321,322,3,30,15,0,322,41,1,0,0,0,323,
324,7,3,0,0,324,43,1,0,0,0,325,326,5,15,0,0,326,327,3,30,15,0,327,328,5,
16,0,0,328,331,3,30,15,0,329,330,5,5,0,0,330,332,3,30,15,0,331,329,1,0,0,
0,331,332,1,0,0,0,332,333,1,0,0,0,333,334,5,17,0,0,334,348,1,0,0,0,335,344,
5,15,0,0,336,341,3,30,15,0,337,338,5,5,0,0,338,340,3,30,15,0,339,337,1,0,
0,0,340,343,1,0,0,0,341,339,1,0,0,0,341,342,1,0,0,0,342,345,1,0,0,0,343,
341,1,0,0,0,344,336,1,0,0,0,344,345,1,0,0,0,345,346,1,0,0,0,346,348,5,17,
0,0,347,325,1,0,0,0,347,335,1,0,0,0,348,45,1,0,0,0,349,350,7,4,0,0,350,47,
1,0,0,0,37,51,57,66,76,87,97,104,110,124,129,137,149,154,158,163,173,181,
192,205,211,217,220,228,249,251,259,267,286,290,299,302,312,315,331,341,
344,347];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.atn.PredictionContextCache();

export default class ProperTeeParser extends antlr4.Parser {

    static grammarFileName = "ProperTee.g4";
    static literalNames = [ null, "'.'", "'='", "'('", "')'", "','", "':'",
                            "'-'", "'*'", "'/'", "'%'", "'+'", "'$'", "'{'",
                            "'}'", "'['", "'..'", "']'", "'>'", "'<'", "'=='",
                            "'>='", "'<='", "'!='", "'if'", "'then'", "'elseif'",
                            "'else'", "'end'", "'loop'", "'in'", "'do'",
                            "'break'", "'continue'", "'function'", "'thread'",
                            "'return'", "'not'", "'and'", "'or'", "'true'",
                            "'false'", "'null'", "'infinite'", "'limit'",
                            "'multi'", "'monitor'", "'debug'", "'import'",
                            "'as'", "'::'" ];
    static symbolicNames = [ null, null, null, null, null, null, null, null,
                             null, null, null, null, null, null, null, null,
                             null, null, null, null, null, null, null, null,
                             "K_IF", "K_THEN", "K_ELSEIF", "K_ELSE", "K_END",
                             "K_LOOP", "K_IN", "K_DO", "K_BREAK", "K_CONTINUE",
                             "K_FUNCTION", "K_SPAWN", "K_RETURN", "K_NOT",
                             "K_AND", "K_OR", "K_TRUE", "K_FALSE", "K_NULL",
                             "K_INFINITE", "K_LIMIT", "K_MULTI", "K_MONITOR",
                             "K_DEBUG", "K_IMPORT", "K_AS", "GLOBAL_PREFIX",
                             "ID", "INTEGER", "STRING", "COMMENT", "BLOCK_COMMENT",
                             "WS" ];
    static ruleNames = [ "root", "importStmt", "modulePath", "statement",
                         "assignment", "lvalue", "block", "ifStatement",
                         "functionDef", "parameterList", "parallelStmt",
                         "monitorClause", "spawnStmt", "iterationStmt",
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
        case 5:
                    return this.lvalue_sempred(localctx, predIndex);
        case 15:
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
            this.state = 51;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            while(_la===48) {
                this.state = 48;
                this.importStmt();
                this.state = 53;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            }
            this.state = 57;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            while((((_la) & ~0x1f) === 0 && ((1 << _la) & 553689224) !== 0) || ((((_la - 32)) & ~0x1f) === 0 && ((1 << (_la - 32)) & 3974975) !== 0)) {
                this.state = 54;
                this.statement();
                this.state = 59;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            }
            this.state = 60;
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



    importStmt() {
        let localctx = new ImportStmtContext(this, this._ctx, this.state);
        this.enterRule(localctx, 2, ProperTeeParser.RULE_importStmt);
        var _la = 0;
        try {
            this.enterOuterAlt(localctx, 1);
            this.state = 62;
            this.match(ProperTeeParser.K_IMPORT);
            this.state = 63;
            this.modulePath();
            this.state = 66;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if(_la===1) {
                this.state = 64;
                this.match(ProperTeeParser.T__0);
                this.state = 65;
                localctx.version = this.match(ProperTeeParser.INTEGER);
            }

            this.state = 68;
            this.match(ProperTeeParser.K_AS);
            this.state = 69;
            localctx.alias = this.match(ProperTeeParser.ID);
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



    modulePath() {
        let localctx = new ModulePathContext(this, this._ctx, this.state);
        this.enterRule(localctx, 4, ProperTeeParser.RULE_modulePath);
        try {
            this.enterOuterAlt(localctx, 1);
            this.state = 71;
            this.match(ProperTeeParser.ID);
            this.state = 76;
            this._errHandler.sync(this);
            var _alt = this._interp.adaptivePredict(this._input,3,this._ctx)
            while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
                if(_alt===1) {
                    this.state = 72;
                    this.match(ProperTeeParser.T__0);
                    this.state = 73;
                    this.match(ProperTeeParser.ID);
                }
                this.state = 78;
                this._errHandler.sync(this);
                _alt = this._interp.adaptivePredict(this._input,3,this._ctx);
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



    statement() {
        let localctx = new StatementContext(this, this._ctx, this.state);
        this.enterRule(localctx, 6, ProperTeeParser.RULE_statement);
        try {
            this.state = 87;
            this._errHandler.sync(this);
            var la_ = this._interp.adaptivePredict(this._input,4,this._ctx);
            switch(la_) {
            case 1:
                localctx = new AssignStmtContext(this, localctx);
                this.enterOuterAlt(localctx, 1);
                this.state = 79;
                this.assignment();
                break;

            case 2:
                localctx = new IfStmtContext(this, localctx);
                this.enterOuterAlt(localctx, 2);
                this.state = 80;
                this.ifStatement();
                break;

            case 3:
                localctx = new IterStmtContext(this, localctx);
                this.enterOuterAlt(localctx, 3);
                this.state = 81;
                this.iterationStmt();
                break;

            case 4:
                localctx = new FuncDefStmtContext(this, localctx);
                this.enterOuterAlt(localctx, 4);
                this.state = 82;
                this.functionDef();
                break;

            case 5:
                localctx = new ParallelExecStmtContext(this, localctx);
                this.enterOuterAlt(localctx, 5);
                this.state = 83;
                this.parallelStmt();
                break;

            case 6:
                localctx = new SpawnExecStmtContext(this, localctx);
                this.enterOuterAlt(localctx, 6);
                this.state = 84;
                this.spawnStmt();
                break;

            case 7:
                localctx = new FlowStmtContext(this, localctx);
                this.enterOuterAlt(localctx, 7);
                this.state = 85;
                this.flowControl();
                break;

            case 8:
                localctx = new ExprStmtContext(this, localctx);
                this.enterOuterAlt(localctx, 8);
                this.state = 86;
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
        this.enterRule(localctx, 8, ProperTeeParser.RULE_assignment);
        try {
            this.enterOuterAlt(localctx, 1);
            this.state = 89;
            this.lvalue(0);
            this.state = 90;
            this.match(ProperTeeParser.T__1);
            this.state = 91;
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
        const _startState = 10;
        this.enterRecursionRule(localctx, 10, ProperTeeParser.RULE_lvalue, _p);
        try {
            this.enterOuterAlt(localctx, 1);
            this.state = 97;
            this._errHandler.sync(this);
            switch(this._input.LA(1)) {
            case 51:
                localctx = new VarLValueContext(this, localctx);
                this._ctx = localctx;
                _prevctx = localctx;

                this.state = 94;
                this.match(ProperTeeParser.ID);
                break;
            case 50:
                localctx = new GlobalVarLValueContext(this, localctx);
                this._ctx = localctx;
                _prevctx = localctx;
                this.state = 95;
                this.match(ProperTeeParser.GLOBAL_PREFIX);
                this.state = 96;
                this.match(ProperTeeParser.ID);
                break;
            default:
                throw new antlr4.error.NoViableAltException(this);
            }
            this._ctx.stop = this._input.LT(-1);
            this.state = 104;
            this._errHandler.sync(this);
            var _alt = this._interp.adaptivePredict(this._input,6,this._ctx)
            while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
                if(_alt===1) {
                    if(this._parseListeners!==null) {
                        this.triggerExitRuleEvent();
                    }
                    _prevctx = localctx;
                    localctx = new PropLValueContext(this, new LvalueContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_lvalue);
                    this.state = 99;
                    if (!( this.precpred(this._ctx, 1))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
                    }
                    this.state = 100;
                    this.match(ProperTeeParser.T__0);
                    this.state = 101;
                    this.access();
                }
                this.state = 106;
                this._errHandler.sync(this);
                _alt = this._interp.adaptivePredict(this._input,6,this._ctx);
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
        this.enterRule(localctx, 12, ProperTeeParser.RULE_block);
        var _la = 0;
        try {
            this.enterOuterAlt(localctx, 1);
            this.state = 110;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            while((((_la) & ~0x1f) === 0 && ((1 << _la) & 553689224) !== 0) || ((((_la - 32)) & ~0x1f) === 0 && ((1 << (_la - 32)) & 3974975) !== 0)) {
                this.state = 107;
                this.statement();
                this.state = 112;
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
        this.enterRule(localctx, 14, ProperTeeParser.RULE_ifStatement);
        var _la = 0;
        try {
            this.enterOuterAlt(localctx, 1);
            this.state = 113;
            this.match(ProperTeeParser.K_IF);
            this.state = 114;
            localctx.condition = this.expression(0);
            this.state = 115;
            this.match(ProperTeeParser.K_THEN);
            this.state = 116;
            localctx.thenBody = this.block();
            this.state = 124;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            while(_la===26) {
                this.state = 117;
                this.match(ProperTeeParser.K_ELSEIF);
                this.state = 118;
                localctx._expression = this.expression(0);
                localctx.elseifConds.push(localctx._expression);
                this.state = 119;
                this.match(ProperTeeParser.K_THEN);
                this.state = 120;
                localctx._block = this.block();
                localctx.elseifBodies.push(localctx._block);
                this.state = 126;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            }
            this.state = 129;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if(_la===27) {
                this.state = 127;
                this.match(ProperTeeParser.K_ELSE);
                this.state = 128;
                localctx.elseBody = this.block();
            }

            this.state = 131;
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
        this.enterRule(localctx, 16, ProperTeeParser.RULE_functionDef);
        var _la = 0;
        try {
            this.enterOuterAlt(localctx, 1);
            this.state = 133;
            this.match(ProperTeeParser.K_FUNCTION);
            this.state = 134;
            localctx.funcName = this.match(ProperTeeParser.ID);
            this.state = 135;
            this.match(ProperTeeParser.T__2);
            this.state = 137;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if(_la===51) {
                this.state = 136;
                this.parameterList();
            }

            this.state = 139;
            this.match(ProperTeeParser.T__3);
            this.state = 140;
            this.match(ProperTeeParser.K_DO);
            this.state = 141;
            this.block();
            this.state = 142;
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
        this.enterRule(localctx, 18, ProperTeeParser.RULE_parameterList);
        var _la = 0;
        try {
            this.enterOuterAlt(localctx, 1);
            this.state = 144;
            this.match(ProperTeeParser.ID);
            this.state = 149;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            while(_la===5) {
                this.state = 145;
                this.match(ProperTeeParser.T__4);
                this.state = 146;
                this.match(ProperTeeParser.ID);
                this.state = 151;
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
        this.enterRule(localctx, 20, ProperTeeParser.RULE_parallelStmt);
        var _la = 0;
        try {
            this.enterOuterAlt(localctx, 1);
            this.state = 152;
            this.match(ProperTeeParser.K_MULTI);
            this.state = 154;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if(_la===51) {
                this.state = 153;
                localctx.resultVar = this.match(ProperTeeParser.ID);
            }

            this.state = 158;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if(_la===44) {
                this.state = 156;
                this.match(ProperTeeParser.K_LIMIT);
                this.state = 157;
                localctx.limitExpr = this.expression(0);
            }

            this.state = 160;
            this.match(ProperTeeParser.K_DO);
            this.state = 161;
            this.block();
            this.state = 163;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if(_la===46) {
                this.state = 162;
                this.monitorClause();
            }

            this.state = 165;
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
        this.enterRule(localctx, 22, ProperTeeParser.RULE_monitorClause);
        try {
            this.enterOuterAlt(localctx, 1);
            this.state = 167;
            this.match(ProperTeeParser.K_MONITOR);
            this.state = 168;
            this.match(ProperTeeParser.INTEGER);
            this.state = 169;
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
        this.enterRule(localctx, 24, ProperTeeParser.RULE_spawnStmt);
        var _la = 0;
        try {
            localctx = new SpawnKeyStmtContext(this, localctx);
            this.enterOuterAlt(localctx, 1);
            this.state = 171;
            this.match(ProperTeeParser.K_SPAWN);
            this.state = 173;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if(_la===12 || ((((_la - 51)) & ~0x1f) === 0 && ((1 << (_la - 51)) & 7) !== 0)) {
                this.state = 172;
                this.access();
            }

            this.state = 175;
            this.match(ProperTeeParser.T__5);
            this.state = 176;
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
        this.enterRule(localctx, 26, ProperTeeParser.RULE_iterationStmt);
        var _la = 0;
        try {
            this.state = 211;
            this._errHandler.sync(this);
            var la_ = this._interp.adaptivePredict(this._input,19,this._ctx);
            switch(la_) {
            case 1:
                localctx = new ConditionLoopContext(this, localctx);
                this.enterOuterAlt(localctx, 1);
                this.state = 178;
                this.match(ProperTeeParser.K_LOOP);
                this.state = 179;
                this.expression(0);
                this.state = 181;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if(_la===43) {
                    this.state = 180;
                    this.match(ProperTeeParser.K_INFINITE);
                }

                this.state = 183;
                this.match(ProperTeeParser.K_DO);
                this.state = 184;
                this.block();
                this.state = 185;
                this.match(ProperTeeParser.K_END);
                break;

            case 2:
                localctx = new ValueLoopContext(this, localctx);
                this.enterOuterAlt(localctx, 2);
                this.state = 187;
                this.match(ProperTeeParser.K_LOOP);
                this.state = 188;
                localctx.value = this.match(ProperTeeParser.ID);
                this.state = 189;
                this.match(ProperTeeParser.K_IN);
                this.state = 190;
                this.expression(0);
                this.state = 192;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if(_la===43) {
                    this.state = 191;
                    this.match(ProperTeeParser.K_INFINITE);
                }

                this.state = 194;
                this.match(ProperTeeParser.K_DO);
                this.state = 195;
                this.block();
                this.state = 196;
                this.match(ProperTeeParser.K_END);
                break;

            case 3:
                localctx = new KeyValueLoopContext(this, localctx);
                this.enterOuterAlt(localctx, 3);
                this.state = 198;
                this.match(ProperTeeParser.K_LOOP);
                this.state = 199;
                localctx.key = this.match(ProperTeeParser.ID);
                this.state = 200;
                this.match(ProperTeeParser.T__4);
                this.state = 201;
                localctx.value = this.match(ProperTeeParser.ID);
                this.state = 202;
                this.match(ProperTeeParser.K_IN);
                this.state = 203;
                this.expression(0);
                this.state = 205;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if(_la===43) {
                    this.state = 204;
                    this.match(ProperTeeParser.K_INFINITE);
                }

                this.state = 207;
                this.match(ProperTeeParser.K_DO);
                this.state = 208;
                this.block();
                this.state = 209;
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
        this.enterRule(localctx, 28, ProperTeeParser.RULE_flowControl);
        try {
            this.state = 220;
            this._errHandler.sync(this);
            switch(this._input.LA(1)) {
            case 32:
                localctx = new BreakStmtContext(this, localctx);
                this.enterOuterAlt(localctx, 1);
                this.state = 213;
                this.match(ProperTeeParser.K_BREAK);
                break;
            case 33:
                localctx = new ContinueStmtContext(this, localctx);
                this.enterOuterAlt(localctx, 2);
                this.state = 214;
                this.match(ProperTeeParser.K_CONTINUE);
                break;
            case 36:
                localctx = new ReturnStmtContext(this, localctx);
                this.enterOuterAlt(localctx, 3);
                this.state = 215;
                this.match(ProperTeeParser.K_RETURN);
                this.state = 217;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,20,this._ctx);
                if(la_===1) {
                    this.state = 216;
                    this.expression(0);

                }
                break;
            case 47:
                localctx = new DebugStmtContext(this, localctx);
                this.enterOuterAlt(localctx, 4);
                this.state = 219;
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
        const _startState = 30;
        this.enterRecursionRule(localctx, 30, ProperTeeParser.RULE_expression, _p);
        var _la = 0;
        try {
            this.enterOuterAlt(localctx, 1);
            this.state = 228;
            this._errHandler.sync(this);
            switch(this._input.LA(1)) {
            case 3:
            case 13:
            case 15:
            case 40:
            case 41:
            case 42:
            case 50:
            case 51:
            case 52:
            case 53:
                localctx = new AtomExprContext(this, localctx);
                this._ctx = localctx;
                _prevctx = localctx;

                this.state = 223;
                this.atom();
                break;
            case 7:
                localctx = new UnaryMinusExprContext(this, localctx);
                this._ctx = localctx;
                _prevctx = localctx;
                this.state = 224;
                this.match(ProperTeeParser.T__6);
                this.state = 225;
                this.expression(7);
                break;
            case 37:
                localctx = new NotExprContext(this, localctx);
                this._ctx = localctx;
                _prevctx = localctx;
                this.state = 226;
                this.match(ProperTeeParser.K_NOT);
                this.state = 227;
                this.expression(6);
                break;
            default:
                throw new antlr4.error.NoViableAltException(this);
            }
            this._ctx.stop = this._input.LT(-1);
            this.state = 251;
            this._errHandler.sync(this);
            var _alt = this._interp.adaptivePredict(this._input,24,this._ctx)
            while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
                if(_alt===1) {
                    if(this._parseListeners!==null) {
                        this.triggerExitRuleEvent();
                    }
                    _prevctx = localctx;
                    this.state = 249;
                    this._errHandler.sync(this);
                    var la_ = this._interp.adaptivePredict(this._input,23,this._ctx);
                    switch(la_) {
                    case 1:
                        localctx = new MultiplicativeExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
                        this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
                        this.state = 230;
                        if (!( this.precpred(this._ctx, 5))) {
                            throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
                        }
                        this.state = 231;
                        _la = this._input.LA(1);
                        if(!((((_la) & ~0x1f) === 0 && ((1 << _la) & 1792) !== 0))) {
                        this._errHandler.recoverInline(this);
                        }
                        else {
                            this._errHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 232;
                        this.expression(6);
                        break;

                    case 2:
                        localctx = new AdditiveExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
                        this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
                        this.state = 233;
                        if (!( this.precpred(this._ctx, 4))) {
                            throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
                        }
                        this.state = 234;
                        _la = this._input.LA(1);
                        if(!(_la===7 || _la===11)) {
                        this._errHandler.recoverInline(this);
                        }
                        else {
                            this._errHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 235;
                        this.expression(5);
                        break;

                    case 3:
                        localctx = new ComparisonExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
                        this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
                        this.state = 236;
                        if (!( this.precpred(this._ctx, 3))) {
                            throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
                        }
                        this.state = 237;
                        localctx.op = this.comparisonOp();
                        this.state = 238;
                        this.expression(4);
                        break;

                    case 4:
                        localctx = new AndExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
                        this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
                        this.state = 240;
                        if (!( this.precpred(this._ctx, 2))) {
                            throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
                        }
                        this.state = 241;
                        this.match(ProperTeeParser.K_AND);
                        this.state = 242;
                        this.expression(3);
                        break;

                    case 5:
                        localctx = new OrExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
                        this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
                        this.state = 243;
                        if (!( this.precpred(this._ctx, 1))) {
                            throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
                        }
                        this.state = 244;
                        this.match(ProperTeeParser.K_OR);
                        this.state = 245;
                        this.expression(2);
                        break;

                    case 6:
                        localctx = new MemberAccessExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
                        this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
                        this.state = 246;
                        if (!( this.precpred(this._ctx, 8))) {
                            throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 8)");
                        }
                        this.state = 247;
                        this.match(ProperTeeParser.T__0);
                        this.state = 248;
                        this.access();
                        break;

                    }
                }
                this.state = 253;
                this._errHandler.sync(this);
                _alt = this._interp.adaptivePredict(this._input,24,this._ctx);
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
        this.enterRule(localctx, 32, ProperTeeParser.RULE_access);
        var _la = 0;
        try {
            this.state = 267;
            this._errHandler.sync(this);
            var la_ = this._interp.adaptivePredict(this._input,26,this._ctx);
            switch(la_) {
            case 1:
                localctx = new StaticAccessContext(this, localctx);
                this.enterOuterAlt(localctx, 1);
                this.state = 254;
                this.match(ProperTeeParser.ID);
                break;

            case 2:
                localctx = new ArrayAccessContext(this, localctx);
                this.enterOuterAlt(localctx, 2);
                this.state = 255;
                this.match(ProperTeeParser.INTEGER);
                break;

            case 3:
                localctx = new StringKeyAccessContext(this, localctx);
                this.enterOuterAlt(localctx, 3);
                this.state = 256;
                this.match(ProperTeeParser.STRING);
                break;

            case 4:
                localctx = new VarEvalAccessContext(this, localctx);
                this.enterOuterAlt(localctx, 4);
                this.state = 257;
                this.match(ProperTeeParser.T__11);
                this.state = 259;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if(_la===50) {
                    this.state = 258;
                    this.match(ProperTeeParser.GLOBAL_PREFIX);
                }

                this.state = 261;
                this.match(ProperTeeParser.ID);
                break;

            case 5:
                localctx = new EvalAccessContext(this, localctx);
                this.enterOuterAlt(localctx, 5);
                this.state = 262;
                this.match(ProperTeeParser.T__11);
                this.state = 263;
                this.match(ProperTeeParser.T__2);
                this.state = 264;
                this.expression(0);
                this.state = 265;
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
        this.enterRule(localctx, 34, ProperTeeParser.RULE_atom);
        var _la = 0;
        try {
            this.state = 286;
            this._errHandler.sync(this);
            var la_ = this._interp.adaptivePredict(this._input,27,this._ctx);
            switch(la_) {
            case 1:
                localctx = new FuncAtomContext(this, localctx);
                this.enterOuterAlt(localctx, 1);
                this.state = 269;
                this.functionCall();
                break;

            case 2:
                localctx = new GlobalVarReferenceContext(this, localctx);
                this.enterOuterAlt(localctx, 2);
                this.state = 270;
                this.match(ProperTeeParser.GLOBAL_PREFIX);
                this.state = 271;
                this.match(ProperTeeParser.ID);
                break;

            case 3:
                localctx = new VarReferenceContext(this, localctx);
                this.enterOuterAlt(localctx, 3);
                this.state = 272;
                this.match(ProperTeeParser.ID);
                break;

            case 4:
                localctx = new DecimalAtomContext(this, localctx);
                this.enterOuterAlt(localctx, 4);
                this.state = 273;
                this.match(ProperTeeParser.INTEGER);
                this.state = 274;
                this.match(ProperTeeParser.T__0);
                this.state = 275;
                this.match(ProperTeeParser.INTEGER);
                break;

            case 5:
                localctx = new IntegerAtomContext(this, localctx);
                this.enterOuterAlt(localctx, 5);
                this.state = 276;
                this.match(ProperTeeParser.INTEGER);
                break;

            case 6:
                localctx = new StringAtomContext(this, localctx);
                this.enterOuterAlt(localctx, 6);
                this.state = 277;
                this.match(ProperTeeParser.STRING);
                break;

            case 7:
                localctx = new BooleanAtomContext(this, localctx);
                this.enterOuterAlt(localctx, 7);
                this.state = 278;
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
                this.state = 279;
                this.match(ProperTeeParser.K_NULL);
                break;

            case 9:
                localctx = new ObjectAtomContext(this, localctx);
                this.enterOuterAlt(localctx, 9);
                this.state = 280;
                this.objectLiteral();
                break;

            case 10:
                localctx = new ArrayAtomContext(this, localctx);
                this.enterOuterAlt(localctx, 10);
                this.state = 281;
                this.arrayLiteral();
                break;

            case 11:
                localctx = new ParenAtomContext(this, localctx);
                this.enterOuterAlt(localctx, 11);
                this.state = 282;
                this.match(ProperTeeParser.T__2);
                this.state = 283;
                this.expression(0);
                this.state = 284;
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
        this.enterRule(localctx, 36, ProperTeeParser.RULE_functionCall);
        var _la = 0;
        try {
            this.enterOuterAlt(localctx, 1);
            this.state = 290;
            this._errHandler.sync(this);
            var la_ = this._interp.adaptivePredict(this._input,28,this._ctx);
            if(la_===1) {
                this.state = 288;
                localctx.moduleAlias = this.match(ProperTeeParser.ID);
                this.state = 289;
                this.match(ProperTeeParser.GLOBAL_PREFIX);

            }
            this.state = 292;
            localctx.funcName = this.match(ProperTeeParser.ID);
            this.state = 293;
            this.match(ProperTeeParser.T__2);
            this.state = 302;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if((((_la) & ~0x1f) === 0 && ((1 << _la) & 41096) !== 0) || ((((_la - 37)) & ~0x1f) === 0 && ((1 << (_la - 37)) & 122937) !== 0)) {
                this.state = 294;
                this.expression(0);
                this.state = 299;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while(_la===5) {
                    this.state = 295;
                    this.match(ProperTeeParser.T__4);
                    this.state = 296;
                    this.expression(0);
                    this.state = 301;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
            }

            this.state = 304;
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
        this.enterRule(localctx, 38, ProperTeeParser.RULE_objectLiteral);
        var _la = 0;
        try {
            this.enterOuterAlt(localctx, 1);
            this.state = 306;
            this.match(ProperTeeParser.T__12);
            this.state = 315;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if(_la===52 || _la===53) {
                this.state = 307;
                this.objectEntry();
                this.state = 312;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while(_la===5) {
                    this.state = 308;
                    this.match(ProperTeeParser.T__4);
                    this.state = 309;
                    this.objectEntry();
                    this.state = 314;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
            }

            this.state = 317;
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
        this.enterRule(localctx, 40, ProperTeeParser.RULE_objectEntry);
        try {
            this.enterOuterAlt(localctx, 1);
            this.state = 319;
            this.objectKey();
            this.state = 320;
            this.match(ProperTeeParser.T__5);
            this.state = 321;
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
        this.enterRule(localctx, 42, ProperTeeParser.RULE_objectKey);
        var _la = 0;
        try {
            this.enterOuterAlt(localctx, 1);
            this.state = 323;
            _la = this._input.LA(1);
            if(!(_la===52 || _la===53)) {
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
        this.enterRule(localctx, 44, ProperTeeParser.RULE_arrayLiteral);
        var _la = 0;
        try {
            this.state = 347;
            this._errHandler.sync(this);
            var la_ = this._interp.adaptivePredict(this._input,36,this._ctx);
            switch(la_) {
            case 1:
                localctx = new RangeArrayContext(this, localctx);
                this.enterOuterAlt(localctx, 1);
                this.state = 325;
                this.match(ProperTeeParser.T__14);
                this.state = 326;
                localctx.rangeStart = this.expression(0);
                this.state = 327;
                this.match(ProperTeeParser.T__15);
                this.state = 328;
                localctx.rangeEnd = this.expression(0);
                this.state = 331;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if(_la===5) {
                    this.state = 329;
                    this.match(ProperTeeParser.T__4);
                    this.state = 330;
                    localctx.rangeStep = this.expression(0);
                }

                this.state = 333;
                this.match(ProperTeeParser.T__16);
                break;

            case 2:
                localctx = new ListArrayContext(this, localctx);
                this.enterOuterAlt(localctx, 2);
                this.state = 335;
                this.match(ProperTeeParser.T__14);
                this.state = 344;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if((((_la) & ~0x1f) === 0 && ((1 << _la) & 41096) !== 0) || ((((_la - 37)) & ~0x1f) === 0 && ((1 << (_la - 37)) & 122937) !== 0)) {
                    this.state = 336;
                    this.expression(0);
                    this.state = 341;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                    while(_la===5) {
                        this.state = 337;
                        this.match(ProperTeeParser.T__4);
                        this.state = 338;
                        this.expression(0);
                        this.state = 343;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                    }
                }

                this.state = 346;
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
        this.enterRule(localctx, 46, ProperTeeParser.RULE_comparisonOp);
        var _la = 0;
        try {
            this.enterOuterAlt(localctx, 1);
            this.state = 349;
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
ProperTeeParser.K_LIMIT = 44;
ProperTeeParser.K_MULTI = 45;
ProperTeeParser.K_MONITOR = 46;
ProperTeeParser.K_DEBUG = 47;
ProperTeeParser.K_IMPORT = 48;
ProperTeeParser.K_AS = 49;
ProperTeeParser.GLOBAL_PREFIX = 50;
ProperTeeParser.ID = 51;
ProperTeeParser.INTEGER = 52;
ProperTeeParser.STRING = 53;
ProperTeeParser.COMMENT = 54;
ProperTeeParser.BLOCK_COMMENT = 55;
ProperTeeParser.WS = 56;

ProperTeeParser.RULE_root = 0;
ProperTeeParser.RULE_importStmt = 1;
ProperTeeParser.RULE_modulePath = 2;
ProperTeeParser.RULE_statement = 3;
ProperTeeParser.RULE_assignment = 4;
ProperTeeParser.RULE_lvalue = 5;
ProperTeeParser.RULE_block = 6;
ProperTeeParser.RULE_ifStatement = 7;
ProperTeeParser.RULE_functionDef = 8;
ProperTeeParser.RULE_parameterList = 9;
ProperTeeParser.RULE_parallelStmt = 10;
ProperTeeParser.RULE_monitorClause = 11;
ProperTeeParser.RULE_spawnStmt = 12;
ProperTeeParser.RULE_iterationStmt = 13;
ProperTeeParser.RULE_flowControl = 14;
ProperTeeParser.RULE_expression = 15;
ProperTeeParser.RULE_access = 16;
ProperTeeParser.RULE_atom = 17;
ProperTeeParser.RULE_functionCall = 18;
ProperTeeParser.RULE_objectLiteral = 19;
ProperTeeParser.RULE_objectEntry = 20;
ProperTeeParser.RULE_objectKey = 21;
ProperTeeParser.RULE_arrayLiteral = 22;
ProperTeeParser.RULE_comparisonOp = 23;

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

    importStmt = function(i) {
        if(i===undefined) {
            i = null;
        }
        if(i===null) {
            return this.getTypedRuleContexts(ImportStmtContext);
        } else {
            return this.getTypedRuleContext(ImportStmtContext,i);
        }
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



class ImportStmtContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_importStmt;
        this.version = null;
        this.alias = null;
    }

    K_IMPORT() {
        return this.getToken(ProperTeeParser.K_IMPORT, 0);
    };

    modulePath() {
        return this.getTypedRuleContext(ModulePathContext,0);
    };

    K_AS() {
        return this.getToken(ProperTeeParser.K_AS, 0);
    };

    ID() {
        return this.getToken(ProperTeeParser.ID, 0);
    };

    INTEGER() {
        return this.getToken(ProperTeeParser.INTEGER, 0);
    };

    accept(visitor) {
        if ( visitor instanceof ProperTeeVisitor ) {
            return visitor.visitImportStmt(this);
        } else {
            return visitor.visitChildren(this);
        }
    }


}



class ModulePathContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_modulePath;
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
            return visitor.visitModulePath(this);
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
        this.limitExpr = null;
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

    K_LIMIT() {
        return this.getToken(ProperTeeParser.K_LIMIT, 0);
    };

    monitorClause() {
        return this.getTypedRuleContext(MonitorClauseContext,0);
    };

    ID() {
        return this.getToken(ProperTeeParser.ID, 0);
    };

    expression() {
        return this.getTypedRuleContext(ExpressionContext,0);
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
        this.moduleAlias = null;
        this.funcName = null;
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


    GLOBAL_PREFIX() {
        return this.getToken(ProperTeeParser.GLOBAL_PREFIX, 0);
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
ProperTeeParser.ImportStmtContext = ImportStmtContext;
ProperTeeParser.ModulePathContext = ModulePathContext;
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
