/**
 * Guided onboarding checklist: step-by-step flow to publish first agent.
 * Progress persists via API; supports skip/back and contextual tips.
 */

import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ONBOARDING_STEPS,
  ONBOARDING_STEP_LABELS,
  type OnboardingStepId,
} from '@/types/onboarding'
import { useOnboardingStatus, useOnboardingCompleteStep } from '@/hooks/useOnboarding'
import { Check, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEP_ROUTES: Partial<Record<OnboardingStepId, string>> = {
  create_agent: '/dashboard/templates',
  add_fields: '/dashboard/agents/new',
  configure_validations: '/dashboard/agents/new',
  publish_agent: '/dashboard/agents',
  test_public_url: '/dashboard/sessions',
}

export function OnboardingChecklist() {
  const { data: onboarding, isLoading } = useOnboardingStatus()
  const completeStep = useOnboardingCompleteStep()

  const stepsCompleted: string[] = Array.isArray(onboarding?.stepsCompleted)
    ? onboarding.stepsCompleted
    : []
  const currentStep = onboarding?.currentStep ?? ONBOARDING_STEPS[0]
  const steps = ONBOARDING_STEPS

  const isStepDone = (step: OnboardingStepId) => stepsCompleted.includes(step)
  const allDone = steps.every((s) => stepsCompleted.includes(s))

  if (isLoading) {
    return (
      <Card className="rounded-[10px] border border-border">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (allDone) {
    return null
  }

  return (
    <Card className="rounded-[10px] border border-accent/20 bg-accent/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Get started</CardTitle>
        <CardDescription>
          Complete these steps to publish your first agent.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {steps.map((stepId) => {
          const done = isStepDone(stepId as OnboardingStepId)
          const label = ONBOARDING_STEP_LABELS?.[stepId as OnboardingStepId] ?? stepId
          const route = STEP_ROUTES[stepId as OnboardingStepId]
          return (
            <div
              key={stepId}
              className={cn(
                'flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 transition-colors',
                currentStep === stepId && 'border-accent/50 bg-accent/5'
              )}
            >
              {done ? (
                <Check className="h-5 w-5 shrink-0 text-success" aria-hidden />
              ) : (
                <Checkbox
                  checked={false}
                  onCheckedChange={() => completeStep.mutate(stepId)}
                  disabled={completeStep.isPending}
                  aria-label={`Mark "${label}" complete`}
                  className="shrink-0"
                />
              )}
              <span className={cn('text-sm flex-1', done && 'text-muted-foreground')}>
                {label}
              </span>
              {route && !done && (
                <Button variant="ghost" size="sm" asChild className="shrink-0">
                  <Link to={route}>
                    Go
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
