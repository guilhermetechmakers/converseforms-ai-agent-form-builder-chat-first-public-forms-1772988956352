import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SessionStatus } from '@/types/session'

export interface FilterBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: SessionStatus | 'all'
  onStatusChange: (value: SessionStatus | 'all') => void
  sortKey: string
  onSortChange: (value: string) => void
  onSearchSubmit?: () => void
  className?: string
  placeholder?: string
}

const STATUS_OPTIONS: { value: SessionStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'abandoned', label: 'Abandoned' },
]

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'startedAt', label: 'Last activity' },
  { value: 'createdAt', label: 'Created' },
  { value: 'endedAt', label: 'Ended' },
  { value: 'duration', label: 'Duration' },
]

/** Top filter bar for sessions list: search, status chips, sort dropdown. */
export function FilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortKey,
  onSortChange,
  onSearchSubmit,
  className,
  placeholder = 'Search sessions…',
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3',
        className
      )}
    >
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onSearchSubmit?.()
            }
          }}
          className="pl-9"
          aria-label="Search sessions"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={statusFilter === opt.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onStatusChange(opt.value)}
            aria-pressed={statusFilter === opt.value}
            aria-label={`Filter by ${opt.label}`}
          >
            {opt.label}
          </Button>
        ))}
      </div>
      <Select value={sortKey} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]" aria-label="Sort by">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {onSearchSubmit && (
        <Button size="sm" onClick={onSearchSubmit}>
          Search
        </Button>
      )}
    </div>
  )
}
