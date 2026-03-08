import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export type StatusFilterValue = 'all' | 'draft' | 'published' | 'archived'
export type SortValue = 'lastActivity' | 'sessionCount' | 'name'

export interface FilterBarProps {
  searchQuery: string
  statusFilter: StatusFilterValue
  sortKey: SortValue
  onSearchChange: (value: string) => void
  onStatusChange: (value: StatusFilterValue) => void
  onSortChange: (value: SortValue) => void
  placeholder?: string
  className?: string
}

const STATUS_OPTIONS: { value: StatusFilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: 'lastActivity', label: 'Last activity' },
  { value: 'sessionCount', label: 'Session count' },
  { value: 'name', label: 'Name' },
]

/**
 * Filter bar: search input, status chips (as select for consistency), sort dropdown.
 */
export function FilterBar({
  searchQuery,
  statusFilter,
  sortKey,
  onSearchChange,
  onStatusChange,
  onSortChange,
  placeholder = 'Search agents by name...',
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-3', className)}
      role="search"
      aria-label="Filter and sort agents"
    >
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
          aria-label="Search agents by name"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Status:</span>
        <Select
          value={statusFilter}
          onValueChange={(v) => onStatusChange(v as StatusFilterValue)}
        >
          <SelectTrigger className="w-[130px]" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort:</span>
        <Select
          value={sortKey}
          onValueChange={(v) => onSortChange(v as SortValue)}
        >
          <SelectTrigger className="w-[160px]" aria-label="Sort by">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
