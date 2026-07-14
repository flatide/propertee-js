// Client-side script check: syntax + built-in typo lint in one call.
//
// The user-facing question is "does this script have a problem", not "is the grammar
// valid" — so this pairs the parser with the zero-false-positive unknown-builtin lint
// (ALL-CAPS names are reserved for built-ins/host functions since spec v0.12.0, so an
// ALL-CAPS call outside the known set is a guaranteed call-time failure). Mirrors the
// judgment of TeeBox's server-side /admin/scripts/validate (TeeBox 1.13.0).
//
// Returns { ok, problems } where each problem is
//   { kind: 'syntax' | 'unknown-function', line, column, message, name?, suggestion? }
// Lines are 1-based, columns 0-based (ANTLR convention, matching runtime errors).
// When syntax problems exist the lint is skipped (it needs a clean tree) — fix the
// syntax first, then the lint pass runs on the next call.
//
// options.visitor: an existing ProperTeeCustomVisitor whose known-name set to use —
// pass the instance you registered host externals on so they are not flagged.
// Defaults to a bare visitor (the full default built-in set).
import antlr4 from 'antlr4';
import ProperTeeLexer from './ProperTeeLexer.js';
import ProperTeeParser from './ProperTeeParser.js';
import ProperTeeCustomVisitor from './ProperTeeCustomVisitor.js';

class CollectingErrorListener extends antlr4.error.ErrorListener {
    constructor(problems) {
        super();
        this.problems = problems;
    }
    syntaxError(recognizer, offendingSymbol, line, column, msg, err) {
        this.problems.push({ kind: 'syntax', line, column, message: msg });
    }
}

function checkScript(source, options = {}) {
    const problems = [];
    const listener = new CollectingErrorListener(problems);

    const chars = new antlr4.InputStream(source);
    const lexer = new ProperTeeLexer(chars);
    lexer.removeErrorListeners();
    lexer.addErrorListener(listener);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new ProperTeeParser(tokens);
    parser.removeErrorListeners();
    parser.addErrorListener(listener);
    const tree = parser.root();

    if (problems.length > 0) return { ok: false, problems };

    const visitor = options.visitor
        ?? new ProperTeeCustomVisitor({}, {}, { stdout() {}, stderr() {} }, {});
    for (const p of visitor.lintUnknownFunctions(tree)) {
        problems.push({
            kind: 'unknown-function',
            line: p.line,
            column: p.column,
            message: `unknown function '${p.name}'`
                + (p.suggestion ? ` (did you mean '${p.suggestion}'?)` : ''),
            name: p.name,
            suggestion: p.suggestion
        });
    }
    return { ok: problems.length === 0, problems };
}

export default checkScript;
