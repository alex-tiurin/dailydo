## ADDED Requirements

### Requirement: E2E tests use Playwright with network mocking
All e2e tests SHALL use Playwright and intercept network requests via `page.route()` to provide mock data. No real backend SHALL be required to run tests.

#### Scenario: Mock API responses
- **WHEN** an e2e test runs
- **THEN** it SHALL mock all `/api/*` routes with predefined JSON responses before navigating to the page

### Requirement: Test My Lists screen data loading
E2E tests SHALL verify that the My Lists screen correctly fetches and displays lists.

#### Scenario: Lists are fetched on page load
- **WHEN** the test navigates to `/`
- **THEN** a `GET /api/lists` request SHALL be intercepted and the mocked lists SHALL appear as day cards

#### Scenario: Empty state shown when no lists
- **WHEN** the test mocks `GET /api/lists` to return `[]`
- **THEN** the empty state with "No data yet" text and "+ Create First List" button SHALL be visible

### Requirement: Test Create New List sends correct request
E2E tests SHALL verify that the Create New List form sends the correct POST request.

#### Scenario: Create list request
- **WHEN** the test fills in list name "Test List", adds a task "Task 1", and clicks "Save List"
- **THEN** a `POST /api/lists` request SHALL be sent with body `{ "name": "Test List", "tasks": [{ "name": "Task 1" }] }`

### Requirement: Test Progress View task toggle sends correct request
E2E tests SHALL verify that toggling a task checkbox sends the correct PATCH request.

#### Scenario: Toggle task sends PATCH
- **WHEN** the test navigates to `/list?id=<listId>` with mocked tasks and clicks a pending task's checkbox
- **THEN** a `PATCH /api/lists/:id/tasks/:taskId` request SHALL be sent with body `{ "done": true }`

### Requirement: Test navigation between screens
E2E tests SHALL verify correct navigation flows between screens.

#### Scenario: Navigate to create list
- **WHEN** the test clicks "+ New List" button on My Lists
- **THEN** the browser SHALL navigate to `/create`

#### Scenario: Navigate to progress view
- **WHEN** the test clicks on a day card
- **THEN** the browser SHALL navigate to `/list?id=<listId>`

#### Scenario: Navigate back from progress view
- **WHEN** the test clicks "Back" button on Progress View
- **THEN** the browser SHALL navigate to `/`
