import { Badge } from '@/components/ui/badge'

export function CustomerContactPrimaryBadge({
  isPrimary,
}: {
  isPrimary: boolean
}) {
  if (!isPrimary) return null

  return (
    <Badge variant="default">
      <span aria-hidden="true">★</span>
      Primary
    </Badge>
  )
}
