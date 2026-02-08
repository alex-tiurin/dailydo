# Implementation Plan: Node.js Server Running in Parallel with Webapp

**Branch**: `001-nodejs-server-webapp` | **Date**: 2025-02-07 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-nodejs-server-webapp/spec.md`

## Summary

Implement the backend for Daily Do in Node.js under `server/` at project root: in-memory store for days and tasks, REST API for list/create/get/update, and Swagger UI at a dedicated URL. Server and existing webapp (`webapp/`) run in parallel (separate ports); dev workflow supports starting both for full-stack testing.

## Technical Context

**Language/Version**: Node.js (LTS 18+ or 20+), JavaScript or TypeScript in `server/`  
**Primary Dependencies**: Express (or Fastify) for HTTP; swagger-ui-express + OpenAPI 3 spec for Swagger URL; in-memory store (no DB)  
**Storage**: In-memory only (process lifetime); no database for this feature  
**Testing**: Jest for server unit tests (routes, store, validation); Playwright/MCP/skills for UI tests against webapp + server  
**Target Platform**: Local/dev and any environment where Node runs (Linux/macOS/Windows)  
**Project Type**: Web (backend in `server/`, frontend in `webapp/`)  
**Performance Goals**: Adequate for demo (handful of concurrent users); no strict SLA  
**Constraints**: Server MUST live in project-root `server/`; Swagger MUST be exposed at a documented URL (e.g. `/api-docs` or `/swagger`)  
**Scale/Scope**: Single process, in-memory; sufficient for Daily Do three-screen flows

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **React web scope**: Plan targets webapp (React in `webapp/`) and adds backend in `server/`; aligns with constitution.
- **Workflow order**: Plan follows constitution workflow: text test cases → unit tests (run, expect red) → implementation → unit tests (green) → UI tests (e.g. via MCP/skills) → UI tests green → pre-commit full run → agent_history file.
- **Tests per feature**: Plan includes unit tests (Jest for server) and UI tests (Playwright/MCP/skills for webapp+server flows).
- **Green before commit**: No deliverable that bypasses full test run before commit.
- **Agent history**: Plan includes creating an aggregating file in `agent_history/` after feature completion.

## Project Structure

### Documentation (this feature)

```text
specs/001-nodejs-server-webapp/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (OpenAPI)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
server/                  # Node.js backend (project-root/server)
├── src/
│   ├── routes/          # API route handlers (days, tasks)
│   ├── store/           # In-memory store implementation
│   └── app.js or index.js
├── tests/
│   └── unit/
├── package.json
└── openapi.yaml or served via route (Swagger spec)

webapp/                  # Existing React app (unchanged location)
├── app/
├── components/
├── lib/
└── ...
```

**Structure Decision**: Backend lives in `server/` at repo root as requested. Webapp remains in `webapp/`. No separate backend/ or api/; single `server/` directory. Swagger is served from the same server process (e.g. `GET /api-docs` or `/swagger`).

## Complexity Tracking

No violations; structure is minimal (one server app, one webapp).
