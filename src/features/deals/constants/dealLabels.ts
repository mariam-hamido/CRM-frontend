import type { DealStatus } from '@/features/deals/types/deal.types'

export const DEAL_STATUS_LABELS: Record<DealStatus, string> = {
  open: 'Open',
  won: 'Won',
  lost: 'Lost',
}
