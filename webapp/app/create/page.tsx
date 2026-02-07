"use client"

import React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Plus, X, ListPlus } from "lucide-react"
import { createList } from "@/lib/daily-store"
import { AppHeader } from "@/components/daily-do/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CreatePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [tasks, setTasks] = useState<string[]>([""])
  const taskInputRefs = useRef<(HTMLInputElement | null)[]>([])

  function addTask() {
    setTasks((prev) => [...prev, ""])
    setTimeout(() => {
      taskInputRefs.current[tasks.length]?.focus()
    }, 50)
  }

  function removeTask(index: number) {
    if (tasks.length <= 1) return
    setTasks((prev) => prev.filter((_, i) => i !== index))
  }

  function updateTask(index: number, value: string) {
    setTasks((prev) => prev.map((t, i) => (i === index ? value : t)))
  }

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "Enter") {
      e.preventDefault()
      if (index === tasks.length - 1) {
        addTask()
      } else {
        taskInputRefs.current[index + 1]?.focus()
      }
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedName = name.trim()
    const validTasks = tasks.filter((t) => t.trim().length > 0)
    if (!trimmedName || validTasks.length === 0) return
    createList(trimmedName, validTasks)
    router.push("/")
  }

  const isValid = name.trim().length > 0 && tasks.some((t) => t.trim().length > 0)

  return (
    <div className="mx-auto min-h-svh max-w-lg">
      <AppHeader title="New List" backHref="/" />

      <main className="px-4 py-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Name field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="list-name" className="text-sm font-medium">
              List Name
            </label>
            <Input
              id="list-name"
              placeholder="e.g. Monday Tasks, Workout Plan..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Tasks */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Tasks</label>
              <span className="text-xs text-muted-foreground">
                {tasks.filter((t) => t.trim()).length} task(s)
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {tasks.map((task, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-xs text-muted-foreground">
                    {index + 1}
                  </div>
                  <Input
                    ref={(el) => { taskInputRefs.current[index] = el }}
                    placeholder="Describe a task..."
                    value={task}
                    onChange={(e) => updateTask(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTask(index)}
                    disabled={tasks.length <= 1}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove task</span>
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTask}
              className="mt-1 self-start bg-transparent"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>

          {/* Submit */}
          <Button type="submit" disabled={!isValid} className="mt-2 w-full">
            <ListPlus className="h-4 w-4" />
            Create List
          </Button>
        </form>
      </main>
    </div>
  )
}
