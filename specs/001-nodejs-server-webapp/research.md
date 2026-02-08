# Research: Node.js Server and Parallel Run with Webapp

**Feature**: 001-nodejs-server-webapp  
**Date**: 2025-02-07

## 1. HTTP framework (Node.js)

**Decision**: Use Express.

**Rationale**: Widest adoption, simple routing and middleware, easy to add swagger-ui-express and JSON body parsing; sufficient for in-memory demo API.

**Alternatives considered**: Fastify (faster, less middleware ecosystem for Swagger in small teams); Koa (minimal, more manual wiring). Express chosen for speed of implementation and standard Swagger integration.

## 2. Swagger / OpenAPI URL

**Decision**: Expose Swagger UI at a fixed path on the API server (e.g. `GET /api-docs` or `GET /swagger`), served by swagger-ui-express with an OpenAPI 3.0 spec (YAML or JSON).

**Rationale**: Single server process; no extra port; docs and API share same origin; Swagger URL is stable (e.g. `http://localhost:3001/api-docs`).

**Alternatives considered**: Separate docs server (rejected: extra process). Static export only (rejected: user asked for "swagger url" implying UI).

## 3. Running server and webapp in parallel

**Decision**: Two processes: (1) Node server in `server/` on one port (e.g. 3001), (2) webapp dev server (e.g. Next.js) on its existing port (e.g. 3000). Optionally document a single command (e.g. `concurrently` or npm script) that starts both.

**Rationale**: Matches "parallel" requirement; no port conflict; webapp configured to call server base URL (env or config). Optional dev script improves DX.

**Alternatives considered**: Single process with proxy (e.g. Next.js rewrites to server): possible later; not required for "run in parallel" and adds coupling. Two terminals acceptable as minimum.

## 4. In-memory store shape

**Decision**: Store days in an array or map in process memory; each day has id, name, tasks array; each task has id, label, done boolean. Newest-first for list; update in place for toggle task.

**Rationale**: Spec and constitution: no DB; process lifetime persistence. Structure aligns with spec entities (Day, Task) and API (list, create, get, update).

**Alternatives considered**: File-backed store (out of scope). External DB (out of scope).

## 5. API style and errors

**Decision**: REST over HTTP/JSON: `GET /days`, `POST /days`, `GET /days/:id`, `PATCH /days/:id` (or PUT). Validation and missing-resource cases return 4xx with JSON body `{ error: string }` (or similar).

**Rationale**: Fits webapp as client; easy to describe in OpenAPI and test with Swagger UI and automated tests.

**Alternatives considered**: GraphQL (overkill for three operations). RPC-style POST-only (REST is more conventional for CRUD and Swagger).
