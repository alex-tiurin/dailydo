"use client"

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react'
import type { TaskList, CreateListRequest, UpdateTaskRequest } from '@/lib/api/types'
import {
  getLists,
  createList as apiCreateList,
  updateTask as apiUpdateTask,
  deleteList as apiDeleteList,
  getList,
} from '@/lib/api/client'

// --- State ---

interface ListsState {
  lists: TaskList[]
  loading: boolean
  error: string | null
}

// --- Actions ---

type ListsAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: TaskList[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_LIST'; payload: TaskList }
  | { type: 'UPDATE_TASK'; listId: string; taskId: string; payload: Partial<{ done: boolean; name: string }> }
  | { type: 'DELETE_LIST'; payload: string }
  | { type: 'REFRESH_LIST'; payload: TaskList }

// --- Reducer ---

function listsReducer(state: ListsState, action: ListsAction): ListsState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }

    case 'FETCH_SUCCESS':
      return { lists: action.payload, loading: false, error: null }

    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }

    case 'ADD_LIST':
      return { ...state, lists: [action.payload, ...state.lists] }

    case 'UPDATE_TASK':
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id !== action.listId
            ? list
            : {
                ...list,
                tasks: list.tasks.map((task) =>
                  task.id !== action.taskId
                    ? task
                    : { ...task, ...action.payload }
                ),
              }
        ),
      }

    case 'DELETE_LIST':
      return {
        ...state,
        lists: state.lists.filter((l) => l.id !== action.payload),
      }

    case 'REFRESH_LIST':
      return {
        ...state,
        lists: state.lists.map((l) =>
          l.id === action.payload.id ? action.payload : l
        ),
      }

    default:
      return state
  }
}

// --- Context ---

interface ListsContextValue {
  lists: TaskList[]
  loading: boolean
  error: string | null
  createList: (data: CreateListRequest) => Promise<TaskList>
  updateTask: (listId: string, taskId: string, data: UpdateTaskRequest) => Promise<void>
  deleteList: (id: string) => Promise<void>
  refreshList: (id: string) => Promise<void>
}

const ListsContext = createContext<ListsContextValue | null>(null)

// --- Provider ---

export function ListsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(listsReducer, {
    lists: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    dispatch({ type: 'FETCH_START' })
    getLists()
      .then((lists) => dispatch({ type: 'FETCH_SUCCESS', payload: lists }))
      .catch((err: unknown) =>
        dispatch({
          type: 'FETCH_ERROR',
          payload: err instanceof Error ? err.message : 'Failed to load lists',
        })
      )
  }, [])

  async function createList(data: CreateListRequest): Promise<TaskList> {
    const newList = await apiCreateList(data)
    dispatch({ type: 'ADD_LIST', payload: newList })
    return newList
  }

  async function updateTask(
    listId: string,
    taskId: string,
    data: UpdateTaskRequest
  ): Promise<void> {
    const updatedTask = await apiUpdateTask(listId, taskId, data)
    dispatch({
      type: 'UPDATE_TASK',
      listId,
      taskId,
      payload: { done: updatedTask.done, name: updatedTask.name },
    })
  }

  async function deleteList(id: string): Promise<void> {
    await apiDeleteList(id)
    dispatch({ type: 'DELETE_LIST', payload: id })
  }

  async function refreshList(id: string): Promise<void> {
    const list = await getList(id)
    dispatch({ type: 'REFRESH_LIST', payload: list })
  }

  return (
    <ListsContext.Provider
      value={{
        lists: state.lists,
        loading: state.loading,
        error: state.error,
        createList,
        updateTask,
        deleteList,
        refreshList,
      }}
    >
      {children}
    </ListsContext.Provider>
  )
}

// --- Hook ---

export function useLists(): ListsContextValue {
  const ctx = useContext(ListsContext)
  if (!ctx) {
    throw new Error('useLists must be used within a ListsProvider')
  }
  return ctx
}
