"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Pencil } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/daily-store"

interface TaskItemProps {
  task: Task
  onToggle: (taskId: string) => void
  onEdit?: (taskId: string, newText: string) => void
}

export function TaskItem({ task, onToggle, onEdit }: TaskItemProps) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(task.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  function handleSave() {
    const trimmed = editText.trim()
    if (trimmed && trimmed !== task.text && onEdit) {
      onEdit(task.id, trimmed)
    } else {
      setEditText(task.text)
    }
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSave()
    }
    if (e.key === "Escape") {
      setEditText(task.text)
      setEditing(false)
    }
  }

  if (editing) {
    return (
      <div className="flex w-full items-center gap-3 rounded-lg bg-card px-3 py-2 ring-2 ring-foreground/20">
        <Checkbox
          checked={task.completed}
          disabled
          className={cn(
            "h-5 w-5 shrink-0 rounded-full",
            task.completed &&
              "border-emerald-500 bg-emerald-500 text-white data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500",
          )}
        />
        <Input
          ref={inputRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="h-8 flex-1 border-none bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200",
        task.completed ? "bg-secondary/50" : "bg-card hover:bg-accent/50",
      )}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => onToggle(task.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onToggle(task.id)
          }
        }}
        className="shrink-0 cursor-pointer"
      >
        <Checkbox
          checked={task.completed}
          tabIndex={-1}
          className={cn(
            "pointer-events-none h-5 w-5 rounded-full transition-colors",
            task.completed &&
              "border-emerald-500 bg-emerald-500 text-white data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500",
          )}
        />
      </div>
      <span
        className={cn(
          "flex-1 text-sm transition-all duration-200",
          task.completed && "text-muted-foreground line-through",
        )}
      >
        {task.text}
      </span>
      {onEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setEditing(true)
          }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground group-hover:opacity-100"
          aria-label={`Edit task: ${task.text}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
