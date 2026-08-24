import { z } from 'zod'

// Shape validation only - duplicate/already-registered checks belong to the
// backend, which stays authoritative.
export const inviteEmployeeSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .pipe(z.email('A valid email is required')),
})

export type InviteEmployeeFormValues = z.infer<typeof inviteEmployeeSchema>
