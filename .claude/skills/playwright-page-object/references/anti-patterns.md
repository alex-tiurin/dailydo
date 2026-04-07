# Anti-patterns catalog

Each entry: WRONG → RIGHT → why. Use this as the checklist when reviewing a generated test.

---

## 1. Raw Playwright API in test body

**WRONG**
```ts
test('user creates a list', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('new-list-button').click()
  await page.getByTestId('list-name-input').fill('Monday')
})
```

**RIGHT**
```ts
test('user creates a list', async ({ page }) => {
  const myLists = new MyListsPage(page)
  const createList = new CreateListPage(page)
  await myLists.open()
  await myLists.clickNewListButton()
  await createList.fillListName('Monday')
})
```

**Why** — when the testid changes, only the Page Object updates. Tests stay readable as user stories.

---

## 2. Step without `expect`

**WRONG**
```ts
async clickNewListButton(): Promise<void> {
  await this.newListButton.click()
}
```

**RIGHT**
```ts
async clickNewListButton(): Promise<void> {
  await this.newListButton.click()
  await expect(this.page).toHaveURL('/create')
}
```

**Why** — without verification, a Step is just an alias for `page.click()`. Failures point to the test line, not to the action that actually broke.

**Exception** — negative verifications are valid (assert that the action did NOT proceed):
```ts
async clickSaveExpectingNoSubmit(): Promise<void> {
  await this.saveListButton.click()
  await expect(this.page).toHaveURL('/create')   // still on /create
}
```

---

## 3. Locator created inside a method body

**WRONG**
```ts
async clickNewListButton(): Promise<void> {
  await this.page.getByTestId('new-list-button').click()
  // ...
}
```

**RIGHT**
```ts
readonly newListButton: Locator

constructor(private readonly page: Page) {
  this.newListButton = page.getByTestId('new-list-button')
}

async clickNewListButton(): Promise<void> {
  await this.newListButton.click()
}
```

**Why** — locator definition belongs in one place per element. Inline locators silently duplicate when reused.

**Exception** — parametrized locators (id/index/name) belong as methods returning `Locator`:
```ts
dayCard(listId: string): Locator { return this.page.getByTestId(`day-card-${listId}`) }
```

---

## 4. `waitForTimeout` instead of an assertion

**WRONG**
```ts
await this.saveListButton.click()
await this.page.waitForTimeout(1000)
```

**RIGHT**
```ts
await this.saveListButton.click()
await expect(this.page).toHaveURL('/')
```

**Why** — `waitForTimeout` makes tests slow when the app is fast and flaky when the app is slow. Always wait for the **observable** state change.

---

## 5. Compound Step without atomic alternatives

**WRONG** — only the compound exists:
```ts
async createListWithTasks(name: string, tasks: string[]): Promise<void> { ... }
// fillListName, addTask, submitList don't exist as standalone Steps
```

**RIGHT** — atomic Steps are first-class, compound is a convenience:
```ts
async fillListName(name: string): Promise<void> { ... }
async addTask(name: string): Promise<void> { ... }
async submitList(): Promise<void> { ... }
async createListWithTasks(name: string, tasks: string[]): Promise<void> {
  await this.fillListName(name)
  for (const t of tasks) await this.addTask(t)
  await this.submitList()
}
```

**Why** — atomic Steps stay reusable for tests that need a partial flow (e.g., test validation by calling `fillListName('') + submitList`). Add a compound only when the same sequence appears in **≥3 tests**.

---

## 6. API mock inside a Page Object

**WRONG**
```ts
class MyListsPage {
  async openWithMockedLists(lists: MockList[]): Promise<void> {
    await this.page.route('**/api/lists', async (route) => { ... })
    await this.open()
  }
}
```

**RIGHT** — mocking stays in `tests/integration/helpers/mock-api.ts`:
```ts
import { mockApiLists } from './helpers/mock-api'

test('shows lists', async ({ page }) => {
  await mockApiLists(page, DEFAULT_MOCK_LISTS)   // infrastructure
  const myLists = new MyListsPage(page)           // page object
  await myLists.open()                             // user step
})
```

**Why** — mocking controls the **environment**, not user behavior. Mixing them couples Page Objects to specific test infrastructure.

---

## 7. Inline `page.route` in a test body

**WRONG**
```ts
test('shows empty state', async ({ page }) => {
  await page.route('**/api/lists', async (route) => {
    await route.fulfill({ status: 200, body: JSON.stringify([]) })
  })
  // ...
})
```

**RIGHT**
```ts
test('shows empty state', async ({ page }) => {
  await mockApiLists(page, [])
  // ...
})
```

**Why** — duplicates `mockApiLists` from `helpers/mock-api.ts`. When the API contract changes, you'd have to chase every inline route. Add a helper if the existing ones don't cover your case (`captureRequestDetails`, `captureCreateListRequest`, etc. are already there).

---

## 8. `test.step` in a short integration test

**WRONG**
```ts
test('shows empty state', async ({ page }) => {
  await mockApiLists(page, [])
  await test.step('open page', async () => {
    const myLists = new MyListsPage(page)
    await myLists.open()
  })
  await test.step('verify empty state', async () => {
    const myLists = new MyListsPage(page)
    await myLists.verifyEmptyState()
  })
})
```

**RIGHT**
```ts
test('shows empty state', async ({ page }) => {
  await mockApiLists(page, [])
  const myLists = new MyListsPage(page)
  await myLists.open()
  await myLists.verifyEmptyState()
})
```

**Why** — `test.step` is a narrative wrapper for **multi-phase** flows. A 2–3 Step integration test is already self-narrating; the wrapper just adds noise.

---

## 9. `test.step` as a verification substitute

**WRONG**
```ts
await test.step('click create button', async () => {
  await page.getByTestId('create-button').click()    // raw page.* AND no expect
})
```

**RIGHT**
```ts
await test.step('navigate to Create New List', async () => {
  await myLists.clickNewListButton()    // Step method already verifies URL changed
})
```

**Why** — `test.step` only labels a phase in the report. The verification must live inside the Step method on the Page Object.

---

## 10. Importing `Page` or `Locator` into a `.spec.ts`

**WRONG**
```ts
// tests/integration/my-lists.spec.ts
import { test, expect, Page, Locator } from '@playwright/test'
```

**RIGHT**
```ts
// tests/integration/my-lists.spec.ts
import { test, expect } from '@playwright/test'
import { MyListsPage } from '../page-objects/MyListsPage'
```

**Why** — if a test needs `Page`/`Locator`, it's about to write raw locator code. Force yourself to put it in a Page Object instead. Test files only need `test` and `expect`.
