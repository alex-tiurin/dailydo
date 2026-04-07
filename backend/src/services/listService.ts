import { ListRepository } from '../repositories/listRepository'
import { TaskList, Task, CreateListRequest, UpdateTaskRequest } from '../types'

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ListService {
  constructor(private readonly repo: ListRepository) {}

  async getAllLists(): Promise<TaskList[]> {
    return this.repo.findAll()
  }

  async getListById(id: string): Promise<TaskList> {
    const list = await this.repo.findById(id)
    if (!list) throw new NotFoundError(`List ${id} not found`)
    return list
  }

  async createList(data: CreateListRequest): Promise<TaskList> {
    return this.repo.create(data)
  }

  async updateList(id: string, name: string): Promise<TaskList> {
    const list = await this.repo.update(id, name)
    if (!list) throw new NotFoundError(`List ${id} not found`)
    return list
  }

  async deleteList(id: string): Promise<void> {
    const deleted = await this.repo.remove(id)
    if (!deleted) throw new NotFoundError(`List ${id} not found`)
  }

  async clearAll(): Promise<void> {
    return this.repo.clearAll()
  }

  async updateTask(
    listId: string,
    taskId: string,
    data: UpdateTaskRequest,
  ): Promise<Task> {
    const task = await this.repo.updateTask(listId, taskId, data)
    if (!task) throw new NotFoundError(`Task ${taskId} not found in list ${listId}`)
    return task
  }
}
