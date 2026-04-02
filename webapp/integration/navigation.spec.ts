import { test, expect } from '@playwright/test'
import { mockApiLists, mockApiList, DEFAULT_MOCK_LISTS } from './helpers/mock-api'

test.describe('Navigation between screens', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiLists(page, DEFAULT_MOCK_LISTS)
    for (const list of DEFAULT_MOCK_LISTS) {
      await mockApiList(page, list)
    }
  })

  test('navigates to /create when clicking "+ New List"', async ({ page }) => {
    await page.goto('/')

    await page.getByTestId('new-list-button').click()

    await expect(page).toHaveURL('/create')
    await expect(page.getByTestId('create-list-page')).toBeVisible()
  })

  test('navigates to /create from empty state button', async ({ page }) => {
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

    await page.getByTestId('create-first-list-button').click()

    await expect(page).toHaveURL('/create')
  })

  test('navigates to /list/:id when clicking a day card', async ({ page }) => {
    const list = DEFAULT_MOCK_LISTS[0]
    await page.goto('/')

    await page.getByTestId(`day-card-${list.id}`).click()

    await expect(page).toHaveURL(`/list/${list.id}`)
    await expect(page.getByTestId('progress-view-page')).toBeVisible()
  })

  test('navigates back to / from Progress View', async ({ page }) => {
    const list = DEFAULT_MOCK_LISTS[0]
    await page.goto(`/list/${list.id}`)

    await page.getByTestId('back-button').click()

    await expect(page).toHaveURL('/')
    await expect(page.getByTestId('my-lists-page')).toBeVisible()
  })
})
