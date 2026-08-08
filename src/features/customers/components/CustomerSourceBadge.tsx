import { Badge } from '@/components/ui/badge'
import { CUSTOMER_SOURCE_LABELS } from '@/features/customers/constants/customerLabels'
import type { CustomerSource } from '@/features/customers/types/customer.types'

export function CustomerSourceBadge({
  source,
}: {
  source?: CustomerSource
}) {
  const value = source ?? 'other'

  return (
    <Badge variant="outline">
      {CUSTOMER_SOURCE_LABELS[value]}
    </Badge>
  )
}
