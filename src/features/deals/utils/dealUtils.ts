import type {
  DealCreateFormValues,
  DealUpdateFormValues,
} from '@/features/deals/schemas/deal.schema'
import type {
  CreateDealPayload,
  Deal,
  UpdateDealPayload,
} from '@/features/deals/types/deal.types'

export const dealCreateFormDefaults: DealCreateFormValues = {
  title: '',
  customer: '',
  pipeline: '',
  stage: '',
  value: '',
  expectedCloseDate: '',
  description: '',
}

export const dealUpdateFormDefaults: DealUpdateFormValues = {
  title: '',
  owner: '',
  pipeline: '',
  stage: '',
  value: '',
  expectedCloseDate: '',
  description: '',
}

export function dealToFormValues(deal: Deal): DealUpdateFormValues {
  return {
    title: deal.title,
    owner: deal.owner,
    pipeline: deal.pipeline,
    stage: deal.stage,
    value: String(deal.value),
    expectedCloseDate: deal.expectedCloseDate
      ? deal.expectedCloseDate.slice(0, 10)
      : '',
    description: deal.description ?? '',
  }
}

export function toCreateDealPayload(
  values: DealCreateFormValues
): CreateDealPayload {
  return {
    customer: values.customer,
    pipeline: values.pipeline,
    stage: values.stage,
    title: values.title,
    ...(values.value ? { value: Number(values.value) } : {}),
    ...(values.expectedCloseDate
      ? { expectedCloseDate: values.expectedCloseDate }
      : {}),
    ...(values.description ? { description: values.description } : {}),
  }
}

export function toUpdateDealPayload(
  values: DealUpdateFormValues
): UpdateDealPayload {
  return {
    title: values.title,
    ...(values.value ? { value: Number(values.value) } : {}),
    ...(values.expectedCloseDate
      ? { expectedCloseDate: values.expectedCloseDate }
      : {}),
    ...(values.description ? { description: values.description } : {}),
    ...(values.owner ? { owner: values.owner } : {}),
    ...(values.pipeline ? { pipeline: values.pipeline } : {}),
    ...(values.stage ? { stage: values.stage } : {}),
  }
}
