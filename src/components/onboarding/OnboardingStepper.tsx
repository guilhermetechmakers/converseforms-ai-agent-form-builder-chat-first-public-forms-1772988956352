/**
 * Guided onboarding stepper: checklist with progress, contextual tips, persist via API or localStorage.
 */

import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { ChevronRight, Check, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  ONBOARDING_STEPS,
  ONBOARDING_STEP_LABELS,
  type OnboardingStepId,
} from '@/types/onboarding'
import { useOnboardingStatus, useOnboardingCompleteStep } from '@/hooks/useOnboarding'

const STEP_ROUTES: Partial<Record<OnboardingStepId, string>> = {
  create_agent: '/dashboard/templates',
  add_fields: '/dashboard/agents',
  configure_validations: '/dashboard/agents',
  publish_agent: '/dashboard/agents',
  test_public_url: '/dashboard/agents',
}

const TIPS: Partial<Record<OnboardingStepId, string>> = {
  create_agent: 'Start from a template to get going quickly, or create an agent from scratch.',
  add_fields: 'Add at least name and email. Order determines the conversation flow.',
  configure_validations: 'Use email format and required checks so you capture valid leads.',
  publish_agent: 'Publishing generates a public URL you can share with visitors.',
  test_public_url: 'Open the public link in another tab and run through the form once.',
}

export interface OnboardingStepperProps {
  onDismiss?: () => void
  className?: string
}

export function OnboardingStepper({ onDismiss, className }: OnboardingStepperProps) {
  const { data: onboarding, isLoading } = useOnboardingStatus()
  const completeStep = useOnboardingCompleteStep()

  const stepsCompleted = Array.isArray(onboarding?.stepsCompleted) ? onboarding.stepsCompleted : []
  const progress = ONBOARDING_STEPS.length > 0
    ? (stepsCompleted.length / ONBOARDING_STEPS.length) * 100
    : 0

  const handleComplete = (stepId: string) => {
    if (stepsCompleted.includes(stepId)) return
    completeStep.mutate(stepId)
  }

  if (isLoading) {
    return (
      <Card className={cn('animate-pulse', className)}>
        <CardHeader>
          <div className="h-6 w-48 bg-muted rounded" />
          <div className="h-4 w-64 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-2 w-full bg-muted rounded" />
          <div className="mt-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('animate-fade-in-up', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Get started</CardTitle>
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss} aria-label="Dismiss">
              Dismiss
            </Button>
          )}
        </div>
        <CardDescription>
          Complete these steps to publish your first agent and start collecting leads.
        </CardDescription>
        <Progress value={progress} className="h-2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {ONBOARDING_STEPS.map((stepId) => {
            const label = ONBOARDING_STEP_LABELS[stepId]
            const done = stepsCompleted.includes(stepId)
            const route = STEP_ROUTES[stepId]
            const tip = TIPS[stepId]

            return (
              <li
                key={stepId}
                className={cn(
                  'flex items-start gap-3 rounded-lg border border-border p-3 transition-colors',
                  done && 'bg-muted/30'
                )}
              >
                <div className="pt-0.5">
                  {done ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-success-foreground">
                      <Check className="h-3 w-3" />
                    </span>
                  ) : (
                    <Checkbox
                      id={`onboarding-${stepId}`}
                      checked={false}
                      onCheckedChange={(checked) => checked === true && handleComplete(stepId)}
                      disabled={completeStep.isPending}
                      aria-label={`Mark "${label}" complete`}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor={`onboarding-${stepId}`}
                    className={cn(
                      'text-sm font-medium',
                      done ? 'text-muted-foreground line-through' : 'text-foreground'
                    )}
                  >
                    {label}
                  </label>
                  {tip && !done && (
                    <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                      <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      {tip}
                    </p>
                  )}
                  {route && !done && (
                    <Button variant="link" size="sm" className="h-auto p-0 mt-1" asChild>
                      <Link to={route}>
                        Go
                        <ChevronRight className="ml-0.5 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
