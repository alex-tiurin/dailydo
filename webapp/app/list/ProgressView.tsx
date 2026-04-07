"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Pencil, Check } from 'lucide-react'
import Navbar from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { useLists } from '@/lib/lists-context'
import type { Task } from '@/lib/api/types'

// --- TaskRow ---

interface TaskRowProps {
  task: Task
  onToggle: (id: string) => void
}

function TaskRow({ task, onToggle }: TaskRowProps) {
  return (
    <div
      className="flex items-center gap-3 py-3 border-b border-[var(--divider)]"
      data-testid="task-item"
      aria-label={task.name}
    >
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer shrink-0 ${
          task.done
            ? 'bg-[var(--checkbox-done)] border-[var(--checkbox-done)]'
            : 'border-primary'
        }`}
        onClick={() => onToggle(task.id)}
        data-testid="task-checkbox"
        aria-label={`Toggle ${task.name}`}
      >
        {task.done && <Check size={12} className="text-white" />}
      </div>

      <span
        className={`flex-1 ${task.done ? 'line-through text-[var(--text-done)]' : 'text-foreground'}`}
        data-testid="task-name"
      >
        {task.name}
      </span>

      <Button variant="ghost" size="icon" data-testid="task-edit" aria-label={`Edit ${task.name}`}>
        <Pencil size={14} className="text-[var(--text-secondary)]" />
      </Button>
    </div>
  )
}

// --- ProgressView ---

export default function ProgressView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const { lists, loading, updateTask } = useLists()

  const list = id ? lists.find((l) => l.id === id) : undefined

  useEffect(() => {
    if (!loading && (!id || !list)) {
      router.replace('/')
    }
  }, [loading, id, list, router])

  if (loading) return <p>Loading...</p>
  if (!list) return null

  const pending = list.tasks.filter((t) => !t.done)
  const completed = list.tasks.filter((t) => t.done)
  const done = completed.length
  const total = list.tasks.length

  const formattedDate = new Date(list.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  })

  async function handleToggle(taskId: string) {
    const task = list!.tasks.find((t) => t.id === taskId)
    if (!task) return
    await updateTask(id!, taskId, { done: !task.done })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main
        className="max-w-[1280px] mx-auto px-6 py-6"
        data-testid="progress-view-page"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            data-testid="back-button"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <span
              className="text-sm text-[var(--text-secondary)]"
              data-testid="progress-counter"
            >
              {done}/{total} done
            </span>
            <Pencil size={16} className="text-primary" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold">{list.name}</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{formattedDate}</p>

        {/* Pending */}
        {pending.length > 0 && (
          <>
            <p
              className="text-sm font-semibold text-[var(--text-secondary)] mt-6 mb-2"
              data-testid="pending-section"
            >
              Pending {pending.length}
            </p>
            {pending.map((task) => (
              <TaskRow key={task.id} task={task} onToggle={handleToggle} />
            ))}
          </>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <>
            <p
              className="text-sm font-semibold text-[var(--text-secondary)] mt-6 mb-2"
              data-testid="completed-section"
            >
              Completed {completed.length}
            </p>
            {completed.map((task) => (
              <TaskRow key={task.id} task={task} onToggle={handleToggle} />
            ))}
          </>
        )}
      </main>
    </div>
  )
}
