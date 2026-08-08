import type { CustomerFormValues } from '@/features/customers/schemas/customer.schema'
import type {
  CreateCustomerPayload,
  Customer,
} from '@/features/customers/types/customer.types'

export function customerToFormValues(customer: Customer): CustomerFormValues {
  return {
    companyName: customer.companyName,
    industry: customer.industry ?? '',
    website: customer.website ?? '',
    email: customer.email ?? '',
    phone: customer.phone ?? '',
    country: customer.country ?? '',
    city: customer.city ?? '',
    address: customer.address ?? '',
    status: customer.status ?? 'prospect',
    source: customer.source ?? 'other',
    annualRevenue:
      customer.annualRevenue !== undefined && customer.annualRevenue !== 0
        ? String(customer.annualRevenue)
        : '',
    employeesCount:
      customer.employeesCount !== undefined && customer.employeesCount !== 0
        ? String(customer.employeesCount)
        : '',
  }
}

export function toCustomerPayload(
  values: CustomerFormValues
): CreateCustomerPayload {
  return {
    companyName: values.companyName,
    ...(values.industry ? { industry: values.industry } : {}),
    ...(values.website ? { website: values.website } : {}),
    ...(values.email ? { email: values.email } : {}),
    ...(values.phone ? { phone: values.phone } : {}),
    ...(values.country ? { country: values.country } : {}),
    ...(values.city ? { city: values.city } : {}),
    ...(values.address ? { address: values.address } : {}),
    status: values.status,
    source: values.source,
    ...(values.annualRevenue
      ? { annualRevenue: Number(values.annualRevenue) }
      : {}),
    ...(values.employeesCount
      ? { employeesCount: Number(values.employeesCount) }
      : {}),
  }
}

const REVENUE_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatRevenue(value?: number) {
  return value === undefined ? '—' : REVENUE_FORMATTER.format(value)
}

export function formatCount(value?: number) {
  return value === undefined ? '—' : value.toLocaleString()
}

export function formatDate(value?: string) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
