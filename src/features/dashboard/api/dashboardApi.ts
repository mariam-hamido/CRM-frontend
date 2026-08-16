import { apiClient } from '@/api/client'
import { DASHBOARD } from '@/api/endpoints'
import type {
  DashboardMeetingStatsParams,
  DashboardMeetingStatsResponse,
  DashboardOverviewResponse,
  DashboardPipelineStatsResponse,
  DashboardSalesParams,
  DashboardSalesStatsResponse,
  DashboardTaskStatsParams,
  DashboardTaskStatsResponse,
  RecentActivitiesResponse,
} from '@/features/dashboard/types/dashboard.types'

export async function getDashboardOverview(): Promise<DashboardOverviewResponse> {
  const response = await apiClient.get<DashboardOverviewResponse>(
    DASHBOARD.OVERVIEW
  )
  return response.data
}

export async function getPipelineStats(
  params: { pipelineId?: string } = {}
): Promise<DashboardPipelineStatsResponse> {
  const response = await apiClient.get<DashboardPipelineStatsResponse>(
    DASHBOARD.PIPELINE,
    { params }
  )
  return response.data
}

export async function getSalesStats(
  params: DashboardSalesParams = {}
): Promise<DashboardSalesStatsResponse> {
  const response = await apiClient.get<DashboardSalesStatsResponse>(
    DASHBOARD.SALES,
    { params }
  )
  return response.data
}

export async function getTaskStats(
  params: DashboardTaskStatsParams = {}
): Promise<DashboardTaskStatsResponse> {
  const response = await apiClient.get<DashboardTaskStatsResponse>(
    DASHBOARD.TASKS,
    { params }
  )
  return response.data
}

export async function getMeetingStats(
  params: DashboardMeetingStatsParams = {}
): Promise<DashboardMeetingStatsResponse> {
  const response = await apiClient.get<DashboardMeetingStatsResponse>(
    DASHBOARD.MEETINGS,
    { params }
  )
  return response.data
}

export async function getRecentActivities(): Promise<RecentActivitiesResponse> {
  const response = await apiClient.get<RecentActivitiesResponse>(
    DASHBOARD.RECENT_ACTIVITIES
  )
  return response.data
}
