## MODIFIED Requirements

### Requirement: Test My Lists screen data loading
E2E/integration tests SHALL verify My Lists data loading and day-card rendering using stable selectors that are independent of backend IDs. Day-card assertions MUST target cards by user-visible list names.

#### Scenario: Lists are fetched on page load
- **WHEN** the test navigates to `/`
- **THEN** a `GET /api/lists` request SHALL be intercepted and mocked lists SHALL appear as day cards matched by list names

#### Scenario: Empty state shown when no lists
- **WHEN** the test mocks `GET /api/lists` to return `[]`
- **THEN** the empty state with "No data yet" text and "+ Create First List" button SHALL be visible

### Requirement: Test Progress View task toggle sends correct request
E2E/integration tests SHALL verify task toggling in Progress View using name-based task selection and stable task selectors. Tests MUST interact with task controls through task names, not task IDs.

#### Scenario: Toggle task sends PATCH
- **WHEN** the test navigates to `/list?id=<listId>` with mocked tasks and clicks a pending task checkbox selected by task name
- **THEN** a `PATCH /api/lists/:id/tasks/:taskId` request SHALL be sent with body `{ "done": true }`
