# How to think when writing or refactoring a Playwright test

This is the algorithm to follow before touching any test code. Walk through it top-to-bottom; do not skip steps.

## 1. Identify pages

One `test.describe` group usually maps to one screen. List the screens involved in the scenario. For each screen, decide:

- Is there already a Page Object in `webapp/tests/page-objects/`? → reuse and extend.
- If not → create a new file `XxxPage.ts`. Name follows the screen name in the design / URL.

## 2. Extract locators into class fields

Every `page.getByTestId(...)`, `page.locator(...)`, `page.getByText(...)` you would write in a test must instead live as a `readonly` property on the Page Object. Initialize in the constructor. Use `data-testid` attributes whenever they exist (see the components in `webapp/src/`); fall back to text only for dynamic content (e2e-mode). For locators that depend on a parameter (id, name, index), expose them as a method that returns a `Locator`:

```ts
dayCard(listId: string): Locator { return this.page.getByTestId(`day-card-${listId}`) }
```

## 3. Group actions into Steps

A Step is one user-meaningful action. Rule of thumb: if you can describe it in a single sentence ("I click the create button", "I fill the list name"), it is one Step.

Step name = verb in imperative present + object: `clickNewListButton`, `fillListName`, `addTask`, `submitList`, `toggleTask`, `openList`.

## 4. Pick the verification

This is the most important step and also the easiest to get wrong. The rule:

> The verification confirms the **immediate visible result** of the user's action — what the user would see proving the action worked.

Examples of valid verifications:
- click that navigates → `await expect(this.page).toHaveURL('/create')`
- click that opens a panel → `await expect(this.panel).toBeVisible()`
- fill input → `await expect(this.input).toHaveValue(name)`
- click "add task" → input count incremented (`toHaveCount(prev + 1)`)
- click "delete" → row gone (`toHaveCount(prev - 1)` or `not.toBeVisible()`)

Forbidden:
- `page.waitForTimeout(ms)` — never. Use `toBeVisible`/`toHaveURL` instead.
- "I'll verify in the test, not in the Step" — no. The Step owns its own verification.

**Negative verifications are valid.** A Step that asserts "nothing happened" (the user clicked, but submission was rejected) is a legitimate Step. Example from `webapp/tests/page-objects/CreateListPage.ts`:

```ts
async clickSaveExpectingNoSubmit(): Promise<void> {
  await this.saveListButton.click()
  await expect(this.page).toHaveURL('/create')   // still on Create page → no submit happened
}
```

The naming makes the intent explicit: `*ExpectingNoSubmit`, `*ExpectingValidationError`, etc.

## 5. Action+verify Step vs separate verify Step

Two kinds of methods:

| Kind | When to use |
|------|-------------|
| `clickX()`, `fillY()` — action + immediate verify | for every interaction in the flow |
| `verifyX()`, `verifyY()` — assertion only, no interaction | for the **final** assertion of the test, or for state checks between actions |

Don't double-up: if the action's own verify already confirms what the test cares about, you don't need a separate `verifyX()` after it.

## 6. When a compound Step is justified

A compound Step combines multiple atomic Steps (e.g., `createListWithTasks(name, tasks[])`). Add one only when:

- The same sequence appears in **≥3 tests**, AND
- The atomic Steps stay available — the compound is a convenience, not a replacement.

If you find yourself writing a compound Step for a sequence used twice, stop. Inline it.

## 7. Integration vs e2e: when to use `test.step`

Two test styles exist in this project. They differ in mocking and in narrative structure.

| | Integration (`tests/integration/`) | E2e (`tests/e2e/`) |
|---|---|---|
| Backend | mocked via `helpers/mock-api.ts` | real running app |
| Length | 2–5 Step calls | 5–15 Step calls across phases |
| `test.step` wrapper | **No.** Test body is a flat sequence. | **Yes.** Wrap each logical phase. |

Example of e2e structure (from `webapp/tests/e2e/list-crud.spec.ts:21-37`):

```ts
await test.step('open My Lists page', async () => { await myLists.open() })
await test.step('navigate to Create New List', async () => { await myLists.clickNewListButton() })
await test.step('fill list name and a task, then save', async () => {
  await createList.fillListName(listName)
  await createList.fillTask(0, 'Sample task')
  await createList.submitList()
})
await test.step('verify new day card is visible', async () => {
  await myLists.verifyDayCardWithNameVisible(listName)
})
```

`test.step` is **only** a narrative wrapper for the Playwright HTML report. It does **not** replace the verification inside Step methods. Never put a raw `page.click(...)` inside a `test.step` and call it done.

## 8. When to add e2e extensions to a Page Object

E2e tests cannot rely on backend-generated IDs (the test creates a list, the server picks the id). For those cases, add a section to the Page Object:

```ts
// --- E2e extensions (no API mocking, real backend) ---
dayCardByName(name: string): Locator { ... }
async clickDayCardByName(name: string): Promise<void> { ... }
async verifyDayCardWithNameVisible(name: string): Promise<void> { ... }
```

Pattern: locate by visible text inside the testid-prefixed container. See `webapp/tests/page-objects/MyListsPage.ts:104-125` for the canonical example.

## 9. When `test.skip` is appropriate

A test for a feature that is partially implemented (UI missing, but API ready, or vice versa) should be written and `test.skip`-ped — not deleted.

Required: a header comment explaining the gap and the date of investigation.

```ts
/**
 * E2E ... CRUD Tests
 *
 * Exploratory findings (2026-04-04):
 * - Delete list: API (DELETE /api/lists/:id) is implemented, but NO UI button exists.
 *   Skipped until a delete UI trigger is added.
 */
```

(Live example: `webapp/tests/e2e/list-crud.spec.ts:1-10`.)

## 10. Red flags — stop and reconsider

If you catch yourself doing any of these, go back to step 3:

- Writing `page.click`, `page.fill`, `page.goto`, `page.getByTestId` inside a `test(...)` block.
- A Step method without a single `expect(...)`.
- A locator created inside a Step's body instead of as a class field.
- `page.waitForTimeout(...)` anywhere.
- `page.route(...)` inline in the test body — use `helpers/mock-api.ts` instead.
- Importing `Page` or `Locator` into a `.spec.ts` file (those types belong only in Page Objects).
- A `test.step` block that contains `page.*` calls instead of Step calls.
- A compound Step that has no atomic counterparts.

## Output contract reminder

When you finish, your reply must contain:
1. List of created/edited files with absolute paths.
2. Steps table: `Page Object | Step | Action | Verification`.
3. Validator output: `bash .claude/skills/playwright-page-object/scripts/validate.sh webapp/tests` — PASS or numbered violations.
