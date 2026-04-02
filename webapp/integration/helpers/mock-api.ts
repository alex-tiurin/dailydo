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

/**
 * Mock all /api/lists routes with in-memory data.
 * Must be called before page.goto().
 */
export async function mockApiLists(page: Page, lists: MockList[] = DEFAULT_MOCK_LISTS) {
  // GET /api/lists
  await page.route('**/api/lists', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(lists),
      })
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
