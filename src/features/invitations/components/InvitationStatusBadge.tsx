import { Badge, type BadgeProps } from '@/components/ui/badge'
import type { InvitationStatus } from '@/features/invitations/types/invitation.types'

const STATUS_CONFIG: Record<
  InvitationStatus,
  { label: string; variant: NonNullable<BadgeProps['variant']> }
> = {
  pending: { label: 'Pending', variant: 'outline' },
  accepted: { label: 'Accepted', variant: 'default' },
  removed: { label: 'Removed', variant: 'secondary' },
}

export function InvitationStatusBadge({ status }: { status: InvitationStatus }) {
  const config = STATUS_CONFIG[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
