#!/bin/bash
# ProperTee test runner
# Usage: ./test/run_tests.sh [test_file]
# Runs all test/*.pt files, or a single file if specified.
# Each .pt file has a matching .expected file with expected output.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PASS=0
FAIL=0

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

# Some tests need extra CLI flags. Map test base name to flags.
get_extra_flags() {
    local test_name="$1"
    case "$test_name" in
        34_builtin_properties)
            echo '-p {"width":100,"height":200,"name":"test"}'
            ;;
        *)
            echo ""
            ;;
    esac
}

run_test() {
    local pt_file="$1"
    local base="${pt_file%.pt}"
    local expected_file="${base}.expected"
    local test_name="$(basename "$base")"

    if [ ! -f "$expected_file" ]; then
        printf "${YELLOW}SKIP${NC} %s (no .expected file)\n" "$test_name"
        return
    fi

    # Get extra flags for this test
    local extra_flags
    extra_flags=$(get_extra_flags "$test_name")

    # Run the script, capture stdout+stderr merged
    case "$test_name" in
        34_builtin_properties)
            actual=$(node "$PROJECT_DIR/pt.js" -p '{"width":100,"height":200,"name":"test"}' "$pt_file" 2>&1)
            ;;
        41_result_pattern)
            actual=$(node "$SCRIPT_DIR/run_test41.js" 2>&1)
            ;;
        *)
            actual=$(node "$PROJECT_DIR/pt.js" "$pt_file" 2>&1)
            ;;
    esac
    expected=$(cat "$expected_file")

    if [ "$actual" = "$expected" ]; then
        printf "${GREEN}PASS${NC} %s\n" "$test_name"
        PASS=$((PASS + 1))
    else
        printf "${RED}FAIL${NC} %s\n" "$test_name"
        echo "  --- expected ---"
        echo "$expected" | head -20 | sed 's/^/  /'
        echo "  --- actual ---"
        echo "$actual" | head -20 | sed 's/^/  /'
        echo ""
        FAIL=$((FAIL + 1))
    fi
}

# Determine which files to run
if [ -n "$1" ]; then
    run_test "$1"
else
    for pt_file in "$SCRIPT_DIR"/*.pt; do
        [ -f "$pt_file" ] || continue
        run_test "$pt_file"
    done
fi

echo ""
echo "Results: ${PASS} passed, ${FAIL} failed"

if [ $FAIL -gt 0 ]; then
    exit 1
fi
