import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LeadForm } from '@/features/leads/components/LeadForm'
import { useCreateLead } from '@/features/leads/hooks/useCreateLead'
import { useUpdateLead } from '@/features/leads/hooks/useUpdateLead'
import type { LeadFormValues } from '@/features/leads/schemas/lead.schema'
import type { Lead } from '@/features/leads/types/lead.types'
import {
  toCreateLeadPayload,
  toUpdateLeadPayload,
} from '@/features/leads/utils/leadUtils'

export function LeadDialog({
  lead,
  open,
  onOpenChange,
}: {
  lead: Lead | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const create = useCreateLead()
  const update = useUpdateLead()
  const mutation = lead ? update : create
  const isEdit = Boolean(lead)

  const handleSubmit = (values: LeadFormValues) => {
    const handleSuccess = () => onOpenChange(false)

    if (lead) {
      update.mutate(
        { id: lead._id, payload: toUpdateLeadPayload(values) },
        { onSuccess: handleSuccess }
      )
    } else {
      create.mutate(toCreateLeadPayload(values), { onSuccess: handleSuccess })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit lead' : 'Add lead'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the details for this lead.'
              : 'Add a new lead to your pipeline.'}
          </DialogDescription>
        </DialogHeader>

        <LeadForm
          lead={lead}
          isPending={mutation.isPending}
          serverError={mutation.error?.message}
          submitLabel={isEdit ? 'Save changes' : 'Add lead'}
          loadingLabel={isEdit ? 'Saving…' : 'Adding…'}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
