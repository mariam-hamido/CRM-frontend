import { Badge, type BadgeProps } from '@/components/ui/badge'
import { CUSTOMER_STATUS_LABELS } from '@/features/customers/constants/customerLabels'
import type { CustomerStatus } from '@/features/customers/types/customer.types'

const STATUS_VARIANTS: Record<
  CustomerStatus,
  NonNullable<BadgeProps['variant']>
> = {
  active: 'default',
  inactive: 'secondary',
  prospect: 'outline',
}

export function CustomerStatusBadge({
  status,
}: {
  status?: CustomerStatus
}) {
  const value = status ?? 'prospect'

  return (
    <Badge variant={STATUS_VARIANTS[value]}>
      {CUSTOMER_STATUS_LABELS[value]}
    </Badge>
  )
}
