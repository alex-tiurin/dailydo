"use client"

import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface TaskFormProps {
  value: string
  onChange: (v: string) => void
  onRemove: () => void
  placeholder?: string
}

export default function TaskForm({ value, onChange, onRemove, placeholder }: TaskFormProps) {
  return (
    <div className="flex items-center gap-2 py-2 border-b border-[var(--divider)]">
      <div className="w-5 h-5 rounded border-2 border-[var(--divider)] shrink-0" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Task name'}
        className="border-0 shadow-none focus-visible:ring-0 px-0"
        data-testid="task-form-input"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        data-testid="task-form-remove"
      >
        <X size={16} className="text-[var(--text-secondary)]" />
      </Button>
    </div>
  )
}
