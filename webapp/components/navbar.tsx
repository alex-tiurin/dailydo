"use client"

export default function Navbar() {
  return (
    <nav data-testid="navbar" className="bg-background px-6 py-4">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between">
        <span data-testid="navbar-logo" className="text-primary font-bold text-lg">
          DailyDo
        </span>
        <div
          data-testid="navbar-avatar"
          className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm"
        >
          V
        </div>
      </div>
    </nav>
  )
}
