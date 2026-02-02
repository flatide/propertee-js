// ANTLR4 생성 파일들을 브라우저용으로 변환하는 스크립트
// Node.js로 실행: node build-browser.js

const fs = require('fs');
const path = require('path');

function convertToGlobal(filePath, globalName, dependencies = {}, extraExports = []) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // import 문 제거
    content = content.replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '');

    // export default 제거
    content = content.replace(/export\s+default\s+class\s+/g, 'class ');
    content = content.replace(/export\s+default\s+/g, '');

    // named exports 제거: export { Foo, Bar };
    content = content.replace(/export\s*\{[^}]*\}\s*;?\s*/g, '');

    // 의존성 주입 코드 생성
    const depInjections = Object.entries(dependencies)
        .map(([name, globalRef]) => `    const ${name} = global.${globalRef};`)
        .join('\n');

    // 추가 글로벌 export 코드 생성
    const extraExportLines = extraExports
        .map(name => `    global.${name} = ${name};`)
        .join('\n');

    // 클래스나 함수를 전역 변수로 할당
    const wrapper = `
// ${path.basename(filePath)} - Browser Compatible Version
(function(global) {
${depInjections ? depInjections + '\n' : ''}
${content}

    global.${globalName} = ${globalName};
${extraExportLines ? extraExportLines + '\n' : ''}})(typeof window !== 'undefined' ? window : this);
`;

    return wrapper;
}

// antlr4 런타임 (browser/antlr4-runtime.js 사용)
let antlr4Content;
try {
    antlr4Content = fs.readFileSync('browser/antlr4-runtime.js', 'utf-8');
    console.log('✓ antlr4-runtime.js loaded');
} catch (e) {
    console.error('❌ browser/antlr4-runtime.js not found.');
    console.error('   Run "node wrap-antlr4.js" first.');
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

// browser directory
if (!fs.existsSync('browser')) {
    fs.mkdirSync('browser');
}

// Save individual files
fs.writeFileSync('browser/antlr4-bundle.js', antlr4Content);
fs.writeFileSync('browser/ProperTeeLexer.browser.js', lexerContent);
fs.writeFileSync('browser/ProperTeeParser.browser.js', parserContent);
fs.writeFileSync('browser/ProperTeeVisitor.browser.js', visitorContent);
fs.writeFileSync('browser/ThreadContext.browser.js', threadContextContent);
fs.writeFileSync('browser/Scheduler.browser.js', schedulerContent);
fs.writeFileSync('browser/ProperTeeCustomVisitor.browser.js', customVisitorContent);

// Bundle
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
fs.writeFileSync('browser/propertee-bundle.js', bundle);

console.log('✅ Browser build complete!');
console.log('   - browser/propertee-bundle.js (combined bundle)');
console.log('   - browser/*.browser.js (individual files)');
