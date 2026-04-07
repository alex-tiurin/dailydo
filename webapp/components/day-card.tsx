"use client"

import { Pencil } from "lucide-react"
import type { TaskList } from "@/lib/api/types"

interface DayCardProps {
  list: TaskList
  onClick: () => void
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
  })
  // e.g. "Mon, 27 March"
}

export function DayCard({ list, onClick }: DayCardProps) {
  const total = list.tasks.length
  const done = list.tasks.filter((t) => t.done).length
  const donePercent = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div
      data-testid="day-card"
      aria-label={list.name}
      className="cursor-pointer py-4 border-b border-[var(--divider)]"
      onClick={onClick}
    >
      {/* Row 1: date + counter + pencil */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-[var(--text-secondary)]">
          {formatDate(list.date)}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-sm text-[var(--text-secondary)]">
            {done}/{total}
          </span>
          <Pencil size={16} className="text-primary ml-2" />
        </div>
      </div>

      {/* Row 2: list name */}
      <p
        data-testid="day-card-list-name"
        className="text-lg font-semibold text-foreground mt-1"
      >
        {list.name}
      </p>

      {/* Row 3: progress bar */}
      <div
        data-testid="day-card-progress"
        className="w-full h-1 bg-[var(--divider)] rounded-full mt-2"
      >
        <div
          className="h-full bg-[var(--checkbox-done)] rounded-full"
          style={{ width: `${donePercent}%` }}
        />
      </div>
    </div>
  )
}
