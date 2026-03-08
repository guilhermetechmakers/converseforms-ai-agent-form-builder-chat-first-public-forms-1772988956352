import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { AnimatedPage } from '@/components/AnimatedPage'
import { ToSPageContainer } from '@/components/tos'
import {
  TOS_SECTIONS,
  TOS_LAST_UPDATED,
  TOS_VERSION,
} from '@/data/tos-content'

export default function Terms() {
  const sections = Array.isArray(TOS_SECTIONS) ? TOS_SECTIONS : []

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
        className="min-h-screen bg-background"
      >
        <ToSPageContainer
          contentSegments={sections}
          lastUpdated={TOS_LAST_UPDATED ?? ''}
          version={TOS_VERSION ?? '—'}
          isPrintableEnabled
        />
      </main>
      <Footer />
    </AnimatedPage>
  )
}
