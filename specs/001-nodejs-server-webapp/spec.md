# Feature Specification: Node.js Server Running in Parallel with Webapp

**Feature Branch**: `001-nodejs-server-webapp`  
**Created**: 2025-02-07  
**Status**: Draft  
**Input**: User description: "разработай серверную часть приложения на nodejs запусти ее паралельно с webapp."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Backend Serves Application Data (Priority: P1)

As the web application, I need a backend service that stores and returns daily activities and task lists so that users can view the list of days, create new task lists, and update task completion from the browser.

**Why this priority**: Without the server, the webapp has no persistent data; this is the foundation for all three app screens.

**Independent Test**: Start the backend and call its endpoints (or load the webapp configured to use it); create a day with tasks and mark one complete — data is returned correctly.

**Acceptance Scenarios**:

1. **Given** the backend is running, **When** the client requests the list of days, **Then** the system returns the list (newest first).
2. **Given** the backend is running, **When** the client creates a new day with name and task list, **Then** the system stores it and returns success.
3. **Given** a day exists with tasks, **When** the client marks a task as done, **Then** the system updates state and returns the updated day (tasks split into incomplete and completed).

---

### User Story 2 - Server and Webapp Run in Parallel (Priority: P2)

As a developer, I need to run the server and the web application at the same time so that I can develop and test the full flow without switching or manual coordination.

**Why this priority**: Enables normal development and verification that the webapp and server work together.

**Independent Test**: Start both server and webapp (e.g. via one command or two processes); open the app in the browser and perform the main flows — data is loaded and saved via the server.

**Acceptance Scenarios**:

1. **Given** no processes are running, **When** I start the server and the webapp, **Then** both run without conflict and the webapp can reach the server.
2. **Given** both are running, **When** I use the app (view days, create a day, toggle a task), **Then** changes are reflected after refresh or navigation.

---

### Edge Cases

- Server not running: webapp or client should handle failure gracefully (clear message or retry guidance).
- Empty state: requesting list of days with no data returns an empty list, not an error.
- Invalid or missing payloads: server responds with clear error and appropriate status so the client can show a message.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a backend service that stores daily activities and their task lists in memory (no database required for this feature).
- **FR-002**: The system MUST expose operations to list days (newest first), create a day (name + tasks), and get/update a single day (including marking tasks done).
- **FR-003**: The system MUST allow the server and the web application to run in parallel (e.g. different ports or a single dev command that starts both).
- **FR-004**: The system MUST respond to valid requests with structured success responses and to invalid requests with clear error responses.
- **FR-005**: Data MUST persist in memory for the lifetime of the server process (restart clears data; acceptable for demo).

### Key Entities

- **Day**: A named unit of work (e.g. a date or label) with a list of tasks; has an identifier for retrieval and update.
- **Task**: A single item within a day; has a label and a done/not-done state; ordering can distinguish incomplete vs completed.

## Assumptions

- Backend is implemented in Node.js and stores data in memory, per project context.
- The webapp will be configured to call the backend (e.g. base URL or proxy); configuration is in scope only so that “run in parallel” works.
- No authentication or multi-tenancy in this feature; single user / demo scope.

## Testing *(mandatory per constitution)*

Implementation follows the constitution workflow: text test cases → unit tests (run, expect red) → implementation → unit tests (green) → UI tests (e.g. via MCP/skills) → UI tests green.

- **Text test cases**: Scenarios for (1) listing days, (2) creating a day with tasks, (3) getting/updating a day and marking a task done, (4) server and webapp running together and full flow in browser.
- **Unit tests**: Server routes/handlers (list, create, get, update); in-memory store behaviour; error handling for bad input or missing resources.
- **UI tests**: At least one flow: open app with server running → create a day → mark a task done → verify state (e.g. via UI or network).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can start the server and the webapp and use the app in the browser to list days, create a day with tasks, and mark a task done, with data persisting for the session.
- **SC-002**: When the server is not running, the application handles the failure in a predictable way (no silent hang; user or developer sees an understandable indication).
- **SC-003**: Running the server and webapp in parallel completes without port or process conflicts under normal development setup.
