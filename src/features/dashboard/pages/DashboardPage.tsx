import { useAuthStore, selectUser } from '@/features/auth/store/authStore'
import {
  ACTIVITIES_MOCK,
  QUICK_ACTIONS_MOCK,
  STATS_MOCK,
  TASKS_MOCK,
} from '@/features/dashboard/constants/mockData'
import {
  ActivityList,
  QuickActions,
  SalesOverviewCard,
  StatsCard,
  TaskList,
} from '@/features/dashboard/components'

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

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-sm text-muted-foreground">
          {formatLongDate()} · Here&apos;s what&apos;s happening with your business today.
        </p>
      </header>

      <section
        aria-label="Key metrics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {STATS_MOCK.map((stat) => (
          <StatsCard key={stat.id} item={stat} />
        ))}
      </section>

      <section
        aria-label="Quick actions and sales overview"
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        <QuickActions actions={QUICK_ACTIONS_MOCK} />
        <SalesOverviewCard className="lg:col-span-2" />
      </section>

      <section
        aria-label="Recent activity and upcoming tasks"
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        <ActivityList activities={ACTIVITIES_MOCK} className="lg:col-span-2" />
        <TaskList tasks={TASKS_MOCK} />
      </section>
    </div>
  )
}
