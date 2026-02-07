"use client"

import Link from "next/link"
import { CheckCircle2, Circle, ChevronRight } from "lucide-react"
import type { DayList } from "@/lib/daily-store"

interface DayCardProps {
  list: DayList
}

export function DayCard({ list }: DayCardProps) {
  const completed = list.tasks.filter((t) => t.completed).length
  const total = list.tasks.length
  const allDone = total > 0 && completed === total
  const progress = total > 0 ? (completed / total) * 100 : 0

  const date = new Date(list.createdAt)
  const formattedDate = date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <Link
      href={`/day/${list.id}`}
      className="group block rounded-xl border bg-card p-4 transition-colors hover:bg-accent/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-card-foreground">{list.name}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{formattedDate}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm">
            {allDone ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={allDone ? "font-medium text-emerald-600" : "text-muted-foreground"}>
              {completed}/{total}
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
      {total > 0 && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-foreground transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </Link>
  )
}
