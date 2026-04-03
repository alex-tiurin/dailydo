import { test, expect } from '@playwright/test'
import { mockApiLists, DEFAULT_MOCK_LISTS } from './helpers/mock-api'

test.describe('My Lists screen', () => {
  test('sends GET /api/lists on page load and displays day cards', async ({ page }) => {
    let requestMade = false
    await page.route('**/api/lists', async (route) => {
      if (route.request().method() === 'GET') {
        requestMade = true
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(DEFAULT_MOCK_LISTS),
        })
      } else {
        await route.continue()
      }
    })

    await page.goto('/')

    // Wait for UI to render from the mocked response
    await expect(page.getByTestId('day-card-mock-list-1')).toBeVisible()

    // By now the request was definitely made
    expect(requestMade).toBe(true)
    await expect(page.getByTestId('day-card-mock-list-2')).toBeVisible()
  })

  test('GET /api/lists uses GET method, not POST or other', async ({ page }) => {
    const methods: string[] = []
    await page.route('**/api/lists', async (route) => {
      methods.push(route.request().method())
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(DEFAULT_MOCK_LISTS),
      })
    })

    await page.goto('/')
    await expect(page.getByTestId('day-card-mock-list-1')).toBeVisible()

    expect(methods).toContain('GET')
    expect(methods.every((m) => m === 'GET')).toBe(true)
  })

  test('renders cards in server-provided order (sort is server responsibility)', async ({ page }) => {
    // Server returns oldest first — UI must render in that exact order without re-sorting
    const outOfOrder = [
      { ...DEFAULT_MOCK_LISTS[0], id: 'older', date: '2026-03-01', name: 'Older List' },
      { ...DEFAULT_MOCK_LISTS[0], id: 'newer', date: '2026-03-27', name: 'Newer List' },
    ]
    await mockApiLists(page, outOfOrder)
    await page.goto('/')

    await expect(page.getByTestId('day-card-older')).toBeVisible()
    await expect(page.getByTestId('day-card-newer')).toBeVisible()

    // Use CSS attribute selector to exclude progress-bar testids (day-card-progress-*)
    const cards = page.locator('[data-testid^="day-card-"]:not([data-testid^="day-card-progress"])')
    await expect(cards.nth(0)).toHaveAttribute('data-testid', 'day-card-older')
    await expect(cards.nth(1)).toHaveAttribute('data-testid', 'day-card-newer')
  })

  test('shows empty state when API returns empty array', async ({ page }) => {
    await page.route('**/api/lists', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        })
      } else {
        await route.continue()
      }
    })

    await page.goto('/')

    await expect(page.getByTestId('empty-state')).toBeVisible()
    await expect(page.getByTestId('create-first-list-button')).toBeVisible()
    await expect(page.getByText('No data yet')).toBeVisible()
  })

  test('recovers gracefully when API returns 500 — does not crash', async ({ page }) => {
    await page.route('**/api/lists', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 500, body: 'Internal Server Error' })
      } else {
        await route.continue()
      }
    })

    await page.goto('/')

    // Page must render — navbar and page container must be present
    await expect(page.getByTestId('navbar')).toBeVisible()
    await expect(page.getByTestId('my-lists-page')).toBeVisible()
    // No unhandled crash (no Next.js error overlay)
    await expect(page.locator('nextjs-portal')).not.toBeVisible()
  })

  test('shows progress overview widget when lists exist', async ({ page }) => {
    await mockApiLists(page, DEFAULT_MOCK_LISTS)
    await page.goto('/')

    await expect(page.getByTestId('progress-overview')).toBeVisible()
  })

  test('hides progress overview widget when no lists', async ({ page }) => {
    await mockApiLists(page, [])
    await page.goto('/')

    await expect(page.getByTestId('progress-overview')).not.toBeVisible()
  })
})
