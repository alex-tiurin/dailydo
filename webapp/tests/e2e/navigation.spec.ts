// See docs/user_stories.md — TC-N-01..TC-N-05
//
// E2e navigation tests against the real running app with in-memory backend.
// No API mocking — all requests hit the real Next.js API routes.
import { test } from '@playwright/test'
import { MyListsPage } from '../page-objects/MyListsPage'
import { CreateListPage } from '../page-objects/CreateListPage'
import { ProgressViewPage } from '../page-objects/ProgressViewPage'

test.describe('E2E Navigation between screens', () => {
  test('TC-N-01: navigates to /create when clicking + New List', async ({ page }) => {
    const myLists = new MyListsPage(page)

    await test.step('open My Lists page', async () => {
      await myLists.open()
    })

    await test.step('click + New List button and verify navigation to /create', async () => {
      await myLists.clickNewListButton()
    })

    await test.step('verify Create List page is displayed', async () => {
      const createList = new CreateListPage(page)
      await createList.verifyOnCreatePage()
    })
  })

  test('TC-N-02: navigates to Progress View when clicking a day card', async ({ page }) => {
    const myLists = new MyListsPage(page)
    const createList = new CreateListPage(page)
    const progressView = new ProgressViewPage(page)
    const listName = `TC-N-02 ${Date.now()}`

    await test.step('create a list and return to My Lists', async () => {
      await myLists.open()
      await myLists.clickNewListButton()
      await createList.fillListName(listName)
      await createList.fillTask(0, 'Nav task')
      await createList.submitList()
      await progressView.clickBackButton()
    })

    await test.step('click the created day card', async () => {
      await myLists.clickDayCardByName(listName)
    })

    await test.step('verify Progress View page is displayed', async () => {
      await progressView.verifyPageVisible()
      await progressView.verifyBackButtonVisible()
    })
  })

  test('TC-N-03: navigates back to My Lists from Progress View', async ({ page }) => {
    const myLists = new MyListsPage(page)
    const createList = new CreateListPage(page)
    const progressView = new ProgressViewPage(page)
    const listName = `TC-N-03 ${Date.now()}`

    await test.step('create a list — save lands on Progress View', async () => {
      await myLists.open()
      await myLists.clickNewListButton()
      await createList.fillListName(listName)
      await createList.fillTask(0, 'Back nav task')
      await createList.submitList()
    })

    await test.step('click Back button and verify navigation to My Lists', async () => {
      await progressView.clickBackButton()
    })

    await test.step('verify My Lists page is shown without crash', async () => {
      await myLists.verifyPageDidNotCrash()
    })
  })

  test('TC-N-04: full navigation cycle — My Lists → Create → Progress View → My Lists → Progress View → My Lists', async ({
    page,
  }) => {
    const myLists = new MyListsPage(page)
    const createList = new CreateListPage(page)
    const progressView = new ProgressViewPage(page)
    const listName = `TC-N-04 ${Date.now()}`

    await test.step('open My Lists page', async () => {
      await myLists.open()
    })

    await test.step('navigate to Create New List', async () => {
      await myLists.clickNewListButton()
    })

    await test.step('fill in list name and a task, then save — lands on Progress View', async () => {
      await createList.fillListName(listName)
      await createList.fillTask(0, 'Navigation task')
      await createList.submitList()
      await progressView.verifyPageVisible()
      await progressView.verifyPendingSectionVisible()
    })

    await test.step('click Back — return to My Lists and verify new card is visible', async () => {
      await progressView.clickBackButton()
      await myLists.verifyDayCardWithNameVisible(listName)
    })

    await test.step('click day card to open Progress View again', async () => {
      await myLists.clickDayCardByName(listName)
      await progressView.verifyPageVisible()
    })

    await test.step('click Back and return to My Lists', async () => {
      await progressView.clickBackButton()
      await myLists.verifyPageDidNotCrash()
    })
  })

  // TC-N-05: empty state requires a pristine backend state, but the in-memory
  // backend seeds data on startup and exposes no reset endpoint — so empty
  // state is unreachable from e2e. See docs/user_stories.md.
  test.skip('TC-N-05: navigates to /create from empty state button', async ({ page }) => {
    const myLists = new MyListsPage(page)
    await myLists.open()
    await myLists.clickCreateFirstListButton()
    const createList = new CreateListPage(page)
    await createList.verifyOnCreatePage()
  })
})
