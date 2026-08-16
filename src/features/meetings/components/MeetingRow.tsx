import {
  CircleCheck,
  CircleX,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MeetingStatusBadge } from '@/features/meetings/components/MeetingStatusBadge'
import { MeetingTypeBadge } from '@/features/meetings/components/MeetingTypeBadge'
import type { Meeting } from '@/features/meetings/types/meeting.types'
import {
  formatMeetingDate,
  formatMeetingDuration,
} from '@/features/meetings/utils/meetingUtils'

export const MEETING_COLUMNS =
  'md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_auto_auto_auto_minmax(0,1fr)_auto]'

function MeetingActions({
  meeting,
  onEdit,
  onDelete,
  onComplete,
  onCancel,
  canEdit = true,
  canDelete = true,
  canComplete = true,
  canCancel = true,
}: {
  meeting: Meeting
  onEdit: (meeting: Meeting) => void
  onDelete: (meeting: Meeting) => void
  onComplete?: (meeting: Meeting) => void
  onCancel?: (meeting: Meeting) => void
  canEdit?: boolean
  canDelete?: boolean
  canComplete?: boolean
  canCancel?: boolean
}) {
  const showComplete =
    canComplete && Boolean(onComplete) && meeting.status === 'scheduled'
  const showCancel =
    canCancel && Boolean(onCancel) && meeting.status === 'scheduled'
  const showEdit = canEdit
  const showDelete = canDelete

  if (!showComplete && !showCancel && !showEdit && !showDelete) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Actions for ${meeting.title}`}
        >
          <MoreHorizontal aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onComplete && showComplete ? (
          <DropdownMenuItem onSelect={() => onComplete(meeting)}>
            <CircleCheck aria-hidden="true" />
            Mark complete
          </DropdownMenuItem>
        ) : null}
        {onCancel && showCancel ? (
          <DropdownMenuItem onSelect={() => onCancel(meeting)}>
            <CircleX aria-hidden="true" />
            Cancel meeting
          </DropdownMenuItem>
        ) : null}
        {(showComplete || showCancel) && (showEdit || showDelete) ? (
          <DropdownMenuSeparator />
        ) : null}
        {showEdit ? (
          <DropdownMenuItem onSelect={() => onEdit(meeting)}>
            <Pencil aria-hidden="true" />
            Edit
          </DropdownMenuItem>
        ) : null}
        {showEdit && showDelete ? <DropdownMenuSeparator /> : null}
        {showDelete ? (
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => onDelete(meeting)}
          >
            <Trash2 aria-hidden="true" />
            Delete
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function MeetingRow({
  meeting,
  customerName,
  dealName: _dealName,
  onEdit,
  onDelete,
  onComplete,
  onCancel,
  canEdit,
  canDelete,
  canComplete,
  canCancel,
}: {
  meeting: Meeting
  customerName?: string
  dealName?: string
  onEdit: (meeting: Meeting) => void
  onDelete: (meeting: Meeting) => void
  onComplete?: (meeting: Meeting) => void
  onCancel?: (meeting: Meeting) => void
  canEdit?: boolean
  canDelete?: boolean
  canComplete?: boolean
  canCancel?: boolean
}) {
  const actions = (
    <MeetingActions
      meeting={meeting}
      onEdit={onEdit}
      onDelete={onDelete}
      onComplete={onComplete}
      onCancel={onCancel}
      canEdit={canEdit}
      canDelete={canDelete}
      canComplete={canComplete}
      canCancel={canCancel}
    />
  )

  return (
    <li className="border-b transition-colors last:border-0 hover:bg-muted/50">
      <div
        className={`hidden items-center gap-4 px-4 py-3 sm:px-6 md:grid ${MEETING_COLUMNS}`}
      >
        <div className="min-w-0">
          <p className="truncate font-medium">{meeting.title}</p>
          {meeting.description ? (
            <p className="truncate text-sm text-muted-foreground">
              {meeting.description}
            </p>
          ) : null}
        </div>
        <div className="hidden min-w-0 truncate text-muted-foreground lg:block">
          {customerName ?? '—'}
        </div>
        <div>
          <MeetingStatusBadge status={meeting.status} />
        </div>
        <div>
          <MeetingTypeBadge meetingType={meeting.meetingType} />
        </div>
        <div className="hidden tabular-nums text-muted-foreground md:block">
          {formatMeetingDate(meeting.meetingDate)}
        </div>
        <div className="hidden min-w-0 truncate text-muted-foreground lg:block">
          {formatMeetingDuration(meeting.duration)}
        </div>
        <div className="flex justify-end">{actions}</div>
      </div>

      <div className="flex flex-col gap-2 px-4 py-3 sm:px-6 md:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="truncate font-medium">{meeting.title}</p>
            {meeting.description ? (
              <p className="truncate text-sm text-muted-foreground">
                {meeting.description}
              </p>
            ) : null}
          </div>
          {actions}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <MeetingStatusBadge status={meeting.status} />
          <MeetingTypeBadge meetingType={meeting.meetingType} />
        </div>
        <div className="flex flex-col gap-0.5 text-sm text-muted-foreground">
          <p className="tabular-nums">
            {formatMeetingDate(meeting.meetingDate)}
          </p>
          <p>{formatMeetingDuration(meeting.duration)}</p>
          {customerName ? <p className="truncate">{customerName}</p> : null}
        </div>
      </div>
    </li>
  )
}
