import { type Page, type Locator, expect } from '@playwright/test'

export class ProgressViewPage {
  readonly progressViewPage: Locator
  readonly backButton: Locator
  readonly progressCounter: Locator
  readonly pendingSection: Locator
  readonly completedSection: Locator

  constructor(private readonly page: Page) {
    this.progressViewPage = page.getByTestId('progress-view-page')
    this.backButton = page.getByTestId('back-button')
    this.progressCounter = page.getByTestId('progress-counter')
    this.pendingSection = page.getByTestId('pending-section')
    this.completedSection = page.getByTestId('completed-section')
  }

  taskCheckbox(taskId: string): Locator {
    return this.page.getByTestId(`task-checkbox-${taskId}`)
  }

  taskName(taskId: string): Locator {
    return this.page.getByTestId(`task-name-${taskId}`)
  }

  /** Navigate to Progress View for a specific list and verify it loaded */
  async open(listId: string): Promise<void> {
    await this.page.goto(`/list/${listId}`)
    await expect(this.progressViewPage).toBeVisible()
  }

  /** Navigate to Progress View without asserting visibility (for redirect tests) */
  async attemptOpen(listId: string): Promise<void> {
    await this.page.goto(`/list/${listId}`)
  }

  /** Click a task checkbox and verify it remains on page */
  async clickTaskCheckbox(taskId: string): Promise<void> {
    await this.taskCheckbox(taskId).click()
    await expect(this.taskCheckbox(taskId)).toBeVisible()
  }

  /** Click back button and verify navigation to home */
  async clickBackButton(): Promise<void> {
    await this.backButton.click()
    await expect(this.page).toHaveURL('/')
  }

  /** Verify both pending and completed sections are visible */
  async verifySectionsVisible(): Promise<void> {
    await expect(this.pendingSection).toBeVisible()
    await expect(this.completedSection).toBeVisible()
  }

  /** Verify a task name is visible */
  async verifyTaskVisible(taskId: string): Promise<void> {
    await expect(this.taskName(taskId)).toBeVisible()
  }

  /** Verify progress counter shows correct done/total */
  async verifyProgressCounter(done: number, total: number): Promise<void> {
    await expect(this.progressCounter).toContainText(`${done}/${total}`)
  }

  /** Verify page redirected to home */
  async verifyRedirectedToHome(): Promise<void> {
    await expect(this.page).toHaveURL('/')
  }
}
