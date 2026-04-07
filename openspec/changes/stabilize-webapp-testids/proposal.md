## Why

Current webapp test selectors depend on runtime entity IDs (for example `day-card-{id}` and `task-checkbox-{id}`), which makes UI tests brittle and hard to reuse across fixtures and runs. We need stable, semantic selectors so Playwright Page Objects and tests can target UI elements by user-visible names instead of backend-generated IDs.

## What Changes

- Update webapp components to use stable `data-testid` values without `{id}` suffixes for day cards and task rows.
- Add semantic element identification via `aria-label` based on list/task names where disambiguation is required.
- Refactor Page Objects from ID-based APIs to name-based APIs (e.g. `dayCard(listName)`, `clickTaskCheckbox(taskName)`).
- Remove ID lookup helper methods that are no longer needed (`getTaskIdByName`).
- Apply minimal integration/e2e test updates to call new name-based Page Object methods and assert by visible names.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `webapp-screens`: interactive elements must expose stable, reusable test selectors that do not include runtime IDs and support semantic targeting through visible text or aria labels.
- `integration-tests`: integration-level Playwright tests and page-object interactions must target lists/tasks by human-readable names instead of IDs.
- `e2e-task-crud`: task CRUD scenarios must use name-based task toggling/editing selectors and APIs without intermediate task ID resolution.

## Impact

- Affected platform: web (React webapp + Playwright tests).
- Affected code: webapp UI components (`day-card`, `task-item`, `TaskRow` in Progress View), web Page Objects, integration specs, and e2e task CRUD specs.
- No backend API contract changes are required; request payloads and routes stay the same.
