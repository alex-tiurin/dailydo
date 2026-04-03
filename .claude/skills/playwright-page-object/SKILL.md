---
name: playwright-page-object
description: "Enforces Page Object Model with Step pattern for all Playwright tests. Use this skill whenever generating, writing, refactoring, or reviewing Playwright tests — including when using the playwright-cli skill for test generation. Every Playwright test must use Page Objects where each user action is a Step method with a built-in assertion. Triggers on: writing new Playwright tests, converting existing tests to Page Object pattern, generating tests from browser interactions, reviewing test code for POM compliance, any mention of Page Object or test architecture for Playwright."
---

# Playwright Page Object & Step Pattern

This skill defines how Playwright tests must be structured. The goal is simple: **no test should contain raw Playwright API calls**. Every interaction with the page goes through a Page Object, and every logical user action is a Step — a method that performs the action and verifies it succeeded.

This matters because raw `page.click()` / `page.fill()` calls scattered across test files become unmaintainable as the app grows. When a UI element changes, you'd have to update dozens of tests. With Page Objects, you update one method. Steps add reliability — each action confirms it worked before the test moves on, so failures point to exactly where things broke.

## Core Principles

### 1. Tests are sequences of Steps — nothing else

A test body should read like a user story. No locators, no `page.*` calls, no assertions — only Step method calls on Page Objects.

```typescript
// CORRECT — test reads as a user flow
test('user creates a new task list', async ({ page }) => {
  const myLists = new MyListsPage(page);
  await myLists.open();
  await myLists.clickCreateNewList();

  const createList = new CreateListPage(page);
  await createList.fillListName('Monday Routine');
  await createList.addTask('Morning workout');
  await createList.addTask('Read 20 pages');
  await createList.submitList();

  await myLists.verifyListVisible('Monday Routine');
});
```

```typescript
// WRONG — raw Playwright calls in test body
test('user creates a new task list', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('create-list-button').click();
  await page.getByTestId('list-name-input').fill('Monday Routine');
  // ... more raw calls
});
```

### 2. Every Step ends with a verification

A Step is not just a wrapper around `page.click()`. It performs the action AND confirms the expected outcome. This is the key difference from a naive Page Object where methods just forward calls.

The verification should check the immediate visible result of the user's action — what the user would see confirming their action worked.

```typescript
// CORRECT — step verifies its own success
async clickCreateNewList(): Promise<void> {
  await this.page.getByTestId('create-list-button').click();
  // Verify: Create List page is now visible
  await expect(this.page.getByTestId('create-list-page')).toBeVisible();
}

async addTask(taskName: string): Promise<void> {
  await this.page.getByTestId('task-input').fill(taskName);
  await this.page.getByTestId('add-task-button').click();
  // Verify: the task appears in the list
  await expect(this.page.getByText(taskName)).toBeVisible();
}
```

```typescript
// WRONG — no verification, just a wrapper
async clickCreateNewList(): Promise<void> {
  await this.page.getByTestId('create-list-button').click();
}
```

### 3. Page Object structure

Each page/screen gets its own Page Object class. The class encapsulates all locators and interactions for that page.

```typescript
// file: tests/page-objects/MyListsPage.ts
import { type Page, type Locator, expect } from '@playwright/test';

export class MyListsPage {
  readonly page: Page;
  // Locators as readonly properties
  readonly dayCard: (id: string) => Locator;
  readonly createListButton: Locator;
  readonly emptyState: Locator;
  readonly progressOverview: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dayCard = (id: string) => page.getByTestId(`day-card-${id}`);
    this.createListButton = page.getByTestId('create-list-button');
    this.emptyState = page.getByTestId('empty-state');
    this.progressOverview = page.getByTestId('progress-overview');
  }

  // --- Steps ---

  /** Navigate to the My Lists page and verify it loaded */
  async open(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page.getByTestId('my-lists-page')).toBeVisible();
  }

  /** Click "Create New List" and verify navigation to create page */
  async clickCreateNewList(): Promise<void> {
    await this.createListButton.click();
    await expect(this.page).toHaveURL(/.*create/);
  }

  /** Verify a specific day card is visible */
  async verifyListVisible(listId: string): Promise<void> {
    await expect(this.dayCard(listId)).toBeVisible();
  }

  /** Verify empty state is shown */
  async verifyEmptyState(): Promise<void> {
    await expect(this.emptyState).toBeVisible();
    await expect(this.page.getByTestId('create-first-list-button')).toBeVisible();
  }

  /** Verify progress overview visibility */
  async verifyProgressOverviewVisible(): Promise<void> {
    await expect(this.progressOverview).toBeVisible();
  }

  /** Verify progress overview is hidden */
  async verifyProgressOverviewHidden(): Promise<void> {
    await expect(this.progressOverview).not.toBeVisible();
  }

  /** Click a day card and verify navigation to progress view */
  async openList(listId: string): Promise<void> {
    await this.dayCard(listId).click();
    await expect(this.page).toHaveURL(new RegExp(`.*lists/${listId}`));
  }
}
```

## File Organization

```
tests/
├── page-objects/           # All Page Object classes
│   ├── MyListsPage.ts
│   ├── CreateListPage.ts
│   └── ProgressViewPage.ts
├── integration/
│   ├── helpers/
│   │   └── mock-api.ts     # API mocking utilities (unchanged)
│   ├── my-lists.spec.ts    # Tests using Page Objects
│   ├── create-list.spec.ts
│   └── navigation.spec.ts
└── e2e/
```

- Page Objects live in `tests/page-objects/` — one file per page/screen
- Test files import Page Objects and helpers, nothing else from Playwright except `test` and `expect` (for top-level test structure only)
- Mock/API helpers stay in `helpers/` — they are infrastructure, not user actions

## When Converting Existing Tests

When refactoring existing tests (like the ones in this project), follow these steps:

1. **Identify pages** — each `test.describe` group usually corresponds to one page
2. **Extract locators** — find all `page.getByTestId()`, `page.locator()`, `page.getByText()` etc. and move them into the Page Object as properties
3. **Group actions into Steps** — each logical user action becomes a method. A "logical action" is what a user would describe in one sentence: "I click the create button", "I fill in the task name", "I navigate to the list"
4. **Add verification to each Step** — figure out what the user would see confirming the action worked, and add that assertion inside the step method
5. **Rewrite tests** — replace raw Playwright calls with Step calls. The test body should read like a script of user actions

### Example: converting a raw test

Before:
```typescript
test('shows empty state when API returns empty array', async ({ page }) => {
  await page.route('**/api/lists', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    } else {
      await route.continue();
    }
  });
  await page.goto('/');
  await expect(page.getByTestId('empty-state')).toBeVisible();
  await expect(page.getByTestId('create-first-list-button')).toBeVisible();
  await expect(page.getByText('No data yet')).toBeVisible();
});
```

After:
```typescript
test('shows empty state when API returns empty array', async ({ page }) => {
  await mockApiLists(page, []);
  const myLists = new MyListsPage(page);
  await myLists.open();
  await myLists.verifyEmptyState();
});
```

## Step Naming Conventions

Use verb-first names that describe the user's intent:

| Pattern | Examples |
|---------|----------|
| **Action steps** | `open()`, `clickCreateNewList()`, `fillListName()`, `addTask()`, `submitList()`, `toggleTask()` |
| **Verification steps** | `verifyListVisible()`, `verifyEmptyState()`, `verifyTaskCompleted()`, `verifyProgressCount()` |
| **Compound steps** | `createListWithTasks(name, tasks[])` — for common multi-action sequences |

- Action steps: perform an interaction + verify the immediate result
- Verification steps: only assert state (no interaction) — useful for final test assertions
- Compound steps: combine multiple actions for frequently repeated flows (keep atomic steps available too)

## API Mocking and Page Objects

API mocking (route setup) stays **outside** Page Objects. Mocking is test infrastructure — it's about controlling the environment, not about user actions. Keep using the `helpers/mock-api.ts` patterns.

```typescript
// CORRECT — mock setup is separate from Page Object steps
test('displays lists from API', async ({ page }) => {
  await mockApiLists(page, DEFAULT_MOCK_LISTS);  // infrastructure
  const myLists = new MyListsPage(page);          // page object
  await myLists.open();                            // user step
  await myLists.verifyListVisible('mock-list-1');  // user step
});
```

## Integration with playwright-cli test generation

When using `playwright-cli` to record browser interactions and generate test code, the generated raw Playwright calls must be restructured into the Page Object + Step pattern before being finalized. The workflow is:

1. Use `playwright-cli` to interact with the app and capture raw code
2. Identify which page each action belongs to
3. Create or update Page Object classes with Step methods for each action
4. Write the test using only Step calls

Never commit tests with raw generated code — always refactor into Steps first.
