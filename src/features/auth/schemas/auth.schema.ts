import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('A valid email is required'),
  password: z.string().min(1, 'Password is required'),
})

// Shared field rules for both registration flows. The backend performs the
// authoritative checks (company existence/invitation for employees, global
// email uniqueness); the frontend only validates shape.
const registrationDetails = {
  companyName: z
    .string()
    .trim()
    .min(1, 'Company name is required')
    .min(2, 'Company name must be between 2 and 100 characters')
    .max(100, 'Company name must be between 2 and 100 characters'),
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
}

// Company Admin First Registration payload.
export const adminRegisterSchema = z.object(registrationDetails)

// Employee First Registration payload - same fields; the backend resolves
// the company by name and verifies a pending invitation for the email.
export const employeeRegisterSchema = z.object(registrationDetails)

// Both flows share identical form shapes, so forms can share one values type.
export type RegistrationFormValues = z.input<typeof adminRegisterSchema>
export type LoginFormValues = z.input<typeof loginSchema>
