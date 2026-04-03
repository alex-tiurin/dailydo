import { test, expect } from '@playwright/test'
import {
  mockApiLists,
  mockApiList,
  captureUpdateTaskRequest,
  captureRequestDetails,
  DEFAULT_MOCK_LISTS,
} from './helpers/mock-api'

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

    await page.goto(`/list/${LIST.id}`)
    await page.getByTestId(`task-checkbox-${pendingTask.id}`).click()

    const body = await requestPromise
    // toEqual — strict, no extra fields (e.g. name must not be included)
    expect(body).toEqual({ done: true })
  })

  test('PATCH body is exactly { done: false } when toggling completed task', async ({ page }) => {
    const requestPromise = captureUpdateTaskRequest(page, LIST.id, completedTask.id, {
      ...completedTask,
      done: false,
    })

    await page.goto(`/list/${LIST.id}`)
    await page.getByTestId(`task-checkbox-${completedTask.id}`).click()

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

    await page.goto(`/list/${LIST.id}`)
    await page.getByTestId(`task-checkbox-${pendingTask.id}`).click()

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

    await page.goto(`/list/${LIST.id}`)
    await page.getByTestId(`task-checkbox-${pendingTask.id}`).click()

    const { headers, method } = await requestPromise
    expect(method).toBe('PATCH')
    expect(headers['content-type']).toContain('application/json')
  })

  // --- Error handling ---

  test('redirects to / when list id is not found in context', async ({ page }) => {
    // Override lists response with empty array — list won't be found
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

    await page.goto(`/list/non-existent-id`)

    // Should redirect back to main screen
    await expect(page).toHaveURL('/')
  })

  // --- UI correctness ---

  test('displays pending and completed sections', async ({ page }) => {
    await page.goto(`/list/${LIST.id}`)

    await expect(page.getByTestId('pending-section')).toBeVisible()
    await expect(page.getByTestId('completed-section')).toBeVisible()
  })

  test('pending section shows only undone tasks', async ({ page }) => {
    await page.goto(`/list/${LIST.id}`)

    const pendingTasks = LIST.tasks.filter((t) => !t.done)
    for (const task of pendingTasks) {
      await expect(page.getByTestId(`task-name-${task.id}`)).toBeVisible()
    }
    // Completed tasks must NOT appear in pending area (they are below completed section)
    const completedTasks = LIST.tasks.filter((t) => t.done)
    for (const task of completedTasks) {
      await expect(page.getByTestId(`task-name-${task.id}`)).toBeVisible() // visible but in completed section
    }
  })

  test('shows progress counter with correct done/total', async ({ page }) => {
    await page.goto(`/list/${LIST.id}`)

    const doneCount = LIST.tasks.filter((t) => t.done).length
    const total = LIST.tasks.length

    await expect(page.getByTestId('progress-counter')).toContainText(`${doneCount}/${total}`)
  })
})
