"use client"

import { useState } from "react"
import { BarChart3, ChevronUp, ChevronDown } from "lucide-react"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import type { TaskList } from "@/lib/api/types"

interface ProgressOverviewProps {
  lists: TaskList[]
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function ProgressOverview({ lists }: ProgressOverviewProps) {
  const [open, setOpen] = useState(true)

  // Take the last 7 (already sorted desc — take first 7, then reverse for chart order)
  const recent = lists.slice(0, 7).reverse()

  const totalTasks = lists.reduce((sum, l) => sum + l.tasks.length, 0)
  const doneTasks = lists.reduce(
    (sum, l) => sum + l.tasks.filter((t) => t.done).length,
    0
  )

  // For bar heights: find max done count to scale bars
  const bars = recent.map((list) => {
    const total = list.tasks.length
    const done = list.tasks.filter((t) => t.done).length
    const date = new Date(list.date + "T00:00:00")
    const dayLabel = DAY_LABELS[date.getDay()]
    return { total, done, dayLabel }
  })

  const maxDone = Math.max(...bars.map((b) => b.done), 1)
  const MAX_HEIGHT = 80 // px

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        data-testid="progress-overview"
        className="bg-[var(--surface)] rounded-xl p-4 mb-4"
      >
        {/* Header row — always visible */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-[var(--text-secondary)]" />
            <span className="text-sm font-medium text-foreground">
              Progress Overview
            </span>
            <span className="text-xs text-[var(--text-secondary)]">
              Last {lists.length > 7 ? 7 : lists.length} days
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)]">
              {doneTasks}/{totalTasks} tasks done
            </span>
            <CollapsibleTrigger
              data-testid="progress-overview-toggle"
              className="cursor-pointer"
              aria-label="Toggle progress overview"
            >
              {open ? (
                <ChevronUp size={16} className="text-[var(--text-secondary)]" />
              ) : (
                <ChevronDown size={16} className="text-[var(--text-secondary)]" />
              )}
            </CollapsibleTrigger>
          </div>
        </div>

        {/* Chart — collapsible */}
        <CollapsibleContent>
          <div
            data-testid="progress-overview-chart"
            className="flex gap-3 items-end mt-4"
            style={{ height: `${MAX_HEIGHT + 24}px` }}
          >
            {bars.map((bar, i) => {
              const filledHeight =
                bar.done === 0
                  ? 0
                  : Math.max(4, Math.round((bar.done / maxDone) * MAX_HEIGHT))
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1 flex-1"
                >
                  {/* Bar */}
                  <div
                    className="w-full rounded-sm bg-[var(--divider)] flex flex-col justify-end"
                    style={{ height: `${MAX_HEIGHT}px` }}
                  >
                    <div
                      className="w-full rounded-sm bg-[var(--checkbox-done)]"
                      style={{ height: `${filledHeight}px` }}
                    />
                  </div>
                  {/* Day label */}
                  <span className="text-xs text-[var(--text-secondary)]">
                    {bar.dayLabel}
                  </span>
                </div>
              )
            })}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
