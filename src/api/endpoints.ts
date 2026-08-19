export const AUTH = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
} as const

export const COMPANIES = {
  BASE: '/companies',
  ME: '/companies/me',
} as const

export const CUSTOMERS = {
  BASE: '/customers',
} as const

export const CUSTOMER_CONTACTS = {
  BASE: '/customer-contacts',
} as const

export const LEADS = {
  BASE: '/leads',
} as const

export const DEALS = {
  BASE: '/deals',
  DETAIL: (id: string) => `/deals/${id}`,
  STAGE: (id: string) => `/deals/${id}/stage`,
  WON: (id: string) => `/deals/${id}/won`,
  LOST: (id: string) => `/deals/${id}/lost`,
} as const

export const TASKS = {
  BASE: '/tasks',
  DETAIL: (id: string) => `/tasks/${id}`,
  COMPLETE: (id: string) => `/tasks/${id}/complete`,
  CANCEL: (id: string) => `/tasks/${id}/cancel`,
} as const

export const DASHBOARD = {
  OVERVIEW: '/dashboard/overview',
  PIPELINE: '/dashboard/pipeline',
  SALES: '/dashboard/sales',
  TASKS: '/dashboard/tasks',
  MEETINGS: '/dashboard/meetings',
  RECENT_ACTIVITIES: '/dashboard/recent-activities',
} as const

export const MEETINGS = {
  BASE: '/meetings',
  DETAIL: (id: string) => `/meetings/${id}`,
  COMPLETE: (id: string) => `/meetings/${id}/complete`,
  CANCEL: (id: string) => `/meetings/${id}/cancel`,
} as const

export const NOTIFICATIONS = {
  BASE: '/notifications',
  DETAIL: (id: string) => `/notifications/${id}`,
  READ: (id: string) => `/notifications/${id}/read`,
  READ_ALL: '/notifications/read-all',
  UNREAD_COUNT: '/notifications/unread-count',
} as const

export const PIPELINES = {
  BASE: '/pipelines',
  DETAIL: (id: string) => `/pipelines/${id}`,
} as const

export const PIPELINE_STAGES = {
  BASE: '/pipeline-stages',
  BY_PIPELINE: (pipelineId: string) =>
    `/pipeline-stages/pipeline/${pipelineId}`,
  DETAIL: (id: string) => `/pipeline-stages/${id}`,
} as const
