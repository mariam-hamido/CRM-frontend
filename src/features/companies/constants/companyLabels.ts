import type {
  CompanyStatus,
  CompanySubscriptionPlan,
} from '@/features/companies/types/company.types'

export const COMPANY_SUBSCRIPTION_PLAN_LABELS: Record<
  CompanySubscriptionPlan,
  string
> = {
  free: 'Free',
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise',
}

export const COMPANY_STATUS_LABELS: Record<CompanyStatus, string> = {
  trial: 'Trial',
  active: 'Active',
  suspended: 'Suspended',
  cancelled: 'Cancelled',
}
