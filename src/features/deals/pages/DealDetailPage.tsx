import { useState } from 'react'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { GENERIC_API_ERROR_MESSAGE } from '@/api/interceptors'
import { ROUTES } from '@/app/router/routeConstants'
import { Button } from '@/components/ui/button'
import {
  CompanyInfoCard,
  type CompanyInfoRow,
} from '@/features/companies/components'
import { selectUser, useAuthStore } from '@/features/auth/store/authStore'
import { useGetCustomers } from '@/features/customers/hooks/useGetCustomers'
import {
  DealDeleteDialog,
  DealDialog,
  DealError,
  DealLoading,
  DealStatusBadge,
} from '@/features/deals/components'
import { DEAL_STATUS_LABELS } from '@/features/deals/constants/dealLabels'
import { useDeal } from '@/features/deals/hooks/useDeal'
import type { Deal } from '@/features/deals/types/deal.types'
import {
  formatDate,
  formatDealValue,
  formatProbability,
} from '@/features/deals/utils/dealUtils'
import { usePipelines } from '@/features/pipelines/hooks/usePipelines'
import { usePipelineStages } from '@/features/pipelines/hooks/usePipelineStages'
import type { Customer } from '@/features/customers/types/customer.types'

const LOOKUP_LIMIT = 100

function buildOverviewRows(
  deal: Deal,
  pipelineName?: string,
  stageName?: string
): CompanyInfoRow[] {
  const rows: CompanyInfoRow[] = [
    { label: 'Title', value: deal.title },
    { label: 'Value', value: formatDealValue(deal.value) },
    { label: 'Probability', value: formatProbability(deal.probability) },
    { label: 'Status', value: DEAL_STATUS_LABELS[deal.status] },
    { label: 'Pipeline', value: pipelineName ?? '—' },
    { label: 'Stage', value: stageName ?? '—' },
    { label: 'Expected close date', value: formatDate(deal.expectedCloseDate) },
  ]
  if (deal.actualCloseDate) {
    rows.push({
      label: 'Actual close date',
      value: formatDate(deal.actualCloseDate),
    })
  }
  if (deal.description) {
    rows.push({ label: 'Description', value: deal.description })
  }
  if (deal.lostReason) {
    rows.push({ label: 'Lost reason', value: deal.lostReason })
  }
  return rows
}

function buildCustomerRows(customer?: Customer): CompanyInfoRow[] {
  return [
    {
      label: 'Company name',
      value: customer ? (
        <Link
          to={ROUTES.customersDetail.replace(':id', customer._id)}
          className="text-primary underline underline-offset-4 hover:opacity-80"
        >
          {customer.companyName}
        </Link>
      ) : (
        '—'
      ),
    },
  ]
}

function buildMetadataRows(deal: Deal, ownerName?: string): CompanyInfoRow[] {
  return [
    { label: 'Owner', value: ownerName ?? '—' },
    { label: 'Created', value: formatDate(deal.createdAt) },
    { label: 'Last updated', value: formatDate(deal.updatedAt) },
  ]
}

export default function DealDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const currentUser = useAuthStore(selectUser)

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const dealQuery = useDeal(id)

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

  const deal = dealQuery.data

  const customer = deal
    ? customers.find((entry) => entry._id === deal.customer)
    : undefined
  const pipelineName = deal
    ? pipelines.find((entry) => entry._id === deal.pipeline)?.name
    : undefined
  const stageName = deal
    ? stages.find((entry) => entry._id === deal.stage)?.name
    : undefined
  const ownerName =
    deal && currentUser && deal.owner === currentUser._id
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : undefined

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit"
        onClick={() => navigate(ROUTES.deals)}
      >
        <ArrowLeft aria-hidden="true" />
        Back to deals
      </Button>

      {!id ? (
        <DealError
          message="Deal ID is missing."
          onRetry={() => navigate(ROUTES.deals)}
        />
      ) : dealQuery.isPending ? (
        <DealLoading />
      ) : dealQuery.isError ? (
        <DealError
          message={dealQuery.error?.message ?? GENERIC_API_ERROR_MESSAGE}
          onRetry={() => void dealQuery.refetch()}
        />
      ) : deal ? (
        <>
          <header className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="min-w-0 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {deal.title}
                </h1>
                <DealStatusBadge status={deal.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                {pipelineName ?? 'Deal information'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
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
            aria-label="Deal information"
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            <CompanyInfoCard
              title="Deal overview"
              rows={buildOverviewRows(deal, pipelineName, stageName)}
              className="lg:col-span-2"
            />
            <CompanyInfoCard
              title="Customer information"
              rows={buildCustomerRows(customer)}
            />
            <CompanyInfoCard
              title="Ownership and metadata"
              rows={buildMetadataRows(deal, ownerName)}
            />
          </section>

          <DealDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            deal={deal}
            customers={customers}
            pipelines={pipelines}
            stages={stages}
            owners={owners}
          />

          <DealDeleteDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            deal={deal}
            onDeleted={() => navigate(ROUTES.deals)}
          />
        </>
      ) : (
        <DealLoading />
      )}
    </div>
  )
}
