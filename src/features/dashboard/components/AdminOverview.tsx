import { Link } from 'react-router-dom'
import {
  Building2,
  MailPlus,
  Settings,
  UserCheck,
  UserCog,
  UserRoundX,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/app/router/routeConstants'
import { useGetCompany } from '@/features/companies/hooks/useGetCompany'
import { useGetEmployees } from '@/features/employees/hooks/useGetEmployees'
import { useGetInvitations } from '@/features/invitations/hooks/useGetInvitations'
import {
  DashboardError,
  DashboardLoading,
} from '@/features/dashboard/components'

export function AdminOverview() {
  const companyQuery = useGetCompany()
  const activeEmployeesQuery = useGetEmployees({ status: 'active', limit: 1 })
  const inactiveEmployeesQuery = useGetEmployees({
    status: 'inactive',
    limit: 1,
  })
  const pendingInvitationsQuery = useGetInvitations({
    status: 'pending',
    limit: 1,
  })

  const company = companyQuery.data
  const activeEmployees = activeEmployeesQuery.data?.pagination?.total ?? 0
  const inactiveEmployees = inactiveEmployeesQuery.data?.pagination?.total ?? 0
  const pendingInvitations =
    pendingInvitationsQuery.data?.pagination?.total ?? 0

  const isLoading =
    companyQuery.isPending ||
    activeEmployeesQuery.isPending ||
    inactiveEmployeesQuery.isPending ||
    pendingInvitationsQuery.isPending

  const isError =
    companyQuery.isError ||
    activeEmployeesQuery.isError ||
    inactiveEmployeesQuery.isError ||
    pendingInvitationsQuery.isError

  const error =
    companyQuery.error ??
    activeEmployeesQuery.error ??
    inactiveEmployeesQuery.error ??
    pendingInvitationsQuery.error

  if (isLoading) {
    return (
      <DashboardLoading
        label="Loading company overview…"
        className="sm:col-span-2 xl:col-span-4"
      />
    )
  }

  if (isError) {
    return (
      <DashboardError
        message={error?.message}
        onRetry={() => {
          void companyQuery.refetch()
          void activeEmployeesQuery.refetch()
          void inactiveEmployeesQuery.refetch()
          void pendingInvitationsQuery.refetch()
        }}
        className="sm:col-span-2 xl:col-span-4"
      />
    )
  }

  return (
    <section aria-label="Company overview" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="size-4" aria-hidden="true" />
            Company
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold">{company?.name ?? '—'}</p>
            {(company?.industry || company?.website || company?.city) && (
              <p className="text-sm text-muted-foreground">
                {[company?.industry, company?.city, company?.country]
                  .filter(Boolean)
                  .join(' · ')}
                {company?.website && (
                  <>
                    {' · '}
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-foreground"
                    >
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  </>
                )}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={ROUTES.settings}>
                <Settings className="size-4" aria-hidden="true" />
                Company Settings
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to={ROUTES.employees}>
                <UserCog className="size-4" aria-hidden="true" />
                Manage Employees
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to={ROUTES.invitations}>
                <MailPlus className="size-4" aria-hidden="true" />
                Invite Employee
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <UserCheck className="size-4" aria-hidden="true" />
              Active Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tracking-tight">
              {activeEmployees}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <UserRoundX className="size-4" aria-hidden="true" />
              Inactive Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tracking-tight">
              {inactiveEmployees}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MailPlus className="size-4" aria-hidden="true" />
              Pending Invitations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tracking-tight">
              {pendingInvitations}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
