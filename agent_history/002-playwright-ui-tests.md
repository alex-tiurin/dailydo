# Agent History: 002-playwright-ui-tests

**Feature**: Playwright UI tests for webapp  
**Date**: 2025-02-07

## Commands and steps executed

1. **Plan**
   - Filled `specs/002-playwright-ui-tests/plan.md` (Technical Context, Constitution Check, Project Structure)
   - Created `specs/002-playwright-ui-tests/research.md` (Playwright, webServer, selectors)
   - Created `specs/002-playwright-ui-tests/test-list.md` (17 detailed test cases: list, create, day-detail, not found)
   - Created `specs/002-playwright-ui-tests/quickstart.md` (how to run UI tests)

2. **Implementation**
   - Added `@playwright/test` to webapp devDependencies (`npm install -D @playwright/test --legacy-peer-deps`)
   - Created `webapp/playwright.config.ts` (baseURL, webServer for `npm run dev`, Chromium)
   - Created `webapp/e2e/list.spec.ts` (5 tests: empty state, header, navigate create, lists newest first, navigate to day)
   - Created `webapp/e2e/create.spec.ts` (6 tests: form visible, button disabled cases, create and redirect, Add Task, back)
   - Created `webapp/e2e/day-detail.spec.ts` (6 tests: name and tasks, progress, toggle done, toggle back, back to home, not found)
   - Added script `test:e2e` to `webapp/package.json`: `playwright test`
   - Installed Chromium: `npx playwright install chromium`

3. **Fixes**
   - Create test: expect "0/1" on home instead of "First task" (cards show progress, not task text)
   - Toggle tests: use section locator and getByRole('button') for task toggle (wrapper div), not checkbox
   - Not found test: use exact text "This list doesn't exist or was deleted." to avoid strict mode (2 matches)

4. **Run**
   - `BASE_URL=http://localhost:3000 npm run test:e2e` (with webapp already running): **17 passed** in ~8.6s

## Artifacts

- **Specs**: plan.md, research.md, test-list.md, quickstart.md
- **Webapp**: playwright.config.ts, e2e/list.spec.ts, e2e/create.spec.ts, e2e/day-detail.spec.ts, package.json script test:e2e

## How to run

- With app auto-started: `cd webapp && npm run test:e2e`
- With app already on 3000: `cd webapp && BASE_URL=http://localhost:3000 npm run test:e2e`
