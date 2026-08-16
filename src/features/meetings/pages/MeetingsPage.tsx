import { useEffect, useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { GENERIC_API_ERROR_MESSAGE } from '@/api/interceptors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { SelectField } from '@/components/ui/select-field'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useGetCustomers } from '@/features/customers/hooks/useGetCustomers'
import {
  MeetingDeleteDialog,
  MeetingDialog,
  MeetingEmpty,
  MeetingError,
  MeetingList,
  MeetingLoading,
} from '@/features/meetings/components'
import {
  MEETING_STATUS_LABELS,
  MEETING_TYPE_LABELS,
} from '@/features/meetings/constants/meetingLabels'
import { useMeetings } from '@/features/meetings/hooks/useMeetings'
import { useCompleteMeeting } from '@/features/meetings/hooks/useCompleteMeeting'
import { useCancelMeeting } from '@/features/meetings/hooks/useCancelMeeting'
import {
  MEETING_STATUSES,
  MEETING_TYPES,
  type Meeting,
  type MeetingStatus,
  type MeetingType,
} from '@/features/meetings/types/meeting.types'

const PAGE_SIZE = 10
const LOOKUP_LIMIT = 100

export default function MeetingsPage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState<MeetingStatus | ''>('')
  const [typeFilter, setTypeFilter] = useState<MeetingType | ''>('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null)
  const [meetingToDelete, setMeetingToDelete] = useState<Meeting | null>(null)

  const search = useDebouncedValue(searchInput, 300)

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter, typeFilter])

  const meetingsQuery = useMeetings({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    status: statusFilter || undefined,
    meetingType: typeFilter || undefined,
  })

  const customersQuery = useGetCustomers({ limit: LOOKUP_LIMIT })

  const customers = customersQuery.data?.customers ?? []
  const meetings = meetingsQuery.data?.meetings ?? []
  const pagination = meetingsQuery.data?.pagination

  const customerNames = useMemo(() => {
    const map = new Map<string, string>()
    for (const c of customers) {
      map.set(c._id, c.companyName)
    }
    return map
  }, [customers])

  const hasActiveFilters = Boolean(search || statusFilter || typeFilter)
  const hasMeetings = pagination ? pagination.total > 0 : meetings.length > 0

  const completeMeeting = useCompleteMeeting()
  const cancelMeeting = useCancelMeeting()

  const openCreateDialog = () => {
    setEditingMeeting(null)
    setFormOpen(true)
  }

  const openEditDialog = (meeting: Meeting) => {
    setEditingMeeting(meeting)
    setFormOpen(true)
  }

  const clearFilters = () => {
    setSearchInput('')
    setStatusFilter('')
    setTypeFilter('')
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Meetings
          </h1>
          <p className="text-sm text-muted-foreground">
            Schedule and manage your meetings.
          </p>
        </div>
        <Button type="button" onClick={openCreateDialog}>
          <Plus aria-hidden="true" />
          Add meeting
        </Button>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search by title…"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="pl-9"
            aria-label="Search meetings"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SelectField
            id="status-filter"
            aria-label="Filter by status"
            className="w-40"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as MeetingStatus | '')
            }
          >
            <option value="">All statuses</option>
            {MEETING_STATUSES.map((status) => (
              <option key={status} value={status}>
                {MEETING_STATUS_LABELS[status]}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="type-filter"
            aria-label="Filter by type"
            className="w-40"
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value as MeetingType | '')
            }
          >
            <option value="">All types</option>
            {MEETING_TYPES.map((type) => (
              <option key={type} value={type}>
                {MEETING_TYPE_LABELS[type]}
              </option>
            ))}
          </SelectField>
        </div>
      </div>

      {meetingsQuery.isPending ? (
        <MeetingLoading />
      ) : meetingsQuery.isError ? (
        <MeetingError
          message={meetingsQuery.error?.message ?? GENERIC_API_ERROR_MESSAGE}
          onRetry={() => void meetingsQuery.refetch()}
        />
      ) : meetings.length === 0 ? (
        <MeetingEmpty
          hasActiveFilters={hasActiveFilters}
          onAdd={openCreateDialog}
          onClearFilters={hasActiveFilters ? clearFilters : undefined}
        />
      ) : (
        <MeetingList
          meetings={meetings}
          customerNames={customerNames}
          dealNames={new Map()}
          onEdit={openEditDialog}
          onDelete={setMeetingToDelete}
          onComplete={(meeting) => completeMeeting.mutate(meeting._id)}
          onCancel={(meeting) => cancelMeeting.mutate(meeting._id)}
        />
      )}

      {hasMeetings && pagination ? (
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          itemLabel="meetings"
        />
      ) : null}

      <MeetingDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        meeting={editingMeeting}
        customers={customers}
        deals={[]}
      />

      <MeetingDeleteDialog
        open={Boolean(meetingToDelete)}
        onOpenChange={(open) => {
          if (!open) setMeetingToDelete(null)
        }}
        meeting={meetingToDelete}
      />
    </div>
  )
}
