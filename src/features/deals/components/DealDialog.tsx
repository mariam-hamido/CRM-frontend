import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DealForm, type DealFormValues } from '@/features/deals/components/DealForm'
import { useCreateDeal } from '@/features/deals/hooks/useCreateDeal'
import { useUpdateDeal } from '@/features/deals/hooks/useUpdateDeal'
import type { DealCreateFormValues, DealUpdateFormValues } from '@/features/deals/schemas/deal.schema'
import type { Deal } from '@/features/deals/types/deal.types'
import {
  toCreateDealPayload,
  toUpdateDealPayload,
} from '@/features/deals/utils/dealUtils'
import type { AuthUser } from '@/features/auth/types/auth.types'
import type { Customer } from '@/features/customers/types/customer.types'
import type { Pipeline } from '@/features/pipelines/types/pipeline.types'
import type { PipelineStage } from '@/features/pipelines/types/pipelineStage.types'

export function DealDialog({
  deal,
  open,
  onOpenChange,
  customers,
  pipelines,
  stages,
  owners,
}: {
  deal: Deal | null
  open: boolean
  onOpenChange: (open: boolean) => void
  customers: Customer[]
  pipelines: Pipeline[]
  stages: PipelineStage[]
  owners: AuthUser[]
}) {
  const create = useCreateDeal()
  const update = useUpdateDeal()
  const mutation = deal ? update : create
  const isEdit = Boolean(deal)

  const handleSubmit = (values: DealFormValues) => {
    const handleSuccess = () => onOpenChange(false)

    if (deal) {
      update.mutate(
        { id: deal._id, payload: toUpdateDealPayload(values as DealUpdateFormValues) },
        { onSuccess: handleSuccess }
      )
    } else {
      create.mutate(toCreateDealPayload(values as DealCreateFormValues), {
        onSuccess: handleSuccess,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit deal' : 'Add deal'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the details for this deal.'
              : 'Add a new deal to your sales pipeline.'}
          </DialogDescription>
        </DialogHeader>

        <DealForm
          deal={deal}
          customers={customers}
          pipelines={pipelines}
          stages={stages}
          owners={owners}
          isPending={mutation.isPending}
          serverError={mutation.error?.message}
          submitLabel={isEdit ? 'Save changes' : 'Add deal'}
          loadingLabel={isEdit ? 'Saving…' : 'Adding…'}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
