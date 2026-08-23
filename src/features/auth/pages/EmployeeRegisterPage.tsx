import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { FieldPath } from 'react-hook-form'
import { toast } from 'sonner'
import { ROUTES } from '@/app/router/routeConstants'
import { useEmployeeRegister } from '@/features/auth/hooks/useEmployeeRegister'
import {
  AuthCard,
  AuthFooter,
  AuthForm,
  AuthHeader,
  FormErrorMessage,
  RegistrationFields,
  SubmitButton,
} from '@/features/auth/components'
import {
  employeeRegisterSchema,
  type RegistrationFormValues,
} from '@/features/auth/schemas/auth.schema'

// The backend deliberately returns one generic rejection for unknown
// companies and uninvited/removed emails, so it never discloses which
// companies exist. Translate it into clear guidance without exposing
// any cross-company information.
const INVITATION_REJECTED_MESSAGE = 'Invalid company name or unapproved email'
const INVITATION_REJECTED_DISPLAY =
  'We could not complete your registration. Please check your company name or contact your company administrator to confirm your email has been invited.'

export default function EmployeeRegisterPage() {
  const registerMutation = useEmployeeRegister()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(employeeRegisterSchema),
    mode: 'onTouched',
    defaultValues: {
      companyName: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    const fieldErrors = registerMutation.error?.fieldErrors
    if (!fieldErrors?.length) return

    for (const { field, message } of fieldErrors) {
      setError(field as FieldPath<RegistrationFormValues>, {
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

  const errorMessage =
    registerMutation.error?.message === INVITATION_REJECTED_MESSAGE
      ? INVITATION_REJECTED_DISPLAY
      : registerMutation.error?.message

  return (
    <AuthCard>
      <AuthHeader
        title="Join your company"
        description="Your company administrator must have invited your email address."
      />

      <AuthForm onSubmit={onSubmit}>
        <RegistrationFields register={register} errors={errors} />

        {errorMessage ? <FormErrorMessage message={errorMessage} /> : null}

        <SubmitButton
          isLoading={registerMutation.isPending}
          loadingText="Creating account…"
        >
          Create account
        </SubmitButton>
      </AuthForm>

      <AuthFooter>
        <Link
          to={ROUTES.register}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Back to registration options
        </Link>
      </AuthFooter>
    </AuthCard>
  )
}
