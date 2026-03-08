export interface OnboardingState {
  userId: string
  stepsCompleted: string[]
  currentStep: string
  lastUpdated: string
}

export interface OnboardingStatusResponse {
  onboarding: OnboardingState
}

export interface CompleteStepRequest {
  step: string
}

export interface CompleteStepResponse {
  onboarding: OnboardingState
  nextStep?: string
}

export const ONBOARDING_STEPS = [
  'create_agent',
  'add_fields',
  'configure_validations',
  'publish_agent',
  'test_public_url',
] as const

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]

export const ONBOARDING_STEP_LABELS: Record<OnboardingStepId, string> = {
  create_agent: 'Create your first agent (or clone a template)',
  add_fields: 'Add a few required fields',
  configure_validations: 'Configure basic validations',
  publish_agent: 'Publish the agent',
  test_public_url: 'Test the public URL',
}
