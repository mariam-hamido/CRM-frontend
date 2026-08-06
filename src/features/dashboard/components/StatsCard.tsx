import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { StatItem } from '@/features/dashboard/constants/mockData'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

const ACCENT_STYLES = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary text-secondary-foreground',
  muted: 'bg-muted text-muted-foreground',
  destructive: 'bg-destructive/10 text-destructive',
} as const

export function StatsCard({ item }: { item: StatItem }) {
  const Icon = item.icon
  const TrendIcon = item.trend.direction === 'up' ? ArrowUpRight : ArrowDownRight

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {item.title}
        </CardTitle>
        <CardAction>
          <div
            className={cn(
              'flex size-9 items-center justify-center rounded-lg',
              ACCENT_STYLES[item.accent]
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="text-3xl font-semibold tracking-tight">{item.value}</div>
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 font-medium',
              item.trend.direction === 'down' && 'text-destructive'
            )}
          >
            <TrendIcon className="size-3.5" aria-hidden="true" />
            {item.trend.value}
          </span>
          <span className="text-muted-foreground">{item.trend.label}</span>
        </div>
      </CardContent>
    </Card>
  )
}
