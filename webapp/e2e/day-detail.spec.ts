import { test, expect } from "@playwright/test"

test.describe("Day detail screen", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/create")
    await page.getByPlaceholder(/Monday Tasks|List name/i).fill("Detail Test List")
    await page.getByPlaceholder(/Describe a task/i).first().fill("Task A")
    await page.getByRole("button", { name: /Add Task/i }).click()
    await page.getByPlaceholder(/Describe a task/i).nth(1).fill("Task B")
    await page.getByRole("button", { name: /Create List/i }).click()
    await expect(page).toHaveURL("/")
    await page.getByText("Detail Test List").click()
    await expect(page).toHaveURL(/\/day\/[a-f0-9-]+/)
  })

  test("shows list name and tasks with checkboxes", async ({ page }) => {
    await expect(page.getByText("Detail Test List").first()).toBeVisible()
    await expect(page.getByText("Task A")).toBeVisible()
    await expect(page.getByText("Task B")).toBeVisible()
    const checkboxes = page.getByRole("checkbox")
    await expect(checkboxes).toHaveCount(2)
  })

  test("progress shows count", async ({ page }) => {
    await expect(page.getByText("0 / 2").or(page.getByText("0/2"))).toBeVisible()
  })

  test("toggle task to done moves to completed", async ({ page }) => {
    await expect(page.getByText("To Do", { exact: false })).toBeVisible()
    const toDoSection = page.locator("section").filter({ hasText: "To Do" })
    await toDoSection.getByRole("button").first().click()
    await expect(page.getByText("Completed", { exact: false })).toBeVisible({ timeout: 5000 })
    await expect(page.getByText("Task A")).toBeVisible()
    await expect(page.getByText("1 / 2").or(page.getByText("1/2"))).toBeVisible()
  })

  test("toggle task back to incomplete", async ({ page }) => {
    const toDoSection = page.locator("section").filter({ hasText: "To Do" })
    await toDoSection.getByRole("button").first().click()
    await expect(page.getByText("Completed", { exact: false })).toBeVisible({ timeout: 5000 })
    const completedSection = page.locator("section").filter({ hasText: "Completed" })
    await completedSection.getByRole("button").first().click()
    await expect(page.getByText("0 / 2").or(page.getByText("0/2"))).toBeVisible()
  })

  test("back to home", async ({ page }) => {
    await page.getByRole("link", { name: /back|Back/i }).first().click()
    await expect(page).toHaveURL("/")
    await expect(page.getByText("Detail Test List")).toBeVisible()
  })
})

test.describe("Day detail - not found", () => {
  test("shows not found for invalid id", async ({ page }) => {
    await page.goto("/day/invalid-id-12345")
    await expect(page.getByText("This list doesn't exist or was deleted.")).toBeVisible()
  })
})
