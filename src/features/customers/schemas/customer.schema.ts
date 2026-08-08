import { z } from 'zod'
import {
  CUSTOMER_SOURCES,
  CUSTOMER_STATUSES,
} from '@/features/customers/types/customer.types'

const optionalTrimmedString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined))

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || z.url().safeParse(value).success,
    'A valid website URL is required'
  )
  .transform((value) => (value ? value : undefined))

const optionalEmail = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || z.email().safeParse(value).success,
    'A valid email is required'
  )
  .transform((value) => (value ? value : undefined))

const optionalNonNegativeNumber = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || (Number.isFinite(Number(value)) && Number(value) >= 0),
    'Must be zero or a positive number'
  )

const optionalNonNegativeInteger = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) =>
      !value || (Number.isInteger(Number(value)) && Number(value) >= 0),
    'Must be zero or a positive whole number'
  )

export const customerFormSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, 'Company name must be between 2 and 100 characters')
    .max(100, 'Company name must be between 2 and 100 characters'),
  industry: optionalTrimmedString,
  website: optionalUrl,
  email: optionalEmail,
  phone: optionalTrimmedString,
  country: optionalTrimmedString,
  city: optionalTrimmedString,
  address: optionalTrimmedString,
  status: z.enum(CUSTOMER_STATUSES),
  source: z.enum(CUSTOMER_SOURCES),
  annualRevenue: optionalNonNegativeNumber,
  employeesCount: optionalNonNegativeInteger,
})

export type CustomerFormValues = z.input<typeof customerFormSchema>
