"use client"

import Link from "next/link"
import { ClipboardList, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
        <ClipboardList className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-balance">No task lists yet</h2>
      <p className="mt-1 text-sm text-muted-foreground text-pretty">
        Create your first list to start tracking daily tasks
      </p>
      <Button asChild className="mt-6">
        <Link href="/create">
          <Plus className="h-4 w-4" />
          New List
        </Link>
      </Button>
    </div>
  )
}
