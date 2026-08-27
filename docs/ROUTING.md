# Routing

This document describes the client-side routing, guards, and navigation exactly as implemented.

## Route constants (`src/app/router/routeConstants.ts`)

```ts
export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  registerAdmin: '/register/admin',
  registerEmployee: '/register/employee',
  dashboard: '/dashboard',
  companies: '/companies',
  customers: '/customers',
  customersDetail: '/customers/:id',
  employees: '/employees',
  invitations: '/invitations',
  contacts: '/contacts',
  leads: '/leads',
  deals: '/deals',
  dealsDetail: '/deals/:id',
  meetings: '/meetings',
  meetingsDetail: '/meetings/:id',
  tasks: '/tasks',
  tasksDetail: '/tasks/:id',
  pipelines: '/pipelines',
  notifications: '/notifications',
  settings: '/settings',
  notFound: '*',
} as const
```

Note: there is **no** `/leads/:id` route constant — leads are a list-only feature (see [FEATURES.md](./FEATURES.md)).

## Route table (`src/app/router/routeConfig.tsx`)

The table is a `RouteObject[]` tree. Paths, layouts, and guards:

| Path | Guard | Layout | Page (lazy) |
| --- | --- | --- | --- |
| `/` | — (plain) | — | `<Navigate to="/login" replace />` |
| `/login` | `PublicRoute` | `AuthLayout` | `LoginPage` |
| `/register` | `PublicRoute` | `AuthLayout` | `RegisterPage` |
| `/register/admin` | `PublicRoute` | `AuthLayout` | `AdminRegisterPage` |
| `/register/employee` | `PublicRoute` | `AuthLayout` | `EmployeeRegisterPage` |
| `/dashboard` | `ProtectedRoute` | `DashboardLayout` | `DashboardPage` |
| `/companies` | `ProtectedRoute` | `DashboardLayout` | `CompaniesPage` |
| `/customers` | `ProtectedRoute` | `DashboardLayout` | `CustomersPage` |
| `/customers/:id` | `ProtectedRoute` | `DashboardLayout` | `CustomerDetailPage` |
| `/employees` | `ProtectedRoute` | `DashboardLayout` | `EmployeesPage` |
| `/invitations` | `ProtectedRoute` | `DashboardLayout` | `InvitationsPage` |
| `/contacts` | `ProtectedRoute` | `DashboardLayout` | `ContactsPage` |
| `/leads` | `ProtectedRoute` | `DashboardLayout` | `LeadsPage` |
| `/deals` | `ProtectedRoute` | `DashboardLayout` | `DealsPage` |
| `/deals/:id` | `ProtectedRoute` | `DashboardLayout` | `DealDetailPage` |
| `/meetings` | `ProtectedRoute` | `DashboardLayout` | `MeetingsPage` |
| `/meetings/:id` | `ProtectedRoute` | `DashboardLayout` | `MeetingDetailPage` |
| `/tasks` | `ProtectedRoute` | `DashboardLayout` | `TasksPage` |
| `/tasks/:id` | `ProtectedRoute` | `DashboardLayout` | `TaskDetailPage` |
| `/pipelines` | `ProtectedRoute` | `DashboardLayout` | `PipelinesPage` |
| `/notifications` | `ProtectedRoute` | `DashboardLayout` | `NotificationsPage` |
| `/settings` | `ProtectedRoute` | `DashboardLayout` | `CompanySettingsPage` |
| `*` | `PublicLayout` | — | `NotFoundPage` |

Notes from `routeConfig.tsx`:

- The root `/` immediately redirects to `/login`.
- Public auth routes (login + the three registration pages) are nested under `PublicRoute` → `AuthLayout`.
- All authenticated pages are nested under `ProtectedRoute` → `DashboardLayout`.
- The catch-all `*` renders `NotFoundPage` under `PublicLayout`.
- Every route-page is lazy-loaded and wrapped in `<Suspense fallback={<LoadingFallback/>}>`.

## Guards (`src/app/router/guards/`)

- **`ProtectedRoute`** — reads `isAuthenticated` from the auth store. If not authenticated, it redirects to `ROUTES.login` with router `state` carrying the attempted location (`{ from: pathname + search }`, typed as `AuthRedirectState`). Otherwise renders `<Outlet/>`. After login, `LoginPage` navigates back to `from` (or `/dashboard`) using that state.
- **`PublicRoute`** — if already authenticated, redirects to `ROUTES.dashboard`; otherwise renders `<Outlet/>`. This keeps signed-in users out of the login/registration pages.

## Layouts

- `AuthLayout` — one-column centered card on a `min-h-dvh` flex container; renders `<Outlet/>`.
- `PublicLayout` — pass-through `<Outlet/>`.
- `DashboardLayout` — authenticated shell (sidebar + top bar + outlet). Described in [ARCHITECTURE.md](./ARCHITECTURE.md).

## Static navigation (`src/constants/navigation.ts`)

`NAVIGATION` is an ordered list of `NavItem` with `id`, `label`, `path`, `icon`, `section`, optional `allowedRoles`, `badge`, `disabled`, and optional `children`. Sections: `main`, `management`, `sales`, `activity`, `account`.

Role-gated items:

| Item | Section | `allowedRoles` |
| --- | --- | --- |
| Dashboard | main | — |
| Companies | management | — |
| Customers | management | — |
| Employees | management | `['admin']` |
| Invitations | management | `['admin']` |
| Contacts | management | — |
| Leads | sales | — |
| Pipelines | sales | — |
| Deals | sales | — |
| Tasks | activity | — |
| Meetings | activity | — |
| Notifications | account | — |
| Settings | account | — |

`getNavSections(userRole)` groups items by section and hides items whose `allowedRoles` do not include the given role. This is a presentational/UX filter; the source comments explicitly state the backend remains the authorization boundary.

## Navigation patterns in code

- List pages navigate to their detail pages by interpolating the id into a route constant, e.g. `navigate(ROUTES.customersDetail.replace(':id', customer._id))`.
- Detail pages use `navigate(ROUTES.<entity>)` for their "Back to …" buttons (e.g. `DealDetailPage`, `TaskDetailPage`, `MeetingDetailPage`, `CustomerDetailPage`).
- `TopBar` bell navigates to `ROUTES.notifications`; `UserMenu` logout calls `clearSession()` then `navigate(ROUTES.login)`.
- Notifications with an `actionUrl` render a "View" link only when the URL starts with `/` (see [FEATURES.md](./FEATURES.md)).
- **Breadcrumbs** (`src/components/layout/Breadcrumbs.tsx`) find the matching `NAVIGATION` item by exact path or path-prefix and show its label; they return `null` if no match.
