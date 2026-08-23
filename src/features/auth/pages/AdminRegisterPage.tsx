import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { FieldPath } from 'react-hook-form'
import { toast } from 'sonner'
import { ROUTES } from '@/app/router/routeConstants'
import { useAdminRegister } from '@/features/auth/hooks/useAdminRegister'
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
  adminRegisterSchema,
  type RegistrationFormValues,
} from '@/features/auth/schemas/auth.schema'

export default function AdminRegisterPage() {
  const registerMutation = useAdminRegister()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(adminRegisterSchema),
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
        toast.success(
          'Company created successfully. Please sign in to continue.'
        )
        navigate(ROUTES.login)
      },
    })
  })

  return (
    <AuthCard>
      <AuthHeader
        title="Register your company"
        description="Create a new company account as its administrator."
      />

      <AuthForm onSubmit={onSubmit}>
        <RegistrationFields register={register} errors={errors} />

        {registerMutation.error?.message ? (
          <FormErrorMessage message={registerMutation.error.message} />
        ) : null}

        <SubmitButton
          isLoading={registerMutation.isPending}
          loadingText="Creating company…"
        >
          Create company account
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
