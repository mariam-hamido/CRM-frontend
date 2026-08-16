import { Badge, type BadgeProps } from '@/components/ui/badge'
import { MEETING_STATUS_LABELS } from '@/features/meetings/constants/meetingLabels'
import type { MeetingStatus } from '@/features/meetings/types/meeting.types'

const STATUS_VARIANTS: Record<
  MeetingStatus,
  NonNullable<BadgeProps['variant']>
> = {
  scheduled: 'secondary',
  completed: 'default',
  cancelled: 'outline',
  no_show: 'destructive',
}

export function MeetingStatusBadge({
  status,
}: {
  status: MeetingStatus
}) {
  return (
    <Badge variant={STATUS_VARIANTS[status]}>
      {MEETING_STATUS_LABELS[status]}
    </Badge>
  )
}
