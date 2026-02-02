// Convert CommonJS antlr4.web.cjs to browser-compatible IIFE
// One-time setup script - run when antlr4 version changes
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

const cjsContent = readFileSync('node_modules/antlr4/dist/antlr4.web.cjs', 'utf-8');

// Wrap CommonJS as browser IIFE
const browserContent = `
// ANTLR4 JavaScript Runtime - Browser Compatible Version
// Converted from CommonJS to IIFE
(function(global) {
    var module = { exports: {} };
    var exports = module.exports;

    ${cjsContent}

    // Export to global
    global.antlr4 = module.exports;

    // Also support default export
    if (module.exports.default) {
        Object.assign(global.antlr4, module.exports.default);
    }
})(typeof window !== 'undefined' ? window : this);
`;

if (!existsSync('browser')) {
    mkdirSync('browser');
}

writeFileSync('browser/antlr4-runtime.js', browserContent);
console.log('browser/antlr4-runtime.js generated');
console.log('  File size:', (browserContent.length / 1024).toFixed(2), 'KB');
