import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { onboardingApi } from '@/api/onboarding'
import type { OnboardingState } from '@/types/onboarding'

const onboardingKeys = {
  all: ['onboarding'] as const,
  status: () => [...onboardingKeys.all, 'status'] as const,
}

function normalizeOnboarding(res: unknown): OnboardingState | null {
  if (!res || typeof res !== 'object') return null
  const o = res as { onboarding?: OnboardingState }
  const onboarding = o?.onboarding
  if (!onboarding || typeof onboarding.userId !== 'string') return null
  return {
    userId: onboarding.userId,
    stepsCompleted: Array.isArray(onboarding.stepsCompleted) ? onboarding.stepsCompleted : [],
    currentStep: typeof onboarding.currentStep === 'string' ? onboarding.currentStep : '',
    lastUpdated: typeof onboarding.lastUpdated === 'string' ? onboarding.lastUpdated : '',
  }
}

export function useOnboardingStatus() {
  return useQuery({
    queryKey: onboardingKeys.status(),
    queryFn: async () => {
      const res = await onboardingApi.getStatus()
      return normalizeOnboarding(res)
    },
    staleTime: 1000 * 60 * 2,
    retry: 1,
  })
}

export function useOnboardingCompleteStep() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (step: string) => onboardingApi.completeStep({ step }),
    onSuccess: (res) => {
      const onboarding = res && typeof res === 'object' && 'onboarding' in res ? (res as { onboarding?: OnboardingState }).onboarding : null
      if (onboarding) {
        queryClient.setQueryData(onboardingKeys.status(), onboarding)
      }
      queryClient.invalidateQueries({ queryKey: onboardingKeys.status() })
      toast.success('Step completed.')
    },
    onError: () => {
      toast.error('Could not save progress.')
    },
  })
}

/** Alias for useOnboardingCompleteStep (used by Dashboard and OnboardingChecklist) */
export const useCompleteOnboardingStep = useOnboardingCompleteStep
