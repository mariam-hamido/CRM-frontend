# Authentication & Auth State

This document describes authentication and the auth state exactly as implemented.

## Overview

- **Login** returns a `{ user, token }` payload; the JWT is stored and sent on subsequent requests as a `Bearer` token.
- **Registration** (both company-admin and employee) **does not** return a token — users sign in afterwards. This is documented in the types: `AdminRegisterResponse`/`EmployeeRegisterResponse` are `ApiResponse<AuthUser>` with no token.
- Auth state lives in a **Zustand store** (`src/features/auth/store/authStore.ts`) persisted to `localStorage`.

## Auth store (`authStore.ts`)

State shape:

```ts
interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser(user)
  setToken(token)
  login(user, token)
  logout()
  setLoading(isLoading)
}
```

Key behaviors (documented in the file header comment):

1. `login(user, token)` updates the store and persists under the key **`flowcrm.auth`**. The token is also mirrored to **`AUTH_TOKEN_STORAGE_KEY`** (`'flowcrm.accessToken'`) — the single key the Axios request interceptor reads.
2. On a page refresh, the `persist` middleware rehydrates `{ user, token }` synchronously from `flowcrm.auth`; `merge` recomputes `isAuthenticated`; `onRehydrateStorage` re-mirrors the token so the interceptor is consistent immediately.
3. `logout()` / `clearAuth()` reset the store and remove both keys.

The store **never talks to Axios**, and Axios **never reads the store**. The only shared contract between them is `AUTH_TOKEN_STORAGE_KEY` (`'flowcrm.accessToken'`). A `useAuthStore.subscribe` listener keeps that key in sync on every token change (`login`, `logout`, `setToken`).

Popular selectors: `selectUser`, `selectToken`, `selectIsAuthenticated`, `selectIsLoading`.

## Session utilities (`src/features/auth/utils/authUtils.ts`)

- `getToken()` — reads the current JWT from the store (or null when signed out).
- `isAuthenticated()` — returns whether a user and token are present.
- `clearAuth()` — resets Zustand state and clears persisted `flowcrm.auth` (and, via the token subscription, `flowcrm.accessToken`).
- `clearSession()` — the authoritative full cleanup: calls `clearAuth()` **and** `queryClient.clear()` (clearing the entire server-state cache). Used by both manual logout and the global 401 handler.

## Login flow (`src/features/auth/pages/LoginPage.tsx` + `hooks/useLogin.ts`)

1. `LoginPage` uses react-hook-form + `loginSchema` (email + non-empty password), `mode: 'onTouched'`.
2. `useLogin` is a `useMutation` whose `onSuccess` calls `storeLogin(response.data.user, response.data.token)`.
3. After a successful login the page navigates to the redirect target captured by `ProtectedRoute` (`location.state.from`) or `/dashboard`.
4. Server `fieldErrors` from `ApiError` are mapped into form field errors via `setError(..., { type: 'server' })`.

## Registration flows

- `RegisterPage` is a chooser between **Company Admin** (`/register/admin`) and **Employee** (`/register/employee`).
- **`AdminRegisterPage`** (`useAdminRegister`): signs up with `companyName, firstName, lastName, email, password`. On success it shows a toast ("Company created successfully. Please sign in to continue.") and navigates to `/login`. The `RegisterPage` description notes the backend creates a NEW company plus the admin; clients never send role/company ids.
- **`EmployeeRegisterPage`** (`useEmployeeRegister`): same fields, but joining an existing company requires a pending invitation for the email. The code deliberately maps the generic backend rejection message `'Invalid company name or unapproved email'` to a friendlier display message so it never discloses which companies exist.
- Both registration pages share `RegistrationFields` and the same form schema (`registrationDetails` in `auth.schema.ts`). Registration is **not** auto-login.

## Sign-up field rules (`src/features/auth/schemas/auth.schema.ts`)

- `companyName`: trim, 2–100 chars.
- `firstName` / `lastName`: trim, 2–50 chars.
- `email`: trim, lowercased, must be a valid email.
- `password`: min 8 chars, must contain one uppercase, one lowercase, one digit, and one special character.

The schema notes that the backend performs authoritative checks (company existence / invitation for employees, global email uniqueness); the frontend only validates shape.

## Auth user type (`src/features/auth/types/auth.types.ts`)

```ts
type UserRole = 'admin' | 'manager' | 'sales'

interface AuthUser {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  company: string
  role: UserRole
  isActive: boolean
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}
```

## Role usage in the UI (presentational only)

- `TopBar`/`Sidebar`/`UserMenu` use `user?.role` to render navigation and show/hide profile placeholder items.
- Several features define permission predicates such as `isAdminOrManager` and `canEditTask`/`canCompleteTask`/`canRemove` (see [FEATURES.md](./FEATURES.md)). The source comments repeatedly stress these are **UX-only** checks and the backend remains the authorization boundary.
