import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface HeroSectionProps {
  title: string
  subtitle: string
  /** Primary CTA: Try Demo (opens public demo) */
  primaryCta: { label: string; href: string }
  /** Secondary CTA: Sign Up */
  secondaryCta: { label: string; href: string }
  className?: string
}

export function HeroSection({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden px-6 py-20 md:py-28',
        'bg-gradient-to-b from-muted/30 to-background',
        className
      )}
      aria-labelledby="hero-heading"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgb(var(--accent)/0.08),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-container text-center">
        <h1
          id="hero-heading"
          className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-[56px]"
        >
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          {subtitle}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" asChild>
            <Link to={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
          <Button size="lg" variant="outline" className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" asChild>
            <Link to={secondaryCta.href}>{secondaryCta.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
