import type { ApiResponse, Pagination } from '@/types/api'

export interface CustomerContact {
  _id: string
  customer: string
  company: string
  firstName: string
  lastName: string
  jobTitle?: string
  email?: string
  phone?: string
  isPrimary: boolean
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
  fullName: string
}

export const CONTACT_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'firstName',
  'lastName',
  'email',
] as const
export type ContactSortField = (typeof CONTACT_SORT_FIELDS)[number]

export const CONTACT_SORT_ORDERS = ['asc', 'desc'] as const
export type ContactSortOrder = (typeof CONTACT_SORT_ORDERS)[number]

export interface ContactListParams {
  page?: number
  limit?: number
  search?: string
  customer?: string
  isPrimary?: boolean
  sortBy?: ContactSortField
  sortOrder?: ContactSortOrder
}

export interface ContactListData {
  contacts: CustomerContact[]
  pagination: Pagination
}

export interface CreateContactPayload {
  customer: string
  firstName: string
  lastName: string
  jobTitle?: string
  email?: string
  phone?: string
  isPrimary?: boolean
}

export interface UpdateContactPayload {
  firstName?: string
  lastName?: string
  jobTitle?: string
  email?: string
  phone?: string
  isPrimary?: boolean
}

export type ContactListResponse = ApiResponse<ContactListData>
export type ContactResponse = ApiResponse<CustomerContact>
export type DeleteContactResponse = ApiResponse<null>
