## ADDED Requirements

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
