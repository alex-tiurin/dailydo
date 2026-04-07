import { type Page, type Locator, expect } from '@playwright/test'

export class MyListsPage {
  readonly myListsPage: Locator
  readonly newListButton: Locator
  readonly emptyState: Locator
  readonly createFirstListButton: Locator
  readonly progressOverview: Locator
  readonly navbar: Locator
  readonly nextjsPortal: Locator

  constructor(private readonly page: Page) {
    this.myListsPage = page.getByTestId('my-lists-page')
    this.newListButton = page.getByTestId('new-list-button')
    this.emptyState = page.getByTestId('empty-state')
    this.createFirstListButton = page.getByTestId('create-first-list-button')
    this.progressOverview = page.getByTestId('progress-overview')
    this.navbar = page.getByTestId('navbar')
    this.nextjsPortal = page.locator('nextjs-portal')
  }

  dayCard(listName: string): Locator {
    return this.page.getByTestId('day-card').filter({ hasText: listName })
  }

  allDayCards(): Locator {
    return this.page.getByTestId('day-card')
  }

  /** Navigate to My Lists page and verify it loaded */
  async open(): Promise<void> {
    await this.page.goto('/')
    await expect(this.myListsPage).toBeVisible()
  }

  /** Click "+ New List" button and verify navigation to create page */
  async clickNewListButton(): Promise<void> {
    await this.newListButton.click()
    await expect(this.page).toHaveURL('/create')
  }

  /** Click "Create First List" button in empty state and verify navigation */
  async clickCreateFirstListButton(): Promise<void> {
    await this.createFirstListButton.click()
    await expect(this.page).toHaveURL('/create')
  }

  /** Click a day card and verify navigation to progress view */
  async clickDayCard(listName: string): Promise<void> {
    await this.dayCard(listName).click()
    await expect(this.page).toHaveURL(/\/list\?id=/)
  }

  /** Verify a specific day card is visible */
  async verifyDayCardVisible(listName: string): Promise<void> {
    await expect(this.dayCard(listName)).toBeVisible()
  }

  /** Verify day cards appear in the given order */
  async verifyDayCardsOrder(listNames: string[]): Promise<void> {
    const cards = this.allDayCards()
    for (let i = 0; i < listNames.length; i++) {
      await expect(cards.nth(i)).toContainText(listNames[i])
    }
  }

  /** Verify empty state is shown with button and message */
  async verifyEmptyState(): Promise<void> {
    await expect(this.emptyState).toBeVisible()
    await expect(this.createFirstListButton).toBeVisible()
    await expect(this.page.getByText('No data yet')).toBeVisible()
  }

  /** Verify progress overview widget is visible */
  async verifyProgressOverviewVisible(): Promise<void> {
    await expect(this.progressOverview).toBeVisible()
  }

  /** Verify progress overview widget is hidden */
  async verifyProgressOverviewHidden(): Promise<void> {
    await expect(this.progressOverview).not.toBeVisible()
  }

  /** Verify page did not crash — navbar and page container present, no error overlay */
  async verifyPageDidNotCrash(): Promise<void> {
    await expect(this.navbar).toBeVisible()
    await expect(this.myListsPage).toBeVisible()
    await expect(this.nextjsPortal).not.toBeVisible()
  }

  /** Verify validation error message is visible */
  async verifyValidationError(message: string): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible()
  }

  /** Get the list name from the first day card */
  async getFirstDayCardListName(): Promise<string> {
    const firstCard = this.allDayCards().first()
    const ariaLabel = await firstCard.getAttribute('aria-label')
    expect(ariaLabel).toBeTruthy()
    return ariaLabel!
  }

  // --- E2e extensions (no API mocking, real backend) ---

  /** Verify a day card with a given name is visible (matches by text within any card) */
  async verifyDayCardWithNameVisible(name: string): Promise<void> {
    await expect(this.dayCard(name)).toBeVisible()
  }

  /** Return the first day card that contains the given list name */
  dayCardByName(name: string): Locator {
    return this.dayCard(name)
  }

  /** Click a day card matched by list name */
  async clickDayCardByName(name: string): Promise<void> {
    await this.dayCardByName(name).click()
    await expect(this.page).toHaveURL(/\/list\?id=/)
  }

  /** Verify a day card with a given name is no longer on the page */
  async verifyListDeleted(name: string): Promise<void> {
    await expect(this.dayCard(name)).not.toBeVisible()
  }
}
