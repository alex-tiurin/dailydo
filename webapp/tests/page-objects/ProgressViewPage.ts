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

  taskRow(taskName: string): Locator {
    return this.page.getByTestId('task-item').filter({ hasText: taskName })
  }

  taskCheckbox(taskName: string): Locator {
    return this.taskRow(taskName).getByTestId('task-checkbox')
  }

  taskName(taskName: string): Locator {
    return this.taskRow(taskName).getByTestId('task-name')
  }

  /** Navigate to Progress View for a specific list and verify it loaded */
  async open(listId: string): Promise<void> {
    await this.page.goto(`/list?id=${listId}`)
    await expect(this.progressViewPage).toBeVisible()
  }

  /** Navigate to Progress View without asserting visibility (for redirect tests) */
  async attemptOpen(listId: string): Promise<void> {
    await this.page.goto(`/list?id=${listId}`)
  }

  /** Click a task checkbox and verify it remains on page */
  async clickTaskCheckbox(taskName: string): Promise<void> {
    await this.taskCheckbox(taskName).click()
    await expect(this.taskRow(taskName)).toBeVisible()
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
  async verifyTaskVisible(taskName: string): Promise<void> {
    await expect(this.taskName(taskName)).toBeVisible()
  }

  /** Verify progress counter shows correct done/total */
  async verifyProgressCounter(done: number, total: number): Promise<void> {
    await expect(this.progressCounter).toContainText(`${done}/${total}`)
  }

  /** Verify page redirected to home */
  async verifyRedirectedToHome(): Promise<void> {
    await expect(this.page).toHaveURL('/')
  }

  /** Verify Progress View page is displayed */
  async verifyPageVisible(): Promise<void> {
    await expect(this.progressViewPage).toBeVisible()
  }

  /** Verify back button is visible */
  async verifyBackButtonVisible(): Promise<void> {
    await expect(this.backButton).toBeVisible()
  }

  /** Verify pending section is visible */
  async verifyPendingSectionVisible(): Promise<void> {
    await expect(this.pendingSection).toBeVisible()
  }

  /** Verify pending section is not visible */
  async verifyPendingSectionNotVisible(): Promise<void> {
    await expect(this.pendingSection).not.toBeVisible()
  }

  /** Verify completed section is visible */
  async verifyCompletedSectionVisible(): Promise<void> {
    await expect(this.completedSection).toBeVisible()
  }

  /** Verify completed section is not visible */
  async verifyCompletedSectionNotVisible(): Promise<void> {
    await expect(this.completedSection).not.toBeVisible()
  }

  /** Verify a task text is visible on the page */
  async verifyTaskTextVisible(text: string): Promise<void> {
    await expect(this.taskName(text)).toBeVisible()
  }

  /** Verify a task text is no longer visible on the page */
  async verifyTaskTextNotVisible(text: string): Promise<void> {
    await expect(this.taskName(text)).not.toBeVisible()
  }

  // --- E2e extensions (no API mocking, real backend) ---

  /** Verify a task is visible in the pending section */
  async verifyTaskInPendingSection(taskName: string): Promise<void> {
    await expect(this.taskName(taskName)).toBeVisible()
    await expect(this.taskName(taskName)).not.toHaveCSS('text-decoration-line', 'line-through')
  }

  /** Verify a task is visible in the completed section (strikethrough text) */
  async verifyTaskInCompletedSection(taskName: string): Promise<void> {
    await expect(this.taskName(taskName)).toBeVisible()
    await expect(this.taskName(taskName)).toHaveCSS('text-decoration-line', 'line-through')
  }

  /** Toggle a pending task to completed: clicks the checkbox and verifies the task moved to Completed section (strikethrough) */
  async toggleTaskToCompleted(taskName: string): Promise<void> {
    await this.taskCheckbox(taskName).click()
    await expect(this.completedSection).toBeVisible()
    await expect(this.taskName(taskName)).toBeVisible()
    await expect(this.taskName(taskName)).toHaveCSS('text-decoration-line', 'line-through')
  }

  /** Toggle a completed task back to pending: clicks the checkbox and verifies the task is in Pending (no strikethrough) */
  async toggleTaskToPending(taskName: string): Promise<void> {
    await this.taskCheckbox(taskName).click()
    await expect(this.pendingSection).toBeVisible()
    await expect(this.taskName(taskName)).toBeVisible()
    await expect(this.taskName(taskName)).not.toHaveCSS('text-decoration-line', 'line-through')
  }

  /** Click the edit (pencil) button for a task and verify the inline edit input appears */
  async clickEditTask(taskName: string): Promise<void> {
    await this.taskRow(taskName).getByTestId('task-edit').click()
    await expect(this.page.locator('[data-testid^="task-edit-input-"]').first()).toBeVisible()
  }

  /**
   * Rename a task using inline edit.
   * NOTE: As of exploratory testing (2026-04-04), the task-edit button has no handler —
   * inline editing is NOT implemented. This method is a placeholder for when it is.
   */
  async renameTask(taskName: string, name: string): Promise<void> {
    await this.clickEditTask(taskName)
    // Assumes an input field becomes visible after clicking edit
    const editInput = this.page.locator('[data-testid^="task-edit-input-"]').first()
    await editInput.fill(name)
    await editInput.press('Enter')
  }

  /** Verify task name text content */
  async verifyTaskName(taskName: string, name: string): Promise<void> {
    await expect(this.taskName(taskName)).toHaveText(name)
  }

  /** Wait for the progress counter to show the expected value (e.g. "2/3 done") */
  async waitForProgressCounter(done: number, total: number): Promise<void> {
    await expect(this.progressCounter).toContainText(`${done}/${total}`)
  }
}
