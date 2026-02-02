// CommonJS 형식의 antlr4.web.cjs를 브라우저용 IIFE로 변환
const fs = require('fs');

const cjsContent = fs.readFileSync('node_modules/antlr4/dist/antlr4.web.cjs', 'utf-8');

// CommonJS를 브라우저용 IIFE로 래핑
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

fs.writeFileSync('browser/antlr4-runtime.js', browserContent);
console.log('✅ browser/antlr4-runtime.js 생성 완료!');
console.log('   파일 크기:', (browserContent.length / 1024).toFixed(2), 'KB');
