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

const STORAGE_KEY = "daily-do-lists"

export function getLists(): DayList[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveLists(lists: DayList[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
}

export function getList(id: string): DayList | undefined {
  return getLists().find((l) => l.id === id)
}

export function createList(name: string, taskTexts: string[]): DayList {
  const list: DayList = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    tasks: taskTexts
      .filter((t) => t.trim().length > 0)
      .map((text) => ({
        id: crypto.randomUUID(),
        text: text.trim(),
        completed: false,
      })),
  }
  const lists = getLists()
  lists.unshift(list)
  saveLists(lists)
  return list
}

export function toggleTask(listId: string, taskId: string): DayList | undefined {
  const lists = getLists()
  const list = lists.find((l) => l.id === listId)
  if (!list) return undefined
  const task = list.tasks.find((t) => t.id === taskId)
  if (!task) return undefined
  task.completed = !task.completed
  saveLists(lists)
  return list
}

export function updateTaskText(listId: string, taskId: string, newText: string): DayList | undefined {
  const lists = getLists()
  const list = lists.find((l) => l.id === listId)
  if (!list) return undefined
  const task = list.tasks.find((t) => t.id === taskId)
  if (!task) return undefined
  task.text = newText.trim()
  saveLists(lists)
  return list
}

export function deleteList(id: string) {
  const lists = getLists().filter((l) => l.id !== id)
  saveLists(lists)
}
