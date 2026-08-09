import type { DealListParams } from '@/features/deals/types/deal.types'

export const dealsQueryKey = ['deals'] as const

export function dealsListQueryKey(params: DealListParams = {}) {
  return ['deals', 'list', params] as const
}

export function dealDetailQueryKey(id: string | undefined) {
  return ['deals', 'detail', id] as const
}
