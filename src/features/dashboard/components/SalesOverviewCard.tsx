import { TrendingUp } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { DashboardSalesStats } from '@/features/dashboard/types/dashboard.types'
import { formatCurrency } from '@/features/dashboard/utils/dashboardUtils'

export function SalesOverviewCard({
  stats,
  className,
}: {
  stats: DashboardSalesStats | undefined
  className?: string
}) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Revenue performance over time</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center">
        {stats ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Monthly revenue</p>
              <p className="text-3xl font-semibold tracking-tight">
                {formatCurrency(stats.monthlyRevenue)}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Won deals</p>
              <p className="text-3xl font-semibold tracking-tight">
                {stats.wonDeals}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Conversion rate</p>
              <p className="text-3xl font-semibold tracking-tight">
                {stats.conversionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-56 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground">
            <TrendingUp className="size-8" aria-hidden="true" />
            <p className="text-sm font-medium">Sales chart coming soon</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
