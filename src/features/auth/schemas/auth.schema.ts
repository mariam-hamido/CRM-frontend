import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('A valid email is required'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
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
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email('A valid email is required')),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  company: z
    .string()
    .min(1, 'Company is required')
    .regex(/^[a-f\d]{24}$/i, 'Company must be a valid MongoDB ObjectId'),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.input<typeof registerSchema>
