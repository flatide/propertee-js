// Convert ANTLR4-generated files and interpreter modules to browser-compatible bundle
// Run: node build-browser.js

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { basename } from 'path';

function convertToGlobal(filePath, globalName, dependencies = {}, extraExports = []) {
    let content = readFileSync(filePath, 'utf-8');

    // Remove import statements
    content = content.replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '');

    // Remove export default
    content = content.replace(/export\s+default\s+class\s+/g, 'class ');
    content = content.replace(/export\s+default\s+/g, '');

    // Remove named exports: export { Foo, Bar };
    content = content.replace(/export\s*\{[^}]*\}\s*;?\s*/g, '');

    // Generate dependency injection code
    const depInjections = Object.entries(dependencies)
        .map(([name, globalRef]) => `    const ${name} = global.${globalRef};`)
        .join('\n');

    // Generate extra global export code
    const extraExportLines = extraExports
        .map(name => `    global.${name} = ${name};`)
        .join('\n');

    // Wrap as IIFE with global assignment
    const wrapper = `
// ${basename(filePath)} - Browser Compatible Version
(function(global) {
${depInjections ? depInjections + '\n' : ''}
${content}

    global.${globalName} = ${globalName};
${extraExportLines ? extraExportLines + '\n' : ''}})(typeof window !== 'undefined' ? window : this);
`;

    return wrapper;
}

// antlr4 runtime (from browser/antlr4-runtime.js)
let antlr4Content;
try {
    antlr4Content = readFileSync('browser/antlr4-runtime.js', 'utf-8');
    console.log('antlr4-runtime.js loaded');
} catch (e) {
    console.error('browser/antlr4-runtime.js not found.');
    console.error('Run "node wrap-antlr4.js" first.');
    process.exit(1);
}

// Lexer
const lexerContent = convertToGlobal('ProperTeeLexer.js', 'ProperTeeLexer', {
    antlr4: 'antlr4'
});

// Parser
const parserContent = convertToGlobal('ProperTeeParser.js', 'ProperTeeParser', {
    antlr4: 'antlr4'
});

// Visitor
const visitorContent = convertToGlobal('ProperTeeVisitor.js', 'ProperTeeVisitor', {
    antlr4: 'antlr4'
});

// ThreadContext (exports ThreadContext and ThreadState)
const threadContextContent = convertToGlobal('ThreadContext.js', 'ThreadContext', {}, ['ThreadState']);

// Scheduler (depends on ThreadContext, ThreadState)
const schedulerContent = convertToGlobal('Scheduler.js', 'Scheduler', {
    ThreadContext: 'ThreadContext',
    ThreadState: 'ThreadState'
});

// CustomVisitor (depends on ProperTeeVisitor)
const customVisitorContent = convertToGlobal('ProperTeeCustomVisitor.js', 'ProperTeeCustomVisitor', {
    ProperTeeVisitor: 'ProperTeeVisitor'
});

// Ensure browser directory exists
if (!existsSync('browser')) {
    mkdirSync('browser');
}

// Save individual files
writeFileSync('browser/antlr4-bundle.js', antlr4Content);
writeFileSync('browser/ProperTeeLexer.browser.js', lexerContent);
writeFileSync('browser/ProperTeeParser.browser.js', parserContent);
writeFileSync('browser/ProperTeeVisitor.browser.js', visitorContent);
writeFileSync('browser/ThreadContext.browser.js', threadContextContent);
writeFileSync('browser/Scheduler.browser.js', schedulerContent);
writeFileSync('browser/ProperTeeCustomVisitor.browser.js', customVisitorContent);

// Bundle with license header
const licenseHeader = `/*!
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

`;

const bundle = `${licenseHeader}${antlr4Content}\n${lexerContent}\n${parserContent}\n${visitorContent}\n${threadContextContent}\n${schedulerContent}\n${customVisitorContent}`;
writeFileSync('browser/propertee-bundle.js', bundle);

console.log('Browser build complete!');
console.log('  - browser/propertee-bundle.js (combined bundle)');
console.log('  - browser/*.browser.js (individual files)');
