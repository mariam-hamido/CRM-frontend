import { z } from 'zod'
import {
  COMPANY_STATUSES,
  COMPANY_SUBSCRIPTION_PLANS,
} from '@/features/companies/types/company.types'

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

export const companyUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Company name must be between 2 and 100 characters')
    .max(100, 'Company name must be between 2 and 100 characters'),
  logo: optionalTrimmedString,
  industry: optionalTrimmedString,
  website: optionalUrl,
  phone: optionalTrimmedString,
  email: optionalEmail,
  country: optionalTrimmedString,
  city: optionalTrimmedString,
  address: optionalTrimmedString,
  subscriptionPlan: z.enum(COMPANY_SUBSCRIPTION_PLANS).optional(),
  status: z.enum(COMPANY_STATUSES).optional(),
  timezone: optionalTrimmedString,
  currency: optionalTrimmedString,
})

export type CompanyUpdateFormValues = z.input<typeof companyUpdateSchema>
export type CompanyUpdatePayload = z.output<typeof companyUpdateSchema>

export function toCompanyUpdatePayload(
  values: CompanyUpdateFormValues
): CompanyUpdatePayload {
  return companyUpdateSchema.parse(values)
}
