import { Page, Locator } from "@playwright/test"
import { CreatePage } from "./CreatePage"
import { DayDetailPage } from "./DayDetailPage"

export class ListPage {
  constructor(readonly page: Page) {}

  get emptyStateText(): Locator {
    return this.page.getByText("No task lists yet")
  }

  get newListLink(): Locator {
    return this.page.getByRole("link", { name: /New List/i }).first()
  }

  get heading(): Locator {
    return this.page
      .getByRole("heading", { name: "Daily Do" })
      .or(this.page.getByText("Daily Do"))
  }

  get dayCards(): Locator {
    return this.page.locator('a[href^="/day/"]')
  }

  async goto(): Promise<void> {
    await this.page.goto("/")
  }

  async goToNewList(): Promise<CreatePage> {
    await this.newListLink.click()
    return new CreatePage(this.page)
  }

  getCardByTitle(title: string): Locator {
    return this.page.getByText(title)
  }

  async goToDayByCardTitle(title: string): Promise<DayDetailPage> {
    await this.getCardByTitle(title).click()
    return new DayDetailPage(this.page)
  }
}
