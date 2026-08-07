import {
  Bell,
  Building2,
  CalendarDays,
  Contact,
  Handshake,
  LayoutDashboard,
  ListChecks,
  Settings,
  Users,
  UserRound,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { ROUTES } from '@/app/router/routeConstants'
import type { UserRole } from '@/features/auth/types/auth.types'

export type NavSection = 'main' | 'management' | 'sales' | 'activity' | 'account'

export interface NavItem {
  id: string
  label: string
  path: string
  icon: LucideIcon
  section?: NavSection
  children?: NavItem[]
  allowedRoles?: UserRole[]
  badge?: string
  disabled?: boolean
}

export const NAVIGATION: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: ROUTES.dashboard,
    icon: LayoutDashboard,
    section: 'main',
  },
  {
    id: 'companies',
    label: 'Companies',
    path: '/companies',
    icon: Building2,
    section: 'management',
  },
  {
    id: 'customers',
    label: 'Customers',
    path: '/customers',
    icon: Users,
    section: 'management',
  },
  {
    id: 'contacts',
    label: 'Contacts',
    path: '/contacts',
    icon: Contact,
    section: 'management',
  },
  {
    id: 'leads',
    label: 'Leads',
    path: '/leads',
    icon: Handshake,
    section: 'sales',
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    path: '/pipeline',
    icon: Workflow,
    section: 'sales',
  },
  {
    id: 'deals',
    label: 'Deals',
    path: '/deals',
    icon: ListChecks,
    section: 'sales',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: CalendarDays,
    section: 'activity',
  },
  {
    id: 'meetings',
    label: 'Meetings',
    path: '/meetings',
    icon: UserRound,
    section: 'activity',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    path: '/notifications',
    icon: Bell,
    section: 'account',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: ROUTES.settings,
    icon: Settings,
    section: 'account',
  },
]

export const NAVIGATION_SECTION_LABELS: Record<NavSection, string> = {
  main: 'Main',
  management: 'Management',
  sales: 'Sales',
  activity: 'Activity',
  account: 'Account',
}

export interface NavSectionGroup {
  section: NavSection
  label: string
  items: NavItem[]
}

export function getNavSections(): NavSectionGroup[] {
  const groups = new Map<NavSection, NavItem[]>()

  for (const item of NAVIGATION) {
    const section = item.section ?? 'main'
    const items = groups.get(section) ?? []
    items.push(item)
    groups.set(section, items)
  }

  return [...groups.entries()].map(([section, items]) => ({
    section,
    label: NAVIGATION_SECTION_LABELS[section],
    items,
  }))
}
