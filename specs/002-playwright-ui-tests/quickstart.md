# Quickstart: Playwright UI Tests (Daily Do Webapp)

**Feature**: 002-playwright-ui-tests

## Prerequisites

- Node.js 18+
- pnpm or npm (webapp uses pnpm by default)

## Run UI tests

From repository root:

```bash
cd webapp
pnpm install
pnpm test:e2e
```

Or with npm:

```bash
cd webapp
npm install
npm run test:e2e
```

By default, Playwright starts the webapp automatically (`next dev`) and runs tests against it. No need to start the app in a separate terminal.

## Run with UI (headed) or specific browser

```bash
cd webapp
pnpm test:e2e -- --headed
pnpm test:e2e -- --project=chromium
```

## Run against a pre-started app

If the webapp is already running (e.g. on port 3000), set `BASE_URL` so Playwright does not start a second server:

```bash
cd webapp
BASE_URL=http://localhost:3000 npm run test:e2e
```

## Swagger / server

These tests target the **webapp** only (Next.js). The Daily Do API server (if used) is not required for the E2E suite unless you explicitly test API-backed flows; the current suite uses the webapp’s default localStorage-backed behavior.

## Troubleshooting

- **Timeout**: Increase `timeout` in `playwright.config.ts` or per test if the app is slow to start.
- **Flakiness**: Ensure tests use stable selectors (roles, visible text) and that each test gets a fresh context (Playwright default).
- **Screenshots on failure**: Playwright saves artifacts to `webapp/test-results/` when a test fails (if configured).
