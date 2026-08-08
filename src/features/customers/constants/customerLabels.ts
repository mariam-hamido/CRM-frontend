import type {
  CustomerSource,
  CustomerStatus,
} from '@/features/customers/types/customer.types'

export const CUSTOMER_STATUS_LABELS: Record<CustomerStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  prospect: 'Prospect',
}

export const CUSTOMER_SOURCE_LABELS: Record<CustomerSource, string> = {
  website: 'Website',
  referral: 'Referral',
  social_media: 'Social media',
  cold_call: 'Cold call',
  email: 'Email',
  advertisement: 'Advertisement',
  other: 'Other',
}
