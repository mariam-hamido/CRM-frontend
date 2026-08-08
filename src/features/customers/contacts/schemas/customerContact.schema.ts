import { z } from 'zod'

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

export const customerContactFormSchema = z.object({
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
  jobTitle: z
    .string()
    .trim()
    .max(100, 'Job title must be at most 100 characters')
    .optional()
    .transform((value) => (value ? value : undefined)),
  email: optionalEmail,
  phone: optionalTrimmedString,
  isPrimary: z.boolean(),
})

export type CustomerContactFormValues = z.input<typeof customerContactFormSchema>
