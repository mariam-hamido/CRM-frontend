import { useNavigate } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import { ROUTES } from '@/app/router/routeConstants'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { COMPANY_STATUS_LABELS } from '@/features/companies/constants/companyLabels'
import type {
  Company,
  CompanyStatus,
} from '@/features/companies/types/company.types'
import { cn } from '@/lib/utils'

const STATUS_BADGE_VARIANTS: Record<
  CompanyStatus,
  NonNullable<BadgeProps['variant']>
> = {
  active: 'default',
  trial: 'outline',
  suspended: 'destructive',
  cancelled: 'secondary',
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'C'
  )
}

export function CompanyHeader({
  company,
  className,
}: {
  company: Company
  className?: string
}) {
  const navigate = useNavigate()

  return (
    <Card className={cn(className)}>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar className="size-14 shrink-0 rounded-xl">
            {company.logo ? (
              <AvatarImage
                src={company.logo}
                alt={`${company.name} logo`}
                className="rounded-xl"
              />
            ) : null}
            <AvatarFallback className="rounded-xl text-lg font-semibold">
              {getInitials(company.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
                {company.name}
              </h2>
              <Badge variant={STATUS_BADGE_VARIANTS[company.status]}>
                {COMPANY_STATUS_LABELS[company.status]}
              </Badge>
            </div>
            {company.industry ? (
              <p className="truncate text-sm text-muted-foreground">
                {company.industry}
              </p>
            ) : null}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(ROUTES.settings)}
          className="shrink-0"
        >
          <Pencil aria-hidden="true" />
          Edit Company
        </Button>
      </CardContent>
    </Card>
  )
}
