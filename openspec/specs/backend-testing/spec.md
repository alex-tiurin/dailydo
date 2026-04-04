## ADDED Requirements

### Requirement: API integration tests
The backend SHALL include API integration tests that test all endpoints through HTTP using Fastify's inject mechanism.

#### Scenario: Test GET /api/lists
- **WHEN** the API test suite runs
- **THEN** it SHALL verify that `GET /api/lists` returns 200 with a TaskList array

#### Scenario: Test POST /api/lists
- **WHEN** the API test suite runs
- **THEN** it SHALL verify that `POST /api/lists` creates a list and returns 201 with the created TaskList

#### Scenario: Test GET /api/lists/:id
- **WHEN** the API test suite runs
- **THEN** it SHALL verify that `GET /api/lists/:id` returns 200 for existing lists and 404 for missing ones

#### Scenario: Test PUT /api/lists/:id
- **WHEN** the API test suite runs
- **THEN** it SHALL verify that `PUT /api/lists/:id` updates the list name and returns 200

#### Scenario: Test DELETE /api/lists/:id
- **WHEN** the API test suite runs
- **THEN** it SHALL verify that `DELETE /api/lists/:id` returns 204 and removes the list

#### Scenario: Test PATCH /api/lists/:id/tasks/:taskId
- **WHEN** the API test suite runs
- **THEN** it SHALL verify that `PATCH` updates task fields and returns 200, or 404 for missing tasks

### Requirement: Unit tests for service layer
The backend SHALL include unit tests for the service layer with mocked repository dependencies.

#### Scenario: Service getAllLists unit test
- **WHEN** the unit test calls `listService.getAllLists()`
- **THEN** it SHALL verify that the service calls `listRepository.findAll()` and returns the result

#### Scenario: Service createList unit test
- **WHEN** the unit test calls `listService.createList(data)`
- **THEN** it SHALL verify that the service calls repository methods to create the list and its tasks

### Requirement: Test database isolation
API tests SHALL use a clean database state for each test to avoid test interdependencies.

#### Scenario: Database cleanup between tests
- **WHEN** each API test starts
- **THEN** the test setup SHALL truncate all tables to ensure a clean state

### Requirement: Test scripts in package.json
The backend `package.json` SHALL include scripts for running tests.

#### Scenario: Run all tests
- **WHEN** `npm test` is executed in the `backend/` directory
- **THEN** Jest SHALL run all tests (API and unit)

#### Scenario: Run tests in watch mode
- **WHEN** `npm run test:watch` is executed
- **THEN** Jest SHALL run in watch mode for development
