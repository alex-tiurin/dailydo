# Implementation Plan: Playwright UI Tests for Webapp

**Branch**: `002-playwright-ui-tests` | **Date**: 2025-02-07 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-playwright-ui-tests/spec.md`

## Summary

Add a Playwright-based E2E test suite for the Daily Do webapp covering the three main screens (list of days, create day, view/edit day with task toggle). Tests live in `webapp/e2e/`, runnable via one command; webapp can be started by Playwright (webServer) or pre-started for CI. Delivered artifacts: detailed test list, Playwright config, test files, and quickstart for running tests.

## Technical Context

**Language/Version**: Node.js (same as webapp); TypeScript or JavaScript for tests  
**Primary Dependencies**: Playwright Test (@playwright/test); webapp is Next.js (existing)  
**Storage**: N/A (tests use in-browser state / localStorage via app)  
**Testing**: Playwright for E2E; no additional unit test framework for test code  
**Target Platform**: Web (Chromium default; Firefox/WebKit optional)  
**Project Type**: Web (tests colocated with webapp in `webapp/`)  
**Constraints**: Tests MUST run headless for CI; base URL configurable (e.g. env or default localhost:3000)  
**Scale/Scope**: One suite, three flows, ~10–15 test cases

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **React web scope**: Plan targets webapp (React in `webapp/`); tests exercise the same app.
- **Workflow order**: Text test cases → implementation of UI tests → UI tests green; no unit tests for test code per spec.
- **Tests per feature**: This feature delivers the UI tests; Playwright suite is the deliverable.
- **Green before commit**: Full run (server unit + webapp UI) expected before commit; UI tests part of that.
- **Agent history**: Plan includes creating an aggregating file in `agent_history/` after feature completion.

## Project Structure

### Documentation (this feature)

```text
specs/002-playwright-ui-tests/
├── plan.md           # This file
├── research.md       # Phase 0 output
├── test-list.md      # Detailed list of test cases (Phase 1)
├── quickstart.md     # How to run UI tests
└── tasks.md          # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
webapp/
├── e2e/                    # Playwright E2E tests
│   ├── list.spec.ts        # List-of-days screen
│   ├── create.spec.ts      # Create-day screen
│   └── day-detail.spec.ts  # Day detail + task toggle
├── playwright.config.ts    # Playwright config (baseURL, webServer)
├── package.json            # Add script: "test:e2e"
└── ...
```

**Structure Decision**: E2E tests live under `webapp/e2e/`; Playwright config at `webapp/playwright.config.ts`. One command from webapp: `pnpm test:e2e` or `npm run test:e2e`.

## Complexity Tracking

No violations.
