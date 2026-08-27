# CRM Frontend — Developer Documentation

This documentation describes the **crm-frontend** application as it currently exists in the source code. It is written strictly from the actual implementation — every claim reflects what the code does today, and where the implementation does not clearly support a statement, that is called out explicitly.

The frontend is a **multi-tenant CRM (customer relationship management) web application** that manages companies, employees, customers, contacts, leads, deals, pipelines, tasks, meetings, and notifications. It communicates with the CRM backend over a REST API (with JWT authentication) and a Socket.IO realtime channel.

- Frontend stack: React 19, TypeScript, Vite 8, Tailwind CSS 4, React Router 7, TanStack Query 5, Zustand 5, Zod 4 + React Hook Form 7, Axios, `socket.io-client`, shadcn/ui-style primitives (Radix UI), `sonner` toasts.
- Repository location: `D:\CRM\CRM-frontend`
- Companion backend documentation: `D:\CRM\CRM-backend\docs\README.md`

---

## Table of contents

| Topic | Document |
| --- | --- |
| System overview, tech stack, project structure | This file |
| High-level architecture, app providers, layering, data flow | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Routing, guards, layouts, navigation | [ROUTING.md](./ROUTING.md) |
| Authentication and auth state | [AUTHENTICATION.md](./AUTHENTICATION.md) |
| API client, endpoints, error handling | [API_CLIENT.md](./API_CLIENT.md) |
| Server state, React Query keys, caching, invalidation, realtime | [STATE_AND_DATA.md](./STATE_AND_DATA.md) |
| Forms, validation, UI primitives, styling | [FORMS_AND_UI.md](./FORMS_AND_UI.md) |
| Feature-by-feature walkthrough incl. AdminOverview, notifications | [FEATURES.md](./FEATURES.md) |
| Environment variables, dev setup, quality checks, conventions | [DEVELOPMENT.md](./DEVELOPMENT.md) |
| Contract with the backend | [BACKEND_CONTRACT.md](./BACKEND_CONTRACT.md) |

---

## What this app does

The CRM lets a **company admin** create a workspace, invite employee emails, and manage sales operations:

- **Onboarding.** Anyone can sign in, or register either as a *Company Admin* (creates a new company) or as an *Employee* (joins an existing company after their email has been invited by an admin).
- **Company & people.** Admins view/edit company profile, manage employees (remove access), and invite employee emails.
- **Sales data.** Customers, contacts, leads, deals, and pipelines for tracking sales opportunities.
- **Activity.** Tasks and meetings, with per-user assignment/ownership and completion/cancellation actions.
- **Realtime.** New notifications arrive live over a Socket.IO channel and update the notification list and the unread-count badge without a manual refresh.

---

## Tech stack (from `package.json`)

Runtime dependencies (`package.json` → `dependencies`):

| Area | Package |
| --- | --- |
| UI | `react` 19.2, `react-dom` 19.2 |
| Routing | `react-router-dom` 7.11 |
| Server state | `@tanstack/react-query` 5.101 |
| Client state | `zustand` 5.0 (with `persist` middleware) |
| HTTP | `axios` 1.19 |
| Realtime | `socket.io-client` 4.8 |
| Validation | `zod` 4.4, `@hookform/resolvers` 5.7, `react-hook-form` 7.84 |
| Styling | `tailwindcss` 4.3, `@tailwindcss/vite` 4.3, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css` |
| UI primitives | `radix-ui` 1.6 (unified package), `lucide-react` 1.28 (icons), `sonner` 2.0 (toasts), `motion` 13 |
| Drag & drop | `@dnd-kit/core`, `@dnd-kit/modifiers`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |
| Dev / build | `vite` 8.2, `@vitejs/plugin-react` 6.0, `typescript` ~6.0, `oxlint` 1.75, `@fontsource-variable/geist`, `shadcn` CLI 4.16 |

Note: **linting uses `oxlint`, not ESLint.** The lint script is `oxlint` and the config lives in `.oxlintrc.json`.

### Scripts

| Script | Command |
| --- | --- |
| `dev` | `vite` — local dev server |
| `build` | `tsc -b && vite build` — type-check then production build |
| `lint` | `oxlint` — lint with oxlint |
| `preview` | `vite preview` — preview the production build |

---

## Project structure

Top-level folders inside `src/`:

```
src/
├── api/                  # Axios client + config + endpoint constants + interceptors
├── app/                  # Providers, layouts, router, guards, query client, NotFound page
├── components/
│   ├── layout/           # DashboardLayout, Sidebar, TopBar, UserMenu, Breadcrumbs, etc.
│   ├── shared/           # LoadingFallback (route-level lazy fallback)
│   └── ui/               # shadcn-style UI primitives (button, card, dialog, input, ...)
├── constants/            # navigation menu definition + section grouping
├── features/             # One folder per business capability (see below)
├── hooks/                # Shared hooks (useDebouncedValue)
├── lib/
│   ├── realtime/         # Socket.IO client + realtime-notifications wiring
│   └── utils.ts          # cn() helper (clsx + tailwind-merge)
├── types/                # Shared API response / pagination types
├── assets/  routes/  services/  store/  styles/  utils/   # mostly .gitkeep placeholders
└── ...
```

### `src/api` — HTTP layer

- `config.ts` — `API_BASE_URL` (read from `import.meta.env.VITE_API_URL`, throws if undefined), `REQUEST_TIMEOUT_MS` (10000), `AUTH_TOKEN_STORAGE_KEY` (`'flowcrm.accessToken'`).
- `client.ts` — the shared Axios instance (`apiClient`).
- `endpoints.ts` — centralized path constants for every REST endpoint.
- `interceptors.ts` — request auth-header injection + response/error normalization (`ApiError`).
- `index.ts` — barrel re-exporting the above.

### `src/app` — application shell

- `App.tsx` / `main.tsx` — entry points; `main.tsx` mounts `<App/>` inside `StrictMode`.
- `providers/` — `AppProviders` (orders `ThemeProvider` → `QueryProvider` → `RealtimeNotificationsBridge` → children → `<Toaster/>`), `QueryProvider`, `ThemeProvider` (currently a pass-through).
- `router/` — `AppRouter` (`createBrowserRouter`), `routeConfig.tsx` (route tree), `lazyPages.tsx` (React `lazy` imports), `routeConstants.ts` (`ROUTES`), `guards/` (`PublicRoute`, `ProtectedRoute`).
- `layouts/` — `AuthLayout`, `PublicLayout`.
- `pages/` — `NotFoundPage`.
- `queryClient.ts` — module-level `QueryClient` singleton.

### `src/features/*`

Each feature follows a consistent internal layout (`api/`, `components/`, `constants/`, `hooks/`, `pages/`, `schemas/`, `types/`, `utils/`, plus `services/` placeholders where present). Features:

| Feature folder | Route(s) | Purpose |
| --- | --- | --- |
| `auth` | `/login`, `/register`, `/register/admin`, `/register/employee` | Sign in, company-admin registration, employee registration, auth store |
| `dashboard` | `/dashboard` | Overview metrics, sales/task/meeting stats, recent activity, AdminOverview, upcoming tasks |
| `companies` | `/companies`, `/settings` | Company overview + company settings form |
| `employees` | `/employees` | Employee list, remove access |
| `invitations` | `/invitations` | Invite employee emails, remove invitations |
| `customers` (+ `customers/contacts`) | `/customers`, `/customers/:id` | Customer CRUD + per-customer contacts |
| `contacts` | `/contacts` | Global contacts page (across all customers) |
| `leads` | `/leads` | Lead CRUD (list only — no detail page, by design) |
| `deals` | `/deals`, `/deals/:id` | Deal list/board (Kanban, @dnd-kit), deal detail |
| `tasks` | `/tasks`, `/tasks/:id` | Task CRUD, complete/cancel, task detail |
| `meetings` | `/meetings`, `/meetings/:id` | Meeting CRUD, complete/cancel, meeting detail |
| `pipelines` | `/pipelines` | Pipelines + pipeline stages (won/lost/probability) |
| `notifications` | `/notifications` | Notification list, read/unread, mark all read |

### `src/components/ui/*` — UI primitives

`avatar`, `badge`, `button`, `card`, `dialog`, `dropdown-menu`, `input`, `label`, `pagination`, `select-field`, `separator`, `sheet`, `tooltip`. These are shadcn/ui-style components built on `radix-ui` and styled with Tailwind classes (`cva` variants + `cn()` merge).

---

## Design principles observed in the code

- **Feature-folder architecture** — every capability is self-contained under `src/features/<name>/` with its own api, hooks, schema, types, components, and pages.
- **Server state vs. client state separation** — backend data is cached by TanStack Query (with per-feature query-key factories); only authentication (and small ephemeral UI flags) live in the Zustand store.
- **Single source of truth for tokens** — the Axios request interceptor reads `localStorage['flowcrm.accessToken']`; the Zustand auth store mirrors its token into that same key.
- **Every list mutation refreshes shared cache** — mutations call `invalidateQueries` (or `setQueryData`) against well-defined query-key prefixes so lists/dashboards stay consistent.
- **Backend is the authorization boundary** — UI-level role checks are purely presentational (see `constants/navigation.ts` and feature-specific `canEdit`/`canRemove` helpers); noted explicitly in several source comments.

---

## Read next

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the component/data-flow architecture, then [ROUTING.md](./ROUTING.md) and the other documents listed in the table of contents.
