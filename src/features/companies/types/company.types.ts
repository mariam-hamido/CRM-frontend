import type { ApiResponse } from '@/types/api'

export const COMPANY_SUBSCRIPTION_PLANS = [
  'free',
  'starter',
  'professional',
  'enterprise',
] as const

export const COMPANY_STATUSES = ['trial', 'active', 'suspended', 'cancelled'] as const

export type CompanySubscriptionPlan = (typeof COMPANY_SUBSCRIPTION_PLANS)[number]
export type CompanyStatus = (typeof COMPANY_STATUSES)[number]

export interface Company {
  _id: string
  name: string
  logo?: string
  industry?: string
  website?: string
  phone?: string
  email?: string
  country?: string
  city?: string
  address?: string
  subscriptionPlan: CompanySubscriptionPlan
  status: CompanyStatus
  timezone: string
  currency: string
  createdBy?: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdateCompanyRequest {
  name?: string
  logo?: string
  industry?: string
  website?: string
  phone?: string
  email?: string
  country?: string
  city?: string
  address?: string
  subscriptionPlan?: CompanySubscriptionPlan
  status?: CompanyStatus
  timezone?: string
  currency?: string
}

export type GetCompanyResponse = ApiResponse<Company>
export type UpdateCompanyResponse = ApiResponse<Company>
