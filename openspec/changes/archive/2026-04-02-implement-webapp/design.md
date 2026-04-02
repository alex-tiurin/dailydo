## Context

The DailyDo webapp scaffold exists at `webapp/` with Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui, and `next-themes` for dark mode. Only a placeholder page and a single Button component are present. The Pencil design (`pencil-design.pen`) and `DESIGN.md` define the complete visual spec for 3 screens in light/dark themes at 1280px. No backend exists yet.

**Existing stack in webapp:**
- Next.js 16 + Turbopack, React 19, TypeScript 5.9
- Tailwind CSS 4 + `tw-animate-css`
- shadcn/ui (base-ui variant), `lucide-react` icons
- `next-themes` ThemeProvider already wired
- Inter font configured as `--font-sans`

## Goals / Non-Goals

**Goals:**
- Implement all 3 screens pixel-close to the Pencil design
- Support light and dark themes using CSS variables matching DESIGN.md tokens
- Define a REST API contract so the future backend knows exactly what to implement
- Build an API client layer that is easy to swap from mocks to real backend
- Make every interactive element testable via `data-testid`
- Set up Playwright e2e tests verifying network requests via route mocking

**Non-Goals:**
- Implementing the actual Node.js backend (contract only)
- Mobile-responsive layout (web-only at 1280px for now)
- User authentication / user management
- Persistent storage on the frontend (no localStorage/IndexedDB)
- Animations beyond basic CSS transitions

## Decisions

### 1. Routing: Next.js App Router with client-side navigation

Three routes:
- `/` — My Lists (main screen)
- `/create` — Create New List
- `/list/[id]` — Progress View

**Why:** App Router is the default in Next.js 16 and already scaffolded. Three simple routes, no complex nesting needed.

### 2. State management: React Context + hooks (no external library)

A single `ListsContext` provides the lists data and CRUD operations. The context calls the API client internally.

**Why:** The app has a single domain entity (TaskList with Tasks). Redux/Zustand would be overkill. Context + `useReducer` is sufficient and keeps dependencies minimal.

### 3. API client: thin fetch wrapper with TypeScript types

```
webapp/lib/api/
  types.ts      — shared request/response types
  client.ts     — fetch-based HTTP client (base URL configurable)
  mock-data.ts  — seed data for development without backend
```

The client exports functions like `getLists()`, `createList(data)`, `getList(id)`, `updateTask(listId, taskId, data)`. Base URL defaults to `/api` (for Next.js API routes as a dev proxy) and can be overridden via `NEXT_PUBLIC_API_URL` env var.

**Why fetch over axios:** Zero additional dependencies. Fetch is native, sufficient for simple CRUD.

### 4. API contract: REST with JSON

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lists` | Get all lists (sorted by date desc) |
| POST | `/api/lists` | Create a new list |
| GET | `/api/lists/:id` | Get a single list with tasks |
| PUT | `/api/lists/:id` | Update list metadata |
| PATCH | `/api/lists/:id/tasks/:taskId` | Update a task (toggle done, edit name) |
| DELETE | `/api/lists/:id` | Delete a list |

**Response shapes:**

```typescript
interface TaskList {
  id: string
  name: string
  date: string          // ISO date "2026-03-27"
  tasks: Task[]
}

interface Task {
  id: string
  name: string
  done: boolean
}

// GET /api/lists → TaskList[]
// POST /api/lists → TaskList  (body: { name, tasks: [{name}] })
// PATCH /api/lists/:id/tasks/:taskId → Task  (body: { done?, name? })
```

### 5. Dev-time data: Next.js Route Handlers as mock backend

Create `webapp/app/api/lists/route.ts` (and nested routes) that serve in-memory data. This lets the webapp run standalone during development.

**Why:** Keeps the dev experience simple (`npm run dev` just works), and the same fetch client works with both mock and real backend.

### 6. Theme tokens: CSS custom properties via Tailwind

Map DESIGN.md colors to CSS variables in `globals.css` under `:root` (light) and `.dark` (dark). Reference them in Tailwind config as semantic tokens (`--color-primary`, `--color-background`, etc.).

**Why:** `next-themes` already toggles `.dark` class. CSS variables are the standard shadcn/ui pattern already in the project.

### 7. Component structure

```
webapp/components/
  navbar.tsx              — top nav (logo + avatar)
  progress-overview.tsx   — collapsible bar chart widget
  day-card.tsx            — list card for My Lists
  empty-state.tsx         — "No data yet" state
  task-item.tsx           — single task row with checkbox + edit
  task-form.tsx           — task input row in create form
```

All are client components (`"use client"`) since they require interactivity.

### 8. Testing: Playwright with network mocking

- Playwright intercepts fetch calls via `page.route()` and returns mock JSON
- Tests assert that the correct HTTP method/URL/body was sent
- No real server needed during test runs
- `data-testid` attributes on all interactive elements

## Risks / Trade-offs

- **[In-memory mock backend resets on every HMR]** → Acceptable for development; real backend will persist data
- **[No optimistic updates]** → Simpler implementation; UI waits for server response before updating. Can add later if UX feels slow
- **[1280px fixed width, no mobile responsive]** → Per requirements. Mobile users use the native app. Can add responsive breakpoints later
- **[Context re-renders whole tree on state change]** → Acceptable for <100 items. If performance matters later, can memoize or switch to Zustand
