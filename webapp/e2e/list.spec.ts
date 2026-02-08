import { test, expect } from "@playwright/test"

test.describe("List of days screen", () => {
  test("shows empty state when no lists", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("No task lists yet")).toBeVisible()
    await expect(page.getByRole("link", { name: /New List/i }).first()).toBeVisible()
  })

  test("header and New List action visible", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { name: "Daily Do" }).or(page.getByText("Daily Do"))).toBeVisible()
    await expect(page.getByRole("link", { name: /New List/i }).first()).toBeVisible()
  })

  test("navigate to create from empty state", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: /New List/i }).first().click()
    await expect(page).toHaveURL(/\/create/)
  })

  test("lists displayed when data exists and newest first", async ({ page }) => {
    await page.goto("/create")
    await page.getByPlaceholder(/Monday Tasks|List name/i).fill("First List")
    await page.getByPlaceholder(/Describe a task/i).first().fill("Task one")
    await page.getByRole("button", { name: /Create List/i }).click()
    await expect(page).toHaveURL("/")
    await expect(page.getByText("First List")).toBeVisible()

    await page.getByRole("link", { name: /New List/i }).first().click()
    await page.getByPlaceholder(/Monday Tasks|List name/i).fill("Second List")
    await page.getByPlaceholder(/Describe a task/i).first().fill("Task A")
    await page.getByRole("button", { name: /Create List/i }).click()
    await expect(page).toHaveURL("/")
    const cards = page.locator('a[href^="/day/"]')
    await expect(cards.first()).toContainText("Second List")
    await expect(cards.nth(1)).toContainText("First List")
  })

  test("navigate to day detail from card", async ({ page }) => {
    await page.goto("/create")
    await page.getByPlaceholder(/Monday Tasks|List name/i).fill("My Day")
    await page.getByPlaceholder(/Describe a task/i).first().fill("T1")
    await page.getByRole("button", { name: /Create List/i }).click()
    await expect(page).toHaveURL("/")
    await page.getByText("My Day").click()
    await expect(page).toHaveURL(/\/day\/[a-f0-9-]+/)
    await expect(page.getByText("My Day").first()).toBeVisible()
    await expect(page.getByText("T1")).toBeVisible()
  })
})
