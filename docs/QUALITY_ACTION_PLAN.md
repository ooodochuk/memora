# Memora Quality Action Plan (Re-evaluation)

**Updated:** 8 July 2026  
Derived from [QUALITY_AUDIT.md](./QUALITY_AUDIT.md) (re-evaluation).  
**Do not treat P2/P3 as blockers for a friends-and-family launch** after P0 is complete.

---

## P0 status at a glance

| # | Action | Status | Notes |
|---|--------|--------|-------|
| P0-1 | Configure R2 on Railway | **PARTIAL** | Code ready; operator set bucket + vars manually. Committed `railway.toml` still local-media. **Rotate credentials** if pasted into `railway.toml` working copy. |
| P0-2 | Configure Vercel build env | **PARTIAL** | `NEXT_PUBLIC_API_URL` + mocks likely set. `NEXT_PUBLIC_MEDIA_BASE_URL` must match R2 public URL at **build time** + redeploy. |
| P0-3 | Production secrets (JWT, CORS) | **UNKNOWN** | App works on prod — likely set. Verify in Railway dashboard; not auditable from repo. |
| P0-4 | Link Postgres to backend | **LIKELY DONE** | Production API serves data; `DATABASE_PRIVATE_URL` processor exists. |
| P0-5 | Wire moment cloud links on save | **NOT DONE** | `trip-moment-form-screen.tsx` omits `cloudLinkIds` from body. |
| P0-6 | Fix public day page in API mode | **NOT DONE** | `day/[dayId]/page.tsx` uses mock accessors only. |
| P0-7 | Surface form errors on API failure | **PARTIAL** | Moment form has inline error; adventure + day forms do not. |
| P0-8 | Fix `useDeleteMoment` cache key | **NOT DONE** | `useDeleteMoment("", tripId)` in `trip-detail-content.tsx`. |
| P0-9 | Align Places/Wishlist with docs | **NOT DONE** | Active nav to placeholder pages. |
| P0-10 | Resolve reference API auth mismatch | **NOT DONE** | `/reference/**` requires JWT; docs say public. |
| P0-11 | Smoke test production path | **PARTIAL** | Operator tested upload + dashboard; full checklist not signed off (must verify R2 URLs serve directly: no `/_next/image` 400, and confirm public day route is disabled/redirected). |
| P0-12 | Update deploy templates for R2 | **NOT DONE** | `.env.production.example` missing `NEXT_PUBLIC_MEDIA_BASE_URL`; `railway.toml` not updated on `main`. |

### Recently completed (moved out of P0 scope)

| Item | Repo | Commit / state |
|------|------|----------------|
| R2 storage service implementation | backend | `27b896b` |
| `equipmentIds` on adventure create/update | both | `27b896b`, `a42e058` |
| Moment photo upload + display bridge | both | `a42e058`, `b95d404` |
| Public equipment on adventure | both | `4c0ef73`, `0301db8` |
| Cover image fallback on 404 | frontend | `8dacbaa` |
| Docs aligned with R2 decisions | frontend | `0c929cf` |
| Equipment UUID i18n fix | frontend | **Local only** — `src/lib/equipment/categories.ts` |
| R2 image URL handling (`**.r2.dev`) | frontend | **Local only** — `media-url.ts`, `next.config.ts` |

---

## P0 — Must fix before sharing publicly

These items can cause **data loss, broken pages, security misconfiguration, or user trust failure**.

| # | Action | Area | Effort | Files / notes |
|---|--------|------|--------|---------------|
| P0-1 | **Complete R2 on Railway** — `STORAGE_PROVIDER=r2`, `S3_ENDPOINT`, `S3_BUCKET`, `S3_REGION=auto`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_PUBLIC_BASE_URL`, `MEDIA_PUBLIC_BASE_URL` via **dashboard only** | Deploy | S | Railway variables; **do not** put secrets in `railway.toml` |
| P0-2 | **Complete Vercel build env** — `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_USE_MOCKS=false`, `NEXT_PUBLIC_MEDIA_BASE_URL` (= `S3_PUBLIC_BASE_URL`); **redeploy** | Deploy | S | Vercel project settings |
| P0-3 | **Verify production secrets** — `JWT_SECRET` (≥256 bits), `CORS_ALLOWED_ORIGINS` = exact Vercel URL(s) | Deploy | S | Railway backend variables |
| P0-4 | **Confirm Postgres linked** — `DATABASE_PRIVATE_URL` reference | Deploy | S | Railway service linking |
| P0-5 | **Wire moment cloud links on save** — include `cloudLinkIds` in create/update payload from `trip-moment-form-screen.tsx` | Product / FE | M | `trip-moment-form-screen.tsx`, `features/moments/api.ts` |
| P0-6 | **Fix or remove public day page in API mode** — use `getPublicTripPageData` or redirect to parent adventure | Product / FE | M | `app/.../day/[dayId]/page.tsx` |
| P0-7 | **Surface form errors on API failure** — toast or inline on adventure/day save (`trip-form.tsx`, `trip-day-form-screen.tsx`) | UX / FE | S | Moment form already done |
| P0-8 | **Fix `useDeleteMoment` cache key** — pass real `dayId`, not `""` | FE | S | `trip-detail-content.tsx` |
| P0-9 | **Align Places/Wishlist with docs** — Soon badge + disable nav + redirect, **or** update ADR-022 / ROADMAP | Product / UX | M | `nav-config.ts`, sidebar, mobile nav, docs |
| P0-10 | **Resolve reference API auth mismatch** — add `/reference/**` to `permitAll` **or** update `SECURITY.md` + `API_GUIDELINES.md` | API / Docs | S | `SecurityConfig.java` or docs |
| P0-11 | **Smoke test production path** — register → adventure + cover + equipment → day → moment + photo → publish → public URL → **redeploy backend** → photos still load (verify R2 URLs serve directly: no `/_next/image` 400) + confirm public day route is disabled/redirected | QA | S | Manual checklist |
| P0-12 | **Update deploy templates** — `railway.toml` comments (no secrets), `.env.production.example` + Dockerfile ARG for `NEXT_PUBLIC_MEDIA_BASE_URL` | Deploy / Docs | S | Both repos |
| P0-13 | **Ship local frontend fixes** — commit + deploy equipment i18n + R2 image URL handling; verify console `MISSING_MESSAGE` is gone for equipment categories and dashboard images do not throw `/_next/image?url=... 400` | FE / Deploy | S | `categories.ts`, `media-url.ts`, `next.config.ts` |
| P0-14 | **Security: revert `railway.toml`** — remove accidental credential paste; rotate R2 keys if exposed | Security | S | `memora-backend/railway.toml` |

**P0 exit criteria:** A non-developer can register, document a trip with photos, publish it, and view it on a public URL; images survive backend redeploy; no mock data in production build; no misleading unsaved UI (cloud links); public day URLs do not 404.

---

## P1 — Should fix soon

Important for **reliability, maintainability, and polish** within the first month of real usage.

| # | Action | Area | Effort | Files / notes |
|---|--------|------|--------|---------------|
| P1-1 | **Remove `isMockMode()` from UI components** — centralize in `api.ts` or dev provider | FE | L | `trip-form.tsx`, `trip-workspace-layout.tsx`, forms |
| P1-2 | **Eliminate direct `lib/mock-data` imports in components** — route through feature hooks | FE | M | `trip-card.tsx`, `trip-day-card.tsx`, `dashboard-trip-preview.tsx` |
| P1-3 | **Add ownership integration tests** — user A cannot access user B's adventure/day/moment | BE | M | `src/test/java/com/memora/` |
| P1-4 | **Fix equipment category ownership check** — user ID vs profile ID in `resolveCategory` | BE | S | `EquipmentService.java` |
| P1-5 | **Fix public portfolio travel stats** — cycling/driving km; align with dashboard logic | BE | S | `PublicPortfolioService.java` |
| P1-6 | **Collapse private day accordion by default** — match public page and UX guidelines | UX | S | `trip-detail-content.tsx` |
| P1-7 | **Enrich day accordion headers** — date, activity chips, moment count | UX | M | `trip-day-accordion-item.tsx` |
| P1-8 | **Wire cloud links in API workspace** — pass cloud links to `resolveEventRelations` in `trip-workspace-layout.tsx` | FE | M | `trip-workspace-layout.tsx`, cloud link fetch hook |
| P1-9 | **Fix trip detail `cloudLinkCount`** — fetch real count in API mode | FE | S | `trip-detail-page-client.tsx` |
| P1-10 | **Add `NEXT_PUBLIC_MEDIA_BASE_URL` to Docker build** | Deploy | S | `Dockerfile`, `docker-compose.yml` |
| P1-11 | **Add CI** — `npm run build` + `npx tsc` + `./gradlew test` on PR | Deploy | M | `.github/workflows/` in both repos |
| P1-12 | **Media delete on URL change / entity delete** — call `MediaStorageService.delete(key)` | BE | M | adventure/moment services |
| P1-13 | **Scope adventure slug to owner** — migration `(owner_id, slug)` unique | DB / BE | M | Flyway migration, `AdventureService`, `SlugUtils` |
| P1-14 | **Add missing DB indexes** — `cloud_links(moment_id)`, `moments(day_id, sort_order)` | DB | S | New Flyway migration |
| P1-15 | **Equipment form: use `ImageUploadField`** instead of URL input | UX / FE | S | `equipment-form.tsx` |
| P1-16 | **Nested equipment create on edit adventure** — not only create mode | Product | S | `trip-form.tsx` |
| P1-17 | **Auth error mapping** — show API field errors on login/register | UX | S | `login-form.tsx`, `register-form.tsx` |
| P1-18 | **Update ADR-022 and ROADMAP** after Places/Wishlist implementation choice | Docs | S | `ARCHITECTURE_DECISIONS.md`, `ROADMAP.md` |
| P1-19 | **Create `DEPLOYMENT.md`** — single env matrix + smoke checklist | Docs | S | `docs/DEPLOYMENT.md` |
| P1-20 | **Disable or restrict Swagger UI in production** | Security | S | `application-prod.yml` or security config |
| P1-21 | **Re-upload guidance for pre-R2 media** — beta comms or admin note; optional migration script later | Product / Ops | S | Docs or in-app hint |

---

## P2 — Polish later

Improves experience and code health; safe to defer until after initial real users.

| # | Action | Area | Effort |
|---|--------|------|--------|
| P2-1 | Desktop side sheets for adventure/day/moment create/edit (replace full pages on `lg+`) | UX |
| P2-2 | First-adventure onboarding flow after register | Product |
| P2-3 | Extract shared `ConfirmDeleteDialog` | FE |
| P2-4 | Consolidate `TripEventCard` and `TripTimelineEventCard` | FE |
| P2-5 | Consolidate hero components (`trip-hero`, `public-trip-hero`) | FE |
| P2-6 | Trip → Adventure naming migration (types, routes, i18n keys) | FE |
| P2-7 | Delete dead code — `lib/query-keys.ts`, unused `TripList` | FE |
| P2-8 | Unit tests for `api-mappers.ts`, Zod schemas, query cache helpers | FE |
| P2-9 | Rate limiting on `/auth/login` | Security |
| P2-10 | JWT refresh token flow | Security |
| P2-11 | Pagination on adventure list API | API |
| P2-12 | DB health check in `/health` or actuator | Deploy |
| P2-13 | Composite index `(owner_id, visibility_id, status_id)` on adventures | DB |
| P2-14 | Fix `useAdventure` aggressive `staleTime: 0` / `refetchOnMount: always` | FE |
| P2-15 | Standardize equipment breakpoint (`useIsDesktop` 768 vs 1024) | UX |
| P2-16 | Accordion header accessibility audit | A11y |
| P2-17 | Translate remaining hardcoded aria-labels | i18n |
| P2-18 | Add `CHANGELOG.md` | Docs |
| P2-19 | Public JSON caching headers / ETag | API |
| P2-20 | Image processing pipeline (resize, strip EXIF) | BE |

---

## P3 — Future improvements

Aligned with [ROADMAP.md](./ROADMAP.md) Phases 2–7.

| # | Action | Phase |
|---|--------|-------|
| P3-1 | Photo albums / galleries per moment or adventure | Phase 2 |
| P3-2 | Cloud link oEmbed previews | Phase 2 |
| P3-3 | Places backend + map UX (replace placeholder nav) | Phase 3 |
| P3-4 | Wishlist feature | Phase 3+ |
| P3-5 | Adventure map overview from moment pins | Phase 3 |
| P3-6 | Participants entity and tagging | Phase 4 |
| P3-7 | Follow / discover / share cards | Phase 5 |
| P3-8 | Admin panel + reference CRUD UI | Phase 6 |
| P3-9 | Native mobile apps | Phase 7 |
| P3-10 | API versioning `/v1/` | When external clients exist |
| P3-11 | User-scoped equipment categories | Phase 6 |
| P3-12 | Full-text search on public portfolios | Phase 5+ |
| P3-13 | Social feed (if ever) | Phase 5 — non-goal until journal is solid |
| P3-14 | ADR-025+ for health endpoints, DB env processor | Docs |

---

## Suggested execution order (next 2 weeks)

### Days 1–2 — Deploy hygiene (P0 security + media)

1. **P0-14** — Revert `railway.toml`; rotate R2 credentials if exposed.
2. **P0-1, P0-2** — Verify Railway + Vercel env; redeploy both.
3. **P0-13** — Commit and deploy local FE fixes (i18n + R2 images).
4. **P0-12** — Update `.env.production.example` and `railway.toml` comments on `main`.

### Days 3–7 — Trust-breaking bugs (P0 product)

1. **P0-7, P0-8** — Form errors + delete moment cache.
2. **P0-5** — Cloud links on save (or temporarily hide UI until done).
3. **P0-6** — Public day page fix or redirect.
4. **P0-9, P0-10** — Places/Wishlist + reference auth alignment.
5. **P0-11** — Full production smoke test; sign off in this doc.

### Week 2 — Stability (P1 start)

1. P1-3 (ownership tests)
2. P1-1, P1-2 (mock cleanup)
3. P1-6, P1-7 (accordion UX)
4. P1-4, P1-5 (backend bugs)
5. P1-11 (CI)
6. P1-19 (`DEPLOYMENT.md`)

---

## Top 5 fixes (strict priority)

1. **P0-14 + P0-1 + P0-2** — Secure R2 deployment end-to-end (no secrets in git; Vercel build-time media URL; redeploy).
2. **P0-13** — Ship uncommitted frontend fixes (equipment i18n, R2 image loading).
3. **P0-5** — Wire moment cloud links on save or hide the UI.
4. **P0-7 + P0-8** — Adventure/day save errors + moment delete cache key.
5. **P0-6** — Fix or remove public day page in API mode.

---

## Final verdict (from re-audit)

| Question | Answer |
|----------|--------|
| **Private beta ready?** | **Yes, with caveats** — if R2 + Vercel media env complete, local fixes deployed, beta users informed of known gaps. |
| **Public sharing ready?** | **No** — P0 backlog and trust-breaking UX gaps remain. |
| **Overall score** | **6.6 / 10** (was 6.5) |

---

## Strict release gates (practical)

### Private beta gate (friends-and-family)
- [ ] R2 works end-to-end: upload → image serves from `pub-*.r2.dev` (no proxy/_next/image 400).
- [ ] `NEXT_PUBLIC_USE_MOCKS=false` in production build.
- [ ] No broken “public day” links are reachable from nav.
- [ ] Cloud links UI is either wired on save (P0-5) or clearly treated as “visual only” (hide/disable before sharing).
- [ ] Full smoke test passed (P0-11), including a backend redeploy.

### Public sharing gate
- [ ] All remaining P0 items marked DONE (or explicitly removed from user journey via redirect/disable).
- [ ] Docs and production behavior fully aligned (especially Places/Wishlist and `/reference/**` expectations).
- [ ] No exposed/invalid config in repo (notably `railway.toml`) and no credential paste in working tree.

## Ownership suggestion

| Track | Owner focus |
|-------|-------------|
| **Deploy / infra / security** | P0-1–4, P0-12–14, P1-10, P1-11, P1-20 |
| **Frontend product** | P0-5–9, P0-13, P1-6–9, P1-15–17 |
| **Backend** | P0-10, P1-4–5, P1-12–14 |
| **Documentation** | P0-9, P0-10, P1-18–19, post-fix ADR updates |
| **QA** | P0-11 after each P0 batch |

---

## Tracking

When an item is completed:

1. Update the **P0 status table** at the top of this file.
2. Update [QUALITY_AUDIT.md](./QUALITY_AUDIT.md) scores if material.
3. Update [ROADMAP.md](./ROADMAP.md) if scope changes.
4. Update [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) if the decision changes.
5. Re-run P0-11 smoke test.

---

## Related documents

- [QUALITY_AUDIT.md](./QUALITY_AUDIT.md) — full findings and scores
- [ROADMAP.md](./ROADMAP.md) — product phases
- [docs/README.md](./README.md) — development setup
