#!/bin/bash
# ProperTee 전체 빌드 스크립트

echo "🔨 ProperTee 빌드 시작..."
echo ""

# 0. antlr4로 파서 생성
echo "📝 1/4: ANTLR4 파서 생성..."
if ! command -v antlr4 &> /dev/null; then
    echo "   ⚠️  antlr4 명령을 찾을 수 없습니다."
    echo "   설치 방법: brew install antlr (macOS) 또는 README.md 참조"
    exit 1
fi

antlr4 -Dlanguage=JavaScript -visitor -no-listener ProperTee.g4
if [ $? -ne 0 ]; then
    echo "❌ ANTLR4 파서 생성 실패"
    exit 1
fi
echo "✅ 파서 생성 완료!"

# 1. antlr4 런타임 래핑
echo ""
echo "📦 2/4: ANTLR4 런타임 래핑..."
if [ ! -d "node_modules/antlr4" ]; then
    echo "   ⚠️  node_modules/antlr4가 없습니다. npm install 실행..."
    npm install antlr4@4.13.2
fi

node wrap-antlr4.js
if [ $? -ne 0 ]; then
    echo "❌ wrap-antlr4.js 실패"
    exit 1
fi

# 2. 브라우저 번들 생성
echo ""
echo "🎁 3/4: 브라우저 번들 생성..."
node build-browser.js
if [ $? -ne 0 ]; then
    echo "❌ build-browser.js 실패"
    exit 1
fi

# 3. dist 폴더에 배포 파일 복사
echo ""
echo "📦 4/5: dist 폴더에 배포 파일 복사..."
mkdir -p dist
cp browser/propertee-bundle.js dist/
# scratch.html의 번들 경로를 dist 폴더용으로 수정
sed 's|./browser/propertee-bundle.js|./propertee-bundle.js|g' scratch.html > dist/scratch.html
if [ $? -ne 0 ]; then
    echo "❌ dist 폴더 복사 실패"
    exit 1
fi
echo "✅ 배포 파일 복사 완료!"

# 4. 완료
echo ""
echo "✅ 5/5: 빌드 완료!"
echo ""
echo "📁 생성된 파일:"
echo "   - browser/antlr4-runtime.js ($(wc -c < browser/antlr4-runtime.js | awk '{print int($1/1024)}') KB)"
echo "   - browser/propertee-bundle.js ($(wc -c < browser/propertee-bundle.js | awk '{print int($1/1024)}') KB)"
echo "   - dist/scratch.html ($(wc -c < dist/scratch.html | awk '{print int($1/1024)}') KB)"
echo "   - dist/propertee-bundle.js ($(wc -c < dist/propertee-bundle.js | awk '{print int($1/1024)}') KB)"
echo ""
echo "🚀 테스트 방법:"
echo "   open test.html"
echo "   open playground.html"
echo "   open dist/scratch.html"
echo ""
