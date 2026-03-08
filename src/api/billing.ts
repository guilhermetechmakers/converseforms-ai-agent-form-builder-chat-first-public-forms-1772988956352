/**
 * Billing/usage API – current usage vs quota.
 * Guard responses with defaults for usage, quota, overage.
 */

import { api } from '@/lib/api'
import type { BillingUsageResponse } from '@/types/analytics'

export const billingApi = {
  /** GET /api/billing/usage */
  getUsage: () => api.get<BillingUsageResponse>('/billing/usage'),
}
