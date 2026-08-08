import type {
  LeadSource,
  LeadStatus,
} from '@/features/leads/types/lead.types'

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal_sent: 'Proposal sent',
  negotiation: 'Negotiation',
  converted: 'Converted',
  lost: 'Lost',
}

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  website: 'Website',
  referral: 'Referral',
  social_media: 'Social media',
  cold_call: 'Cold call',
  email: 'Email',
  advertisement: 'Advertisement',
  event: 'Event',
  other: 'Other',
}
