/**
 * Captures mobile viewport screenshots for design reference (mobile apps).
 * Run: npx playwright test mobile-screenshots.spec.ts
 * Screenshots are saved to design/screenshots/
 */
import path from "path"
import { test, expect } from "@playwright/test"
import { ListPage } from "./pages/ListPage"
import { CreatePage } from "./pages/CreatePage"
import { DayDetailPage } from "./pages/DayDetailPage"

const SCREENSHOTS_DIR = path.resolve(__dirname, "..", "..", "design", "screenshots")

test.describe("Mobile design screenshots", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  })

  test("01 - list empty", async ({ page }) => {
    await page.goto("/")
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState("networkidle")
    await page.getByRole("heading", { name: "Daily Do" }).waitFor({ state: "visible" })
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "01-list-empty.png"),
      fullPage: true,
    })
  })

  test("02 - create form", async ({ page }) => {
    await page.goto("/")
    await page.evaluate(() => localStorage.clear())
    await page.goto("/create")
    await page.waitForLoadState("networkidle")
    await page.getByPlaceholder(/List name|Monday/i).waitFor({ state: "visible" })
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "02-create-form.png"),
      fullPage: true,
    })
  })

  test("03 - list with items and 04-05 day detail", async ({ page }) => {
    await page.goto("/")
    await page.evaluate(() => localStorage.clear())
    const createPage = new CreatePage(page)
    await createPage.goto()
    await createPage.fillAndSubmit("Список на понедельник", ["Купить продукты", "Позвонить маме"])
    await page.waitForURL("/")
    await page.waitForLoadState("networkidle")

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "03-list-with-items.png"),
      fullPage: true,
    })

    const listPage = new ListPage(page)
    const dayDetailPage = await listPage.goToDayByCardTitle("Список на понедельник")
    await page.waitForURL(/\/day\/[a-f0-9-]+/)
    await dayDetailPage.listNameHeading("Список на понедельник").waitFor({ state: "visible" })

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "04-day-detail-todo.png"),
      fullPage: true,
    })

    await dayDetailPage.toggleFirstToDo()
    await expect(dayDetailPage.completedSection).toBeVisible({ timeout: 5000 })

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "05-day-detail-with-completed.png"),
      fullPage: true,
    })
  })
})
