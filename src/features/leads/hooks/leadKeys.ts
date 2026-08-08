import type { LeadListParams } from '@/features/leads/types/lead.types'

export const leadsQueryKey = ['leads'] as const

export function leadsListQueryKey(params: LeadListParams = {}) {
  return ['leads', 'list', params] as const
}

export function leadDetailQueryKey(id: string | undefined) {
  return ['leads', 'detail', id] as const
}
