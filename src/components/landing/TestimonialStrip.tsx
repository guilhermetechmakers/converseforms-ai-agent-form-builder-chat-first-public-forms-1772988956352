import { Card, CardContent } from '@/components/ui/card'
import type { Testimonial as TestimonialType } from '@/types/landing'
import { cn } from '@/lib/utils'

interface TestimonialStripProps {
  testimonials: TestimonialType[]
  className?: string
}

export function TestimonialStrip({ testimonials, className }: TestimonialStripProps) {
  const list = Array.isArray(testimonials) ? testimonials : []

  if (list.length === 0) return null

  return (
    <section
      className={cn('border-t border-border px-6 py-16 md:py-24', className)}
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-container">
        <h2 id="testimonials-heading" className="text-center text-2xl font-semibold text-foreground md:text-3xl">
          What people say
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Teams use ConverseForms to capture and qualify leads without custom engineering.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <Card
              key={t?.id ?? t?.author}
              className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <CardContent className="pt-6">
                <blockquote className="text-muted-foreground">&ldquo;{t?.quote ?? ''}&rdquo;</blockquote>
                <footer className="mt-4">
                  <cite className="not-italic font-medium text-foreground">{t?.author ?? ''}</cite>
                  {t?.company && (
                    <span className="text-sm text-muted-foreground"> — {t.company}</span>
                  )}
                </footer>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
