import { Badge } from '@/components/ui/badge'

export function PipelineDefaultBadge({ isDefault }: { isDefault: boolean }) {
  if (!isDefault) return null

  return (
    <Badge variant="default">
      <span aria-hidden="true">★</span>
      Default
    </Badge>
  )
}
