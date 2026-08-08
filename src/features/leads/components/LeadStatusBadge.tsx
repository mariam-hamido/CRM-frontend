import { Badge, type BadgeProps } from '@/components/ui/badge'
import { LEAD_STATUS_LABELS } from '@/features/leads/constants/leadLabels'
import type { LeadStatus } from '@/features/leads/types/lead.types'

const STATUS_VARIANTS: Record<
  LeadStatus,
  NonNullable<BadgeProps['variant']>
> = {
  new: 'outline',
  contacted: 'secondary',
  qualified: 'default',
  proposal_sent: 'secondary',
  negotiation: 'outline',
  converted: 'default',
  lost: 'destructive',
}

export function LeadStatusBadge({
  status,
}: {
  status?: LeadStatus
}) {
  const value = status ?? 'new'

  return (
    <Badge variant={STATUS_VARIANTS[value]}>
      {LEAD_STATUS_LABELS[value]}
    </Badge>
  )
}
