/**
 * E2E Navigation Tests
 *
 * These tests run against the real running app with in-memory backend.
 * No API mocking — all requests hit the real Next.js API routes.
 *
 * Exploratory findings (2026-04-04):
 * - Delete list: no button in UI (API exists but no UI trigger)
 * - Edit task: task-edit-* button exists but has no handler (not implemented)
 * - Toggle task: fully implemented and working
 * - Empty state: requires all data cleared — not possible without API reset in e2e
 */
import { test, expect } from '@playwright/test'
import { MyListsPage } from '../integration/page-objects/MyListsPage'
import { CreateListPage } from '../integration/page-objects/CreateListPage'
import { ProgressViewPage } from '../integration/page-objects/ProgressViewPage'

test.describe('E2E Navigation between screens', () => {
  test('navigates to /create when clicking + New List', async ({ page }) => {
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

  test('navigates to Progress View when clicking a day card', async ({ page }) => {
    const myLists = new MyListsPage(page)
    const createList = new CreateListPage(page)
    const progressView = new ProgressViewPage(page)
    const listName = `Nav Card ${Date.now()}`

    await test.step('create a list to ensure data exists', async () => {
      await myLists.open()
      await myLists.clickNewListButton()
      await createList.fillListName(listName)
      await createList.fillTask(0, 'Nav task')
      await createList.submitList()
    })

    await test.step('click the created day card', async () => {
      await myLists.clickDayCardByName(listName)
    })

    await test.step('verify Progress View page is displayed', async () => {
      await progressView.verifyPageVisible()
      await progressView.verifyBackButtonVisible()
    })
  })

  test('navigates back to My Lists from Progress View', async ({ page }) => {
    const myLists = new MyListsPage(page)
    const createList = new CreateListPage(page)
    const progressView = new ProgressViewPage(page)
    const listName = `Nav Back ${Date.now()}`

    await test.step('create a list and open its Progress View', async () => {
      await myLists.open()
      await myLists.clickNewListButton()
      await createList.fillListName(listName)
      await createList.fillTask(0, 'Back nav task')
      await createList.submitList()
      await myLists.clickDayCardByName(listName)
    })

    await test.step('click Back button and verify navigation to My Lists', async () => {
      await progressView.clickBackButton()
    })

    await test.step('verify My Lists page is shown without crash', async () => {
      await myLists.verifyPageDidNotCrash()
    })
  })

  test('full navigation cycle: My Lists → Create → My Lists → Progress View → My Lists', async ({ page }) => {
    const myLists = new MyListsPage(page)
    const createList = new CreateListPage(page)
    const progressView = new ProgressViewPage(page)
    const listName = `Nav Test ${Date.now()}`

    await test.step('open My Lists page', async () => {
      await myLists.open()
    })

    await test.step('navigate to Create New List', async () => {
      await myLists.clickNewListButton()
    })

    await test.step('fill in list name and a task, then save', async () => {
      await createList.fillListName(listName)
      await createList.fillTask(0, 'Navigation task')
      await createList.submitList()
    })

    await test.step('verify new list card is visible on My Lists', async () => {
      await myLists.verifyDayCardWithNameVisible(listName)
    })

    await test.step('click the newly created day card', async () => {
      await myLists.clickDayCardByName(listName)
    })

    await test.step('verify Progress View is displayed with pending tasks', async () => {
      await progressView.verifyPageVisible()
      await progressView.verifyPendingSectionVisible()
    })

    await test.step('click Back and verify return to My Lists', async () => {
      await progressView.clickBackButton()
      await myLists.verifyPageDidNotCrash()
    })
  })

  // Empty state requires clearing all data — not possible in e2e without an API reset endpoint.
  // The in-memory backend seeds data on startup and does not expose a reset route.
  test.skip('navigates to /create from empty state button', async ({ page }) => {
    const myLists = new MyListsPage(page)
    await myLists.open()
    await myLists.clickCreateFirstListButton()
    const createList = new CreateListPage(page)
    await createList.verifyOnCreatePage()
  })
})
