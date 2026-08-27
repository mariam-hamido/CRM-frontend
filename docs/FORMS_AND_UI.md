# Forms, Validation, UI Primitives & Styling

This document covers how forms, validation, and UI are implemented.

## Forms & validation stack

- **`react-hook-form`** provides form state and registration.
- **`zod`** defines the validation schemas.
- **`@hookform/resolvers` `zodResolver`** bridges them (`resolver: zodResolver(<schema>)`).
- Forms use `mode: 'onTouched'` for validation timing and typically `noValidate` on the `<form>` (browser validation off, custom rendering on).

### Common form pattern

Across the codebase (login, registration, company settings, customer, contact, lead, deal, task, meeting, pipeline, stage, invitation), forms follow the same shape:

1. `useForm<FormValues>({ resolver, mode: 'onTouched', defaultValues })`.
2. `handleSubmit` calls the relevant `useMutation` (`mutate`).
3. Server-side field errors (`mutation.error.fieldErrors`) are mapped back into the form via `setError(field, { type: 'server', message })` inside a `useEffect`.
4. Submit buttons are `SubmitButton` components that show a loading state and are often disabled until the form is `isDirty`.
5. On success, feature mutations show a `sonner` `toast`.

### Where schemas live

Each feature has a `src/features/<name>/schemas/<name>.schema.ts` exporting a Zod schema and types (`...FormValues = z.input<typeof schema>`). Form-land numeric fields are typically typed as strings (`z.input`) and converted to numbers by `to<...>Payload` utils before being sent.

### Notable schema behaviors

- **Auth** (`auth.schema.ts`): password complexity rules (8+ chars, upper, lower, digit, special); email trimmed + lowercased; both registration flows share the same `registrationDetails` fields.
- **Company** (`company.schema.ts`): optional trimmed strings (empty → `undefined`), refined optional URL/email, `name` 2–100 chars, `subscriptionPlan`/`status` as optional `z.enum`.
- **Customer** (`customer.schema.ts`): status/source enums (required), optional refined URL/email, optional non-negative numbers for revenue/employees.
- **Contact** (`customerContact.schema.ts`): firstName/lastName required 1–50, optional email/jobTitle/phone, `isPrimary` boolean.
- **Lead** (`lead.schema.ts`): firstName/lastName required, status/source enums, `score` 0–100, non-negative `estimatedValue`.
- **Deal** (`deal.schema.ts`): title required ≤200, customer/pipeline/stage required ObjectIds on create, optional value ≥0 and expectedCloseDate; create/update schemas exclude `status`/`lostReason`/`probability` (changed via dedicated endpoints).
- **Task** (`task.schema.ts`): title 2–200, description ≤2000, priority enum, dueDate required `datetime-local`; `status` only on update (create defaults server-side).
- **Meeting** (`meeting.schema.ts`): title required ≤200, customer required, meetingDate required, duration ≥1 minute, meetingType enum, optional deal/location/link/notes; status only on update.
- **Pipeline / PipelineStage**: `pipelineStage.stage.schema` uses a `.superRefine` to reject a stage that is both won and lost ("A stage cannot be both a won and lost stage"), attached to the `isWonStage` field.
- **Invitation** (`invitation.schema.ts`): a single required email field (`inviteEmployeeSchema`); duplicate/already-registered checks are delegated to the backend.

## UI primitives (`src/components/ui/*`)

shadcn/ui-style components built on `radix-ui` and styled with Tailwind, `cva` (class-variance-authority), and the `cn()` helper (`clsx` + `tailwind-merge` from `src/lib/utils.ts`):

| Component | Notes |
| --- | --- |
| `button.tsx` | `Button` + exported `buttonVariants`; variants `default/outline/secondary/ghost/destructive/link`; sizes `default/xs/sm/lg/icon/icon-xs/icon-sm/icon-lg`; supports `asChild` (renders via `radix-ui` `Slot`). |
| `badge.tsx` | Pill labels; used with feature-specific variant maps. |
| `card.tsx` | `Card`, `CardContent`, etc. — used for pages, info cards, empty/error/loading states. |
| `dialog.tsx` | Radix Dialog-based modal; used for create/edit/delete confirmations. |
| `dropdown-menu.tsx` | Radix DropdownMenu; used for row actions, user menu. |
| `input.tsx` | Text/number/date input. |
| `label.tsx` | Field label (Radix Label). |
| `pagination.tsx` | Previous/Next + "Showing X–Y of Z" summary; renders nothing when `totalPages <= 1`. Props: `pagination`, `onPageChange`, `itemLabel`. |
| `select-field.tsx` | Native-styled `<select>` wrapper with label/error/hint and a chevron; used for filters and enum fields. |
| `separator.tsx` | Horizontal/vertical divider. |
| `sheet.tsx` | Radix Sheet — used for the mobile sidebar. |
| `tooltip.tsx` | Radix Tooltip (provided at the `DashboardLayout` root with `delayDuration={0}`). |
| `avatar.tsx` | Avatar + `AvatarFallback` (initials). |

### Auth feature components (`src/features/auth/components/`)

Reusable pieces for the auth screens, also imported elsewhere:
- `AuthCard`, `AuthHeader`, `AuthFooter`, `AuthForm` (native form with `noValidate`), `SubmitButton` (loading-aware), `FormErrorMessage` (used by many UI/feature components), `PasswordField` (password input with show/hide), `RegistrationFields` (shared identity + company-name fields), and a barrel `index.ts`.

## Styling

- **Tailwind CSS 4**, loaded via the `@tailwindcss/vite` plugin (Vite config) and the global `src/index.css`. `tw-animate-css` provides animation utilities.
- Class merging via `cn()` in `src/lib/utils.ts`.
- Font: `@fontsource-variable/geist` (variable Geist font).
- Icons: `lucide-react`.
- Toasts: `sonner` (`<Toaster/>` mounted once in `AppProviders`).
- Motion: the `motion` package is a dependency; the shadcn components use Radix transitions. (No bespoke `motion` components were required by the inspected pages.)
- **Accessibility:** forms wire labels to inputs by id, use `aria-invalid`/`aria-describedby` for errors, icon buttons carry `aria-label`, decorative icons use `aria-hidden`, and list rows provide accessible action menus. The code consistently includes `sr-only` text for icon-only status.
- **Responsive:** tables/lists use `md:`/`lg:`/`xl:` Tailwind breakpoints to hide less-critical columns, and many tiers define a separate mobile stacked layout alongside the desktop grid. The `DashboardLayout` uses a Desktop `Sidebar` (`md+:flex`) plus a mobile `Sheet` sidebar with a hamburger menu.

## Empty / loading / error states

Every list-and-detail feature ships dedicated components, typically one each:
- **Loading:** a `Card` with a `Loader2` spinner and a label (e.g. "Loading companies…").
- **Error:** a `Card` with an alert icon, a message, and a "Try again" button wired to `refetch`/`retry`.
- **Empty:** a `Card` with an icon and copy distinguishing "no data yet" (with a primary action) from "no results for the active filters" (with a clear-filters action where supported).
