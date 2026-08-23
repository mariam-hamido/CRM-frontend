import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormErrorMessage } from './FormErrorMessage'
import { PasswordField } from './PasswordField'
import type { RegistrationFormValues } from '@/features/auth/schemas/auth.schema'

interface RegistrationFieldsProps {
  register: UseFormRegister<RegistrationFormValues>
  errors: FieldErrors<RegistrationFormValues>
}

/**
 * Shared identity + company-name fields used by both the admin and the
 * employee registration forms. Only user-entered values are collected -
 * no company id, role, invitation or status fields exist in this flow.
 */
export function RegistrationFields({
  register,
  errors,
}: RegistrationFieldsProps) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          autoComplete="organization"
          aria-invalid={errors.companyName ? true : undefined}
          aria-describedby={
            errors.companyName ? 'companyName-error' : undefined
          }
          {...register('companyName')}
        />
        <FormErrorMessage
          message={errors.companyName?.message}
          id="companyName-error"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            autoComplete="given-name"
            aria-invalid={errors.firstName ? true : undefined}
            aria-describedby={
              errors.firstName ? 'firstName-error' : undefined
            }
            {...register('firstName')}
          />
          <FormErrorMessage
            message={errors.firstName?.message}
            id="firstName-error"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            autoComplete="family-name"
            aria-invalid={errors.lastName ? true : undefined}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            {...register('lastName')}
          />
          <FormErrorMessage
            message={errors.lastName?.message}
            id="lastName-error"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        <FormErrorMessage message={errors.email?.message} id="email-error" />
      </div>

      <PasswordField
        label="Password"
        id="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />
    </>
  )
}
