/**
 * E2E List (Day) CRUD Tests
 *
 * Tests run against the real running app with in-memory backend (no API mocking).
 *
 * Exploratory findings (2026-04-04):
 * - Delete list: API (DELETE /api/lists/:id) is implemented, but NO UI button exists.
 *   The pencil icon on DayCard is a decorative img with no onClick handler.
 *   Delete tests are skipped until a UI trigger is added.
 */
import { test, expect } from '@playwright/test'
import { MyListsPage } from '../integration/page-objects/MyListsPage'
import { CreateListPage } from '../integration/page-objects/CreateListPage'

test.describe('E2E List (Day) CRUD', () => {
  test('creates a new list and verifies card appears on My Lists', async ({ page }) => {
    const myLists = new MyListsPage(page)
    const createList = new CreateListPage(page)
    const listName = `New Day ${Date.now()}`

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

    await test.step('verify new day card is visible on My Lists', async () => {
      await myLists.verifyDayCardWithNameVisible(listName)
    })
  })

  test('shows validation error when saving a list with empty name', async ({ page }) => {
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

  // Delete list: the API endpoint (DELETE /api/lists/:id) exists and is functional,
  // but there is NO delete button in the UI as of exploratory testing (2026-04-04).
  // The pencil icon on DayCard is a decorative img element without an onClick handler.
  // These tests are skipped until a delete UI trigger is implemented.
  test.skip('deletes a list and verifies card disappears from My Lists', async ({ page }) => {
    const myLists = new MyListsPage(page)
    const createList = new CreateListPage(page)
    const listName = `Delete Me ${Date.now()}`

    await test.step('create a list to delete', async () => {
      await myLists.open()
      await myLists.clickNewListButton()
      await createList.fillListName(listName)
      await createList.submitList()
      await myLists.verifyDayCardWithNameVisible(listName)
    })

    await test.step('delete the list via UI', async () => {
      // TODO: implement when delete button is added to DayCard or context menu
      // await myLists.deleteList(listName)
    })

    await test.step('verify list card is no longer visible', async () => {
      await myLists.verifyListDeleted(listName)
    })
  })

  // Also skipped — requires delete to be implemented first
  test.skip('shows empty state after deleting the last list', async ({ page }) => {
    const myLists = new MyListsPage(page)

    await test.step('ensure only one list exists and delete it', async () => {
      // Requires delete UI to be implemented
    })

    await test.step('verify empty state is shown', async () => {
      await myLists.verifyEmptyState()
    })
  })
})
