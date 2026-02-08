/**
 * API client for Daily Do server.
 * Use when NEXT_PUBLIC_API_URL is set (server running in parallel).
 * Maps server shape (label, done) to webapp shape (text, completed).
 */

export type Task = {
  id: string
  text: string
  completed: boolean
}

export type DayList = {
  id: string
  name: string
  createdAt: string
  tasks: Task[]
}

function getBaseUrl(): string {
  if (typeof window === "undefined") return ""
  return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")
}

function mapTaskFromApi(t: { id: string; label: string; done: boolean }): Task {
  return { id: t.id, text: t.label, completed: t.done }
}

function mapTaskToApi(t: Task): { id: string; label: string; done: boolean } {
  return { id: t.id, label: t.text, done: t.completed }
}

function mapDayFromApi(d: { id: string; name: string; createdAt: string; tasks: Array<{ id: string; label: string; done: boolean }> }): DayList {
  return {
    id: d.id,
    name: d.name,
    createdAt: d.createdAt,
    tasks: (d.tasks || []).map(mapTaskFromApi),
  }
}

export async function getDays(): Promise<DayList[]> {
  const base = getBaseUrl()
  if (!base) return []
  const res = await fetch(`${base}/days`)
  if (!res.ok) throw new Error(await res.text())
  const data = await res.json()
  return (data || []).map(mapDayFromApi)
}

export async function createDay(name: string, taskTexts: string[]): Promise<DayList> {
  const base = getBaseUrl()
  if (!base) throw new Error("NEXT_PUBLIC_API_URL is not set")
  const tasks = taskTexts.filter((t) => t.trim().length > 0).map((label) => ({ label: label.trim(), done: false }))
  const res = await fetch(`${base}/days`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name.trim(), tasks }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || res.statusText)
  }
  const data = await res.json()
  return mapDayFromApi(data)
}

export async function getDay(id: string): Promise<DayList | null> {
  const base = getBaseUrl()
  if (!base) return null
  const res = await fetch(`${base}/days/${id}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(await res.text())
  const data = await res.json()
  return mapDayFromApi(data)
}

export async function updateDay(id: string, payload: { name?: string; tasks?: Task[] }): Promise<DayList> {
  const base = getBaseUrl()
  if (!base) throw new Error("NEXT_PUBLIC_API_URL is not set")
  const body: { name?: string; tasks?: Array<{ id: string; label: string; done: boolean }> } = {}
  if (payload.name !== undefined) body.name = payload.name
  if (payload.tasks !== undefined) body.tasks = payload.tasks.map(mapTaskToApi)
  const res = await fetch(`${base}/days/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || res.statusText)
  }
  const data = await res.json()
  return mapDayFromApi(data)
}

export function isApiConfigured(): boolean {
  return Boolean(typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL)
}
