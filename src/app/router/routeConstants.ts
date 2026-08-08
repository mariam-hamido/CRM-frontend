export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  companies: '/companies',
  customers: '/customers',
  customersDetail: '/customers/:id',
  settings: '/settings',
  notFound: '*',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]

export interface AuthRedirectState {
  from?: string
}
