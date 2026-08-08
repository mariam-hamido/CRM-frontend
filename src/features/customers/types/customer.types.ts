import type { ApiResponse, Pagination } from '@/types/api'

export const CUSTOMER_STATUSES = ['active', 'inactive', 'prospect'] as const
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number]

export const CUSTOMER_SOURCES = [
  'website',
  'referral',
  'social_media',
  'cold_call',
  'email',
  'advertisement',
  'other',
] as const
export type CustomerSource = (typeof CUSTOMER_SOURCES)[number]

export interface Customer {
  _id: string
  company: string
  owner: string
  companyName: string
  industry?: string
  website?: string
  email?: string
  phone?: string
  country?: string
  city?: string
  address?: string
  status?: CustomerStatus
  source?: CustomerSource
  annualRevenue?: number
  employeesCount?: number
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
}

export interface CustomerListParams {
  page?: number
  limit?: number
  search?: string
  status?: CustomerStatus
  source?: CustomerSource
}

export interface CustomerListData {
  customers: Customer[]
  pagination: Pagination
}

export interface CreateCustomerPayload {
  company: string
  owner: string
  companyName: string
  industry?: string
  website?: string
  email?: string
  phone?: string
  country?: string
  city?: string
  address?: string
  status?: CustomerStatus
  source?: CustomerSource
  annualRevenue?: number
  employeesCount?: number
}

export interface UpdateCustomerPayload extends CreateCustomerPayload {}

export type CustomerListResponse = ApiResponse<CustomerListData>
export type CustomerResponse = ApiResponse<Customer>
export type DeleteCustomerResponse = ApiResponse<null>
