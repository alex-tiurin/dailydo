// Template for a new Page Object.
// Replace `XxxPage`, `xxx-page-testid`, `xxx-button-testid`, etc. with real names.
// Drop sections you don't need (e.g., E2e extensions for screens used only in integration tests).
// Reference: webapp/tests/page-objects/MyListsPage.ts

import { type Page, type Locator, expect } from '@playwright/test'

export class XxxPage {
  // --- Locators ---
  readonly xxxPage: Locator
  readonly primaryButton: Locator

  constructor(private readonly page: Page) {
    this.xxxPage = page.getByTestId('xxx-page-testid')
    this.primaryButton = page.getByTestId('primary-button-testid')
  }

  // Parametrized locators live as methods returning Locator (not as fields).
  itemRow(itemId: string): Locator {
    return this.page.getByTestId(`item-row-${itemId}`)
  }

  // --- Action Steps ---
  // Each method does ONE user action and verifies its immediate visible result.

  /** Navigate to the Xxx page and verify it loaded */
  async open(): Promise<void> {
    await this.page.goto('/xxx')
    await expect(this.xxxPage).toBeVisible()
  }

  /** Click the primary button and verify navigation to the next page */
  async clickPrimaryButton(): Promise<void> {
    await this.primaryButton.click()
    await expect(this.page).toHaveURL('/next-page')
  }

  // --- Verification Steps ---
  // Pure assertions, no interaction. Use for the final assert of a test or for state checks between actions.

  /** Verify a specific item row is visible */
  async verifyItemVisible(itemId: string): Promise<void> {
    await expect(this.itemRow(itemId)).toBeVisible()
  }

  /** Verify the page did not crash (container present, no Next.js error overlay) */
  async verifyPageDidNotCrash(): Promise<void> {
    await expect(this.xxxPage).toBeVisible()
    await expect(this.page.locator('nextjs-portal')).not.toBeVisible()
  }

  // --- E2e extensions (no API mocking, real backend) ---
  // For e2e tests where backend-generated IDs are unknown to the test.
  // Locate by visible text inside the testid-prefixed container.

  /** Locator for a row containing the given visible name */
  itemRowByName(name: string): Locator {
    return this.page.locator('[data-testid^="item-row-"]').filter({ hasText: name })
  }

  /** Verify a row with the given name is visible */
  async verifyItemWithNameVisible(name: string): Promise<void> {
    await expect(this.itemRowByName(name)).toBeVisible()
  }

  /** Verify a row with the given name is no longer present */
  async verifyItemDeleted(name: string): Promise<void> {
    await expect(this.itemRowByName(name)).not.toBeVisible()
  }
}
