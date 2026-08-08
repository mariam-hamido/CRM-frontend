import { z } from 'zod'
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
} from '@/features/leads/types/lead.types'

const optionalTrimmedString = z
  .string()
  .trim()
  .optional()
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

const optionalScore = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) =>
      !value ||
      (Number.isFinite(Number(value)) &&
        Number(value) >= 0 &&
        Number(value) <= 100),
    'Must be a number between 0 and 100'
  )

const optionalNonNegativeNumber = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || (Number.isFinite(Number(value)) && Number(value) >= 0),
    'Must be zero or a positive number'
  )

export const leadFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(50, 'First name must be at most 50 characters'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be at most 50 characters'),
  companyName: z
    .string()
    .trim()
    .max(150, 'Company name must be at most 150 characters')
    .optional()
    .transform((value) => (value ? value : undefined)),
  email: optionalEmail,
  phone: optionalTrimmedString,
  status: z.enum(LEAD_STATUSES),
  source: z.enum(LEAD_SOURCES),
  score: optionalScore,
  estimatedValue: optionalNonNegativeNumber,
  notes: optionalTrimmedString,
})

export type LeadFormValues = z.input<typeof leadFormSchema>
