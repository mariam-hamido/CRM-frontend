export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  registerAdmin: '/register/admin',
  registerEmployee: '/register/employee',
  dashboard: '/dashboard',
  profile: '/profile',
  companies: '/companies',
  customers: '/customers',
  customersDetail: '/customers/:id',
  employees: '/employees',
  invitations: '/invitations',
  contacts: '/contacts',
  leads: '/leads',
  deals: '/deals',
  dealsDetail: '/deals/:id',
  meetings: '/meetings',
  meetingsDetail: '/meetings/:id',
  tasks: '/tasks',
  tasksDetail: '/tasks/:id',
  pipelines: '/pipelines',
  notifications: '/notifications',
  settings: '/settings',
  notFound: '*',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]

export interface AuthRedirectState {
  from?: string
}
