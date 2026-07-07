# Frontend Architecture

## Overview

The Memora frontend is a **Next.js 16 App Router** application with locale-prefixed routes, feature-based modules, and a thin API client talking to the Spring Boot backend.

**Entry:** `src/app/`  
**Features:** `src/features/`  
**Shared UI:** `src/components/`

## Next.js App Router

### Route groups

```
src/app/
├── layout.tsx                 # Root passthrough
└── [locale]/
    ├── layout.tsx             # Providers, fonts, html/body
    ├── login/ | register/
    ├── (marketing)/           # Public site (header + footer)
    │   ├── page.tsx           # Home
    │   └── profile/[username]/...
    └── dashboard/             # Authenticated app (sidebar shell)
        ├── page.tsx           # Home / adventure list
        ├── trips/[id]/...     # Adventure workspace
        ├── equipment/...
        └── profile/ | settings/ | places/ | wishlist/
```

`[locale]` is always present (`en`, `uk`) via `next-intl` with `localePrefix: "always"`.

### Server vs client components

- **Server:** Marketing profile pages, metadata, initial public data fetch via `serverApiGet`
- **Client:** Dashboard, forms, auth, interactive maps, TanStack Query hooks

Mark client boundaries with `"use client"` only where needed.

## Feature-based architecture

Each domain module under `src/features/<name>/`:

```
features/adventures/
├── api.ts      # HTTP calls + mock branches
├── hooks.ts    # useQuery / useMutation + query keys
└── types.ts    # DTOs aligned with backend
```

Current modules: `auth`, `adventures`, `days`, `moments`, `equipment`, `profile`, `public`.

**Rules:**

- API calls live in `api.ts`, not in components
- Query keys exported from `hooks.ts` as hierarchical factories
- Components import hooks, not `api.ts` directly (except auth session bootstrap)

Legacy mock data: `src/lib/mock-data/` — used when `NEXT_PUBLIC_USE_MOCKS=true`.

## State management

| Concern | Solution |
|---------|----------|
| Server data | TanStack Query v5 |
| Auth token | `AuthProvider` + `localStorage` + `apiClient.setAuthToken` |
| Form state | React Hook Form |
| Trip editor (mock/local) | `TripEditorProvider` context |
| Theme | `next-themes` |

No Redux or Zustand. Prefer query cache updates (`setQueryData`, `invalidateQueries`) over global stores.

### Query defaults (`query-provider.tsx`)

- `staleTime`: 60s
- `gcTime`: 5 min
- `retry`: 1
- `refetchOnWindowFocus`: false

### Query key pattern

```ts
export const adventureKeys = {
  all: ["adventures"] as const,
  detail: (id: string) => [...adventureKeys.all, "detail", id] as const,
};
```

Mutations invalidate related keys (e.g. moment create → invalidate adventure detail).

## React Hook Form + Zod

Validations in `src/lib/validations/`. Schemas accept translated error messages from `useTranslations`.

Forms use `zodResolver`. Optional numeric fields must tolerate empty input (no `NaN` failures).

## Localization

See [LOCALIZATION.md](./LOCALIZATION.md). Use `@/i18n/navigation` for `Link`, `redirect`, `useRouter` — never raw `next/link` for locale-aware routes.

## Theme

`ThemeProvider` wraps app with class-based dark/light/system. Default: dark. Toggle in site header and dashboard.

## Responsive layout

- Marketing: `SiteHeader` + full-width sections
- Dashboard: `AppShell` with sidebar (desktop) / drawer (mobile)
- Forms: `ResponsiveFormScreen` with sticky footer

See [RESPONSIVE_GUIDELINES.md](./RESPONSIVE_GUIDELINES.md).

## API layer

```
src/api/
├── client.ts       # fetch wrapper, JWT header
├── config.ts       # base URL, mock mode
├── endpoints.ts    # path registry
├── errors.ts       # ApiError parsing
└── types.ts        # ApiItemResponse<T>, ApiListResponse<T>
```

### Request flow

1. Feature `api.ts` calls `apiClient.get/post/patch/delete`
2. Client attaches `Authorization: Bearer` when token set
3. Responses unwrap `data` from `{ data: T }`
4. Errors throw `ApiError` with `code`, `status`, `fieldErrors`

### Mock mode

`isMockMode()` returns true unless `NEXT_PUBLIC_USE_MOCKS=false`. Each `api.ts` branches to `lib/mock-data` accessors.

### Server-side fetch

`lib/server-api.ts` — for RSC public portfolio pages (no auth header, `revalidate: 30`).

## Reusable components

| Layer | Location |
|-------|----------|
| Design system | `components/design-system/` |
| shadcn primitives | `components/ui/` |
| Layout | `components/layout/` |
| Domain | `components/dashboard/`, `components/trips/`, `components/moments/` |

Avoid page-specific one-off components when a design-system primitive suffices.

## Mappers

`src/lib/api-mappers.ts` converts backend DTOs to frontend `Trip`, `TripDay`, `TripEvent` types (legacy naming). New code should prefer DTO types in features and migrate UI terminology to Adventure/Moment over time.

## Route constants

`src/constants/routes.ts` — single source for path builders. Locale prefix is added by next-intl.

## Auth guard

`DashboardAuthGuard` redirects unauthenticated users to `/login`. `GuestAuthRedirect` sends signed-in users away from login/register to dashboard.

## Build and deploy

- `output: "standalone"` in `next.config.ts` for Docker
- `createNextIntlPlugin` for message loading
- Image remote patterns for Unsplash (marketing mock covers)

## Related docs

- [UX_GUIDELINES.md](./UX_GUIDELINES.md)
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
- [API_GUIDELINES.md](./API_GUIDELINES.md)
