## 1. Stabilize webapp test selectors

- [x] 1.1 Update `day-card` component to replace ID-based test IDs with `day-card` / `day-card-progress` and add list-name-based `aria-label` on the card container.
- [x] 1.2 Update task row rendering (`task-item` and Progress View `TaskRow`) to use static test IDs (`task-item`, `task-checkbox`, `task-name`, `task-edit`) and semantic `aria-label` values for row/toggle/edit controls.
- [x] 1.3 Verify no remaining runtime-ID interpolation is used in webapp `data-testid` values for day-card and task-row controls.

## 2. Migrate Page Objects to name-based APIs

- [x] 2.1 Refactor My Lists Page Object methods from list ID parameters to list name parameters (`dayCard`, `verifyDayCardVisible`, `verifyDayCardsOrder`, `getFirstDayCardListName`).
- [x] 2.2 Refactor Progress View Page Object task selectors/methods to operate by task name (`taskCheckbox`, `clickTaskCheckbox`, `verifyTaskVisible`, `toggleTaskToCompleted`).
- [x] 2.3 Remove obsolete ID lookup helper (`getTaskIdByName`) and update internal locator composition to row-scoped name filtering.

## 3. Update tests and validate behavior

- [x] 3.1 Update integration tests (`my-lists.spec.ts`, `progress-view.spec.ts`) to call name-based Page Object methods and assert list/task visibility by names.
- [x] 3.2 Update e2e task CRUD test to toggle tasks directly by task name without intermediate ID lookup.
- [x] 3.3 Run affected Playwright integration/e2e suites and confirm selectors, toggles, and request assertions pass with stable non-ID test selectors.
