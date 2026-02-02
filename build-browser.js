// ANTLR4 생성 파일들을 브라우저용으로 변환하는 스크립트
// Node.js로 실행: node build-browser.js

const fs = require('fs');
const path = require('path');

function convertToGlobal(filePath, globalName, dependencies = {}) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // import 문 제거
    content = content.replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '');
    
    // export default 제거
    content = content.replace(/export\s+default\s+class\s+/g, 'class ');
    content = content.replace(/export\s+default\s+/g, '');
    
    // 의존성 주입 코드 생성
    const depInjections = Object.entries(dependencies)
        .map(([name, globalRef]) => `    const ${name} = global.${globalRef};`)
        .join('\n');
    
    // 클래스나 함수를 전역 변수로 할당
    const wrapper = `
// ${path.basename(filePath)} - Browser Compatible Version
(function(global) {
${depInjections ? depInjections + '\n' : ''}
${content}

    global.${globalName} = ${globalName};
})(typeof window !== 'undefined' ? window : this);
`;
    
    return wrapper;
}

// antlr4 런타임 (browser/antlr4-runtime.js 사용)
// wrap-antlr4.js로 먼저 생성해야 함
let antlr4Content;
try {
    antlr4Content = fs.readFileSync('browser/antlr4-runtime.js', 'utf-8');
    console.log('✓ antlr4-runtime.js 로드 완료');
} catch (e) {
    console.error('❌ browser/antlr4-runtime.js를 찾을 수 없습니다.');
    console.error('   먼저 "node wrap-antlr4.js"를 실행하세요.');
    process.exit(1);
}

// Lexer 변환 (antlr4만 의존)
const lexerContent = convertToGlobal('ProperTeeLexer.js', 'ProperTeeLexer', {
    antlr4: 'antlr4'
});

// Parser 변환 (antlr4만 의존, ProperTeeLexer는 런타임에 전역에서 가져옴)
const parserContent = convertToGlobal('ProperTeeParser.js', 'ProperTeeParser', {
    antlr4: 'antlr4'
});

// Visitor 변환 (antlr4만 의존)
const visitorContent = convertToGlobal('ProperTeeVisitor.js', 'ProperTeeVisitor', {
    antlr4: 'antlr4'
});

// CustomVisitor 변환 (ProperTeeVisitor 의존)
const customVisitorContent = convertToGlobal('ProperTeeCustomVisitor.js', 'ProperTeeCustomVisitor', {
    ProperTeeVisitor: 'ProperTeeVisitor'
});

// browser 디렉토리 생성
if (!fs.existsSync('browser')) {
    fs.mkdirSync('browser');
}

// 각 파일 저장
fs.writeFileSync('browser/antlr4-bundle.js', antlr4Content);
fs.writeFileSync('browser/ProperTeeLexer.browser.js', lexerContent);
fs.writeFileSync('browser/ProperTeeParser.browser.js', parserContent);
fs.writeFileSync('browser/ProperTeeVisitor.browser.js', visitorContent);
fs.writeFileSync('browser/ProperTeeCustomVisitor.browser.js', customVisitorContent);

// 통합 번들 파일 생성
const licenseHeader = `/*!
 * ProperTee - Simple Scripting Language
 * Copyright (c) 2026 FLATIDE LC.
 * Licensed under BSD 3-Clause License
 * 
 * This bundle includes:
 * - ANTLR4 Runtime (BSD 3-Clause License)
 *   Copyright (c) 2012-2022 The ANTLR Project
 * - ProperTee Parser, Lexer, and Visitor
 * 
 * See LICENSE and NOTICE files for full license information
 * https://github.com/flatide/ProperTee
 */

`;

const bundle = `${licenseHeader}${antlr4Content}\n${lexerContent}\n${parserContent}\n${visitorContent}\n${customVisitorContent}`;
fs.writeFileSync('browser/propertee-bundle.js', bundle);

console.log('✅ 브라우저 버전 생성 완료!');
console.log('   - browser/propertee-bundle.js (통합 파일)');
console.log('   - browser/*.browser.js (개별 파일)');
