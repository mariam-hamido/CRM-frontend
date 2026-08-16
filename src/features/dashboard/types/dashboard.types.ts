import type { ApiResponse } from '@/types/api'

export interface DashboardOverview {
  totalCustomers: number
  totalLeads: number
  totalDeals: number
  totalPipelineValue: number
  wonDeals: number
  lostDeals: number
  activeTasks: number
  overdueTasks: number
  upcomingMeetings: number
}

export interface DashboardSalesParams {
  from?: string
  to?: string
}

export interface DashboardSalesStats {
  monthlyRevenue: number
  wonDeals: number
  lostDeals: number
  conversionRate: number
  period: {
    from: string
    to: string
  }
}

export interface DashboardTaskStatsParams {
  assignedTo?: string
}

export interface DashboardTaskStats {
  completed: number
  pending: number
  overdue: number
  dueToday: number
}

export interface DashboardMeetingStatsParams {
  organizer?: string
}

export interface DashboardMeetingStats {
  today: number
  week: number
  month: number
}

export interface DashboardPipelineStat {
  stage: string
  order: number
  count: number
  value: number
}

export interface RecentActivity {
  _id: string
  company: string
  user: string
  entityType: string
  entityId: string
  action: string
  description: string
  createdAt: string
}

export type DashboardOverviewResponse = ApiResponse<DashboardOverview>
export type DashboardSalesStatsResponse = ApiResponse<DashboardSalesStats>
export type DashboardTaskStatsResponse = ApiResponse<DashboardTaskStats>
export type DashboardMeetingStatsResponse = ApiResponse<DashboardMeetingStats>
export type DashboardPipelineStatsResponse = ApiResponse<DashboardPipelineStat[]>
export type RecentActivitiesResponse = ApiResponse<RecentActivity[]>
