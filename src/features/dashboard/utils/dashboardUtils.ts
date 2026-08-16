import type {
  ActivityItem,
  ActivityType,
} from '@/features/dashboard/constants/mockData'
import type { RecentActivity } from '@/features/dashboard/types/dashboard.types'

const ACTIVITY_TYPE_FALLBACK: ActivityType = 'task'

const KNOWN_ACTIVITY_TYPES = new Set<ActivityType>([
  'customer',
  'lead',
  'deal',
  'task',
])

export function formatCurrency(value?: number) {
  if (value == null) return '—'
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatRelativeTime(value?: string): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / 60000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export function formatUpcomingTaskDueDate(value?: string): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diffDays = Math.round(
    (startOfDay(date) - startOfDay(new Date())) / 86400000
  )

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays > 1 && diffDays < 7) {
    return date.toLocaleDateString(undefined, { weekday: 'short' })
  }
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function formatActionLabel(action: string): string {
  const labels: Record<string, string> = {
    create: 'created',
    update: 'updated',
    delete: 'deleted',
    restore: 'restored',
    assign: 'assigned',
    unassign: 'unassigned',
    convert: 'converted',
    move_stage: 'moved stages',
    login: 'logged in',
    logout: 'logged out',
    upload: 'uploaded a file',
    download: 'downloaded a file',
  }
  return labels[action] ?? action.replace(/_/g, ' ')
}

function formatEntityLabel(entityType: string): string {
  return entityType
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function mapActivityToItem(activity: RecentActivity): ActivityItem {
  const type: ActivityType = KNOWN_ACTIVITY_TYPES.has(
    activity.entityType as ActivityType
  )
    ? (activity.entityType as ActivityType)
    : ACTIVITY_TYPE_FALLBACK

  return {
    id: activity._id,
    type,
    title: `${formatEntityLabel(activity.entityType)} ${formatActionLabel(
      activity.action
    )}`,
    description: activity.description,
    timestamp: formatRelativeTime(activity.createdAt),
  }
}
