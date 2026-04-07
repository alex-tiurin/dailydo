# Raw → Page Object: two worked examples

Two refactorings from real code in this repo. Use them as templates when converting any test that mixes raw Playwright calls with (or without) partial Page Object usage.

---

## Example 1 — Integration test with inline `page.route`

Source: `webapp/tests/integration/my-lists.spec.ts:6-28`. The test already uses `MyListsPage` for navigation and assertions, but inlines `page.route(...)` for mocking. The mock body is a duplicate of `mockApiLists` from `helpers/mock-api.ts`.

### Before

```ts
test('sends GET /api/lists on page load and displays day cards', async ({ page }) => {
  let requestMade = false
  await page.route('**/api/lists', async (route) => {
    if (route.request().method() === 'GET') {
      requestMade = true
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(DEFAULT_MOCK_LISTS),
      })
    } else {
      await route.continue()
    }
  })

  const myLists = new MyListsPage(page)
  await myLists.open()
  await myLists.verifyDayCardVisible('mock-list-1')

  expect(requestMade).toBe(true)
  await myLists.verifyDayCardVisible('mock-list-2')
})
```

### Problems

1. **Inline `page.route`** duplicates `mockApiLists` from `helpers/mock-api.ts:42-55`.
2. The test also tracks **whether the request was made** (`requestMade` flag). That's a custom assertion the existing `mockApiLists` doesn't expose. Use `captureRequestDetails` from the same helper file — it returns a Promise that resolves only when the matching request fires, which is itself proof the request was made.
3. Mixing infra (mock setup) and user actions in the same scope obscures the user story.

### After

```ts
import { test, expect } from '@playwright/test'
import { captureRequestDetails, DEFAULT_MOCK_LISTS } from './helpers/mock-api'
import { MyListsPage } from '../page-objects/MyListsPage'

test('sends GET /api/lists on page load and displays day cards', async ({ page }) => {
  const requestPromise = captureRequestDetails(
    page,
    '**/api/lists',
    'GET',
    { status: 200, body: DEFAULT_MOCK_LISTS },
  )

  const myLists = new MyListsPage(page)
  await myLists.open()
  await myLists.verifyDayCardVisible('mock-list-1')
  await myLists.verifyDayCardVisible('mock-list-2')

  const captured = await requestPromise
  expect(captured.method).toBe('GET')
})
```

### Decision rationale

- **Why we kept mocking outside the Page Object** — `MyListsPage` describes user actions on the My Lists screen. The decision "this run uses canned data" is a test infrastructure decision, not a user action. Embedding `page.route` in `MyListsPage.open()` would couple the page object to one mock shape and break for any test that wants different data (or no mocks).
- **Why we used `captureRequestDetails` instead of `mockApiLists`** — the test asserts something about the request itself (was it sent? was it GET?). `captureRequestDetails` exposes that; `mockApiLists` swallows it.
- **Why we did not introduce a new helper** — the existing `captureRequestDetails` already covers this. Don't add abstractions you don't need.

---

## Example 2 — Raw e2e test → POM with `test.step`

A typical "I just used `playwright codegen` and pasted the output" test. No Page Objects, no narrative structure. We refactor by following the structure of `webapp/tests/e2e/list-crud.spec.ts:16-38`.

### Before

```ts
test('creates a new list and verifies card appears on My Lists', async ({ page }) => {
  const listName = `New Day ${Date.now()}`
  await page.goto('/')
  await page.getByTestId('new-list-button').click()
  await expect(page).toHaveURL('/create')
  await page.getByTestId('list-name-input').fill(listName)
  await page.getByTestId('task-form-input').first().fill('Sample task')
  await page.getByTestId('save-list-button').click()
  await expect(page).toHaveURL('/')
  await expect(
    page.locator('[data-testid^="day-card-"]').filter({ hasText: listName })
  ).toBeVisible()
})
```

### Problems

1. **Every line is raw `page.*`** — no Page Objects.
2. The selector `[data-testid^="day-card-"]` is duplicated from `MyListsPage.allDayCards()`/`dayCardByName()`.
3. **No phase grouping** — when this test fails, the HTML report shows a flat list of clicks; you can't tell whether it failed at "navigate" or at "verify".
4. The `Date.now()` list name is the only piece of test data — it should stay in the test, not the Page Object.

### After

```ts
import { test, expect } from '@playwright/test'
import { MyListsPage } from '../page-objects/MyListsPage'
import { CreateListPage } from '../page-objects/CreateListPage'

test('creates a new list and verifies card appears on My Lists', async ({ page }) => {
  const myLists = new MyListsPage(page)
  const createList = new CreateListPage(page)
  const listName = `New Day ${Date.now()}`

  await test.step('open My Lists page', async () => {
    await myLists.open()
  })

  await test.step('navigate to Create New List', async () => {
    await myLists.clickNewListButton()
  })

  await test.step('fill list name and a task, then save', async () => {
    await createList.fillListName(listName)
    await createList.fillTask(0, 'Sample task')
    await createList.submitList()
  })

  await test.step('verify new day card is visible on My Lists', async () => {
    await myLists.verifyDayCardWithNameVisible(listName)
  })
})
```

### Decision rationale

- **Why `test.step` for an e2e test** — five Step calls across four logical phases. When the test fails in CI, the HTML report shows the failing phase name (`navigate to Create New List`) instead of a stack trace at line N. Worth the boilerplate for e2e; not worth it for short integration tests (see anti-pattern #8).
- **Why we did NOT inline the URL/testid checks** — they are already inside the Step methods (`clickNewListButton` asserts `toHaveURL('/create')`, `submitList` asserts `toHaveURL('/')`). Repeating them in the test body would be noise.
- **Why we used `verifyDayCardWithNameVisible` (not `verifyDayCardVisible(id)`)** — in e2e mode the backend assigns the id; the test doesn't know it. The `*ByName` family on `MyListsPage` (lines 104-125) exists for exactly this case.
- **Why `listName` stays in the test, not the Page Object** — it's test data, not page state. Page Objects should not own data fixtures.
