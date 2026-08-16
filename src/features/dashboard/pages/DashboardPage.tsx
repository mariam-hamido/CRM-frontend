import { CalendarClock, Handshake, ListChecks, Users } from 'lucide-react'
import { useAuthStore, selectUser } from '@/features/auth/store/authStore'
import type {
  StatItem,
  TaskItem,
} from '@/features/dashboard/constants/mockData'
import { QUICK_ACTIONS_MOCK } from '@/features/dashboard/constants/mockData'
import {
  ActivityList,
  DashboardEmpty,
  DashboardError,
  DashboardLoading,
  QuickActions,
  SalesOverviewCard,
  StatsCard,
  TaskList,
} from '@/features/dashboard/components'
import { useDashboardOverview } from '@/features/dashboard/hooks/useDashboardOverview'
import { useRecentActivities } from '@/features/dashboard/hooks/useRecentActivities'
import { useSalesStats } from '@/features/dashboard/hooks/useSalesStats'
import { useTaskStats } from '@/features/dashboard/hooks/useTaskStats'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import {
  formatUpcomingTaskDueDate,
  mapActivityToItem,
} from '@/features/dashboard/utils/dashboardUtils'

function getGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function formatLongDate(date = new Date()) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function DashboardPage() {
  const user = useAuthStore(selectUser)
  const firstName = user?.firstName ?? 'there'

  const overviewQuery = useDashboardOverview()
  const salesQuery = useSalesStats()
  const taskStatsQuery = useTaskStats()
  const recentActivitiesQuery = useRecentActivities()
  const upcomingTasksQuery = useTasks({
    limit: 5,
    status: 'pending',
    sortBy: 'dueDate',
    sortOrder: 'asc',
  })

  const retryAll = () => {
    void overviewQuery.refetch()
    void salesQuery.refetch()
    void taskStatsQuery.refetch()
    void recentActivitiesQuery.refetch()
    void upcomingTasksQuery.refetch()
  }

  const statsPending =
    overviewQuery.isPending || taskStatsQuery.isPending
  const statsError = overviewQuery.isError || taskStatsQuery.isError
  const overview = overviewQuery.data
  const taskStats = taskStatsQuery.data

  const stats: StatItem[] = [
    {
      id: 'total-customers',
      title: 'Total Customers',
      value: overview ? overview.totalCustomers.toLocaleString() : '—',
      icon: Users,
      accent: 'primary',
    },
    {
      id: 'total-leads',
      title: 'Total Leads',
      value: overview ? overview.totalLeads.toLocaleString() : '—',
      icon: Handshake,
      accent: 'secondary',
    },
    {
      id: 'open-deals',
      title: 'Open Deals',
      value: overview ? overview.totalDeals.toLocaleString() : '—',
      icon: ListChecks,
      accent: 'muted',
    },
    {
      id: 'tasks-due-today',
      title: 'Tasks Due Today',
      value: taskStats ? taskStats.dueToday.toLocaleString() : '—',
      icon: CalendarClock,
      accent: 'destructive',
    },
  ]

  const activities = (recentActivitiesQuery.data ?? []).map(mapActivityToItem)

  const upcomingTasks: TaskItem[] = (upcomingTasksQuery.data?.tasks ?? [])
    .filter((task) => !task.isOverdue)
    .slice(0, 5)
    .map((task) => ({
      id: task._id,
      title: task.title,
      dueDate: formatUpcomingTaskDueDate(task.dueDate),
      priority: task.priority,
    }))

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-sm text-muted-foreground">
          {formatLongDate()} · Here&apos;s what&apos;s happening with your
          business today.
        </p>
      </header>

      <section
        aria-label="Key metrics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {statsPending ? (
          <DashboardLoading
            label="Loading metrics…"
            className="sm:col-span-2 xl:col-span-4"
          />
        ) : statsError ? (
          <DashboardError
            message={
              overviewQuery.error?.message ?? taskStatsQuery.error?.message
            }
            onRetry={retryAll}
            className="sm:col-span-2 xl:col-span-4"
          />
        ) : (
          stats.map((stat) => <StatsCard key={stat.id} item={stat} />)
        )}
      </section>

      <section
        aria-label="Quick actions and sales overview"
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        <QuickActions actions={QUICK_ACTIONS_MOCK} />
        <SalesOverviewCard stats={salesQuery.data} className="lg:col-span-2" />
      </section>

      <section
        aria-label="Recent activity and upcoming tasks"
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        {recentActivitiesQuery.isPending ? (
          <DashboardLoading
            label="Loading activity…"
            className="lg:col-span-2"
          />
        ) : recentActivitiesQuery.isError ? (
          <DashboardError
            message={recentActivitiesQuery.error?.message}
            onRetry={() => void recentActivitiesQuery.refetch()}
            className="lg:col-span-2"
          />
        ) : activities.length === 0 ? (
          <DashboardEmpty
            title="No recent activity"
            description="Your recent actions will appear here."
            className="lg:col-span-2"
          />
        ) : (
          <ActivityList activities={activities} className="lg:col-span-2" />
        )}

        {upcomingTasksQuery.isPending ? (
          <DashboardLoading label="Loading tasks…" />
        ) : upcomingTasksQuery.isError ? (
          <DashboardError
            message={upcomingTasksQuery.error?.message}
            onRetry={() => void upcomingTasksQuery.refetch()}
          />
        ) : upcomingTasks.length === 0 ? (
          <DashboardEmpty
            title="No upcoming tasks"
            description="You&apos;re all caught up."
          />
        ) : (
          <TaskList tasks={upcomingTasks} />
        )}
      </section>
    </div>
  )
}
