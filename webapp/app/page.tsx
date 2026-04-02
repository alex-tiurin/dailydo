"use client"

import { useRouter } from "next/navigation"
import { useLists } from "@/lib/lists-context"
import Navbar from "@/components/navbar"
import { EmptyState } from "@/components/empty-state"
import { DayCard } from "@/components/day-card"
import { ProgressOverview } from "@/components/progress-overview"
import { Button } from "@/components/ui/button"

export default function Page() {
  const router = useRouter()
  const { lists, loading } = useLists()

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main data-testid="my-lists-page" className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Section header */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Lists</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">{today}</p>
          </div>
          <Button
            data-testid="new-list-button"
            variant="default"
            onClick={() => router.push("/create")}
          >
            + New List
          </Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground mt-8">Loading...</p>
        ) : lists.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ProgressOverview lists={lists} />
            <div data-testid="lists-container">
              {lists.map((list) => (
                <DayCard
                  key={list.id}
                  list={list}
                  onClick={() => router.push(`/list/${list.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
