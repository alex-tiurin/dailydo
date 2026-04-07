#!/usr/bin/env bash
# Validate Playwright tests against the Page Object + Step pattern enforced by
# the playwright-page-object skill.
#
# Usage:
#   bash .claude/skills/playwright-page-object/scripts/validate.sh [tests-dir]
#
# Default tests-dir: webapp/tests
#
# Checks:
#   1. No raw page.* API calls inside *.spec.ts files (excluding page-objects/ and helpers/).
#   2. Every action Step method on a Page Object contains at least one expect(...).
#   3. .spec.ts files only import { test, expect } from '@playwright/test'
#      (Page/Locator imports are forbidden — those types belong in Page Objects).
#
# Exit codes: 0 = clean, 1 = violations found.

set -uo pipefail

TESTS_DIR="${1:-webapp/tests}"

if [[ ! -d "$TESTS_DIR" ]]; then
  echo "ERROR: tests directory not found: $TESTS_DIR" >&2
  exit 2
fi

violations=()

# ---------------------------------------------------------------------------
# Check 1: raw page.* API in *.spec.ts (excluding page-objects/ and helpers/)
# ---------------------------------------------------------------------------
RAW_API_RE='page\.(click|fill|goto|getByTestId|locator|getByText|getByRole|check|uncheck|press|selectOption|hover|route|waitForTimeout|waitForSelector|waitForURL|type|focus|dblclick)\b'

while IFS= read -r -d '' file; do
  while IFS=: read -r line_no line_content; do
    [[ -z "$line_no" ]] && continue
    violations+=("$file:$line_no — raw Playwright API in test body: ${line_content// /}")
  done < <(grep -nE "$RAW_API_RE" "$file" 2>/dev/null || true)
done < <(find "$TESTS_DIR" -type f -name '*.spec.ts' \
  -not -path "*/page-objects/*" \
  -not -path "*/helpers/*" \
  -print0)

# ---------------------------------------------------------------------------
# Check 2: action Step methods on Page Objects must contain expect(
# Action verbs only — getters and *ByName helpers (return Locator) are exempt.
# Awk results go via a tempfile because awk in a pipeline runs in a subshell
# and cannot update the outer `violations` array directly.
# ---------------------------------------------------------------------------
ACTION_VERBS='(click|fill|open|submit|add|toggle|navigate|select|check|uncheck|press|type|focus|dblclick|hover|drag|drop|scroll|set|remove|delete|create|update|edit|close|cancel|confirm|reset|verify)'

tmpfile=$(mktemp)
trap 'rm -f "$tmpfile"' EXIT

while IFS= read -r -d '' file; do
  awk -v file="$file" -v verbs="$ACTION_VERBS" '
    BEGIN {
      method_re = "^[[:space:]]+async[[:space:]]+(" verbs ")[A-Za-z0-9_]*[[:space:]]*\\("
      in_method = 0
      brace_depth = 0
      method_name = ""
      method_line = 0
      has_expect = 0
    }
    {
      if (!in_method) {
        if (match($0, method_re)) {
          in_method = 1
          method_line = NR
          tmp = $0
          sub(/^[[:space:]]+async[[:space:]]+/, "", tmp)
          sub(/[[:space:]]*\(.*$/, "", tmp)
          method_name = tmp
          has_expect = 0
          n_open = gsub(/\{/, "{", $0)
          n_close = gsub(/\}/, "}", $0)
          brace_depth = n_open - n_close
          if ($0 ~ /expect\(/) has_expect = 1
          next
        }
      } else {
        n_open = gsub(/\{/, "{", $0)
        n_close = gsub(/\}/, "}", $0)
        brace_depth += n_open - n_close
        if ($0 ~ /expect\(/) has_expect = 1
        if (brace_depth <= 0) {
          if (!has_expect) {
            print file ":" method_line " — Step method " method_name "() has no expect(...) — add a verification or rename to a non-action getter"
          }
          in_method = 0
        }
      }
    }
  ' "$file" >> "$tmpfile"
done < <(find "$TESTS_DIR/page-objects" -type f -name '*.ts' -print0 2>/dev/null)

while IFS= read -r line; do
  [[ -z "$line" ]] && continue
  violations+=("$line")
done < "$tmpfile"

# ---------------------------------------------------------------------------
# Check 3: forbidden imports in *.spec.ts
# Allowed: any subset of { test, expect } from '@playwright/test', any order.
# Forbidden: importing Page, Locator, devices, defineConfig, etc.
# ---------------------------------------------------------------------------
while IFS= read -r -d '' file; do
  while IFS=: read -r line_no line_content; do
    [[ -z "$line_no" ]] && continue
    # Extract content between { ... }
    inner=$(echo "$line_content" | sed -nE "s/.*\{([^}]*)\}.*/\1/p")
    # No braces? Skip — likely a side-effect import (rare in tests).
    [[ -z "$inner" ]] && continue
    # Split by comma, trim, validate each name.
    bad=""
    IFS=',' read -ra names <<< "$inner"
    for raw in "${names[@]}"; do
      name=$(echo "$raw" | tr -d ' \t')
      [[ -z "$name" ]] && continue
      if [[ "$name" != "test" && "$name" != "expect" ]]; then
        bad+="$name,"
      fi
    done
    if [[ -n "$bad" ]]; then
      bad=${bad%,}
      violations+=("$file:$line_no — forbidden symbol(s) imported from @playwright/test: $bad (allowed only: test, expect)")
    fi
  done < <(grep -nE "from ['\"]@playwright/test['\"]" "$file" 2>/dev/null || true)
done < <(find "$TESTS_DIR" -type f -name '*.spec.ts' \
  -not -path "*/page-objects/*" \
  -not -path "*/helpers/*" \
  -print0)

# ---------------------------------------------------------------------------
# Report
# ---------------------------------------------------------------------------
if [[ ${#violations[@]} -eq 0 ]]; then
  echo "PASS — no Page Object / Step pattern violations in $TESTS_DIR"
  exit 0
fi

echo "FAIL — ${#violations[@]} violation(s) in $TESTS_DIR:"
echo ""
i=1
for v in "${violations[@]}"; do
  printf "%3d. %s\n" "$i" "$v"
  i=$((i + 1))
done
exit 1
