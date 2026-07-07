# Architecture Decisions

Record of significant technical and product decisions. When reversing a decision, add a new entry explaining why — do not delete history.

Format: **Decision** · **Context** · **Consequences**

---

## ADR-001: Reference data tables instead of Java enums

**Decision:** Configurable values (moment types, statuses, visibilities, categories) live in PostgreSQL reference tables with bilingual labels.

**Context:** Enums require redeploy for new values and cannot be edited by admins. Memora needs Ukrainian/English labels and future Admin Panel.

**Consequences:** Extra joins and seed migrations; `ReferenceController` exposes lookups; `ReferenceCodeMapper` bridges frontend codes. No Java enums for domain vocabulary.

---

## ADR-002: Mobile first

**Decision:** Design and implement every screen for 375px width first, then enhance for tablet and desktop.

**Context:** Memories are captured on phones during travel. Desktop is for editing and browsing archives.

**Consequences:** Sticky form footers, drawer nav, dedicated mobile create screens. Desktop gets wider grids and sidebar — not a separate product.

---

## ADR-003: Adventure → Day → Moment hierarchy

**Decision:** Three-level journal structure: Adventure (journey) contains Days; Days contain Moments.

**Context:** Matches how people tell stories ("on day three we…"). Flat event lists feel like CRM logs.

**Consequences:** Nested API routes; day accordion UI; moments always belong to a day and adventure. Migration from flat "events" terminology ongoing in frontend types.

---

## ADR-004: Location attached to Moment

**Decision:** Geographic location is optional metadata on a **Moment**, not only on Adventure or Day.

**Context:** Memories are tied to specific places (café, summit, campsite). A day may span many locations.

**Consequences:** `MomentLocationDto` on moment create/update; map picker in moment form; future map views aggregate moment pins.

---

## ADR-005: Equipment inventory + reusable linking

**Decision:** Equipment is a **profile-level inventory** linked to adventures via `adventure_equipment` join table.

**Context:** Gear (tent, bike) is reused across trips. Users want one list, not re-entering gear per adventure.

**Consequences:** `EquipmentItem` owned by profile; attach/detach APIs on adventures; categories from reference data with system defaults.

---

## ADR-006: Photo-first philosophy

**Decision:** Visual media is primary in layout and product priority; text and metrics are secondary.

**Context:** Emotional recall is visual. Competing on forms and tables is a losing strategy.

**Consequences:** Cover images on adventures, photo upload on moments, public portfolio hero treatment. MVP: one cover per adventure, one photo per moment. Albums deferred to Phase 2.

---

## ADR-007: Cloud links for large video; object storage for photos

**Decision:** Store URLs to external providers (YouTube, Drive, etc.) for large video. Upload photos to **object storage** (Cloudflare R2) via `MediaStorageService`.

**Context:** Video files are large; users already store in cloud services. Photos are small enough to host reliably and must display inline in the journal.

**Consequences:** `CloudLink` entity for external video; `PHOTO_VIDEO` moment type; `POST /media/upload` for images; `photoUrl` / `coverImageUrl` on entities. No manual URL paste in UI for covers or moment photos.

---

## ADR-008: JWT stateless authentication

**Decision:** No server sessions; BCrypt passwords; JWT bearer tokens for API auth.

**Context:** SPA/Next.js client needs simple horizontal scaling; session stickiness adds ops burden for solo/small team.

**Consequences:** Token in localStorage; refresh flow not yet implemented (re-login after expiry); `SecurityConfig` permit list must stay accurate.

---

## ADR-009: Next.js App Router + feature modules

**Decision:** Frontend organized as App Router with `src/features/*` api/hooks/types slices.

**Context:** Colocate data fetching with domains; avoid god-components and scattered fetch calls.

**Consequences:** TanStack Query keys per feature; mock mode branches in `api.ts`; server components only where beneficial (public portfolio).

---

## ADR-010: Flyway-only schema management

**Decision:** JPA `ddl-auto: validate`; all schema changes via versioned SQL migrations.

**Context:** Production safety and reproducible environments. Hibernate auto-ddl is unsafe at scale.

**Consequences:** Every column change needs `V{n}__*.sql`; entities must match migrations exactly.

---

## ADR-011: Public portfolio as read-only API

**Decision:** `/public/profiles/**` endpoints are anonymous, separate from authenticated CRUD.

**Context:** Sharing should not require viewers to log in; security boundary must be explicit.

**Consequences:** `PublicPortfolioService` filters by visibility + status; `SecurityConfig` `/public/**` permitAll; frontend `/profile/{username}` routes.

---

## ADR-012: Future social network support

**Decision:** Design ownership and public visibility now; defer follow/feed/like to Phase 5.

**Context:** Social features are likely but must not distort the journal-first product.

**Consequences:** Username-based public URLs; portfolio as share unit; participant IDs stubbed on moments; no friend graph tables yet.

---

## ADR-013: Ukrainian as first-class locale

**Decision:** `uk` locale with full message files and reference `name_uk` columns from day one.

**Context:** Product owner and primary audience include Ukrainian speakers; i18n afterthought is expensive.

**Consequences:** All UI strings in JSON pairs; longer copy accommodated in layouts; `localePrefix: always`.

---

## ADR-014: Mock mode for frontend development

**Decision:** `NEXT_PUBLIC_USE_MOCKS` switches feature APIs to `lib/mock-data` accessors.

**Context:** UI iteration without backend; demos and design review.

**Consequences:** Dual paths in every `api.ts`; production Docker sets `false`; risk of mock-only bugs — test against real API before release.

---

## ADR-015: Separate frontend and backend repositories

**Decision:** `memora` contains only the Next.js app and documentation; `memora-backend` is a sibling directory/repository for the Spring Boot API.

**Context:** Nesting `backend/` inside the frontend project blurred ownership, complicated tooling (Node + Gradle in one tree), and made independent deploy/versioning harder.

**Consequences:** Developers clone both repos side by side; `docker-compose.yml` is split per repo; docs reference `../memora-backend` for API work; Flyway migrations live only in `memora-backend`.

---

## ADR-016: Cloudflare R2 for production image storage

**Decision:** Production uploads use **Cloudflare R2** via the S3-compatible API. Local disk is development-only.

**Context:** Railway ephemeral filesystem loses files on redeploy. Memora needs durable, CDN-friendly photo hosting.

**Consequences:** Env vars `STORAGE_PROVIDER=r2`, `S3_*`, `S3_PUBLIC_BASE_URL`. Frontend sets `NEXT_PUBLIC_MEDIA_BASE_URL`. Do not mount Railway volumes for photos in production.

---

## ADR-017: MediaStorageService abstraction

**Decision:** All image uploads go through `MediaStorageService` with pluggable `LocalMediaStorageService` (dev) and `S3CompatibleMediaStorageService` (prod).

**Context:** Swap storage backends without changing controllers or entity fields. Entities store public URL strings.

**Consequences:** `upload(file, folder)` returns `{ url, key, fileName, contentType, size }`. `delete(key)` for future cleanup. `GET /api/media/files/**` only when `STORAGE_PROVIDER=local`.

---

## ADR-018: One photo per Moment (MVP)

**Decision:** Each moment has at most **one** optional `photoUrl`. No gallery/album in MVP.

**Context:** Ship reliable upload + display before multi-image complexity. Mock mode legacy `photoIds` bridged in frontend for timeline rendering.

**Consequences:** `moments.photo_url` column (V10). `ImageUploadField` on moment form. `resolveEventRelations()` maps `photoUrl` → `event.photos[]` for cards. Albums in Phase 2.

---

## ADR-019: Optional adventure cover image

**Decision:** `coverImageUrl` is optional on create and update. UI shows gradient placeholder when absent.

**Context:** Friction blocks journal creation. Cover can be added later.

**Consequences:** `CoverImage` component with fallback. Adventure create/update accepts blank/missing cover. Public and private heroes handle null cover gracefully.

---

## ADR-020: Equipment on public and private adventure pages

**Decision:** Equipment attached to an adventure is shown on **both** the private detail page and the public adventure page.

**Context:** Gear is part of the travel story — readers want to see what was used, not only the owner in edit mode.

**Consequences:** `TripEquipmentSection` (private), `PublicTripEquipment` (public). Public API includes equipment in `PublicAdventureDetailDto`. Inventory remains profile-scoped; adventure links are not copies.

---

## ADR-021: Nested equipment creation during adventure form

**Decision:** Adding equipment while creating an adventure opens a **nested flow** without losing form state: side sheet on desktop, full-screen on mobile.

**Context:** Users discover missing gear mid-adventure setup. Navigating away loses progress.

**Consequences:** `EquipmentCreateNestedFlow` + `EquipmentSelector` in trip form. New equipment auto-selected after create. `equipmentIds` sent in adventure create/update payload (transactional sync on backend).

---

## ADR-022: Disabled unfinished navigation (Places, Wishlist)

**Decision:** Places and Wishlist appear in dashboard navigation with a **Soon** / **Скоро** badge but are not active product areas. Direct routes redirect to dashboard.

**Context:** Signal roadmap without shipping broken empty flows.

**Consequences:** Nav config marks items disabled; placeholder pages or redirects. No Place creation UX until Phase 3+. Wishlist deferred.

---

## ADR-023: PHOTO_VIDEO replaces DRONE as moment type

**Decision:** There is **no** `DRONE` moment type. Use **`PHOTO_VIDEO`** for drone footage, action camera, phone video, and camera photos.

**Context:** Drone content is a media format, not a separate activity category. Fewer types = simpler picker.

**Consequences:** Reference seed uses `PHOTO_VIDEO`. Frontend validation excludes `DRONE` from moment types. Equipment category `DRONE` remains for classifying gear only.

---

## ADR-024: Lightweight location on Moment (not Place creation)

**Decision:** Moment location is optional embedded metadata (name, latitude, longitude) via map pin UX — not a heavy **Place** entity creation flow.

**Context:** Users want "where was this?" without maintaining a place catalog. Place tables exist for future features.

**Consequences:** `MomentLocationDto` on API; map picker in moment form. No standalone Place create form in current product. Places nav section unfinished.

---

## Adding a new ADR

1. Copy the template above
2. Number sequentially
3. Link related docs
4. Discuss in PR if the decision is controversial
