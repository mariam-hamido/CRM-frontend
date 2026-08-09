import { Badge, type BadgeProps } from '@/components/ui/badge'
import { DEAL_STATUS_LABELS } from '@/features/deals/constants/dealLabels'
import type { DealStatus } from '@/features/deals/types/deal.types'

const STATUS_VARIANTS: Record<
  DealStatus,
  NonNullable<BadgeProps['variant']>
> = {
  open: 'secondary',
  won: 'default',
  lost: 'destructive',
}

export function DealStatusBadge({
  status,
}: {
  status?: DealStatus
}) {
  const value = status ?? 'open'

  return (
    <Badge variant={STATUS_VARIANTS[value]}>
      {DEAL_STATUS_LABELS[value]}
    </Badge>
  )
}
