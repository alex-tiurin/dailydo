import { NextRequest, NextResponse } from 'next/server'
import type { TaskList, CreateListRequest } from '@/lib/api/types'
import { MOCK_LISTS } from '@/lib/api/mock-data'

let lists: TaskList[] = JSON.parse(JSON.stringify(MOCK_LISTS))

export function GET() {
  const sorted = [...lists].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  return NextResponse.json(sorted)
}

export async function POST(request: NextRequest) {
  const body: CreateListRequest = await request.json()

  const today = new Date().toISOString().split('T')[0]

  const newList: TaskList = {
    id: crypto.randomUUID(),
    name: body.name,
    date: today,
    tasks: (body.tasks ?? []).map((t) => ({
      id: crypto.randomUUID(),
      name: t.name,
      done: false,
    })),
  }

  lists.unshift(newList)

  return NextResponse.json(newList, { status: 201 })
}
