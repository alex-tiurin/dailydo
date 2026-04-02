import type { TaskList } from '@/lib/api/types'

export const MOCK_LISTS: TaskList[] = [
  {
    id: 'mock-list-1',
    name: 'Monday Routine',
    date: '2026-03-24',
    tasks: [
      { id: 'task-1-1', name: 'Morning workout', done: true },
      { id: 'task-1-2', name: 'Read 20 pages', done: true },
      { id: 'task-1-3', name: 'Plan the week', done: false },
      { id: 'task-1-4', name: 'Grocery shopping', done: false },
    ],
  },
  {
    id: 'mock-list-2',
    name: 'Tuesday Tasks',
    date: '2026-03-25',
    tasks: [
      { id: 'task-2-1', name: 'Team standup', done: true },
      { id: 'task-2-2', name: 'Code review', done: true },
      { id: 'task-2-3', name: 'Write unit tests', done: false },
      { id: 'task-2-4', name: 'Update documentation', done: false },
      { id: 'task-2-5', name: 'Deploy to staging', done: false },
    ],
  },
  {
    id: 'mock-list-3',
    name: 'Wednesday Goals',
    date: '2026-03-26',
    tasks: [
      { id: 'task-3-1', name: 'Fix login bug', done: true },
      { id: 'task-3-2', name: 'Design review', done: true },
      { id: 'task-3-3', name: 'Client call', done: true },
      { id: 'task-3-4', name: 'Refactor auth module', done: false },
    ],
  },
  {
    id: 'mock-list-4',
    name: 'Thursday Sprint',
    date: '2026-03-27',
    tasks: [
      { id: 'task-4-1', name: 'Morning run', done: true },
      { id: 'task-4-2', name: 'Review pull requests', done: false },
      { id: 'task-4-3', name: 'Update project roadmap', done: false },
      { id: 'task-4-4', name: 'Prepare demo', done: false },
      { id: 'task-4-5', name: 'Send weekly report', done: false },
    ],
  },
]
