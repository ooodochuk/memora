# Roadmap

Phases are sequential themes — not fixed dates. Ship each phase completely enough to be useful before expanding scope.

## Phase 1 — Personal Adventure Journal ✅ (current)

**Goal:** One person can document adventures privately.

- [x] Auth (register, login, JWT)
- [x] Profile (display name, username, bio, tagline)
- [x] Adventures CRUD (status, visibility, cover, dates)
- [x] Days CRUD with activity types
- [x] Moments CRUD (types, optional time/location/metrics)
- [x] Equipment inventory + link to adventures
- [x] Dashboard home with stats
- [x] Public portfolio (`/profile/{username}`)
- [x] English + Ukrainian
- [ ] Side sheets for desktop create/edit (UX migration)
- [ ] Photo storage backend (currently URLs / local preview)
- [ ] Places and wishlist backend

**Success metric:** User completes one real adventure journal entirely in Memora.

## Phase 2 — Cloud Media

**Goal:** Large videos and albums live in the cloud; Memora links to them elegantly.

- Cloud link CRUD wired end-to-end in UI
- Provider icons and embed previews
- Attach links to moments and adventures
- Optional oEmbed metadata fetch
- Future: direct upload to object storage (S3/R2) for photos

## Phase 3 — Map Improvements

**Goal:** Geography is part of the story.

- Moment location picker upgrades (search, reverse geocode)
- Adventure map overview from moment pins
- Day route visualization
- Public portfolio map section
- Offline-friendly map tile caching

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

## How to propose roadmap changes

Open a discussion with:

1. Which phase it fits (or why it needs a new phase)
2. Emotional question it answers ([PRODUCT.md](./PRODUCT.md))
3. Impact on domain model and API stability

Prefer extending current phases over parallel unscoped work.

## Related docs

- [PRODUCT.md](./PRODUCT.md)
- [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md)
