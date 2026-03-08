import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { AnimatedPage } from '@/components/AnimatedPage'
import { NotFoundHeroCard, QuickLinksRow } from '@/components/not-found'

/**
 * 404 Not Found page. Self-contained, no API calls.
 * Guides users back via hero card, search, and quick links.
 * All array handling uses guards (data ?? [], Array.isArray) for runtime safety.
 */
export default function NotFound() {
  return (
    <AnimatedPage>
      <Navbar />
      <main
        className="min-h-[60vh] bg-muted/30 px-6 py-16 md:px-8 md:py-20"
        id="main-content"
      >
        <div className="mx-auto max-w-container">
          <div className="flex flex-col items-center gap-16">
            <section className="flex w-full flex-col items-center text-center">
              <NotFoundHeroCard />
            </section>
            <section className="flex w-full flex-col items-center gap-2">
              <p className="text-sm font-medium text-muted-foreground">Quick links</p>
              <QuickLinksRow />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </AnimatedPage>
  )
}
