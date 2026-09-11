import { z } from 'zod'

// Mirrors the backend rules for the user-editable personal fields. Email,
// role, company, status and timestamps are system-managed and never edited.
export const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .min(2, 'First name must be between 2 and 50 characters')
    .max(50, 'First name must be between 2 and 50 characters'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be between 2 and 50 characters')
    .max(50, 'Last name must be between 2 and 50 characters'),
  phone: z
    .string()
    .trim()
    .max(30, 'Phone must not exceed 30 characters')
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined)),
})

export type ProfileFormValues = z.input<typeof profileSchema>