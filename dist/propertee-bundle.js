/*!
 * ProperTee Concurrent - Generator-Based Cooperative Scheduler
 * Copyright (c) 2026 FLATIDE LC.
 * Licensed under BSD 3-Clause License
 *
 * This bundle includes:
 * - ANTLR4 Runtime (BSD 3-Clause License)
 *   Copyright (c) 2012-2022 The ANTLR Project
 * - ProperTee Parser, Lexer, Visitor, ThreadContext, Scheduler
 *
 * See LICENSE and NOTICE files for full license information
 * https://github.com/flatide/ProperTee
 */


// ANTLR4 JavaScript Runtime - Browser Compatible Version
// Converted from CommonJS to IIFE
(function(global) {
    var module = { exports: {} };
    var exports = module.exports;
    
    (()=>{var t={763:()=>{}},e={};function n(s){var i=e[s];if(void 0!==i)return i.exports;var r=e[s]={exports:{}};return t[s](r,r.exports,n),r.exports}n.d=(t,e)=>{for(var s in e)n.o(e,s)&&!n.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var s={};(()=>{"use strict";n.r(s),n.d(s,{ATN:()=>j,ATNDeserializer:()=>It,BailErrorStrategy:()=>_e,CharStream:()=>Ae,CharStreams:()=>Le,CommonToken:()=>vt,CommonTokenStream:()=>we,DFA:()=>oe,DefaultErrorStrategy:()=>Ee,DiagnosticErrorListener:()=>Te,ErrorListener:()=>yt,FailedPredicateException:()=>fe,InputMismatchException:()=>pe,InputStream:()=>Ne,Interval:()=>S,IntervalSet:()=>m,LL1Analyzer:()=>G,Lexer:()=>Ft,LexerATNSimulator:()=>Wt,NoViableAltException:()=>Zt,ParseTreeListener:()=>ce,ParseTreeVisitor:()=>ue,ParseTreeWalker:()=>de,Parser:()=>be,ParserATNSimulator:()=>ee,ParserRuleContext:()=>Me,PredictionContextCache:()=>ne,PredictionMode:()=>Qt,RecognitionException:()=>bt,RuleContext:()=>F,RuleNode:()=>v,TerminalNode:()=>w,Token:()=>t,TokenStreamRewriter:()=>Ue,arrayToString:()=>c,default:()=>He});class t{constructor(){this.source=null,this.type=null,this.channel=null,this.start=null,this.stop=null,this.tokenIndex=null,this.line=null,this.column=null,this._text=null}getTokenSource(){return this.source[0]}getInputStream(){return this.source[1]}get text(){return this._text}set text(t){this._text=t}}function e(t,e){if(!Array.isArray(t)||!Array.isArray(e))return!1;if(t===e)return!0;if(t.length!==e.length)return!1;for(let n=0;n<t.length;n++)if(!(t[n]===e[n]||t[n].equals&&t[n].equals(e[n])))return!1;return!0}t.INVALID_TYPE=0,t.EPSILON=-2,t.MIN_USER_TOKEN_TYPE=1,t.EOF=-1,t.DEFAULT_CHANNEL=0,t.HIDDEN_CHANNEL=1;const i=Math.round(Math.random()*Math.pow(2,32));function r(t){if(!t)return 0;const e=typeof t,n="string"===e?t:!("object"!==e||!t.toString)&&t.toString();if(!n)return 0;let s,r;const o=3&n.length,a=n.length-o;let l=i;const h=3432918353,c=461845907;let u=0;for(;u<a;)r=255&n.charCodeAt(u)|(255&n.charCodeAt(++u))<<8|(255&n.charCodeAt(++u))<<16|(255&n.charCodeAt(++u))<<24,++u,r=(65535&r)*h+(((r>>>16)*h&65535)<<16)&4294967295,r=r<<15|r>>>17,r=(65535&r)*c+(((r>>>16)*c&65535)<<16)&4294967295,l^=r,l=l<<13|l>>>19,s=5*(65535&l)+((5*(l>>>16)&65535)<<16)&4294967295,l=27492+(65535&s)+((58964+(s>>>16)&65535)<<16);switch(r=0,o){case 3:r^=(255&n.charCodeAt(u+2))<<16;case 2:r^=(255&n.charCodeAt(u+1))<<8;case 1:r^=255&n.charCodeAt(u),r=(65535&r)*h+(((r>>>16)*h&65535)<<16)&4294967295,r=r<<15|r>>>17,r=(65535&r)*c+(((r>>>16)*c&65535)<<16)&4294967295,l^=r}return l^=n.length,l^=l>>>16,l=2246822507*(65535&l)+((2246822507*(l>>>16)&65535)<<16)&4294967295,l^=l>>>13,l=3266489909*(65535&l)+((3266489909*(l>>>16)&65535)<<16)&4294967295,l^=l>>>16,l>>>0}class o{constructor(){this.count=0,this.hash=0}update(){for(let t=0;t<arguments.length;t++){const e=arguments[t];if(null!=e)if(Array.isArray(e))this.update.apply(this,e);else{let t=0;switch(typeof e){case"undefined":case"function":continue;case"number":case"boolean":t=e;break;case"string":t=r(e);break;default:e.updateHashCode?e.updateHashCode(this):console.log("No updateHashCode for "+e.toString());continue}t*=3432918353,t=t<<15|t>>>17,t*=461845907,this.count=this.count+1;let n=this.hash^t;n=n<<13|n>>>19,n=5*n+3864292196,this.hash=n}}}finish(){let t=this.hash^4*this.count;return t^=t>>>16,t*=2246822507,t^=t>>>13,t*=3266489909,t^=t>>>16,t}static hashStuff(){const t=new o;return t.update.apply(t,arguments),t.finish()}}function a(t){return t?"string"==typeof t?r(t):t.hashCode():-1}function l(t,e){return t&&t.equals?t.equals(e):t===e}function h(t){return null===t?"null":t}function c(t){return Array.isArray(t)?"["+t.map(h).join(", ")+"]":"null"}class u{constructor(t,e){this.buckets=new Array(16),this.threshold=Math.floor(12),this.itemCount=0,this.hashFunction=t||a,this.equalsFunction=e||l}get(t){if(null==t)return t;const e=this._getBucket(t);if(!e)return null;for(const n of e)if(this.equalsFunction(n,t))return n;return null}add(t){return this.getOrAdd(t)===t}getOrAdd(t){this._expand();const e=this._getSlot(t);let n=this.buckets[e];if(!n)return n=[t],this.buckets[e]=n,this.itemCount++,t;for(const e of n)if(this.equalsFunction(e,t))return e;return n.push(t),this.itemCount++,t}has(t){return null!=this.get(t)}values(){return this.buckets.filter((t=>null!=t)).flat(1)}toString(){return c(this.values())}get length(){return this.itemCount}_getSlot(t){return this.hashFunction(t)&this.buckets.length-1}_getBucket(t){return this.buckets[this._getSlot(t)]}_expand(){if(this.itemCount<=this.threshold)return;const t=this.buckets,e=2*this.buckets.length;this.buckets=new Array(e),this.threshold=Math.floor(.75*e);for(const e of t)if(e)for(const t of e){const e=this._getSlot(t);let n=this.buckets[e];n||(n=[],this.buckets[e]=n),n.push(t)}}}class d{hashCode(){const t=new o;return this.updateHashCode(t),t.finish()}evaluate(t,e){}evalPrecedence(t,e){return this}static andContext(t,e){if(null===t||t===d.NONE)return e;if(null===e||e===d.NONE)return t;const n=new g(t,e);return 1===n.opnds.length?n.opnds[0]:n}static orContext(t,e){if(null===t)return e;if(null===e)return t;if(t===d.NONE||e===d.NONE)return d.NONE;const n=new p(t,e);return 1===n.opnds.length?n.opnds[0]:n}}class g extends d{constructor(t,e){super();const n=new u;t instanceof g?t.opnds.map((function(t){n.add(t)})):n.add(t),e instanceof g?e.opnds.map((function(t){n.add(t)})):n.add(e);const s=f(n);if(s.length>0){let t=null;s.map((function(e){(null===t||e.precedence<t.precedence)&&(t=e)})),n.add(t)}this.opnds=Array.from(n.values())}equals(t){return this===t||t instanceof g&&e(this.opnds,t.opnds)}updateHashCode(t){t.update(this.opnds,"AND")}evaluate(t,e){for(let n=0;n<this.opnds.length;n++)if(!this.opnds[n].evaluate(t,e))return!1;return!0}evalPrecedence(t,e){let n=!1;const s=[];for(let i=0;i<this.opnds.length;i++){const r=this.opnds[i],o=r.evalPrecedence(t,e);if(n|=o!==r,null===o)return null;o!==d.NONE&&s.push(o)}if(!n)return this;if(0===s.length)return d.NONE;let i=null;return s.map((function(t){i=null===i?t:d.andContext(i,t)})),i}toString(){const t=this.opnds.map((t=>t.toString()));return(t.length>3?t.slice(3):t).join("&&")}}class p extends d{constructor(t,e){super();const n=new u;t instanceof p?t.opnds.map((function(t){n.add(t)})):n.add(t),e instanceof p?e.opnds.map((function(t){n.add(t)})):n.add(e);const s=f(n);if(s.length>0){const t=s.sort((function(t,e){return t.compareTo(e)})),e=t[t.length-1];n.add(e)}this.opnds=Array.from(n.values())}equals(t){return this===t||t instanceof p&&e(this.opnds,t.opnds)}updateHashCode(t){t.update(this.opnds,"OR")}evaluate(t,e){for(let n=0;n<this.opnds.length;n++)if(this.opnds[n].evaluate(t,e))return!0;return!1}evalPrecedence(t,e){let n=!1;const s=[];for(let i=0;i<this.opnds.length;i++){const r=this.opnds[i],o=r.evalPrecedence(t,e);if(n|=o!==r,o===d.NONE)return d.NONE;null!==o&&s.push(o)}if(!n)return this;if(0===s.length)return null;return s.map((function(t){return t})),null}toString(){const t=this.opnds.map((t=>t.toString()));return(t.length>3?t.slice(3):t).join("||")}}function f(t){const e=[];return t.values().map((function(t){t instanceof d.PrecedencePredicate&&e.push(t)})),e}function x(t,e){if(null===t){const t={state:null,alt:null,context:null,semanticContext:null};return e&&(t.reachesIntoOuterContext=0),t}{const n={};return n.state=t.state||null,n.alt=void 0===t.alt?null:t.alt,n.context=t.context||null,n.semanticContext=t.semanticContext||null,e&&(n.reachesIntoOuterContext=t.reachesIntoOuterContext||0,n.precedenceFilterSuppressed=t.precedenceFilterSuppressed||!1),n}}class T{constructor(t,e){this.checkContext(t,e),t=x(t),e=x(e,!0),this.state=null!==t.state?t.state:e.state,this.alt=null!==t.alt?t.alt:e.alt,this.context=null!==t.context?t.context:e.context,this.semanticContext=null!==t.semanticContext?t.semanticContext:null!==e.semanticContext?e.semanticContext:d.NONE,this.reachesIntoOuterContext=e.reachesIntoOuterContext,this.precedenceFilterSuppressed=e.precedenceFilterSuppressed}checkContext(t,e){null!==t.context&&void 0!==t.context||null!==e&&null!==e.context&&void 0!==e.context||(this.context=null)}hashCode(){const t=new o;return this.updateHashCode(t),t.finish()}updateHashCode(t){t.update(this.state.stateNumber,this.alt,this.context,this.semanticContext)}equals(t){return this===t||t instanceof T&&this.state.stateNumber===t.state.stateNumber&&this.alt===t.alt&&(null===this.context?null===t.context:this.context.equals(t.context))&&this.semanticContext.equals(t.semanticContext)&&this.precedenceFilterSuppressed===t.precedenceFilterSuppressed}hashCodeForConfigSet(){const t=new o;return t.update(this.state.stateNumber,this.alt,this.semanticContext),t.finish()}equalsForConfigSet(t){return this===t||t instanceof T&&this.state.stateNumber===t.state.stateNumber&&this.alt===t.alt&&this.semanticContext.equals(t.semanticContext)}toString(){return"("+this.state+","+this.alt+(null!==this.context?",["+this.context.toString()+"]":"")+(this.semanticContext!==d.NONE?","+this.semanticContext.toString():"")+(this.reachesIntoOuterContext>0?",up="+this.reachesIntoOuterContext:"")+")"}}class S{constructor(t,e){this.start=t,this.stop=e}clone(){return new S(this.start,this.stop)}contains(t){return t>=this.start&&t<this.stop}toString(){return this.start===this.stop-1?this.start.toString():this.start.toString()+".."+(this.stop-1).toString()}get length(){return this.stop-this.start}}S.INVALID_INTERVAL=new S(-1,-2);class m{constructor(){this.intervals=null,this.readOnly=!1}first(e){return null===this.intervals||0===this.intervals.length?t.INVALID_TYPE:this.intervals[0].start}addOne(t){this.addInterval(new S(t,t+1))}addRange(t,e){this.addInterval(new S(t,e+1))}addInterval(t){if(null===this.intervals)this.intervals=[],this.intervals.push(t.clone());else{for(let e=0;e<this.intervals.length;e++){const n=this.intervals[e];if(t.stop<n.start)return void this.intervals.splice(e,0,t);if(t.stop===n.start)return void(this.intervals[e]=new S(t.start,n.stop));if(t.start<=n.stop)return this.intervals[e]=new S(Math.min(n.start,t.start),Math.max(n.stop,t.stop)),void this.reduce(e)}this.intervals.push(t.clone())}}addSet(t){return null!==t.intervals&&t.intervals.forEach((t=>this.addInterval(t)),this),this}reduce(t){if(t<this.intervals.length-1){const e=this.intervals[t],n=this.intervals[t+1];e.stop>=n.stop?(this.intervals.splice(t+1,1),this.reduce(t)):e.stop>=n.start&&(this.intervals[t]=new S(e.start,n.stop),this.intervals.splice(t+1,1))}}complement(t,e){const n=new m;return n.addInterval(new S(t,e+1)),null!==this.intervals&&this.intervals.forEach((t=>n.removeRange(t))),n}contains(t){if(null===this.intervals)return!1;for(let e=0;e<this.intervals.length;e++)if(this.intervals[e].contains(t))return!0;return!1}removeRange(t){if(t.start===t.stop-1)this.removeOne(t.start);else if(null!==this.intervals){let e=0;for(let n=0;n<this.intervals.length;n++){const n=this.intervals[e];if(t.stop<=n.start)return;if(t.start>n.start&&t.stop<n.stop){this.intervals[e]=new S(n.start,t.start);const s=new S(t.stop,n.stop);return void this.intervals.splice(e,0,s)}t.start<=n.start&&t.stop>=n.stop?(this.intervals.splice(e,1),e-=1):t.start<n.stop?this.intervals[e]=new S(n.start,t.start):t.stop<n.stop&&(this.intervals[e]=new S(t.stop,n.stop)),e+=1}}}removeOne(t){if(null!==this.intervals)for(let e=0;e<this.intervals.length;e++){const n=this.intervals[e];if(t<n.start)return;if(t===n.start&&t===n.stop-1)return void this.intervals.splice(e,1);if(t===n.start)return void(this.intervals[e]=new S(n.start+1,n.stop));if(t===n.stop-1)return void(this.intervals[e]=new S(n.start,n.stop-1));if(t<n.stop-1){const s=new S(n.start,t);return n.start=t+1,void this.intervals.splice(e,0,s)}}}toString(t,e,n){return t=t||null,e=e||null,n=n||!1,null===this.intervals?"{}":null!==t||null!==e?this.toTokenString(t,e):n?this.toCharString():this.toIndexString()}toCharString(){const e=[];for(let n=0;n<this.intervals.length;n++){const s=this.intervals[n];s.stop===s.start+1?s.start===t.EOF?e.push("<EOF>"):e.push("'"+String.fromCharCode(s.start)+"'"):e.push("'"+String.fromCharCode(s.start)+"'..'"+String.fromCharCode(s.stop-1)+"'")}return e.length>1?"{"+e.join(", ")+"}":e[0]}toIndexString(){const e=[];for(let n=0;n<this.intervals.length;n++){const s=this.intervals[n];s.stop===s.start+1?s.start===t.EOF?e.push("<EOF>"):e.push(s.start.toString()):e.push(s.start.toString()+".."+(s.stop-1).toString())}return e.length>1?"{"+e.join(", ")+"}":e[0]}toTokenString(t,e){const n=[];for(let s=0;s<this.intervals.length;s++){const i=this.intervals[s];for(let s=i.start;s<i.stop;s++)n.push(this.elementName(t,e,s))}return n.length>1?"{"+n.join(", ")+"}":n[0]}elementName(e,n,s){return s===t.EOF?"<EOF>":s===t.EPSILON?"<EPSILON>":e[s]||n[s]}get length(){return this.intervals.map((t=>t.length)).reduce(((t,e)=>t+e))}}class E{constructor(){this.atn=null,this.stateNumber=E.INVALID_STATE_NUMBER,this.stateType=null,this.ruleIndex=0,this.epsilonOnlyTransitions=!1,this.transitions=[],this.nextTokenWithinRule=null}toString(){return this.stateNumber}equals(t){return t instanceof E&&this.stateNumber===t.stateNumber}isNonGreedyExitState(){return!1}addTransition(t,e){void 0===e&&(e=-1),0===this.transitions.length?this.epsilonOnlyTransitions=t.isEpsilon:this.epsilonOnlyTransitions!==t.isEpsilon&&(this.epsilonOnlyTransitions=!1),-1===e?this.transitions.push(t):this.transitions.splice(e,1,t)}}E.INVALID_TYPE=0,E.BASIC=1,E.RULE_START=2,E.BLOCK_START=3,E.PLUS_BLOCK_START=4,E.STAR_BLOCK_START=5,E.TOKEN_START=6,E.RULE_STOP=7,E.BLOCK_END=8,E.STAR_LOOP_BACK=9,E.STAR_LOOP_ENTRY=10,E.PLUS_LOOP_BACK=11,E.LOOP_END=12,E.serializationNames=["INVALID","BASIC","RULE_START","BLOCK_START","PLUS_BLOCK_START","STAR_BLOCK_START","TOKEN_START","RULE_STOP","BLOCK_END","STAR_LOOP_BACK","STAR_LOOP_ENTRY","PLUS_LOOP_BACK","LOOP_END"],E.INVALID_STATE_NUMBER=-1;class _ extends E{constructor(){return super(),this.stateType=E.RULE_STOP,this}}class C{constructor(t){if(null==t)throw"target cannot be null.";this.target=t,this.isEpsilon=!1,this.label=null}}C.EPSILON=1,C.RANGE=2,C.RULE=3,C.PREDICATE=4,C.ATOM=5,C.ACTION=6,C.SET=7,C.NOT_SET=8,C.WILDCARD=9,C.PRECEDENCE=10,C.serializationNames=["INVALID","EPSILON","RANGE","RULE","PREDICATE","ATOM","ACTION","SET","NOT_SET","WILDCARD","PRECEDENCE"],C.serializationTypes={EpsilonTransition:C.EPSILON,RangeTransition:C.RANGE,RuleTransition:C.RULE,PredicateTransition:C.PREDICATE,AtomTransition:C.ATOM,ActionTransition:C.ACTION,SetTransition:C.SET,NotSetTransition:C.NOT_SET,WildcardTransition:C.WILDCARD,PrecedencePredicateTransition:C.PRECEDENCE};class A extends C{constructor(t,e,n,s){super(t),this.ruleIndex=e,this.precedence=n,this.followState=s,this.serializationType=C.RULE,this.isEpsilon=!0}matches(t,e,n){return!1}}class N extends C{constructor(e,n){super(e),this.serializationType=C.SET,null!=n?this.label=n:(this.label=new m,this.label.addOne(t.INVALID_TYPE))}matches(t,e,n){return this.label.contains(t)}toString(){return this.label.toString()}}class k extends N{constructor(t,e){super(t,e),this.serializationType=C.NOT_SET}matches(t,e,n){return t>=e&&t<=n&&!super.matches(t,e,n)}toString(){return"~"+super.toString()}}class I extends C{constructor(t){super(t),this.serializationType=C.WILDCARD}matches(t,e,n){return t>=e&&t<=n}toString(){return"."}}class y extends C{constructor(t){super(t)}}class L{}class O extends L{}class R extends O{}class v extends R{get ruleContext(){throw new Error("missing interface implementation")}}class w extends R{}class P extends w{}const b={toStringTree:function(t,e,n){e=e||null,null!==(n=n||null)&&(e=n.ruleNames);let s=b.getNodeText(t,e);s=function(t){return t=t.replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r")}(s);const i=t.getChildCount();if(0===i)return s;let r="("+s+" ";i>0&&(s=b.toStringTree(t.getChild(0),e),r=r.concat(s));for(let n=1;n<i;n++)s=b.toStringTree(t.getChild(n),e),r=r.concat(" "+s);return r=r.concat(")"),r},getNodeText:function(e,n,s){if(n=n||null,null!==(s=s||null)&&(n=s.ruleNames),null!==n){if(e instanceof v){const t=e.ruleContext.getAltNumber();return 0!=t?n[e.ruleIndex]+":"+t:n[e.ruleIndex]}if(e instanceof P)return e.toString();if(e instanceof w&&null!==e.symbol)return e.symbol.text}const i=e.getPayload();return i instanceof t?i.text:e.getPayload().toString()},getChildren:function(t){const e=[];for(let n=0;n<t.getChildCount();n++)e.push(t.getChild(n));return e},getAncestors:function(t){let e=[];for(t=t.getParent();null!==t;)e=[t].concat(e),t=t.getParent();return e},findAllTokenNodes:function(t,e){return b.findAllNodes(t,e,!0)},findAllRuleNodes:function(t,e){return b.findAllNodes(t,e,!1)},findAllNodes:function(t,e,n){const s=[];return b._findAllNodes(t,e,n,s),s},_findAllNodes:function(t,e,n,s){n&&t instanceof w?t.symbol.type===e&&s.push(t):!n&&t instanceof v&&t.ruleIndex===e&&s.push(t);for(let i=0;i<t.getChildCount();i++)b._findAllNodes(t.getChild(i),e,n,s)},descendants:function(t){let e=[t];for(let n=0;n<t.getChildCount();n++)e=e.concat(b.descendants(t.getChild(n)));return e}},D=b;class F extends v{constructor(t,e){super(),this.parentCtx=t||null,this.invokingState=e||-1}depth(){let t=0,e=this;for(;null!==e;)e=e.parentCtx,t+=1;return t}isEmpty(){return-1===this.invokingState}getSourceInterval(){return S.INVALID_INTERVAL}get ruleContext(){return this}getPayload(){return this}getText(){return 0===this.getChildCount()?"":this.children.map((function(t){return t.getText()})).join("")}getAltNumber(){return 0}setAltNumber(t){}getChild(t){return null}getChildCount(){return 0}accept(t){return t.visitChildren(this)}toStringTree(t,e){return D.toStringTree(this,t,e)}toString(t,e){t=t||null,e=e||null;let n=this,s="[";for(;null!==n&&n!==e;){if(null===t)n.isEmpty()||(s+=n.invokingState);else{const e=n.ruleIndex;s+=e>=0&&e<t.length?t[e]:""+e}null===n.parentCtx||null===t&&n.parentCtx.isEmpty()||(s+=" "),n=n.parentCtx}return s+="]",s}}class M{constructor(t){this.cachedHashCode=t}isEmpty(){return this===M.EMPTY}hasEmptyPath(){return this.getReturnState(this.length-1)===M.EMPTY_RETURN_STATE}hashCode(){return this.cachedHashCode}updateHashCode(t){t.update(this.cachedHashCode)}}M.EMPTY=null,M.EMPTY_RETURN_STATE=2147483647,M.globalNodeCount=1,M.id=M.globalNodeCount,M.trace_atn_sim=!1;class U extends M{constructor(t,e){const n=new o;return n.update(t,e),super(n.finish()),this.parents=t,this.returnStates=e,this}isEmpty(){return this.returnStates[0]===M.EMPTY_RETURN_STATE}getParent(t){return this.parents[t]}getReturnState(t){return this.returnStates[t]}equals(t){return this===t||t instanceof U&&this.hashCode()===t.hashCode()&&e(this.returnStates,t.returnStates)&&e(this.parents,t.parents)}toString(){if(this.isEmpty())return"[]";{let t="[";for(let e=0;e<this.returnStates.length;e++)e>0&&(t+=", "),this.returnStates[e]!==M.EMPTY_RETURN_STATE?(t+=this.returnStates[e],null!==this.parents[e]?t=t+" "+this.parents[e]:t+="null"):t+="$";return t+"]"}}get length(){return this.returnStates.length}}class B extends M{constructor(t,e){let n=0;const s=new o;null!==t?s.update(t,e):s.update(1),n=s.finish(),super(n),this.parentCtx=t,this.returnState=e}getParent(t){return this.parentCtx}getReturnState(t){return this.returnState}equals(t){return this===t||t instanceof B&&this.hashCode()===t.hashCode()&&this.returnState===t.returnState&&(null==this.parentCtx?null==t.parentCtx:this.parentCtx.equals(t.parentCtx))}toString(){const t=null===this.parentCtx?"":this.parentCtx.toString();return 0===t.length?this.returnState===M.EMPTY_RETURN_STATE?"$":""+this.returnState:this.returnState+" "+t}get length(){return 1}static create(t,e){return e===M.EMPTY_RETURN_STATE&&null===t?M.EMPTY:new B(t,e)}}class V extends B{constructor(){super(null,M.EMPTY_RETURN_STATE)}isEmpty(){return!0}getParent(t){return null}getReturnState(t){return this.returnState}equals(t){return this===t}toString(){return"$"}}M.EMPTY=new V;class z{constructor(t,e){this.buckets=new Array(16),this.threshold=Math.floor(12),this.itemCount=0,this.hashFunction=t||a,this.equalsFunction=e||l}set(t,e){this._expand();const n=this._getSlot(t);let s=this.buckets[n];if(!s)return s=[[t,e]],this.buckets[n]=s,this.itemCount++,e;const i=s.find((e=>this.equalsFunction(e[0],t)),this);if(i){const t=i[1];return i[1]=e,t}return s.push([t,e]),this.itemCount++,e}containsKey(t){const e=this._getBucket(t);return!!e&&!!e.find((e=>this.equalsFunction(e[0],t)),this)}get(t){const e=this._getBucket(t);if(!e)return null;const n=e.find((e=>this.equalsFunction(e[0],t)),this);return n?n[1]:null}entries(){return this.buckets.filter((t=>null!=t)).flat(1)}getKeys(){return this.entries().map((t=>t[0]))}getValues(){return this.entries().map((t=>t[1]))}toString(){return"["+this.entries().map((t=>"{"+t[0]+":"+t[1]+"}")).join(", ")+"]"}get length(){return this.itemCount}_getSlot(t){return this.hashFunction(t)&this.buckets.length-1}_getBucket(t){return this.buckets[this._getSlot(t)]}_expand(){if(this.itemCount<=this.threshold)return;const t=this.buckets,e=2*this.buckets.length;this.buckets=new Array(e),this.threshold=Math.floor(.75*e);for(const e of t)if(e)for(const t of e){const e=this._getSlot(t[0]);let n=this.buckets[e];n||(n=[],this.buckets[e]=n),n.push(t)}}}function q(t,e){if(null==e&&(e=F.EMPTY),null===e.parentCtx||e===F.EMPTY)return M.EMPTY;const n=q(t,e.parentCtx),s=t.states[e.invokingState].transitions[0];return B.create(n,s.followState.stateNumber)}function H(t,e,n){if(t.isEmpty())return t;let s=n.get(t)||null;if(null!==s)return s;if(s=e.get(t),null!==s)return n.set(t,s),s;let i=!1,r=[];for(let s=0;s<r.length;s++){const o=H(t.getParent(s),e,n);if(i||o!==t.getParent(s)){if(!i){r=[];for(let e=0;e<t.length;e++)r[e]=t.getParent(e);i=!0}r[s]=o}}if(!i)return e.add(t),n.set(t,t),t;let o=null;return o=0===r.length?M.EMPTY:1===r.length?B.create(r[0],t.getReturnState(0)):new U(r,t.returnStates),e.add(o),n.set(o,o),n.set(t,o),o}function K(t,e,n,s){if(t===e)return t;if(t instanceof B&&e instanceof B)return function(t,e,n,s){if(null!==s){let n=s.get(t,e);if(null!==n)return n;if(n=s.get(e,t),null!==n)return n}const i=function(t,e,n){if(n){if(t===M.EMPTY)return M.EMPTY;if(e===M.EMPTY)return M.EMPTY}else{if(t===M.EMPTY&&e===M.EMPTY)return M.EMPTY;if(t===M.EMPTY){const t=[e.returnState,M.EMPTY_RETURN_STATE],n=[e.parentCtx,null];return new U(n,t)}if(e===M.EMPTY){const e=[t.returnState,M.EMPTY_RETURN_STATE],n=[t.parentCtx,null];return new U(n,e)}}return null}(t,e,n);if(null!==i)return null!==s&&s.set(t,e,i),i;if(t.returnState===e.returnState){const i=K(t.parentCtx,e.parentCtx,n,s);if(i===t.parentCtx)return t;if(i===e.parentCtx)return e;const r=B.create(i,t.returnState);return null!==s&&s.set(t,e,r),r}{let n=null;if((t===e||null!==t.parentCtx&&t.parentCtx===e.parentCtx)&&(n=t.parentCtx),null!==n){const i=[t.returnState,e.returnState];t.returnState>e.returnState&&(i[0]=e.returnState,i[1]=t.returnState);const r=new U([n,n],i);return null!==s&&s.set(t,e,r),r}const i=[t.returnState,e.returnState];let r=[t.parentCtx,e.parentCtx];t.returnState>e.returnState&&(i[0]=e.returnState,i[1]=t.returnState,r=[e.parentCtx,t.parentCtx]);const o=new U(r,i);return null!==s&&s.set(t,e,o),o}}(t,e,n,s);if(n){if(t instanceof V)return t;if(e instanceof V)return e}return t instanceof B&&(t=new U([t.getParent()],[t.returnState])),e instanceof B&&(e=new U([e.getParent()],[e.returnState])),function(t,e,n,s){if(null!==s){let n=s.get(t,e);if(null!==n)return M.trace_atn_sim&&console.log("mergeArrays a="+t+",b="+e+" -> previous"),n;if(n=s.get(e,t),null!==n)return M.trace_atn_sim&&console.log("mergeArrays a="+t+",b="+e+" -> previous"),n}let i=0,r=0,o=0,a=new Array(t.returnStates.length+e.returnStates.length).fill(0),l=new Array(t.returnStates.length+e.returnStates.length).fill(null);for(;i<t.returnStates.length&&r<e.returnStates.length;){const h=t.parents[i],c=e.parents[r];if(t.returnStates[i]===e.returnStates[r]){const e=t.returnStates[i];e===M.EMPTY_RETURN_STATE&&null===h&&null===c||null!==h&&null!==c&&h===c?(l[o]=h,a[o]=e):(l[o]=K(h,c,n,s),a[o]=e),i+=1,r+=1}else t.returnStates[i]<e.returnStates[r]?(l[o]=h,a[o]=t.returnStates[i],i+=1):(l[o]=c,a[o]=e.returnStates[r],r+=1);o+=1}if(i<t.returnStates.length)for(let e=i;e<t.returnStates.length;e++)l[o]=t.parents[e],a[o]=t.returnStates[e],o+=1;else for(let t=r;t<e.returnStates.length;t++)l[o]=e.parents[t],a[o]=e.returnStates[t],o+=1;if(o<l.length){if(1===o){const n=B.create(l[0],a[0]);return null!==s&&s.set(t,e,n),n}l=l.slice(0,o),a=a.slice(0,o)}const h=new U(l,a);return h.equals(t)?(null!==s&&s.set(t,e,t),M.trace_atn_sim&&console.log("mergeArrays a="+t+",b="+e+" -> a"),t):h.equals(e)?(null!==s&&s.set(t,e,e),M.trace_atn_sim&&console.log("mergeArrays a="+t+",b="+e+" -> b"),e):(function(t){const e=new z;for(let n=0;n<t.length;n++){const s=t[n];e.containsKey(s)||e.set(s,s)}for(let n=0;n<t.length;n++)t[n]=e.get(t[n])}(l),null!==s&&s.set(t,e,h),M.trace_atn_sim&&console.log("mergeArrays a="+t+",b="+e+" -> "+h),h)}(t,e,n,s)}class Y{constructor(){this.data=new Uint32Array(1)}set(t){Y._checkIndex(t),this._resize(t),this.data[t>>>5]|=1<<t%32}get(t){Y._checkIndex(t);const e=t>>>5;return!(e>=this.data.length||!(this.data[e]&1<<t%32))}clear(t){Y._checkIndex(t);const e=t>>>5;e<this.data.length&&(this.data[e]&=~(1<<t))}or(t){const e=Math.min(this.data.length,t.data.length);for(let n=0;n<e;++n)this.data[n]|=t.data[n];if(this.data.length<t.data.length){this._resize((t.data.length<<5)-1);const n=t.data.length;for(let s=e;s<n;++s)this.data[s]=t.data[s]}}values(){const t=new Array(this.length);let e=0;const n=this.data.length;for(let s=0;s<n;++s){let n=this.data[s];for(;0!==n;){const i=n&-n;t[e++]=(s<<5)+Y._bitCount(i-1),n^=i}}return t}minValue(){for(let t=0;t<this.data.length;++t){let e=this.data[t];if(0!==e){let n=0;for(;!(1&e);)n++,e>>=1;return n+32*t}}return 0}hashCode(){return o.hashStuff(this.values())}equals(t){return t instanceof Y&&e(this.data,t.data)}toString(){return"{"+this.values().join(", ")+"}"}get length(){return this.data.map((t=>Y._bitCount(t))).reduce(((t,e)=>t+e),0)}_resize(t){const e=t+32>>>5;if(e<=this.data.length)return;const n=new Uint32Array(e);n.set(this.data),n.fill(0,this.data.length),this.data=n}static _checkIndex(t){if(t<0)throw new RangeError("index cannot be negative")}static _bitCount(t){return t=(t=(858993459&(t-=t>>1&1431655765))+(t>>2&858993459))+(t>>4)&252645135,t+=t>>8,0+(t+=t>>16)&63}}class G{constructor(t){this.atn=t}getDecisionLookahead(t){if(null===t)return null;const e=t.transitions.length,n=[];for(let s=0;s<e;s++){n[s]=new m;const e=new u,i=!1;this._LOOK(t.transition(s).target,null,M.EMPTY,n[s],e,new Y,i,!1),(0===n[s].length||n[s].contains(G.HIT_PRED))&&(n[s]=null)}return n}LOOK(t,e,n){const s=new m,i=null!==(n=n||null)?q(t.atn,n):null;return this._LOOK(t,e,i,s,new u,new Y,!0,!0),s}_LOOK(e,n,s,i,r,o,a,l){const h=new T({state:e,alt:0,context:s},null);if(!r.has(h)){if(r.add(h),e===n){if(null===s)return void i.addOne(t.EPSILON);if(s.isEmpty()&&l)return void i.addOne(t.EOF)}if(e instanceof _){if(null===s)return void i.addOne(t.EPSILON);if(s.isEmpty()&&l)return void i.addOne(t.EOF);if(s!==M.EMPTY){const t=o.get(e.ruleIndex);try{o.clear(e.ruleIndex);for(let t=0;t<s.length;t++){const e=this.atn.states[s.getReturnState(t)];this._LOOK(e,n,s.getParent(t),i,r,o,a,l)}}finally{t&&o.set(e.ruleIndex)}return}}for(let h=0;h<e.transitions.length;h++){const c=e.transitions[h];if(c.constructor===A){if(o.get(c.target.ruleIndex))continue;const t=B.create(s,c.followState.stateNumber);try{o.set(c.target.ruleIndex),this._LOOK(c.target,n,t,i,r,o,a,l)}finally{o.clear(c.target.ruleIndex)}}else if(c instanceof y)a?this._LOOK(c.target,n,s,i,r,o,a,l):i.addOne(G.HIT_PRED);else if(c.isEpsilon)this._LOOK(c.target,n,s,i,r,o,a,l);else if(c.constructor===I)i.addRange(t.MIN_USER_TOKEN_TYPE,this.atn.maxTokenType);else{let e=c.label;null!==e&&(c instanceof k&&(e=e.complement(t.MIN_USER_TOKEN_TYPE,this.atn.maxTokenType)),i.addSet(e))}}}}}G.HIT_PRED=t.INVALID_TYPE;class j{constructor(t,e){this.grammarType=t,this.maxTokenType=e,this.states=[],this.decisionToState=[],this.ruleToStartState=[],this.ruleToStopState=null,this.modeNameToStartState={},this.ruleToTokenType=null,this.lexerActions=null,this.modeToStartState=[]}nextTokensInContext(t,e){return new G(this).LOOK(t,null,e)}nextTokensNoContext(t){return null!==t.nextTokenWithinRule||(t.nextTokenWithinRule=this.nextTokensInContext(t,null),t.nextTokenWithinRule.readOnly=!0),t.nextTokenWithinRule}nextTokens(t,e){return void 0===e?this.nextTokensNoContext(t):this.nextTokensInContext(t,e)}addState(t){null!==t&&(t.atn=this,t.stateNumber=this.states.length),this.states.push(t)}removeState(t){this.states[t.stateNumber]=null}defineDecisionState(t){return this.decisionToState.push(t),t.decision=this.decisionToState.length-1,t.decision}getDecisionState(t){return 0===this.decisionToState.length?null:this.decisionToState[t]}getExpectedTokens(e,n){if(e<0||e>=this.states.length)throw"Invalid state number.";const s=this.states[e];let i=this.nextTokens(s);if(!i.contains(t.EPSILON))return i;const r=new m;for(r.addSet(i),r.removeOne(t.EPSILON);null!==n&&n.invokingState>=0&&i.contains(t.EPSILON);){const e=this.states[n.invokingState].transitions[0];i=this.nextTokens(e.followState),r.addSet(i),r.removeOne(t.EPSILON),n=n.parentCtx}return i.contains(t.EPSILON)&&r.addOne(t.EOF),r}}j.INVALID_ALT_NUMBER=0;class W extends E{constructor(){super(),this.stateType=E.BASIC}}class $ extends E{constructor(){return super(),this.decision=-1,this.nonGreedy=!1,this}}class X extends ${constructor(){return super(),this.endState=null,this}}class J extends E{constructor(){return super(),this.stateType=E.BLOCK_END,this.startState=null,this}}class Q extends E{constructor(){return super(),this.stateType=E.LOOP_END,this.loopBackState=null,this}}class Z extends E{constructor(){return super(),this.stateType=E.RULE_START,this.stopState=null,this.isPrecedenceRule=!1,this}}class tt extends ${constructor(){return super(),this.stateType=E.TOKEN_START,this}}class et extends ${constructor(){return super(),this.stateType=E.PLUS_LOOP_BACK,this}}class nt extends E{constructor(){return super(),this.stateType=E.STAR_LOOP_BACK,this}}class st extends ${constructor(){return super(),this.stateType=E.STAR_LOOP_ENTRY,this.loopBackState=null,this.isPrecedenceDecision=null,this}}class it extends X{constructor(){return super(),this.stateType=E.PLUS_BLOCK_START,this.loopBackState=null,this}}class rt extends X{constructor(){return super(),this.stateType=E.STAR_BLOCK_START,this}}class ot extends X{constructor(){return super(),this.stateType=E.BLOCK_START,this}}class at extends C{constructor(t,e){super(t),this.label_=e,this.label=this.makeLabel(),this.serializationType=C.ATOM}makeLabel(){const t=new m;return t.addOne(this.label_),t}matches(t,e,n){return this.label_===t}toString(){return this.label_}}class lt extends C{constructor(t,e,n){super(t),this.serializationType=C.RANGE,this.start=e,this.stop=n,this.label=this.makeLabel()}makeLabel(){const t=new m;return t.addRange(this.start,this.stop),t}matches(t,e,n){return t>=this.start&&t<=this.stop}toString(){return"'"+String.fromCharCode(this.start)+"'..'"+String.fromCharCode(this.stop)+"'"}}class ht extends C{constructor(t,e,n,s){super(t),this.serializationType=C.ACTION,this.ruleIndex=e,this.actionIndex=void 0===n?-1:n,this.isCtxDependent=void 0!==s&&s,this.isEpsilon=!0}matches(t,e,n){return!1}toString(){return"action_"+this.ruleIndex+":"+this.actionIndex}}class ct extends C{constructor(t,e){super(t),this.serializationType=C.EPSILON,this.isEpsilon=!0,this.outermostPrecedenceReturn=e}matches(t,e,n){return!1}toString(){return"epsilon"}}class ut extends d{constructor(t,e,n){super(),this.ruleIndex=void 0===t?-1:t,this.predIndex=void 0===e?-1:e,this.isCtxDependent=void 0!==n&&n}evaluate(t,e){const n=this.isCtxDependent?e:null;return t.sempred(n,this.ruleIndex,this.predIndex)}updateHashCode(t){t.update(this.ruleIndex,this.predIndex,this.isCtxDependent)}equals(t){return this===t||t instanceof ut&&this.ruleIndex===t.ruleIndex&&this.predIndex===t.predIndex&&this.isCtxDependent===t.isCtxDependent}toString(){return"{"+this.ruleIndex+":"+this.predIndex+"}?"}}d.NONE=new ut;class dt extends y{constructor(t,e,n,s){super(t),this.serializationType=C.PREDICATE,this.ruleIndex=e,this.predIndex=n,this.isCtxDependent=s,this.isEpsilon=!0}matches(t,e,n){return!1}getPredicate(){return new ut(this.ruleIndex,this.predIndex,this.isCtxDependent)}toString(){return"pred_"+this.ruleIndex+":"+this.predIndex}}class gt extends d{constructor(t){super(),this.precedence=void 0===t?0:t}evaluate(t,e){return t.precpred(e,this.precedence)}evalPrecedence(t,e){return t.precpred(e,this.precedence)?d.NONE:null}compareTo(t){return this.precedence-t.precedence}updateHashCode(t){t.update(this.precedence)}equals(t){return this===t||t instanceof gt&&this.precedence===t.precedence}toString(){return"{"+this.precedence+">=prec}?"}}d.PrecedencePredicate=gt;class pt extends y{constructor(t,e){super(t),this.serializationType=C.PRECEDENCE,this.precedence=e,this.isEpsilon=!0}matches(t,e,n){return!1}getPredicate(){return new gt(this.precedence)}toString(){return this.precedence+" >= _p"}}class ft{constructor(t){void 0===t&&(t=null),this.readOnly=!1,this.verifyATN=null===t||t.verifyATN,this.generateRuleBypassTransitions=null!==t&&t.generateRuleBypassTransitions}}ft.defaultOptions=new ft,ft.defaultOptions.readOnly=!0;class xt{constructor(t){this.actionType=t,this.isPositionDependent=!1}hashCode(){const t=new o;return this.updateHashCode(t),t.finish()}updateHashCode(t){t.update(this.actionType)}equals(t){return this===t}}class Tt extends xt{constructor(){super(6)}execute(t){t.skip()}toString(){return"skip"}}Tt.INSTANCE=new Tt;class St extends xt{constructor(t){super(0),this.channel=t}execute(t){t._channel=this.channel}updateHashCode(t){t.update(this.actionType,this.channel)}equals(t){return this===t||t instanceof St&&this.channel===t.channel}toString(){return"channel("+this.channel+")"}}class mt extends xt{constructor(t,e){super(1),this.ruleIndex=t,this.actionIndex=e,this.isPositionDependent=!0}execute(t){t.action(null,this.ruleIndex,this.actionIndex)}updateHashCode(t){t.update(this.actionType,this.ruleIndex,this.actionIndex)}equals(t){return this===t||t instanceof mt&&this.ruleIndex===t.ruleIndex&&this.actionIndex===t.actionIndex}}class Et extends xt{constructor(){super(3)}execute(t){t.more()}toString(){return"more"}}Et.INSTANCE=new Et;class _t extends xt{constructor(t){super(7),this.type=t}execute(t){t.type=this.type}updateHashCode(t){t.update(this.actionType,this.type)}equals(t){return this===t||t instanceof _t&&this.type===t.type}toString(){return"type("+this.type+")"}}class Ct extends xt{constructor(t){super(5),this.mode=t}execute(t){t.pushMode(this.mode)}updateHashCode(t){t.update(this.actionType,this.mode)}equals(t){return this===t||t instanceof Ct&&this.mode===t.mode}toString(){return"pushMode("+this.mode+")"}}class At extends xt{constructor(){super(4)}execute(t){t.popMode()}toString(){return"popMode"}}At.INSTANCE=new At;class Nt extends xt{constructor(t){super(2),this.mode=t}execute(t){t.setMode(this.mode)}updateHashCode(t){t.update(this.actionType,this.mode)}equals(t){return this===t||t instanceof Nt&&this.mode===t.mode}toString(){return"mode("+this.mode+")"}}function kt(t,e){const n=[];return n[t-1]=e,n.map((function(t){return e}))}class It{constructor(t){null==t&&(t=ft.defaultOptions),this.deserializationOptions=t,this.stateFactories=null,this.actionFactories=null}deserialize(t){const e=this.reset(t);this.checkVersion(e),e&&this.skipUUID();const n=this.readATN();this.readStates(n,e),this.readRules(n,e),this.readModes(n);const s=[];return this.readSets(n,s,this.readInt.bind(this)),e&&this.readSets(n,s,this.readInt32.bind(this)),this.readEdges(n,s),this.readDecisions(n),this.readLexerActions(n,e),this.markPrecedenceDecisions(n),this.verifyATN(n),this.deserializationOptions.generateRuleBypassTransitions&&1===n.grammarType&&(this.generateRuleBypassTransitions(n),this.verifyATN(n)),n}reset(t){if(3===(t.charCodeAt?t.charCodeAt(0):t[0])){const e=function(t){const e=t.charCodeAt(0);return e>1?e-2:e+65534},n=t.split("").map(e);return n[0]=t.charCodeAt(0),this.data=n,this.pos=0,!0}return this.data=t,this.pos=0,!1}skipUUID(){let t=0;for(;t++<8;)this.readInt()}checkVersion(t){const e=this.readInt();if(!t&&4!==e)throw"Could not deserialize ATN with version "+e+" (expected 4)."}readATN(){const t=this.readInt(),e=this.readInt();return new j(t,e)}readStates(t,e){let n,s,i;const r=[],o=[],a=this.readInt();for(let n=0;n<a;n++){const n=this.readInt();if(n===E.INVALID_TYPE){t.addState(null);continue}let s=this.readInt();e&&65535===s&&(s=-1);const i=this.stateFactory(n,s);if(n===E.LOOP_END){const t=this.readInt();r.push([i,t])}else if(i instanceof X){const t=this.readInt();o.push([i,t])}t.addState(i)}for(n=0;n<r.length;n++)s=r[n],s[0].loopBackState=t.states[s[1]];for(n=0;n<o.length;n++)s=o[n],s[0].endState=t.states[s[1]];let l=this.readInt();for(n=0;n<l;n++)i=this.readInt(),t.states[i].nonGreedy=!0;let h=this.readInt();for(n=0;n<h;n++)i=this.readInt(),t.states[i].isPrecedenceRule=!0}readRules(e,n){let s;const i=this.readInt();for(0===e.grammarType&&(e.ruleToTokenType=kt(i,0)),e.ruleToStartState=kt(i,0),s=0;s<i;s++){const i=this.readInt();if(e.ruleToStartState[s]=e.states[i],0===e.grammarType){let i=this.readInt();n&&65535===i&&(i=t.EOF),e.ruleToTokenType[s]=i}}for(e.ruleToStopState=kt(i,0),s=0;s<e.states.length;s++){const t=e.states[s];t instanceof _&&(e.ruleToStopState[t.ruleIndex]=t,e.ruleToStartState[t.ruleIndex].stopState=t)}}readModes(t){const e=this.readInt();for(let n=0;n<e;n++){let e=this.readInt();t.modeToStartState.push(t.states[e])}}readSets(t,e,n){const s=this.readInt();for(let t=0;t<s;t++){const t=new m;e.push(t);const s=this.readInt();0!==this.readInt()&&t.addOne(-1);for(let e=0;e<s;e++){const e=n(),s=n();t.addRange(e,s)}}}readEdges(t,e){let n,s,i,r,o;const a=this.readInt();for(n=0;n<a;n++){const n=this.readInt(),s=this.readInt(),i=this.readInt(),o=this.readInt(),a=this.readInt(),l=this.readInt();r=this.edgeFactory(t,i,n,s,o,a,l,e),t.states[n].addTransition(r)}for(n=0;n<t.states.length;n++)for(i=t.states[n],s=0;s<i.transitions.length;s++){const e=i.transitions[s];if(!(e instanceof A))continue;let n=-1;t.ruleToStartState[e.target.ruleIndex].isPrecedenceRule&&0===e.precedence&&(n=e.target.ruleIndex),r=new ct(e.followState,n),t.ruleToStopState[e.target.ruleIndex].addTransition(r)}for(n=0;n<t.states.length;n++){if(i=t.states[n],i instanceof X){if(null===i.endState)throw"IllegalState";if(null!==i.endState.startState)throw"IllegalState";i.endState.startState=i}if(i instanceof et)for(s=0;s<i.transitions.length;s++)o=i.transitions[s].target,o instanceof it&&(o.loopBackState=i);else if(i instanceof nt)for(s=0;s<i.transitions.length;s++)o=i.transitions[s].target,o instanceof st&&(o.loopBackState=i)}}readDecisions(t){const e=this.readInt();for(let n=0;n<e;n++){const e=this.readInt(),s=t.states[e];t.decisionToState.push(s),s.decision=n}}readLexerActions(t,e){if(0===t.grammarType){const n=this.readInt();t.lexerActions=kt(n,null);for(let s=0;s<n;s++){const n=this.readInt();let i=this.readInt();e&&65535===i&&(i=-1);let r=this.readInt();e&&65535===r&&(r=-1),t.lexerActions[s]=this.lexerActionFactory(n,i,r)}}}generateRuleBypassTransitions(t){let e;const n=t.ruleToStartState.length;for(e=0;e<n;e++)t.ruleToTokenType[e]=t.maxTokenType+e+1;for(e=0;e<n;e++)this.generateRuleBypassTransition(t,e)}generateRuleBypassTransition(t,e){let n,s;const i=new ot;i.ruleIndex=e,t.addState(i);const r=new J;r.ruleIndex=e,t.addState(r),i.endState=r,t.defineDecisionState(i),r.startState=i;let o=null,a=null;if(t.ruleToStartState[e].isPrecedenceRule){for(a=null,n=0;n<t.states.length;n++)if(s=t.states[n],this.stateIsEndStateFor(s,e)){a=s,o=s.loopBackState.transitions[0];break}if(null===o)throw"Couldn't identify final state of the precedence rule prefix section."}else a=t.ruleToStopState[e];for(n=0;n<t.states.length;n++){s=t.states[n];for(let t=0;t<s.transitions.length;t++){const e=s.transitions[t];e!==o&&e.target===a&&(e.target=r)}}const l=t.ruleToStartState[e],h=l.transitions.length;for(;h>0;)i.addTransition(l.transitions[h-1]),l.transitions=l.transitions.slice(-1);t.ruleToStartState[e].addTransition(new ct(i)),r.addTransition(new ct(a));const c=new W;t.addState(c),c.addTransition(new at(r,t.ruleToTokenType[e])),i.addTransition(new ct(c))}stateIsEndStateFor(t,e){if(t.ruleIndex!==e)return null;if(!(t instanceof st))return null;const n=t.transitions[t.transitions.length-1].target;return n instanceof Q&&n.epsilonOnlyTransitions&&n.transitions[0].target instanceof _?t:null}markPrecedenceDecisions(t){for(let e=0;e<t.states.length;e++){const n=t.states[e];if(n instanceof st&&t.ruleToStartState[n.ruleIndex].isPrecedenceRule){const t=n.transitions[n.transitions.length-1].target;t instanceof Q&&t.epsilonOnlyTransitions&&t.transitions[0].target instanceof _&&(n.isPrecedenceDecision=!0)}}}verifyATN(t){if(this.deserializationOptions.verifyATN)for(let e=0;e<t.states.length;e++){const n=t.states[e];if(null!==n)if(this.checkCondition(n.epsilonOnlyTransitions||n.transitions.length<=1),n instanceof it)this.checkCondition(null!==n.loopBackState);else if(n instanceof st)if(this.checkCondition(null!==n.loopBackState),this.checkCondition(2===n.transitions.length),n.transitions[0].target instanceof rt)this.checkCondition(n.transitions[1].target instanceof Q),this.checkCondition(!n.nonGreedy);else{if(!(n.transitions[0].target instanceof Q))throw"IllegalState";this.checkCondition(n.transitions[1].target instanceof rt),this.checkCondition(n.nonGreedy)}else n instanceof nt?(this.checkCondition(1===n.transitions.length),this.checkCondition(n.transitions[0].target instanceof st)):n instanceof Q?this.checkCondition(null!==n.loopBackState):n instanceof Z?this.checkCondition(null!==n.stopState):n instanceof X?this.checkCondition(null!==n.endState):n instanceof J?this.checkCondition(null!==n.startState):n instanceof $?this.checkCondition(n.transitions.length<=1||n.decision>=0):this.checkCondition(n.transitions.length<=1||n instanceof _)}}checkCondition(t,e){if(!t)throw null==e&&(e="IllegalState"),e}readInt(){return this.data[this.pos++]}readInt32(){return this.readInt()|this.readInt()<<16}edgeFactory(e,n,s,i,r,o,a,l){const h=e.states[i];switch(n){case C.EPSILON:return new ct(h);case C.RANGE:return new lt(h,0!==a?t.EOF:r,o);case C.RULE:return new A(e.states[r],o,a,h);case C.PREDICATE:return new dt(h,r,o,0!==a);case C.PRECEDENCE:return new pt(h,r);case C.ATOM:return new at(h,0!==a?t.EOF:r);case C.ACTION:return new ht(h,r,o,0!==a);case C.SET:return new N(h,l[r]);case C.NOT_SET:return new k(h,l[r]);case C.WILDCARD:return new I(h);default:throw"The specified transition type: "+n+" is not valid."}}stateFactory(t,e){if(null===this.stateFactories){const t=[];t[E.INVALID_TYPE]=null,t[E.BASIC]=()=>new W,t[E.RULE_START]=()=>new Z,t[E.BLOCK_START]=()=>new ot,t[E.PLUS_BLOCK_START]=()=>new it,t[E.STAR_BLOCK_START]=()=>new rt,t[E.TOKEN_START]=()=>new tt,t[E.RULE_STOP]=()=>new _,t[E.BLOCK_END]=()=>new J,t[E.STAR_LOOP_BACK]=()=>new nt,t[E.STAR_LOOP_ENTRY]=()=>new st,t[E.PLUS_LOOP_BACK]=()=>new et,t[E.LOOP_END]=()=>new Q,this.stateFactories=t}if(t>this.stateFactories.length||null===this.stateFactories[t])throw"The specified state type "+t+" is not valid.";{const n=this.stateFactories[t]();if(null!==n)return n.ruleIndex=e,n}}lexerActionFactory(t,e,n){if(null===this.actionFactories){const t=[];t[0]=(t,e)=>new St(t),t[1]=(t,e)=>new mt(t,e),t[2]=(t,e)=>new Nt(t),t[3]=(t,e)=>Et.INSTANCE,t[4]=(t,e)=>At.INSTANCE,t[5]=(t,e)=>new Ct(t),t[6]=(t,e)=>Tt.INSTANCE,t[7]=(t,e)=>new _t(t),this.actionFactories=t}if(t>this.actionFactories.length||null===this.actionFactories[t])throw"The specified lexer action type "+t+" is not valid.";return this.actionFactories[t](e,n)}}class yt{syntaxError(t,e,n,s,i,r){}reportAmbiguity(t,e,n,s,i,r,o){}reportAttemptingFullContext(t,e,n,s,i,r){}reportContextSensitivity(t,e,n,s,i,r){}}class Lt extends yt{constructor(){super()}syntaxError(t,e,n,s,i,r){console.error("line "+n+":"+s+" "+i)}}Lt.INSTANCE=new Lt;class Ot extends yt{constructor(t){if(super(),null===t)throw"delegates";return this.delegates=t,this}syntaxError(t,e,n,s,i,r){this.delegates.map((o=>o.syntaxError(t,e,n,s,i,r)))}reportAmbiguity(t,e,n,s,i,r,o){this.delegates.map((a=>a.reportAmbiguity(t,e,n,s,i,r,o)))}reportAttemptingFullContext(t,e,n,s,i,r){this.delegates.map((o=>o.reportAttemptingFullContext(t,e,n,s,i,r)))}reportContextSensitivity(t,e,n,s,i,r){this.delegates.map((o=>o.reportContextSensitivity(t,e,n,s,i,r)))}}class Rt{constructor(){this._listeners=[Lt.INSTANCE],this._interp=null,this._stateNumber=-1}checkVersion(t){const e="4.13.2";e!==t&&console.log("ANTLR runtime and generated code versions disagree: "+e+"!="+t)}addErrorListener(t){this._listeners.push(t)}removeErrorListeners(){this._listeners=[]}getLiteralNames(){return Object.getPrototypeOf(this).constructor.literalNames||[]}getSymbolicNames(){return Object.getPrototypeOf(this).constructor.symbolicNames||[]}getTokenNames(){if(!this.tokenNames){const t=this.getLiteralNames(),e=this.getSymbolicNames(),n=t.length>e.length?t.length:e.length;this.tokenNames=[];for(let s=0;s<n;s++)this.tokenNames[s]=t[s]||e[s]||"<INVALID"}return this.tokenNames}getTokenTypeMap(){const e=this.getTokenNames();if(null===e)throw"The current recognizer does not provide a list of token names.";let n=this.tokenTypeMapCache[e];return void 0===n&&(n=e.reduce((function(t,e,n){t[e]=n})),n.EOF=t.EOF,this.tokenTypeMapCache[e]=n),n}getRuleIndexMap(){const t=this.ruleNames;if(null===t)throw"The current recognizer does not provide a list of rule names.";let e=this.ruleIndexMapCache[t];return void 0===e&&(e=t.reduce((function(t,e,n){t[e]=n})),this.ruleIndexMapCache[t]=e),e}getTokenType(e){const n=this.getTokenTypeMap()[e];return void 0!==n?n:t.INVALID_TYPE}getErrorHeader(t){return"line "+t.getOffendingToken().line+":"+t.getOffendingToken().column}getTokenErrorDisplay(e){if(null===e)return"<no token>";let n=e.text;return null===n&&(n=e.type===t.EOF?"<EOF>":"<"+e.type+">"),n=n.replace("\n","\\n").replace("\r","\\r").replace("\t","\\t"),"'"+n+"'"}getErrorListenerDispatch(){return console.warn("Calling deprecated method in Recognizer class: getErrorListenerDispatch()"),this.getErrorListener()}getErrorListener(){return new Ot(this._listeners)}sempred(t,e,n){return!0}precpred(t,e){return!0}get atn(){return this._interp.atn}get state(){return this._stateNumber}set state(t){this._stateNumber=t}}Rt.tokenTypeMapCache={},Rt.ruleIndexMapCache={};class vt extends t{constructor(e,n,s,i,r){super(),this.source=void 0!==e?e:vt.EMPTY_SOURCE,this.type=void 0!==n?n:null,this.channel=void 0!==s?s:t.DEFAULT_CHANNEL,this.start=void 0!==i?i:-1,this.stop=void 0!==r?r:-1,this.tokenIndex=-1,null!==this.source[0]?(this.line=e[0].line,this.column=e[0].column):this.column=-1}clone(){const t=new vt(this.source,this.type,this.channel,this.start,this.stop);return t.tokenIndex=this.tokenIndex,t.line=this.line,t.column=this.column,t.text=this.text,t}cloneWithType(e){const n=new vt(this.source,e,this.channel,this.start,this.stop);return n.tokenIndex=this.tokenIndex,n.line=this.line,n.column=this.column,e===t.EOF&&(n.text=""),n}toString(){let t=this.text;return t=null!==t?t.replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t"):"<no text>","[@"+this.tokenIndex+","+this.start+":"+this.stop+"='"+t+"',<"+this.type+">"+(this.channel>0?",channel="+this.channel:"")+","+this.line+":"+this.column+"]"}get text(){if(null!==this._text)return this._text;const t=this.getInputStream();if(null===t)return null;const e=t.size;return this.start<e&&this.stop<e?t.getText(this.start,this.stop):"<EOF>"}set text(t){this._text=t}}vt.EMPTY_SOURCE=[null,null];class wt{}class Pt extends wt{constructor(t){super(),this.copyText=void 0!==t&&t}create(t,e,n,s,i,r,o,a){const l=new vt(t,e,s,i,r);return l.line=o,l.column=a,null!==n?l.text=n:this.copyText&&null!==t[1]&&(l.text=t[1].getText(i,r)),l}createThin(t,e){const n=new vt(null,t);return n.text=e,n}}Pt.DEFAULT=new Pt;class bt extends Error{constructor(t){super(t.message),Error.captureStackTrace&&Error.captureStackTrace(this,bt),this.message=t.message,this.recognizer=t.recognizer,this.input=t.input,this.ctx=t.ctx,this.offendingToken=null,this.offendingState=-1,null!==this.recognizer&&(this.offendingState=this.recognizer.state)}getExpectedTokens(){return null!==this.recognizer?this.recognizer.atn.getExpectedTokens(this.offendingState,this.ctx):null}toString(){return this.message}}class Dt extends bt{constructor(t,e,n,s){super({message:"",recognizer:t,input:e,ctx:null}),this.startIndex=n,this.deadEndConfigs=s}toString(){let t="";return this.startIndex>=0&&this.startIndex<this.input.size&&(t=this.input.getText(new S(this.startIndex,this.startIndex))),"LexerNoViableAltException"+t}}class Ft extends Rt{constructor(e){super(),this._input=e,this._factory=Pt.DEFAULT,this._tokenFactorySourcePair=[this,e],this._interp=null,this._token=null,this._tokenStartCharIndex=-1,this._tokenStartLine=-1,this._tokenStartColumn=-1,this._hitEOF=!1,this._channel=t.DEFAULT_CHANNEL,this._type=t.INVALID_TYPE,this._modeStack=[],this._mode=Ft.DEFAULT_MODE,this._text=null}reset(){null!==this._input&&this._input.seek(0),this._token=null,this._type=t.INVALID_TYPE,this._channel=t.DEFAULT_CHANNEL,this._tokenStartCharIndex=-1,this._tokenStartColumn=-1,this._tokenStartLine=-1,this._text=null,this._hitEOF=!1,this._mode=Ft.DEFAULT_MODE,this._modeStack=[],this._interp.reset()}nextToken(){if(null===this._input)throw"nextToken requires a non-null input stream.";const e=this._input.mark();try{for(;;){if(this._hitEOF)return this.emitEOF(),this._token;this._token=null,this._channel=t.DEFAULT_CHANNEL,this._tokenStartCharIndex=this._input.index,this._tokenStartColumn=this._interp.column,this._tokenStartLine=this._interp.line,this._text=null;let e=!1;for(;;){this._type=t.INVALID_TYPE;let n=Ft.SKIP;try{n=this._interp.match(this._input,this._mode)}catch(t){if(!(t instanceof bt))throw console.log(t.stack),t;this.notifyListeners(t),this.recover(t)}if(this._input.LA(1)===t.EOF&&(this._hitEOF=!0),this._type===t.INVALID_TYPE&&(this._type=n),this._type===Ft.SKIP){e=!0;break}if(this._type!==Ft.MORE)break}if(!e)return null===this._token&&this.emit(),this._token}}finally{this._input.release(e)}}skip(){this._type=Ft.SKIP}more(){this._type=Ft.MORE}mode(t){console.warn("Calling deprecated method in Lexer class: mode(...)"),this.setMode(t)}setMode(t){this._mode=t}getMode(){return this._mode}getModeStack(){return this._modeStack}pushMode(t){this._interp.debug&&console.log("pushMode "+t),this._modeStack.push(this._mode),this.setMode(t)}popMode(){if(0===this._modeStack.length)throw"Empty Stack";return this._interp.debug&&console.log("popMode back to "+this._modeStack.slice(0,-1)),this.setMode(this._modeStack.pop()),this._mode}emitToken(t){this._token=t}emit(){const t=this._factory.create(this._tokenFactorySourcePair,this._type,this._text,this._channel,this._tokenStartCharIndex,this.getCharIndex()-1,this._tokenStartLine,this._tokenStartColumn);return this.emitToken(t),t}emitEOF(){const e=this.column,n=this.line,s=this._factory.create(this._tokenFactorySourcePair,t.EOF,null,t.DEFAULT_CHANNEL,this._input.index,this._input.index-1,n,e);return this.emitToken(s),s}getCharIndex(){return this._input.index}getAllTokens(){const e=[];let n=this.nextToken();for(;n.type!==t.EOF;)e.push(n),n=this.nextToken();return e}notifyListeners(t){const e=this._tokenStartCharIndex,n=this._input.index,s=this._input.getText(e,n),i="token recognition error at: '"+this.getErrorDisplay(s)+"'";this.getErrorListener().syntaxError(this,null,this._tokenStartLine,this._tokenStartColumn,i,t)}getErrorDisplay(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n]);return e.join("")}getErrorDisplayForChar(e){return e.charCodeAt(0)===t.EOF?"<EOF>":"\n"===e?"\\n":"\t"===e?"\\t":"\r"===e?"\\r":e}getCharErrorDisplay(t){return"'"+this.getErrorDisplayForChar(t)+"'"}recover(e){this._input.LA(1)!==t.EOF&&(e instanceof Dt?this._interp.consume(this._input):this._input.consume())}get inputStream(){return this._input}set inputStream(t){this._input=null,this._tokenFactorySourcePair=[this,this._input],this.reset(),this._input=t,this._tokenFactorySourcePair=[this,this._input]}get sourceName(){return this._input.sourceName}get type(){return this._type}set type(t){this._type=t}get line(){return this._interp.line}set line(t){this._interp.line=t}get column(){return this._interp.column}set column(t){this._interp.column=t}get text(){return null!==this._text?this._text:this._interp.getText(this._input)}set text(t){this._text=t}}function Mt(t){return t.hashCodeForConfigSet()}function Ut(t,e){return t===e||null!==t&&null!==e&&t.equalsForConfigSet(e)}Ft.DEFAULT_MODE=0,Ft.MORE=-2,Ft.SKIP=-3,Ft.DEFAULT_TOKEN_CHANNEL=t.DEFAULT_CHANNEL,Ft.HIDDEN=t.HIDDEN_CHANNEL,Ft.MIN_CHAR_VALUE=0,Ft.MAX_CHAR_VALUE=1114111;class Bt{constructor(t){this.configLookup=new u(Mt,Ut),this.fullCtx=void 0===t||t,this.readOnly=!1,this.configs=[],this.uniqueAlt=0,this.conflictingAlts=null,this.hasSemanticContext=!1,this.dipsIntoOuterContext=!1,this.cachedHashCode=-1}add(t,e){if(void 0===e&&(e=null),this.readOnly)throw"This set is readonly";t.semanticContext!==d.NONE&&(this.hasSemanticContext=!0),t.reachesIntoOuterContext>0&&(this.dipsIntoOuterContext=!0);const n=this.configLookup.getOrAdd(t);if(n===t)return this.cachedHashCode=-1,this.configs.push(t),!0;const s=!this.fullCtx,i=K(n.context,t.context,s,e);return n.reachesIntoOuterContext=Math.max(n.reachesIntoOuterContext,t.reachesIntoOuterContext),t.precedenceFilterSuppressed&&(n.precedenceFilterSuppressed=!0),n.context=i,!0}getStates(){const t=new u;for(let e=0;e<this.configs.length;e++)t.add(this.configs[e].state);return t}getPredicates(){const t=[];for(let e=0;e<this.configs.length;e++){const n=this.configs[e].semanticContext;n!==d.NONE&&t.push(n.semanticContext)}return t}optimizeConfigs(t){if(this.readOnly)throw"This set is readonly";if(0!==this.configLookup.length)for(let e=0;e<this.configs.length;e++){const n=this.configs[e];n.context=t.getCachedContext(n.context)}}addAll(t){for(let e=0;e<t.length;e++)this.add(t[e]);return!1}equals(t){return this===t||t instanceof Bt&&e(this.configs,t.configs)&&this.fullCtx===t.fullCtx&&this.uniqueAlt===t.uniqueAlt&&this.conflictingAlts===t.conflictingAlts&&this.hasSemanticContext===t.hasSemanticContext&&this.dipsIntoOuterContext===t.dipsIntoOuterContext}hashCode(){const t=new o;return t.update(this.configs),t.finish()}updateHashCode(t){this.readOnly?(-1===this.cachedHashCode&&(this.cachedHashCode=this.hashCode()),t.update(this.cachedHashCode)):t.update(this.hashCode())}isEmpty(){return 0===this.configs.length}contains(t){if(null===this.configLookup)throw"This method is not implemented for readonly sets.";return this.configLookup.contains(t)}containsFast(t){if(null===this.configLookup)throw"This method is not implemented for readonly sets.";return this.configLookup.containsFast(t)}clear(){if(this.readOnly)throw"This set is readonly";this.configs=[],this.cachedHashCode=-1,this.configLookup=new u}setReadonly(t){this.readOnly=t,t&&(this.configLookup=null)}toString(){return c(this.configs)+(this.hasSemanticContext?",hasSemanticContext="+this.hasSemanticContext:"")+(this.uniqueAlt!==j.INVALID_ALT_NUMBER?",uniqueAlt="+this.uniqueAlt:"")+(null!==this.conflictingAlts?",conflictingAlts="+this.conflictingAlts:"")+(this.dipsIntoOuterContext?",dipsIntoOuterContext":"")}get items(){return this.configs}get length(){return this.configs.length}}class Vt{constructor(t,e){return null===t&&(t=-1),null===e&&(e=new Bt),this.stateNumber=t,this.configs=e,this.edges=null,this.isAcceptState=!1,this.prediction=0,this.lexerActionExecutor=null,this.requiresFullContext=!1,this.predicates=null,this}getAltSet(){const t=new u;if(null!==this.configs)for(let e=0;e<this.configs.length;e++){const n=this.configs[e];t.add(n.alt)}return 0===t.length?null:t}equals(t){return this===t||t instanceof Vt&&this.configs.equals(t.configs)}toString(){let t=this.stateNumber+":"+this.configs;return this.isAcceptState&&(t+="=>",null!==this.predicates?t+=this.predicates:t+=this.prediction),t}hashCode(){const t=new o;return t.update(this.configs),t.finish()}}class zt{constructor(t,e){return this.atn=t,this.sharedContextCache=e,this}getCachedContext(t){if(null===this.sharedContextCache)return t;const e=new z;return H(t,this.sharedContextCache,e)}}zt.ERROR=new Vt(2147483647,new Bt);class qt extends Bt{constructor(){super(),this.configLookup=new u}}class Ht extends T{constructor(t,e){super(t,e);const n=t.lexerActionExecutor||null;return this.lexerActionExecutor=n||(null!==e?e.lexerActionExecutor:null),this.passedThroughNonGreedyDecision=null!==e&&this.checkNonGreedyDecision(e,this.state),this.hashCodeForConfigSet=Ht.prototype.hashCode,this.equalsForConfigSet=Ht.prototype.equals,this}updateHashCode(t){t.update(this.state.stateNumber,this.alt,this.context,this.semanticContext,this.passedThroughNonGreedyDecision,this.lexerActionExecutor)}equals(t){return this===t||t instanceof Ht&&this.passedThroughNonGreedyDecision===t.passedThroughNonGreedyDecision&&(this.lexerActionExecutor?this.lexerActionExecutor.equals(t.lexerActionExecutor):!t.lexerActionExecutor)&&super.equals(t)}checkNonGreedyDecision(t,e){return t.passedThroughNonGreedyDecision||e instanceof $&&e.nonGreedy}}class Kt extends xt{constructor(t,e){super(e.actionType),this.offset=t,this.action=e,this.isPositionDependent=!0}execute(t){this.action.execute(t)}updateHashCode(t){t.update(this.actionType,this.offset,this.action)}equals(t){return this===t||t instanceof Kt&&this.offset===t.offset&&this.action===t.action}}class Yt{constructor(t){return this.lexerActions=null===t?[]:t,this.cachedHashCode=o.hashStuff(t),this}fixOffsetBeforeMatch(t){let e=null;for(let n=0;n<this.lexerActions.length;n++)!this.lexerActions[n].isPositionDependent||this.lexerActions[n]instanceof Kt||(null===e&&(e=this.lexerActions.concat([])),e[n]=new Kt(t,this.lexerActions[n]));return null===e?this:new Yt(e)}execute(t,e,n){let s=!1;const i=e.index;try{for(let r=0;r<this.lexerActions.length;r++){let o=this.lexerActions[r];if(o instanceof Kt){const t=o.offset;e.seek(n+t),o=o.action,s=n+t!==i}else o.isPositionDependent&&(e.seek(i),s=!1);o.execute(t)}}finally{s&&e.seek(i)}}hashCode(){return this.cachedHashCode}updateHashCode(t){t.update(this.cachedHashCode)}equals(t){if(this===t)return!0;if(t instanceof Yt){if(this.cachedHashCode!=t.cachedHashCode)return!1;if(this.lexerActions.length!=t.lexerActions.length)return!1;{const e=this.lexerActions.length;for(let n=0;n<e;++n)if(!this.lexerActions[n].equals(t.lexerActions[n]))return!1;return!0}}return!1}static append(t,e){if(null===t)return new Yt([e]);const n=t.lexerActions.concat([e]);return new Yt(n)}}function Gt(t){t.index=-1,t.line=0,t.column=-1,t.dfaState=null}class jt{constructor(){Gt(this)}reset(){Gt(this)}}class Wt extends zt{constructor(t,e,n,s){super(e,s),this.decisionToDFA=n,this.recog=t,this.startIndex=-1,this.line=1,this.column=0,this.mode=Ft.DEFAULT_MODE,this.prevAccept=new jt}copyState(t){this.column=t.column,this.line=t.line,this.mode=t.mode,this.startIndex=t.startIndex}match(t,e){this.mode=e;const n=t.mark();try{this.startIndex=t.index,this.prevAccept.reset();const n=this.decisionToDFA[e];return null===n.s0?this.matchATN(t):this.execATN(t,n.s0)}finally{t.release(n)}}reset(){this.prevAccept.reset(),this.startIndex=-1,this.line=1,this.column=0,this.mode=Ft.DEFAULT_MODE}matchATN(t){const e=this.atn.modeToStartState[this.mode];Wt.debug&&console.log("matchATN mode "+this.mode+" start: "+e);const n=this.mode,s=this.computeStartState(t,e),i=s.hasSemanticContext;s.hasSemanticContext=!1;const r=this.addDFAState(s);i||(this.decisionToDFA[this.mode].s0=r);const o=this.execATN(t,r);return Wt.debug&&console.log("DFA after matchATN: "+this.decisionToDFA[n].toLexerString()),o}execATN(e,n){Wt.debug&&console.log("start state closure="+n.configs),n.isAcceptState&&this.captureSimState(this.prevAccept,e,n);let s=e.LA(1),i=n;for(;;){Wt.debug&&console.log("execATN loop starting closure: "+i.configs);let n=this.getExistingTargetState(i,s);if(null===n&&(n=this.computeTargetState(e,i,s)),n===zt.ERROR)break;if(s!==t.EOF&&this.consume(e),n.isAcceptState&&(this.captureSimState(this.prevAccept,e,n),s===t.EOF))break;s=e.LA(1),i=n}return this.failOrAccept(this.prevAccept,e,i.configs,s)}getExistingTargetState(t,e){if(null===t.edges||e<Wt.MIN_DFA_EDGE||e>Wt.MAX_DFA_EDGE)return null;let n=t.edges[e-Wt.MIN_DFA_EDGE];return void 0===n&&(n=null),Wt.debug&&null!==n&&console.log("reuse state "+t.stateNumber+" edge to "+n.stateNumber),n}computeTargetState(t,e,n){const s=new qt;return this.getReachableConfigSet(t,e.configs,s,n),0===s.items.length?(s.hasSemanticContext||this.addDFAEdge(e,n,zt.ERROR),zt.ERROR):this.addDFAEdge(e,n,null,s)}failOrAccept(e,n,s,i){if(null!==this.prevAccept.dfaState){const t=e.dfaState.lexerActionExecutor;return this.accept(n,t,this.startIndex,e.index,e.line,e.column),e.dfaState.prediction}if(i===t.EOF&&n.index===this.startIndex)return t.EOF;throw new Dt(this.recog,n,this.startIndex,s)}getReachableConfigSet(e,n,s,i){let r=j.INVALID_ALT_NUMBER;for(let o=0;o<n.items.length;o++){const a=n.items[o],l=a.alt===r;if(!l||!a.passedThroughNonGreedyDecision){Wt.debug&&console.log("testing %s at %s\n",this.getTokenName(i),a.toString(this.recog,!0));for(let n=0;n<a.state.transitions.length;n++){const o=a.state.transitions[n],h=this.getReachableTarget(o,i);if(null!==h){let n=a.lexerActionExecutor;null!==n&&(n=n.fixOffsetBeforeMatch(e.index-this.startIndex));const o=i===t.EOF,c=new Ht({state:h,lexerActionExecutor:n},a);this.closure(e,c,s,l,!0,o)&&(r=a.alt)}}}}}accept(t,e,n,s,i,r){Wt.debug&&console.log("ACTION %s\n",e),t.seek(s),this.line=i,this.column=r,null!==e&&null!==this.recog&&e.execute(this.recog,t,n)}getReachableTarget(t,e){return t.matches(e,0,Ft.MAX_CHAR_VALUE)?t.target:null}computeStartState(t,e){const n=M.EMPTY,s=new qt;for(let i=0;i<e.transitions.length;i++){const r=e.transitions[i].target,o=new Ht({state:r,alt:i+1,context:n},null);this.closure(t,o,s,!1,!1,!1)}return s}closure(t,e,n,s,i,r){let o=null;if(Wt.debug&&console.log("closure("+e.toString(this.recog,!0)+")"),e.state instanceof _){if(Wt.debug&&(null!==this.recog?console.log("closure at %s rule stop %s\n",this.recog.ruleNames[e.state.ruleIndex],e):console.log("closure at rule stop %s\n",e)),null===e.context||e.context.hasEmptyPath()){if(null===e.context||e.context.isEmpty())return n.add(e),!0;n.add(new Ht({state:e.state,context:M.EMPTY},e)),s=!0}if(null!==e.context&&!e.context.isEmpty())for(let a=0;a<e.context.length;a++)if(e.context.getReturnState(a)!==M.EMPTY_RETURN_STATE){const l=e.context.getParent(a),h=this.atn.states[e.context.getReturnState(a)];o=new Ht({state:h,context:l},e),s=this.closure(t,o,n,s,i,r)}return s}e.state.epsilonOnlyTransitions||s&&e.passedThroughNonGreedyDecision||n.add(e);for(let a=0;a<e.state.transitions.length;a++){const l=e.state.transitions[a];o=this.getEpsilonTarget(t,e,l,n,i,r),null!==o&&(s=this.closure(t,o,n,s,i,r))}return s}getEpsilonTarget(e,n,s,i,r,o){let a=null;if(s.serializationType===C.RULE){const t=B.create(n.context,s.followState.stateNumber);a=new Ht({state:s.target,context:t},n)}else{if(s.serializationType===C.PRECEDENCE)throw"Precedence predicates are not supported in lexers.";if(s.serializationType===C.PREDICATE)Wt.debug&&console.log("EVAL rule "+s.ruleIndex+":"+s.predIndex),i.hasSemanticContext=!0,this.evaluatePredicate(e,s.ruleIndex,s.predIndex,r)&&(a=new Ht({state:s.target},n));else if(s.serializationType===C.ACTION)if(null===n.context||n.context.hasEmptyPath()){const t=Yt.append(n.lexerActionExecutor,this.atn.lexerActions[s.actionIndex]);a=new Ht({state:s.target,lexerActionExecutor:t},n)}else a=new Ht({state:s.target},n);else s.serializationType===C.EPSILON?a=new Ht({state:s.target},n):s.serializationType!==C.ATOM&&s.serializationType!==C.RANGE&&s.serializationType!==C.SET||o&&s.matches(t.EOF,0,Ft.MAX_CHAR_VALUE)&&(a=new Ht({state:s.target},n))}return a}evaluatePredicate(t,e,n,s){if(null===this.recog)return!0;if(!s)return this.recog.sempred(null,e,n);const i=this.column,r=this.line,o=t.index,a=t.mark();try{return this.consume(t),this.recog.sempred(null,e,n)}finally{this.column=i,this.line=r,t.seek(o),t.release(a)}}captureSimState(t,e,n){t.index=e.index,t.line=this.line,t.column=this.column,t.dfaState=n}addDFAEdge(t,e,n,s){if(void 0===n&&(n=null),void 0===s&&(s=null),null===n&&null!==s){const t=s.hasSemanticContext;if(s.hasSemanticContext=!1,n=this.addDFAState(s),t)return n}return e<Wt.MIN_DFA_EDGE||e>Wt.MAX_DFA_EDGE||(Wt.debug&&console.log("EDGE "+t+" -> "+n+" upon "+e),null===t.edges&&(t.edges=[]),t.edges[e-Wt.MIN_DFA_EDGE]=n),n}addDFAState(t){const e=new Vt(null,t);let n=null;for(let e=0;e<t.items.length;e++){const s=t.items[e];if(s.state instanceof _){n=s;break}}null!==n&&(e.isAcceptState=!0,e.lexerActionExecutor=n.lexerActionExecutor,e.prediction=this.atn.ruleToTokenType[n.state.ruleIndex]);const s=this.decisionToDFA[this.mode],i=s.states.get(e);if(null!==i)return i;const r=e;return r.stateNumber=s.states.length,t.setReadonly(!0),r.configs=t,s.states.add(r),r}getDFA(t){return this.decisionToDFA[t]}getText(t){return t.getText(this.startIndex,t.index-1)}consume(t){t.LA(1)==="\n".charCodeAt(0)?(this.line+=1,this.column=0):this.column+=1,t.consume()}getTokenName(t){return-1===t?"EOF":"'"+String.fromCharCode(t)+"'"}}Wt.debug=!1,Wt.dfa_debug=!1,Wt.MIN_DFA_EDGE=0,Wt.MAX_DFA_EDGE=127;class $t{constructor(t,e){this.alt=e,this.pred=t}toString(){return"("+this.pred+", "+this.alt+")"}}class Xt{constructor(){this.data={}}get(t){return this.data["k-"+t]||null}set(t,e){this.data["k-"+t]=e}values(){return Object.keys(this.data).filter((t=>t.startsWith("k-"))).map((t=>this.data[t]),this)}}const Jt={SLL:0,LL:1,LL_EXACT_AMBIG_DETECTION:2,hasSLLConflictTerminatingPrediction:function(t,e){if(Jt.allConfigsInRuleStopStates(e))return!0;if(t===Jt.SLL&&e.hasSemanticContext){const t=new Bt;for(let n=0;n<e.items.length;n++){let s=e.items[n];s=new T({semanticContext:d.NONE},s),t.add(s)}e=t}const n=Jt.getConflictingAltSubsets(e);return Jt.hasConflictingAltSet(n)&&!Jt.hasStateAssociatedWithOneAlt(e)},hasConfigInRuleStopState:function(t){for(let e=0;e<t.items.length;e++)if(t.items[e].state instanceof _)return!0;return!1},allConfigsInRuleStopStates:function(t){for(let e=0;e<t.items.length;e++)if(!(t.items[e].state instanceof _))return!1;return!0},resolvesToJustOneViableAlt:function(t){return Jt.getSingleViableAlt(t)},allSubsetsConflict:function(t){return!Jt.hasNonConflictingAltSet(t)},hasNonConflictingAltSet:function(t){for(let e=0;e<t.length;e++)if(1===t[e].length)return!0;return!1},hasConflictingAltSet:function(t){for(let e=0;e<t.length;e++)if(t[e].length>1)return!0;return!1},allSubsetsEqual:function(t){let e=null;for(let n=0;n<t.length;n++){const s=t[n];if(null===e)e=s;else if(s!==e)return!1}return!0},getUniqueAlt:function(t){const e=Jt.getAlts(t);return 1===e.length?e.minValue():j.INVALID_ALT_NUMBER},getAlts:function(t){const e=new Y;return t.map((function(t){e.or(t)})),e},getConflictingAltSubsets:function(t){const e=new z;return e.hashFunction=function(t){o.hashStuff(t.state.stateNumber,t.context)},e.equalsFunction=function(t,e){return t.state.stateNumber===e.state.stateNumber&&t.context.equals(e.context)},t.items.map((function(t){let n=e.get(t);null===n&&(n=new Y,e.set(t,n)),n.set(t.alt)})),e.getValues()},getStateToAltMap:function(t){const e=new Xt;return t.items.map((function(t){let n=e.get(t.state);null===n&&(n=new Y,e.set(t.state,n)),n.set(t.alt)})),e},hasStateAssociatedWithOneAlt:function(t){const e=Jt.getStateToAltMap(t).values();for(let t=0;t<e.length;t++)if(1===e[t].length)return!0;return!1},getSingleViableAlt:function(t){let e=null;for(let n=0;n<t.length;n++){const s=t[n].minValue();if(null===e)e=s;else if(e!==s)return j.INVALID_ALT_NUMBER}return e}},Qt=Jt;class Zt extends bt{constructor(t,e,n,s,i,r){r=r||t._ctx,s=s||t.getCurrentToken(),n=n||t.getCurrentToken(),e=e||t.getInputStream(),super({message:"",recognizer:t,input:e,ctx:r}),this.deadEndConfigs=i,this.startToken=n,this.offendingToken=s}}class te{constructor(t){this.defaultMapCtor=t||z,this.cacheMap=new this.defaultMapCtor}get(t,e){const n=this.cacheMap.get(t)||null;return null===n?null:n.get(e)||null}set(t,e,n){let s=this.cacheMap.get(t)||null;null===s&&(s=new this.defaultMapCtor,this.cacheMap.set(t,s)),s.set(e,n)}}class ee extends zt{constructor(t,e,n,s){super(e,s),this.parser=t,this.decisionToDFA=n,this.predictionMode=Qt.LL,this._input=null,this._startIndex=0,this._outerContext=null,this._dfa=null,this.mergeCache=null,this.debug=!1,this.debug_closure=!1,this.debug_add=!1,this.trace_atn_sim=!1,this.dfa_debug=!1,this.retry_debug=!1}reset(){}adaptivePredict(t,e,n){(this.debug||this.trace_atn_sim)&&console.log("adaptivePredict decision "+e+" exec LA(1)=="+this.getLookaheadName(t)+" line "+t.LT(1).line+":"+t.LT(1).column),this._input=t,this._startIndex=t.index,this._outerContext=n;const s=this.decisionToDFA[e];this._dfa=s;const i=t.mark(),r=t.index;try{let e;if(e=s.precedenceDfa?s.getPrecedenceStartState(this.parser.getPrecedence()):s.s0,null===e){null===n&&(n=F.EMPTY),this.debug&&console.log("predictATN decision "+s.decision+" exec LA(1)=="+this.getLookaheadName(t)+", outerContext="+n.toString(this.parser.ruleNames));const i=!1;let r=this.computeStartState(s.atnStartState,F.EMPTY,i);s.precedenceDfa?(s.s0.configs=r,r=this.applyPrecedenceFilter(r),e=this.addDFAState(s,new Vt(null,r)),s.setPrecedenceStartState(this.parser.getPrecedence(),e)):(e=this.addDFAState(s,new Vt(null,r)),s.s0=e)}const i=this.execATN(s,e,t,r,n);return this.debug&&console.log("DFA after predictATN: "+s.toString(this.parser.literalNames,this.parser.symbolicNames)),i}finally{this._dfa=null,this.mergeCache=null,t.seek(r),t.release(i)}}execATN(e,n,s,i,r){let o;(this.debug||this.trace_atn_sim)&&console.log("execATN decision "+e.decision+", DFA state "+n+", LA(1)=="+this.getLookaheadName(s)+" line "+s.LT(1).line+":"+s.LT(1).column);let a=n;this.debug&&console.log("s0 = "+n);let l=s.LA(1);for(;;){let n=this.getExistingTargetState(a,l);if(null===n&&(n=this.computeTargetState(e,a,l)),n===zt.ERROR){const t=this.noViableAlt(s,r,a.configs,i);if(s.seek(i),o=this.getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(a.configs,r),o!==j.INVALID_ALT_NUMBER)return o;throw t}if(n.requiresFullContext&&this.predictionMode!==Qt.SLL){let t=null;if(null!==n.predicates){this.debug&&console.log("DFA state has preds in DFA sim LL failover");const e=s.index;if(e!==i&&s.seek(i),t=this.evalSemanticContext(n.predicates,r,!0),1===t.length)return this.debug&&console.log("Full LL avoided"),t.minValue();e!==i&&s.seek(e)}this.dfa_debug&&console.log("ctx sensitive state "+r+" in "+n);const a=!0,l=this.computeStartState(e.atnStartState,r,a);return this.reportAttemptingFullContext(e,t,n.configs,i,s.index),o=this.execATNWithFullContext(e,n,l,s,i,r),o}if(n.isAcceptState){if(null===n.predicates)return n.prediction;const t=s.index;s.seek(i);const o=this.evalSemanticContext(n.predicates,r,!0);if(0===o.length)throw this.noViableAlt(s,r,n.configs,i);return 1===o.length||this.reportAmbiguity(e,n,i,t,!1,o,n.configs),o.minValue()}a=n,l!==t.EOF&&(s.consume(),l=s.LA(1))}}getExistingTargetState(t,e){const n=t.edges;return null===n?null:n[e+1]||null}computeTargetState(t,e,n){const s=this.computeReachSet(e.configs,n,!1);if(null===s)return this.addDFAEdge(t,e,n,zt.ERROR),zt.ERROR;let i=new Vt(null,s);const r=this.getUniqueAlt(s);if(this.debug){const t=Qt.getConflictingAltSubsets(s);console.log("SLL altSubSets="+c(t)+", configs="+s+", predict="+r+", allSubsetsConflict="+Qt.allSubsetsConflict(t)+", conflictingAlts="+this.getConflictingAlts(s))}return r!==j.INVALID_ALT_NUMBER?(i.isAcceptState=!0,i.configs.uniqueAlt=r,i.prediction=r):Qt.hasSLLConflictTerminatingPrediction(this.predictionMode,s)&&(i.configs.conflictingAlts=this.getConflictingAlts(s),i.requiresFullContext=!0,i.isAcceptState=!0,i.prediction=i.configs.conflictingAlts.minValue()),i.isAcceptState&&i.configs.hasSemanticContext&&(this.predicateDFAState(i,this.atn.getDecisionState(t.decision)),null!==i.predicates&&(i.prediction=j.INVALID_ALT_NUMBER)),i=this.addDFAEdge(t,e,n,i),i}predicateDFAState(t,e){const n=e.transitions.length,s=this.getConflictingAltsOrUniqueAlt(t.configs),i=this.getPredsForAmbigAlts(s,t.configs,n);null!==i?(t.predicates=this.getPredicatePredictions(s,i),t.prediction=j.INVALID_ALT_NUMBER):t.prediction=s.minValue()}execATNWithFullContext(e,n,s,i,r,o){(this.debug||this.trace_atn_sim)&&console.log("execATNWithFullContext "+s);let a,l=!1,h=s;i.seek(r);let c=i.LA(1),u=-1;for(;;){if(a=this.computeReachSet(h,c,!0),null===a){const t=this.noViableAlt(i,o,h,r);i.seek(r);const e=this.getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(h,o);if(e!==j.INVALID_ALT_NUMBER)return e;throw t}const e=Qt.getConflictingAltSubsets(a);if(this.debug&&console.log("LL altSubSets="+e+", predict="+Qt.getUniqueAlt(e)+", resolvesToJustOneViableAlt="+Qt.resolvesToJustOneViableAlt(e)),a.uniqueAlt=this.getUniqueAlt(a),a.uniqueAlt!==j.INVALID_ALT_NUMBER){u=a.uniqueAlt;break}if(this.predictionMode!==Qt.LL_EXACT_AMBIG_DETECTION){if(u=Qt.resolvesToJustOneViableAlt(e),u!==j.INVALID_ALT_NUMBER)break}else if(Qt.allSubsetsConflict(e)&&Qt.allSubsetsEqual(e)){l=!0,u=Qt.getSingleViableAlt(e);break}h=a,c!==t.EOF&&(i.consume(),c=i.LA(1))}return a.uniqueAlt!==j.INVALID_ALT_NUMBER?(this.reportContextSensitivity(e,u,a,r,i.index),u):(this.reportAmbiguity(e,n,r,i.index,l,null,a),u)}computeReachSet(e,n,s){this.debug&&console.log("in computeReachSet, starting closure: "+e),null===this.mergeCache&&(this.mergeCache=new te);const i=new Bt(s);let r=null;for(let o=0;o<e.items.length;o++){const a=e.items[o];if(this.debug&&console.log("testing "+this.getTokenName(n)+" at "+a),a.state instanceof _)(s||n===t.EOF)&&(null===r&&(r=[]),r.push(a),this.debug_add&&console.log("added "+a+" to skippedStopStates"));else for(let t=0;t<a.state.transitions.length;t++){const e=a.state.transitions[t],s=this.getReachableTarget(e,n);if(null!==s){const t=new T({state:s},a);i.add(t,this.mergeCache),this.debug_add&&console.log("added "+t+" to intermediate")}}}let o=null;if(null===r&&n!==t.EOF&&(1===i.items.length||this.getUniqueAlt(i)!==j.INVALID_ALT_NUMBER)&&(o=i),null===o){o=new Bt(s);const e=new u,r=n===t.EOF;for(let t=0;t<i.items.length;t++)this.closure(i.items[t],o,e,!1,s,r)}if(n===t.EOF&&(o=this.removeAllConfigsNotInRuleStopState(o,o===i)),!(null===r||s&&Qt.hasConfigInRuleStopState(o)))for(let t=0;t<r.length;t++)o.add(r[t],this.mergeCache);return this.trace_atn_sim&&console.log("computeReachSet "+e+" -> "+o),0===o.items.length?null:o}removeAllConfigsNotInRuleStopState(e,n){if(Qt.allConfigsInRuleStopStates(e))return e;const s=new Bt(e.fullCtx);for(let i=0;i<e.items.length;i++){const r=e.items[i];if(r.state instanceof _)s.add(r,this.mergeCache);else if(n&&r.state.epsilonOnlyTransitions&&this.atn.nextTokens(r.state).contains(t.EPSILON)){const t=this.atn.ruleToStopState[r.state.ruleIndex];s.add(new T({state:t},r),this.mergeCache)}}return s}computeStartState(t,e,n){const s=q(this.atn,e),i=new Bt(n);this.trace_atn_sim&&console.log("computeStartState from ATN state "+t+" initialContext="+s.toString(this.parser));for(let e=0;e<t.transitions.length;e++){const r=t.transitions[e].target,o=new T({state:r,alt:e+1,context:s},null),a=new u;this.closure(o,i,a,!0,n,!1)}return i}applyPrecedenceFilter(t){let e;const n=[],s=new Bt(t.fullCtx);for(let i=0;i<t.items.length;i++){if(e=t.items[i],1!==e.alt)continue;const r=e.semanticContext.evalPrecedence(this.parser,this._outerContext);null!==r&&(n[e.state.stateNumber]=e.context,r!==e.semanticContext?s.add(new T({semanticContext:r},e),this.mergeCache):s.add(e,this.mergeCache))}for(let i=0;i<t.items.length;i++)if(e=t.items[i],1!==e.alt){if(!e.precedenceFilterSuppressed){const t=n[e.state.stateNumber]||null;if(null!==t&&t.equals(e.context))continue}s.add(e,this.mergeCache)}return s}getReachableTarget(t,e){return t.matches(e,0,this.atn.maxTokenType)?t.target:null}getPredsForAmbigAlts(t,e,n){let s=[];for(let n=0;n<e.items.length;n++){const i=e.items[n];t.get(i.alt)&&(s[i.alt]=d.orContext(s[i.alt]||null,i.semanticContext))}let i=0;for(let t=1;t<n+1;t++){const e=s[t]||null;null===e?s[t]=d.NONE:e!==d.NONE&&(i+=1)}return 0===i&&(s=null),this.debug&&console.log("getPredsForAmbigAlts result "+c(s)),s}getPredicatePredictions(t,e){const n=[];let s=!1;for(let i=1;i<e.length;i++){const r=e[i];null!==t&&t.get(i)&&n.push(new $t(r,i)),r!==d.NONE&&(s=!0)}return s?n:null}getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(t,e){const n=this.splitAccordingToSemanticValidity(t,e),s=n[0],i=n[1];let r=this.getAltThatFinishedDecisionEntryRule(s);return r!==j.INVALID_ALT_NUMBER||i.items.length>0&&(r=this.getAltThatFinishedDecisionEntryRule(i),r!==j.INVALID_ALT_NUMBER)?r:j.INVALID_ALT_NUMBER}getAltThatFinishedDecisionEntryRule(t){const e=[];for(let n=0;n<t.items.length;n++){const s=t.items[n];(s.reachesIntoOuterContext>0||s.state instanceof _&&s.context.hasEmptyPath())&&e.indexOf(s.alt)<0&&e.push(s.alt)}return 0===e.length?j.INVALID_ALT_NUMBER:Math.min.apply(null,e)}splitAccordingToSemanticValidity(t,e){const n=new Bt(t.fullCtx),s=new Bt(t.fullCtx);for(let i=0;i<t.items.length;i++){const r=t.items[i];r.semanticContext!==d.NONE?r.semanticContext.evaluate(this.parser,e)?n.add(r):s.add(r):n.add(r)}return[n,s]}evalSemanticContext(t,e,n){const s=new Y;for(let i=0;i<t.length;i++){const r=t[i];if(r.pred===d.NONE){if(s.set(r.alt),!n)break;continue}const o=r.pred.evaluate(this.parser,e);if((this.debug||this.dfa_debug)&&console.log("eval pred "+r+"="+o),o&&((this.debug||this.dfa_debug)&&console.log("PREDICT "+r.alt),s.set(r.alt),!n))break}return s}closure(t,e,n,s,i,r){this.closureCheckingStopState(t,e,n,s,i,0,r)}closureCheckingStopState(t,e,n,s,i,r,o){if((this.trace_atn_sim||this.debug_closure)&&console.log("closure("+t.toString(this.parser,!0)+")"),t.state instanceof _){if(!t.context.isEmpty()){for(let a=0;a<t.context.length;a++){if(t.context.getReturnState(a)===M.EMPTY_RETURN_STATE){if(i){e.add(new T({state:t.state,context:M.EMPTY},t),this.mergeCache);continue}this.debug&&console.log("FALLING off rule "+this.getRuleName(t.state.ruleIndex)),this.closure_(t,e,n,s,i,r,o);continue}const l=this.atn.states[t.context.getReturnState(a)],h=t.context.getParent(a),c={state:l,alt:t.alt,context:h,semanticContext:t.semanticContext},u=new T(c,null);u.reachesIntoOuterContext=t.reachesIntoOuterContext,this.closureCheckingStopState(u,e,n,s,i,r-1,o)}return}if(i)return void e.add(t,this.mergeCache);this.debug&&console.log("FALLING off rule "+this.getRuleName(t.state.ruleIndex))}this.closure_(t,e,n,s,i,r,o)}closure_(t,e,n,s,i,r,o){const a=t.state;a.epsilonOnlyTransitions||e.add(t,this.mergeCache);for(let l=0;l<a.transitions.length;l++){if(0===l&&this.canDropLoopEntryEdgeInLeftRecursiveRule(t))continue;const h=a.transitions[l],c=s&&!(h instanceof ht),u=this.getEpsilonTarget(t,h,c,0===r,i,o);if(null!==u){let s=r;if(t.state instanceof _){if(null!==this._dfa&&this._dfa.precedenceDfa&&h.outermostPrecedenceReturn===this._dfa.atnStartState.ruleIndex&&(u.precedenceFilterSuppressed=!0),u.reachesIntoOuterContext+=1,n.getOrAdd(u)!==u)continue;e.dipsIntoOuterContext=!0,s-=1,this.debug&&console.log("dips into outer ctx: "+u)}else{if(!h.isEpsilon&&n.getOrAdd(u)!==u)continue;h instanceof A&&s>=0&&(s+=1)}this.closureCheckingStopState(u,e,n,c,i,s,o)}}}canDropLoopEntryEdgeInLeftRecursiveRule(t){const e=t.state;if(e.stateType!==E.STAR_LOOP_ENTRY)return!1;if(e.stateType!==E.STAR_LOOP_ENTRY||!e.isPrecedenceDecision||t.context.isEmpty()||t.context.hasEmptyPath())return!1;const n=t.context.length;for(let s=0;s<n;s++)if(this.atn.states[t.context.getReturnState(s)].ruleIndex!==e.ruleIndex)return!1;const s=e.transitions[0].target.endState.stateNumber,i=this.atn.states[s];for(let s=0;s<n;s++){const n=t.context.getReturnState(s),r=this.atn.states[n];if(1!==r.transitions.length||!r.transitions[0].isEpsilon)return!1;const o=r.transitions[0].target;if(!(r.stateType===E.BLOCK_END&&o===e||r===i||o===i||o.stateType===E.BLOCK_END&&1===o.transitions.length&&o.transitions[0].isEpsilon&&o.transitions[0].target===e))return!1}return!0}getRuleName(t){return null!==this.parser&&t>=0?this.parser.ruleNames[t]:"<rule "+t+">"}getEpsilonTarget(e,n,s,i,r,o){switch(n.serializationType){case C.RULE:return this.ruleTransition(e,n);case C.PRECEDENCE:return this.precedenceTransition(e,n,s,i,r);case C.PREDICATE:return this.predTransition(e,n,s,i,r);case C.ACTION:return this.actionTransition(e,n);case C.EPSILON:return new T({state:n.target},e);case C.ATOM:case C.RANGE:case C.SET:return o&&n.matches(t.EOF,0,1)?new T({state:n.target},e):null;default:return null}}actionTransition(t,e){if(this.debug){const t=-1===e.actionIndex?65535:e.actionIndex;console.log("ACTION edge "+e.ruleIndex+":"+t)}return new T({state:e.target},t)}precedenceTransition(t,e,n,s,i){this.debug&&(console.log("PRED (collectPredicates="+n+") "+e.precedence+">=_p, ctx dependent=true"),null!==this.parser&&console.log("context surrounding pred is "+c(this.parser.getRuleInvocationStack())));let r=null;if(n&&s)if(i){const n=this._input.index;this._input.seek(this._startIndex);const s=e.getPredicate().evaluate(this.parser,this._outerContext);this._input.seek(n),s&&(r=new T({state:e.target},t))}else{const n=d.andContext(t.semanticContext,e.getPredicate());r=new T({state:e.target,semanticContext:n},t)}else r=new T({state:e.target},t);return this.debug&&console.log("config from pred transition="+r),r}predTransition(t,e,n,s,i){this.debug&&(console.log("PRED (collectPredicates="+n+") "+e.ruleIndex+":"+e.predIndex+", ctx dependent="+e.isCtxDependent),null!==this.parser&&console.log("context surrounding pred is "+c(this.parser.getRuleInvocationStack())));let r=null;if(n&&(e.isCtxDependent&&s||!e.isCtxDependent))if(i){const n=this._input.index;this._input.seek(this._startIndex);const s=e.getPredicate().evaluate(this.parser,this._outerContext);this._input.seek(n),s&&(r=new T({state:e.target},t))}else{const n=d.andContext(t.semanticContext,e.getPredicate());r=new T({state:e.target,semanticContext:n},t)}else r=new T({state:e.target},t);return this.debug&&console.log("config from pred transition="+r),r}ruleTransition(t,e){this.debug&&console.log("CALL rule "+this.getRuleName(e.target.ruleIndex)+", ctx="+t.context);const n=e.followState,s=B.create(t.context,n.stateNumber);return new T({state:e.target,context:s},t)}getConflictingAlts(t){const e=Qt.getConflictingAltSubsets(t);return Qt.getAlts(e)}getConflictingAltsOrUniqueAlt(t){let e=null;return t.uniqueAlt!==j.INVALID_ALT_NUMBER?(e=new Y,e.set(t.uniqueAlt)):e=t.conflictingAlts,e}getTokenName(e){if(e===t.EOF)return"EOF";if(null!==this.parser&&null!==this.parser.literalNames){if(!(e>=this.parser.literalNames.length&&e>=this.parser.symbolicNames.length))return(this.parser.literalNames[e]||this.parser.symbolicNames[e])+"<"+e+">";console.log(e+" ttype out of range: "+this.parser.literalNames),console.log(""+this.parser.getInputStream().getTokens())}return""+e}getLookaheadName(t){return this.getTokenName(t.LA(1))}dumpDeadEndConfigs(t){console.log("dead end configs: ");const e=t.getDeadEndConfigs();for(let t=0;t<e.length;t++){const n=e[t];let s="no edges";if(n.state.transitions.length>0){const t=n.state.transitions[0];t instanceof at?s="Atom "+this.getTokenName(t.label):t instanceof N&&(s=(t instanceof k?"~":"")+"Set "+t.set)}console.error(n.toString(this.parser,!0)+":"+s)}}noViableAlt(t,e,n,s){return new Zt(this.parser,t,t.get(s),t.LT(1),n,e)}getUniqueAlt(t){let e=j.INVALID_ALT_NUMBER;for(let n=0;n<t.items.length;n++){const s=t.items[n];if(e===j.INVALID_ALT_NUMBER)e=s.alt;else if(s.alt!==e)return j.INVALID_ALT_NUMBER}return e}addDFAEdge(t,e,n,s){if(this.debug&&console.log("EDGE "+e+" -> "+s+" upon "+this.getTokenName(n)),null===s)return null;if(s=this.addDFAState(t,s),null===e||n<-1||n>this.atn.maxTokenType)return s;if(null===e.edges&&(e.edges=[]),e.edges[n+1]=s,this.debug){const e=null===this.parser?null:this.parser.literalNames,n=null===this.parser?null:this.parser.symbolicNames;console.log("DFA=\n"+t.toString(e,n))}return s}addDFAState(t,e){if(e===zt.ERROR)return e;const n=t.states.get(e);return null!==n?(this.trace_atn_sim&&console.log("addDFAState "+e+" exists"),n):(e.stateNumber=t.states.length,e.configs.readOnly||(e.configs.optimizeConfigs(this),e.configs.setReadonly(!0)),this.trace_atn_sim&&console.log("addDFAState new "+e),t.states.add(e),this.debug&&console.log("adding new DFA state: "+e),e)}reportAttemptingFullContext(t,e,n,s,i){if(this.debug||this.retry_debug){const e=new S(s,i+1);console.log("reportAttemptingFullContext decision="+t.decision+":"+n+", input="+this.parser.getTokenStream().getText(e))}null!==this.parser&&this.parser.getErrorListener().reportAttemptingFullContext(this.parser,t,s,i,e,n)}reportContextSensitivity(t,e,n,s,i){if(this.debug||this.retry_debug){const e=new S(s,i+1);console.log("reportContextSensitivity decision="+t.decision+":"+n+", input="+this.parser.getTokenStream().getText(e))}null!==this.parser&&this.parser.getErrorListener().reportContextSensitivity(this.parser,t,s,i,e,n)}reportAmbiguity(t,e,n,s,i,r,o){if(this.debug||this.retry_debug){const t=new S(n,s+1);console.log("reportAmbiguity "+r+":"+o+", input="+this.parser.getTokenStream().getText(t))}null!==this.parser&&this.parser.getErrorListener().reportAmbiguity(this.parser,t,n,s,i,r,o)}}class ne{constructor(){this.cache=new z}add(t){if(t===M.EMPTY)return M.EMPTY;const e=this.cache.get(t)||null;return null!==e?e:(this.cache.set(t,t),t)}get(t){return this.cache.get(t)||null}get length(){return this.cache.length}}const se={ATN:j,ATNDeserializer:It,LexerATNSimulator:Wt,ParserATNSimulator:ee,PredictionMode:Qt,PredictionContextCache:ne};class ie{constructor(t,e,n){this.dfa=t,this.literalNames=e||[],this.symbolicNames=n||[]}toString(){if(null===this.dfa.s0)return null;let t="";const e=this.dfa.sortedStates();for(let n=0;n<e.length;n++){const s=e[n];if(null!==s.edges){const e=s.edges.length;for(let n=0;n<e;n++){const e=s.edges[n]||null;null!==e&&2147483647!==e.stateNumber&&(t=t.concat(this.getStateString(s)),t=t.concat("-"),t=t.concat(this.getEdgeLabel(n)),t=t.concat("->"),t=t.concat(this.getStateString(e)),t=t.concat("\n"))}}}return 0===t.length?null:t}getEdgeLabel(t){return 0===t?"EOF":null!==this.literalNames||null!==this.symbolicNames?this.literalNames[t-1]||this.symbolicNames[t-1]:String.fromCharCode(t-1)}getStateString(t){const e=(t.isAcceptState?":":"")+"s"+t.stateNumber+(t.requiresFullContext?"^":"");return t.isAcceptState?null!==t.predicates?e+"=>"+c(t.predicates):e+"=>"+t.prediction.toString():e}}class re extends ie{constructor(t){super(t,null)}getEdgeLabel(t){return"'"+String.fromCharCode(t)+"'"}}class oe{constructor(t,e){if(void 0===e&&(e=0),this.atnStartState=t,this.decision=e,this._states=new u,this.s0=null,this.precedenceDfa=!1,t instanceof st&&t.isPrecedenceDecision){this.precedenceDfa=!0;const t=new Vt(null,new Bt);t.edges=[],t.isAcceptState=!1,t.requiresFullContext=!1,this.s0=t}}getPrecedenceStartState(t){if(!this.precedenceDfa)throw"Only precedence DFAs may contain a precedence start state.";return t<0||t>=this.s0.edges.length?null:this.s0.edges[t]||null}setPrecedenceStartState(t,e){if(!this.precedenceDfa)throw"Only precedence DFAs may contain a precedence start state.";t<0||(this.s0.edges[t]=e)}setPrecedenceDfa(t){if(this.precedenceDfa!==t){if(this._states=new u,t){const t=new Vt(null,new Bt);t.edges=[],t.isAcceptState=!1,t.requiresFullContext=!1,this.s0=t}else this.s0=null;this.precedenceDfa=t}}sortedStates(){return this._states.values().sort((function(t,e){return t.stateNumber-e.stateNumber}))}toString(t,e){return t=t||null,e=e||null,null===this.s0?"":new ie(this,t,e).toString()}toLexerString(){return null===this.s0?"":new re(this).toString()}get states(){return this._states}}const ae={DFA:oe,DFASerializer:ie,LexerDFASerializer:re,PredPrediction:$t},le={PredictionContext:M},he={Interval:S,IntervalSet:m};class ce{visitTerminal(t){}visitErrorNode(t){}enterEveryRule(t){}exitEveryRule(t){}}class ue{visit(t){return Array.isArray(t)?t.map((function(t){return t.accept(this)}),this):t.accept(this)}visitChildren(t){return t.children?this.visit(t.children):null}visitTerminal(t){}visitErrorNode(t){}}class de{walk(t,e){if(e instanceof P||void 0!==e.isErrorNode&&e.isErrorNode())t.visitErrorNode(e);else if(e instanceof w)t.visitTerminal(e);else{this.enterRule(t,e);for(let n=0;n<e.getChildCount();n++){const s=e.getChild(n);this.walk(t,s)}this.exitRule(t,e)}}enterRule(t,e){const n=e.ruleContext;t.enterEveryRule(n),n.enterRule(t)}exitRule(t,e){const n=e.ruleContext;n.exitRule(t),t.exitEveryRule(n)}}de.DEFAULT=new de;const ge={Trees:D,RuleNode:v,ErrorNode:P,TerminalNode:w,ParseTreeListener:ce,ParseTreeVisitor:ue,ParseTreeWalker:de};class pe extends bt{constructor(t){super({message:"",recognizer:t,input:t.getInputStream(),ctx:t._ctx}),this.offendingToken=t.getCurrentToken()}}class fe extends bt{constructor(t,e,n){super({message:xe(e,n||null),recognizer:t,input:t.getInputStream(),ctx:t._ctx});const s=t._interp.atn.states[t.state].transitions[0];s instanceof dt?(this.ruleIndex=s.ruleIndex,this.predicateIndex=s.predIndex):(this.ruleIndex=0,this.predicateIndex=0),this.predicate=e,this.offendingToken=t.getCurrentToken()}}function xe(t,e){return null!==e?e:"failed predicate: {"+t+"}?"}class Te extends yt{constructor(t){super(),t=t||!0,this.exactOnly=t}reportAmbiguity(t,e,n,s,i,r,o){if(this.exactOnly&&!i)return;const a="reportAmbiguity d="+this.getDecisionDescription(t,e)+": ambigAlts="+this.getConflictingAlts(r,o)+", input='"+t.getTokenStream().getText(new S(n,s))+"'";t.notifyErrorListeners(a)}reportAttemptingFullContext(t,e,n,s,i,r){const o="reportAttemptingFullContext d="+this.getDecisionDescription(t,e)+", input='"+t.getTokenStream().getText(new S(n,s))+"'";t.notifyErrorListeners(o)}reportContextSensitivity(t,e,n,s,i,r){const o="reportContextSensitivity d="+this.getDecisionDescription(t,e)+", input='"+t.getTokenStream().getText(new S(n,s))+"'";t.notifyErrorListeners(o)}getDecisionDescription(t,e){const n=e.decision,s=e.atnStartState.ruleIndex,i=t.ruleNames;if(s<0||s>=i.length)return""+n;const r=i[s]||null;return null===r||0===r.length?""+n:`${n} (${r})`}getConflictingAlts(t,e){if(null!==t)return t;const n=new Y;for(let t=0;t<e.items.length;t++)n.set(e.items[t].alt);return`{${n.values().join(", ")}}`}}class Se extends Error{constructor(){super(),Error.captureStackTrace(this,Se)}}class me{reset(t){}recoverInline(t){}recover(t,e){}sync(t){}inErrorRecoveryMode(t){}reportError(t){}}class Ee extends me{constructor(){super(),this.errorRecoveryMode=!1,this.lastErrorIndex=-1,this.lastErrorStates=null,this.nextTokensContext=null,this.nextTokenState=0}reset(t){this.endErrorCondition(t)}beginErrorCondition(t){this.errorRecoveryMode=!0}inErrorRecoveryMode(t){return this.errorRecoveryMode}endErrorCondition(t){this.errorRecoveryMode=!1,this.lastErrorStates=null,this.lastErrorIndex=-1}reportMatch(t){this.endErrorCondition(t)}reportError(t,e){this.inErrorRecoveryMode(t)||(this.beginErrorCondition(t),e instanceof Zt?this.reportNoViableAlternative(t,e):e instanceof pe?this.reportInputMismatch(t,e):e instanceof fe?this.reportFailedPredicate(t,e):(console.log("unknown recognition error type: "+e.constructor.name),console.log(e.stack),t.notifyErrorListeners(e.getOffendingToken(),e.getMessage(),e)))}recover(t,e){this.lastErrorIndex===t.getInputStream().index&&null!==this.lastErrorStates&&this.lastErrorStates.indexOf(t.state)>=0&&t.consume(),this.lastErrorIndex=t._input.index,null===this.lastErrorStates&&(this.lastErrorStates=[]),this.lastErrorStates.push(t.state);const n=this.getErrorRecoverySet(t);this.consumeUntil(t,n)}sync(e){if(this.inErrorRecoveryMode(e))return;const n=e._interp.atn.states[e.state],s=e.getTokenStream().LA(1),i=e.atn.nextTokens(n);if(i.contains(s))return this.nextTokensContext=null,void(this.nextTokenState=E.INVALID_STATE_NUMBER);if(i.contains(t.EPSILON))null===this.nextTokensContext&&(this.nextTokensContext=e._ctx,this.nextTokensState=e._stateNumber);else switch(n.stateType){case E.BLOCK_START:case E.STAR_BLOCK_START:case E.PLUS_BLOCK_START:case E.STAR_LOOP_ENTRY:if(null!==this.singleTokenDeletion(e))return;throw new pe(e);case E.PLUS_LOOP_BACK:case E.STAR_LOOP_BACK:{this.reportUnwantedToken(e);const t=new m;t.addSet(e.getExpectedTokens());const n=t.addSet(this.getErrorRecoverySet(e));this.consumeUntil(e,n)}}}reportNoViableAlternative(e,n){const s=e.getTokenStream();let i;i=null!==s?n.startToken.type===t.EOF?"<EOF>":s.getText(new S(n.startToken.tokenIndex,n.offendingToken.tokenIndex)):"<unknown input>";const r="no viable alternative at input "+this.escapeWSAndQuote(i);e.notifyErrorListeners(r,n.offendingToken,n)}reportInputMismatch(t,e){const n="mismatched input "+this.getTokenErrorDisplay(e.offendingToken)+" expecting "+e.getExpectedTokens().toString(t.literalNames,t.symbolicNames);t.notifyErrorListeners(n,e.offendingToken,e)}reportFailedPredicate(t,e){const n="rule "+t.ruleNames[t._ctx.ruleIndex]+" "+e.message;t.notifyErrorListeners(n,e.offendingToken,e)}reportUnwantedToken(t){if(this.inErrorRecoveryMode(t))return;this.beginErrorCondition(t);const e=t.getCurrentToken(),n="extraneous input "+this.getTokenErrorDisplay(e)+" expecting "+this.getExpectedTokens(t).toString(t.literalNames,t.symbolicNames);t.notifyErrorListeners(n,e,null)}reportMissingToken(t){if(this.inErrorRecoveryMode(t))return;this.beginErrorCondition(t);const e=t.getCurrentToken(),n="missing "+this.getExpectedTokens(t).toString(t.literalNames,t.symbolicNames)+" at "+this.getTokenErrorDisplay(e);t.notifyErrorListeners(n,e,null)}recoverInline(t){const e=this.singleTokenDeletion(t);if(null!==e)return t.consume(),e;if(this.singleTokenInsertion(t))return this.getMissingSymbol(t);throw new pe(t)}singleTokenInsertion(t){const e=t.getTokenStream().LA(1),n=t._interp.atn,s=n.states[t.state].transitions[0].target;return!!n.nextTokens(s,t._ctx).contains(e)&&(this.reportMissingToken(t),!0)}singleTokenDeletion(t){const e=t.getTokenStream().LA(2);if(this.getExpectedTokens(t).contains(e)){this.reportUnwantedToken(t),t.consume();const e=t.getCurrentToken();return this.reportMatch(t),e}return null}getMissingSymbol(e){const n=e.getCurrentToken(),s=this.getExpectedTokens(e).first();let i;i=s===t.EOF?"<missing EOF>":"<missing "+e.literalNames[s]+">";let r=n;const o=e.getTokenStream().LT(-1);return r.type===t.EOF&&null!==o&&(r=o),e.getTokenFactory().create(r.source,s,i,t.DEFAULT_CHANNEL,-1,-1,r.line,r.column)}getExpectedTokens(t){return t.getExpectedTokens()}getTokenErrorDisplay(e){if(null===e)return"<no token>";let n=e.text;return null===n&&(n=e.type===t.EOF?"<EOF>":"<"+e.type+">"),this.escapeWSAndQuote(n)}escapeWSAndQuote(t){return"'"+(t=(t=(t=t.replace(/\n/g,"\\n")).replace(/\r/g,"\\r")).replace(/\t/g,"\\t"))+"'"}getErrorRecoverySet(e){const n=e._interp.atn;let s=e._ctx;const i=new m;for(;null!==s&&s.invokingState>=0;){const t=n.states[s.invokingState].transitions[0],e=n.nextTokens(t.followState);i.addSet(e),s=s.parentCtx}return i.removeOne(t.EPSILON),i}consumeUntil(e,n){let s=e.getTokenStream().LA(1);for(;s!==t.EOF&&!n.contains(s);)e.consume(),s=e.getTokenStream().LA(1)}}class _e extends Ee{constructor(){super()}recover(t,e){let n=t._ctx;for(;null!==n;)n.exception=e,n=n.parentCtx;throw new Se(e)}recoverInline(t){this.recover(t,new pe(t))}sync(t){}}const Ce={RecognitionException:bt,NoViableAltException:Zt,LexerNoViableAltException:Dt,InputMismatchException:pe,FailedPredicateException:fe,DiagnosticErrorListener:Te,BailErrorStrategy:_e,DefaultErrorStrategy:Ee,ErrorListener:yt};class Ae{constructor(t,e){if(this.name="<empty>",this.strdata=t,this.decodeToUnicodeCodePoints=e||!1,this._index=0,this.data=[],this.decodeToUnicodeCodePoints)for(let t=0;t<this.strdata.length;){const e=this.strdata.codePointAt(t);this.data.push(e),t+=e<=65535?1:2}else{this.data=new Array(this.strdata.length);for(let t=0;t<this.strdata.length;t++)this.data[t]=this.strdata.charCodeAt(t)}this._size=this.data.length}reset(){this._index=0}consume(){if(this._index>=this._size)throw"cannot consume EOF";this._index+=1}LA(e){if(0===e)return 0;e<0&&(e+=1);const n=this._index+e-1;return n<0||n>=this._size?t.EOF:this.data[n]}LT(t){return this.LA(t)}mark(){return-1}release(t){}seek(t){t<=this._index?this._index=t:this._index=Math.min(t,this._size)}getText(t,e){if(e>=this._size&&(e=this._size-1),t>=this._size)return"";if(this.decodeToUnicodeCodePoints){let n="";for(let s=t;s<=e;s++)n+=String.fromCodePoint(this.data[s]);return n}return this.strdata.slice(t,e+1)}toString(){return this.strdata}get index(){return this._index}get size(){return this._size}}class Ne extends Ae{constructor(t,e){super(t,e)}}var ke=n(763);const Ie="undefined"!=typeof process&&null!=process.versions&&null!=process.versions.node;class ye extends Ne{static fromPath(t,e,n){if(!Ie)throw new Error("FileStream is only available when running in Node!");ke.readFile(t,e,(function(t,e){let s=null;null!==e&&(s=new Ae(e,!0)),n(t,s)}))}constructor(t,e,n){if(!Ie)throw new Error("FileStream is only available when running in Node!");super(ke.readFileSync(t,e||"utf-8"),n),this.fileName=t}}const Le={fromString:function(t){return new Ae(t,!0)},fromBlob:function(t,e,n,s){const i=new window.FileReader;i.onload=function(t){const e=new Ae(t.target.result,!0);n(e)},i.onerror=s,i.readAsText(t,e)},fromBuffer:function(t,e){return new Ae(t.toString(e),!0)},fromPath:function(t,e,n){ye.fromPath(t,e,n)},fromPathSync:function(t,e){return new ye(t,e)}},Oe={arrayToString:c,stringToCharArray:function(t){let e=new Uint16Array(t.length);for(let n=0;n<t.length;n++)e[n]=t.charCodeAt(n);return e}};class Re{}class ve extends Re{constructor(t){super(),this.tokenSource=t,this.tokens=[],this.index=-1,this.fetchedEOF=!1}mark(){return 0}release(t){}reset(){this.seek(0)}seek(t){this.lazyInit(),this.index=this.adjustSeekIndex(t)}get size(){return this.tokens.length}get(t){return this.lazyInit(),this.tokens[t]}consume(){let e=!1;if(e=this.index>=0&&(this.fetchedEOF?this.index<this.tokens.length-1:this.index<this.tokens.length),!e&&this.LA(1)===t.EOF)throw"cannot consume EOF";this.sync(this.index+1)&&(this.index=this.adjustSeekIndex(this.index+1))}sync(t){const e=t-this.tokens.length+1;return!(e>0)||this.fetch(e)>=e}fetch(e){if(this.fetchedEOF)return 0;for(let n=0;n<e;n++){const e=this.tokenSource.nextToken();if(e.tokenIndex=this.tokens.length,this.tokens.push(e),e.type===t.EOF)return this.fetchedEOF=!0,n+1}return e}getTokens(e,n,s){if(void 0===s&&(s=null),e<0||n<0)return null;this.lazyInit();const i=[];n>=this.tokens.length&&(n=this.tokens.length-1);for(let r=e;r<n;r++){const e=this.tokens[r];if(e.type===t.EOF)break;(null===s||s.contains(e.type))&&i.push(e)}return i}LA(t){return this.LT(t).type}LB(t){return this.index-t<0?null:this.tokens[this.index-t]}LT(t){if(this.lazyInit(),0===t)return null;if(t<0)return this.LB(-t);const e=this.index+t-1;return this.sync(e),e>=this.tokens.length?this.tokens[this.tokens.length-1]:this.tokens[e]}adjustSeekIndex(t){return t}lazyInit(){-1===this.index&&this.setup()}setup(){this.sync(0),this.index=this.adjustSeekIndex(0)}setTokenSource(t){this.tokenSource=t,this.tokens=[],this.index=-1,this.fetchedEOF=!1}nextTokenOnChannel(e,n){if(this.sync(e),e>=this.tokens.length)return-1;let s=this.tokens[e];for(;s.channel!==n;){if(s.type===t.EOF)return-1;e+=1,this.sync(e),s=this.tokens[e]}return e}previousTokenOnChannel(t,e){for(;t>=0&&this.tokens[t].channel!==e;)t-=1;return t}getHiddenTokensToRight(t,e){if(void 0===e&&(e=-1),this.lazyInit(),t<0||t>=this.tokens.length)throw t+" not in 0.."+this.tokens.length-1;const n=this.nextTokenOnChannel(t+1,Ft.DEFAULT_TOKEN_CHANNEL),s=t+1,i=-1===n?this.tokens.length-1:n;return this.filterForChannel(s,i,e)}getHiddenTokensToLeft(t,e){if(void 0===e&&(e=-1),this.lazyInit(),t<0||t>=this.tokens.length)throw t+" not in 0.."+this.tokens.length-1;const n=this.previousTokenOnChannel(t-1,Ft.DEFAULT_TOKEN_CHANNEL);if(n===t-1)return null;const s=n+1,i=t-1;return this.filterForChannel(s,i,e)}filterForChannel(t,e,n){const s=[];for(let i=t;i<e+1;i++){const t=this.tokens[i];-1===n?t.channel!==Ft.DEFAULT_TOKEN_CHANNEL&&s.push(t):t.channel===n&&s.push(t)}return 0===s.length?null:s}getSourceName(){return this.tokenSource.getSourceName()}getText(e){this.lazyInit(),this.fill(),e||(e=new S(0,this.tokens.length-1));let n=e.start;n instanceof t&&(n=n.tokenIndex);let s=e.stop;if(s instanceof t&&(s=s.tokenIndex),null===n||null===s||n<0||s<0)return"";s>=this.tokens.length&&(s=this.tokens.length-1);let i="";for(let e=n;e<s+1;e++){const n=this.tokens[e];if(n.type===t.EOF)break;i+=n.text}return i}fill(){for(this.lazyInit();1e3===this.fetch(1e3););}}Object.defineProperty(ve,"size",{get:function(){return this.tokens.length}});class we extends ve{constructor(e,n){super(e),this.channel=void 0===n?t.DEFAULT_CHANNEL:n}adjustSeekIndex(t){return this.nextTokenOnChannel(t,this.channel)}LB(t){if(0===t||this.index-t<0)return null;let e=this.index,n=1;for(;n<=t;)e=this.previousTokenOnChannel(e-1,this.channel),n+=1;return e<0?null:this.tokens[e]}LT(t){if(this.lazyInit(),0===t)return null;if(t<0)return this.LB(-t);let e=this.index,n=1;for(;n<t;)this.sync(e+1)&&(e=this.nextTokenOnChannel(e+1,this.channel)),n+=1;return this.tokens[e]}getNumberOfOnChannelTokens(){let e=0;this.fill();for(let n=0;n<this.tokens.length;n++){const s=this.tokens[n];if(s.channel===this.channel&&(e+=1),s.type===t.EOF)break}return e}}class Pe extends ce{constructor(t){super(),this.parser=t}enterEveryRule(t){console.log("enter   "+this.parser.ruleNames[t.ruleIndex]+", LT(1)="+this.parser._input.LT(1).text)}visitTerminal(t){console.log("consume "+t.symbol+" rule "+this.parser.ruleNames[this.parser._ctx.ruleIndex])}exitEveryRule(t){console.log("exit    "+this.parser.ruleNames[t.ruleIndex]+", LT(1)="+this.parser._input.LT(1).text)}}class be extends Rt{constructor(t){super(),this._input=null,this._errHandler=new Ee,this._precedenceStack=[],this._precedenceStack.push(0),this._ctx=null,this.buildParseTrees=!0,this._tracer=null,this._parseListeners=null,this._syntaxErrors=0,this.setInputStream(t)}reset(){null!==this._input&&this._input.seek(0),this._errHandler.reset(this),this._ctx=null,this._syntaxErrors=0,this.setTrace(!1),this._precedenceStack=[],this._precedenceStack.push(0),null!==this._interp&&this._interp.reset()}match(t){let e=this.getCurrentToken();return e.type===t?(this._errHandler.reportMatch(this),this.consume()):(e=this._errHandler.recoverInline(this),this.buildParseTrees&&-1===e.tokenIndex&&this._ctx.addErrorNode(e)),e}matchWildcard(){let t=this.getCurrentToken();return t.type>0?(this._errHandler.reportMatch(this),this.consume()):(t=this._errHandler.recoverInline(this),this.buildParseTrees&&-1===t.tokenIndex&&this._ctx.addErrorNode(t)),t}getParseListeners(){return this._parseListeners||[]}addParseListener(t){if(null===t)throw"listener";null===this._parseListeners&&(this._parseListeners=[]),this._parseListeners.push(t)}removeParseListener(t){if(null!==this._parseListeners){const e=this._parseListeners.indexOf(t);e>=0&&this._parseListeners.splice(e,1),0===this._parseListeners.length&&(this._parseListeners=null)}}removeParseListeners(){this._parseListeners=null}triggerEnterRuleEvent(){if(null!==this._parseListeners){const t=this._ctx;this._parseListeners.forEach((function(e){e.enterEveryRule(t),t.enterRule(e)}))}}triggerExitRuleEvent(){if(null!==this._parseListeners){const t=this._ctx;this._parseListeners.slice(0).reverse().forEach((function(e){t.exitRule(e),e.exitEveryRule(t)}))}}getTokenFactory(){return this._input.tokenSource._factory}setTokenFactory(t){this._input.tokenSource._factory=t}getATNWithBypassAlts(){const t=this.getSerializedATN();if(null===t)throw"The current parser does not support an ATN with bypass alternatives.";let e=this.bypassAltsAtnCache[t];if(null===e){const n=new ft;n.generateRuleBypassTransitions=!0,e=new It(n).deserialize(t),this.bypassAltsAtnCache[t]=e}return e}getInputStream(){return this.getTokenStream()}setInputStream(t){this.setTokenStream(t)}getTokenStream(){return this._input}setTokenStream(t){this._input=null,this.reset(),this._input=t}get syntaxErrorsCount(){return this._syntaxErrors}getCurrentToken(){return this._input.LT(1)}notifyErrorListeners(t,e,n){n=n||null,null===(e=e||null)&&(e=this.getCurrentToken()),this._syntaxErrors+=1;const s=e.line,i=e.column;this.getErrorListener().syntaxError(this,e,s,i,t,n)}consume(){const e=this.getCurrentToken();e.type!==t.EOF&&this.getInputStream().consume();const n=null!==this._parseListeners&&this._parseListeners.length>0;if(this.buildParseTrees||n){let t;t=this._errHandler.inErrorRecoveryMode(this)?this._ctx.addErrorNode(e):this._ctx.addTokenNode(e),t.invokingState=this.state,n&&this._parseListeners.forEach((function(e){t instanceof P||void 0!==t.isErrorNode&&t.isErrorNode()?e.visitErrorNode(t):t instanceof w&&e.visitTerminal(t)}))}return e}addContextToParseTree(){null!==this._ctx.parentCtx&&this._ctx.parentCtx.addChild(this._ctx)}enterRule(t,e,n){this.state=e,this._ctx=t,this._ctx.start=this._input.LT(1),this.buildParseTrees&&this.addContextToParseTree(),this.triggerEnterRuleEvent()}exitRule(){this._ctx.stop=this._input.LT(-1),this.triggerExitRuleEvent(),this.state=this._ctx.invokingState,this._ctx=this._ctx.parentCtx}enterOuterAlt(t,e){t.setAltNumber(e),this.buildParseTrees&&this._ctx!==t&&null!==this._ctx.parentCtx&&(this._ctx.parentCtx.removeLastChild(),this._ctx.parentCtx.addChild(t)),this._ctx=t}getPrecedence(){return 0===this._precedenceStack.length?-1:this._precedenceStack[this._precedenceStack.length-1]}enterRecursionRule(t,e,n,s){this.state=e,this._precedenceStack.push(s),this._ctx=t,this._ctx.start=this._input.LT(1),this.triggerEnterRuleEvent()}pushNewRecursionContext(t,e,n){const s=this._ctx;s.parentCtx=t,s.invokingState=e,s.stop=this._input.LT(-1),this._ctx=t,this._ctx.start=s.start,this.buildParseTrees&&this._ctx.addChild(s),this.triggerEnterRuleEvent()}unrollRecursionContexts(t){this._precedenceStack.pop(),this._ctx.stop=this._input.LT(-1);const e=this._ctx,n=this.getParseListeners();if(null!==n&&n.length>0)for(;this._ctx!==t;)this.triggerExitRuleEvent(),this._ctx=this._ctx.parentCtx;else this._ctx=t;e.parentCtx=t,this.buildParseTrees&&null!==t&&t.addChild(e)}getInvokingContext(t){let e=this._ctx;for(;null!==e;){if(e.ruleIndex===t)return e;e=e.parentCtx}return null}precpred(t,e){return e>=this._precedenceStack[this._precedenceStack.length-1]}inContext(t){return!1}isExpectedToken(e){const n=this._interp.atn;let s=this._ctx;const i=n.states[this.state];let r=n.nextTokens(i);if(r.contains(e))return!0;if(!r.contains(t.EPSILON))return!1;for(;null!==s&&s.invokingState>=0&&r.contains(t.EPSILON);){const t=n.states[s.invokingState].transitions[0];if(r=n.nextTokens(t.followState),r.contains(e))return!0;s=s.parentCtx}return!(!r.contains(t.EPSILON)||e!==t.EOF)}getExpectedTokens(){return this._interp.atn.getExpectedTokens(this.state,this._ctx)}getExpectedTokensWithinCurrentRule(){const t=this._interp.atn,e=t.states[this.state];return t.nextTokens(e)}getRuleIndex(t){const e=this.getRuleIndexMap()[t];return null!==e?e:-1}getRuleInvocationStack(t){null===(t=t||null)&&(t=this._ctx);const e=[];for(;null!==t;){const n=t.ruleIndex;n<0?e.push("n/a"):e.push(this.ruleNames[n]),t=t.parentCtx}return e}getDFAStrings(){return this._interp.decisionToDFA.toString()}dumpDFA(){let t=!1;for(let e=0;e<this._interp.decisionToDFA.length;e++){const n=this._interp.decisionToDFA[e];n.states.length>0&&(t&&console.log(),this.printer.println("Decision "+n.decision+":"),this.printer.print(n.toString(this.literalNames,this.symbolicNames)),t=!0)}}getSourceName(){return this._input.getSourceName()}setTrace(t){t?(null!==this._tracer&&this.removeParseListener(this._tracer),this._tracer=new Pe(this),this.addParseListener(this._tracer)):(this.removeParseListener(this._tracer),this._tracer=null)}}be.bypassAltsAtnCache={};class De extends w{constructor(t){super(),this.parentCtx=null,this.symbol=t}getChild(t){return null}getSymbol(){return this.symbol}getParent(){return this.parentCtx}getPayload(){return this.symbol}getSourceInterval(){if(null===this.symbol)return S.INVALID_INTERVAL;const t=this.symbol.tokenIndex;return new S(t,t)}getChildCount(){return 0}accept(t){return t.visitTerminal(this)}getText(){return this.symbol.text}toString(){return this.symbol.type===t.EOF?"<EOF>":this.symbol.text}}class Fe extends De{constructor(t){super(t)}isErrorNode(){return!0}accept(t){return t.visitErrorNode(this)}}class Me extends F{constructor(t,e){super(t,e),this.children=null,this.start=null,this.stop=null,this.exception=null}copyFrom(t){this.parentCtx=t.parentCtx,this.invokingState=t.invokingState,this.children=null,this.start=t.start,this.stop=t.stop,t.children&&(this.children=[],t.children.map((function(t){t instanceof Fe&&(this.children.push(t),t.parentCtx=this)}),this))}enterRule(t){}exitRule(t){}addChild(t){return null===this.children&&(this.children=[]),this.children.push(t),t}removeLastChild(){null!==this.children&&this.children.pop()}addTokenNode(t){const e=new De(t);return this.addChild(e),e.parentCtx=this,e}addErrorNode(t){const e=new Fe(t);return this.addChild(e),e.parentCtx=this,e}getChild(t,e){if(e=e||null,null===this.children||t<0||t>=this.children.length)return null;if(null===e)return this.children[t];for(let n=0;n<this.children.length;n++){const s=this.children[n];if(s instanceof e){if(0===t)return s;t-=1}}return null}getToken(t,e){if(null===this.children||e<0||e>=this.children.length)return null;for(let n=0;n<this.children.length;n++){const s=this.children[n];if(s instanceof w&&s.symbol.type===t){if(0===e)return s;e-=1}}return null}getTokens(t){if(null===this.children)return[];{const e=[];for(let n=0;n<this.children.length;n++){const s=this.children[n];s instanceof w&&s.symbol.type===t&&e.push(s)}return e}}getTypedRuleContext(t,e){return this.getChild(e,t)}getTypedRuleContexts(t){if(null===this.children)return[];{const e=[];for(let n=0;n<this.children.length;n++){const s=this.children[n];s instanceof t&&e.push(s)}return e}}getChildCount(){return null===this.children?0:this.children.length}getSourceInterval(){return null===this.start||null===this.stop?S.INVALID_INTERVAL:new S(this.start.tokenIndex,this.stop.tokenIndex)}}F.EMPTY=new Me;class Ue{static DEFAULT_PROGRAM_NAME="default";constructor(t){this.tokens=t,this.programs=new Map}getTokenStream(){return this.tokens}insertAfter(t,e){let n,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Ue.DEFAULT_PROGRAM_NAME;n="number"==typeof t?t:t.tokenIndex;let i=this.getProgram(s),r=new ze(this.tokens,n,i.length,e);i.push(r)}insertBefore(t,e){let n,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Ue.DEFAULT_PROGRAM_NAME;n="number"==typeof t?t:t.tokenIndex;const i=this.getProgram(s),r=new Ve(this.tokens,n,i.length,e);i.push(r)}replaceSingle(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Ue.DEFAULT_PROGRAM_NAME;this.replace(t,t,e,n)}replace(t,e,n){let s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:Ue.DEFAULT_PROGRAM_NAME;if("number"!=typeof t&&(t=t.tokenIndex),"number"!=typeof e&&(e=e.tokenIndex),t>e||t<0||e<0||e>=this.tokens.size)throw new RangeError(`replace: range invalid: ${t}..${e}(size=${this.tokens.size})`);let i=this.getProgram(s),r=new qe(this.tokens,t,e,i.length,n);i.push(r)}delete(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Ue.DEFAULT_PROGRAM_NAME;void 0===e&&(e=t),this.replace(t,e,null,n)}getProgram(t){let e=this.programs.get(t);return null==e&&(e=this.initializeProgram(t)),e}initializeProgram(t){const e=[];return this.programs.set(t,e),e}getText(e){let n,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:Ue.DEFAULT_PROGRAM_NAME;n=e instanceof S?e:new S(0,this.tokens.size-1),"string"==typeof e&&(s=e);const i=this.programs.get(s);let r=n.start,o=n.stop;if(o>this.tokens.size-1&&(o=this.tokens.size-1),r<0&&(r=0),null==i||0===i.length)return this.tokens.getText(new S(r,o));let a=[],l=this.reduceToSingleOperationPerIndex(i),h=r;for(;h<=o&&h<this.tokens.size;){let e=l.get(h);l.delete(h);let n=this.tokens.get(h);null==e?(n.type!==t.EOF&&a.push(String(n.text)),h++):h=e.execute(a)}if(o===this.tokens.size-1)for(const t of l.values())t.index>=this.tokens.size-1&&a.push(t.text.toString());return a.join("")}reduceToSingleOperationPerIndex(t){for(let e=0;e<t.length;e++){let n=t[e];if(null==n)continue;if(!(n instanceof qe))continue;let s=n,i=this.getKindOfOps(t,Ve,e);for(let e of i)e.index===s.index?(t[e.instructionIndex]=void 0,s.text=e.text.toString()+(null!=s.text?s.text.toString():"")):e.index>s.index&&e.index<=s.lastIndex&&(t[e.instructionIndex]=void 0);let r=this.getKindOfOps(t,qe,e);for(let e of r){if(e.index>=s.index&&e.lastIndex<=s.lastIndex){t[e.instructionIndex]=void 0;continue}let n=e.lastIndex<s.index||e.index>s.lastIndex;if(null!=e.text||null!=s.text||n){if(!n)throw new Error(`replace op boundaries of ${s} overlap with previous ${e}`)}else t[e.instructionIndex]=void 0,s.index=Math.min(e.index,s.index),s.lastIndex=Math.max(e.lastIndex,s.lastIndex)}}for(let e=0;e<t.length;e++){let n=t[e];if(null==n)continue;if(!(n instanceof Ve))continue;let s=n,i=this.getKindOfOps(t,Ve,e);for(let e of i)e.index===s.index&&(e instanceof ze?(s.text=this.catOpText(e.text,s.text),t[e.instructionIndex]=void 0):e instanceof Ve&&(s.text=this.catOpText(s.text,e.text),t[e.instructionIndex]=void 0));let r=this.getKindOfOps(t,qe,e);for(let n of r)if(s.index!==n.index){if(s.index>=n.index&&s.index<=n.lastIndex)throw new Error(`insert op ${s} within boundaries of previous ${n}`)}else n.text=this.catOpText(s.text,n.text),t[e]=void 0}let e=new Map;for(let n of t)if(null!=n){if(null!=e.get(n.index))throw new Error("should only be one op per index");e.set(n.index,n)}return e}catOpText(t,e){let n="",s="";return null!=t&&(n=t.toString()),null!=e&&(s=e.toString()),n+s}getKindOfOps(t,e,n){return t.slice(0,n).filter((t=>t&&t instanceof e))}}class Be{constructor(t,e,n,s){this.tokens=t,this.instructionIndex=n,this.index=e,this.text=void 0===s?"":s}toString(){let t=this.constructor.name;const e=t.indexOf("$");return t=t.substring(e+1,t.length),"<"+t+"@"+this.tokens.get(this.index)+':"'+this.text+'">'}}class Ve extends Be{constructor(t,e,n,s){super(t,e,n,s)}execute(e){return this.text&&e.push(this.text.toString()),this.tokens.get(this.index).type!==t.EOF&&e.push(String(this.tokens.get(this.index).text)),this.index+1}}class ze extends Ve{constructor(t,e,n,s){super(t,e+1,n,s)}}class qe extends Be{constructor(t,e,n,s,i){super(t,e,s,i),this.lastIndex=n}execute(t){return this.text&&t.push(this.text.toString()),this.lastIndex+1}toString(){return null==this.text?"<DeleteOp@"+this.tokens.get(this.index)+".."+this.tokens.get(this.lastIndex)+">":"<ReplaceOp@"+this.tokens.get(this.index)+".."+this.tokens.get(this.lastIndex)+':"'+this.text+'">'}}const He={atn:se,dfa:ae,context:le,misc:he,tree:ge,error:Ce,Token:t,CommonToken:vt,CharStreams:Le,CharStream:Ae,InputStream:Ne,CommonTokenStream:we,Lexer:Ft,Parser:be,ParserRuleContext:Me,Interval:S,IntervalSet:m,LL1Analyzer:G,Utils:Oe,TokenStreamRewriter:Ue}})();var i=exports;for(var r in s)i[r]=s[r];s.__esModule&&Object.defineProperty(i,"__esModule",{value:!0})})();
//# sourceMappingURL=antlr4.web.cjs.map
    
    // Export to global
    global.antlr4 = module.exports;
    
    // Also support default export
    if (module.exports.default) {
        Object.assign(global.antlr4, module.exports.default);
    }
})(typeof window !== 'undefined' ? window : this);


// ProperTeeLexer.js - Browser Compatible Version
(function(global) {
    const antlr4 = global.antlr4;

// Generated from ProperTee.g4 by ANTLR 4.13.2
// jshint ignore: start
const serializedATN = [4,0,50,323,6,-1,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,
4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,
12,2,13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,
2,20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,26,7,26,2,
27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,31,2,32,7,32,2,33,7,33,2,34,
7,34,2,35,7,35,2,36,7,36,2,37,7,37,2,38,7,38,2,39,7,39,2,40,7,40,2,41,7,
41,2,42,7,42,2,43,7,43,2,44,7,44,2,45,7,45,2,46,7,46,2,47,7,47,2,48,7,48,
2,49,7,49,1,0,1,0,1,1,1,1,1,2,1,2,1,3,1,3,1,4,1,4,1,5,1,5,1,5,1,6,1,6,1,
7,1,7,1,8,1,8,1,9,1,9,1,10,1,10,1,11,1,11,1,12,1,12,1,13,1,13,1,14,1,14,
1,15,1,15,1,16,1,16,1,17,1,17,1,18,1,18,1,19,1,19,1,19,1,20,1,20,1,20,1,
21,1,21,1,21,1,22,1,22,1,22,1,23,1,23,1,23,1,24,1,24,1,24,1,24,1,24,1,25,
1,25,1,25,1,25,1,25,1,26,1,26,1,26,1,26,1,27,1,27,1,27,1,27,1,27,1,28,1,
28,1,28,1,29,1,29,1,29,1,30,1,30,1,30,1,30,1,30,1,30,1,31,1,31,1,31,1,31,
1,31,1,31,1,31,1,31,1,31,1,32,1,32,1,32,1,32,1,32,1,32,1,32,1,32,1,32,1,
33,1,33,1,33,1,33,1,33,1,33,1,33,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,35,
1,35,1,35,1,35,1,36,1,36,1,36,1,36,1,37,1,37,1,37,1,38,1,38,1,38,1,38,1,
38,1,39,1,39,1,39,1,39,1,39,1,39,1,40,1,40,1,40,1,40,1,40,1,41,1,41,1,41,
1,41,1,41,1,41,1,41,1,41,1,41,1,42,1,42,1,42,1,42,1,42,1,42,1,43,1,43,1,
43,1,43,1,43,1,43,1,43,1,43,1,44,1,44,5,44,271,8,44,10,44,12,44,274,9,44,
1,45,4,45,277,8,45,11,45,12,45,278,1,46,1,46,1,46,1,46,5,46,285,8,46,10,
46,12,46,288,9,46,1,46,1,46,1,47,1,47,1,47,1,47,5,47,296,8,47,10,47,12,47,
299,9,47,1,47,1,47,1,48,1,48,1,48,1,48,5,48,307,8,48,10,48,12,48,310,9,48,
1,48,1,48,1,48,1,48,1,48,1,49,4,49,318,8,49,11,49,12,49,319,1,49,1,49,1,
308,0,50,1,1,3,2,5,3,7,4,9,5,11,6,13,7,15,8,17,9,19,10,21,11,23,12,25,13,
27,14,29,15,31,16,33,17,35,18,37,19,39,20,41,21,43,22,45,23,47,24,49,25,
51,26,53,27,55,28,57,29,59,30,61,31,63,32,65,33,67,34,69,35,71,36,73,37,
75,38,77,39,79,40,81,41,83,42,85,43,87,44,89,45,91,46,93,47,95,48,97,49,
99,50,1,0,6,3,0,65,90,95,95,97,122,4,0,48,57,65,90,95,95,97,122,1,0,48,57,
2,0,34,34,92,92,2,0,10,10,13,13,4,0,9,10,13,13,32,32,59,59,329,0,1,1,0,0,
0,0,3,1,0,0,0,0,5,1,0,0,0,0,7,1,0,0,0,0,9,1,0,0,0,0,11,1,0,0,0,0,13,1,0,
0,0,0,15,1,0,0,0,0,17,1,0,0,0,0,19,1,0,0,0,0,21,1,0,0,0,0,23,1,0,0,0,0,25,
1,0,0,0,0,27,1,0,0,0,0,29,1,0,0,0,0,31,1,0,0,0,0,33,1,0,0,0,0,35,1,0,0,0,
0,37,1,0,0,0,0,39,1,0,0,0,0,41,1,0,0,0,0,43,1,0,0,0,0,45,1,0,0,0,0,47,1,
0,0,0,0,49,1,0,0,0,0,51,1,0,0,0,0,53,1,0,0,0,0,55,1,0,0,0,0,57,1,0,0,0,0,
59,1,0,0,0,0,61,1,0,0,0,0,63,1,0,0,0,0,65,1,0,0,0,0,67,1,0,0,0,0,69,1,0,
0,0,0,71,1,0,0,0,0,73,1,0,0,0,0,75,1,0,0,0,0,77,1,0,0,0,0,79,1,0,0,0,0,81,
1,0,0,0,0,83,1,0,0,0,0,85,1,0,0,0,0,87,1,0,0,0,0,89,1,0,0,0,0,91,1,0,0,0,
0,93,1,0,0,0,0,95,1,0,0,0,0,97,1,0,0,0,0,99,1,0,0,0,1,101,1,0,0,0,3,103,
1,0,0,0,5,105,1,0,0,0,7,107,1,0,0,0,9,109,1,0,0,0,11,111,1,0,0,0,13,114,
1,0,0,0,15,116,1,0,0,0,17,118,1,0,0,0,19,120,1,0,0,0,21,122,1,0,0,0,23,124,
1,0,0,0,25,126,1,0,0,0,27,128,1,0,0,0,29,130,1,0,0,0,31,132,1,0,0,0,33,134,
1,0,0,0,35,136,1,0,0,0,37,138,1,0,0,0,39,140,1,0,0,0,41,143,1,0,0,0,43,146,
1,0,0,0,45,149,1,0,0,0,47,152,1,0,0,0,49,155,1,0,0,0,51,160,1,0,0,0,53,165,
1,0,0,0,55,169,1,0,0,0,57,174,1,0,0,0,59,177,1,0,0,0,61,180,1,0,0,0,63,186,
1,0,0,0,65,195,1,0,0,0,67,204,1,0,0,0,69,211,1,0,0,0,71,218,1,0,0,0,73,222,
1,0,0,0,75,226,1,0,0,0,77,229,1,0,0,0,79,234,1,0,0,0,81,240,1,0,0,0,83,245,
1,0,0,0,85,254,1,0,0,0,87,260,1,0,0,0,89,268,1,0,0,0,91,276,1,0,0,0,93,280,
1,0,0,0,95,291,1,0,0,0,97,302,1,0,0,0,99,317,1,0,0,0,101,102,5,61,0,0,102,
2,1,0,0,0,103,104,5,46,0,0,104,4,1,0,0,0,105,106,5,40,0,0,106,6,1,0,0,0,
107,108,5,41,0,0,108,8,1,0,0,0,109,110,5,44,0,0,110,10,1,0,0,0,111,112,5,
45,0,0,112,113,5,62,0,0,113,12,1,0,0,0,114,115,5,45,0,0,115,14,1,0,0,0,116,
117,5,42,0,0,117,16,1,0,0,0,118,119,5,47,0,0,119,18,1,0,0,0,120,121,5,37,
0,0,121,20,1,0,0,0,122,123,5,43,0,0,123,22,1,0,0,0,124,125,5,36,0,0,125,
24,1,0,0,0,126,127,5,123,0,0,127,26,1,0,0,0,128,129,5,125,0,0,129,28,1,0,
0,0,130,131,5,58,0,0,131,30,1,0,0,0,132,133,5,91,0,0,133,32,1,0,0,0,134,
135,5,93,0,0,135,34,1,0,0,0,136,137,5,62,0,0,137,36,1,0,0,0,138,139,5,60,
0,0,139,38,1,0,0,0,140,141,5,61,0,0,141,142,5,61,0,0,142,40,1,0,0,0,143,
144,5,62,0,0,144,145,5,61,0,0,145,42,1,0,0,0,146,147,5,60,0,0,147,148,5,
61,0,0,148,44,1,0,0,0,149,150,5,33,0,0,150,151,5,61,0,0,151,46,1,0,0,0,152,
153,5,105,0,0,153,154,5,102,0,0,154,48,1,0,0,0,155,156,5,116,0,0,156,157,
5,104,0,0,157,158,5,101,0,0,158,159,5,110,0,0,159,50,1,0,0,0,160,161,5,101,
0,0,161,162,5,108,0,0,162,163,5,115,0,0,163,164,5,101,0,0,164,52,1,0,0,0,
165,166,5,101,0,0,166,167,5,110,0,0,167,168,5,100,0,0,168,54,1,0,0,0,169,
170,5,108,0,0,170,171,5,111,0,0,171,172,5,111,0,0,172,173,5,112,0,0,173,
56,1,0,0,0,174,175,5,105,0,0,175,176,5,110,0,0,176,58,1,0,0,0,177,178,5,
100,0,0,178,179,5,111,0,0,179,60,1,0,0,0,180,181,5,98,0,0,181,182,5,114,
0,0,182,183,5,101,0,0,183,184,5,97,0,0,184,185,5,107,0,0,185,62,1,0,0,0,
186,187,5,99,0,0,187,188,5,111,0,0,188,189,5,110,0,0,189,190,5,116,0,0,190,
191,5,105,0,0,191,192,5,110,0,0,192,193,5,117,0,0,193,194,5,101,0,0,194,
64,1,0,0,0,195,196,5,102,0,0,196,197,5,117,0,0,197,198,5,110,0,0,198,199,
5,99,0,0,199,200,5,116,0,0,200,201,5,105,0,0,201,202,5,111,0,0,202,203,5,
110,0,0,203,66,1,0,0,0,204,205,5,116,0,0,205,206,5,104,0,0,206,207,5,114,
0,0,207,208,5,101,0,0,208,209,5,97,0,0,209,210,5,100,0,0,210,68,1,0,0,0,
211,212,5,114,0,0,212,213,5,101,0,0,213,214,5,116,0,0,214,215,5,117,0,0,
215,216,5,114,0,0,216,217,5,110,0,0,217,70,1,0,0,0,218,219,5,110,0,0,219,
220,5,111,0,0,220,221,5,116,0,0,221,72,1,0,0,0,222,223,5,97,0,0,223,224,
5,110,0,0,224,225,5,100,0,0,225,74,1,0,0,0,226,227,5,111,0,0,227,228,5,114,
0,0,228,76,1,0,0,0,229,230,5,116,0,0,230,231,5,114,0,0,231,232,5,117,0,0,
232,233,5,101,0,0,233,78,1,0,0,0,234,235,5,102,0,0,235,236,5,97,0,0,236,
237,5,108,0,0,237,238,5,115,0,0,238,239,5,101,0,0,239,80,1,0,0,0,240,241,
5,110,0,0,241,242,5,117,0,0,242,243,5,108,0,0,243,244,5,108,0,0,244,82,1,
0,0,0,245,246,5,105,0,0,246,247,5,110,0,0,247,248,5,102,0,0,248,249,5,105,
0,0,249,250,5,110,0,0,250,251,5,105,0,0,251,252,5,116,0,0,252,253,5,101,
0,0,253,84,1,0,0,0,254,255,5,109,0,0,255,256,5,117,0,0,256,257,5,108,0,0,
257,258,5,116,0,0,258,259,5,105,0,0,259,86,1,0,0,0,260,261,5,109,0,0,261,
262,5,111,0,0,262,263,5,110,0,0,263,264,5,105,0,0,264,265,5,116,0,0,265,
266,5,111,0,0,266,267,5,114,0,0,267,88,1,0,0,0,268,272,7,0,0,0,269,271,7,
1,0,0,270,269,1,0,0,0,271,274,1,0,0,0,272,270,1,0,0,0,272,273,1,0,0,0,273,
90,1,0,0,0,274,272,1,0,0,0,275,277,7,2,0,0,276,275,1,0,0,0,277,278,1,0,0,
0,278,276,1,0,0,0,278,279,1,0,0,0,279,92,1,0,0,0,280,286,5,34,0,0,281,282,
5,92,0,0,282,285,9,0,0,0,283,285,8,3,0,0,284,281,1,0,0,0,284,283,1,0,0,0,
285,288,1,0,0,0,286,284,1,0,0,0,286,287,1,0,0,0,287,289,1,0,0,0,288,286,
1,0,0,0,289,290,5,34,0,0,290,94,1,0,0,0,291,292,5,47,0,0,292,293,5,47,0,
0,293,297,1,0,0,0,294,296,8,4,0,0,295,294,1,0,0,0,296,299,1,0,0,0,297,295,
1,0,0,0,297,298,1,0,0,0,298,300,1,0,0,0,299,297,1,0,0,0,300,301,6,47,0,0,
301,96,1,0,0,0,302,303,5,47,0,0,303,304,5,42,0,0,304,308,1,0,0,0,305,307,
9,0,0,0,306,305,1,0,0,0,307,310,1,0,0,0,308,309,1,0,0,0,308,306,1,0,0,0,
309,311,1,0,0,0,310,308,1,0,0,0,311,312,5,42,0,0,312,313,5,47,0,0,313,314,
1,0,0,0,314,315,6,48,0,0,315,98,1,0,0,0,316,318,7,5,0,0,317,316,1,0,0,0,
318,319,1,0,0,0,319,317,1,0,0,0,319,320,1,0,0,0,320,321,1,0,0,0,321,322,
6,49,0,0,322,100,1,0,0,0,8,0,272,278,284,286,297,308,319,1,6,0,0];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

class ProperTeeLexer extends antlr4.Lexer {

    static grammarFileName = "ProperTee.g4";
    static channelNames = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];
	static modeNames = [ "DEFAULT_MODE" ];
	static literalNames = [ null, "'='", "'.'", "'('", "')'", "','", "'->'", 
                         "'-'", "'*'", "'/'", "'%'", "'+'", "'$'", "'{'", 
                         "'}'", "':'", "'['", "']'", "'>'", "'<'", "'=='", 
                         "'>='", "'<='", "'!='", "'if'", "'then'", "'else'", 
                         "'end'", "'loop'", "'in'", "'do'", "'break'", "'continue'", 
                         "'function'", "'thread'", "'return'", "'not'", 
                         "'and'", "'or'", "'true'", "'false'", "'null'", 
                         "'infinite'", "'multi'", "'monitor'" ];
	static symbolicNames = [ null, null, null, null, null, null, null, null, 
                          null, null, null, null, null, null, null, null, 
                          null, null, null, null, null, null, null, null, 
                          "K_IF", "K_THEN", "K_ELSE", "K_END", "K_LOOP", 
                          "K_IN", "K_DO", "K_BREAK", "K_CONTINUE", "K_FUNCTION", 
                          "K_THREAD", "K_RETURN", "K_NOT", "K_AND", "K_OR", 
                          "K_TRUE", "K_FALSE", "K_NULL", "K_INFINITE", "K_MULTI", 
                          "K_MONITOR", "ID", "INTEGER", "STRING", "COMMENT", 
                          "BLOCK_COMMENT", "WS" ];
	static ruleNames = [ "T__0", "T__1", "T__2", "T__3", "T__4", "T__5", "T__6", 
                      "T__7", "T__8", "T__9", "T__10", "T__11", "T__12", 
                      "T__13", "T__14", "T__15", "T__16", "T__17", "T__18", 
                      "T__19", "T__20", "T__21", "T__22", "K_IF", "K_THEN", 
                      "K_ELSE", "K_END", "K_LOOP", "K_IN", "K_DO", "K_BREAK", 
                      "K_CONTINUE", "K_FUNCTION", "K_THREAD", "K_RETURN", 
                      "K_NOT", "K_AND", "K_OR", "K_TRUE", "K_FALSE", "K_NULL", 
                      "K_INFINITE", "K_MULTI", "K_MONITOR", "ID", "INTEGER", 
                      "STRING", "COMMENT", "BLOCK_COMMENT", "WS" ];

    constructor(input) {
        super(input)
        this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.atn.PredictionContextCache());
    }
}

ProperTeeLexer.EOF = antlr4.Token.EOF;
ProperTeeLexer.T__0 = 1;
ProperTeeLexer.T__1 = 2;
ProperTeeLexer.T__2 = 3;
ProperTeeLexer.T__3 = 4;
ProperTeeLexer.T__4 = 5;
ProperTeeLexer.T__5 = 6;
ProperTeeLexer.T__6 = 7;
ProperTeeLexer.T__7 = 8;
ProperTeeLexer.T__8 = 9;
ProperTeeLexer.T__9 = 10;
ProperTeeLexer.T__10 = 11;
ProperTeeLexer.T__11 = 12;
ProperTeeLexer.T__12 = 13;
ProperTeeLexer.T__13 = 14;
ProperTeeLexer.T__14 = 15;
ProperTeeLexer.T__15 = 16;
ProperTeeLexer.T__16 = 17;
ProperTeeLexer.T__17 = 18;
ProperTeeLexer.T__18 = 19;
ProperTeeLexer.T__19 = 20;
ProperTeeLexer.T__20 = 21;
ProperTeeLexer.T__21 = 22;
ProperTeeLexer.T__22 = 23;
ProperTeeLexer.K_IF = 24;
ProperTeeLexer.K_THEN = 25;
ProperTeeLexer.K_ELSE = 26;
ProperTeeLexer.K_END = 27;
ProperTeeLexer.K_LOOP = 28;
ProperTeeLexer.K_IN = 29;
ProperTeeLexer.K_DO = 30;
ProperTeeLexer.K_BREAK = 31;
ProperTeeLexer.K_CONTINUE = 32;
ProperTeeLexer.K_FUNCTION = 33;
ProperTeeLexer.K_THREAD = 34;
ProperTeeLexer.K_RETURN = 35;
ProperTeeLexer.K_NOT = 36;
ProperTeeLexer.K_AND = 37;
ProperTeeLexer.K_OR = 38;
ProperTeeLexer.K_TRUE = 39;
ProperTeeLexer.K_FALSE = 40;
ProperTeeLexer.K_NULL = 41;
ProperTeeLexer.K_INFINITE = 42;
ProperTeeLexer.K_MULTI = 43;
ProperTeeLexer.K_MONITOR = 44;
ProperTeeLexer.ID = 45;
ProperTeeLexer.INTEGER = 46;
ProperTeeLexer.STRING = 47;
ProperTeeLexer.COMMENT = 48;
ProperTeeLexer.BLOCK_COMMENT = 49;
ProperTeeLexer.WS = 50;





    global.ProperTeeLexer = ProperTeeLexer;
})(typeof window !== 'undefined' ? window : this);


// ProperTeeParser.js - Browser Compatible Version
(function(global) {
    const antlr4 = global.antlr4;

// Generated from ProperTee.g4 by ANTLR 4.13.2
// jshint ignore: start
const serializedATN = [4,1,50,300,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,
4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,
2,13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,
20,7,20,2,21,7,21,2,22,7,22,1,0,5,0,48,8,0,10,0,12,0,51,9,0,1,0,1,0,1,1,
1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,63,8,1,1,2,1,2,1,2,1,2,1,3,1,3,1,3,1,3,1,
3,1,3,5,3,75,8,3,10,3,12,3,78,9,3,1,4,5,4,81,8,4,10,4,12,4,84,9,4,1,5,1,
5,1,5,1,5,1,5,1,5,3,5,92,8,5,1,5,1,5,1,6,1,6,1,6,1,6,3,6,100,8,6,1,6,1,6,
1,6,1,6,1,6,1,7,1,7,1,7,1,7,3,7,111,8,7,1,7,1,7,1,7,1,7,1,7,1,8,1,8,1,8,
5,8,121,8,8,10,8,12,8,124,9,8,1,9,1,9,4,9,128,8,9,11,9,12,9,129,1,9,3,9,
133,8,9,1,9,1,9,1,10,1,10,1,10,1,10,1,11,1,11,1,11,1,11,1,11,3,11,146,8,
11,1,12,1,12,1,12,3,12,151,8,12,1,12,1,12,1,12,1,12,1,12,1,12,1,12,1,12,
1,12,3,12,162,8,12,1,12,1,12,1,12,1,12,1,12,1,12,1,12,1,12,1,12,1,12,1,12,
3,12,175,8,12,1,12,1,12,1,12,1,12,3,12,181,8,12,1,13,1,13,1,13,1,13,3,13,
187,8,13,3,13,189,8,13,1,14,1,14,1,14,1,14,1,14,1,14,3,14,197,8,14,1,14,
1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,
14,1,14,1,14,1,14,5,14,218,8,14,10,14,12,14,221,9,14,1,15,1,15,1,15,1,15,
1,15,1,15,1,15,1,15,1,15,1,15,3,15,233,8,15,1,16,1,16,1,16,1,16,1,16,1,16,
1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,16,3,16,250,8,16,1,17,1,17,1,17,
1,17,1,17,5,17,257,8,17,10,17,12,17,260,9,17,3,17,262,8,17,1,17,1,17,1,18,
1,18,1,18,1,18,5,18,270,8,18,10,18,12,18,273,9,18,3,18,275,8,18,1,18,1,18,
1,19,1,19,1,19,1,19,1,20,1,20,1,21,1,21,1,21,1,21,5,21,289,8,21,10,21,12,
21,292,9,21,3,21,294,8,21,1,21,1,21,1,22,1,22,1,22,0,2,6,28,23,0,2,4,6,8,
10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,0,5,1,0,8,10,2,0,7,
7,11,11,1,0,39,40,1,0,45,47,1,0,18,23,328,0,49,1,0,0,0,2,62,1,0,0,0,4,64,
1,0,0,0,6,68,1,0,0,0,8,82,1,0,0,0,10,85,1,0,0,0,12,95,1,0,0,0,14,106,1,0,
0,0,16,117,1,0,0,0,18,125,1,0,0,0,20,136,1,0,0,0,22,145,1,0,0,0,24,180,1,
0,0,0,26,188,1,0,0,0,28,196,1,0,0,0,30,232,1,0,0,0,32,249,1,0,0,0,34,251,
1,0,0,0,36,265,1,0,0,0,38,278,1,0,0,0,40,282,1,0,0,0,42,284,1,0,0,0,44,297,
1,0,0,0,46,48,3,2,1,0,47,46,1,0,0,0,48,51,1,0,0,0,49,47,1,0,0,0,49,50,1,
0,0,0,50,52,1,0,0,0,51,49,1,0,0,0,52,53,5,0,0,1,53,1,1,0,0,0,54,63,3,4,2,
0,55,63,3,10,5,0,56,63,3,24,12,0,57,63,3,12,6,0,58,63,3,14,7,0,59,63,3,18,
9,0,60,63,3,26,13,0,61,63,3,28,14,0,62,54,1,0,0,0,62,55,1,0,0,0,62,56,1,
0,0,0,62,57,1,0,0,0,62,58,1,0,0,0,62,59,1,0,0,0,62,60,1,0,0,0,62,61,1,0,
0,0,63,3,1,0,0,0,64,65,3,6,3,0,65,66,5,1,0,0,66,67,3,28,14,0,67,5,1,0,0,
0,68,69,6,3,-1,0,69,70,5,45,0,0,70,76,1,0,0,0,71,72,10,1,0,0,72,73,5,2,0,
0,73,75,3,30,15,0,74,71,1,0,0,0,75,78,1,0,0,0,76,74,1,0,0,0,76,77,1,0,0,
0,77,7,1,0,0,0,78,76,1,0,0,0,79,81,3,2,1,0,80,79,1,0,0,0,81,84,1,0,0,0,82,
80,1,0,0,0,82,83,1,0,0,0,83,9,1,0,0,0,84,82,1,0,0,0,85,86,5,24,0,0,86,87,
3,28,14,0,87,88,5,25,0,0,88,91,3,8,4,0,89,90,5,26,0,0,90,92,3,8,4,0,91,89,
1,0,0,0,91,92,1,0,0,0,92,93,1,0,0,0,93,94,5,27,0,0,94,11,1,0,0,0,95,96,5,
33,0,0,96,97,5,45,0,0,97,99,5,3,0,0,98,100,3,16,8,0,99,98,1,0,0,0,99,100,
1,0,0,0,100,101,1,0,0,0,101,102,5,4,0,0,102,103,5,30,0,0,103,104,3,8,4,0,
104,105,5,27,0,0,105,13,1,0,0,0,106,107,5,34,0,0,107,108,5,45,0,0,108,110,
5,3,0,0,109,111,3,16,8,0,110,109,1,0,0,0,110,111,1,0,0,0,111,112,1,0,0,0,
112,113,5,4,0,0,113,114,5,30,0,0,114,115,3,8,4,0,115,116,5,27,0,0,116,15,
1,0,0,0,117,122,5,45,0,0,118,119,5,5,0,0,119,121,5,45,0,0,120,118,1,0,0,
0,121,124,1,0,0,0,122,120,1,0,0,0,122,123,1,0,0,0,123,17,1,0,0,0,124,122,
1,0,0,0,125,127,5,43,0,0,126,128,3,22,11,0,127,126,1,0,0,0,128,129,1,0,0,
0,129,127,1,0,0,0,129,130,1,0,0,0,130,132,1,0,0,0,131,133,3,20,10,0,132,
131,1,0,0,0,132,133,1,0,0,0,133,134,1,0,0,0,134,135,5,27,0,0,135,19,1,0,
0,0,136,137,5,44,0,0,137,138,5,46,0,0,138,139,3,8,4,0,139,21,1,0,0,0,140,
141,3,34,17,0,141,142,5,6,0,0,142,143,5,45,0,0,143,146,1,0,0,0,144,146,3,
34,17,0,145,140,1,0,0,0,145,144,1,0,0,0,146,23,1,0,0,0,147,148,5,28,0,0,
148,150,3,28,14,0,149,151,5,42,0,0,150,149,1,0,0,0,150,151,1,0,0,0,151,152,
1,0,0,0,152,153,5,30,0,0,153,154,3,8,4,0,154,155,5,27,0,0,155,181,1,0,0,
0,156,157,5,28,0,0,157,158,5,45,0,0,158,159,5,29,0,0,159,161,3,28,14,0,160,
162,5,42,0,0,161,160,1,0,0,0,161,162,1,0,0,0,162,163,1,0,0,0,163,164,5,30,
0,0,164,165,3,8,4,0,165,166,5,27,0,0,166,181,1,0,0,0,167,168,5,28,0,0,168,
169,5,45,0,0,169,170,5,5,0,0,170,171,5,45,0,0,171,172,5,29,0,0,172,174,3,
28,14,0,173,175,5,42,0,0,174,173,1,0,0,0,174,175,1,0,0,0,175,176,1,0,0,0,
176,177,5,30,0,0,177,178,3,8,4,0,178,179,5,27,0,0,179,181,1,0,0,0,180,147,
1,0,0,0,180,156,1,0,0,0,180,167,1,0,0,0,181,25,1,0,0,0,182,189,5,31,0,0,
183,189,5,32,0,0,184,186,5,35,0,0,185,187,3,28,14,0,186,185,1,0,0,0,186,
187,1,0,0,0,187,189,1,0,0,0,188,182,1,0,0,0,188,183,1,0,0,0,188,184,1,0,
0,0,189,27,1,0,0,0,190,191,6,14,-1,0,191,197,3,32,16,0,192,193,5,7,0,0,193,
197,3,28,14,7,194,195,5,36,0,0,195,197,3,28,14,6,196,190,1,0,0,0,196,192,
1,0,0,0,196,194,1,0,0,0,197,219,1,0,0,0,198,199,10,5,0,0,199,200,7,0,0,0,
200,218,3,28,14,6,201,202,10,4,0,0,202,203,7,1,0,0,203,218,3,28,14,5,204,
205,10,3,0,0,205,206,3,44,22,0,206,207,3,28,14,4,207,218,1,0,0,0,208,209,
10,2,0,0,209,210,5,37,0,0,210,218,3,28,14,3,211,212,10,1,0,0,212,213,5,38,
0,0,213,218,3,28,14,2,214,215,10,8,0,0,215,216,5,2,0,0,216,218,3,30,15,0,
217,198,1,0,0,0,217,201,1,0,0,0,217,204,1,0,0,0,217,208,1,0,0,0,217,211,
1,0,0,0,217,214,1,0,0,0,218,221,1,0,0,0,219,217,1,0,0,0,219,220,1,0,0,0,
220,29,1,0,0,0,221,219,1,0,0,0,222,233,5,45,0,0,223,233,5,46,0,0,224,233,
5,47,0,0,225,226,5,12,0,0,226,233,5,45,0,0,227,228,5,12,0,0,228,229,5,3,
0,0,229,230,3,28,14,0,230,231,5,4,0,0,231,233,1,0,0,0,232,222,1,0,0,0,232,
223,1,0,0,0,232,224,1,0,0,0,232,225,1,0,0,0,232,227,1,0,0,0,233,31,1,0,0,
0,234,250,3,34,17,0,235,250,5,45,0,0,236,237,5,46,0,0,237,238,5,2,0,0,238,
250,5,46,0,0,239,250,5,46,0,0,240,250,5,47,0,0,241,250,7,2,0,0,242,250,5,
41,0,0,243,250,3,36,18,0,244,250,3,42,21,0,245,246,5,3,0,0,246,247,3,28,
14,0,247,248,5,4,0,0,248,250,1,0,0,0,249,234,1,0,0,0,249,235,1,0,0,0,249,
236,1,0,0,0,249,239,1,0,0,0,249,240,1,0,0,0,249,241,1,0,0,0,249,242,1,0,
0,0,249,243,1,0,0,0,249,244,1,0,0,0,249,245,1,0,0,0,250,33,1,0,0,0,251,252,
5,45,0,0,252,261,5,3,0,0,253,258,3,28,14,0,254,255,5,5,0,0,255,257,3,28,
14,0,256,254,1,0,0,0,257,260,1,0,0,0,258,256,1,0,0,0,258,259,1,0,0,0,259,
262,1,0,0,0,260,258,1,0,0,0,261,253,1,0,0,0,261,262,1,0,0,0,262,263,1,0,
0,0,263,264,5,4,0,0,264,35,1,0,0,0,265,274,5,13,0,0,266,271,3,38,19,0,267,
268,5,5,0,0,268,270,3,38,19,0,269,267,1,0,0,0,270,273,1,0,0,0,271,269,1,
0,0,0,271,272,1,0,0,0,272,275,1,0,0,0,273,271,1,0,0,0,274,266,1,0,0,0,274,
275,1,0,0,0,275,276,1,0,0,0,276,277,5,14,0,0,277,37,1,0,0,0,278,279,3,40,
20,0,279,280,5,15,0,0,280,281,3,28,14,0,281,39,1,0,0,0,282,283,7,3,0,0,283,
41,1,0,0,0,284,293,5,16,0,0,285,290,3,28,14,0,286,287,5,5,0,0,287,289,3,
28,14,0,288,286,1,0,0,0,289,292,1,0,0,0,290,288,1,0,0,0,290,291,1,0,0,0,
291,294,1,0,0,0,292,290,1,0,0,0,293,285,1,0,0,0,293,294,1,0,0,0,294,295,
1,0,0,0,295,296,5,17,0,0,296,43,1,0,0,0,297,298,7,4,0,0,298,45,1,0,0,0,28,
49,62,76,82,91,99,110,122,129,132,145,150,161,174,180,186,188,196,217,219,
232,249,258,261,271,274,290,293];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.atn.PredictionContextCache();

class ProperTeeParser extends antlr4.Parser {

    static grammarFileName = "ProperTee.g4";
    static literalNames = [ null, "'='", "'.'", "'('", "')'", "','", "'->'", 
                            "'-'", "'*'", "'/'", "'%'", "'+'", "'$'", "'{'", 
                            "'}'", "':'", "'['", "']'", "'>'", "'<'", "'=='", 
                            "'>='", "'<='", "'!='", "'if'", "'then'", "'else'", 
                            "'end'", "'loop'", "'in'", "'do'", "'break'", 
                            "'continue'", "'function'", "'thread'", "'return'", 
                            "'not'", "'and'", "'or'", "'true'", "'false'", 
                            "'null'", "'infinite'", "'multi'", "'monitor'" ];
    static symbolicNames = [ null, null, null, null, null, null, null, null, 
                             null, null, null, null, null, null, null, null, 
                             null, null, null, null, null, null, null, null, 
                             "K_IF", "K_THEN", "K_ELSE", "K_END", "K_LOOP", 
                             "K_IN", "K_DO", "K_BREAK", "K_CONTINUE", "K_FUNCTION", 
                             "K_THREAD", "K_RETURN", "K_NOT", "K_AND", "K_OR", 
                             "K_TRUE", "K_FALSE", "K_NULL", "K_INFINITE", 
                             "K_MULTI", "K_MONITOR", "ID", "INTEGER", "STRING", 
                             "COMMENT", "BLOCK_COMMENT", "WS" ];
    static ruleNames = [ "root", "statement", "assignment", "lvalue", "block", 
                         "ifStatement", "functionDef", "threadDef", "parameterList", 
                         "parallelStmt", "monitorClause", "parallelTask", 
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
	        while((((_la) & ~0x1f) === 0 && ((1 << _la) & 2432770184) !== 0) || ((((_la - 32)) & ~0x1f) === 0 && ((1 << (_la - 32)) & 60319) !== 0)) {
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
	            localctx = new ThreadDefStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 5);
	            this.state = 58;
	            this.threadDef();
	            break;

	        case 6:
	            localctx = new ParallelExecStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 6);
	            this.state = 59;
	            this.parallelStmt();
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
	        localctx = new VarLValueContext(this, localctx);
	        this._ctx = localctx;
	        _prevctx = localctx;

	        this.state = 69;
	        this.match(ProperTeeParser.ID);
	        this._ctx.stop = this._input.LT(-1);
	        this.state = 76;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,2,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                if(this._parseListeners!==null) {
	                    this.triggerExitRuleEvent();
	                }
	                _prevctx = localctx;
	                localctx = new PropLValueContext(this, new LvalueContext(this, _parentctx, _parentState));
	                this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_lvalue);
	                this.state = 71;
	                if (!( this.precpred(this._ctx, 1))) {
	                    throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
	                }
	                this.state = 72;
	                this.match(ProperTeeParser.T__1);
	                this.state = 73;
	                this.access(); 
	            }
	            this.state = 78;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,2,this._ctx);
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
	        this.state = 82;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while((((_la) & ~0x1f) === 0 && ((1 << _la) & 2432770184) !== 0) || ((((_la - 32)) & ~0x1f) === 0 && ((1 << (_la - 32)) & 60319) !== 0)) {
	            this.state = 79;
	            this.statement();
	            this.state = 84;
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
	        this.state = 85;
	        this.match(ProperTeeParser.K_IF);
	        this.state = 86;
	        localctx.condition = this.expression(0);
	        this.state = 87;
	        this.match(ProperTeeParser.K_THEN);
	        this.state = 88;
	        localctx.thenBody = this.block();
	        this.state = 91;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===26) {
	            this.state = 89;
	            this.match(ProperTeeParser.K_ELSE);
	            this.state = 90;
	            localctx.elseBody = this.block();
	        }

	        this.state = 93;
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
	        this.state = 95;
	        this.match(ProperTeeParser.K_FUNCTION);
	        this.state = 96;
	        localctx.funcName = this.match(ProperTeeParser.ID);
	        this.state = 97;
	        this.match(ProperTeeParser.T__2);
	        this.state = 99;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===45) {
	            this.state = 98;
	            this.parameterList();
	        }

	        this.state = 101;
	        this.match(ProperTeeParser.T__3);
	        this.state = 102;
	        this.match(ProperTeeParser.K_DO);
	        this.state = 103;
	        this.block();
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



	threadDef() {
	    let localctx = new ThreadDefContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 14, ProperTeeParser.RULE_threadDef);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 106;
	        this.match(ProperTeeParser.K_THREAD);
	        this.state = 107;
	        localctx.funcName = this.match(ProperTeeParser.ID);
	        this.state = 108;
	        this.match(ProperTeeParser.T__2);
	        this.state = 110;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===45) {
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
	    this.enterRule(localctx, 16, ProperTeeParser.RULE_parameterList);
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
	    this.enterRule(localctx, 18, ProperTeeParser.RULE_parallelStmt);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 125;
	        this.match(ProperTeeParser.K_MULTI);
	        this.state = 127; 
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        do {
	            this.state = 126;
	            this.parallelTask();
	            this.state = 129; 
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        } while(_la===45);
	        this.state = 132;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===44) {
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
	    this.enterRule(localctx, 20, ProperTeeParser.RULE_monitorClause);
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



	parallelTask() {
	    let localctx = new ParallelTaskContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 22, ProperTeeParser.RULE_parallelTask);
	    try {
	        this.state = 145;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,10,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new ParallelAssignTaskContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 140;
	            this.functionCall();
	            this.state = 141;
	            this.match(ProperTeeParser.T__5);
	            this.state = 142;
	            this.match(ProperTeeParser.ID);
	            break;

	        case 2:
	            localctx = new ParallelCallTaskContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 144;
	            this.functionCall();
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
	        this.state = 180;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,14,this._ctx);
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
	            if(_la===42) {
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
	            if(_la===42) {
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
	            if(_la===42) {
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
	    this.enterRule(localctx, 26, ProperTeeParser.RULE_flowControl);
	    try {
	        this.state = 188;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 31:
	            localctx = new BreakStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 182;
	            this.match(ProperTeeParser.K_BREAK);
	            break;
	        case 32:
	            localctx = new ContinueStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 183;
	            this.match(ProperTeeParser.K_CONTINUE);
	            break;
	        case 35:
	            localctx = new ReturnStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 184;
	            this.match(ProperTeeParser.K_RETURN);
	            this.state = 186;
	            this._errHandler.sync(this);
	            var la_ = this._interp.adaptivePredict(this._input,15,this._ctx);
	            if(la_===1) {
	                this.state = 185;
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
	        this.state = 196;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 3:
	        case 13:
	        case 16:
	        case 39:
	        case 40:
	        case 41:
	        case 45:
	        case 46:
	        case 47:
	            localctx = new AtomExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;

	            this.state = 191;
	            this.atom();
	            break;
	        case 7:
	            localctx = new UnaryMinusExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 192;
	            this.match(ProperTeeParser.T__6);
	            this.state = 193;
	            this.expression(7);
	            break;
	        case 36:
	            localctx = new NotExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 194;
	            this.match(ProperTeeParser.K_NOT);
	            this.state = 195;
	            this.expression(6);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	        this._ctx.stop = this._input.LT(-1);
	        this.state = 219;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,19,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                if(this._parseListeners!==null) {
	                    this.triggerExitRuleEvent();
	                }
	                _prevctx = localctx;
	                this.state = 217;
	                this._errHandler.sync(this);
	                var la_ = this._interp.adaptivePredict(this._input,18,this._ctx);
	                switch(la_) {
	                case 1:
	                    localctx = new MultiplicativeExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 198;
	                    if (!( this.precpred(this._ctx, 5))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
	                    }
	                    this.state = 199;
	                    _la = this._input.LA(1);
	                    if(!((((_la) & ~0x1f) === 0 && ((1 << _la) & 1792) !== 0))) {
	                    this._errHandler.recoverInline(this);
	                    }
	                    else {
	                    	this._errHandler.reportMatch(this);
	                        this.consume();
	                    }
	                    this.state = 200;
	                    this.expression(6);
	                    break;

	                case 2:
	                    localctx = new AdditiveExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 201;
	                    if (!( this.precpred(this._ctx, 4))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
	                    }
	                    this.state = 202;
	                    _la = this._input.LA(1);
	                    if(!(_la===7 || _la===11)) {
	                    this._errHandler.recoverInline(this);
	                    }
	                    else {
	                    	this._errHandler.reportMatch(this);
	                        this.consume();
	                    }
	                    this.state = 203;
	                    this.expression(5);
	                    break;

	                case 3:
	                    localctx = new ComparisonExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 204;
	                    if (!( this.precpred(this._ctx, 3))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
	                    }
	                    this.state = 205;
	                    localctx.op = this.comparisonOp();
	                    this.state = 206;
	                    this.expression(4);
	                    break;

	                case 4:
	                    localctx = new AndExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 208;
	                    if (!( this.precpred(this._ctx, 2))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
	                    }
	                    this.state = 209;
	                    this.match(ProperTeeParser.K_AND);
	                    this.state = 210;
	                    this.expression(3);
	                    break;

	                case 5:
	                    localctx = new OrExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 211;
	                    if (!( this.precpred(this._ctx, 1))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
	                    }
	                    this.state = 212;
	                    this.match(ProperTeeParser.K_OR);
	                    this.state = 213;
	                    this.expression(2);
	                    break;

	                case 6:
	                    localctx = new MemberAccessExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    this.pushNewRecursionContext(localctx, _startState, ProperTeeParser.RULE_expression);
	                    this.state = 214;
	                    if (!( this.precpred(this._ctx, 8))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 8)");
	                    }
	                    this.state = 215;
	                    this.match(ProperTeeParser.T__1);
	                    this.state = 216;
	                    this.access();
	                    break;

	                } 
	            }
	            this.state = 221;
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
	    this.enterRule(localctx, 30, ProperTeeParser.RULE_access);
	    try {
	        this.state = 232;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,20,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new StaticAccessContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 222;
	            this.match(ProperTeeParser.ID);
	            break;

	        case 2:
	            localctx = new ArrayAccessContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 223;
	            this.match(ProperTeeParser.INTEGER);
	            break;

	        case 3:
	            localctx = new StringKeyAccessContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 224;
	            this.match(ProperTeeParser.STRING);
	            break;

	        case 4:
	            localctx = new VarEvalAccessContext(this, localctx);
	            this.enterOuterAlt(localctx, 4);
	            this.state = 225;
	            this.match(ProperTeeParser.T__11);
	            this.state = 226;
	            this.match(ProperTeeParser.ID);
	            break;

	        case 5:
	            localctx = new EvalAccessContext(this, localctx);
	            this.enterOuterAlt(localctx, 5);
	            this.state = 227;
	            this.match(ProperTeeParser.T__11);
	            this.state = 228;
	            this.match(ProperTeeParser.T__2);
	            this.state = 229;
	            this.expression(0);
	            this.state = 230;
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
	        this.state = 249;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,21,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new FuncAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 234;
	            this.functionCall();
	            break;

	        case 2:
	            localctx = new VarReferenceContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 235;
	            this.match(ProperTeeParser.ID);
	            break;

	        case 3:
	            localctx = new DecimalAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 236;
	            this.match(ProperTeeParser.INTEGER);
	            this.state = 237;
	            this.match(ProperTeeParser.T__1);
	            this.state = 238;
	            this.match(ProperTeeParser.INTEGER);
	            break;

	        case 4:
	            localctx = new IntegerAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 4);
	            this.state = 239;
	            this.match(ProperTeeParser.INTEGER);
	            break;

	        case 5:
	            localctx = new StringAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 5);
	            this.state = 240;
	            this.match(ProperTeeParser.STRING);
	            break;

	        case 6:
	            localctx = new BooleanAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 6);
	            this.state = 241;
	            _la = this._input.LA(1);
	            if(!(_la===39 || _la===40)) {
	            this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            break;

	        case 7:
	            localctx = new NullAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 7);
	            this.state = 242;
	            this.match(ProperTeeParser.K_NULL);
	            break;

	        case 8:
	            localctx = new ObjectAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 8);
	            this.state = 243;
	            this.objectLiteral();
	            break;

	        case 9:
	            localctx = new ArrayAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 9);
	            this.state = 244;
	            this.arrayLiteral();
	            break;

	        case 10:
	            localctx = new ParenAtomContext(this, localctx);
	            this.enterOuterAlt(localctx, 10);
	            this.state = 245;
	            this.match(ProperTeeParser.T__2);
	            this.state = 246;
	            this.expression(0);
	            this.state = 247;
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
	        this.state = 251;
	        localctx.funcName = this.match(ProperTeeParser.ID);
	        this.state = 252;
	        this.match(ProperTeeParser.T__2);
	        this.state = 261;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if((((_la) & ~0x1f) === 0 && ((1 << _la) & 73864) !== 0) || ((((_la - 36)) & ~0x1f) === 0 && ((1 << (_la - 36)) & 3641) !== 0)) {
	            this.state = 253;
	            this.expression(0);
	            this.state = 258;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===5) {
	                this.state = 254;
	                this.match(ProperTeeParser.T__4);
	                this.state = 255;
	                this.expression(0);
	                this.state = 260;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	        }

	        this.state = 263;
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
	        this.state = 265;
	        this.match(ProperTeeParser.T__12);
	        this.state = 274;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(((((_la - 45)) & ~0x1f) === 0 && ((1 << (_la - 45)) & 7) !== 0)) {
	            this.state = 266;
	            this.objectEntry();
	            this.state = 271;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===5) {
	                this.state = 267;
	                this.match(ProperTeeParser.T__4);
	                this.state = 268;
	                this.objectEntry();
	                this.state = 273;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	        }

	        this.state = 276;
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
	        this.state = 278;
	        this.objectKey();
	        this.state = 279;
	        this.match(ProperTeeParser.T__14);
	        this.state = 280;
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
	        this.state = 282;
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
	    this.enterRule(localctx, 42, ProperTeeParser.RULE_arrayLiteral);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 284;
	        this.match(ProperTeeParser.T__15);
	        this.state = 293;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if((((_la) & ~0x1f) === 0 && ((1 << _la) & 73864) !== 0) || ((((_la - 36)) & ~0x1f) === 0 && ((1 << (_la - 36)) & 3641) !== 0)) {
	            this.state = 285;
	            this.expression(0);
	            this.state = 290;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===5) {
	                this.state = 286;
	                this.match(ProperTeeParser.T__4);
	                this.state = 287;
	                this.expression(0);
	                this.state = 292;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	        }

	        this.state = 295;
	        this.match(ProperTeeParser.T__16);
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
	        this.state = 297;
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
ProperTeeParser.K_THREAD = 34;
ProperTeeParser.K_RETURN = 35;
ProperTeeParser.K_NOT = 36;
ProperTeeParser.K_AND = 37;
ProperTeeParser.K_OR = 38;
ProperTeeParser.K_TRUE = 39;
ProperTeeParser.K_FALSE = 40;
ProperTeeParser.K_NULL = 41;
ProperTeeParser.K_INFINITE = 42;
ProperTeeParser.K_MULTI = 43;
ProperTeeParser.K_MONITOR = 44;
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
ProperTeeParser.RULE_threadDef = 7;
ProperTeeParser.RULE_parameterList = 8;
ProperTeeParser.RULE_parallelStmt = 9;
ProperTeeParser.RULE_monitorClause = 10;
ProperTeeParser.RULE_parallelTask = 11;
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

class ThreadDefStmtContext extends StatementContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	threadDef() {
	    return this.getTypedRuleContext(ThreadDefContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitThreadDefStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.ThreadDefStmtContext = ThreadDefStmtContext;

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



class ThreadDefContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_threadDef;
        this.funcName = null;
    }

	K_THREAD() {
	    return this.getToken(ProperTeeParser.K_THREAD, 0);
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
	        return visitor.visitThreadDef(this);
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
    }

	K_MULTI() {
	    return this.getToken(ProperTeeParser.K_MULTI, 0);
	};

	K_END() {
	    return this.getToken(ProperTeeParser.K_END, 0);
	};

	parallelTask = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ParallelTaskContext);
	    } else {
	        return this.getTypedRuleContext(ParallelTaskContext,i);
	    }
	};

	monitorClause() {
	    return this.getTypedRuleContext(MonitorClauseContext,0);
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



class ParallelTaskContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ProperTeeParser.RULE_parallelTask;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class ParallelAssignTaskContext extends ParallelTaskContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	functionCall() {
	    return this.getTypedRuleContext(FunctionCallContext,0);
	};

	ID() {
	    return this.getToken(ProperTeeParser.ID, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitParallelAssignTask(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.ParallelAssignTaskContext = ParallelAssignTaskContext;

class ParallelCallTaskContext extends ParallelTaskContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	functionCall() {
	    return this.getTypedRuleContext(FunctionCallContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof ProperTeeVisitor ) {
	        return visitor.visitParallelCallTask(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

ProperTeeParser.ParallelCallTaskContext = ParallelCallTaskContext;

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
ProperTeeParser.ThreadDefContext = ThreadDefContext; 
ProperTeeParser.ParameterListContext = ParameterListContext; 
ProperTeeParser.ParallelStmtContext = ParallelStmtContext; 
ProperTeeParser.MonitorClauseContext = MonitorClauseContext; 
ProperTeeParser.ParallelTaskContext = ParallelTaskContext; 
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


    global.ProperTeeParser = ProperTeeParser;
})(typeof window !== 'undefined' ? window : this);


// ProperTeeVisitor.js - Browser Compatible Version
(function(global) {
    const antlr4 = global.antlr4;

// Generated from ProperTee.g4 by ANTLR 4.13.2
// jshint ignore: start
// This class defines a complete generic visitor for a parse tree produced by ProperTeeParser.

class ProperTeeVisitor extends antlr4.tree.ParseTreeVisitor {

	// Visit a parse tree produced by ProperTeeParser#root.
	visitRoot(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#AssignStmt.
	visitAssignStmt(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#IfStmt.
	visitIfStmt(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#iterStmt.
	visitIterStmt(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#FuncDefStmt.
	visitFuncDefStmt(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#ThreadDefStmt.
	visitThreadDefStmt(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#ParallelExecStmt.
	visitParallelExecStmt(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#FlowStmt.
	visitFlowStmt(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#ExprStmt.
	visitExprStmt(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#assignment.
	visitAssignment(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#VarLValue.
	visitVarLValue(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#PropLValue.
	visitPropLValue(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#block.
	visitBlock(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#ifStatement.
	visitIfStatement(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#functionDef.
	visitFunctionDef(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#threadDef.
	visitThreadDef(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#parameterList.
	visitParameterList(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#parallelStmt.
	visitParallelStmt(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#monitorClause.
	visitMonitorClause(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#ParallelAssignTask.
	visitParallelAssignTask(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#ParallelCallTask.
	visitParallelCallTask(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#ConditionLoop.
	visitConditionLoop(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#ValueLoop.
	visitValueLoop(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#KeyValueLoop.
	visitKeyValueLoop(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#BreakStmt.
	visitBreakStmt(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#ContinueStmt.
	visitContinueStmt(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#ReturnStmt.
	visitReturnStmt(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#AndExpr.
	visitAndExpr(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#MultiplicativeExpr.
	visitMultiplicativeExpr(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#AdditiveExpr.
	visitAdditiveExpr(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#ComparisonExpr.
	visitComparisonExpr(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#NotExpr.
	visitNotExpr(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#AtomExpr.
	visitAtomExpr(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#MemberAccessExpr.
	visitMemberAccessExpr(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#OrExpr.
	visitOrExpr(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#UnaryMinusExpr.
	visitUnaryMinusExpr(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#StaticAccess.
	visitStaticAccess(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#ArrayAccess.
	visitArrayAccess(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#StringKeyAccess.
	visitStringKeyAccess(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#VarEvalAccess.
	visitVarEvalAccess(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#EvalAccess.
	visitEvalAccess(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#FuncAtom.
	visitFuncAtom(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#VarReference.
	visitVarReference(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#DecimalAtom.
	visitDecimalAtom(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#IntegerAtom.
	visitIntegerAtom(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#StringAtom.
	visitStringAtom(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#BooleanAtom.
	visitBooleanAtom(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#NullAtom.
	visitNullAtom(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#ObjectAtom.
	visitObjectAtom(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#ArrayAtom.
	visitArrayAtom(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#ParenAtom.
	visitParenAtom(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#functionCall.
	visitFunctionCall(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#objectLiteral.
	visitObjectLiteral(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#objectEntry.
	visitObjectEntry(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#objectKey.
	visitObjectKey(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#arrayLiteral.
	visitArrayLiteral(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by ProperTeeParser#comparisonOp.
	visitComparisonOp(ctx) {
	  return this.visitChildren(ctx);
	}



}

    global.ProperTeeVisitor = ProperTeeVisitor;
})(typeof window !== 'undefined' ? window : this);


// ThreadContext.js - Browser Compatible Version
(function(global) {

// Thread states
const ThreadState = {
    READY: 'READY',
    RUNNING: 'RUNNING',
    SLEEPING: 'SLEEPING',
    WAITING: 'WAITING',      // Waiting for child threads (SPAWN_THREADS)
    COMPLETED: 'COMPLETED',
    ERROR: 'ERROR'
};

class ThreadContext {
    constructor(id, name, generator, globalSnapshot = null) {
        this.id = id;
        this.name = name;
        this.generator = generator;
        this.state = ThreadState.READY;

        // Scope stack - thread-private local variables
        this.scopeStack = [];

        // Global snapshot (read-only for threads, mutable for main)
        this.globalSnapshot = globalSnapshot;

        // Sleep tracking
        this.sleepUntil = null;  // timestamp when sleep ends

        // Context flags
        this.inThreadContext = false;
        this.inMonitorContext = false;
        this.inMultiContext = false;

        // Current function context
        this.currentFunctionContext = null;

        // MULTI block result vars
        this.multiResultVars = new Map();

        // Thread result (set when completed)
        this.result = null;

        // Error (set on ERROR state)
        this.error = null;

        // Parent thread id (for child threads spawned by SPAWN_THREADS)
        this.parentId = null;

        // Child thread tracking
        this.waitingForChildren = null;  // Set of child thread IDs when WAITING
    }

    // --- Scope management ---

    pushScope(scope = {}) {
        this.scopeStack.push(scope);
    }

    popScope() {
        return this.scopeStack.pop();
    }

    getCurrentScope() {
        if (this.scopeStack.length > 0) {
            return this.scopeStack[this.scopeStack.length - 1];
        }
        return null;
    }

    // Look up variable through scope chain then global snapshot
    getVariable(name) {
        // Check scope stack top-down
        for (let i = this.scopeStack.length - 1; i >= 0; i--) {
            if (name in this.scopeStack[i]) {
                return { found: true, value: this.scopeStack[i][name] };
            }
        }

        // Check global snapshot
        if (this.globalSnapshot && name in this.globalSnapshot) {
            return { found: true, value: this.globalSnapshot[name] };
        }

        return { found: false, value: undefined };
    }

    // Set variable in current scope or global snapshot
    setVariable(name, value) {
        if (this.scopeStack.length > 0) {
            this.scopeStack[this.scopeStack.length - 1][name] = value;
        } else if (this.globalSnapshot) {
            this.globalSnapshot[name] = value;
        }
    }

    // Check if we're in a local scope (inside a function)
    isInLocalScope() {
        return this.scopeStack.length > 0;
    }

    // --- State transitions ---

    markRunning() {
        this.state = ThreadState.RUNNING;
    }

    markReady() {
        this.state = ThreadState.READY;
    }

    markSleeping(until) {
        this.state = ThreadState.SLEEPING;
        this.sleepUntil = until;
    }

    markWaiting(childIds) {
        this.state = ThreadState.WAITING;
        this.waitingForChildren = new Set(childIds);
    }

    markCompleted(result) {
        this.state = ThreadState.COMPLETED;
        this.result = result;
    }

    markError(error) {
        this.state = ThreadState.ERROR;
        this.error = error;
    }

    // Check if a sleeping thread should wake up
    shouldWake(now) {
        return this.state === ThreadState.SLEEPING &&
               this.sleepUntil !== null &&
               now >= this.sleepUntil;
    }

    // Check if a waiting thread's children are all done
    childCompleted(childId) {
        if (this.waitingForChildren) {
            this.waitingForChildren.delete(childId);
            if (this.waitingForChildren.size === 0) {
                this.state = ThreadState.READY;
                this.waitingForChildren = null;
                return true;  // All children done
            }
        }
        return false;
    }
}



    global.ThreadContext = ThreadContext;
    global.ThreadState = ThreadState;
})(typeof window !== 'undefined' ? window : this);


// Scheduler.js - Browser Compatible Version
(function(global) {
    const ThreadContext = global.ThreadContext;
    const ThreadState = global.ThreadState;

class Scheduler {
    constructor(visitor) {
        this.visitor = visitor;
        this.threads = new Map();     // id -> ThreadContext
        this.nextThreadId = 0;
        this.currentThreadId = null;

        // Monitor state
        this.monitors = [];  // { interval, blockCtx, lastRun, visitorSnapshot }
    }

    // Create a new thread and register it
    createThread(name, generator, globalSnapshot = null) {
        const id = this.nextThreadId++;
        const thread = new ThreadContext(id, name, generator, globalSnapshot);
        this.threads.set(id, thread);
        return thread;
    }

    // Select next READY thread (round-robin)
    selectNextThread() {
        const ids = Array.from(this.threads.keys()).sort((a, b) => a - b);
        if (ids.length === 0) return null;

        // Find next READY thread after current
        const startIdx = this.currentThreadId !== null
            ? ids.indexOf(this.currentThreadId)
            : -1;

        for (let i = 1; i <= ids.length; i++) {
            const idx = (startIdx + i) % ids.length;
            const thread = this.threads.get(ids[idx]);
            if (thread.state === ThreadState.READY) {
                return thread;
            }
        }
        return null;
    }

    // Wake sleeping threads whose time has come
    wakeThreads(now) {
        for (const thread of this.threads.values()) {
            if (thread.shouldWake(now)) {
                thread.sleepUntil = null;
                thread.markReady();
            }
        }
    }

    // Check if any threads are still active (not COMPLETED/ERROR)
    hasActiveThreads() {
        for (const thread of this.threads.values()) {
            if (thread.state !== ThreadState.COMPLETED &&
                thread.state !== ThreadState.ERROR) {
                return true;
            }
        }
        return false;
    }

    // Get the minimum sleep time remaining across sleeping threads
    getMinSleepRemaining(now) {
        let min = Infinity;
        for (const thread of this.threads.values()) {
            if (thread.state === ThreadState.SLEEPING && thread.sleepUntil !== null) {
                const remaining = thread.sleepUntil - now;
                if (remaining < min) min = remaining;
            }
        }
        return min === Infinity ? null : Math.max(0, min);
    }

    // Process a yield value from a thread's generator
    processYield(thread, yieldValue) {
        // undefined yield = normal statement boundary
        if (yieldValue === undefined) {
            thread.markReady();
            return;
        }

        // Scheduler commands
        if (yieldValue && yieldValue.__schedulerCommand) {
            switch (yieldValue.type) {
                case 'SLEEP': {
                    const now = Date.now();
                    thread.markSleeping(now + yieldValue.duration);
                    return;
                }

                case 'SPAWN_THREADS': {
                    this.handleSpawnThreads(thread, yieldValue);
                    return;
                }

                default:
                    thread.markReady();
                    return;
            }
        }

        // Anything else, thread stays ready
        thread.markReady();
    }

    // Handle SPAWN_THREADS command from a MULTI block
    handleSpawnThreads(parentThread, command) {
        const { specs, monitorSpec, globalSnapshot, resultVarNames } = command;
        const childIds = [];

        // Create child threads
        for (let i = 0; i < specs.length; i++) {
            const spec = specs[i];
            const childThread = this.createThread(
                spec.name || `child-${parentThread.id}-${i}`,
                spec.generator,
                globalSnapshot
            );
            childThread.parentId = parentThread.id;
            childThread.inThreadContext = true;
            childThread._resultVarName = resultVarNames[i];  // Track which result var
            childThread._localScope = spec.localScope;        // The scope ref for local capture
            childIds.push(childThread.id);
        }

        // Set up monitor if present
        if (monitorSpec) {
            this.monitors.push({
                interval: monitorSpec.interval,
                blockCtx: monitorSpec.blockCtx,
                lastRun: Date.now(),
                parentThreadId: parentThread.id,
                childIds: [...childIds]
            });
        }

        // Parent waits for all children
        parentThread.markWaiting(childIds);
        parentThread._childResults = new Map();  // childId -> result
        parentThread._childIds = childIds;
        parentThread._resultVarNames = resultVarNames;
    }

    // Notify parent when a child thread completes
    notifyChildCompleted(childThread) {
        if (childThread.parentId === null) return;

        const parent = this.threads.get(childThread.parentId);
        if (!parent) return;

        // Store child result
        if (parent._childResults) {
            parent._childResults.set(childThread.id, childThread.result);
        }

        // Check if all children done
        const allDone = parent.childCompleted(childThread.id);
        if (allDone) {
            // Collect results in order and send back to parent generator
            const results = [];
            for (const cid of parent._childIds) {
                results.push({
                    result: parent._childResults.get(cid),
                    varName: this.threads.get(cid)?._resultVarName || null,
                    localScope: this.threads.get(cid)?._localScope || null
                });
            }

            // Run final monitor tick
            this.runFinalMonitor(childThread.parentId);

            // Remove monitor for this parent
            this.monitors = this.monitors.filter(m => m.parentThreadId !== childThread.parentId);

            // Resume parent with collected results
            parent._collectedResults = results;
        }
    }

    // Run monitor blocks (synchronously between scheduler steps)
    runMonitors() {
        const now = Date.now();
        for (const monitor of this.monitors) {
            if (now - monitor.lastRun >= monitor.interval) {
                monitor.lastRun = now;
                try {
                    this.executeMonitorSync(monitor);
                } catch (e) {
                    this.visitor.stderr('[MONITOR ERROR]', e.message);
                }
            }
        }
    }

    // Execute a monitor block synchronously (exhaust its generator)
    executeMonitorSync(monitor) {
        const parentThread = this.threads.get(monitor.parentThreadId);
        if (!parentThread) return;

        // Save and set monitor context on visitor
        const prevMonitor = this.visitor.activeThread?.inMonitorContext;

        // Create a temporary thread context for monitor execution
        const monitorThread = new ThreadContext(-1, 'monitor', null, parentThread.globalSnapshot || this.visitor.variables);
        monitorThread.inMonitorContext = true;

        // Set the active thread to the monitor thread
        const prevActiveThread = this.visitor.activeThread;
        this.visitor.activeThread = monitorThread;

        try {
            const gen = this.visitor.visitBlock(monitor.blockCtx);
            // Exhaust the generator synchronously
            let step = gen.next();
            while (!step.done) {
                step = gen.next();
            }
        } finally {
            this.visitor.activeThread = prevActiveThread;
            if (prevActiveThread && prevMonitor !== undefined) {
                prevActiveThread.inMonitorContext = prevMonitor;
            }
        }
    }

    // Run final monitor after all children complete
    runFinalMonitor(parentThreadId) {
        const monitor = this.monitors.find(m => m.parentThreadId === parentThreadId);
        if (monitor) {
            try {
                this.executeMonitorSync(monitor);
            } catch (e) {
                this.visitor.stderr('[MONITOR ERROR]', e.message);
            }
        }
    }

    // Main scheduler loop
    async run(mainGenerator) {
        // Create main thread
        const mainThread = this.createThread('main', mainGenerator, this.visitor.variables);

        while (this.hasActiveThreads()) {
            const now = Date.now();

            // Wake sleeping threads
            this.wakeThreads(now);

            // Run monitors
            this.runMonitors();

            // Select next thread
            const thread = this.selectNextThread();

            if (!thread) {
                // No READY threads - check if all are sleeping
                const sleepTime = this.getMinSleepRemaining(Date.now());
                if (sleepTime !== null) {
                    // Wait for shortest sleep to expire
                    await new Promise(resolve => setTimeout(resolve, Math.min(sleepTime, 50)));
                    continue;
                }

                // Check for WAITING threads (they'll be woken by child completion)
                let hasWaiting = false;
                for (const t of this.threads.values()) {
                    if (t.state === ThreadState.WAITING) {
                        hasWaiting = true;
                        break;
                    }
                }
                if (hasWaiting) {
                    // Small delay to prevent busy-waiting
                    await new Promise(resolve => setTimeout(resolve, 1));
                    continue;
                }

                // Deadlock or all done
                break;
            }

            this.currentThreadId = thread.id;
            thread.markRunning();

            // Set active thread on visitor
            this.visitor.activeThread = thread;

            try {
                // Step the generator
                let sendValue = undefined;

                // If thread was waiting and just became ready, send collected results
                if (thread._collectedResults) {
                    sendValue = thread._collectedResults;
                    thread._collectedResults = null;
                }

                const step = thread.generator.next(sendValue);

                if (step.done) {
                    thread.markCompleted(step.value);
                    this.notifyChildCompleted(thread);
                } else {
                    this.processYield(thread, step.value);
                }
            } catch (error) {
                thread.markError(error);
                this.notifyChildCompleted(thread);

                // If main thread errors, propagate
                if (thread.id === 0) {
                    throw error;
                }
            }
        }

        // Return main thread result
        const main = this.threads.get(0);
        if (main && main.state === ThreadState.ERROR) {
            throw main.error;
        }
        return main ? main.result : null;
    }
}


    global.Scheduler = Scheduler;
})(typeof window !== 'undefined' ? window : this);


// ProperTeeCustomVisitor.js - Browser Compatible Version
(function(global) {
    const ProperTeeVisitor = global.ProperTeeVisitor;

class ProperTeeCustomVisitor extends ProperTeeVisitor {
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
            'PRINT': (...args) => { this.stdout(...args); return null; },
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
                if (value === null) return 'null';
                if (typeof value === 'boolean') return value ? 'true' : 'false';
                if (typeof value === 'number') return String(value);
                if (typeof value === 'string') return value;
                if (Array.isArray(value)) return JSON.stringify(value);
                if (typeof value === 'object') return JSON.stringify(value);
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
        const value = ctx.expression() ? yield* this.visit(ctx.expression()) : null;
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

    *visitNullAtom(ctx) {
        return null;
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
            case '==': return left === right;
            case '>=': return left >= right;
            case '<=': return left <= right;
            case '!=': return left !== right;
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
                return null;
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
            localScope[params[i]] = i < args.length ? args[i] : null;
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
                    localScope[params[j]] = j < args.length ? args[j] : null;
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


    global.ProperTeeCustomVisitor = ProperTeeCustomVisitor;
})(typeof window !== 'undefined' ? window : this);
