// See docs/user_stories.md — TC-T-01..TC-T-04
//
// E2e Task CRUD tests against the real running app with in-memory backend.
// Toggle moves are verified through compound Step methods
// (toggleTaskToCompleted / toggleTaskToPending) that embed the section-transition
// assertion, so tests don't need to repeat it.
import { test } from '@playwright/test'
import { MyListsPage } from '../page-objects/MyListsPage'
import { CreateListPage } from '../page-objects/CreateListPage'
import { ProgressViewPage } from '../page-objects/ProgressViewPage'

test.describe('E2E Task CRUD', () => {
  test('TC-T-01: creates a list with tasks and verifies tasks appear in Pending section', async ({
    page,
  }) => {
    const myLists = new MyListsPage(page)
    const createList = new CreateListPage(page)
    const progressView = new ProgressViewPage(page)
    const listName = `TC-T-01 ${Date.now()}`

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

    await test.step('save — lands on Progress View for the new list', async () => {
      await createList.submitList()
    })

    await test.step('verify both tasks are in Pending section', async () => {
      await progressView.verifyPendingSectionVisible()
      await progressView.verifyTaskTextVisible('First task')
      await progressView.verifyTaskTextVisible('Second task')
    })
  })

  test('TC-T-02: toggles a pending task to completed and verifies it moves to Completed section', async ({
    page,
  }) => {
    const myLists = new MyListsPage(page)
    const createList = new CreateListPage(page)
    const progressView = new ProgressViewPage(page)
    const listName = `TC-T-02 ${Date.now()}`

    await test.step('create a list with one task — save lands on Progress View', async () => {
      await myLists.open()
      await myLists.clickNewListButton()
      await createList.fillListName(listName)
      await createList.fillTask(0, 'Toggle me')
      await createList.submitList()
    })

    await test.step('verify task is in pending', async () => {
      await progressView.verifyPendingSectionVisible()
      await progressView.verifyTaskTextVisible('Toggle me')
    })

    await test.step('toggle the task to completed and verify move', async () => {
      await progressView.toggleTaskToCompleted('Toggle me')
    })

    await test.step('verify pending section is empty and counter updated', async () => {
      await progressView.verifyPendingSectionNotVisible()
      await progressView.verifyProgressCounter(1, 1)
    })
  })

  test('TC-T-03: toggles a completed task back to pending', async ({ page }) => {
    const myLists = new MyListsPage(page)
    const createList = new CreateListPage(page)
    const progressView = new ProgressViewPage(page)
    const listName = `TC-T-03 ${Date.now()}`

    await test.step('create a list with one task — save lands on Progress View', async () => {
      await myLists.open()
      await myLists.clickNewListButton()
      await createList.fillListName(listName)
      await createList.fillTask(0, 'Toggle back')
      await createList.submitList()
    })

    await test.step('toggle task to completed', async () => {
      await progressView.toggleTaskToCompleted('Toggle back')
      await progressView.verifyPendingSectionNotVisible()
    })

    await test.step('toggle task back to pending', async () => {
      await progressView.toggleTaskToPending('Toggle back')
    })

    await test.step('verify completed section is empty and counter reset', async () => {
      await progressView.verifyCompletedSectionNotVisible()
      await progressView.verifyProgressCounter(0, 1)
    })
  })

  // TC-T-04: task-edit-{id} button exists in the DOM but has no onClick handler —
  // inline rename is NOT implemented in the UI (confirmed during exploratory
  // testing, see docs/user_stories.md). Activate when the handler is wired.
  test.skip('TC-T-04: edits a task name via inline edit', async ({ page }) => {
    const myLists = new MyListsPage(page)
    const createList = new CreateListPage(page)
    const progressView = new ProgressViewPage(page)
    const listName = `TC-T-04 ${Date.now()}`

    await test.step('create a list with a task — save lands on Progress View', async () => {
      await myLists.open()
      await myLists.clickNewListButton()
      await createList.fillListName(listName)
      await createList.fillTask(0, 'Original name')
      await createList.submitList()
    })

    await test.step('click edit button and rename task', async () => {
      await progressView.renameTask('Original name', 'Updated name')
    })

    await test.step('verify new task name is displayed', async () => {
      await progressView.verifyTaskTextVisible('Updated name')
      await progressView.verifyTaskTextNotVisible('Original name')
    })
  })
})
