import { LayoutDashboard, type LucideIcon } from 'lucide-react'
import { ROUTES } from '@/app/router/routeConstants'

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  children?: NavItem[]
}

export const NAVIGATION: NavItem[] = [
  {
    title: 'Dashboard',
    href: ROUTES.dashboard,
    icon: LayoutDashboard,
  },
]
