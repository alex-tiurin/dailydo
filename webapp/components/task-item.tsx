"use client"

import { Check, Pencil } from "lucide-react"
import type { Task } from "@/lib/api/types"

interface TaskItemProps {
  task: Task
  listId: string
  onToggle?: (taskId: string) => void
  onEdit?: (taskId: string) => void
}

export function TaskItem({ task, onToggle, onEdit }: TaskItemProps) {
  return (
    <div
      data-testid="task-item"
      aria-label={task.name}
      className="flex items-center gap-3 py-3 border-b border-[var(--divider)]"
    >
      {/* Checkbox */}
      <div
        data-testid="task-checkbox"
        aria-label={`Toggle ${task.name}`}
        onClick={() => onToggle?.(task.id)}
        className={`
          w-5 h-5 rounded flex items-center justify-center cursor-pointer flex-shrink-0
          ${task.done
            ? "bg-[var(--checkbox-done)] border-2 border-[var(--checkbox-done)]"
            : "border-2 border-primary"
          }
        `}
      >
        {task.done && <Check size={12} className="text-white" strokeWidth={3} />}
      </div>

      {/* Task name */}
      <span
        data-testid="task-name"
        className={`text-base flex-1 ${
          task.done ? "line-through text-[var(--text-done)]" : "text-foreground"
        }`}
      >
        {task.name}
      </span>

      {/* Edit button */}
      <button
        data-testid="task-edit"
        onClick={() => onEdit?.(task.id)}
        className="ml-auto p-1 cursor-pointer"
        aria-label={`Edit ${task.name}`}
      >
        <Pencil size={16} className="text-[var(--text-secondary)]" />
      </button>
    </div>
  )
}
