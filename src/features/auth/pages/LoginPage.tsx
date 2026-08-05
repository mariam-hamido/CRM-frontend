import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROUTES } from '@/app/router/routeConstants'
import type { AuthRedirectState } from '@/app/router/routeConstants'
import { useLogin } from '@/features/auth/hooks/useLogin'
import {
  AuthCard,
  AuthFooter,
  AuthForm,
  AuthHeader,
  FormErrorMessage,
  PasswordField,
  SubmitButton,
} from '@/features/auth/components'
import { loginSchema } from '@/features/auth/schemas/auth.schema'
import type { LoginFormValues } from '@/features/auth/schemas/auth.schema'
import type { FieldPath } from 'react-hook-form'

export default function LoginPage() {
  const login = useLogin()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    const fieldErrors = login.error?.fieldErrors
    if (!fieldErrors?.length) return

    for (const { field, message } of fieldErrors) {
      setError(field as FieldPath<LoginFormValues>, {
        type: 'server',
        message,
      })
    }
  }, [login.error, setError])

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: () => {
        const from = (location.state as AuthRedirectState | null)?.from
        navigate(from ?? ROUTES.dashboard, { replace: true })
      },
    })
  })

  return (
    <AuthCard>
      <AuthHeader
        title="Welcome back"
        description="Enter your credentials to access your account."
      />

      <AuthForm onSubmit={onSubmit}>
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
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {login.error?.message ? (
          <FormErrorMessage message={login.error.message} />
        ) : null}

        <SubmitButton isLoading={login.isPending}>Sign in</SubmitButton>
      </AuthForm>

      <AuthFooter>
        Don&apos;t have an account?{' '}
        <Link
          to={ROUTES.register}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </AuthFooter>
    </AuthCard>
  )
}
