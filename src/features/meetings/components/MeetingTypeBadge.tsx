import { Badge, type BadgeProps } from '@/components/ui/badge'
import { MEETING_TYPE_LABELS } from '@/features/meetings/constants/meetingLabels'
import type { MeetingType } from '@/features/meetings/types/meeting.types'

const TYPE_VARIANTS: Record<
  MeetingType,
  NonNullable<BadgeProps['variant']>
> = {
  in_person: 'default',
  phone: 'secondary',
  video: 'outline',
}

export function MeetingTypeBadge({
  meetingType,
}: {
  meetingType: MeetingType
}) {
  return (
    <Badge variant={TYPE_VARIANTS[meetingType]}>
      {MEETING_TYPE_LABELS[meetingType]}
    </Badge>
  )
}
