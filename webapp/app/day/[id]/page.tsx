"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Trash2, CheckCircle2, Circle } from "lucide-react"
import { getList, toggleTask, updateTaskText, deleteList, type DayList } from "@/lib/daily-store"
import { AppHeader } from "@/components/daily-do/app-header"
import { TaskItem } from "@/components/daily-do/task-item"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function DayPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [list, setList] = useState<DayList | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const data = getList(id)
    setList(data ?? null)
    setLoaded(true)
  }, [id])

  const handleToggle = useCallback(
    (taskId: string) => {
      const updated = toggleTask(id, taskId)
      if (updated) setList({ ...updated })
    },
    [id]
  )

  const handleEdit = useCallback(
    (taskId: string, newText: string) => {
      const updated = updateTaskText(id, taskId, newText)
      if (updated) setList({ ...updated })
    },
    [id]
  )

  const handleDelete = useCallback(() => {
    deleteList(id)
    router.push("/")
  }, [id, router])

  if (!loaded) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    )
  }

  if (!list) {
    return (
      <div className="mx-auto min-h-svh max-w-lg">
        <AppHeader title="Not Found" backHref="/" />
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <p className="text-muted-foreground">This list doesn't exist or was deleted.</p>
        </div>
      </div>
    )
  }

  const incomplete = list.tasks.filter((t) => !t.completed)
  const completed = list.tasks.filter((t) => t.completed)
  const total = list.tasks.length
  const doneCount = completed.length
  const progress = total > 0 ? (doneCount / total) * 100 : 0
  const allDone = total > 0 && doneCount === total

  const date = new Date(list.createdAt)
  const formattedDate = date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="mx-auto min-h-svh max-w-lg">
      <AppHeader
        title={list.name}
        backHref="/"
        action={
          <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete list</span>
          </Button>
        }
      />

      <main className="px-4 py-4">
        {/* Progress summary */}
        <div className="mb-6 rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              {allDone ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={allDone ? "text-emerald-600" : "text-foreground"}>
                {doneCount} / {total}
              </span>
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-foreground transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {allDone && (
            <p className="mt-2 text-center text-sm font-medium text-emerald-600">
              All tasks completed!
            </p>
          )}
        </div>

        {/* Incomplete tasks */}
        {incomplete.length > 0 && (
          <section>
            <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Circle className="h-3 w-3" />
              To Do
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                {incomplete.length}
              </span>
            </h2>
            <div className="flex flex-col gap-1">
              {incomplete.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={handleToggle} onEdit={handleEdit} />
              ))}
            </div>
          </section>
        )}

        {/* Separator */}
        {incomplete.length > 0 && completed.length > 0 && (
          <Separator className="my-4" />
        )}

        {/* Completed tasks */}
        {completed.length > 0 && (
          <section>
            <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              Completed
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                {completed.length}
              </span>
            </h2>
            <div className="flex flex-col gap-1">
              {completed.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={handleToggle} onEdit={handleEdit} />
              ))}
            </div>
          </section>
        )}

        {/* All done empty state */}
        {incomplete.length === 0 && completed.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No tasks in this list.</p>
          </div>
        )}
      </main>
    </div>
  )
}
