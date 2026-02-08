import { test, expect } from "@playwright/test"

test.describe("Create day screen", () => {
  test("create form visible", async ({ page }) => {
    await page.goto("/create")
    await expect(page.getByLabel(/List Name/i)).toBeVisible()
    await expect(page.getByRole("button", { name: /Create List/i })).toBeVisible()
    await expect(page.getByPlaceholder(/Describe a task/i).first()).toBeVisible()
  })

  test("Create List button disabled when name empty", async ({ page }) => {
    await page.goto("/create")
    await page.getByPlaceholder(/Describe a task/i).first().fill("Only task")
    await expect(page.getByRole("button", { name: /Create List/i })).toBeDisabled()
  })

  test("Create List button disabled when no tasks", async ({ page }) => {
    await page.goto("/create")
    await page.getByPlaceholder(/Monday Tasks|List name/i).fill("Name only")
    await page.getByPlaceholder(/Describe a task/i).first().fill("")
    await expect(page.getByRole("button", { name: /Create List/i })).toBeDisabled()
  })

  test("create list and redirect to home with new list first", async ({ page }) => {
    await page.goto("/create")
    await page.getByPlaceholder(/Monday Tasks|List name/i).fill("E2E List")
    await page.getByPlaceholder(/Describe a task/i).first().fill("First task")
    await page.getByRole("button", { name: /Create List/i }).click()
    await expect(page).toHaveURL("/")
    await expect(page.getByText("E2E List")).toBeVisible()
    await expect(page.getByText("0/1").or(page.getByText("0 / 1"))).toBeVisible()
  })

  test("Add Task adds new input", async ({ page }) => {
    await page.goto("/create")
    const inputs = page.getByPlaceholder(/Describe a task/i)
    await expect(inputs).toHaveCount(1)
    await page.getByRole("button", { name: /Add Task/i }).click()
    await expect(inputs).toHaveCount(2)
  })

  test("back navigation to home", async ({ page }) => {
    await page.goto("/create")
    await page.getByRole("link", { name: /back|Back/i }).first().click()
    await expect(page).toHaveURL("/")
  })
})
