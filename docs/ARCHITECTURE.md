# Architecture

This document describes the high-level architecture of the **CRM frontend** exactly as implemented in the source code.

## Application bootstrap

1. `src/main.tsx` mounts `<App/>` inside `<StrictMode>`.
2. `src/App.tsx` renders:
   ```tsx
   <AppProviders>
     <AppRouter />
   </AppProviders>
   ```
3. `AppRouter` (`src/app/router/AppRouter.tsx`) creates a browser router via `createBrowserRouter(routeConfig)` and renders `<RouterProvider router={router} />`.
4. `AppProviders` (`src/app/providers/AppProviders.tsx`) composes, in order:
   - `ThemeProvider` — currently a pass-through that renders `{children}` unchanged.
   - `QueryProvider` — provides the shared TanStack Query client.
   - `RealtimeNotificationsBridge` — a `null`-rendering component that activates the realtime socket + notification cache wiring (see [STATE_AND_DATA.md](./STATE_AND_DATA.md)).
   - `children` (the router).
   - `<Toaster/>` from `sonner` — global toast host.

## Layering / folder responsibilities

The codebase is organized into a clear layering:

- **`src/api`** — the only place that knows how to talk HTTP. It exposes `apiClient`, endpoint path constants, and normalized error types. Feature code depends on this layer but no feature code creates its own Axios instances.
- **`src/features/<name>/api`** — thin per-feature functions that call `apiClient` against the endpoint constants and return typed data. No UI logic here.
- **`src/features/<name>/hooks`** — React Query hooks (`useQuery`/`useMutation`) that wrap the feature API functions, define query keys, and handle optimistic/success caching plus invalidation.
- **`src/features/<name>/schemas` + `src/features/<name>/types`** — Zod form schemas and TypeScript types.
- **`src/features/<name>/components` + `src/features/<name>/pages`** — presentational + page/container components.
- **`src/app`** — providers, layouts, router, guards.
- **`src/components/{layout,ui,shared}`** — cross-cutting UI.

Data flows one way: **Page → Hook (React Query) → Feature API → `apiClient` → backend**, and responses flow back up through the same chain.

## Request flow and error normalization

- Every request goes through the shared `apiClient` (see [API_CLIENT.md](./API_CLIENT.md)).
- A request interceptor attaches `Authorization: Bearer <token>` when a token exists in `localStorage['flowcrm.accessToken']`.
- The response interceptor rejects with a normalized `ApiError` (status, field errors, `isUnauthorized`) instead of a raw Axios error, so feature hooks and forms can rely on a stable error shape.

## State management split

- **Server (remote) data** is owned by TanStack Query. A single module-level `QueryClient` singleton is created in `src/app/queryClient.ts` and provided once at the root. Keeping it a module singleton (rather than creating it per provider) lets non-component code — e.g. the auth session cleanup in `src/features/auth/utils/authUtils.ts` — clear the entire server-state cache on logout or a global 401.
- **Auth state** (user + JWT) lives in the Zustand store `src/features/auth/store/authStore.ts`. Details in [AUTHENTICATION.md](./AUTHENTICATION.md).

## Routing architecture

The route table is a `RouteObject[]` tree in `src/app/router/routeConfig.tsx`. It composes public routes behind `PublicRoute` + `AuthLayout`, protected routes behind `ProtectedRoute` + `DashboardLayout`, and a catch-all 404 behind `PublicLayout`. See [ROUTING.md](./ROUTING.md) for the full table.

Route-level pages are lazy-loaded with `React.lazy` (`lazyPages.tsx`) and wrapped in `<Suspense fallback={<LoadingFallback/>}>`.

## Layout architecture

- **`DashboardLayout`** (`src/components/layout/DashboardLayout.tsx`) is the authenticated shell: a `TooltipProvider`, a desktop `Sidebar` (collapsible), a `MobileSidebar` (a `Sheet` for small screens), and a `TopBar` plus a scrollable `<main>` that renders the `<Outlet/>`. Route changes close the mobile sidebar.
- **`Sidebar`** renders navigation sections built from `getNavSections(user?.role)` (see `src/constants/navigation.ts`); items gated by `allowedRoles` are hidden based on the current user's role (visibility only — the backend remains the authorization boundary).
- **`TopBar`** shows a mobile menu button, `Breadcrumbs`, a decorative search box (non-functional), a notifications bell with the unread count badge (navigates to `/notifications`), and the `UserMenu`.
- **`MobileSidebar`** reuses the same section representation inside a `Sheet`.
- **`AuthLayout`** centers the auth card on a full-height page; **`PublicLayout`** is a pass-through.

## Key module-level singletons

- `queryClient` — TanStack Query client (`src/app/queryClient.ts`).
- `useAuthStore` — Zustand auth store (`src/features/auth/store/authStore.ts`).
- `apiClient` — Axios instance (`src/api/client.ts`).
- Real-time socket — a lazily-created socket.io-client connection held by `src/lib/realtime/socketClient.ts`.

## Cross-cutting concerns

- **Debounced search** — list pages use the shared `useDebouncedValue(value, 300)` hook (`src/hooks/useDebouncedValue.ts`) before sending search terms to the backend.
- **Realtime notifications** — a single hook activated at the root (`useRealtimeNotifications`) keeps notification detail/list/unread-count caches live when the backend emits `notification:new`. Details in [STATE_AND_DATA.md](./STATE_AND_DATA.md) and [FEATURES.md](./FEATURES.md).

## Not implemented / noted in code

- `ThemeProvider` currently does nothing beyond `{children}` — dark-mode/theme switching is **not implemented** in the current source.
- Several top-level `src` folders (`assets`, `routes`, `services`, `store`, `styles`, `utils`) contain only `.gitkeep` placeholders — they are scaffolding, not active code.
- The `components/ui` set covers the primitives actually used; there is no `Tabs`, `Table`, `Toast`, `Textarea`, etc. unless used (the docs reflect only what ships).
