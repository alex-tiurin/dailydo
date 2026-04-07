// See docs/user_stories.md — TC-L-01..TC-L-04
//
// E2e List (Day) CRUD tests against the real running app with in-memory backend
// (no API mocking). Tests are independent: each creates a list with a unique
// timestamp-based name to avoid collisions under parallel workers.
import { test } from '@playwright/test'
import { MyListsPage } from '../page-objects/MyListsPage'
import { CreateListPage } from '../page-objects/CreateListPage'
import { ProgressViewPage } from '../page-objects/ProgressViewPage'

test.describe('E2E List (Day) CRUD', () => {
  test('TC-L-01: creates a new list and verifies card appears on My Lists', async ({ page }) => {
    const myLists = new MyListsPage(page)
    const createList = new CreateListPage(page)
    const progressView = new ProgressViewPage(page)
    const listName = `TC-L-01 ${Date.now()}`

    await test.step('open My Lists page', async () => {
      await myLists.open()
    })

    await test.step('navigate to Create New List', async () => {
      await myLists.clickNewListButton()
    })

    await test.step('fill list name and a task, then save', async () => {
      await createList.fillListName(listName)
      await createList.fillTask(0, 'Sample task')
      await createList.submitList()
    })

    await test.step('return to My Lists and verify new day card is visible', async () => {
      await progressView.clickBackButton()
      await myLists.verifyDayCardWithNameVisible(listName)
    })
  })

  test('TC-L-02: shows validation error when saving a list with empty name', async ({ page }) => {
    const myLists = new MyListsPage(page)
    const createList = new CreateListPage(page)

    await test.step('open Create New List page', async () => {
      await myLists.open()
      await myLists.clickNewListButton()
    })

    await test.step('attempt to save without entering a list name', async () => {
      await createList.clickSaveExpectingNoSubmit()
    })

    await test.step('verify still on /create with validation error', async () => {
      await createList.verifyOnCreatePage()
      await createList.verifyValidationError('List name is required')
    })
  })

  // TC-L-03: DELETE /api/lists/:id is implemented on the backend, but the UI has
  // no delete trigger — the pencil icon on DayCard is a decorative img with no
  // onClick handler (confirmed during exploratory testing, see docs/user_stories.md).
  // Activate when a delete UI is added.
  test.skip('TC-L-03: deletes a list and verifies card disappears from My Lists', async ({ page }) => {
    const myLists = new MyListsPage(page)
    const createList = new CreateListPage(page)
    const listName = `TC-L-03 ${Date.now()}`

    await test.step('create a list to delete', async () => {
      await myLists.open()
      await myLists.clickNewListButton()
      await createList.fillListName(listName)
      await createList.submitList()
      await myLists.verifyDayCardWithNameVisible(listName)
    })

    await test.step('delete the list via UI', async () => {
      // Pending: no UI trigger for delete yet.
    })

    await test.step('verify list card is no longer visible', async () => {
      await myLists.verifyListDeleted(listName)
    })
  })

  // TC-L-04: depends on TC-L-03 (delete) plus a backend reset endpoint to
  // guarantee empty state. The in-memory backend seeds on startup and exposes
  // no reset route, so empty state is unreachable from e2e. See docs/user_stories.md.
  test.skip('TC-L-04: shows empty state after deleting the last list', async ({ page }) => {
    const myLists = new MyListsPage(page)

    await test.step('ensure only one list exists and delete it', async () => {
      // Requires delete UI + backend reset.
    })

    await test.step('verify empty state is shown', async () => {
      await myLists.verifyEmptyState()
    })
  })
})
