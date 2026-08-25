#!/bin/bash
# ProperTee test runner
# Usage: ./test/run_tests.sh [test_file]
# Runs all test/*.tee files, or a single file if specified.
# Each .tee file has a matching .expected file with expected output.

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
        84_props_object)
            echo '-p {"a":40,"b":2}'
            ;;
        *)
            echo ""
            ;;
    esac
}

run_test() {
    local pt_file="$1"
    local base="${pt_file%.tee}"
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
        84_props_object)
            actual=$(node "$PROJECT_DIR/pt.js" -p '{"a":40,"b":2}' "$pt_file" 2>&1)
            ;;
        41_result_pattern)
            actual=$(node "$SCRIPT_DIR/run_test41.js" 2>&1)
            ;;
        71_async_external)
            actual=$(node "$SCRIPT_DIR/run_test71.js" 2>&1)
            ;;
        73_keyword_ignore)
            actual=$(node "$SCRIPT_DIR/run_test73.js" 2>&1)
            ;;
        74_function_ignore)
            actual=$(node "$SCRIPT_DIR/run_test74.js" 2>&1)
            ;;
        111_thread_ignored_function)
            actual=$(node "$SCRIPT_DIR/run_test111.js" 2>&1)
            ;;
        112_load_reject_dead_branch)
            actual=$(node "$SCRIPT_DIR/run_test112.js" 2>&1)
            ;;
        130_args)
            actual=$(node "$PROJECT_DIR/pt.js" "$pt_file" alpha beta 42 2>&1)
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
    for pt_file in "$SCRIPT_DIR"/*.tee; do
        [ -f "$pt_file" ] || continue
        run_test "$pt_file"
    done

    # Host-API test (spec v0.13.0): interpreter-dispatched registration names are rejected
    actual=$(node "$SCRIPT_DIR/run_guard_test.js" 2>&1)
    if [ "$actual" = "OK" ]; then
        printf "${GREEN}PASS${NC} dispatch_name_guard (host API)\\n"
        PASS=$((PASS + 1))
    else
        printf "${RED}FAIL${NC} dispatch_name_guard (host API)\\n"
        echo "$actual" | head -20 | sed "s/^/  /"
        FAIL=$((FAIL + 1))
    fi

    # Host-API tests (no .tee fixture): static validation pass (ProperTee issue #9)
    actual=$(node "$SCRIPT_DIR/run_validate_test.js" 2>&1)
    if [ "$actual" = "OK" ]; then
        printf "${GREEN}PASS${NC} validate_static (host API)\n"
        PASS=$((PASS + 1))
    else
        printf "${RED}FAIL${NC} validate_static (host API)\n"
        echo "$actual" | head -20 | sed 's/^/  /'
        FAIL=$((FAIL + 1))
    fi

    # Host-API test: checkScript (syntax + built-in typo lint) & knownFunctionNames
    actual=$(node "$SCRIPT_DIR/run_check_test.js" 2>&1)
    if [ "$actual" = "OK" ]; then
        printf "${GREEN}PASS${NC} check_script (host API)\n"
        PASS=$((PASS + 1))
    else
        printf "${RED}FAIL${NC} check_script (host API)\n"
        echo "$actual" | head -20 | sed 's/^/  /'
        FAIL=$((FAIL + 1))
    fi

    # Host-API debugger test: workers stop/step with identity; monitors remain excluded.
    actual=$(node "$SCRIPT_DIR/run_debug_worker_test.js" 2>&1)
    if [ "$actual" = "OK" ]; then
        printf "${GREEN}PASS${NC} debug_worker (host API)\n"
        PASS=$((PASS + 1))
    else
        printf "${RED}FAIL${NC} debug_worker (host API)\n"
        echo "$actual" | head -20 | sed 's/^/  /'
        FAIL=$((FAIL + 1))
    fi

    # Host-API import test: load atomicity, depth-one restriction, source identity, scope isolation.
    actual=$(node "$SCRIPT_DIR/run_import_test.js" 2>&1)
    if [ "$actual" = "OK" ]; then
        printf "${GREEN}PASS${NC} import_modules (host API)\n"
        PASS=$((PASS + 1))
    else
        printf "${RED}FAIL${NC} import_modules (host API)\n"
        echo "$actual" | head -20 | sed 's/^/  /'
        FAIL=$((FAIL + 1))
    fi
fi

echo ""
echo "Results: ${PASS} passed, ${FAIL} failed"

if [ $FAIL -gt 0 ]; then
    exit 1
fi
