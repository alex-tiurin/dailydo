import { ListService, NotFoundError } from '../../src/services/listService'
import { ListRepository } from '../../src/repositories/listRepository'
import { TaskList, Task } from '../../src/types'

const mockRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  updateTask: jest.fn(),
} as unknown as ListRepository

const service = new ListService(mockRepo)

const sampleTask: Task = { id: 'task-1', name: 'Task 1', done: false }
const sampleList: TaskList = {
  id: 'list-1',
  name: 'Morning Routine',
  date: '2026-04-03',
  tasks: [sampleTask],
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('ListService.getAllLists', () => {
  it('returns all lists from repository', async () => {
    ;(mockRepo.findAll as jest.Mock).mockResolvedValue([sampleList])
    const result = await service.getAllLists()
    expect(mockRepo.findAll).toHaveBeenCalledTimes(1)
    expect(result).toEqual([sampleList])
  })

  it('returns empty array when no lists', async () => {
    ;(mockRepo.findAll as jest.Mock).mockResolvedValue([])
    const result = await service.getAllLists()
    expect(result).toEqual([])
  })
})

describe('ListService.getListById', () => {
  it('returns list when found', async () => {
    ;(mockRepo.findById as jest.Mock).mockResolvedValue(sampleList)
    const result = await service.getListById('list-1')
    expect(mockRepo.findById).toHaveBeenCalledWith('list-1')
    expect(result).toEqual(sampleList)
  })

  it('throws NotFoundError when list does not exist', async () => {
    ;(mockRepo.findById as jest.Mock).mockResolvedValue(null)
    await expect(service.getListById('nonexistent')).rejects.toThrow(
      NotFoundError,
    )
  })
})

describe('ListService.createList', () => {
  it('calls repository create and returns result', async () => {
    const input = { name: 'Morning Routine', tasks: [{ name: 'Wake up' }] }
    ;(mockRepo.create as jest.Mock).mockResolvedValue(sampleList)
    const result = await service.createList(input)
    expect(mockRepo.create).toHaveBeenCalledWith(input)
    expect(result).toEqual(sampleList)
  })
})

describe('ListService.updateList', () => {
  it('returns updated list when found', async () => {
    const updated = { ...sampleList, name: 'Updated' }
    ;(mockRepo.update as jest.Mock).mockResolvedValue(updated)
    const result = await service.updateList('list-1', 'Updated')
    expect(mockRepo.update).toHaveBeenCalledWith('list-1', 'Updated')
    expect(result).toEqual(updated)
  })

  it('throws NotFoundError when list does not exist', async () => {
    ;(mockRepo.update as jest.Mock).mockResolvedValue(null)
    await expect(service.updateList('nonexistent', 'Name')).rejects.toThrow(
      NotFoundError,
    )
  })
})

describe('ListService.deleteList', () => {
  it('calls repository remove', async () => {
    ;(mockRepo.remove as jest.Mock).mockResolvedValue(true)
    await expect(service.deleteList('list-1')).resolves.toBeUndefined()
    expect(mockRepo.remove).toHaveBeenCalledWith('list-1')
  })

  it('throws NotFoundError when list does not exist', async () => {
    ;(mockRepo.remove as jest.Mock).mockResolvedValue(false)
    await expect(service.deleteList('nonexistent')).rejects.toThrow(
      NotFoundError,
    )
  })
})

describe('ListService.updateTask', () => {
  it('returns updated task when found', async () => {
    const updated = { ...sampleTask, done: true }
    ;(mockRepo.updateTask as jest.Mock).mockResolvedValue(updated)
    const result = await service.updateTask('list-1', 'task-1', { done: true })
    expect(mockRepo.updateTask).toHaveBeenCalledWith('list-1', 'task-1', {
      done: true,
    })
    expect(result).toEqual(updated)
  })

  it('throws NotFoundError when task does not exist', async () => {
    ;(mockRepo.updateTask as jest.Mock).mockResolvedValue(null)
    await expect(
      service.updateTask('list-1', 'nonexistent', { done: true }),
    ).rejects.toThrow(NotFoundError)
  })
})
