import { test, expect } from "@playwright/test"
import { CreatePage } from "./pages/CreatePage"
import { ListPage } from "./pages/ListPage"
import { DayDetailPage } from "./pages/DayDetailPage"

test.describe("Day detail screen", () => {
  test.beforeEach(async ({ page }) => {
    const createPage = new CreatePage(page)
    await createPage.goto()
    await createPage.fillListName("Detail Test List")
    await createPage.fillTask(0, "Task A")
    await createPage.addTask()
    await createPage.fillTask(1, "Task B")
    await createPage.createListButton.click()
    await expect(page).toHaveURL("/")
    const listPage = new ListPage(page)
    await listPage.goToDayByCardTitle("Detail Test List")
    await expect(page).toHaveURL(/\/day\/[a-f0-9-]+/)
  })

  test("shows list name and tasks with checkboxes", async ({ page }) => {
    const dayDetailPage = new DayDetailPage(page)
    await expect(dayDetailPage.listNameHeading("Detail Test List")).toBeVisible()
    await expect(dayDetailPage.taskText("Task A")).toBeVisible()
    await expect(dayDetailPage.taskText("Task B")).toBeVisible()
    await expect(dayDetailPage.checkboxes).toHaveCount(2)
  })

  test("progress shows count", async ({ page }) => {
    const dayDetailPage = new DayDetailPage(page)
    await expect(
      page.getByText("0 / 2").or(page.getByText("0/2"))
    ).toBeVisible()
  })

  test("toggle task to done moves to completed", async ({ page }) => {
    const dayDetailPage = new DayDetailPage(page)
    await expect(dayDetailPage.toDoHeading).toBeVisible()
    await dayDetailPage.toggleFirstToDo()
    await expect(dayDetailPage.completedHeading).toBeVisible({ timeout: 5000 })
    await expect(dayDetailPage.taskText("Task A")).toBeVisible()
    await expect(
      page.getByText("1 / 2").or(page.getByText("1/2"))
    ).toBeVisible()
  })

  test("toggle task back to incomplete", async ({ page }) => {
    const dayDetailPage = new DayDetailPage(page)
    await dayDetailPage.toggleFirstToDo()
    await expect(dayDetailPage.completedHeading).toBeVisible({ timeout: 5000 })
    await dayDetailPage.toggleFirstCompleted()
    await expect(
      page.getByText("0 / 2").or(page.getByText("0/2"))
    ).toBeVisible()
  })

  test("back to home", async ({ page }) => {
    const dayDetailPage = new DayDetailPage(page)
    await dayDetailPage.goBack()
    await expect(page).toHaveURL("/")
    const listPage = new ListPage(page)
    await expect(listPage.getCardByTitle("Detail Test List")).toBeVisible()
  })
})

test.describe("Day detail - not found", () => {
  test("shows not found for invalid id", async ({ page }) => {
    const dayDetailPage = new DayDetailPage(page)
    await dayDetailPage.gotoInvalid("invalid-id-12345")
    await expect(dayDetailPage.notFoundMessage).toBeVisible()
  })
})
