import type { TaskList, CreateListRequest, UpdateTaskRequest, Task } from '@/lib/api/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options)
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`API error ${res.status}: ${text}`)
  }
  if (res.status === 204) {
    return undefined as T
  }
  return res.json() as Promise<T>
}

export function getLists(): Promise<TaskList[]> {
  return request<TaskList[]>('/lists')
}

export function createList(data: CreateListRequest): Promise<TaskList> {
  return request<TaskList>('/lists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function getList(id: string): Promise<TaskList> {
  return request<TaskList>(`/lists/${id}`)
}

export function updateTask(
  listId: string,
  taskId: string,
  data: UpdateTaskRequest
): Promise<Task> {
  return request<Task>(`/lists/${listId}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function deleteList(id: string): Promise<void> {
  return request<void>(`/lists/${id}`, { method: 'DELETE' })
}
