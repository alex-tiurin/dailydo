# Tasks: Node.js Server Running in Parallel with Webapp

**Input**: Design documents from `/specs/001-nodejs-server-webapp/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: User requested server and tests to verify it. Constitution workflow: text test cases → unit tests (red) → implementation → unit tests (green) → UI/API tests green. Server unit tests (Jest) and API/integration tests (e.g. supertest) cover server work; optional UI test for full flow.

**Organization**: Tasks grouped by user story (US1: backend API + store, US2: parallel run with webapp).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story (US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Server**: `server/` at repository root; `server/src/`, `server/tests/`
- **Webapp**: `webapp/` (existing); config only in this feature

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize Node.js server project under `server/`

- [x] T001 Create directory structure under server/ per plan: server/src/routes/, server/src/store/, server/tests/unit/
- [x] T002 Initialize Node project in server/ with package.json; add dependencies express, swagger-ui-express, and dev dependency jest (and supertest for API tests)
- [x] T003 [P] Configure Jest in server/ (e.g. server/package.json "test" script and jest config or server/jest.config.js)
- [x] T004 [P] Add OpenAPI spec for Swagger: copy specs/001-nodejs-server-webapp/contracts/openapi.yaml to server/openapi.yaml or reference from server (for swagger-ui-express)

**Checkpoint**: Server skeleton and test runner ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core server app shell and Swagger UI; no day/task logic yet

- [x] T005 Create Express app entry in server/src/app.js (or server/src/index.js): create app, json parser, port from env (e.g. 3001), listen
- [x] T006 Mount Swagger UI at /api-docs in server/src/app.js using swagger-ui-express and server/openapi.yaml (or path to OpenAPI spec)
- [x] T007 Add CORS middleware in server/src/app.js if webapp will call from different origin (e.g. localhost:3000 → localhost:3001)
- [x] T008 Add npm scripts in server/package.json: "start" (node server/src/app.js or similar), "test" (jest)

**Checkpoint**: Server starts and serves Swagger at http://localhost:3001/api-docs; tests run via npm test

---

## Phase 3: User Story 1 - Backend Serves Application Data (Priority: P1) MVP

**Goal**: API for list days (newest first), create day, get day, update day (mark task done); in-memory store.

**Independent Test**: Start server, GET /days (empty array), POST /days with name and tasks, GET /days/:id, PATCH /days/:id to mark task done; responses match OpenAPI.

### Test cases and Unit tests (red) for User Story 1 *(constitution workflow step 1–2)*

- [x] T009 [US1] Document text test cases in specs/001-nodejs-server-webapp/ for list days (empty and with data), create day (valid and invalid), get day (found and 404), update day (mark task done); include preconditions and expected responses
- [x] T010 [P] [US1] Add unit tests for in-memory store in server/tests/unit/store.test.js (list, create, getById, update; newest-first; validation); run npm test in server/ and confirm new tests FAIL
- [x] T011 [P] [US1] Add API/route tests in server/tests/unit/routes.test.js (or server/tests/integration/days.test.js) for GET /days, POST /days, GET /days/:id, PATCH /days/:id using supertest; run and confirm FAIL

### Implementation for User Story 1 *(step 3: server code)*

- [x] T012 [US1] Implement in-memory store in server/src/store/dayStore.js (or memoryStore.js): list days newest-first, create day (generate id, createdAt), getById, update day; Day and Task shape per data-model.md
- [x] T013 [US1] Implement route handlers in server/src/routes/days.js: GET /days, POST /days (validate name, tasks), GET /days/:id (404 if missing), PATCH /days/:id (validate body, 404 if missing); return JSON per OpenAPI schemas
- [x] T014 [US1] Mount routes in server/src/app.js at /days and /days/:dayId; add 400/404 error responses with { error: string }; ensure store is used by routes

### Unit tests (green) and API tests for User Story 1 *(steps 4–6)*

- [x] T015 [US1] Run server unit and API tests (npm test in server/); fix implementation until all pass (green)
- [x] T016 [US1] Verify Swagger UI at http://localhost:3001/api-docs and manually or via test: create day, list, get, patch task done; confirm behaviour matches spec

**Checkpoint**: User Story 1 complete; API and tests green

---

## Phase 4: User Story 2 - Server and Webapp Run in Parallel (Priority: P2)

**Goal**: Developer can run server and webapp together without port conflict; webapp uses server API.

**Independent Test**: Start server (e.g. port 3001) and webapp (e.g. 3000); open app, create day, toggle task; data persists via server.

### Test cases and implementation for User Story 2

- [x] T017 [US2] Document text test cases in specs/001-nodejs-server-webapp/ for starting server then webapp (or both), no port conflict; webapp can reach server; full flow in browser
- [x] T018 [US2] Configure webapp to use server API base URL: add env (e.g. NEXT_PUBLIC_API_URL or API_URL) and use in webapp/lib or API client (e.g. webapp/lib/daily-store.ts or new server client) to call http://localhost:3001
- [x] T019 [US2] Add optional single command to run both: e.g. root package.json script using concurrently "cd server && npm start" "cd webapp && npm run dev", or document two terminals in quickstart.md
- [x] T020 [US2] Run quickstart: start server and webapp, open webapp in browser, create a day, add tasks, mark one done; confirm data loads and saves via server (independent test for US2)

**Checkpoint**: User Stories 1 and 2 complete; server and webapp run in parallel and work together

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Full test run, docs, agent history

- [x] T021 Run full test suite (server: npm test in server/); fix any failures; ensure all tests green before commit (per constitution)
- [x] T022 Create aggregating file in agent_history/ summarizing commands and steps executed for this feature (e.g. agent_history/001-nodejs-server-webapp.md)
- [x] T023 Validate quickstart.md: follow steps to start server and webapp, open Swagger URL, run one full flow; update quickstart if needed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS user stories
- **Phase 3 (US1)**: Depends on Phase 2 — API and store implementation + tests
- **Phase 4 (US2)**: Depends on Phase 3 — webapp config and parallel run
- **Phase 5 (Polish)**: Depends on Phase 4

### User Story Dependencies

- **US1 (P1)**: After Foundational; no dependency on US2
- **US2 (P2)**: After US1 (webapp config and run depend on server existing)

### Within User Story 1 *(constitution workflow)*

- Text test cases (T009) → unit/API tests written and run red (T010, T011) → implementation (T012–T014) → run tests green (T015) → verify (T016)

### Parallel Opportunities

- T003 and T004 can run in parallel (Phase 1)
- T010 and T011 can run in parallel (both test files)
- T012 and T013 can be implemented in order (store then routes); routes depend on store

---

## Parallel Example: User Story 1

```bash
# After T009 (text test cases), add tests in parallel:
# Terminal 1: Add server/tests/unit/store.test.js (T010)
# Terminal 2: Add server/tests/unit/routes.test.js (T011)
# Run npm test in server/ — expect red. Then implement store (T012), routes (T013), mount (T014), run tests until green (T015).
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (test cases → red tests → store + routes + mount → green tests)
4. **STOP and VALIDATE**: Run server, hit Swagger and endpoints, confirm behaviour
5. Then add Phase 4 (parallel run + webapp config) and Phase 5 (polish)

### Incremental Delivery

1. Setup + Foundational → server starts and Swagger works
2. US1 → API and tests green (MVP: backend done)
3. US2 → parallel run and webapp integration
4. Polish → full suite green, agent_history, quickstart validated

---

## Notes

- All task IDs (T001–T023) are sequential; [P] only where tasks are parallelizable
- [US1]/[US2] only on user-story phases
- File paths: server/ at repo root; exact paths given in each task
- Tests: unit (store, handlers) + API (supertest) satisfy "тесты для проверки его работы"; optional UI test can be added in Phase 5 if needed
