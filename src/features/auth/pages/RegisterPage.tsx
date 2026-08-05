import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROUTES } from '@/app/router/routeConstants'
import { useRegister } from '@/features/auth/hooks/useRegister'
import {
  AuthCard,
  AuthFooter,
  AuthForm,
  AuthHeader,
  FormErrorMessage,
  PasswordField,
  SubmitButton,
} from '@/features/auth/components'
import { registerSchema } from '@/features/auth/schemas/auth.schema'
import type { RegisterFormValues } from '@/features/auth/schemas/auth.schema'
import type { FieldPath } from 'react-hook-form'

export default function RegisterPage() {
  const registerMutation = useRegister()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      company: '',
      phone: '',
    },
  })

  useEffect(() => {
    const fieldErrors = registerMutation.error?.fieldErrors
    if (!fieldErrors?.length) return

    for (const { field, message } of fieldErrors) {
      setError(field as FieldPath<RegisterFormValues>, {
        type: 'server',
        message,
      })
    }
  }, [registerMutation.error, setError])

  const onSubmit = handleSubmit((values) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Account created successfully. Please sign in.')
        navigate(ROUTES.login)
      },
    })
  })

  return (
    <AuthCard>
      <AuthHeader
        title="Create your account"
        description="Join FlowCRM and start managing your pipeline."
      />

      <AuthForm onSubmit={onSubmit}>
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

        <div className="flex flex-col gap-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            autoComplete="organization"
            placeholder="Your company ID (MongoDB ObjectId)"
            aria-invalid={errors.company ? true : undefined}
            aria-describedby={
              errors.company
                ? 'company-error'
                : 'company-hint'
            }
            {...register('company')}
          />
          <p
            id="company-hint"
            className="text-xs text-muted-foreground"
          >
            Ask your workspace administrator for your company ID.
          </p>
          <FormErrorMessage
            message={errors.company?.message}
            id="company-error"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">
            Phone <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            {...register('phone')}
          />
          <FormErrorMessage message={errors.phone?.message} id="phone-error" />
        </div>

        <PasswordField
          label="Password"
          id="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {registerMutation.error?.message ? (
          <FormErrorMessage message={registerMutation.error.message} />
        ) : null}

        <SubmitButton
          isLoading={registerMutation.isPending}
          loadingText="Creating account…"
        >
          Create account
        </SubmitButton>
      </AuthForm>

      <AuthFooter>
        Already have an account?{' '}
        <Link
          to={ROUTES.login}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </AuthFooter>
    </AuthCard>
  )
}
