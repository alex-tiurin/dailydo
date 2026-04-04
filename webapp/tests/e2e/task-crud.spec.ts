/**
 * E2E Task CRUD Tests
 *
 * Tests run against the real running app with in-memory backend (no API mocking).
 *
 * Exploratory findings (2026-04-04):
 * - task-edit-* button is present in the DOM but has NO onClick handler — rename is NOT implemented.
 * - Toggle (done/pending) is fully functional.
 */
import { test, expect } from '@playwright/test'
import { MyListsPage } from '../integration/page-objects/MyListsPage'
import { CreateListPage } from '../integration/page-objects/CreateListPage'
import { ProgressViewPage } from '../integration/page-objects/ProgressViewPage'

test.describe('E2E Task CRUD', () => {
  test('creates a list with tasks and verifies tasks appear in Pending section', async ({ page }) => {
    const myLists = new MyListsPage(page)
    const createList = new CreateListPage(page)
    const progressView = new ProgressViewPage(page)
    const listName = `Task CRUD ${Date.now()}`

    await test.step('open My Lists and navigate to Create', async () => {
      await myLists.open()
      await myLists.clickNewListButton()
    })

    await test.step('fill list name and add two tasks', async () => {
      await createList.fillListName(listName)
      await createList.fillTask(0, 'First task')
      await createList.addTask()
      await createList.fillTask(1, 'Second task')
    })

    await test.step('save and verify redirect to My Lists', async () => {
      await createList.submitList()
      await myLists.verifyDayCardWithNameVisible(listName)
    })

    await test.step('open Progress View for the new list', async () => {
      await myLists.clickDayCardByName(listName)
    })

    await test.step('verify both tasks are in Pending section', async () => {
      await progressView.verifyPendingSectionVisible()
      await progressView.verifyTaskTextVisible('First task')
      await progressView.verifyTaskTextVisible('Second task')
    })
  })

  test('toggles a pending task to completed and verifies it moves to Completed section', async ({ page }) => {
    const myLists = new MyListsPage(page)
    const createList = new CreateListPage(page)
    const progressView = new ProgressViewPage(page)
    const listName = `Toggle Pending ${Date.now()}`

    await test.step('create a list with one task', async () => {
      await myLists.open()
      await myLists.clickNewListButton()
      await createList.fillListName(listName)
      await createList.fillTask(0, 'Toggle me')
      await createList.submitList()
    })

    await test.step('open Progress View', async () => {
      await myLists.verifyDayCardWithNameVisible(listName)
      await myLists.clickDayCardByName(listName)
    })

    await test.step('verify task is in pending', async () => {
      await progressView.verifyPendingSectionVisible()
      await progressView.verifyTaskTextVisible('Toggle me')
    })

    await test.step('find and click the task checkbox', async () => {
      const taskId = await progressView.getTaskIdByName('Toggle me')
      await progressView.clickTaskCheckbox(taskId)
    })

    await test.step('verify task moved to Completed and counter updated', async () => {
      await progressView.verifyCompletedSectionVisible()
      await progressView.verifyTaskTextVisible('Toggle me')
      await progressView.verifyPendingSectionNotVisible()
      await progressView.verifyProgressCounter(1, 1)
    })
  })

  test('toggles a completed task back to pending', async ({ page }) => {
    const myLists = new MyListsPage(page)
    const createList = new CreateListPage(page)
    const progressView = new ProgressViewPage(page)
    const listName = `Toggle Back ${Date.now()}`

    await test.step('create a list and toggle task to completed', async () => {
      await myLists.open()
      await myLists.clickNewListButton()
      await createList.fillListName(listName)
      await createList.fillTask(0, 'Toggle back')
      await createList.submitList()
      await myLists.verifyDayCardWithNameVisible(listName)
      await myLists.clickDayCardByName(listName)
    })

    await test.step('toggle task to completed', async () => {
      const taskId = await progressView.getTaskIdByName('Toggle back')
      await progressView.clickTaskCheckbox(taskId)
      await progressView.verifyCompletedSectionVisible()
      await progressView.verifyPendingSectionNotVisible()
    })

    await test.step('toggle task back to pending', async () => {
      const taskId = await progressView.getTaskIdByName('Toggle back')
      await progressView.clickTaskCheckbox(taskId)
    })

    await test.step('verify task returned to Pending section', async () => {
      await progressView.verifyPendingSectionVisible()
      await progressView.verifyTaskTextVisible('Toggle back')
      await progressView.verifyCompletedSectionNotVisible()
      await progressView.verifyProgressCounter(0, 1)
    })
  })

  // Edit task rename is NOT implemented as of exploratory testing (2026-04-04).
  // The task-edit-* button exists in the DOM but has no onClick handler.
  // This test is skipped until the feature is implemented.
  test.skip('edits a task name via inline edit', async ({ page }) => {
    const myLists = new MyListsPage(page)
    const createList = new CreateListPage(page)
    const progressView = new ProgressViewPage(page)
    const listName = `Edit Task ${Date.now()}`

    await test.step('create a list with a task', async () => {
      await myLists.open()
      await myLists.clickNewListButton()
      await createList.fillListName(listName)
      await createList.fillTask(0, 'Original name')
      await createList.submitList()
      await myLists.clickDayCardByName(listName)
    })

    await test.step('click edit button and rename task', async () => {
      const taskId = await progressView.getTaskIdByName('Original name')
      await progressView.renameTask(taskId, 'Updated name')
    })

    await test.step('verify new task name is displayed', async () => {
      await progressView.verifyTaskTextVisible('Updated name')
      await expect(page.getByText('Original name')).not.toBeVisible()
    })
  })
})
