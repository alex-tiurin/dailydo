# API Contract — DailyDo

Контракт между webapp (Next.js) и backend (Node.js).  
Webapp реализует HTTP-клиент в `webapp/lib/api/client.ts`.  
Backend должен реализовать эти эндпоинты в `backend/`.

## Data Types

```typescript
interface TaskList {
  id: string
  name: string
  date: string   // ISO date "2026-03-27"
  tasks: Task[]
}

interface Task {
  id: string
  name: string
  done: boolean
}

interface CreateListRequest {
  name: string
  tasks: Array<{ name: string }>
}

interface UpdateTaskRequest {
  done?: boolean
  name?: string
}
```

## Requirements

### Requirement: GET /api/lists returns all lists
The API client SHALL send a GET request to `/api/lists` and receive an array of `TaskList` objects sorted by date descending.

#### Scenario: Fetch all lists
- **WHEN** the My Lists screen loads
- **THEN** the client SHALL send `GET /api/lists` and parse the response as `TaskList[]`

#### Scenario: Empty list response
- **WHEN** the server returns an empty array `[]`
- **THEN** the client SHALL return an empty array and the UI SHALL show the empty state

### Requirement: POST /api/lists creates a new list
The API client SHALL send a POST request to `/api/lists` with a JSON body containing `name` (string) and `tasks` (array of `{ name: string }`).

#### Scenario: Create list with tasks
- **WHEN** user submits the Create New List form with name "Morning Routine" and tasks ["Wake up early", "Meditate"]
- **THEN** the client SHALL send `POST /api/lists` with body `{ "name": "Morning Routine", "tasks": [{ "name": "Wake up early" }, { "name": "Meditate" }] }`
- **AND** the server SHALL respond with the created `TaskList` object including generated `id`, `date`, and tasks with generated `id` and `done: false`

### Requirement: GET /api/lists/:id returns a single list
The API client SHALL send a GET request to `/api/lists/:id` and receive a single `TaskList` object with all its tasks.

#### Scenario: Fetch single list
- **WHEN** the Progress View screen loads for list id "abc-123"
- **THEN** the client SHALL send `GET /api/lists/abc-123` and parse the response as `TaskList`

#### Scenario: List not found
- **WHEN** the server returns 404
- **THEN** the client SHALL throw an error and the UI SHALL navigate back to `/`

### Requirement: PATCH /api/lists/:id/tasks/:taskId updates a task
The API client SHALL send a PATCH request to update a task's `done` status or `name`.

#### Scenario: Toggle task done
- **WHEN** user toggles a task checkbox
- **THEN** the client SHALL send `PATCH /api/lists/:listId/tasks/:taskId` with body `{ "done": true }` (or `false`)

#### Scenario: Edit task name
- **WHEN** user edits a task name and confirms
- **THEN** the client SHALL send `PATCH /api/lists/:listId/tasks/:taskId` with body `{ "name": "Updated name" }`

### Requirement: DELETE /api/lists/:id deletes a list
The API client SHALL send a DELETE request to remove a list.

#### Scenario: Delete list
- **WHEN** a delete action is triggered for list "abc-123"
- **THEN** the client SHALL send `DELETE /api/lists/abc-123` and the server SHALL respond with 204

### Requirement: PUT /api/lists/:id updates list metadata
The API client SHALL send a PUT request to update a list's name.

#### Scenario: Update list name
- **WHEN** user edits and confirms the list name
- **THEN** the client SHALL send `PUT /api/lists/:id` with body `{ "name": "Updated name" }` and the server SHALL respond with the updated `TaskList`

### Requirement: TypeScript types for API entities
The API client SHALL export TypeScript interfaces for all entities.

#### Scenario: Type definitions exist
- **WHEN** the API client module is imported
- **THEN** the following types SHALL be available: `TaskList` (id, name, date, tasks), `Task` (id, name, done), `CreateListRequest` (name, tasks), `UpdateTaskRequest` (done?, name?)

### Requirement: Configurable base URL
The API client SHALL use `NEXT_PUBLIC_API_URL` environment variable as the base URL, defaulting to `/api` when not set.

#### Scenario: Default base URL
- **WHEN** `NEXT_PUBLIC_API_URL` is not set
- **THEN** requests SHALL go to `/api/lists`, `/api/lists/:id`, etc.

#### Scenario: Custom base URL
- **WHEN** `NEXT_PUBLIC_API_URL` is set to `http://localhost:3001`
- **THEN** requests SHALL go to `http://localhost:3001/lists`, etc.

### Requirement: JSON request headers
All mutating requests (POST, PUT, PATCH) SHALL include `Content-Type: application/json`.

#### Scenario: POST includes Content-Type
- **WHEN** the client sends POST /api/lists
- **THEN** the request SHALL include header `Content-Type: application/json`

#### Scenario: PATCH includes Content-Type
- **WHEN** the client sends PATCH /api/lists/:id/tasks/:taskId
- **THEN** the request SHALL include header `Content-Type: application/json`
