"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { getLists, type DayList } from "@/lib/daily-store"
import { AppHeader } from "@/components/daily-do/app-header"
import { DayCard } from "@/components/daily-do/day-card"
import { EmptyState } from "@/components/daily-do/empty-state"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [lists, setLists] = useState<DayList[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLists(getLists())
    setLoaded(true)
  }, [])

  if (!loaded) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-svh max-w-lg">
      <AppHeader
        title="Daily Do"
        action={
          <Button size="sm" asChild>
            <Link href="/create">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New List</span>
            </Link>
          </Button>
        }
      />

      <main className="px-4 py-4">
        {lists.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-3">
            {lists.map((list) => (
              <DayCard key={list.id} list={list} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
