## ADDED Requirements

### Requirement: DailyDoApiClient SHALL be implemented in commonMain with Ktor HttpClient
The `DailyDoApiClient` class SHALL reside in commonMain, accept an `HttpClient` via constructor, and use a configurable base URL.

#### Scenario: Client initialization
- **WHEN** DailyDoApiClient is created with an HttpClient and baseUrl "http://localhost:3001"
- **THEN** all API requests SHALL be directed to that base URL

### Requirement: Ktor HttpClient SHALL use platform-specific engines
The app SHALL configure `OkHttp` engine in androidMain and `Darwin` engine in iosMain via expect/actual pattern.

#### Scenario: Android engine
- **WHEN** the app runs on Android
- **THEN** HttpClient uses the OkHttp engine

#### Scenario: iOS engine
- **WHEN** the app runs on iOS
- **THEN** HttpClient uses the Darwin engine

### Requirement: HttpClient SHALL be configured with JSON content negotiation
The Ktor HttpClient SHALL install `ContentNegotiation` plugin with `kotlinx.serialization.json` for automatic JSON serialization/deserialization. The JSON config SHALL use `ignoreUnknownKeys = true`.

#### Scenario: JSON deserialization
- **WHEN** the server returns a JSON response
- **THEN** Ktor automatically deserializes it into the corresponding Kotlin data class

### Requirement: GET /api/lists SHALL return all task lists
`DailyDoApiClient.getLists()` SHALL send GET to `/api/lists` and return `List<TaskList>`.

#### Scenario: Fetch all lists
- **WHEN** getLists() is called
- **THEN** a GET request is sent to `{baseUrl}/api/lists` and the response is parsed as List<TaskList>

#### Scenario: Empty list response
- **WHEN** the server returns `[]`
- **THEN** getLists() returns an empty list

### Requirement: POST /api/lists SHALL create a new task list
`DailyDoApiClient.createList(request)` SHALL send POST to `/api/lists` with a `CreateListRequest` body and return the created `TaskList`.

#### Scenario: Create list
- **WHEN** createList is called with name "Morning Routine" and tasks [{"name":"Exercise"},{"name":"Breakfast"}]
- **THEN** a POST request is sent with Content-Type application/json and the response is parsed as TaskList

### Requirement: GET /api/lists/:id SHALL return a single task list
`DailyDoApiClient.getList(id)` SHALL send GET to `/api/lists/{id}` and return a `TaskList`.

#### Scenario: Fetch single list
- **WHEN** getList("abc-123") is called
- **THEN** a GET request is sent to `{baseUrl}/api/lists/abc-123` and the response is parsed as TaskList

#### Scenario: List not found
- **WHEN** the server returns 404
- **THEN** getList throws an exception

### Requirement: PATCH /api/lists/:id/tasks/:taskId SHALL update a task
`DailyDoApiClient.updateTask(listId, taskId, request)` SHALL send PATCH to `/api/lists/{listId}/tasks/{taskId}` with an `UpdateTaskRequest` body.

#### Scenario: Toggle task done
- **WHEN** updateTask is called with done=true
- **THEN** a PATCH request is sent with body `{"done":true}`

#### Scenario: Edit task name
- **WHEN** updateTask is called with name="New name"
- **THEN** a PATCH request is sent with body `{"name":"New name"}`

### Requirement: DELETE /api/lists/:id SHALL delete a task list
`DailyDoApiClient.deleteList(id)` SHALL send DELETE to `/api/lists/{id}`.

#### Scenario: Delete list
- **WHEN** deleteList("abc-123") is called
- **THEN** a DELETE request is sent to `{baseUrl}/api/lists/abc-123`

### Requirement: PUT /api/lists/:id SHALL update list metadata
`DailyDoApiClient.updateList(id, name)` SHALL send PUT to `/api/lists/{id}` with body `{"name": "..."}` and return the updated `TaskList`.

#### Scenario: Update list name
- **WHEN** updateList("abc-123", "New Name") is called
- **THEN** a PUT request is sent with body `{"name":"New Name"}` and the response is parsed as TaskList

### Requirement: Ktor MockEngine SHALL be used for unit tests
Tests in commonTest SHALL use `ktor-client-mock` MockEngine to simulate API responses without a real server.

#### Scenario: Mock successful response
- **WHEN** a test configures MockEngine to return a TaskList JSON
- **THEN** DailyDoApiClient.getLists() returns the mocked data

#### Scenario: Mock error response
- **WHEN** a test configures MockEngine to return 404
- **THEN** DailyDoApiClient.getList() throws an appropriate exception
