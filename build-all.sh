#!/bin/bash
# ProperTee full build script
# Builds both CLI (parser generation) and browser bundle targets

set -e

echo "ProperTee build starting..."
echo ""

# Phase 1: Generate ANTLR4 parser (shared by CLI and browser)
echo "[1/3] Generating ANTLR4 parser..."
if ! command -v antlr4 &> /dev/null; then
    echo "  ERROR: antlr4 command not found."
    echo "  Install: brew install antlr (macOS) or see README.md"
    exit 1
fi

antlr4 -Dlanguage=JavaScript -visitor -no-listener ProperTee.g4
echo "  Parser generated."

# Phase 2: Build browser bundle
echo ""
echo "[2/3] Building browser bundle..."

if [ ! -f "browser/antlr4-runtime.js" ]; then
    echo "  antlr4-runtime.js not found, running setup..."
    if [ ! -d "node_modules/antlr4" ]; then
        npm install antlr4@4.13.2
    fi
    node wrap-antlr4.js
fi

node build-browser.js
echo "  Browser bundle built."

# Phase 3: Copy to dist
echo ""
echo "[3/3] Copying to dist/..."
mkdir -p dist
cp browser/propertee-bundle.js dist/
sed 's|./browser/propertee-bundle.js|./propertee-bundle.js|g' scratch.html > dist/scratch.html
echo "  dist/ ready."

# Summary
echo ""
echo "Build complete!"
echo ""
echo "Generated files:"
echo "  - browser/propertee-bundle.js ($(wc -c < browser/propertee-bundle.js | awk '{print int($1/1024)}') KB)"
echo "  - dist/scratch.html"
echo "  - dist/propertee-bundle.js"
echo ""
echo "Usage:"
echo "  node pt.js script.pt          # CLI"
echo "  open dist/scratch.html        # Browser playground"
echo ""
