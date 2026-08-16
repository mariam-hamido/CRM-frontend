import { useState } from 'react'
import { ArrowLeft, CircleCheck, CircleX, Pencil, Trash2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { GENERIC_API_ERROR_MESSAGE } from '@/api/interceptors'
import { ROUTES } from '@/app/router/routeConstants'
import { Button } from '@/components/ui/button'
import {
  CompanyInfoCard,
  type CompanyInfoRow,
} from '@/features/companies/components'
import { useGetCustomer } from '@/features/customers/hooks/useGetCustomers'
import { useDeal } from '@/features/deals/hooks/useDeal'
import {
  MeetingDeleteDialog,
  MeetingDialog,
  MeetingError,
  MeetingLoading,
  MeetingStatusBadge,
  MeetingTypeBadge,
} from '@/features/meetings/components'
import {
  MEETING_STATUS_LABELS,
  MEETING_TYPE_LABELS,
} from '@/features/meetings/constants/meetingLabels'
import { useMeeting } from '@/features/meetings/hooks/useMeeting'
import { useCompleteMeeting } from '@/features/meetings/hooks/useCompleteMeeting'
import { useCancelMeeting } from '@/features/meetings/hooks/useCancelMeeting'
import type { Meeting } from '@/features/meetings/types/meeting.types'
import {
  formatMeetingDate,
  formatMeetingDuration,
} from '@/features/meetings/utils/meetingUtils'
import type { Customer } from '@/features/customers/types/customer.types'

function buildOverviewRows(meeting: Meeting): CompanyInfoRow[] {
  return [
    { label: 'Title', value: meeting.title },
    { label: 'Status', value: MEETING_STATUS_LABELS[meeting.status] },
    { label: 'Type', value: MEETING_TYPE_LABELS[meeting.meetingType] },
    { label: 'Date', value: formatMeetingDate(meeting.meetingDate) },
    { label: 'Duration', value: formatMeetingDuration(meeting.duration) },
    ...(meeting.description
      ? [{ label: 'Description', value: meeting.description }]
      : []),
    ...(meeting.notes ? [{ label: 'Notes', value: meeting.notes }] : []),
  ]
}

function buildLocationRows(meeting: Meeting): CompanyInfoRow[] {
  const rows: CompanyInfoRow[] = []
  if (meeting.location) {
    rows.push({ label: 'Location', value: meeting.location })
  }
  if (meeting.meetingLink) {
    rows.push({
      label: 'Meeting link',
      value: (
        <a
          href={meeting.meetingLink}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline underline-offset-4 hover:opacity-80"
        >
          {meeting.meetingLink}
        </a>
      ),
    })
  }
  return rows
}

function buildRelationshipRows(
  customer?: Customer,
  dealTitle?: string,
  dealId?: string | null
): CompanyInfoRow[] {
  return [
    {
      label: 'Customer',
      value: customer ? (
        <a
          href={ROUTES.customersDetail.replace(':id', customer._id)}
          className="text-primary underline underline-offset-4 hover:opacity-80"
        >
          {customer.companyName}
        </a>
      ) : (
        '—'
      ),
    },
    {
      label: 'Deal',
      value: dealTitle && dealId ? (
        <a
          href={ROUTES.dealsDetail.replace(':id', dealId)}
          className="text-primary underline underline-offset-4 hover:opacity-80"
        >
          {dealTitle}
        </a>
      ) : (
        '—'
      ),
    },
  ]
}

function buildMetadataRows(meeting: Meeting): CompanyInfoRow[] {
  return [
    { label: 'Created', value: formatMeetingDate(meeting.createdAt) },
    { label: 'Last updated', value: formatMeetingDate(meeting.updatedAt) },
  ]
}

export default function MeetingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const meetingQuery = useMeeting(id)
  const meeting = meetingQuery.data

  const customerQuery = useGetCustomer(meeting?.customer)
  const dealQuery = useDeal(meeting?.deal ?? undefined)

  const completeMeeting = useCompleteMeeting()
  const cancelMeeting = useCancelMeeting()

  const customer = customerQuery.data
  const deal = dealQuery.data

  const isScheduled = meeting?.status === 'scheduled'

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit"
        onClick={() => navigate(ROUTES.meetings)}
      >
        <ArrowLeft aria-hidden="true" />
        Back to meetings
      </Button>

      {!id ? (
        <MeetingError
          message="Meeting ID is missing."
          onRetry={() => navigate(ROUTES.meetings)}
        />
      ) : meetingQuery.isPending ? (
        <MeetingLoading />
      ) : meetingQuery.isError ? (
        <MeetingError
          message={meetingQuery.error?.message ?? GENERIC_API_ERROR_MESSAGE}
          onRetry={() => void meetingQuery.refetch()}
        />
      ) : meeting ? (
        <>
          <header className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="min-w-0 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {meeting.title}
                </h1>
                <MeetingStatusBadge status={meeting.status} />
                <MeetingTypeBadge meetingType={meeting.meetingType} />
              </div>
              <p className="text-sm text-muted-foreground">
                {formatMeetingDate(meeting.meetingDate)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isScheduled ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => completeMeeting.mutate(meeting._id)}
                  disabled={completeMeeting.isPending}
                >
                  <CircleCheck aria-hidden="true" />
                  Complete
                </Button>
              ) : null}
              {isScheduled ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => cancelMeeting.mutate(meeting._id)}
                  disabled={cancelMeeting.isPending}
                >
                  <CircleX aria-hidden="true" />
                  Cancel
                </Button>
              ) : null}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
              >
                <Pencil aria-hidden="true" />
                Edit
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 aria-hidden="true" />
                Delete
              </Button>
            </div>
          </header>

          <section
            aria-label="Meeting information"
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            <CompanyInfoCard
              title="Meeting overview"
              rows={buildOverviewRows(meeting)}
              className="lg:col-span-2"
            />
            <CompanyInfoCard
              title="Location"
              rows={buildLocationRows(meeting)}
            />
            <CompanyInfoCard
              title="Relationships"
              rows={buildRelationshipRows(customer, deal?.title, meeting.deal)}
            />
            <CompanyInfoCard
              title="Meeting metadata"
              rows={buildMetadataRows(meeting)}
              className="lg:col-span-2"
            />
          </section>

          <MeetingDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            meeting={meeting}
            customers={[]}
            deals={[]}
          />

          <MeetingDeleteDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            meeting={meeting}
            onDeleted={() => navigate(ROUTES.meetings)}
          />
        </>
      ) : (
        <MeetingLoading />
      )}
    </div>
  )
}
