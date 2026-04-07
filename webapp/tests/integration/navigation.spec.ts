import { test } from '@playwright/test'
import { mockApiLists, mockApiList, DEFAULT_MOCK_LISTS } from './helpers/mock-api'
import { MyListsPage } from '../page-objects/MyListsPage'
import { CreateListPage } from '../page-objects/CreateListPage'
import { ProgressViewPage } from '../page-objects/ProgressViewPage'

test.describe('Navigation between screens', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiLists(page, DEFAULT_MOCK_LISTS)
    for (const list of DEFAULT_MOCK_LISTS) {
      await mockApiList(page, list)
    }
  })

  test('navigates to /create when clicking "+ New List"', async ({ page }) => {
    const myLists = new MyListsPage(page)
    await myLists.open()
    await myLists.clickNewListButton()

    const createList = new CreateListPage(page)
    await createList.verifyOnCreatePage()
  })

  test('navigates to /create from empty state button', async ({ page }) => {
    await mockApiLists(page, [])

    const myLists = new MyListsPage(page)
    await myLists.open()
    await myLists.clickCreateFirstListButton()
  })

  test('navigates to /list?id=... when clicking a day card', async ({ page }) => {
    const list = DEFAULT_MOCK_LISTS[0]

    const myLists = new MyListsPage(page)
    await myLists.open()
    await myLists.clickDayCard(list.name)

    const progressView = new ProgressViewPage(page)
    await progressView.verifySectionsVisible()
  })

  test('navigates back to / from Progress View', async ({ page }) => {
    const list = DEFAULT_MOCK_LISTS[0]

    const progressView = new ProgressViewPage(page)
    await progressView.open(list.id)
    await progressView.clickBackButton()

    const myLists = new MyListsPage(page)
    await myLists.verifyPageDidNotCrash()
  })
})
