import type {
  DashboardMeetingStatsParams,
  DashboardSalesParams,
  DashboardTaskStatsParams,
} from '@/features/dashboard/types/dashboard.types'

export const dashboardQueryKey = ['dashboard'] as const

export const dashboardOverviewQueryKey = ['dashboard', 'overview'] as const

export const dashboardPipelineQueryKey = ['dashboard', 'pipeline'] as const

export function dashboardSalesQueryKey(params: DashboardSalesParams = {}) {
  return ['dashboard', 'sales', params] as const
}

export function dashboardTaskStatsQueryKey(
  params: DashboardTaskStatsParams = {}
) {
  return ['dashboard', 'tasks', params] as const
}

export function dashboardMeetingStatsQueryKey(
  params: DashboardMeetingStatsParams = {}
) {
  return ['dashboard', 'meetings', params] as const
}

export const dashboardRecentActivitiesQueryKey = [
  'dashboard',
  'recent-activities',
] as const
