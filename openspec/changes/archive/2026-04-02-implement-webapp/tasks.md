## 1. Theme & Design Tokens

- [x] 1.1 Configure CSS custom properties in `globals.css` for light (`:root`) and dark (`.dark`) themes matching DESIGN.md color palette
- [x] 1.2 Update Tailwind config to reference the new CSS variables as semantic color tokens

## 2. API Client & Types

- [x] 2.1 Create `webapp/lib/api/types.ts` with TypeScript interfaces: `TaskList`, `Task`, `CreateListRequest`, `UpdateTaskRequest`
- [x] 2.2 Create `webapp/lib/api/client.ts` with fetch-based functions: `getLists()`, `createList()`, `getList()`, `updateTask()`, `deleteList()` using configurable `NEXT_PUBLIC_API_URL`
- [x] 2.3 Create mock data in `webapp/lib/api/mock-data.ts` with sample lists for development

## 3. Mock Backend (Next.js Route Handlers)

- [x] 3.1 Create `webapp/app/api/lists/route.ts` — GET (all lists) and POST (create list) handlers with in-memory store
- [x] 3.2 Create `webapp/app/api/lists/[id]/route.ts` — GET (single list), PUT (update list), DELETE handlers
- [x] 3.3 Create `webapp/app/api/lists/[id]/tasks/[taskId]/route.ts` — PATCH handler for task updates (done toggle, name edit)

## 4. State Management

- [x] 4.1 Create `webapp/lib/lists-context.tsx` with `ListsProvider` and `useLists()` hook wrapping API client calls

## 5. shadcn/ui Components

- [x] 5.1 Add shadcn/ui components via CLI: `checkbox`, `input`, `card`, `collapsible` (`npx shadcn add ...`)

## 6. Shared UI Components

- [x] 6.1 Create `navbar.tsx` — logo "DailyDo" (Primary) + circular avatar with `data-testid` attributes
- [x] 6.2 Create `task-item.tsx` — checkbox + task name + edit icon, supports pending/completed styles, `data-testid="task-checkbox-{id}"`
- [x] 6.3 Create `empty-state.tsx` — chart icon + "No data yet" text + "+ Create First List" button with `data-testid`

## 7. My Lists Screen

- [x] 7.1 Create `day-card.tsx` — date, list name, progress counter, progress bar, edit icon with `data-testid="day-card-{id}"`
- [x] 7.2 Create `progress-overview.tsx` — collapsible bar chart widget showing last N days with `data-testid`
- [x] 7.3 Implement main page `/` composing navbar, progress overview, day cards list, empty state with `data-testid="new-list-button"`

## 8. Create New List Screen

- [x] 8.1 Create `task-form.tsx` — task input row for the create form
- [x] 8.2 Implement `/create` page with centered card, list name input, tasks section, "+ Add task" link, "Save List" button, and form validation with `data-testid` attributes

## 9. Progress View Screen

- [x] 9.1 Implement `/list/[id]` page with back button, done counter, list heading, "Pending" and "Completed" sections, task toggle, and edit icon with `data-testid` attributes

## 10. Playwright E2E Tests

- [x] 10.1 Install Playwright and create config at `webapp/playwright.config.ts`
- [x] 10.2 Create test helper for API route mocking (`webapp/e2e/helpers/mock-api.ts`)
- [x] 10.3 Write e2e test: My Lists — verifies GET /api/lists request, displays day cards, empty state
- [x] 10.4 Write e2e test: Create New List — verifies POST /api/lists request body on form submit
- [x] 10.5 Write e2e test: Progress View — verifies PATCH request on task checkbox toggle
- [x] 10.6 Write e2e test: Navigation — verifies navigation between all 3 screens
