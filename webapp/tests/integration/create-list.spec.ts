import { test, expect } from '@playwright/test'
import { mockApiLists, captureCreateListRequest, captureRequestDetails } from './helpers/mock-api'

const NEW_LIST_RESPONSE = {
  id: 'new-list-id',
  name: 'Test List',
  date: '2026-04-02',
  tasks: [
    { id: 'new-task-0', name: 'Task 1', done: false },
    { id: 'new-task-1', name: 'Task 2', done: false },
  ],
}

test.describe('Create New List screen', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiLists(page, [])
  })

  test('POST body has exact structure { name, tasks } — no extra fields', async ({ page }) => {
    const requestPromise = captureCreateListRequest(page)

    await page.goto('/create')
    await page.getByTestId('list-name-input').fill('Test List')
    await page.getByTestId('task-form-input').first().fill('Task 1')
    await page.getByTestId('add-task-button').click()
    await page.getByTestId('task-form-input').nth(1).fill('Task 2')
    await page.getByTestId('save-list-button').click()

    const body = await requestPromise

    // toEqual — strict, no extra fields allowed
    expect(body).toEqual({
      name: 'Test List',
      tasks: [{ name: 'Task 1' }, { name: 'Task 2' }],
    })
  })

  test('POST request sends Content-Type: application/json', async ({ page }) => {
    const requestPromise = captureRequestDetails(page, '**/api/lists', 'POST', {
      status: 201,
      body: NEW_LIST_RESPONSE,
    })

    await page.goto('/create')
    await page.getByTestId('list-name-input').fill('Test List')
    await page.getByTestId('save-list-button').click()

    const { headers } = await requestPromise
    expect(headers['content-type']).toContain('application/json')
  })

  test('each task in POST body has only { name } — no id or done fields', async ({ page }) => {
    const requestPromise = captureCreateListRequest(page)

    await page.goto('/create')
    await page.getByTestId('list-name-input').fill('My List')
    await page.getByTestId('task-form-input').first().fill('Task A')
    await page.getByTestId('save-list-button').click()

    const body = await requestPromise as { tasks: unknown[] }

    expect(body.tasks[0]).toEqual({ name: 'Task A' })
    // Must NOT include id or done — those are assigned by the server
    expect(body.tasks[0]).not.toHaveProperty('id')
    expect(body.tasks[0]).not.toHaveProperty('done')
  })

  test('navigates to / after successful POST', async ({ page }) => {
    const requestPromise = captureCreateListRequest(page)
    // After create, GET /api/lists will be called again
    await mockApiLists(page, [NEW_LIST_RESPONSE as never])

    await page.goto('/create')
    await page.getByTestId('list-name-input').fill('Test List')
    await page.getByTestId('save-list-button').click()

    await requestPromise
    await expect(page).toHaveURL('/')
    await expect(page.getByTestId('my-lists-page')).toBeVisible()
  })

  test('does not submit when list name is empty', async ({ page }) => {
    let requestMade = false
    await page.route('**/api/lists', async (route) => {
      if (route.request().method() === 'POST') {
        requestMade = true
        await route.continue()
      } else {
        await route.continue()
      }
    })

    await page.goto('/create')
    await page.getByTestId('save-list-button').click()

    expect(requestMade).toBe(false)
    await expect(page).toHaveURL('/create')
  })

  test('filters out empty tasks before submitting', async ({ page }) => {
    const requestPromise = captureCreateListRequest(page)

    await page.goto('/create')
    await page.getByTestId('list-name-input').fill('My List')
    await page.getByTestId('task-form-input').first().fill('Valid Task')
    await page.getByTestId('add-task-button').click()
    // Leave second task empty

    await page.getByTestId('save-list-button').click()

    const body = await requestPromise as { tasks: unknown[] }

    expect(body.tasks).toHaveLength(1)
    expect(body.tasks[0]).toEqual({ name: 'Valid Task' })
  })
})
