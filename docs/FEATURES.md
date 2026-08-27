# Features

This document walks through each feature exactly as implemented. It also covers the **AdminOverview**, **notifications/realtime**, and **action-URL navigation**.

## Shared QueryKey / list conventions

Every list feature uses a `{ page, limit (10), search?, <status/source/type filters> }` query, debounced search (300ms), a `Pagination` footer, and dedicated loading/error/empty components (see [FORMS_AND_UI.md](./FORMS_AND_UI.md)). Mutations invalidate the feature's static root query key (see [STATE_AND_DATA.md](./STATE_AND_DATA.md)).

---

## 1. Auth

- **Login** `/login` → `POST /auth/login`; stores `{ user, token }` on success; redirects to `from` or `/dashboard`. See [AUTHENTICATION.md](./AUTHENTICATION.md).
- **Register** `/register` — chooser screen.
- **Register admin** `/register/admin` → `POST /auth/register/admin`.
- **Register employee** `/register/employee` → `POST /auth/register/employee`.

## 2. Dashboard (`/dashboard`)

`DashboardPage.tsx` queries `useDashboardOverview`, `useSalesStats()`, `useTaskStats()`, `useRecentActivities()`, and `useTasks({ limit: 5, status: 'pending', sortBy: 'dueDate', sortOrder: 'asc' })`.

- Greeting by hour + long date header.
- **AdminOverview** (admin only — see below).
- Key metric cards: Total Customers (`overview.totalCustomers`), Total Leads (`overview.totalLeads`), Open Deals (`overview.totalDeals`), Tasks Due Today (`taskStats.dueToday`).
- `SalesOverviewCard` (`useSalesStats`) — monthly revenue, won deals, conversion rate.
- `ActivityList` — recent activity items (mapped to `customer/lead/deal/task` types).
- `TaskList` — upcoming tasks (filters out overdue, slices 5).

Supporting dashboard components: `StatsCard`, `QuickActions`, `ActivityList`, `TaskList`, plus `DashboardEmpty/Error/Loading`. `constants/mockData.ts` and `utils/dashboardUtils.ts` (`formatCurrency`, `formatRelativeTime`, `mapActivityToItem`, etc.) ship mock types/data, though the page itself renders real query data.

### AdminOverview (`src/features/dashboard/components/AdminOverview.tsx`)

Rendered only for admins (`user?.role === 'admin'`). Counts are computed using **`limit: 1` reads + `pagination.total`**:

```ts
const activeEmployeesQuery     = useGetEmployees({ status: 'active',   limit: 1 })
const inactiveEmployeesQuery   = useGetEmployees({ status: 'inactive', limit: 1 })
const pendingInvitationsQuery  = useGetInvitations({ status: 'pending', limit: 1 })
// counts:
const activeEmployees    = activeEmployeesQuery.data?.pagination?.total ?? 0
const inactiveEmployees  = inactiveEmployeesQuery.data?.pagination?.total ?? 0
const pendingInvitations = pendingInvitationsQuery.data?.pagination?.total ?? 0
```

It also calls `useGetCompany()` (`GET /companies/me`) and shows the company name, industry/city/country, and a website link. It renders:
- Buttons linking to `ROUTES.settings`, `ROUTES.employees`, `ROUTES.invitations`.
- Three stat cards: **Active Employees**, **Inactive Employees**, **Pending Invitations**.

Because these reuse the shared `useGetEmployees`/`useGetInvitations` keys, those counts refresh automatically when employee/invitation mutations invalidate the `['employees']`/`['invitations']` roots.

## 3. Companies (`/companies`, `/settings`)

- `CompaniesPage` (`/companies`) loads `useGetCompany()` and renders `CompanyHeader` (logo/initials, name, status badge, industry, "Edit company") plus five `CompanyInfoCard`s: **General information**, **Contact information**, **Location**, **Business information**, **Company metadata** (created/updated).
- `CompanySettingsPage` (`/settings`) renders `CompanySettingsForm` — react-hook-form + zod over `companyUpdateSchema` with fields: name, industry, website, email, phone, country, city, address, subscriptionPlan, status, timezone, currency, logo URL. Submits via `useUpdateCompany` (`PATCH /companies/me`), which writes the detail cache and invalidates `['companies','me']`.
- `CompanySelectField` is just a re-export of the UI `SelectField`.

Company type highlights: `name`, logos/website/contact/location optionals, `subscriptionPlan` (`free|starter|professional|enterprise`), `status` (`trial|active|suspended|cancelled`), `timezone`, `currency`, `isDeleted`.

## 4. Employees (`/employees`)

- `EmployeesPage` → `useGetEmployees({ page, limit: 10, status })` (`GET /company-employees`).
- `EmployeesTable` columns (responsive): Name, Email (lg+), Role (md+), Status, Joined (md+), Actions.
- Role labels: `admin→Admin`, `manager→Manager`, `sales→Sales`.
- `canRemove(employee)` is a **UX-only** guard: removal is only offered when the employee is active, is not an admin, and is not the current user. `EmployeeRemoveDialog` confirms, then `useRemoveEmployee` → **PATCH `/company-employees/:id/remove`** (removal is a PATCH, not DELETE), invalidating `['employees']`.
- Status filter (All/Active/Inactive); link to `/invitations` in the header.

## 5. Invitations (`/invitations`)

- Model: an **allowlist entry / email approval**, not a user account — only `email` is ever sent to the server.
- `InvitationsPage` → `useGetInvitations({ page, limit: 10, status })`; status filter All/Pending/Accepted/Removed.
- `InviteEmployeeDialog` → `useCreateInvitation` → `POST /company-invitations` with `{ email }`. It's titled "Add to allowlist"; no invitation email is sent.
- `InvitationsTable`: Email, Status, Invited (md+), Accepted (lg+), Actions. Only **pending** invitations show a Remove action (`InvitationStatusBadge`: pending→outline, accepted→default, removed→secondary); the remove dialog warns about allowlist semantics. Removal → `DELETE /company-invitations/:id`.
- Backend business errors (duplicate/already-registered) render inline (field or form-level) rather than as toasts.

## 6. Customers (`/customers`, `/customers/:id`)

- `CustomersPage` → `useGetCustomers({ page, limit: 10, search, status, source })` (`GET /customers`).
- `CustomerTable` columns (responsive): Company, Industry (md+), Email (lg+), Phone (xl+), Status, Source (md+), Revenue (lg+), Employees (xl+), Created (md+), Actions (View/Edit/Delete).
- Row **View** → `navigate(ROUTES.customersDetail.replace(':id', customer._id))`.
- `CreateCustomerPayload`: companyName required; optional industry/website/email/phone/country/city/address/status/source/annualRevenue/employeesCount.
- `CustomerDetailPage` (`/customers/:id`): reads `:id`, loads `useGetCustomer(id)` + `useGetCompany()`, shows a "Back to customers" button, header (name + status/source badges), info cards (General, Contact, Location, Business, Customer metadata including workspace name), and the **`CustomerContactsSection`**.

### Per-customer contacts (`src/features/customers/contacts/`)

- `CustomerContactsSection` (embedded in the customer detail page) uses `useCustomerContacts(customerId, { page, limit: 10, search, isPrimary })` → `GET /customer-contacts/customer/:customerId`.
- `CustomerContactDialog` is pre-bound to the current customer (no customer picker).
- `CustomerContactList` (with `showCustomer` off) lists name, job title (lg+), email (lg+), phone (xl+), Primary badge, actions; a `★ Primary` badge marks `isPrimary`. `CustomerContactRow`'s actions include a toggle-primary item (via `useUpdateContact`).
- `CustomerContactDeleteDialog` submits `{ id, customerId }` so both the per-customer and global caches can be refreshed.

## 7. Contacts — global (`/contacts`)

The **global contacts** page lists **all contacts across all customers** in the workspace.

- `ContactsPage` → `useGlobalContacts({ page, limit: 10, search, isPrimary, customer })` (`GET /customer-contacts`) plus `useGetCustomers({ limit: 100 })` to populate a customer filter and seed the customer-name lookup.
- `useGlobalContactCustomerNames({ contacts, customers })` builds a `Map<customerId, companyName>`, fetching any missing customers (via `useQueries` fan-out under `['customers','detail',id]`).
- `CustomerContactList` is rendered with `showCustomer` on, adding a clickable Customer column (each name links to `/customers/:id`).
- `GlobalContactDialog`: on **create** it requires selecting a customer (a `SelectField`); on **edit** the customer is read-only (shown via the name map).
- **Cache sync:** every contact mutation invalidates BOTH the per-customer scope (`['customer-contacts','customer',id]`) and the global scope (`['customer-contacts','global']`), so `/customers/:id` and `/contacts` stay consistent with each other.

## 8. Leads (`/leads`)

- `LeadsPage` → `useLeads({ page, limit: 10, search, status, source })` (`GET /leads`).
- `LeadTable`/`LeadList` columns (responsive): Name, Company (lg+), Email (xl+), Status, Source (md+), Value (md+), Actions.
- Lead statuses: `new, contacted, qualified, proposal_sent, negotiation, converted, lost`; sources: `website, referral, social_media, cold_call, email, advertisement, event, other`.
- Lead dialog fields: firstName, lastName, companyName, email, phone, status, source, score (0–100), estimatedValue, notes.
- Row actions are **Edit and Delete only** — there is no "View" and no navigation from a lead row.
- **`/leads/:id` detail page intentionally does NOT exist.** Confirmed from source:
  - `ROUTES` (`routeConstants.ts`) defines only `leads: '/leads'` — there is no `leadsDetail`.
  - `routeConfig.tsx` registers only `/leads` → `LeadsPage`; nothing maps a `:id` path for leads.
  - `lazyPages.tsx` lazy-loads only `LeadsPage` (no `LeadDetailPage`).
  - `LeadRow.tsx` has no `Link`/`useNavigate`.
  - A `useLead(id)` hook and `getLead(id)`/`convertLead` API functions exist but are mounted nowhere (dead code awaiting a detail page that is not present).

## 9. Deals (`/deals`, `/deals/:id`)

- `DealsPage` supports a **List/Board toggle** (segmented control, default `list`):
  - **List view** → `useDeals({ page, limit: 10, search, status, pipeline, stage, owner })`; filters: status, pipeline, stage (stages filtered by selected pipeline), owner (current user only).
  - **Board view** → `<DealKanbanBoard />` — select a pipeline (`usePipelineStagesByPipeline(pipelineId)` + `useDeals({ pipeline, limit: 100 }, enabled)`), then drag deals between stage columns.
- Deal statuses: `open, won, lost`. `Deal` has `value`, `probability`, `expectedCloseDate`, `actualCloseDate`, `lostReason`, `pipeline`, `stage`, `customer`, `owner`.
- **Kanban (drag-and-drop) — @dnd-kit.** `DealKanbanBoard` uses `DndContext` with `PointerSensor` (5px activation distance) + `KeyboardSensor`, `closestCorners` collision detection, `restrictToFirstScrollableAncestor` modifier. Columns are droppables (`useDroppable`, stage id); cards are sortable (`useSortable`, deal id). `handleDragEnd` resolves the target stage (a column, or the stage of an overlapped deal) and calls `moveStage.mutate({ id, payload: { stage: targetStageId } })`.
- `useMoveDealStage` → **PATCH `/deals/:id/stage`** with `{ stage }`; on success updates the detail cache + invalidates `['deals']`; on error, invalidates and toasts.
- `DealDetailPage` (`/deals/:id`): loads `useDeal(id)` plus lookup sets; header (title + status badge, pipeline subtext, Edit/Delete); info cards "Deal overview", "Customer information" (link to customer detail), "Ownership and metadata". Note: `markDealWon`/`markDealLost` API functions exist (`PATCH /deals/:id/won` / `.../lost`) but **no hook exposes them** in the current source.

## 10. Tasks (`/tasks`, `/tasks/:id`)

- `TasksPage` → `useTasks({ page, limit: 10, search, status, priority })`; filters status + priority; list only (no board).
- Task statuses: `pending, in_progress, completed, cancelled, overdue`; priorities: `low, medium, high, urgent`. `Task.isOverdue` is a backend-computed flag surfaced as an "Overdue" alert.
- `useCompleteTask` → **PATCH `/tasks/:id/complete`**; `useCancelTask` → **PATCH `/tasks/:id/cancel`**.
- **Permission predicates** (UX-only): admin/manager or assignee → can edit/complete/cancel; admin/manager or creator (`task.createdBy`) → can delete. `TasksPage` and `TaskDetailPage` gate the action buttons/row menu with these.
- `TaskDetailPage`: title + status/priority badges, actions (Complete/Cancel/Edit/Delete, conditionally shown), info cards "Task overview", "Relationships" (Customer link, Deal link, Assignee), "Task metadata". **No comments section exists** — detail is read-only info + actions.
- Task create fields: title (required), priority, dueDate (required `datetime-local`), optional reminderDate, customer, deal, description; assignee defaults to the current user and is displayed as text (not editable on the form).

## 11. Meetings (`/meetings`, `/meetings/:id`)

- `MeetingsPage` → `useMeetings({ page, limit: 10, search, status, meetingType })`; filters status + type; list only.
- Meeting statuses: `scheduled, completed, cancelled, no_show`; types: `in_person, phone, video`. `Meeting` links `customer` (required) and optional `deal`; there is **no explicit participants array** — membership is effectively organiser + linked customer (and deal).
- `useCompleteMeeting` → `PATCH /meetings/:id/complete`; `useCancelMeeting` → `PATCH /meetings/:id/cancel`.
- On both the page and detail view, **Complete/Cancel are only shown when `status === 'scheduled'`**; Edit/Delete are always available.
- `MeetingDetailPage`: title + status/type badges, info cards "Meeting overview", "Location" (location + clickable meeting link), "Relationships" (Customer + Deal links), "Meeting metadata". Relationship links are plain `<a href>` in this feature. No comments section.

## 12. Pipelines (`/pipelines`)

- `PipelinesPage` → `usePipelines({ page, limit: 10, search, isDefault, sortBy: 'name', sortOrder: 'asc' })` + `usePipelineStagesByPipeline(selectedPipeline?._id)`; auto-selects the default/first pipeline.
- **Pipeline:** `name`, optional `description`/`color`, `isDefault`, `isActive`.
- **PipelineStage:** `name`, optional `description`/`color`, `order`, `probability`, `isWonStage`/`isLostStage` booleans (a stage cannot be both — enforced by the schema's `superRefine`), `isActive`. `PipelineStageResultBadge` renders a green "✓ Won" or destructive "Lost" badge based on those flags.
- Stage dialogs create/edit with fields: name, description, order (≥1), probability (0–100), color, "Won stage"/"Lost stage" checkboxes.
- Pipelines link to deals: `Deal.pipeline`/`Deal.stage` reference pipeline/stage ids; deals filter by them; moving a deal updates `stage`. Creating a deal requires choosing pipeline + stage.
- Delete dialogs warn that deleting a pipeline removes its stages from the active list.

## 13. Notifications (`/notifications`)

- `NotificationsPage` → `useNotifications({ page, limit: 10, search, isRead })` + `useUnreadCount()`.
- Header shows unread count ("N unread" or "All caught up") and a **"Mark all as read"** button (only when unread > 0) → `useMarkAllNotificationsRead` → `PATCH /notifications/read-all`.
- Filters: search (title/message) + read status (All/Unread/Read).
- `NotificationRow`: title (bold when unread + unread dot), type badge, read/unread status badge, related entity, received time, actions (mark read / delete). `NotificationStatusBadge`: Read→outline / Unread→default. `NotificationTypeBadge` variants: system→outline; task/meeting/customer/lead/deal/reminder→secondary; success→default; warning→outline; error→destructive.
- Per-row mark read → `useMarkNotificationRead` → `PATCH /notifications/:id/read`. Both mark-read mutations invalidate `['notifications']` and the unread-count key. Delete → `DELETE /notifications/:id`.

### Realtime tie-in

The `useRealtimeNotifications` hook (activated at the root by `RealtimeNotificationsBridge`) listens for `notification:new` over Socket.IO and updates the detail cache, matching list caches, and the unread-count cache live — see [STATE_AND_DATA.md](./STATE_AND_DATA.md).

## Action-URL navigation

The `Notification` type carries `actionUrl: string | null`. In `NotificationRow`, a **"View" link is rendered only when `actionUrl` starts with `/`** (a relative path); non-relative values get no link. This is the mechanism the backend uses to deep-link a notification into a page (e.g. `/deals/:id`). Confirmed: the frontend renders/uses `actionUrl` only for relative paths in the notifications list.

## Feature matrix

| Feature | Route(s) | List filters | Special actions | Detail page |
| --- | --- | --- | --- | --- |
| Auth | login/register | — | no auto-login | — |
| Dashboard | `/dashboard` | — | AdminOverview (admin) | — |
| Companies | `/companies`, `/settings` | — | settings form | — |
| Employees | `/employees` | status | remove (admin) | — |
| Invitations | `/invitations` | status | invite email / remove | — |
| Customers | `/customers/:id` | status, source | — | `/customers/:id` |
| Contacts (global) | `/contacts` | search, primary, customer | global create/edit | — |
| Leads | `/leads` | status, source | — | **none (by design)** |
| Deals | `/deals`, `/deals/:id` | status, pipeline, stage, owner | **Kanban drag** | `/deals/:id` |
| Tasks | `/tasks`, `/tasks/:id` | status, priority | complete, cancel | `/tasks/:id` |
| Meetings | `/meetings`, `/meetings/:id` | status, type | complete, cancel | `/meetings/:id` |
| Pipelines | `/pipelines` | search, default | stage won/lost/probability | — |
| Notifications | `/notifications` | search, read status | mark read, mark all read | — |
