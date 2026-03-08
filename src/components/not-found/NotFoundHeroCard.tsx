import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Search, Home, LayoutDashboard } from 'lucide-react'
import type { SearchResult } from './types'
import { SEARCH_INDEX } from './types'

const SEARCH_LIST: SearchResult[] = Array.isArray(SEARCH_INDEX) ? SEARCH_INDEX : []

interface NotFoundHeroCardProps {
  className?: string
}

/**
 * Centered hero card for 404 page: title, subtitle, search, and primary CTAs.
 * Search filters a static local list; all array access is guarded for runtime safety.
 */
export function NotFoundHeroCard({ className }: NotFoundHeroCardProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const searchResults = useMemo(() => {
    const q = typeof searchQuery === 'string' ? searchQuery.trim().toLowerCase() : ''
    if (!q) return []
    const list = SEARCH_LIST ?? []
    if (!Array.isArray(list)) return []
    return list.filter(
      (item) =>
        (item?.title ?? '').toLowerCase().includes(q) ||
        (item?.snippet ?? '').toLowerCase().includes(q)
    )
  }, [searchQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const first = (searchResults ?? [])[0]
    if (first?.href) navigate(first.href)
  }

  return (
    <Card
      className={cn(
        'w-full max-w-[min(100%,36rem)] rounded-[12px] border-border bg-card shadow-card',
        className
      )}
    >
      <CardHeader className="space-y-4 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-xs font-medium text-muted-foreground">
            Not found
          </Badge>
          <span className="sr-only">Status: page not found. Try search or links below.</span>
        </div>
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight text-foreground">
          That page doesn&apos;t exist.
        </h1>
        <p className="text-base text-muted-foreground">
          The link may be broken or the page was moved. Search for a page or use the links below to
          get back on track.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSearchSubmit} className="space-y-2">
          <label htmlFor="not-found-search" className="sr-only">
            Search for a page or form
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="not-found-search"
              type="search"
              placeholder="Search for a page..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 rounded-lg border-border bg-background pl-9 focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Search for a page or form"
              autoComplete="off"
            />
          </div>
          {searchQuery.trim() && Array.isArray(searchResults) && searchResults.length > 0 && (
            <ul
              className="animate-fade-in rounded-lg border border-border bg-muted/50 py-2"
              role="list"
            >
              {(searchResults ?? []).slice(0, 5).map((item) => (
                <li key={item?.id ?? item?.href}>
                  <Link
                    to={item?.href ?? '#'}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <span className="font-medium">{item?.title ?? 'Page'}</span>
                    {item?.snippet && (
                      <span className="ml-2 text-muted-foreground">{item.snippet}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </form>

        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-full px-5 py-2.5">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" aria-hidden />
              Go to Home
            </Link>
          </Button>
          <Button variant="outline" asChild className="rounded-full px-5 py-2.5">
            <Link to="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" aria-hidden />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
