import { test, expect } from "@playwright/test"
import { ListPage } from "./pages/ListPage"
import { CreatePage } from "./pages/CreatePage"
import { DayDetailPage } from "./pages/DayDetailPage"

test.describe("List of days screen", () => {
  test("shows empty state when no lists", async ({ page }) => {
    const listPage = new ListPage(page)
    await listPage.goto()
    await expect(listPage.emptyStateText).toBeVisible()
    await expect(listPage.newListLink).toBeVisible()
  })

  test("header and New List action visible", async ({ page }) => {
    const listPage = new ListPage(page)
    await listPage.goto()
    await expect(listPage.heading).toBeVisible()
    await expect(listPage.newListLink).toBeVisible()
  })

  test("navigate to create from empty state", async ({ page }) => {
    const listPage = new ListPage(page)
    await listPage.goto()
    await listPage.goToNewList()
    await expect(page).toHaveURL(/\/create/)
  })

  test("lists displayed when data exists and newest first", async ({ page }) => {
    const createPage = new CreatePage(page)
    await createPage.goto()
    await createPage.fillAndSubmit("First List", ["Task one"])
    await expect(page).toHaveURL("/")
    const listPage = new ListPage(page)
    await expect(listPage.getCardByTitle("First List")).toBeVisible()

    await listPage.goToNewList()
    await createPage.fillAndSubmit("Second List", ["Task A"])
    await expect(page).toHaveURL("/")
    await expect(listPage.dayCards.first()).toContainText("Second List")
    await expect(listPage.dayCards.nth(1)).toContainText("First List")
  })

  test("navigate to day detail from card", async ({ page }) => {
    const createPage = new CreatePage(page)
    await createPage.goto()
    await createPage.fillAndSubmit("My Day", ["T1"])
    await expect(page).toHaveURL("/")
    const listPage = new ListPage(page)
    const dayDetailPage = await listPage.goToDayByCardTitle("My Day")
    await expect(page).toHaveURL(/\/day\/[a-f0-9-]+/)
    await expect(dayDetailPage.listNameHeading("My Day")).toBeVisible()
    await expect(dayDetailPage.taskText("T1")).toBeVisible()
  })
})
