import { test, expect } from "@playwright/test"
import { CreatePage } from "./pages/CreatePage"
import { ListPage } from "./pages/ListPage"

test.describe("Create day screen", () => {
  test("create form visible", async ({ page }) => {
    const createPage = new CreatePage(page)
    await createPage.goto()
    await expect(createPage.listNameLabel).toBeVisible()
    await expect(createPage.createListButton).toBeVisible()
    await expect(createPage.taskInputs.first()).toBeVisible()
  })

  test("Create List button disabled when name empty", async ({ page }) => {
    const createPage = new CreatePage(page)
    await createPage.goto()
    await createPage.fillTask(0, "Only task")
    await expect(createPage.createListButton).toBeDisabled()
  })

  test("Create List button disabled when no tasks", async ({ page }) => {
    const createPage = new CreatePage(page)
    await createPage.goto()
    await createPage.fillListName("Name only")
    await createPage.fillTask(0, "")
    await expect(createPage.createListButton).toBeDisabled()
  })

  test("create list and redirect to home with new list first", async ({ page }) => {
    const createPage = new CreatePage(page)
    await createPage.goto()
    await createPage.fillAndSubmit("E2E List", ["First task"])
    await expect(page).toHaveURL("/")
    const listPage = new ListPage(page)
    await expect(listPage.getCardByTitle("E2E List")).toBeVisible()
    await expect(
      page.getByText("0/1").or(page.getByText("0 / 1"))
    ).toBeVisible()
  })

  test("Add Task adds new input", async ({ page }) => {
    const createPage = new CreatePage(page)
    await createPage.goto()
    await expect(createPage.taskInputs).toHaveCount(1)
    await createPage.addTask()
    await expect(createPage.taskInputs).toHaveCount(2)
  })

  test("back navigation to home", async ({ page }) => {
    const createPage = new CreatePage(page)
    await createPage.goto()
    await createPage.goBack()
    await expect(page).toHaveURL("/")
  })
})
