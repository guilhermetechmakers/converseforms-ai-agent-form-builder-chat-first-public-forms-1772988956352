import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import {
  AgentCard,
  FilterBar,
  BulkActionsBar,
  EmptyState,
  AgentListSkeleton,
} from '@/components/agent-list'
import type { StatusFilterValue, SortValue } from '@/components/agent-list'
import {
  useAgentsList,
  usePublishAgent,
  useArchiveAgent,
  useDuplicateAgent,
  useBulkAgents,
} from '@/hooks/useAgents'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 20
const SEARCH_DEBOUNCE_MS = 300

export default function AgentList() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all')
  const [sortKey, setSortKey] = useState<SortValue>('lastActivity')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [archiveConfirmId, setArchiveConfirmId] = useState<string | null>(null)

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1)
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [searchQuery])

  const listParams = {
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: debouncedSearch.trim() || undefined,
    sort: sortKey,
    page,
    pageSize: PAGE_SIZE,
  }

  const { data, isLoading, isError, error, refetch } = useAgentsList(listParams)
  const agents = Array.isArray(data?.data) ? data.data : []
  const total = typeof data?.total === 'number' ? data.total : 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const hasNext = page < totalPages
  const hasPrev = page > 1

  const publishAgent = usePublishAgent()
  const archiveAgent = useArchiveAgent()
  const duplicateAgent = useDuplicateAgent()
  const bulkAgents = useBulkAgents()

  const handleArchiveConfirm = useCallback(() => {
    if (!archiveConfirmId) return
    archiveAgent.mutate(archiveConfirmId, {
      onSettled: () => setArchiveConfirmId(null),
    })
  }, [archiveConfirmId, archiveAgent])

  const handleSelect = useCallback((id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = prev ?? []
      if (selected) return next.includes(id) ? next : [...next, id]
      return next.filter((x) => x !== id)
    })
  }, [])

  const handleClearSelection = useCallback(() => setSelectedIds([]), [])

  const handleBulkPublish = useCallback(() => {
    const ids = selectedIds ?? []
    if (ids.length === 0) return
    bulkAgents.mutate(
      { action: 'publish', ids },
      { onSuccess: () => setSelectedIds([]) }
    )
  }, [selectedIds, bulkAgents])

  const handleBulkArchive = useCallback(() => {
    const ids = selectedIds ?? []
    if (ids.length === 0) return
    bulkAgents.mutate(
      { action: 'archive', ids },
      { onSuccess: () => setSelectedIds([]) }
    )
  }, [selectedIds, bulkAgents])

  const handleBulkExport = useCallback(() => {
    const ids = selectedIds ?? []
    if (ids.length === 0) return
    bulkAgents.mutate({ action: 'export', ids })
  }, [selectedIds, bulkAgents])

  const isBulkPending = bulkAgents.isPending

  return (
    <AnimatedPage>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="border-b border-border px-6 py-6 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Agents</h1>
                <p className="text-muted-foreground">
                  Create and manage your conversational agents.
                </p>
              </div>
              <Button asChild className="shrink-0 transition-all hover:scale-[1.02]">
                <Link to="/dashboard/agents/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create agent
                </Link>
              </Button>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <FilterBar
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              sortKey={sortKey}
              onSearchChange={setSearchQuery}
              onStatusChange={(v) => {
                setStatusFilter(v)
                setPage(1)
              }}
              onSortChange={(v) => {
                setSortKey(v)
                setPage(1)
              }}
            />

            {(selectedIds?.length ?? 0) > 0 && (
              <BulkActionsBar
                selectedIds={selectedIds}
                onPublishBulk={handleBulkPublish}
                onArchiveBulk={handleBulkArchive}
                onExportBulk={handleBulkExport}
                onClearSelection={handleClearSelection}
                isPending={isBulkPending}
                className="mt-4"
              />
            )}

            <div className="mt-6">
              {isLoading && <AgentListSkeleton count={6} />}

              {!isLoading && isError && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
                  <p className="text-destructive">
                    {error instanceof Error ? error.message : 'Failed to load agents.'}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => refetch()}
                  >
                    Retry
                  </Button>
                </div>
              )}

              {!isLoading && !isError && agents.length === 0 && (
                <EmptyState className="mt-8" />
              )}

              {!isLoading && !isError && agents.length > 0 && (
                <>
                  <div
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    role="list"
                  >
                    {(agents ?? []).map((agent) => (
                      <div key={agent.id} role="listitem">
                        <AgentCard
                          agent={agent}
                          selected={selectedIds?.includes(agent.id) ?? false}
                          onSelect={handleSelect}
                          onEdit={() => {}}
                          onDuplicate={(id) => duplicateAgent.mutate(id)}
                          onPublishToggle={(id) => publishAgent.mutate(id)}
                          onArchive={(id) => setArchiveConfirmId(id)}
                          onViewAnalytics={() => {}}
                          isPublishing={publishAgent.isPending}
                          isArchiving={archiveAgent.isPending}
                          isDuplicating={duplicateAgent.isPending}
                        />
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                      <p className="text-sm text-muted-foreground">
                        Page {page} of {totalPages} · {total} total
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={!hasPrev}
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={!hasNext}
                          aria-label="Next page"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      <Dialog
        open={archiveConfirmId != null}
        onOpenChange={(open) => !open && setArchiveConfirmId(null)}
      >
        <DialogContent aria-describedby="archive-description">
          <DialogHeader>
            <DialogTitle>Archive this agent?</DialogTitle>
            <DialogDescription id="archive-description">
              Archived agents are hidden from the list and cannot receive new
              sessions. You can restore them later from settings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setArchiveConfirmId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleArchiveConfirm}
              disabled={archiveAgent.isPending}
            >
              {archiveAgent.isPending ? 'Archiving…' : 'Archive'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnimatedPage>
  )
}
