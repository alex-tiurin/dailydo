## Why

DailyDo has a working mobile app (Compose Multiplatform), but no web-version. Users need browser access to the same task-tracking workflow. The webapp directory already has a Next.js 16 scaffold with shadcn/ui and theme support, but zero application screens. Backend does not exist yet, so the webapp must define the API contract and implement an HTTP client that works against it (with easy mocking for tests).

**Platforms affected:** web, backend (contract only)

## What Changes

- Implement all 3 application screens in the Next.js webapp (`webapp/`):
  - **My Lists** — main screen with progress overview widget, day cards list, empty state
  - **Create New List** — centered card form with list name + tasks
  - **Progress View** — pending/completed split, checkbox toggle, inline edit
- Add light/dark theme tokens matching the Pencil design (`pencil-design.pen`, `DESIGN.md`)
- Define REST API contract for communication with the future Node.js backend
- Implement an API client layer with request/response types
- Add `data-testid` attributes to all interactive and content elements for Playwright e2e tests
- Set up Playwright e2e tests that verify correct network requests via request mocking

## Capabilities

### New Capabilities
- `webapp-screens`: All 3 UI screens (My Lists, Create New List, Progress View) with navigation, theming, and responsive layout at 1280px
- `api-contract`: REST API contract (endpoints, request/response schemas, error handling) and TypeScript HTTP client for the future backend
- `e2e-tests`: Playwright e2e test suite with network-layer mocking and request verification

### Modified Capabilities
_(none — no existing specs)_

## Impact

- **Code:** `webapp/` directory — new pages, components, API client, theme tokens, test files
- **Dependencies:** Playwright (dev), potentially additional shadcn/ui components (checkbox, input, card, etc.)
- **APIs:** Defines the contract the future `backend/` Node.js server must implement
- **Systems:** No infrastructure changes; webapp runs standalone with mocked data until backend is ready
