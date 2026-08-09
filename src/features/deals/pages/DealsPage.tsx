import { useEffect, useState } from 'react'
import { KanbanSquare, LayoutList, Plus, Search } from 'lucide-react'
import { GENERIC_API_ERROR_MESSAGE } from '@/api/interceptors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { SelectField } from '@/components/ui/select-field'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { selectUser, useAuthStore } from '@/features/auth/store/authStore'
import { useGetCustomers } from '@/features/customers/hooks/useGetCustomers'
import {
  DealDeleteDialog,
  DealDialog,
  DealEmpty,
  DealError,
  DealKanbanBoard,
  DealList,
  DealLoading,
} from '@/features/deals/components'
import { DEAL_STATUS_LABELS } from '@/features/deals/constants/dealLabels'
import { useDeals } from '@/features/deals/hooks/useDeals'
import {
  DEAL_STATUSES,
  type Deal,
  type DealStatus,
} from '@/features/deals/types/deal.types'
import { usePipelines } from '@/features/pipelines/hooks/usePipelines'
import { usePipelineStages } from '@/features/pipelines/hooks/usePipelineStages'

const PAGE_SIZE = 10
const LOOKUP_LIMIT = 100

export default function DealsPage() {
  const currentUser = useAuthStore(selectUser)

  const [view, setView] = useState<'list' | 'board'>('list')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState<DealStatus | ''>('')
  const [pipelineFilter, setPipelineFilter] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null)

  const search = useDebouncedValue(searchInput, 300)

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter, pipelineFilter, stageFilter, ownerFilter])

  const dealsQuery = useDeals({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    status: statusFilter || undefined,
    pipeline: pipelineFilter || undefined,
    stage: stageFilter || undefined,
    owner: ownerFilter || undefined,
  })

  const customersQuery = useGetCustomers({ limit: LOOKUP_LIMIT })
  const pipelinesQuery = usePipelines({
    limit: LOOKUP_LIMIT,
    sortBy: 'name',
    sortOrder: 'asc',
  })
  const stagesQuery = usePipelineStages({ limit: LOOKUP_LIMIT })

  const customers = customersQuery.data?.customers ?? []
  const pipelines = pipelinesQuery.data?.pipelines ?? []
  const stages = stagesQuery.data?.stages ?? []
  const owners = currentUser ? [currentUser] : []

  const deals = dealsQuery.data?.deals ?? []
  const pagination = dealsQuery.data?.pagination
  const hasActiveFilters = Boolean(
    search || statusFilter || pipelineFilter || stageFilter || ownerFilter
  )
  const hasDeals = pagination ? pagination.total > 0 : deals.length > 0

  const filterableStages = pipelineFilter
    ? stages.filter((stage) => stage.pipeline === pipelineFilter)
    : stages

  const openCreateDialog = () => {
    setEditingDeal(null)
    setFormOpen(true)
  }

  const openEditDialog = (deal: Deal) => {
    setEditingDeal(deal)
    setFormOpen(true)
  }

  const clearFilters = () => {
    setSearchInput('')
    setStatusFilter('')
    setPipelineFilter('')
    setStageFilter('')
    setOwnerFilter('')
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Deals
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage the deals in your sales pipeline.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border p-0.5">
            <Button
              type="button"
              variant={view === 'list' ? 'default' : 'ghost'}
              size="sm"
              aria-pressed={view === 'list'}
              onClick={() => setView('list')}
            >
              <LayoutList aria-hidden="true" />
              List
            </Button>
            <Button
              type="button"
              variant={view === 'board' ? 'default' : 'ghost'}
              size="sm"
              aria-pressed={view === 'board'}
              onClick={() => setView('board')}
            >
              <KanbanSquare aria-hidden="true" />
              Board
            </Button>
          </div>
          <Button type="button" onClick={openCreateDialog}>
            <Plus aria-hidden="true" />
            Add deal
          </Button>
        </div>
      </header>

      {view === 'board' ? (
        <DealKanbanBoard
          pipelines={pipelines}
          customers={customers}
          owners={owners}
          onEdit={openEditDialog}
          onDelete={setDealToDelete}
          onAddDeal={openCreateDialog}
        />
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-sm">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Search by deal title…"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="pl-9"
                aria-label="Search deals"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <SelectField
                id="status-filter"
                aria-label="Filter by status"
                className="w-40"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as DealStatus | '')
                }
              >
                <option value="">All statuses</option>
                {DEAL_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {DEAL_STATUS_LABELS[status]}
                  </option>
                ))}
              </SelectField>

              <SelectField
                id="pipeline-filter"
                aria-label="Filter by pipeline"
                className="w-40"
                value={pipelineFilter}
                onChange={(event) => {
                  setPipelineFilter(event.target.value)
                  setStageFilter('')
                }}
              >
                <option value="">All pipelines</option>
                {pipelines.map((pipeline) => (
                  <option key={pipeline._id} value={pipeline._id}>
                    {pipeline.name}
                  </option>
                ))}
              </SelectField>

              <SelectField
                id="stage-filter"
                aria-label="Filter by stage"
                className="w-40"
                value={stageFilter}
                onChange={(event) => setStageFilter(event.target.value)}
              >
                <option value="">All stages</option>
                {filterableStages.map((stage) => (
                  <option key={stage._id} value={stage._id}>
                    {stage.name}
                  </option>
                ))}
              </SelectField>

              {owners.length > 0 ? (
                <SelectField
                  id="owner-filter"
                  aria-label="Filter by owner"
                  className="w-40"
                  value={ownerFilter}
                  onChange={(event) => setOwnerFilter(event.target.value)}
                >
                  <option value="">All owners</option>
                  {owners.map((owner) => (
                    <option key={owner._id} value={owner._id}>
                      {owner.firstName} {owner.lastName}
                    </option>
                  ))}
                </SelectField>
              ) : null}
            </div>
          </div>

          {dealsQuery.isPending ? (
            <DealLoading />
          ) : dealsQuery.isError ? (
            <DealError
              message={dealsQuery.error?.message ?? GENERIC_API_ERROR_MESSAGE}
              onRetry={() => void dealsQuery.refetch()}
            />
          ) : deals.length === 0 ? (
            <DealEmpty
              hasActiveFilters={hasActiveFilters}
              onAdd={openCreateDialog}
              onClearFilters={hasActiveFilters ? clearFilters : undefined}
            />
          ) : (
            <DealList
              deals={deals}
              customers={customers}
              pipelines={pipelines}
              stages={stages}
              owners={owners}
              onEdit={openEditDialog}
              onDelete={setDealToDelete}
            />
          )}

          {hasDeals && pagination ? (
            <Pagination
              pagination={pagination}
              onPageChange={setPage}
              itemLabel="deals"
            />
          ) : null}
        </>
      )}

      <DealDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        deal={editingDeal}
        customers={customers}
        pipelines={pipelines}
        stages={stages}
        owners={owners}
      />

      <DealDeleteDialog
        open={Boolean(dealToDelete)}
        onOpenChange={(open) => {
          if (!open) setDealToDelete(null)
        }}
        deal={dealToDelete}
      />
    </div>
  )
}
