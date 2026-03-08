import { api } from '@/lib/api'
import type {
  OnboardingStatusResponse,
  CompleteStepRequest,
  CompleteStepResponse,
} from '@/types/onboarding'

export const onboardingApi = {
  getStatus: () => api.get<OnboardingStatusResponse>('/onboarding/status'),
  completeStep: (body: CompleteStepRequest) =>
    api.post<CompleteStepResponse>('/onboarding/complete-step', body),
}
