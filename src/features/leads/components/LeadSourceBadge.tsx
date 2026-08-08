import { Badge } from '@/components/ui/badge'
import { LEAD_SOURCE_LABELS } from '@/features/leads/constants/leadLabels'
import type { LeadSource } from '@/features/leads/types/lead.types'

export function LeadSourceBadge({
  source,
}: {
  source?: LeadSource
}) {
  const value = source ?? 'other'

  return (
    <Badge variant="outline">
      {LEAD_SOURCE_LABELS[value]}
    </Badge>
  )
}
