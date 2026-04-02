"use client"

import { BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function EmptyState() {
  const router = useRouter()

  return (
    <div
      data-testid="empty-state"
      className="flex flex-col items-center justify-center gap-4 py-20"
    >
      <BarChart3 size={48} className="text-primary" />
      <h2 className="text-xl font-semibold text-foreground">No data yet</h2>
      <p className="text-muted-foreground text-center max-w-sm">
        Start tracking activities to see your progress chart
      </p>
      <Button
        data-testid="create-first-list-button"
        variant="default"
        onClick={() => router.push("/create")}
      >
        + Create First List
      </Button>
    </div>
  )
}
