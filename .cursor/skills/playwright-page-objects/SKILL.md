---
name: playwright-page-objects
description: Converts plain Playwright tests to the Page Object pattern. One page object per app screen; extracts locators and actions from tests into reusable classes. Use when refactoring Playwright tests to page objects, converting inline tests to page object pattern, or when the user asks for page objects for e2e tests.
---

# Playwright Tests → Page Object Pattern

## When to use

- Refactoring existing Playwright specs that use `page.goto`, `page.getByRole`, etc. directly
- Adding new tests and you want one page object per screen
- User asks to "use page objects" or "convert to page object pattern"

## Rule: one screen = one page object

Map each distinct app screen (route/view) to a single page object class. Examples:

- `/` or home list → `ListPage` (or `HomePage`)
- `/create` → `CreatePage`
- `/day/:id` → `DayDetailPage`
- Login modal or settings drawer → `LoginPage` / `SettingsPage` if they are separate UI surfaces

## Conversion workflow

1. **Identify screens**  
   From test files: note every `page.goto("...")` and route. Group by path/feature → one page object per group.

2. **Create page object files**  
   One file per screen, e.g. `e2e/pages/ListPage.ts`, `e2e/pages/CreatePage.ts`. Use a `pages/` (or `page-objects/`) folder under `e2e/`.

3. **Extract locators**  
   Move every `page.getByRole`, `page.getByText`, `page.getByPlaceholder`, `page.locator` used on that screen into the page object as **readonly getters** or **properties** that return `Locator`. Use semantic selectors (role, label, placeholder) over raw CSS when possible.

4. **Extract actions**  
   Turn sequences (e.g. fill form + click submit) into **methods** that take minimal args (e.g. list name, task labels). Methods can return `this` for chaining or return another page object when navigation happens (e.g. `createList(...)` → returns `ListPage`).

5. **Extract assertions**  
   Optional: add small assertion helpers (e.g. `expectEmptyStateVisible()`) that wrap `expect(locator).toBeVisible()`. Prefer keeping assertions in the test when they are one-off; move to page object when repeated.

6. **Refactor tests**  
   Replace `page.goto`, direct `page.getBy...`, and duplicated flows with:
   - `const listPage = new ListPage(page); await listPage.goto();`
   - `await listPage.newListLink.click();`
   - `const createPage = await listPage.goToNewList();` (if method navigates and returns new page)
   - Then use `createPage.fillAndSubmit("My Day", ["T1"])` etc.

7. **Base URL**  
   Use `page.goto("/path")` with relative paths and set `baseURL` in `playwright.config` so page objects stay environment-agnostic.

## Page object structure

- **Constructor**: accept `Page` from Playwright (and optionally `baseURL`).
- **Locators**: expose as getters returning `Locator` (e.g. `get newListLink() { return this.page.getByRole('link', { name: /New List/i }) }`).
- **Navigation**: `goto()` or `open()` that calls `this.page.goto('/path')`.
- **Actions**: methods that perform clicks, fill, etc. (e.g. `fillListName(name)`, `submitCreateList()`). Return type: `void`, `Promise<void>`, or `Promise<OtherPage>` when navigating.
- **Assertions**: optional helpers that use `expect(this.page or locator)...`; tests can still use `expect()` in spec when it’s clearer.

Keep page objects **synchronous in structure**: no `async` in getters; only methods that perform actions are `async`.

## File layout

```
webapp/e2e/
  pages/
    ListPage.ts      # screen: /
    CreatePage.ts    # screen: /create
    DayDetailPage.ts # screen: /day/:id
  list.spec.ts
  create.spec.ts
  day-detail.spec.ts
```

## Example (before → after)

**Before (plain test):**

```ts
test("navigate to create from empty state", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("link", { name: /New List/i }).first().click()
  await expect(page).toHaveURL(/\/create/)
})
```

**After (page object + test):**

```ts
// pages/ListPage.ts
import { Page, Locator } from "@playwright/test"

export class ListPage {
  constructor(readonly page: Page) {}

  get newListLink(): Locator {
    return this.page.getByRole("link", { name: /New List/i }).first()
  }

  async goto(): Promise<void> {
    await this.page.goto("/")
  }

  async goToNewList(): Promise<CreatePage> {
    await this.newListLink.click()
    return new CreatePage(this.page)
  }
}

// list.spec.ts
test("navigate to create from empty state", async ({ page }) => {
  const listPage = new ListPage(page)
  await listPage.goto()
  await listPage.goToNewList()
  await expect(page).toHaveURL(/\/create/)
})
```

## Cross-screen flows

When a test spans screens (e.g. create list on CreatePage then assert on ListPage), either:

- **Return next page from action**: `async submitCreateList(): Promise<ListPage>` — after click, `return new ListPage(this.page)`.
- **Or let test construct**: after `createPage.submitCreateList()`, test does `const listPage = new ListPage(page)` and continues. Prefer returning the next page object when the transition is fixed.

## What to avoid

- **One giant page object** for the whole app — split by screen.
- **Duplicate locators** in tests after refactor — keep them only in the page object.
- **Hardcoded full URLs** in page objects — use relative paths and `baseURL` in config.
- **Async getters** — use sync getters that return locators; only methods that perform I/O are async.

## Additional reference

- Full before/after examples and naming conventions: [reference.md](reference.md)
