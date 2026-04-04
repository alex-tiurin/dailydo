import { type Page, type Locator, expect } from '@playwright/test'

export class CreateListPage {
  readonly createListPage: Locator
  readonly listNameInput: Locator
  readonly addTaskButton: Locator
  readonly saveListButton: Locator

  constructor(private readonly page: Page) {
    this.createListPage = page.getByTestId('create-list-page')
    this.listNameInput = page.getByTestId('list-name-input')
    this.addTaskButton = page.getByTestId('add-task-button')
    this.saveListButton = page.getByTestId('save-list-button')
  }

  taskFormInput(index: number): Locator {
    return this.page.getByTestId('task-form-input').nth(index)
  }

  /** Navigate to Create List page and verify it loaded */
  async open(): Promise<void> {
    await this.page.goto('/create')
    await expect(this.createListPage).toBeVisible()
  }

  /** Fill the list name input and verify value */
  async fillListName(name: string): Promise<void> {
    await this.listNameInput.fill(name)
    await expect(this.listNameInput).toHaveValue(name)
  }

  /** Fill a task input by index and verify value */
  async fillTask(index: number, name: string): Promise<void> {
    await this.taskFormInput(index).fill(name)
    await expect(this.taskFormInput(index)).toHaveValue(name)
  }

  /** Click add task button and verify a new input appeared */
  async addTask(): Promise<void> {
    const countBefore = await this.page.getByTestId('task-form-input').count()
    await this.addTaskButton.click()
    await expect(this.page.getByTestId('task-form-input')).toHaveCount(countBefore + 1)
  }

  /** Submit the list and verify navigation to home page */
  async submitList(): Promise<void> {
    await this.saveListButton.click()
    await expect(this.page).toHaveURL('/')
  }

  /** Click save expecting no submission (validation failure) */
  async clickSaveExpectingNoSubmit(): Promise<void> {
    await this.saveListButton.click()
    await expect(this.page).toHaveURL('/create')
  }

  /** Verify currently on Create List page */
  async verifyOnCreatePage(): Promise<void> {
    await expect(this.page).toHaveURL('/create')
    await expect(this.createListPage).toBeVisible()
  }

  /** Verify a validation error message is visible */
  async verifyValidationError(message: string): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible()
  }
}
