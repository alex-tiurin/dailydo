# Feature Specification: Playwright UI Tests for Webapp

**Feature Branch**: `002-playwright-ui-tests`  
**Created**: 2025-02-07  
**Status**: Draft  
**Input**: User description: "реализуй UI тесты для webapp на playwright"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - UI Tests Cover Main Flows (Priority: P1)

As a developer or QA, I need automated UI tests for the Daily Do webapp so that the main user journeys are verified in a browser without manual repetition. Tests must run reliably in local and CI environments.

**Why this priority**: Without UI tests, regressions in the three main screens (list, create, view/edit day) can go undetected until manual testing.

**Independent Test**: Run the UI test suite; all tests pass. Disable a feature in the app and re-run; at least one test fails in a meaningful way.

**Acceptance Scenarios**:

1. **Given** the webapp is running, **When** the UI test suite runs, **Then** tests for the list-of-days screen, create-day screen, and day-detail (task toggle) screen execute and pass.
2. **Given** the test suite exists, **When** a developer runs the designated test command, **Then** the suite runs in a headless or headed browser and reports pass/fail.
3. **Given** the test suite, **When** run in a clean environment (e.g. CI), **Then** tests complete without requiring manual intervention (e.g. server or webapp started by the test harness or CI config).

---

### User Story 2 - Critical Paths Are Covered (Priority: P2)

As a stakeholder, I need the UI tests to cover the critical paths that match the application’s three screens: viewing the list of days (newest first), creating a new day with name and tasks, and viewing/editing a day (marking tasks done, with incomplete and completed sections).

**Why this priority**: Ensures the tests protect the value described in the product (AGENTS.md): list, create, and progress-by-day flows.

**Independent Test**: Review test descriptions or run tests; each of the three flows is clearly covered by at least one test.

**Acceptance Scenarios**:

1. **Given** the list screen, **When** tests run, **Then** at least one test verifies that the list of days is shown (empty or with items) and that newest-first order is respected when data exists.
2. **Given** the create screen, **When** tests run, **Then** at least one test verifies creating a new day with a name and one or more tasks and that the user is redirected or sees the new day.
3. **Given** the day detail screen, **When** tests run, **Then** at least one test verifies that a task can be toggled to done and that it appears in the completed section (or is visually marked completed).

---

### Edge Cases

- Empty state: at least one test verifies the list screen with no days (e.g. empty state or empty list).
- Test isolation: tests do not depend on a specific global state left by other tests (clean state or explicit setup/teardown) so that order of execution does not cause flakiness.
- Failure clarity: when a test fails, the failure message or artifacts (e.g. screenshot, trace) make it possible to understand which step or assertion failed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project MUST include a Playwright-based UI test suite for the Daily Do webapp (three screens: list of days, create day, view/edit day with task completion).
- **FR-002**: The test suite MUST be runnable via a single, documented command (e.g. npm/pnpm script) from the project or webapp directory.
- **FR-003**: The test suite MUST cover at least: (1) list of days screen (empty and with data, newest first when applicable), (2) creating a day with name and tasks, (3) opening a day and toggling a task to done with visible separation of incomplete and completed tasks.
- **FR-004**: Tests MUST be written so that they can run in headless mode for CI and optionally in headed mode for local debugging.
- **FR-005**: Test runs MUST produce a clear pass/fail outcome; optional artifacts (screenshots, traces) for failures are acceptable and recommended for diagnosability.

### Key Entities

- **UI test**: A single automated scenario that drives the browser (navigate, click, type, assert) and verifies one or more user-visible outcomes.
- **Critical path**: A user journey (list days, create day, toggle task) that the application must support and that the UI tests must cover.

## Assumptions

- The webapp runs on a known base URL (e.g. localhost with a fixed port) during tests; the test setup or CI is responsible for starting the webapp (and optionally the server) or pointing to a deployed instance.
- Playwright is the chosen tool for UI/E2E tests as requested; browser targets (chromium, firefox, webkit) can be narrowed or extended per project needs.
- Tests may use in-memory or mock data, or the real server; the spec does not mandate one approach as long as the critical paths are covered and tests are stable.

## Testing *(mandatory per constitution)*

This feature is itself about adding UI tests. Implementation follows the constitution workflow where applicable (e.g. text test cases for the test scenarios, then implementation of tests, then green run).

- **Text test cases**: Scenarios for list screen, create screen, and day-detail screen (toggle task, incomplete/completed sections) with preconditions and expected UI outcomes.
- **Unit tests**: Not required for the test code itself unless the project mandates tests for test utilities; focus is on the UI tests as the deliverable.
- **UI tests**: The Playwright tests are the UI tests; they must run and pass as the definition of done.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can run one documented command and get a pass/fail result for the full Playwright UI test suite in under 5 minutes on a typical development machine.
- **SC-002**: The suite includes at least one test for each of the three main flows (list days, create day, view/edit day with task toggle), and each of these tests passes when the webapp behaves correctly.
- **SC-003**: When a critical UI element or flow is intentionally broken in the webapp, at least one UI test fails, demonstrating that the suite provides meaningful coverage.
- **SC-004**: Tests run in a headless environment (e.g. CI) without manual steps, assuming the webapp (and server if needed) is started by the test runner or CI configuration.
