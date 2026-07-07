# Roadmap

Phases are sequential themes — not fixed dates. Ship each phase completely enough to be useful before expanding scope.

## Phase 1 — Personal Adventure Journal ✅ (current)

**Goal:** One person can document adventures privately and share a public portfolio.

- [x] Auth (register, login, JWT)
- [x] Profile (display name, username, bio, tagline)
- [x] Adventures CRUD (status, visibility, optional cover, dates)
- [x] Days CRUD with activity types
- [x] Moments CRUD (types, optional time/location/metrics, optional photo)
- [x] Equipment inventory + link to adventures (`equipmentIds` on create/update)
- [x] Equipment displayed on private and public adventure pages
- [x] Nested equipment creation during adventure form
- [x] Dashboard home with stats
- [x] Public portfolio (`/profile/{username}`)
- [x] Public adventure page (cover, days, moments, photos, equipment, cloud links)
- [x] English + Ukrainian
- [x] Image upload (`ImageUploadField`) — device upload, not URL paste
- [x] Object storage abstraction (`MediaStorageService`) — R2 for production
- [x] Moment photo display on private/public timeline cards
- [x] Responsive forms (mobile full-screen, desktop sheets)
- [x] Places / Wishlist visible in nav with Soon badge (disabled)
- [ ] Photo albums / galleries (multiple photos per moment)
- [ ] Places and wishlist backend + UX

**Success metric:** User completes one real adventure journal entirely in Memora, with photos and equipment, and publishes it publicly.

## Phase 2 — Cloud Media & Albums

**Goal:** Richer media storytelling without turning Memora into a CDN.

- Photo albums / galleries per moment or adventure
- Cloud link CRUD wired end-to-end in UI
- Provider icons and embed previews
- Attach links to moments and adventures
- Optional oEmbed metadata fetch
- Orphan file cleanup when URLs change

## Phase 3 — Map Improvements

**Goal:** Geography is part of the story.

- Moment location picker upgrades (search, reverse geocode)
- Adventure map overview from moment pins
- Day route visualization
- Public portfolio map section
- Offline-friendly map tile caching
- Saved Places feature (replace placeholder nav section)

## Phase 4 — Participants

**Goal:** Adventures are sometimes shared experiences.

- `Participant` entity and invitations
- Tag people on moments
- Shared adventures (co-owner / viewer roles)
- Privacy controls per participant visibility

## Phase 5 — Social Features

**Goal:** Discovery and inspiration without becoming a feed product.

- Follow profiles
- Activity feed of published adventures (optional, calm)
- Likes or appreciations on public moments
- Share cards (Open Graph) for adventures
- `@username` mentions in notes

## Phase 6 — Admin Panel

**Goal:** Operate Memora without SQL access.

- Reference data CRUD UI
- User moderation (disable public profile)
- Analytics dashboard (signups, published adventures)
- Role-based admin auth (`ROLE_ADMIN`)
- Audit log for admin actions

## Phase 7 — Mobile Apps

**Goal:** Native capture experience on iOS and Android.

- React Native or native clients against same API
- Offline draft moments
- Camera roll integration
- Push notifications for social phase
- App Store / Play Store release

## Non-goals (for now)

- Flight/hotel booking integration
- Expense splitting / group payments
- Real-time collaborative editing
- AI itinerary generation as core product
- Heavy Place entity creation as primary location UX
- Manual image URL paste for covers and moment photos

## How to propose roadmap changes

Open a discussion with:

1. Which phase it fits (or why it needs a new phase)
2. Emotional question it answers ([PRODUCT.md](./PRODUCT.md))
3. Impact on domain model and API stability

Prefer extending current phases over parallel unscoped work.

## Related docs

- [PRODUCT.md](./PRODUCT.md)
- [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md)
