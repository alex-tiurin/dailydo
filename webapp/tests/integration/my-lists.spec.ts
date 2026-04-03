import { test, expect } from '@playwright/test'
import { mockApiLists, DEFAULT_MOCK_LISTS } from './helpers/mock-api'
import { MyListsPage } from './page-objects/MyListsPage'

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

    const myLists = new MyListsPage(page)
    await myLists.open()
    await myLists.verifyDayCardVisible('mock-list-1')

    expect(requestMade).toBe(true)

    await myLists.verifyDayCardVisible('mock-list-2')
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

    const myLists = new MyListsPage(page)
    await myLists.open()
    await myLists.verifyDayCardVisible('mock-list-1')

    expect(methods).toContain('GET')
    expect(methods.every((m) => m === 'GET')).toBe(true)
  })

  test('renders cards in server-provided order (sort is server responsibility)', async ({ page }) => {
    const outOfOrder = [
      { ...DEFAULT_MOCK_LISTS[0], id: 'older', date: '2026-03-01', name: 'Older List' },
      { ...DEFAULT_MOCK_LISTS[0], id: 'newer', date: '2026-03-27', name: 'Newer List' },
    ]
    await mockApiLists(page, outOfOrder)

    const myLists = new MyListsPage(page)
    await myLists.open()
    await myLists.verifyDayCardVisible('older')
    await myLists.verifyDayCardVisible('newer')
    await myLists.verifyDayCardsOrder(['older', 'newer'])
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

    const myLists = new MyListsPage(page)
    await myLists.open()
    await myLists.verifyEmptyState()
  })

  test('recovers gracefully when API returns 500 — does not crash', async ({ page }) => {
    await page.route('**/api/lists', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 500, body: 'Internal Server Error' })
      } else {
        await route.continue()
      }
    })

    const myLists = new MyListsPage(page)
    await myLists.open()
    await myLists.verifyPageDidNotCrash()
  })

  test('shows progress overview widget when lists exist', async ({ page }) => {
    await mockApiLists(page, DEFAULT_MOCK_LISTS)

    const myLists = new MyListsPage(page)
    await myLists.open()
    await myLists.verifyProgressOverviewVisible()
  })

  test('hides progress overview widget when no lists', async ({ page }) => {
    await mockApiLists(page, [])

    const myLists = new MyListsPage(page)
    await myLists.open()
    await myLists.verifyProgressOverviewHidden()
  })
})
