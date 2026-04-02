import { NextRequest, NextResponse } from 'next/server'
import type { TaskList, UpdateTaskRequest } from '@/lib/api/types'
import { MOCK_LISTS } from '@/lib/api/mock-data'

let lists: TaskList[] = JSON.parse(JSON.stringify(MOCK_LISTS))

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  const { id, taskId } = await params

  const listIndex = lists.findIndex((l) => l.id === id)
  if (listIndex === -1) {
    return NextResponse.json({ error: 'List not found' }, { status: 404 })
  }

  const taskIndex = lists[listIndex].tasks.findIndex((t) => t.id === taskId)
  if (taskIndex === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  const body: UpdateTaskRequest = await request.json()
  const updatedTask = { ...lists[listIndex].tasks[taskIndex] }

  if (body.done !== undefined) {
    updatedTask.done = body.done
  }
  if (body.name !== undefined) {
    updatedTask.name = body.name
  }

  lists[listIndex].tasks[taskIndex] = updatedTask

  return NextResponse.json(updatedTask)
}
