import { test, expect } from '@playwright/test'
import { mockApiLists, captureCreateListRequest, captureRequestDetails } from './helpers/mock-api'
import { CreateListPage } from '../page-objects/CreateListPage'

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

    const createList = new CreateListPage(page)
    await createList.open()
    await createList.fillListName('Test List')
    await createList.fillTask(0, 'Task 1')
    await createList.addTask()
    await createList.fillTask(1, 'Task 2')
    await createList.submitList()

    const body = await requestPromise
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

    const createList = new CreateListPage(page)
    await createList.open()
    await createList.fillListName('Test List')
    await createList.submitList()

    const { headers } = await requestPromise
    expect(headers['content-type']).toContain('application/json')
  })

  test('each task in POST body has only { name } — no id or done fields', async ({ page }) => {
    const requestPromise = captureCreateListRequest(page)

    const createList = new CreateListPage(page)
    await createList.open()
    await createList.fillListName('My List')
    await createList.fillTask(0, 'Task A')
    await createList.submitList()

    const body = await requestPromise as { tasks: unknown[] }
    expect(body.tasks[0]).toEqual({ name: 'Task A' })
    expect(body.tasks[0]).not.toHaveProperty('id')
    expect(body.tasks[0]).not.toHaveProperty('done')
  })

  test('navigates to /list?id=<newId> after successful POST', async ({ page }) => {
    const requestPromise = captureCreateListRequest(page)
    await mockApiLists(page, [NEW_LIST_RESPONSE as never])

    const createList = new CreateListPage(page)
    await createList.open()
    await createList.fillListName('Test List')
    await createList.submitList()

    await requestPromise
    await expect(page).toHaveURL(/\/list\?id=.+$/)
  })

  test('does not submit when list name is empty', async ({ page }) => {
    const mock = await mockApiLists(page, [])

    const createList = new CreateListPage(page)
    await createList.open()
    await createList.clickSaveExpectingNoSubmit()

    expect(mock.calls).not.toContain('POST')
  })

  test('filters out empty tasks before submitting', async ({ page }) => {
    const requestPromise = captureCreateListRequest(page)

    const createList = new CreateListPage(page)
    await createList.open()
    await createList.fillListName('My List')
    await createList.fillTask(0, 'Valid Task')
    await createList.addTask()
    // Leave second task empty
    await createList.submitList()

    const body = await requestPromise as { tasks: unknown[] }
    expect(body.tasks).toHaveLength(1)
    expect(body.tasks[0]).toEqual({ name: 'Valid Task' })
  })
})
