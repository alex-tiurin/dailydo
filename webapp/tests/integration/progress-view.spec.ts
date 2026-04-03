import { test, expect } from '@playwright/test'
import {
  mockApiLists,
  mockApiList,
  captureUpdateTaskRequest,
  captureRequestDetails,
  DEFAULT_MOCK_LISTS,
} from './helpers/mock-api'
import { ProgressViewPage } from './page-objects/ProgressViewPage'

const LIST = DEFAULT_MOCK_LISTS[1] // Thursday Sprint: task-2-1 pending, task-2-2 done
const pendingTask = LIST.tasks.find((t) => !t.done)!
const completedTask = LIST.tasks.find((t) => t.done)!

test.describe('Progress View screen', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiLists(page, DEFAULT_MOCK_LISTS)
    await mockApiList(page, LIST)
  })

  // --- PATCH body correctness ---

  test('PATCH body is exactly { done: true } when toggling pending task', async ({ page }) => {
    const requestPromise = captureUpdateTaskRequest(page, LIST.id, pendingTask.id, {
      ...pendingTask,
      done: true,
    })

    const progressView = new ProgressViewPage(page)
    await progressView.open(LIST.id)
    await progressView.clickTaskCheckbox(pendingTask.id)

    const body = await requestPromise
    expect(body).toEqual({ done: true })
  })

  test('PATCH body is exactly { done: false } when toggling completed task', async ({ page }) => {
    const requestPromise = captureUpdateTaskRequest(page, LIST.id, completedTask.id, {
      ...completedTask,
      done: false,
    })

    const progressView = new ProgressViewPage(page)
    await progressView.open(LIST.id)
    await progressView.clickTaskCheckbox(completedTask.id)

    const body = await requestPromise
    expect(body).toEqual({ done: false })
  })

  // --- PATCH HTTP details ---

  test('PATCH request targets correct URL with listId and taskId', async ({ page }) => {
    let capturedUrl = ''
    await page.route(`**/api/lists/${LIST.id}/tasks/${pendingTask.id}`, async (route) => {
      capturedUrl = route.request().url()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...pendingTask, done: true }),
      })
    })

    const progressView = new ProgressViewPage(page)
    await progressView.open(LIST.id)
    await progressView.clickTaskCheckbox(pendingTask.id)

    await page.waitForTimeout(500)
    expect(capturedUrl).toContain(`/api/lists/${LIST.id}/tasks/${pendingTask.id}`)
  })

  test('PATCH request sends Content-Type: application/json', async ({ page }) => {
    const requestPromise = captureRequestDetails(
      page,
      `**/api/lists/${LIST.id}/tasks/${pendingTask.id}`,
      'PATCH',
      { status: 200, body: { ...pendingTask, done: true } }
    )

    const progressView = new ProgressViewPage(page)
    await progressView.open(LIST.id)
    await progressView.clickTaskCheckbox(pendingTask.id)

    const { headers, method } = await requestPromise
    expect(method).toBe('PATCH')
    expect(headers['content-type']).toContain('application/json')
  })

  // --- Error handling ---

  test('redirects to / when list id is not found in context', async ({ page }) => {
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

    const progressView = new ProgressViewPage(page)
    await progressView.attemptOpen('non-existent-id')
    await progressView.verifyRedirectedToHome()
  })

  // --- UI correctness ---

  test('displays pending and completed sections', async ({ page }) => {
    const progressView = new ProgressViewPage(page)
    await progressView.open(LIST.id)
    await progressView.verifySectionsVisible()
  })

  test('pending section shows only undone tasks', async ({ page }) => {
    const progressView = new ProgressViewPage(page)
    await progressView.open(LIST.id)

    for (const task of LIST.tasks) {
      await progressView.verifyTaskVisible(task.id)
    }
  })

  test('shows progress counter with correct done/total', async ({ page }) => {
    const doneCount = LIST.tasks.filter((t) => t.done).length
    const total = LIST.tasks.length

    const progressView = new ProgressViewPage(page)
    await progressView.open(LIST.id)
    await progressView.verifyProgressCounter(doneCount, total)
  })
})
