import { useState } from 'react'
import { MailPlus, TriangleAlert, UserRoundPlus } from 'lucide-react'
import { GENERIC_API_ERROR_MESSAGE } from '@/api/interceptors'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Pagination } from '@/components/ui/pagination'
import { SelectField } from '@/components/ui/select-field'
import {
  InvitationListError,
  InvitationListLoading,
  InvitationsTable,
  InviteEmployeeDialog,
  RemoveInvitationDialog,
} from '@/features/invitations/components'
import { useGetInvitations } from '@/features/invitations/hooks/useGetInvitations'
import type {
  Invitation,
  InvitationStatus,
} from '@/features/invitations/types/invitation.types'

const PAGE_SIZE = 10

export default function InvitationsPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<InvitationStatus | ''>('')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [invitationToRemove, setInvitationToRemove] =
    useState<Invitation | null>(null)

  const invitationsQuery = useGetInvitations({
    page,
    limit: PAGE_SIZE,
    status: statusFilter || undefined,
  })

  const invitations = invitationsQuery.data?.invitations ?? []
  const pagination = invitationsQuery.data?.pagination
  const hasActiveFilters = Boolean(statusFilter)
  const hasInvitations = pagination
    ? pagination.total > 0
    : invitations.length > 0

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Invitations
          </h1>
          <p className="text-sm text-muted-foreground">
            Approve employee emails so they can join your company.
          </p>
        </div>
        <Button type="button" onClick={() => setInviteOpen(true)}>
          <MailPlus aria-hidden="true" />
          Invite employee
        </Button>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <SelectField
          id="status-filter"
          aria-label="Filter by status"
          className="w-40"
          value={statusFilter}
          onChange={(event) => {
            setPage(1)
            setStatusFilter(event.target.value as InvitationStatus | '')
          }}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="removed">Removed</option>
        </SelectField>
      </div>

      {invitationsQuery.isPending ? (
        <InvitationListLoading />
      ) : invitationsQuery.isError ? (
        <InvitationListError
          message={
            invitationsQuery.error?.message ?? GENERIC_API_ERROR_MESSAGE
          }
          onRetry={() => void invitationsQuery.refetch()}
        />
      ) : invitations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              {hasActiveFilters ? (
                <TriangleAlert
                  className="size-5 text-muted-foreground"
                  aria-hidden="true"
                />
              ) : (
                <UserRoundPlus
                  className="size-5 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-medium">
                {hasActiveFilters
                  ? 'No invitations found'
                  : 'No pending invitations.'}
              </p>
              <p className="text-sm text-muted-foreground">
                {hasActiveFilters
                  ? 'Try adjusting your filters.'
                  : 'Invite an employee to approve their email for registration.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <InvitationsTable
          invitations={invitations}
          onRemove={setInvitationToRemove}
        />
      )}

      {hasInvitations && pagination ? (
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          itemLabel="invitations"
        />
      ) : null}

      <InviteEmployeeDialog open={inviteOpen} onOpenChange={setInviteOpen} />

      <RemoveInvitationDialog
        open={Boolean(invitationToRemove)}
        onOpenChange={(open) => {
          if (!open) setInvitationToRemove(null)
        }}
        invitation={invitationToRemove}
      />
    </div>
  )
}
