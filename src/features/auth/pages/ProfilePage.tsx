import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { selectUser, useAuthStore } from '@/features/auth/store/authStore'

const ROLE_LABELS = {
  admin: 'Admin',
  manager: 'Manager',
  sales: 'Sales',
} as const

function formatDate(value?: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function ProfilePage() {
  const user = useAuthStore(selectUser)

  const initials = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : '?'
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Profile'

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          View your account information and workspace access details.
        </p>
      </header>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="size-14">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="truncate">{displayName}</CardTitle>
            <CardDescription className="truncate">
              {user?.email ?? 'No email available'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                First name
              </dt>
              <dd className="min-w-0 break-words text-sm">
                {user?.firstName ?? '—'}
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Last name
              </dt>
              <dd className="min-w-0 break-words text-sm">
                {user?.lastName ?? '—'}
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Email
              </dt>
              <dd className="min-w-0 break-words text-sm">{user?.email ?? '—'}</dd>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Phone
              </dt>
              <dd className="min-w-0 break-words text-sm">{user?.phone ?? '—'}</dd>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Role
              </dt>
              <dd className="min-w-0 break-words text-sm">
                {user ? ROLE_LABELS[user.role] : '—'}
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Status
              </dt>
              <dd className="min-w-0 break-words text-sm">
                {user ? (user.isActive ? 'Active' : 'Inactive') : '—'}
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Last login
              </dt>
              <dd className="min-w-0 break-words text-sm">
                {formatDate(user?.lastLogin)}
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Joined
              </dt>
              <dd className="min-w-0 break-words text-sm">
                {formatDate(user?.createdAt)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
