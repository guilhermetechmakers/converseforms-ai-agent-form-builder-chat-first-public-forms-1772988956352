import { useCallback } from 'react'
import type { ToSSectionData } from '@/types/tos'
import { ToSSection } from './ToSSection'
import { PrintableToolbar } from './PrintableToolbar'
import { VersionBadge } from './VersionBadge'
import { AcceptancePanel } from './AcceptancePanel'
import { cn } from '@/lib/utils'

export interface ToSPageContainerProps {
  /** Sections to render; use (contentSegments ?? []) when consuming. */
  contentSegments?: ToSSectionData[]
  lastUpdated?: string
  version?: string
  isPrintableEnabled?: boolean
  /** Optional: show acceptance panel (e.g. for checkout/signup flow). */
  showAcceptancePanel?: boolean
  onAccept?: (accepted: boolean) => void
  className?: string
}

const TOC_THRESHOLD = 3

/**
 * Renders the full ToS page: TOC (when many sections), toolbar, version badge, and sections.
 * All array access is guarded for runtime safety.
 */
export function ToSPageContainer({
  contentSegments,
  lastUpdated = '',
  version = '—',
  isPrintableEnabled = true,
  showAcceptancePanel = false,
  onAccept,
  className,
}: ToSPageContainerProps) {
  const sections = Array.isArray(contentSegments) ? contentSegments : []
  const showToc = sections.length >= TOC_THRESHOLD

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleDownloadPDF = useCallback(() => {
    window.print()
  }, [])

  return (
    <div className={cn('tos-page', className)}>
      <PrintableToolbar
        onPrint={handlePrint}
        onDownloadPDF={isPrintableEnabled ? handleDownloadPDF : undefined}
        isPrintableEnabled={isPrintableEnabled}
      />

      <div className="mx-auto max-w-container px-6 py-8 md:px-9">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {showToc && (
            <nav
              aria-label="Terms of Service sections"
              className="print:hidden lg:col-span-3 lg:sticky lg:top-24 lg:self-start"
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                On this page
              </h2>
              <ul className="mt-4 space-y-2">
                {(sections ?? []).map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-sm text-muted-foreground hover:text-foreground focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {section.title ?? ''}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className={cn(showToc ? 'lg:col-span-9' : 'lg:col-span-12')}>
            <header className="mb-10">
              <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl md:leading-tight">
                Terms of Service
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <VersionBadge version={version} lastUpdated={lastUpdated} />
              </div>
            </header>

            <div className="space-y-12">
              {(sections ?? []).map((section) => (
                <ToSSection
                  key={section.id}
                  sectionId={section.id}
                  title={section.title ?? ''}
                  body={section.body ?? ''}
                  subsections={section.subsections}
                />
              ))}

              {showAcceptancePanel && typeof onAccept === 'function' && (
                <div className="mt-10">
                  <AcceptancePanel onAccept={onAccept} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
