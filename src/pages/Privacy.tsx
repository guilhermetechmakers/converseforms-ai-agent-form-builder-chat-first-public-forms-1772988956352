import { useState, useCallback } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { AnimatedPage } from '@/components/AnimatedPage'
import { PolicySection, RequestSection, ContactSection } from '@/components/privacy'
import { requestDataExport, requestDataDeletion } from '@/api/privacy'
import {
  PRIVACY_POLICY_SECTIONS,
  PRIVACY_POLICY_LAST_UPDATED,
  PRIVACY_CONTACT,
} from '@/data/privacy-policy-content'
import { toast } from 'sonner'

const NAV_ANCHORS = [
  { id: 'data-collection', label: 'Data we collect' },
  { id: 'how-we-use-data', label: 'How we use data' },
  { id: 'data-sharing-processors', label: 'Data sharing' },
  { id: 'data-retention', label: 'Data retention' },
  { id: 'data-security', label: 'Data security' },
  { id: 'user-rights', label: 'Your rights' },
  { id: 'opt-out', label: 'Opt-out options' },
  { id: 'export-procedure', label: 'Data export' },
  { id: 'deletion-procedure', label: 'Data deletion' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'policy-changes', label: 'Policy changes' },
  { id: 'contact', label: 'Contact' },
]

export default function Privacy() {
  const [isExportLoading, setIsExportLoading] = useState(false)
  const [isDeletionLoading, setIsDeletionLoading] = useState(false)

  // Runtime safety: sections may be from API later — guard with Array.isArray / ?? []
  const sections = Array.isArray(PRIVACY_POLICY_SECTIONS) ? PRIVACY_POLICY_SECTIONS : []

  const handleExportRequest = useCallback(async () => {
    setIsExportLoading(true)
    try {
      // When auth is available, pass the current user id: e.g. session?.user?.id ?? ''
      const userId = ''
      const result = await requestDataExport(userId)
      const message = result?.message ?? 'Request received. Our team will process your export within 30 days. See Contact section for details.'
      toast.success(message)
    } catch {
      toast.error('Something went wrong. Please use the Contact section to submit your request.')
    } finally {
      setIsExportLoading(false)
    }
  }, [])

  const handleDeletionRequest = useCallback(async () => {
    setIsDeletionLoading(true)
    try {
      const userId = ''
      const result = await requestDataDeletion(userId)
      const message = result?.message ?? 'Request received. Our team will process your deletion within 30 days. See Contact section for details.'
      toast.success(message)
    } catch {
      toast.error('Something went wrong. Please use the Contact section to submit your request.')
    } finally {
      setIsDeletionLoading(false)
    }
  }, [])

  return (
    <AnimatedPage>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-50 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      <Navbar />
      <main
        id="main-content"
        role="main"
        className="min-h-screen bg-background px-6 py-12 md:px-9"
      >
        <div className="mx-auto max-w-container">
          <article className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <nav
              aria-label="Privacy policy sections"
              className="lg:col-span-3 lg:sticky lg:top-24 lg:self-start"
            >
              <h2 className="text-foreground text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                On this page
              </h2>
              <ul className="mt-4 space-y-2">
                {(NAV_ANCHORS ?? []).map((anchor) => (
                  <li key={anchor.id}>
                    <a
                      href={`#${anchor.id}`}
                      className="text-muted-foreground text-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                    >
                      {anchor.label ?? ''}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="lg:col-span-9">
              <header className="mb-12">
                <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl md:leading-tight">
                  Privacy Policy
                </h1>
                <p className="text-muted-foreground mt-2 text-base font-normal">
                  Last updated: {PRIVACY_POLICY_LAST_UPDATED ?? new Date().toISOString().slice(0, 10)}
                </p>
              </header>

              <div className="space-y-12">
                {(sections ?? []).map((section) => (
                  <PolicySection
                    key={section.id}
                    id={section.id}
                    title={section.title ?? ''}
                    content={section.body ?? ''}
                    subpoints={section.subpoints}
                  />
                ))}

                <RequestSection
                  requestTypes={['export', 'deletion']}
                  showActions
                  onExportRequest={handleExportRequest}
                  onDeletionRequest={handleDeletionRequest}
                  isExportLoading={isExportLoading}
                  isDeletionLoading={isDeletionLoading}
                />

                <ContactSection
                  contactName={PRIVACY_CONTACT?.contactName}
                  email={PRIVACY_CONTACT?.email}
                  phone={PRIVACY_CONTACT?.phone}
                  address={PRIVACY_CONTACT?.address}
                />
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </AnimatedPage>
  )
}
