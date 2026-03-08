import { Link } from 'react-router-dom'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getFeatureIcon } from './feature-icons'
import type { FeatureCard as FeatureCardType } from '@/types/landing'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  feature: FeatureCardType
  className?: string
}

export function FeatureCard({ feature, className }: FeatureCardProps) {
  const Icon = getFeatureIcon(feature?.iconName ?? 'MessageSquare')
  const title = feature?.title ?? ''
  const description = feature?.description ?? ''
  const cta = feature?.cta

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg',
        className
      )}
    >
      <CardHeader>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {cta?.label && cta?.href && (
          <Button variant="link" className="h-auto p-0 font-medium" asChild>
            <Link to={cta.href}>{cta.label}</Link>
          </Button>
        )}
      </CardHeader>
    </Card>
  )
}
