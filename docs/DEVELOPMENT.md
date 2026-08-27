# Development: Environment, Setup, Quality & Conventions

## Environment variables

The frontend reads its configuration from Vite `import.meta.env` (variables prefixed `VITE_`). Only the following variable is read by the source:

| Variable | Purpose | Notes |
| --- | --- | --- |
| `VITE_API_URL` | Base URL for all API requests (`apiClient.baseURL`) and the origin used for the realtime socket | Required — `src/api/config.ts` throws at import if it is undefined |

The repository `.env` ships a local default (`VITE_API_URL` pointing at a local backend, e.g. `http://localhost:5000/api`). **Do not commit real secret values**; use placeholders/local URLs for local development.

There are no other secrets in the frontend: JWTs are stored client-side by the app (see [AUTHENTICATION.md](./AUTHENTICATION.md)) and never hard-coded in source.

## Dev setup

Prerequisites: Node.js (the project uses ESM, `"type": "module"`), npm.

1. Install dependencies:
   ```
   npm install
   ```
2. Ensure `VITE_API_URL` is set (create/copy `.env` — it must point at the CRM backend).
3. Run the dev server:
   ```
   npm run dev
   ```
   Vite serves the app (default port 5173).

## Build & quality checks

| Command | What it does |
| --- | --- |
| `npm run build` | `tsc -b && vite build` — TypeScript type-check then a production Vite build (output to `dist/`) |
| `npm run lint` | `oxlint` — lint with oxlint (config in `.oxlintrc.json`) |
| `npm run preview` | `vite preview` — serve the production build |
| `npx tsc -b` | Type-check only |

There is **no test runner** configured in the current `package.json`. Verification is done via type-check (`tsc -b`), lint (`oxlint`), and the production build.

## Conventions observed in the code

### Folder & file layout
- Feature-folder architecture: `src/features/<name>/{api,components,constants,hooks,pages,schemas,types,utils}` (+ `services/` placeholders). Each feature usually has a barrel `index.ts` and `components/index.ts`.
- Path aliases in `vite.config.ts`: `@` → `./src`, plus `@/app`, `@/assets`, `@/components`, `@/constants`, `@/features`, `@/hooks`, `@/layouts`, `@/lib`, `@/routes`, `@/services`, `@/store`, `@/styles`, `@/types`, `@/utils`. Imports use these aliases, never long relative paths.

### API layer
- All HTTP goes through the single `apiClient`; endpoint paths are centralized in `src/api/endpoints.ts`.
- Per-feature `api/<feature>Api.ts` defines typed functions returning `response.data` (`ApiResponse<T>['data']`).

### Hooks / server state
- Query key factories live in `hooks/<feature>Keys.ts` following the `['<entity>']` / `['<entity>','list',params]` / `['<entity>','detail',id]` convention.
- One `useQuery` per read, one `useMutation` per write; mutations `setQueryData` on detail keys and `invalidateQueries` on the static root.

### Forms
- `react-hook-form` + `zodResolver` + `zod`; `mode: 'onTouched'`; server field errors mapped back via `setError`.
- Scheme → form-values → payload conversion happens in `utils/<feature>Utils.ts` (`to<...>Payload`).

### Types & enums
- Domain enums declared as `as const` arrays with a derived union type (e.g. `export const CUSTOMER_STATUSES = [...] as const; type CustomerStatus = (typeof CUSTOMER_STATUSES)[number]`).
- Display labels kept in `constants/<feature>Labels.ts` (e.g. `CUSTOMER_STATUS_LABELS`).

### UI/accessibility
- Components compose `cva` variants + `cn()`; icons from `lucide-react`; toasts via `sonner`.
- Forms use explicit `Label htmlFor=id`, `aria-invalid`, `aria-describedby`; icon-only buttons carry `aria-label`.

### Authorization
- UI-level role/permission checks (navigation `allowedRoles`, `canRemove`, `canEditTask`, etc.) are **presentational**; the backend is the authorization boundary (stated explicitly in source comments).

## Verification checklist (documentation task)

Before considering documentation complete, the following were confirmed against the untouched source:

- `npx tsc -b` — type-check (see the completion report).
- `npm run lint` — oxlint (see the completion report).
- `npm run build` — production build (see the completion report).
- `git status --short` — only documentation files added; no source modified.

## Known pre-existing build/lint notes

During inspection, the codebase had pre-existing warnings in UI/feature files (e.g. `components/ui/button.tsx` and `MeetingsPage.tsx`) that are unrelated to this documentation effort. These are left as-is; no source was modified.
