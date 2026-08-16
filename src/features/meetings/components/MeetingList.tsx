import { Card } from '@/components/ui/card'
import { MEETING_COLUMNS, MeetingRow } from '@/features/meetings/components/MeetingRow'
import type { Meeting } from '@/features/meetings/types/meeting.types'

export function MeetingList({
  meetings,
  customerNames,
  dealNames,
  onEdit,
  onDelete,
  onComplete,
  onCancel,
  canEdit,
  canDelete,
  canComplete,
  canCancel,
}: {
  meetings: Meeting[]
  customerNames: Map<string, string>
  dealNames: Map<string, string>
  onEdit: (meeting: Meeting) => void
  onDelete: (meeting: Meeting) => void
  onComplete?: (meeting: Meeting) => void
  onCancel?: (meeting: Meeting) => void
  canEdit?: (meeting: Meeting) => boolean
  canDelete?: (meeting: Meeting) => boolean
  canComplete?: (meeting: Meeting) => boolean
  canCancel?: (meeting: Meeting) => boolean
}) {
  return (
    <Card>
      <div
        className={`hidden items-center gap-4 border-b px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-6 md:grid ${MEETING_COLUMNS}`}
      >
        <span>Title</span>
        <span className="hidden lg:block">Customer</span>
        <span>Status</span>
        <span>Type</span>
        <span className="hidden md:block">Date</span>
        <span className="hidden lg:block">Duration</span>
        <span className="text-right">
          <span className="sr-only">Actions</span>
        </span>
      </div>
      <ul>
        {meetings.map((meeting) => (
          <MeetingRow
            key={meeting._id}
            meeting={meeting}
            customerName={customerNames.get(meeting.customer)}
            dealName={dealNames.get(meeting.deal ?? '')}
            onEdit={onEdit}
            onDelete={onDelete}
            onComplete={onComplete}
            onCancel={onCancel}
            canEdit={canEdit?.(meeting)}
            canDelete={canDelete?.(meeting)}
            canComplete={canComplete?.(meeting)}
            canCancel={canCancel?.(meeting)}
          />
        ))}
      </ul>
    </Card>
  )
}
