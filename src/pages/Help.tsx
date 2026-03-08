import { useEffect, useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { AnimatedPage } from '@/components/AnimatedPage'
import {
  GettingStartedGuide,
  FAQsAccordion,
  DeveloperDocsLinks,
  ContactSupportForm,
} from '@/components/help'
import { getFaqs } from '@/api/help'
import type { FAQItem } from '@/types/help'

/**
 * About & Help page: guides, FAQs, developer docs links, and contact form.
 * All array data is guarded (data ?? [], Array.isArray) for runtime safety.
 */
export default function Help() {
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [faqsLoaded, setFaqsLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    getFaqs()
      .then((data) => {
        if (cancelled) return
        const list = Array.isArray(data) ? data : []
        setFaqs(list)
      })
      .finally(() => {
        if (!cancelled) setFaqsLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AnimatedPage>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="border-b border-border bg-muted/20 px-6 py-16 md:py-20">
          <div className="mx-auto max-w-container text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-[56px]">
              About & Help
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Learn how ConverseForms works, get answers to common questions, and find
              developer docs for webhooks and API integration.
            </p>
          </div>
        </section>

        {/* Content: 12-col grid, stacked on mobile */}
        <div className="mx-auto max-w-container px-6 py-12 md:px-8 md:py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Getting started - full width on mobile, 7 cols on desktop */}
            <section className="lg:col-span-7">
              <GettingStartedGuide />
            </section>

            {/* FAQs - full width, then 5 cols on desktop */}
            <section className="lg:col-span-5">
              <div className="rounded-[10px] border border-border bg-card p-6 shadow-card">
                {faqsLoaded && <FAQsAccordion faqs={faqs.length > 0 ? faqs : undefined} />}
                {!faqsLoaded && (
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 w-48 rounded bg-muted" />
                    <div className="h-10 w-full rounded bg-muted" />
                    <div className="h-12 w-full rounded bg-muted" />
                    <div className="h-12 w-full rounded bg-muted" />
                  </div>
                )}
              </div>
            </section>

            {/* Developer docs - full width */}
            <section className="lg:col-span-12">
              <DeveloperDocsLinks />
            </section>

            {/* Contact form - full width */}
            <section id="contact" className="lg:col-span-12 scroll-mt-24">
              <ContactSupportForm />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </AnimatedPage>
  )
}
