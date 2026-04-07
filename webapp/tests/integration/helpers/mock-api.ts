import type { Page } from '@playwright/test'

export interface MockTask {
  id: string
  name: string
  done: boolean
}

export interface MockList {
  id: string
  name: string
  date: string
  tasks: MockTask[]
}

export const DEFAULT_MOCK_LISTS: MockList[] = [
  {
    id: 'mock-list-1',
    name: 'Monday Routine',
    date: '2026-03-24',
    tasks: [
      { id: 'task-1-1', name: 'Morning workout', done: true },
      { id: 'task-1-2', name: 'Read 20 pages', done: false },
    ],
  },
  {
    id: 'mock-list-2',
    name: 'Thursday Sprint',
    date: '2026-03-27',
    tasks: [
      { id: 'task-2-1', name: 'Review pull requests', done: false },
      { id: 'task-2-2', name: 'Prepare demo', done: true },
      { id: 'task-2-3', name: 'Send weekly report', done: false },
    ],
  },
]

export interface ApiListsRecorder {
  /** All HTTP methods observed on **\/api/lists since the mock was installed */
  calls: string[]
}

/**
 * Mock all /api/lists routes with in-memory data.
 * Must be called before page.goto().
 *
 * Returns a recorder whose `calls` array contains every HTTP method observed
 * on the `**\/api/lists` endpoint — useful for asserting that a request was
 * (or was not) made without leaking raw `page.route` calls into tests.
 */
export async function mockApiLists(
  page: Page,
  lists: MockList[] = DEFAULT_MOCK_LISTS
): Promise<ApiListsRecorder> {
  const calls: string[] = []
  await page.route('**/api/lists', async (route) => {
    const method = route.request().method()
    calls.push(method)
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(lists),
      })
    } else {
      await route.fallback()
    }
  })
  return { calls }
}

/**
 * Mock GET /api/lists to return an HTTP error (default 500).
 * Non-GET requests fall back to the default handler.
 */
export async function mockApiListsError(page: Page, status: number = 500): Promise<void> {
  await page.route('**/api/lists', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status, body: 'Internal Server Error' })
    } else {
      await route.fallback()
    }
  })
}

/**
 * Mock POST /api/lists and capture the request body.
 * Returns a promise that resolves with the request body when the request is made.
 */
export function captureCreateListRequest(page: Page): Promise<unknown> {
  return new Promise((resolve) => {
    page.route('**/api/lists', async (route) => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON()
        resolve(body)
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'new-list-id',
            name: body?.name ?? 'New List',
            date: '2026-04-02',
            tasks: (body?.tasks ?? []).map((t: { name: string }, i: number) => ({
              id: `new-task-${i}`,
              name: t.name,
              done: false,
            })),
          }),
        })
      } else {
        await route.fallback()
      }
    })
  })
}

/**
 * Mock GET /api/lists/:id for a single list.
 */
export async function mockApiList(page: Page, list: MockList) {
  await page.route(`**/api/lists/${list.id}`, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(list),
      })
    } else {
      await route.fallback()
    }
  })
}

/**
 * Mock PATCH /api/lists/:listId/tasks/:taskId and capture the request body.
 */
export function captureUpdateTaskRequest(
  page: Page,
  listId: string,
  taskId: string,
  updatedTask: MockTask
): Promise<unknown> {
  return new Promise((resolve) => {
    page.route(`**/api/lists/${listId}/tasks/${taskId}`, async (route) => {
      if (route.request().method() === 'PATCH') {
        const body = route.request().postDataJSON()
        resolve(body)
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(updatedTask),
        })
      } else {
        await route.fallback()
      }
    })
  })
}

export interface CapturedRequest {
  body: unknown
  headers: Record<string, string>
  method: string
  url: string
}

/**
 * Capture full request details (body + headers + method) for any route pattern.
 */
export function captureRequestDetails(
  page: Page,
  urlPattern: string,
  method: string,
  fulfillWith: { status: number; body: unknown }
): Promise<CapturedRequest> {
  return new Promise((resolve) => {
    page.route(urlPattern, async (route) => {
      if (route.request().method() === method) {
        const captured: CapturedRequest = {
          body: route.request().postDataJSON(),
          headers: await route.request().allHeaders(),
          method: route.request().method(),
          url: route.request().url(),
        }
        resolve(captured)
        await route.fulfill({
          status: fulfillWith.status,
          contentType: 'application/json',
          body: JSON.stringify(fulfillWith.body),
        })
      } else {
        await route.fallback()
      }
    })
  })
}
