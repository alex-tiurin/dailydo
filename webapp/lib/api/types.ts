export interface Task {
  id: string
  name: string
  done: boolean
}

export interface TaskList {
  id: string
  name: string
  date: string  // ISO "2026-03-27"
  tasks: Task[]
}

export interface CreateListRequest {
  name: string
  tasks: Array<{ name: string }>
}

export interface UpdateTaskRequest {
  done?: boolean
  name?: string
}
