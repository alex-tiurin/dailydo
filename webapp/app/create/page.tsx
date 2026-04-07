"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import Navbar from '@/components/navbar'
import TaskForm from '@/components/task-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLists } from '@/lib/lists-context'

export default function CreatePage() {
  const router = useRouter()
  const { createList } = useLists()

  const [listName, setListName] = useState('')
  const [tasks, setTasks] = useState<Array<{ id: string; name: string }>>([
    { id: crypto.randomUUID(), name: '' },
  ])
  const [submitting, setSubmitting] = useState(false)
  const [nameError, setNameError] = useState(false)

  function handleAddTask() {
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), name: '' }])
  }

  function handleTaskChange(id: string, value: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, name: value } : t)))
  }

  function handleTaskRemove(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  async function handleSubmit() {
    if (!listName.trim()) {
      setNameError(true)
      return
    }

    const filtered = tasks.filter((t) => t.name.trim() !== '')

    setSubmitting(true)
    try {
      const newList = await createList({
        name: listName.trim(),
        tasks: filtered.map((t) => ({ name: t.name.trim() })),
      })
      router.push(`/list?id=${newList.id}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main
        className="flex items-center justify-center py-16 px-6"
        data-testid="create-list-page"
      >
        <div className="bg-[var(--surface)] rounded-xl shadow-md p-8 w-full max-w-[480px]">
          <h1 className="text-xl font-bold mb-1">Create New List</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Add a name and tasks for today
          </p>

          <label className="text-sm font-medium mb-1 block">List Name</label>
          <Input
            placeholder="Morning Routine"
            value={listName}
            onChange={(e) => {
              setListName(e.target.value)
              if (nameError) setNameError(false)
            }}
            className={nameError ? 'border-red-500' : ''}
            data-testid="list-name-input"
          />
          {nameError && (
            <p className="text-xs text-red-500 mt-1">List name is required</p>
          )}

          <label className="text-sm font-medium mt-4 mb-2 block">Tasks</label>
          <div data-testid="tasks-list">
            {tasks.map((t, index) => (
              <TaskForm
                key={t.id}
                index={index}
                value={t.name}
                onChange={(v) => handleTaskChange(t.id, v)}
                onRemove={() => handleTaskRemove(t.id)}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            className="text-primary pl-0 mt-1"
            onClick={handleAddTask}
            data-testid="add-task-button"
          >
            <Plus size={14} />
            Add task
          </Button>

          <Button
            className="w-full mt-6"
            disabled={submitting}
            onClick={handleSubmit}
            data-testid="save-list-button"
          >
            Save List
          </Button>
        </div>
      </main>
    </div>
  )
}
