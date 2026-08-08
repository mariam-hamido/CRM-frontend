import type { LeadFormValues } from '@/features/leads/schemas/lead.schema'
import type {
  CreateLeadPayload,
  Lead,
  UpdateLeadPayload,
} from '@/features/leads/types/lead.types'

export function leadToFormValues(lead: Lead): LeadFormValues {
  return {
    firstName: lead.firstName,
    lastName: lead.lastName,
    companyName: lead.companyName ?? '',
    email: lead.email ?? '',
    phone: lead.phone ?? '',
    status: lead.status,
    source: lead.source,
    score:
      lead.score !== undefined && lead.score !== 0 ? String(lead.score) : '',
    estimatedValue:
      lead.estimatedValue !== undefined && lead.estimatedValue !== 0
        ? String(lead.estimatedValue)
        : '',
    notes: lead.notes ?? '',
  }
}

export function toCreateLeadPayload(
  values: LeadFormValues
): CreateLeadPayload {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    ...(values.companyName ? { companyName: values.companyName } : {}),
    ...(values.email ? { email: values.email } : {}),
    ...(values.phone ? { phone: values.phone } : {}),
    status: values.status,
    source: values.source,
    ...(values.score ? { score: Number(values.score) } : {}),
    ...(values.estimatedValue
      ? { estimatedValue: Number(values.estimatedValue) }
      : {}),
    ...(values.notes ? { notes: values.notes } : {}),
  }
}

export function toUpdateLeadPayload(
  values: LeadFormValues
): UpdateLeadPayload {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    ...(values.companyName ? { companyName: values.companyName } : {}),
    ...(values.email ? { email: values.email } : {}),
    ...(values.phone ? { phone: values.phone } : {}),
    status: values.status,
    source: values.source,
    ...(values.score ? { score: Number(values.score) } : {}),
    ...(values.estimatedValue
      ? { estimatedValue: Number(values.estimatedValue) }
      : {}),
    ...(values.notes ? { notes: values.notes } : {}),
  }
}
