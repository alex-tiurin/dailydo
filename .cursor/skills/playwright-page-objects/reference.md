# Page Object Reference

## Naming

- **Classes**: `{Screen}Page` — e.g. `ListPage`, `CreatePage`, `DayDetailPage`, `LoginPage`.
- **Files**: `{Screen}Page.ts` in `e2e/pages/`.
- **Locator getters**: descriptive and role-based — `newListLink`, `listNameInput`, `createListButton`, `taskInputs`, `toDoSection`.
- **Methods**: verb-first — `goto()`, `fillListName(name)`, `addTask()`, `submitCreateList()`, `toggleTaskByIndex(n)`.

## CreatePage example

```ts
// e2e/pages/CreatePage.ts
import { Page, Locator } from "@playwright/test"
import { ListPage } from "./ListPage"

export class CreatePage {
  constructor(readonly page: Page) {}

  get listNameInput(): Locator {
    return this.page.getByPlaceholder(/Monday Tasks|List name/i)
  }
  get taskInputs(): Locator {
    return this.page.getByPlaceholder(/Describe a task/i)
  }
  get createListButton(): Locator {
    return this.page.getByRole("button", { name: /Create List/i })
  }
  get addTaskButton(): Locator {
    return this.page.getByRole("button", { name: /Add Task/i })
  }
  get backLink(): Locator {
    return this.page.getByRole("link", { name: /back|Back/i }).first()
  }

  async goto(): Promise<void> {
    await this.page.goto("/create")
  }

  async fillListName(name: string): Promise<void> {
    await this.listNameInput.fill(name)
  }

  async fillTaskAt(index: number, label: string): Promise<void> {
    await this.taskInputs.nth(index).fill(label)
  }

  async addTask(): Promise<void> {
    await this.addTaskButton.click()
  }

  async submitCreateList(): Promise<ListPage> {
    await this.createListButton.click()
    return new ListPage(this.page)
  }

  async goBack(): Promise<ListPage> {
    await this.backLink.click()
    return new ListPage(this.page)
  }
}
```

Note: `ListPage` import required at top when returning it.

## DayDetailPage example (fragment)

```ts
// e2e/pages/DayDetailPage.ts
import { Page, Locator } from "@playwright/test"

export class DayDetailPage {
  constructor(readonly page: Page) {}

  get toDoSection(): Locator {
    return this.page.locator("section").filter({ hasText: "To Do" })
  }
  get completedSection(): Locator {
    return this.page.locator("section").filter({ hasText: "Completed" })
  }
  get backLink(): Locator {
    return this.page.getByRole("link", { name: /back|Back/i }).first()
  }

  async goto(id: string): Promise<void> {
    await this.page.goto(`/day/${id}`)
  }

  async toggleFirstTaskInToDo(): Promise<void> {
    await this.toDoSection.getByRole("button").first().click()
  }
}
```

## Using page objects in beforeEach

Setup that navigates and prepares state can use page objects:

```ts
test.describe("Day detail screen", () => {
  test.beforeEach(async ({ page }) => {
    const createPage = new CreatePage(page)
    await createPage.goto()
    await createPage.fillListName("Detail Test List")
    await createPage.fillTaskAt(0, "Task A")
    await createPage.addTask()
    await createPage.fillTaskAt(1, "Task B")
    await createPage.submitCreateList()
    await expect(page).toHaveURL("/")
    await new ListPage(page).dayCard("Detail Test List").click()
    await expect(page).toHaveURL(/\/day\/[a-f0-9-]+/)
  })

  test("shows list name and tasks", async ({ page }) => {
    const dayPage = new DayDetailPage(page)
    await expect(dayPage.page.getByText("Detail Test List").first()).toBeVisible()
    await expect(dayPage.page.getByText("Task A")).toBeVisible()
    // ...
  })
})
```

Optional: add a helper on `ListPage` like `dayCard(title: string)` returning `this.page.getByText(title)` so tests stay readable.

## Cross-screen flow in a test

```ts
test("create list and open day from list", async ({ page }) => {
  const createPage = new CreatePage(page)
  await createPage.goto()
  await createPage.fillListName("My Day")
  await createPage.fillTaskAt(0, "T1")
  const listPage = await createPage.submitCreateList()
  await expect(page).toHaveURL("/")
  await listPage.dayCard("My Day").click()
  await expect(page).toHaveURL(/\/day\/[a-f0-9-]+/)
  const dayPage = new DayDetailPage(page)
  await expect(dayPage.page.getByText("My Day").first()).toBeVisible()
  await expect(dayPage.page.getByText("T1")).toBeVisible()
})
```

## Circular imports

If `CreatePage` returns `ListPage` and `ListPage` navigates to `CreatePage`, use dynamic import or a small factory to avoid circular deps:

```ts
// CreatePage.ts
async submitCreateList(): Promise<ListPage> {
  await this.createListButton.click()
  const { ListPage } = await import("./ListPage")
  return new ListPage(this.page)
}
```

Or keep navigation methods returning `void` and let the test construct the next page object after asserting URL.
