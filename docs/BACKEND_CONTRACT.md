# Frontend ↔ Backend Contract

This document summarizes how the **CRM frontend** connects to the **CRM backend**. Companion details live in `D:\CRM\CRM-backend\docs\README.md`.

## Transport

- **REST API** over HTTPS/HTTP at `VITE_API_URL` (Axios).
- **Realtime** notifications over **Socket.IO** at the same host (`new URL(API_BASE_URL).origin`).

## Authentication

- JWT is issued by the backend at login and sent as `Authorization: Bearer <token>` on every request.
- Backend JWT carries `{ userId, companyId, role }` (7-day expiry) and enforces **tenant isolation** via the authenticated company. Roles: `admin`, `manager`, `sales`.
- The frontend treats the **backend as the authorization boundary**; client-side role checks are presentational.
- Global 401 handling (frontend): a 401 on an authenticated session clears the session + query cache and hard-redirects to `/login` (see [API_CLIENT.md](./API_CLIENT.md)).

## Response envelope

Both sides agree on a uniform envelope:

```ts
interface ApiResponse<T> { success: boolean; message: string; data: T }
interface Pagination { total: number; totalPages: number; page: number; limit: number }
```

List endpoints return `data` shaped as `{ <items>: T[], pagination: Pagination }`. Feature hooks unwrap `response.data`.

## Endpoints consumed (frontend → backend)

The full constant set is in `src/api/endpoints.ts`; the method conventions are GET (read), POST (create), PUT (update), PATCH (state transition), DELETE (delete). Notable backend behaviors relied upon:

- **Auth:** `POST /auth/login`, `POST /auth/register/admin`, `POST /auth/register/employee`. Registration never returns a token (users sign in afterwards).
- **Company:** `GET /companies/me`, `PATCH /companies/me`.
- **Employees:** `GET /company-employees`, `PATCH /company-employees/:id/remove` (removal is a PATCH transition).
- **Invitations:** `GET/POST /company-invitations`, `DELETE /company-invitations/:id`. Sends only `{ email }`; the backend derives `company`/`invitedBy` from the authenticated admin.
- **Customers:** `GET/POST /customers`, `GET/PUT/DELETE /customers/:id`.
- **Customer contacts:** `GET/POST /customer-contacts`, `GET /customer-contacts/customer/:customerId`, `GET/PUT/DELETE /customer-contacts/:id`.
- **Leads:** `GET/POST /leads`, `GET/PUT/DELETE /leads/:id`, `PATCH /leads/:id/convert` (API function present, not currently wired to a hook).
- **Deals:** `GET/POST /deals`, `GET/PUT/DELETE /deals/:id`, `PATCH /deals/:id/stage`, `/deals/:id/won`, `/deals/:id/lost` (won/lost API functions present but without hooks).
- **Tasks:** `GET/POST /tasks`, `GET/PUT/DELETE /tasks/:id`, `PATCH /tasks/:id/complete`, `PATCH /tasks/:id/cancel`.
- **Meetings:** `GET/POST /meetings`, `GET/PUT/DELETE /meetings/:id`, `PATCH /meetings/:id/complete`, `PATCH /meetings/:id/cancel`.
- **Pipelines:** `GET/POST /pipelines`, `GET/PUT/DELETE /pipelines/:id`; **Stages:** `GET/POST /pipeline-stages`, `GET /pipeline-stages/pipeline/:pipelineId`, `GET/PUT/DELETE /pipeline-stages/:id`.
- **Dashboard:** `GET /dashboard/overview`, `/dashboard/sales`, `/dashboard/tasks`, `/dashboard/meetings`, `/dashboard/pipeline`, `/dashboard/recent-activities`.
- **Notifications:** `GET /notifications`, `GET /notifications/:id`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`, `GET /notifications/unread-count`, `DELETE /notifications/:id`.

## Realtime contract

- The frontend connects to the Socket.IO server at the API origin with `auth: { token }` and listens for the event **`notification:new`**.
- Backend emits `notification:new` (to the target user's room) with a notification payload. The frontend validates `payload._id` is a string, then updates the corresponding detail/list/unread-count caches (see [STATE_AND_DATA.md](./STATE_AND_DATA.md) and [FEATURES.md](./FEATURES.md)).

## Field/entity contract highlights

- **Notification** carries `type`, `entityType`, `entityId`, and `actionUrl`. The frontend renders an `actionUrl` link **only when it starts with `/`** (relative path), which is how the backend deep-links a notification into a page.
- Domain enums mirrored on both sides (statuses/sources/types). The frontend declares them as `as const` arrays and sends/reads the same string values that the backend validates.
- The frontend relies on the backend for authoritative checks: email uniqueness, company existence, employee invitation allowlist membership, event/tenant isolation, soft-delete semantics.

## Known backend-oriented caveats surfaced by the frontend code

- `useGetEmployees({ status, limit: 1 })` + `pagination.total` is used by AdminOverview as a cheap count pattern — it depends on the backend returning an accurate `pagination.total` alongside a `limit:1` result set.
- The `convertLead`/`markDealWon`/`markDealLost` API functions and `useLead`/`getCustomerContact`/`getNotification` hooks exist in the frontend but are not currently mounted anywhere; they are available contracts awaiting callers.
- Registration/lead/deal/task/meeting endpoints rely on the backend to derive tenant/owner fields from the authenticated user; clients send only user-entered shape data.
