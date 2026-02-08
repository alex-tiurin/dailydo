import { Page, Locator } from "@playwright/test"
import { ListPage } from "./ListPage"

export class CreatePage {
  constructor(readonly page: Page) {}

  get listNameInput(): Locator {
    return this.page.getByPlaceholder(/Monday Tasks|List name/i)
  }

  get listNameLabel(): Locator {
    return this.page.getByLabel(/List Name/i)
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

  async fillTask(index: number, text: string): Promise<void> {
    await this.taskInputs.nth(index).fill(text)
  }

  async addTask(): Promise<void> {
    await this.addTaskButton.click()
  }

  /**
   * Fills list name and tasks, clicks Create List. Returns ListPage after redirect.
   */
  async fillAndSubmit(
    listName: string,
    taskLabels: string[]
  ): Promise<ListPage> {
    await this.fillListName(listName)
    for (let i = 0; i < taskLabels.length; i++) {
      if (i > 0) await this.addTask()
      await this.fillTask(i, taskLabels[i])
    }
    await this.createListButton.click()
    return new ListPage(this.page)
  }

  async goBack(): Promise<ListPage> {
    await this.backLink.click()
    return new ListPage(this.page)
  }
}
