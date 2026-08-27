# Server State, React Query, Caching & Realtime

This document covers how the frontend manages remote/server state with TanStack Query, the query-key conventions, caching/invalidation patterns, and the realtime notification wiring.

## Setup (`src/app/queryClient.ts`)

- A single module-level `QueryClient` singleton is created and provided via `QueryProvider` (`QueryClientProvider`).
- It is intentionally a module singleton (not created inside the provider) so non-component code — specifically `clearSession()` in `authUtils.ts` — can clear the entire server-state cache (`queryClient.clear()`) on logout or a global-401 redirect.

## Query-key conventions

Every feature defines its own query-key factory in `hooks/<feature>Keys.ts`. The overwhelming pattern is a 3-tier structure:

```ts
['<entity>']                    // static root used to invalidate ALL of the entity's caches
['<entity>', 'list', params]    // a list query (params embedded as the 3rd element)
['<entity>', 'detail', id]      // a detail query
```

Key-factory examples (verbatim patterns across features):

- Companies: `['companies', 'me']` (single company root is `companyQueryKey`).
- Employees: `['employees']`, `['employees', 'list', params]`.
- Invitations: `['invitations']`, `['invitations', 'list', params]`.
- Customers: `['customers']`, `['customers', 'list', params]`, `['customers', 'detail', id]`.
- Customer contacts: `['customer-contacts', 'customer', customerId]`, `['customer-contacts', 'customer', customerId, params]`, `['customer-contacts', 'global']`, `['customer-contacts', 'global', params]`, `['customer-contacts', 'detail', contactId]`.
- Leads: `['leads']`, `['leads', 'list', params]`, `['leads', 'detail', id]`.
- Deals: `['deals']`, `['deals', 'list', params]`, `['deals', 'detail', id]`.
- Tasks: `['tasks']`, `['tasks', 'list', params]`, `['tasks', 'detail', id]`.
- Meetings: `['meetings']`, `['meetings', 'list', params]`, `['meetings', 'detail', id]`.
- Pipelines: `['pipelines']`, `['pipelines', 'list', params]`, `['pipelines', 'detail', id]`; stages: `['pipeline-stages']`, `['pipeline-stages', 'list', params]`, `['pipeline-stages', 'pipeline', pipelineId]`, `['pipeline-stages', 'detail', id]`.
- Notifications: `['notifications']`, `['notifications', 'list', params]`, `['notifications', 'detail', id]`, `['notifications', 'unread-count']`.
- Dashboard: `['dashboard', 'overview']`, `['dashboard', 'sales'|'tasks'|'meetings', params]`, `['dashboard', 'pipeline']`, `['dashboard', 'recent-activities']`.

Because TanStack Query matches keys by prefix, invalidating a static root (e.g. `['employees']`) invalidates all matching `['employees', 'list', ...]` queries at once. Features exploit this so a single mutation refreshes a shared resource everywhere (for example `useRemoveEmployee` invalidates `['employees']`, which also refreshes the AdminOverview count queries on `/company-employees`).

## Caching & invalidation patterns

Standard mutation pattern observed in nearly every feature hook:

- **Create:** `mutationFn` → POST; `onSuccess` → `invalidateQueries({ queryKey: <root> })` + success `toast`.
- **Update:** `mutationFn` → PUT; `onSuccess` → `setQueryData(<detailKey>, entity)` **and** `invalidateQueries({ queryKey: <root> })` + toast.
- **Delete:** `mutationFn` → DELETE; `onSuccess` → `removeQueries(<detailKey>)` **and** `invalidateQueries({ queryKey: <root> })` + toast.
- **State transitions** (complete/cancel/read/move-stage): `onSuccess` → `setQueryData(<detailKey>, entity)` + `invalidateQueries({ queryKey: <root> })` + toast; often an `onError` that shows a `toast.error`.

Because mutating features (tasks, employees, customers, deals, etc.) invalidate their own root keys, and the dashboard queries mostly derive from the same underlying resources only where they reuse the same keys, dashboard counters tied to shared hooks stay consistent (see the AdminOverview note in [FEATURES.md](./FEATURES.md)).

## Dashboard reads

Dashboard hooks (`useDashboardOverview`, `useSalesStats`, `useTaskStats`, `useMeetingStats`, `useRecentActivities`) are all read-only `useQuery`s against `/dashboard/*` endpoints. The `DashboardPage` also mounts `useTasks({ limit: 5, status: 'pending', sortBy: 'dueDate', sortOrder: 'asc' })` for the upcoming-tasks list.

## Realtime notifications

Realtime is implemented with `socket.io-client` in `src/lib/realtime/`.

### `socketClient.ts`

- `REALTIME_URL` is derived as the **origin** of `API_BASE_URL` (`new URL(API_BASE_URL).origin`), so the socket connects to the same host as the API.
- `ensureRealtimeConnection(token)` returns a shared socket singleton. If a connection already exists for the same token, it is reused; if the authenticated session changed (different token), the old socket is disconnected before creating a new one (so a previous identity never keeps receiving events).
- The socket is created with `auth: { token }`, `autoConnect: true`, and `reconnection: true`.
- `getRealtimeSocket()` and `disconnectRealtime()` expose/teardown the connection.

### `useRealtimeNotifications.ts`

A hook (activated at the app root by `RealtimeNotificationsBridge`) that:

1. If not authenticated / no token, disconnects the socket.
2. Otherwise ensures the connection and listens for the socket event `notification:new` (`const NOTIFICATION_NEW_EVENT = 'notification:new'`).
3. On that event, with a `Notification` payload guard (requires `payload._id` to be a string), it updates the React Query cache:
   - **Detail cache:** `setQueryData(notificationDetailQueryKey(id), notification)`.
   - **List caches:** iterates every cached query whose key starts with the `['notifications','list']` prefix; for each, reads its params and calls `matchesListFilters(params, notification)`; only inserts the new notification into lists whose filters it can be verified against (a list with a `search` term, or a differing `isRead`/`type`/`entityType`/`entityId`, is **not** mutated — it stays consistent via normal refetch). When inserted, `mergeNotificationIntoList` dedupes by id, prepends, truncates to `pagination.limit`, and increments `pagination.total`/`totalPages`.
   - **Unread count:** if the notification is unread, increments the cached `['notifications','unread-count']` count.
4. Cleans up the listener on unmount/token change (`socket.off(NOTIFICATION_NEW_EVENT, ...)`).

This is how the bell badge and notification list stay live without polling.

## Cross-cutting data notes

- **Debounced search:** list pages debounce their search input (300ms) via `useDebouncedValue` before embedding it in query params, so typing does not fire a request per keystroke.
- **Detail-vs-list lookup:** several pages fetch small lookup sets (e.g. `useGetCustomers({ limit: 100 })`, `usePipelines({ limit: 100 })`) purely to translate foreign keys (customer name, pipeline/stage name, deal name) into display labels; per-detail fetches fill in anything missing.
