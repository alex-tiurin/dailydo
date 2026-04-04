## ADDED Requirements

### Requirement: Fastify server setup
The backend SHALL be a Fastify application listening on port 3001 with CORS enabled for `http://localhost:3000`.

#### Scenario: Server starts successfully
- **WHEN** the server is started with `npm start`
- **THEN** it SHALL listen on port 3001 and log a startup message

#### Scenario: CORS allows webapp origin
- **WHEN** a request arrives from `http://localhost:3000`
- **THEN** the server SHALL include appropriate CORS headers in the response

### Requirement: PostgreSQL connection via docker-compose
The backend SHALL connect to a PostgreSQL database defined in `docker-compose.yml`. The database SHALL be initialized with `lists` and `tasks` tables on first startup.

#### Scenario: Database is running via Docker
- **WHEN** `docker-compose up -d` is executed in the `backend/` directory
- **THEN** a PostgreSQL container SHALL start with the database `dailydo` accessible on port 5432

#### Scenario: Tables are auto-created
- **WHEN** the PostgreSQL container starts for the first time
- **THEN** the `lists` table (id UUID, name VARCHAR, date DATE) and `tasks` table (id UUID, list_id UUID FK, name VARCHAR, done BOOLEAN) SHALL be created automatically via init.sql

### Requirement: Layered architecture with Repository pattern
The backend SHALL follow a layered architecture: routes → service → repository. Routes handle HTTP concerns, services contain business logic, repositories execute SQL queries.

#### Scenario: Route delegates to service
- **WHEN** a request hits a route handler
- **THEN** the handler SHALL call the corresponding service method and return its result as JSON

#### Scenario: Service delegates to repository
- **WHEN** a service method is called
- **THEN** it SHALL call the corresponding repository method for data access

#### Scenario: Repository executes SQL
- **WHEN** a repository method is called
- **THEN** it SHALL execute a parameterized SQL query against the PostgreSQL pool

### Requirement: GET /api/lists returns all lists with tasks
The server SHALL handle `GET /api/lists` and return an array of TaskList objects sorted by date descending.

#### Scenario: Fetch all lists
- **WHEN** `GET /api/lists` is called
- **THEN** the server SHALL return status 200 with a JSON array of TaskList objects, each including its tasks, sorted by date descending

#### Scenario: No lists exist
- **WHEN** `GET /api/lists` is called and no lists exist
- **THEN** the server SHALL return status 200 with an empty array `[]`

### Requirement: POST /api/lists creates a new list
The server SHALL handle `POST /api/lists` with a JSON body containing `name` and `tasks` array.

#### Scenario: Create list with tasks
- **WHEN** `POST /api/lists` is called with body `{ "name": "Morning", "tasks": [{ "name": "Wake up" }] }`
- **THEN** the server SHALL return status 201 with the created TaskList including generated `id`, `date` (today), and tasks with generated `id` and `done: false`

#### Scenario: Missing required fields
- **WHEN** `POST /api/lists` is called without `name`
- **THEN** the server SHALL return status 400 with an error message

### Requirement: GET /api/lists/:id returns a single list
The server SHALL handle `GET /api/lists/:id` and return a single TaskList with all its tasks.

#### Scenario: Fetch existing list
- **WHEN** `GET /api/lists/abc-123` is called and the list exists
- **THEN** the server SHALL return status 200 with the TaskList object

#### Scenario: List not found
- **WHEN** `GET /api/lists/nonexistent` is called
- **THEN** the server SHALL return status 404 with an error message

### Requirement: PUT /api/lists/:id updates list metadata
The server SHALL handle `PUT /api/lists/:id` with a JSON body containing `name`.

#### Scenario: Update list name
- **WHEN** `PUT /api/lists/abc-123` is called with body `{ "name": "Updated" }`
- **THEN** the server SHALL return status 200 with the updated TaskList

#### Scenario: Update nonexistent list
- **WHEN** `PUT /api/lists/nonexistent` is called
- **THEN** the server SHALL return status 404

### Requirement: DELETE /api/lists/:id deletes a list
The server SHALL handle `DELETE /api/lists/:id` and remove the list and its tasks.

#### Scenario: Delete existing list
- **WHEN** `DELETE /api/lists/abc-123` is called and the list exists
- **THEN** the server SHALL return status 204 with no body and the list and its tasks SHALL be removed

#### Scenario: Delete nonexistent list
- **WHEN** `DELETE /api/lists/nonexistent` is called
- **THEN** the server SHALL return status 404

### Requirement: PATCH /api/lists/:id/tasks/:taskId updates a task
The server SHALL handle `PATCH /api/lists/:id/tasks/:taskId` with a JSON body containing optional `done` and/or `name`.

#### Scenario: Toggle task done
- **WHEN** `PATCH /api/lists/list1/tasks/task1` is called with body `{ "done": true }`
- **THEN** the server SHALL return status 200 with the updated task

#### Scenario: Edit task name
- **WHEN** `PATCH /api/lists/list1/tasks/task1` is called with body `{ "name": "New name" }`
- **THEN** the server SHALL return status 200 with the updated task

#### Scenario: Task not found
- **WHEN** `PATCH /api/lists/list1/tasks/nonexistent` is called
- **THEN** the server SHALL return status 404

### Requirement: JSON Content-Type on mutating requests
All POST, PUT, and PATCH endpoints SHALL require and validate `Content-Type: application/json`.

#### Scenario: Valid Content-Type
- **WHEN** a POST request includes `Content-Type: application/json`
- **THEN** the server SHALL process the request normally

#### Scenario: Response Content-Type
- **WHEN** any endpoint returns JSON data
- **THEN** the response SHALL include `Content-Type: application/json`
