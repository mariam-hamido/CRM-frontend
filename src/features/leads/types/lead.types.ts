import type { ApiResponse, Pagination } from '@/types/api'
import type { Customer } from '@/features/customers/types/customer.types'

export const LEAD_STATUSES = [
  'new',
  'contacted',
  'qualified',
  'proposal_sent',
  'negotiation',
  'converted',
  'lost',
] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const LEAD_SOURCES = [
  'website',
  'referral',
  'social_media',
  'cold_call',
  'email',
  'advertisement',
  'event',
  'other',
] as const
export type LeadSource = (typeof LEAD_SOURCES)[number]

export const LEAD_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'firstName',
  'lastName',
  'companyName',
  'score',
  'estimatedValue',
  'status',
] as const
export type LeadSortField = (typeof LEAD_SORT_FIELDS)[number]

export const LEAD_SORT_ORDERS = ['asc', 'desc'] as const
export type LeadSortOrder = (typeof LEAD_SORT_ORDERS)[number]

export interface Lead {
  _id: string
  company: string
  owner: string
  firstName: string
  lastName: string
  companyName?: string
  email?: string
  phone?: string
  status: LeadStatus
  source: LeadSource
  score: number
  estimatedValue: number
  notes?: string
  convertedCustomer: string | null
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  fullName: string
}

export interface LeadListParams {
  page?: number
  limit?: number
  search?: string
  status?: LeadStatus
  source?: LeadSource
  owner?: string
  score?: number
  estimatedValue?: number
  isDeleted?: boolean
  sortBy?: LeadSortField
  sortOrder?: LeadSortOrder
}

export interface LeadListData {
  leads: Lead[]
  pagination: Pagination
}

export interface CreateLeadPayload {
  firstName: string
  lastName: string
  companyName?: string
  email?: string
  phone?: string
  status?: LeadStatus
  source?: LeadSource
  score?: number
  estimatedValue?: number
  notes?: string
}

export interface UpdateLeadPayload {
  firstName?: string
  lastName?: string
  companyName?: string
  email?: string
  phone?: string
  status?: LeadStatus
  source?: LeadSource
  score?: number
  estimatedValue?: number
  notes?: string
}

export interface ConvertCustomerData {
  companyName?: string
  industry?: string
  website?: string
  email?: string
  phone?: string
  country?: string
  city?: string
  address?: string
  annualRevenue?: number
  employeesCount?: number
}

export type ConvertLeadPayload =
  | { customerId: string }
  | { createCustomer: true; customerData: ConvertCustomerData }

export interface ConvertLeadData {
  lead: Lead
  customer: Customer
}

export type LeadListResponse = ApiResponse<LeadListData>
export type LeadResponse = ApiResponse<Lead>
export type DeleteLeadResponse = ApiResponse<null>
export type ConvertLeadResponse = ApiResponse<ConvertLeadData>
