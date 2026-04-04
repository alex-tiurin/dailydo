import { Pool } from 'pg'
import { TaskList, Task, CreateListRequest, UpdateTaskRequest } from '../types'

export class ListRepository {
  constructor(private readonly pool: Pool) {}

  async findAll(): Promise<TaskList[]> {
    const listsResult = await this.pool.query<{
      id: string
      name: string
      date: string
    }>('SELECT id, name, date::text FROM lists ORDER BY date DESC, id DESC')

    if (listsResult.rows.length === 0) return []

    const listIds = listsResult.rows.map((r) => r.id)
    const tasksResult = await this.pool.query<{
      id: string
      list_id: string
      name: string
      done: boolean
    }>(
      'SELECT id, list_id, name, done FROM tasks WHERE list_id = ANY($1::uuid[])',
      [listIds],
    )

    const tasksByListId = new Map<string, Task[]>()
    for (const task of tasksResult.rows) {
      const arr = tasksByListId.get(task.list_id) ?? []
      arr.push({ id: task.id, name: task.name, done: task.done })
      tasksByListId.set(task.list_id, arr)
    }

    return listsResult.rows.map((list) => ({
      id: list.id,
      name: list.name,
      date: list.date,
      tasks: tasksByListId.get(list.id) ?? [],
    }))
  }

  async findById(id: string): Promise<TaskList | null> {
    const listResult = await this.pool.query<{
      id: string
      name: string
      date: string
    }>('SELECT id, name, date::text FROM lists WHERE id = $1', [id])

    if (listResult.rows.length === 0) return null

    const list = listResult.rows[0]
    const tasksResult = await this.pool.query<{
      id: string
      name: string
      done: boolean
    }>('SELECT id, name, done FROM tasks WHERE list_id = $1', [id])

    return {
      id: list.id,
      name: list.name,
      date: list.date,
      tasks: tasksResult.rows.map((t) => ({
        id: t.id,
        name: t.name,
        done: t.done,
      })),
    }
  }

  async create(data: CreateListRequest): Promise<TaskList> {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')

      const listResult = await client.query<{
        id: string
        name: string
        date: string
      }>(
        'INSERT INTO lists (name) VALUES ($1) RETURNING id, name, date::text',
        [data.name],
      )
      const list = listResult.rows[0]

      const tasks: Task[] = []
      for (const taskInput of data.tasks) {
        const taskResult = await client.query<{
          id: string
          name: string
          done: boolean
        }>(
          'INSERT INTO tasks (list_id, name) VALUES ($1, $2) RETURNING id, name, done',
          [list.id, taskInput.name],
        )
        tasks.push(taskResult.rows[0])
      }

      await client.query('COMMIT')
      return { id: list.id, name: list.name, date: list.date, tasks }
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  }

  async update(id: string, name: string): Promise<TaskList | null> {
    const result = await this.pool.query<{
      id: string
      name: string
      date: string
    }>(
      'UPDATE lists SET name = $1 WHERE id = $2 RETURNING id, name, date::text',
      [name, id],
    )
    if (result.rows.length === 0) return null

    return this.findById(id)
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.pool.query(
      'DELETE FROM lists WHERE id = $1',
      [id],
    )
    return (result.rowCount ?? 0) > 0
  }

  async updateTask(
    listId: string,
    taskId: string,
    data: UpdateTaskRequest,
  ): Promise<Task | null> {
    const setClauses: string[] = []
    const values: unknown[] = []
    let idx = 1

    if (data.done !== undefined) {
      setClauses.push(`done = $${idx++}`)
      values.push(data.done)
    }
    if (data.name !== undefined) {
      setClauses.push(`name = $${idx++}`)
      values.push(data.name)
    }

    if (setClauses.length === 0) return null

    values.push(taskId)
    values.push(listId)

    const result = await this.pool.query<{
      id: string
      name: string
      done: boolean
    }>(
      `UPDATE tasks SET ${setClauses.join(', ')} WHERE id = $${idx++} AND list_id = $${idx++} RETURNING id, name, done`,
      values,
    )

    if (result.rows.length === 0) return null
    return result.rows[0]
  }
}
