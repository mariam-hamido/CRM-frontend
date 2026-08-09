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
