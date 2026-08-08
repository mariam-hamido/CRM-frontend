import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { GENERIC_API_ERROR_MESSAGE } from '@/api/interceptors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { SelectField } from '@/components/ui/select-field'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import {
  LeadDeleteDialog,
  LeadDialog,
  LeadEmpty,
  LeadList,
  LeadListError,
  LeadListLoading,
} from '@/features/leads/components'
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
} from '@/features/leads/constants/leadLabels'
import { useLeads } from '@/features/leads/hooks/useLeads'
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
  type Lead,
  type LeadSource,
  type LeadStatus,
} from '@/features/leads/types/lead.types'

const PAGE_SIZE = 10

export default function LeadsPage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('')
  const [sourceFilter, setSourceFilter] = useState<LeadSource | ''>('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null)

  const search = useDebouncedValue(searchInput, 300)

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter, sourceFilter])

  const leadsQuery = useLeads({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    status: statusFilter || undefined,
    source: sourceFilter || undefined,
  })

  const leads = leadsQuery.data?.leads ?? []
  const pagination = leadsQuery.data?.pagination
  const hasActiveFilters = Boolean(search || statusFilter || sourceFilter)
  const hasLeads = pagination ? pagination.total > 0 : leads.length > 0

  const openCreateDialog = () => {
    setEditingLead(null)
    setFormOpen(true)
  }

  const openEditDialog = (lead: Lead) => {
    setEditingLead(lead)
    setFormOpen(true)
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Leads
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage the leads in your pipeline.
          </p>
        </div>
        <Button type="button" onClick={openCreateDialog}>
          <Plus aria-hidden="true" />
          Add lead
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
            placeholder="Search by name, company, email, phone…"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="pl-9"
            aria-label="Search leads"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SelectField
            id="status-filter"
            aria-label="Filter by status"
            className="w-40"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as LeadStatus | '')
            }
          >
            <option value="">All statuses</option>
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {LEAD_STATUS_LABELS[status]}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="source-filter"
            aria-label="Filter by source"
            className="w-40"
            value={sourceFilter}
            onChange={(event) =>
              setSourceFilter(event.target.value as LeadSource | '')
            }
          >
            <option value="">All sources</option>
            {LEAD_SOURCES.map((source) => (
              <option key={source} value={source}>
                {LEAD_SOURCE_LABELS[source]}
              </option>
            ))}
          </SelectField>
        </div>
      </div>

      {leadsQuery.isPending ? (
        <LeadListLoading />
      ) : leadsQuery.isError ? (
        <LeadListError
          message={leadsQuery.error?.message ?? GENERIC_API_ERROR_MESSAGE}
          onRetry={() => void leadsQuery.refetch()}
        />
      ) : leads.length === 0 ? (
        <LeadEmpty
          hasActiveFilters={hasActiveFilters}
          onAdd={openCreateDialog}
        />
      ) : (
        <LeadList
          leads={leads}
          onEdit={openEditDialog}
          onDelete={setLeadToDelete}
        />
      )}

      {hasLeads && pagination ? (
        <Pagination pagination={pagination} onPageChange={setPage} itemLabel="leads" />
      ) : null}

      <LeadDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        lead={editingLead}
      />

      <LeadDeleteDialog
        open={Boolean(leadToDelete)}
        onOpenChange={(open) => {
          if (!open) setLeadToDelete(null)
        }}
        lead={leadToDelete}
      />
    </div>
  )
}
