import {
  CalendarClock,
  CalendarPlus,
  FilePlus2,
  Handshake,
  ListChecks,
  UserPlus,
  UserRoundPlus,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type TrendDirection = 'up' | 'down'

export type StatAccent = 'primary' | 'secondary' | 'muted' | 'destructive'

export interface StatItem {
  id: string
  title: string
  value: string
  icon: LucideIcon
  accent: StatAccent
  trend?: {
    direction: TrendDirection
    value: string
    label: string
  }
}

export type ActivityType = 'customer' | 'lead' | 'deal' | 'task'

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
}

export type TaskPriority = 'high' | 'medium' | 'low' | 'urgent'

export interface TaskItem {
  id: string
  title: string
  dueDate: string
  priority: TaskPriority
}

export type QuickActionVariant = 'default' | 'outline' | 'secondary' | 'ghost'

export interface QuickActionItem {
  id: string
  label: string
  icon: LucideIcon
  variant: QuickActionVariant
  path?: string
}

export const STATS_MOCK: StatItem[] = [
  {
    id: 'total-customers',
    title: 'Total Customers',
    value: '1,284',
    icon: Users,
    accent: 'primary',
    trend: { direction: 'up', value: '12.5%', label: 'vs last month' },
  },
  {
    id: 'active-leads',
    title: 'Active Leads',
    value: '86',
    icon: Handshake,
    accent: 'secondary',
    trend: { direction: 'up', value: '8.2%', label: 'vs last month' },
  },
  {
    id: 'open-deals',
    title: 'Open Deals',
    value: '34',
    icon: ListChecks,
    accent: 'muted',
    trend: { direction: 'down', value: '3.1%', label: 'vs last month' },
  },
  {
    id: 'tasks-due-today',
    title: 'Tasks Due Today',
    value: '12',
    icon: CalendarClock,
    accent: 'destructive',
    trend: { direction: 'up', value: '+2', label: 'vs yesterday' },
  },
]

export const QUICK_ACTIONS_MOCK: QuickActionItem[] = [
  {
    id: 'add-customer',
    label: 'Add Customer',
    icon: UserPlus,
    variant: 'default',
    path: '/customers',
  },
  {
    id: 'create-lead',
    label: 'Create Lead',
    icon: UserRoundPlus,
    variant: 'outline',
    path: '/leads',
  },
  {
    id: 'new-deal',
    label: 'New Deal',
    icon: FilePlus2,
    variant: 'outline',
    path: '/deals',
  },
  {
    id: 'schedule-meeting',
    label: 'Schedule Meeting',
    icon: CalendarPlus,
    variant: 'outline',
  },
]

export const ACTIVITIES_MOCK: ActivityItem[] = [
  {
    id: 'activity-1',
    type: 'customer',
    title: 'John Doe became a customer',
    description: 'Acme Corp · signed up today',
    timestamp: '2h ago',
  },
  {
    id: 'activity-2',
    type: 'lead',
    title: 'New lead created',
    description: 'Sarah Smith · Newsletter campaign',
    timestamp: '4h ago',
  },
  {
    id: 'activity-3',
    type: 'deal',
    title: 'Deal moved to Proposal',
    description: 'Acme Corp · $24,000',
    timestamp: 'Yesterday',
  },
  {
    id: 'activity-4',
    type: 'task',
    title: 'Task completed',
    description: 'Follow-up call with Globex',
    timestamp: 'Yesterday',
  },
]

export const TASKS_MOCK: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Follow up with Acme Corp',
    dueDate: 'Today',
    priority: 'high',
  },
  {
    id: 'task-2',
    title: 'Prepare Q3 pipeline report',
    dueDate: 'Tomorrow',
    priority: 'medium',
  },
  {
    id: 'task-3',
    title: 'Update contact records',
    dueDate: 'Aug 10',
    priority: 'low',
  },
  {
    id: 'task-4',
    title: 'Renew Globex contract',
    dueDate: 'Aug 12',
    priority: 'medium',
  },
]
