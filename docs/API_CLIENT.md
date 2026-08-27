# API Client, Endpoints & Error Handling

This document describes the HTTP layer exactly as implemented in `src/api/`.

## Configuration (`src/api/config.ts`)

- `API_BASE_URL = import.meta.env.VITE_API_URL` — the base URL for all requests. The module **throws** at import time if it is undefined, forcing `VITE_API_URL` to be set in the environment (see [DEVELOPMENT.md](./DEVELOPMENT.md)).
- `REQUEST_TIMEOUT_MS = 10_000` — 10-second request timeout.
- `AUTH_TOKEN_STORAGE_KEY = 'flowcrm.accessToken'` — the localStorage key the request interceptor reads.

## Client (`src/api/client.ts`)

A single shared Axios instance:

```ts
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use(attachAuthToken)
apiClient.interceptors.response.use(handleResponse, handleResponseError)
```

All feature API modules import `apiClient` from `@/api/client` (or the `@/api` barrel) and use these endpoint constants.

## Endpoints (`src/api/endpoints.ts`)

Centralized path constants:

| Group | Paths |
| --- | --- |
| `AUTH` | `/auth/login`, `/auth/register`, `/auth/register/admin`, `/auth/register/employee` |
| `COMPANIES` | `/companies`, `/companies/me` |
| `EMPLOYEES` | `/company-employees`, `/company-employees/:id/remove` |
| `INVITATIONS` | `/company-invitations`, `/company-invitations/:id` |
| `CUSTOMERS` | `/customers` |
| `CUSTOMER_CONTACTS` | `/customer-contacts` |
| `LEADS` | `/leads` |
| `DEALS` | `/deals`, `/deals/:id`, `/deals/:id/stage`, `/deals/:id/won`, `/deals/:id/lost` |
| `TASKS` | `/tasks`, `/tasks/:id`, `/tasks/:id/complete`, `/tasks/:id/cancel` |
| `DASHBOARD` | `/dashboard/overview`, `/dashboard/pipeline`, `/dashboard/sales`, `/dashboard/tasks`, `/dashboard/meetings`, `/dashboard/recent-activities` |
| `MEETINGS` | `/meetings`, `/meetings/:id`, `/meetings/:id/complete`, `/meetings/:id/cancel` |
| `NOTIFICATIONS` | `/notifications`, `/notifications/:id`, `/notifications/:id/read`, `/notifications/read-all`, `/notifications/unread-count` |
| `PIPELINES` | `/pipelines`, `/pipelines/:id` |
| `PIPELINE_STAGES` | `/pipeline-stages`, `/pipeline-stages/pipeline/:pipelineId`, `/pipeline-stages/:id` |

Detail-endpoint helpers are functions, e.g. `DEALS.DETAIL(id)` → `/deals/${id}`.

## Interceptors (`src/api/interceptors.ts`)

**Request — `attachAuthToken(config)`:** reads `localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)`; if a token exists, sets `Authorization: Bearer <token>`. Otherwise leaves headers unchanged.

**Response — `handleResponse(response)`:** passes the Axios response through unchanged.

**Error — `handleResponseError(error)`:** normalizes any Axios error into a custom `ApiError`:

```ts
class ApiError extends Error {
  status?: number
  fieldErrors?: { field: string; message: string }[]
  isUnauthorized: boolean
}
```

Behavior:

- If there is an HTTP response, it derives the message from `data.message` (falling back to `GENERIC_API_ERROR_MESSAGE`).
- **Global 401 handling:** if `status === 401` and the request came from an authenticated session and the session-expiry flow hasn't already run, it calls `clearSession()`, hard-redirects via `window.location.href = '/login'`, and rejects with an `ApiError` flagged `isUnauthorized: true`. A module-level `sessionExpiredHandled` guard ensures only one such flow executes per page lifetime (a hard redirect resets it).
- If the request was made but no response (`error.request`), it rejects with `NETWORK_ERROR_MESSAGE` ("Network error. Please check your connection.").
- Otherwise it rejects with `GENERIC_API_ERROR_MESSAGE`.

Predefined error-message constants:
- `NETWORK_ERROR_MESSAGE = 'Network error. Please check your connection.'`
- `GENERIC_API_ERROR_MESSAGE = 'Something went wrong. Please try again.'`
- `UNAUTHORIZED_MESSAGE = 'Your session has expired. Please sign in again.'`

## Response envelope & pagination (`src/types/api.ts`)

```ts
interface ApiResponse<T> { success: boolean; message: string; data: T }
interface Pagination { total: number; totalPages: number; page: number; limit: number }
```

Feature API functions typically return `response.data` (i.e. the `data` field of `ApiResponse<T>`). List endpoints return a `{ <items>, pagination }` object typed per feature (e.g. `CustomerListData { customers, pagination }`).

## How features consume the API

Each feature has an `api/<feature>Api.ts` module exporting typed functions, and `hooks/` that wrap them with React Query. Example (`src/features/auth/api/authApi.ts`):

```ts
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(AUTH.LOGIN, data)
  return response.data
}
```

HTTP method conventions observed across features:
- **GET** — reads (lists, detail).
- **POST** — creation.
- **PUT** — full updates (e.g. `updateCustomer`, `updateLead`, `updateDeal`, `updateTask`, `updateMeeting`, `createCustomerContact`/`updateCustomerContact`).
- **PATCH** — status/state transitions (`/complete`, `/cancel`, `/read`, `/read-all`, `/stage`, `/convert`, and employee removal `/company-employees/:id/remove`).
- **DELETE** — deletion (`/customers/:id`, `/leads/:id`, `/deals/:id`, `/tasks/:id`, `/meetings/:id`, `/notifications/:id`, `/company-invitations/:id`, `/pipeline-stages/:id`, `/pipelines/:id`).

Note: a few API functions exist in the API layer but are not wired to any hook/page (e.g. `convertLead` in `leadApi.ts`, `getCustomerContact`/`getCustomerContact` detail, `markDealWon`/`markDealLost` in `dealApi.ts`). These are documented as available but currently unused in [FEATURES.md](./FEATURES.md).
