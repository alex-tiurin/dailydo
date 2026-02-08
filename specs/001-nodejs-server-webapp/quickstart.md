# Quickstart: Node.js Server and Webapp (Parallel)

**Feature**: 001-nodejs-server-webapp

## Prerequisites

- Node.js LTS (18+ or 20+)
- npm or pnpm (webapp may use pnpm; server can use npm)

## 1. Install and run the server

From repository root:

```bash
cd server
npm install
npm start
```

Server listens on a configurable port (e.g. **3001**). Default base URL: `http://localhost:3001`.

**Swagger URL**: `http://localhost:3001/api-docs`

## 2. Run the webapp (in parallel)

In a second terminal, from repository root:

```bash
cd webapp
npm install   # or pnpm install
npm run dev  # or pnpm dev
```

Webapp runs on its usual port (e.g. **3000**). To use the server API: copy `webapp/.env.local.example` to `webapp/.env.local` and set `NEXT_PUBLIC_API_URL=http://localhost:3001`. The webapp's `lib/api-client.ts` provides `getDays`, `createDay`, `getDay`, `updateDay` for server-backed data.

## 3. Verify

- **API**: Visit Swagger URL → try `GET /days` (empty array if no data), `POST /days` with `{ "name": "Today", "tasks": [{ "label": "First task" }] }`.
- **Full flow**: Open webapp in browser → create a day, add tasks, mark one done; confirm data persists for the session (server process running).

## 4. Optional: single command for both

From repo root you can use a runner that starts server and webapp together, e.g.:

- `concurrently "cd server && npm start" "cd webapp && npm run dev"`
- Or an npm script in root `package.json`: `"dev": "concurrently \"npm run dev:server\" \"npm run dev:webapp\""` (with `dev:server` and `dev:webapp` defined).

This is optional; two terminals are sufficient for "run in parallel."
