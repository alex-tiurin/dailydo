import { getApp, cleanDatabase, closeAll } from './helpers'

beforeEach(async () => {
  await cleanDatabase()
})

afterAll(async () => {
  await closeAll()
})

describe('GET /api/lists', () => {
  it('returns empty array when no lists exist', async () => {
    const app = await getApp()
    const res = await app.inject({ method: 'GET', url: '/api/lists' })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual([])
  })

  it('returns all lists with correct fields', async () => {
    const app = await getApp()
    await app.inject({
      method: 'POST',
      url: '/api/lists',
      headers: { 'content-type': 'application/json' },
      payload: { name: 'List A', tasks: [{ name: 'Task 1' }] },
    })
    await app.inject({
      method: 'POST',
      url: '/api/lists',
      headers: { 'content-type': 'application/json' },
      payload: { name: 'List B', tasks: [] },
    })

    const res = await app.inject({ method: 'GET', url: '/api/lists' })
    expect(res.statusCode).toBe(200)
    const lists = res.json()
    expect(lists).toHaveLength(2)
    const names = lists.map((l: { name: string }) => l.name)
    expect(names).toContain('List A')
    expect(names).toContain('List B')
    // All lists must have required fields
    for (const list of lists) {
      expect(list.id).toBeDefined()
      expect(list.date).toBeDefined()
      expect(Array.isArray(list.tasks)).toBe(true)
    }
  })
})

describe('POST /api/lists', () => {
  it('creates a new list and returns 201', async () => {
    const app = await getApp()
    const res = await app.inject({
      method: 'POST',
      url: '/api/lists',
      headers: { 'content-type': 'application/json' },
      payload: {
        name: 'Morning Routine',
        tasks: [{ name: 'Wake up early' }, { name: 'Meditate' }],
      },
    })
    expect(res.statusCode).toBe(201)
    const list = res.json()
    expect(list.id).toBeDefined()
    expect(list.name).toBe('Morning Routine')
    expect(list.date).toBeDefined()
    expect(list.tasks).toHaveLength(2)
    expect(list.tasks[0].done).toBe(false)
    expect(list.tasks[0].id).toBeDefined()
  })

  it('returns 400 when name is missing', async () => {
    const app = await getApp()
    const res = await app.inject({
      method: 'POST',
      url: '/api/lists',
      headers: { 'content-type': 'application/json' },
      payload: { tasks: [] },
    })
    expect(res.statusCode).toBe(400)
  })
})

describe('GET /api/lists/:id', () => {
  it('returns the list when found', async () => {
    const app = await getApp()
    const createRes = await app.inject({
      method: 'POST',
      url: '/api/lists',
      headers: { 'content-type': 'application/json' },
      payload: { name: 'My List', tasks: [{ name: 'Do something' }] },
    })
    const created = createRes.json()

    const res = await app.inject({
      method: 'GET',
      url: `/api/lists/${created.id}`,
    })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toMatchObject({ id: created.id, name: 'My List' })
  })

  it('returns 404 when list does not exist', async () => {
    const app = await getApp()
    const res = await app.inject({
      method: 'GET',
      url: '/api/lists/00000000-0000-0000-0000-000000000000',
    })
    expect(res.statusCode).toBe(404)
  })
})

describe('PUT /api/lists/:id', () => {
  it('updates the list name and returns 200', async () => {
    const app = await getApp()
    const createRes = await app.inject({
      method: 'POST',
      url: '/api/lists',
      headers: { 'content-type': 'application/json' },
      payload: { name: 'Original', tasks: [] },
    })
    const created = createRes.json()

    const res = await app.inject({
      method: 'PUT',
      url: `/api/lists/${created.id}`,
      headers: { 'content-type': 'application/json' },
      payload: { name: 'Updated' },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().name).toBe('Updated')
  })

  it('returns 404 when list does not exist', async () => {
    const app = await getApp()
    const res = await app.inject({
      method: 'PUT',
      url: '/api/lists/00000000-0000-0000-0000-000000000000',
      headers: { 'content-type': 'application/json' },
      payload: { name: 'Updated' },
    })
    expect(res.statusCode).toBe(404)
  })
})

describe('DELETE /api/lists/:id', () => {
  it('deletes the list and returns 204', async () => {
    const app = await getApp()
    const createRes = await app.inject({
      method: 'POST',
      url: '/api/lists',
      headers: { 'content-type': 'application/json' },
      payload: { name: 'To Delete', tasks: [] },
    })
    const created = createRes.json()

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/lists/${created.id}`,
    })
    expect(res.statusCode).toBe(204)

    // Verify deleted
    const getRes = await app.inject({
      method: 'GET',
      url: `/api/lists/${created.id}`,
    })
    expect(getRes.statusCode).toBe(404)
  })

  it('returns 404 when list does not exist', async () => {
    const app = await getApp()
    const res = await app.inject({
      method: 'DELETE',
      url: '/api/lists/00000000-0000-0000-0000-000000000000',
    })
    expect(res.statusCode).toBe(404)
  })
})

describe('PATCH /api/lists/:id/tasks/:taskId', () => {
  async function createListWithTask() {
    const app = await getApp()
    const res = await app.inject({
      method: 'POST',
      url: '/api/lists',
      headers: { 'content-type': 'application/json' },
      payload: { name: 'Test List', tasks: [{ name: 'Test Task' }] },
    })
    const list = res.json()
    return { app, listId: list.id, taskId: list.tasks[0].id }
  }

  it('toggles task done to true', async () => {
    const { app, listId, taskId } = await createListWithTask()
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/lists/${listId}/tasks/${taskId}`,
      headers: { 'content-type': 'application/json' },
      payload: { done: true },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().done).toBe(true)
  })

  it('edits task name', async () => {
    const { app, listId, taskId } = await createListWithTask()
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/lists/${listId}/tasks/${taskId}`,
      headers: { 'content-type': 'application/json' },
      payload: { name: 'Updated Task Name' },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().name).toBe('Updated Task Name')
  })

  it('returns 404 when task does not exist', async () => {
    const { app, listId } = await createListWithTask()
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/lists/${listId}/tasks/00000000-0000-0000-0000-000000000000`,
      headers: { 'content-type': 'application/json' },
      payload: { done: true },
    })
    expect(res.statusCode).toBe(404)
  })
})
