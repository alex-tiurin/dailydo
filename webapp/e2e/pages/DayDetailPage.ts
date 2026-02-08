import { Page, Locator } from "@playwright/test"
import { ListPage } from "./ListPage"

export class DayDetailPage {
  constructor(readonly page: Page) {}

  get toDoSection(): Locator {
    return this.page.locator("section").filter({ hasText: "To Do" })
  }

  get completedSection(): Locator {
    return this.page.locator("section").filter({ hasText: "Completed" })
  }

  get checkboxes(): Locator {
    return this.page.getByRole("checkbox")
  }

  get backLink(): Locator {
    return this.page.getByRole("link", { name: /back|Back/i }).first()
  }

  get progressText(): Locator {
    return this.page
      .getByText(/^\d+\s*\/\s*\d+$/)
      .or(this.page.getByText(/\d+\/\d+/))
  }

  get completedHeading(): Locator {
    return this.page.getByText("Completed", { exact: false })
  }

  get toDoHeading(): Locator {
    return this.page.getByText("To Do", { exact: false })
  }

  get notFoundMessage(): Locator {
    return this.page.getByText("This list doesn't exist or was deleted.")
  }

  listNameHeading(name: string): Locator {
    return this.page.getByText(name).first()
  }

  taskText(text: string): Locator {
    return this.page.getByText(text)
  }

  async gotoInvalid(id: string): Promise<void> {
    await this.page.goto(`/day/${id}`)
  }

  async toggleFirstToDo(): Promise<void> {
    await this.toDoSection.getByRole("button").first().click()
  }

  async toggleFirstCompleted(): Promise<void> {
    await this.completedSection.getByRole("button").first().click()
  }

  async goBack(): Promise<ListPage> {
    await this.backLink.click()
    return new ListPage(this.page)
  }
}
