"use client"

import React from "react"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AppHeaderProps {
  title: string
  backHref?: string
  action?: React.ReactNode
}

export function AppHeader({ title, backHref, action }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-lg items-center gap-3 px-4">
        {backHref && (
          <Button variant="ghost" size="icon" asChild className="-ml-2 shrink-0">
            <Link href={backHref}>
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
        )}
        <h1 className="min-w-0 flex-1 truncate text-lg font-semibold tracking-tight">
          {title}
        </h1>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  )
}
