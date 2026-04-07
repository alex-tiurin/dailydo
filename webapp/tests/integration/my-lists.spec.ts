import { test, expect } from '@playwright/test'
import { mockApiLists, mockApiListsError, DEFAULT_MOCK_LISTS } from './helpers/mock-api'
import { MyListsPage } from '../page-objects/MyListsPage'

test.describe('My Lists screen', () => {
  test('sends GET /api/lists on page load and displays day cards', async ({ page }) => {
    const mock = await mockApiLists(page, DEFAULT_MOCK_LISTS)

    const myLists = new MyListsPage(page)
    await myLists.open()
    await myLists.verifyDayCardVisible('Monday Routine')

    expect(mock.calls).toContain('GET')

    await myLists.verifyDayCardVisible('Thursday Sprint')
  })

  test('GET /api/lists uses GET method, not POST or other', async ({ page }) => {
    const mock = await mockApiLists(page, DEFAULT_MOCK_LISTS)

    const myLists = new MyListsPage(page)
    await myLists.open()
    await myLists.verifyDayCardVisible('Monday Routine')

    expect(mock.calls).toContain('GET')
    expect(mock.calls.every((m) => m === 'GET')).toBe(true)
  })

  test('renders cards in server-provided order (sort is server responsibility)', async ({ page }) => {
    const outOfOrder = [
      { ...DEFAULT_MOCK_LISTS[0], id: 'older', date: '2026-03-01', name: 'Older List' },
      { ...DEFAULT_MOCK_LISTS[0], id: 'newer', date: '2026-03-27', name: 'Newer List' },
    ]
    await mockApiLists(page, outOfOrder)

    const myLists = new MyListsPage(page)
    await myLists.open()
    await myLists.verifyDayCardVisible('Older List')
    await myLists.verifyDayCardVisible('Newer List')
    await myLists.verifyDayCardsOrder(['Older List', 'Newer List'])
  })

  test('shows empty state when API returns empty array', async ({ page }) => {
    await mockApiLists(page, [])

    const myLists = new MyListsPage(page)
    await myLists.open()
    await myLists.verifyEmptyState()
  })

  test('recovers gracefully when API returns 500 — does not crash', async ({ page }) => {
    await mockApiListsError(page, 500)

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
