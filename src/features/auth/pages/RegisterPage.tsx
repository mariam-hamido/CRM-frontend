import { Link } from 'react-router-dom'
import { Building2, Users } from 'lucide-react'
import { ROUTES } from '@/app/router/routeConstants'
import {
  AuthCard,
  AuthFooter,
  AuthHeader,
} from '@/features/auth/components'

const registrationModes = [
  {
    to: ROUTES.registerAdmin,
    icon: Building2,
    title: 'Company Admin',
    description:
      'Create a new company and register yourself as its administrator.',
  },
  {
    to: ROUTES.registerEmployee,
    icon: Users,
    title: 'Employee',
    description:
      'Join an existing company after your administrator invited your email.',
  },
]

export default function RegisterPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Create your account"
        description="Choose how you want to register."
      />

      <div className="flex flex-col gap-3">
        {registrationModes.map(({ to, icon: Icon, title, description }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-accent"
          >
            <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-medium text-foreground group-hover:text-primary">
                Register as {title}
              </span>
              <span className="text-sm text-muted-foreground">
                {description}
              </span>
            </span>
          </Link>
        ))}
      </div>

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
