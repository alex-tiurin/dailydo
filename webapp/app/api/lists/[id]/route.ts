import { NextRequest, NextResponse } from 'next/server'
import type { TaskList } from '@/lib/api/types'
import { MOCK_LISTS } from '@/lib/api/mock-data'

let lists: TaskList[] = JSON.parse(JSON.stringify(MOCK_LISTS))

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const list = lists.find((l) => l.id === id)
  if (!list) {
    return NextResponse.json({ error: 'List not found' }, { status: 404 })
  }
  return NextResponse.json(list)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const index = lists.findIndex((l) => l.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'List not found' }, { status: 404 })
  }

  const body: { name?: string } = await request.json()
  if (body.name !== undefined) {
    lists[index] = { ...lists[index], name: body.name }
  }

  return NextResponse.json(lists[index])
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const index = lists.findIndex((l) => l.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'List not found' }, { status: 404 })
  }

  lists.splice(index, 1)
  return new NextResponse(null, { status: 204 })
}
