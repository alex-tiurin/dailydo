## Context

Webapp selectors currently encode runtime IDs into `data-testid` values (for example `task-checkbox-{taskId}`), and Playwright Page Objects pass these IDs through most helper methods. This tightly couples tests to fixture internals and forces tests to resolve IDs before simple user actions. The change spans UI components, Page Objects, and integration/e2e specs, so we need one consistent selector strategy that is stable across datasets and easy to read in tests.

## Goals / Non-Goals

**Goals:**
- Make test selectors deterministic and reusable by removing runtime IDs from `data-testid` attributes.
- Preserve element disambiguation by adding semantic anchors (`aria-label` and visible text) on repeated components.
- Move Playwright Page Object APIs from ID-based parameters to name-based parameters for lists and tasks.
- Keep test refactoring minimal: update call sites to pass names while preserving scenario coverage.

**Non-Goals:**
- No backend API, DTO, or route changes.
- No redesign of UI layout, visual styles, or interaction flows.
- No rewrite of Playwright architecture beyond selector and method signature migration.

## Decisions

1. **Use fixed `data-testid` values + semantic filtering**
   - Replace dynamic IDs like `day-card-${id}` with static IDs (`day-card`, `task-item`, `task-checkbox`, etc.).
   - Add `aria-label` on container/action elements that need stable unique meaning (`day-card`, `task-item`, `task-checkbox`, `task-edit`).
   - Rationale: static IDs keep selector contracts stable; text/aria filters provide deterministic matching without exposing backend IDs.
   - Alternative considered: keep dynamic IDs and add helper mapping in tests. Rejected because it preserves brittleness and extra boilerplate.

2. **Refactor Page Object contracts to name-based APIs**
   - Replace methods that accept `listId`/`taskId` with `listName`/`taskName`.
   - Implement row-scoped lookups using `.getByTestId('<row>').filter({ hasText: <name> })` and then `.getByTestId('<child>')`.
   - Remove `getTaskIdByName`, since tests can directly act by name.
   - Rationale: Page Objects model user-facing behavior; names are the stable user-facing identity.
   - Alternative considered: dual API supporting both ID and name. Rejected to avoid prolonged mixed usage and maintenance overhead.

3. **Apply narrow test updates**
   - Update integration/e2e tests only where method signatures changed.
   - Keep mock payloads and scenario structure unchanged.
   - Rationale: limits regression risk and keeps migration focused on selector stability.

## Risks / Trade-offs

- **[Duplicate names in one list]** Two tasks with identical names could make name-only selection ambiguous. → **Mitigation:** use row-level filtering (`task-item` with hasText) and keep test fixtures with unique names where scenario intent requires unambiguous targeting.
- **[Accessible name drift]** `aria-label` text can diverge from visible copy if changed independently. → **Mitigation:** compose labels directly from task/list names in component props and cover with integration assertions.
- **[Broad selector matches]** Static test IDs may match multiple elements on the page. → **Mitigation:** scope lookups through parent card/row locators before querying child controls.
