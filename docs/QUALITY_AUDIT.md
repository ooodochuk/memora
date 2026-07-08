# Memora Quality Audit (Re-evaluation)

**Date:** 8 July 2026  
**Previous audit:** July 2026 (initial)  
**Scope:** `memora` (Next.js frontend) + `memora-backend` (Spring Boot API)  
**Method:** Static code review, documentation cross-check, configuration audit, production behaviour inferred from deployed URLs and recent operator setup (R2 bucket `memora`, Vercel `memora-kappa-gold.vercel.app`, Railway backend). No formal load testing or automated E2E.

---

## Executive summary

Memora remains a **credible journal MVP** with clear domain modelling, feature-sliced frontend, consistent REST API, Flyway schema, JWT ownership checks, and unusually thorough documentation.

Since the first audit, **meaningful progress** landed: R2-compatible object storage (code), transactional `equipmentIds` on adventures, moment photo upload/display, public equipment on portfolio pages, cover fallback on missing media, and docs aligned with storage decisions. Operators have **partially configured R2 in production** — new uploads can reach `pub-*.r2.dev` and serve `200 OK` when env vars are set.

However, **most P0 code and config items remain open**. Several fixes exist only in the **local working tree** (equipment category i18n, R2 image URL handling) and are **not deployed**. The backend `railway.toml` working copy contains **accidental credential paste** — invalid TOML and a security incident if committed or shared.

**Overall score: 6.6 / 10** (was 6.5)

| Dimension | Score | Δ | One-line summary |
|-----------|-------|---|------------------|
| Product | 6.7 / 10 | +0.2 | Core journal loop works; API-mode gaps and misleading UI remain |
| UX | 6.2 / 10 | +0.2 | Mobile-first shell solid; console i18n noise, silent form failures |
| Frontend | 7.0 / 10 | — | Good architecture; mock debt; fixes unshipped |
| Backend | 7.5 / 10 | — | Clean layering; deployment wiring and completeness gaps |
| API | 7.0 / 10 | — | Consistent REST; auth/docs drift on `/reference/**` |
| Database | 7.5 / 10 | — | Solid Flyway schema; index and slug risks unchanged |
| Deployment | 6.0 / 10 | +0.5 | R2 can work in prod; repo templates and `railway.toml` still wrong |
| Documentation | 7.0 / 10 | — | Comprehensive; contradictions with code persist |
| Mobile readiness | 6.5 / 10 | — | Bottom nav + responsive forms; tablet gap, accordion UX |
| Public sharing readiness | 6.0 / 10 | +0.5 | Adventure public page works; day page broken, stats wrong |

---

## What improved since the previous audit

| Area | Change | Evidence |
|------|--------|----------|
| Object storage | `S3CompatibleMediaStorageService` for R2/S3 | Backend `27b896b` |
| Adventure equipment | `equipmentIds` on create/update, transactional replace | FE `a42e058`, BE `27b896b` |
| Moment photos | Upload API + `photoUrl` on moments + display bridge | FE/BE commits; `resolveEventRelations()` |
| Public equipment | Attached gear on public adventure API + UI | BE `4c0ef73`, FE `0301db8` |
| Cover resilience | Gradient fallback when image 404 | FE `8dacbaa`, `CoverImage` |
| Docs | R2, ImageUploadField, equipment flows aligned | FE `0c929cf` |
| Production R2 (operator) | Bucket `memora`, public dev URL enabled, Railway/Vercel vars partially set | Live `pub-*.r2.dev` URLs return 200 for new uploads |
| Local fixes (not shipped) | Equipment UUID i18n, `**.r2.dev` in `next.config.ts`, `isMemoraUploadedUrl` for R2 | Uncommitted in `categories.ts`, `media-url.ts`, `next.config.ts` |

---

## Critical new risk: credentials in `railway.toml`

The **working copy** of `memora-backend/railway.toml` contains pasted Cloudflare R2 credentials and UI text after line 13. The file is **invalid TOML** and must **not** be committed.

**Actions required (operator, not code):**

1. Restore `railway.toml` to the last clean commit (`git checkout -- railway.toml`).
2. Set all secrets **only** in Railway dashboard variables.
3. **Rotate** the exposed R2 API token and access keys if they were pasted into git, chat, or screenshots.

Committed `railway.toml` on `main` still defaults to **local media** (`MEDIA_UPLOAD_DIR`, backend proxy URL) — not R2.

---

## 1. Product quality

**Score: 6.7 / 10** (was 6.5)

### What is good

- **Core loop works in API mode** when env is correct: register → adventure + cover + equipment → day → moment + photo → publish → public adventure URL.
- **Equipment on adventures** — create/edit sends `equipmentIds`; public page shows gear.
- **Moment photos** — upload and timeline display wired (with R2 when configured).
- **Journal positioning** — story-first UI, bilingual EN/UK, empty states, public portfolio narrative.

### What improved

- Photo persistence and display no longer blocked by missing bridge code.
- Equipment attach is one transactional save, not post-save loops.
- R2 path validated in production for **new** uploads (operator-confirmed).

### What is still risky

- **Moment cloud links** — UI collects links; `trip-moment-form-screen.tsx` omits `cloudLinkIds` from API payload (lines 115–135). Users think links are saved; they are not in API mode.
- **Public day page** — `profile/.../day/[dayId]/page.tsx` uses **mock accessors only**; 404 or wrong data in production.
- **Places/Wishlist** — active nav to placeholder pages; contradicts `PRODUCT.md` / ADR-022 (Soon + disabled).
- **No onboarding** after register.
- **Old media URLs** — pre-R2 uploads still 404; no migration path.
- **Mock mode** — `NEXT_PUBLIC_USE_MOCKS` defaults `true` in dev; production misconfig still possible.

### Blocking public sharing

- Cloud links UI implies capability not persisted.
- Public day URLs broken in API mode.
- Silent adventure/day save failures (see UX).
- Places nav dead-end erodes trust.

### Can wait

- Desktop side sheets, onboarding wizard, photo albums, Places/Wishlist features.

### Recommended next actions

- P0-5, P0-6, P0-9 from action plan.
- Re-upload or accept loss of pre-R2 images; document for beta users.
- Ship uncommitted i18n + R2 image fixes.

---

## 2. UX quality

**Score: 6.2 / 10** (was 6.0)

### What is good

- `ResponsiveFormScreen` — sticky footer, safe areas, full-height mobile forms.
- Mobile bottom nav (4 items), `pb-24` content clearance.
- `h-12` touch targets on primary actions; dark mode defaults.
- Moment form progressive disclosure; nested equipment flow with scroll lock.
- Moment save shows inline error banner (`setSaveError`).

### What improved

- Cover gradient fallback avoids broken-image holes on cards.
- Equipment labels from API `name` once i18n fix is deployed (fixes `MISSING_MESSAGE` console spam for UUID categories).

### What is still risky

- **Adventure and day forms** — `trip-form.tsx` empty `catch`; `trip-day-form-screen.tsx` no error UI.
- **Dashboard accordion expanded by default** — inconsistent with public page and UX guidelines.
- **Accordion headers** — missing date, activity chips, moment count in private view.
- **Equipment i18n on production** — `MISSING_MESSAGE` for `equipment.defaultCategories.{uuid}` until local fix ships.
- **`/_next/image` 400** on R2 URLs when `NEXT_PUBLIC_MEDIA_BASE_URL` missing at Vercel build (partially mitigated by uncommitted `unoptimized` + `**.r2.dev` pattern).
- **Auth** — generic errors; loading flash on guest redirect.
- **Tablet** — no collapsible sidebar between mobile and `lg` (docs specify one).

### Blocking public sharing

- Silent save failures on adventure/day.
- Console errors visible to technical users (i18n, 404 media).

### Can wait

- Accordion enrichment, desktop sheets, auth field mapping.

### Recommended next actions

- P0-7, deploy R2/image env + code fixes, P1-6/P1-7.

---

## 3. Frontend code quality

**Score: 7.0 / 10** (unchanged)

### What is good

- Feature modules (`features/{adventures,days,moments,equipment,media,auth,public}/`).
- TanStack Query with hierarchical keys and surgical cache updates.
- react-hook-form + Zod; centralized `apiClient` and `ApiError`.
- `ImageUploadField`, `CoverImage`, `resolveEventRelations()` photo bridge.

### What improved

- Local fixes for R2 URL detection and equipment label resolution (quality, not yet in `main`).

### What is still risky

- **~49 `isMockMode()` call sites** across 17 files — UI still branches on mock vs API.
- Direct `lib/mock-data` imports in list/card components.
- Trip vs Adventure naming split.
- **Zero automated tests** — no `*.test.ts(x)`, no test script.
- **P0-8** — `useDeleteMoment("", tripId)` in `trip-detail-content.tsx` line 34; wrong cache key after delete.
- Dead code: `lib/query-keys.ts`, unused `TripList`.

### Blocking public sharing

- Wrong moment list cache after delete (stale UI until refresh).
- Mock branches increase regression risk.

### Can wait

- Trip→Adventure rename, component consolidation, unit tests.

### Recommended next actions

- Commit and deploy local media/i18n fixes.
- P0-8, P1-1, P1-2, P1-11 (CI).

---

## 4. Backend code quality

**Score: 7.5 / 10** (unchanged)

### What is good

- Vertical slices; ownership helpers return 404 cross-tenant.
- `MediaStorageService` abstraction with local + S3/R2 implementations.
- Equipment sync transactional; reference data with bilingual seeds.
- MapStruct DTO mapping; `GlobalExceptionHandler`.

### What improved

- R2 upload/delete implementation complete and activatable via env.

### What is still risky

- **N+1** on dashboard and public stats loops.
- **Global adventure slug** uniqueness — not scoped to owner.
- **Media delete never called** on entity delete or URL change — orphan objects in R2/disk.
- **`resolveCategory`** compares profile ID to `users.id` on custom categories — latent bug (P1-4).
- **Places schema** without API.
- No cross-user ownership integration tests.

### Blocking public sharing

- Orphan media cost (R2 storage leak), not user-visible immediately.
- Custom equipment categories will fail when implemented.

### Can wait

- Media lifecycle, Places API, rate limiting, refresh tokens.

### Recommended next actions

- P1-3, P1-4, P1-12; never commit secrets to `railway.toml`.

---

## 5. API quality

**Score: 7.0 / 10** (unchanged)

### What is good

- `{ data: T }` envelope; structured errors with `code` and `fieldErrors`.
- REST nesting; public namespace; multipart upload returns `url` + `key`.
- Integration tests for auth, adventures, public portfolio, CORS preflight.

### What is still risky

- **`/reference/**` requires JWT** — docs claim public read (`SECURITY.md`, `API_GUIDELINES.md`).
- **Swagger UI public in production** — full surface exposed.
- **No pagination** on adventure lists.
- **Public portfolio stats** — `cyclingKm`/`drivingKm` always 0; all distance in `hikingKm` (`PublicPortfolioService`).
- 404 for forbidden resources — correct for privacy, hard to debug.

### Blocking public sharing

- Reference auth mismatch may break unauthenticated flows if frontend ever calls reference without token (currently uses authenticated hooks in API mode — works but undocumented).

### Can wait

- API versioning, pagination, rate limiting, disable Swagger in prod.

### Recommended next actions

- P0-10, P1-5, P1-20.

---

## 6. Database quality

**Score: 7.5 / 10** (unchanged)

### What is good

- Flyway V1–V10; UUID PKs; FK cascades; audit columns; `moments.photo_url` (V10).
- Reference tables with bilingual names and stable codes.

### What is still risky

- Global slug unique constraint.
- Missing indexes: `cloud_links(moment_id)`, `moments(day_id, sort_order)`.
- No CHECK constraints on dates/coordinates in DB.
- `places` tables without product feature.

### Blocking public sharing

- Slug collision between users at scale (low probability for beta).

### Can wait

- Index migration, `(owner_id, slug)` scoping.

### Recommended next actions

- P1-13, P1-14 before scale.

---

## 7. Deployment readiness

**Score: 6.0 / 10** (was 5.5)

### What is good

- Backend Dockerfile (Java 21, non-root); Railway healthcheck on `/health`.
- `DatabaseUrlEnvironmentPostProcessor` for Railway Postgres vars.
- Frontend `output: "standalone"`; R2 code path ready.
- Production backend health returns 200; frontend deploys on Vercel.

### What improved

- Operator configured R2 bucket, public dev URL, and Railway/Vercel variables (partial).
- New images can persist across backend redeploy **when** `STORAGE_PROVIDER=r2` is set in Railway (not in committed `railway.toml`).

### What is still risky

- **Committed `railway.toml`** — local media defaults only; no `STORAGE_PROVIDER=r2`.
- **Working copy `railway.toml`** — credential paste; must revert and rotate.
- **`.env.production.example`** — missing `NEXT_PUBLIC_MEDIA_BASE_URL`.
- **`NEXT_PUBLIC_USE_MOCKS` defaults true** in dev config.
- **No CI/CD** in either repo.
- **CORS / JWT** — must be set manually; not verifiable from repo.
- **Hardcoded Railway host** in `next.config.ts`.
- Actuator `/health` does not check DB.

### Blocking public sharing

- Without `NEXT_PUBLIC_MEDIA_BASE_URL` at **Vercel build time**, images break or route through `/_next/image` incorrectly.
- Without Railway R2 vars, uploads revert to ephemeral disk on redeploy.

### Can wait

- CI, `DEPLOYMENT.md`, DB health in actuator.

### Recommended next actions

- P0-1, P0-2, P0-12; revert `railway.toml`; redeploy both services after env verification.

---

## 8. Documentation quality

**Score: 7.0 / 10** (unchanged)

### What is good

- 17+ docs under `docs/`; ADR-001–024; bilingual/branding docs.
- Backend README covers R2 and Railway Postgres.
- Quality audit index in `docs/README.md`.

### What improved

- R2, ImageUploadField, equipment flows documented (commit `0c929cf`).

### What is still risky

- Places/Wishlist docs vs code.
- `/reference/**` auth contradiction.
- `dev` vs `local` profile naming in older doc sections.
- Cloud links marked done in roadmap; API-mode save not wired.
- No `DEPLOYMENT.md`, no `CHANGELOG.md`.
- Architecture docs only in frontend repo.

### Blocking public sharing

- Misleading docs cause wrong production setup (e.g. local media in `railway.toml`).

### Can wait

- `DEPLOYMENT.md`, CHANGELOG, backend docs mirror.

### Recommended next actions

- Update audit/action plan after each P0 batch; P1-18, P1-19.

---

## 9. Mobile readiness

**Score: 6.5 / 10** (new section)

### What is good

- Mobile-first dashboard: fixed bottom nav, safe-area padding, touch-sized buttons.
- Full-page create/edit flows usable on phone; equipment nested create portal.
- Public adventure page responsive; collapsed day accordion on public view.
- i18n EN/UK on all primary flows.

### What is still risky

- No tablet-specific sidebar (jump from bottom nav to full desktop sidebar at `lg`).
- Private trip detail accordion expanded by default — long scroll on mobile.
- Form `min-h-[calc(100dvh-4rem)]` vs bottom nav padding — occasional layout tension.
- Wishlist only in header dropdown, not bottom nav — discoverability inconsistency.
- No PWA / offline / native app (expected per roadmap).

### Blocking public sharing

- Not blocking for mobile web beta if core flows tested on iOS Safari + Android Chrome.

### Can wait

- Tablet nav, PWA, native apps (Phase 7).

### Recommended next actions

- Manual smoke on real devices; P1-6 accordion default; P2-15 breakpoint standardization.

---

## 10. Public sharing readiness

**Score: 6.0 / 10** (new section)

### What works today (API mode, env correct)

| Flow | Status |
|------|--------|
| Register / login | ✅ |
| Create adventure + cover (R2) | ✅ |
| Attach equipment | ✅ |
| Create day / moment + photo | ✅ |
| Publish adventure | ✅ |
| Public adventure page | ✅ |
| Public equipment section | ✅ |
| Images survive redeploy (R2) | ✅ when configured |

### What does not work or misleads

| Flow | Status |
|------|--------|
| Public day page (`/profile/.../day/[dayId]`) | ❌ mock only |
| Moment cloud links on save | ❌ not in payload |
| Pre-R2 media URLs | ❌ 404 |
| Public portfolio travel stats | ⚠️ wrong buckets |
| Places / Wishlist from nav | ⚠️ placeholders |
| Reference API without auth | ⚠️ docs wrong; FE uses auth |

### Blocking public sharing

1. Broken public day URLs (if linked or indexed).
2. Cloud links UI without persistence.
3. Production env fragility (media URL build-time, R2 not in repo defaults).
4. Silent form errors on adventure/day.
5. Docs/code drift (Places, reference auth).

### Can wait for friends-and-family beta

- Wrong public stats, Swagger public, orphan R2 objects, slug global uniqueness.

### Recommended next actions

- P0-11 full smoke test checklist after P0 deploy batch.
- Remove or fix public day route before sharing URLs widely.

---

## Cross-repo integration matrix (updated)

| Flow | Frontend | Backend | Status |
|------|----------|---------|--------|
| Register / login | ✅ | ✅ | Works |
| Create adventure + cover | ✅ | ✅ | Works with R2 env |
| Attach equipment on create | ✅ | ✅ | `equipmentIds` transactional |
| Create day | ✅ | ✅ | Works |
| Create moment + photo | ✅ | ✅ | Works with R2 env |
| Moment cloud links | UI only | ✅ API exists | **Not wired on save** |
| Public adventure page | ✅ | ✅ | Works |
| Public day page | Mock only | N/A | **Broken in API mode** |
| Image upload (R2) | ✅ | ✅ | **Needs Railway env** (operator partial) |
| Image display (R2 CDN) | ✅ | ✅ | **Needs Vercel build env + FE fix deploy** |
| Equipment on public page | ✅ | ✅ | Works |
| Equipment category labels (UK) | ⚠️ fix local | ✅ `name_uk` | **Fix not deployed** |
| Reference data fetch | ✅ hooks | ✅ | Auth required (docs wrong) |

---

## Score summary

| Area | Score | Previous |
|------|-------|----------|
| **Overall** | **6.6 / 10** | 6.5 |
| Product | 6.7 / 10 | 6.5 |
| UX | 6.2 / 10 | 6.0 |
| Frontend | 7.0 / 10 | 7.0 |
| Backend | 7.5 / 10 | 7.5 |
| API | 7.0 / 10 | 7.0 |
| Database | 7.5 / 10 | 7.5 |
| Deployment | 6.0 / 10 | 5.5 |
| Documentation | 7.0 / 10 | 7.0 |
| Mobile readiness | 6.5 / 10 | — |
| Public sharing readiness | 6.0 / 10 | — |

---

## Final verdict

### Is Memora ready for private beta?

**Yes, with explicit caveats** — suitable for a **small friends-and-family beta** (5–15 people) **if**:

- R2 is fully configured on Railway and `NEXT_PUBLIC_MEDIA_BASE_URL` is set on Vercel with a **fresh redeploy**.
- Uncommitted frontend fixes (equipment i18n, R2 image URLs) are **committed and deployed**.
- Beta users are told: re-upload old photos; avoid public day URLs; cloud links on moments do not save yet; Places/Wishlist are placeholders.
- `railway.toml` credentials are rotated and never committed.

Not ready for private beta **without** R2 + Vercel media env — images will disappear on redeploy.

### Is Memora ready to share publicly?

**No.** Too many trust-breaking gaps remain: silent form failures, misleading cloud-link UI, broken public day routes, nav to dead-end features, production config not encoded in repo, no CI, and incomplete smoke-test sign-off.

Estimated effort to public-ready: **close all P0 items** (1–2 focused weeks) plus deploy verification.

### Top 5 fixes to do next

1. **Secure and complete R2 deployment** — revert `railway.toml`, rotate leaked credentials, set R2 vars only in Railway dashboard, add `NEXT_PUBLIC_MEDIA_BASE_URL` to Vercel, redeploy both services.
2. **Ship uncommitted frontend fixes** — equipment category labels (`categories.ts`), R2 direct load (`media-url.ts`, `next.config.ts`); verify no `/_next/image` 400 on dashboard.
3. **Wire or hide moment cloud links** (P0-5) — stop UI from implying saved links when API payload omits `cloudLinkIds`.
4. **Surface save errors on adventure and day forms** (P0-7) + fix `useDeleteMoment` cache key (P0-8).
5. **Fix or remove public day page in API mode** (P0-6) — redirect to parent adventure or implement `getPublicTripPageData` for days.

---

## Related documents

- [QUALITY_ACTION_PLAN.md](./QUALITY_ACTION_PLAN.md) — prioritized fix list with P0 status
- [ROADMAP.md](./ROADMAP.md) — product phases
- [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) — ADR rationale
