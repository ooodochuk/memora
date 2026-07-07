# Domain Model

Memora's domain centers on **one profile** owning **adventures**, each composed of **days** and **moments**, with optional **equipment** and **media** attachments.

> **Naming note:** Backend entities use `Adventure`, `Day`, `Moment`. Frontend TypeScript still uses legacy aliases `Trip`, `TripDay`, `TripEvent` in places — UI copy must say Adventure / Moment per [BRANDING.md](./BRANDING.md).

## Entity relationship diagram

```
User (1) ── (1) Profile
                    │
                    ├──< Adventure >── AdventureStatus
                    │         │       AdventureVisibility
                    │         │
                    │         ├──< Day >──< DayActivity >── DayActivityType
                    │         │
                    │         ├──< Moment >── MomentType
                    │         │      └── (optional) location lat/lng/name
                    │         │
                    │         ├──< CloudLink >── CloudLinkProvider
                    │         │      └── (optional) Moment
                    │         │
                    │         ├──< Place >── PlaceCategory
                    │         │
                    │         └──< AdventureEquipment >──> EquipmentItem
                    │
                    └──< EquipmentItem >── EquipmentCategory
```

## Entities

### User

**Table:** `users`  
**Why:** Authentication identity (email + password hash). Separated from public-facing profile so credentials can change without affecting portfolio URLs.

| Field | Notes |
|-------|-------|
| id | UUID |
| email | Unique login |
| passwordHash | BCrypt |

### Profile

**Table:** `profiles`  
**Why:** Public persona — username, display name, bio, tagline, avatar, cover. One profile per user. Username drives `/profile/{username}`.

| Field | Notes |
|-------|-------|
| userId | FK → users (1:1) |
| username | Unique, case-insensitive lookup |
| displayName, bio, tagline | Portfolio copy |
| avatarUrl, coverUrl | Image URLs |
| location, website | Optional public meta |

### Adventure

**Table:** `adventures`  
**Why:** The container for a journey — title, dates, country, cover, status, visibility. This is what users call a "trip" in conversation.

| Field | Notes |
|-------|-------|
| ownerId | FK → profiles |
| slug | URL segment for public pages |
| statusId | FK → adventure_statuses |
| visibilityId | FK → adventure_visibilities |
| adventureType | String (e.g. `MIXED`) |
| tags | Text array |

Public portfolio shows adventures where visibility = `PUBLIC` and status = `IN_PROGRESS` (published).

### Day (AdventureDay)

**Table:** `days`  
**Why:** Journal structure — one row per calendar day in an adventure. Holds day number, date, title, summary, and activity type chips.

| Field | Notes |
|-------|-------|
| adventureId | FK |
| dayNumber | Order within adventure |
| date | Calendar date |

**DayActivity** (`day_activities`): many-to-many link between a day and `day_activity_types` (hiking, cycling, etc.).

### Moment

**Table:** `moments`  
**Why:** Atomic memory — the primary content unit. A meal, hike segment, photo note, expense, tip, etc.

| Field | Notes |
|-------|-------|
| adventureId, dayId | FKs |
| momentTypeId | FK → moment_types |
| title | Required |
| description | Optional notes |
| startTime, endTime | Optional `LocalTime` |
| sortOrder | Timeline ordering |
| distanceKm, elevationGainM | Optional metrics |
| location | Embedded lat/lng/name (JSON or columns per schema) |

Photos are referenced by ID lists in DTOs; blob storage is a future concern. Cloud links attach separately.

### MomentLocation

Not a separate table today — location is embedded on `Moment` as `MomentLocationDto` (name, latitude, longitude). **Why:** A moment happens somewhere specific; location is optional metadata on the memory, not a global place catalog entry (though `Place` exists for saved locations).

### Equipment

**Table:** `equipment_items`  
**Why:** Personal gear inventory — tents, bikes, cameras — reusable across adventures.

| Field | Notes |
|-------|-------|
| ownerId | FK → profiles |
| categoryId | FK → equipment_categories |
| name, notes, active | Inventory fields |

### EquipmentCategory

**Table:** `equipment_categories`  
**Why:** Classify gear. System defaults (`is_default=true`) plus future per-user categories.

### AdventureEquipment

**Table:** `adventure_equipment`  
**Why:** Join table — which gear was brought on which adventure. Many-to-many with optional link metadata.

### Participant

**Not yet implemented** as a first-class entity. `participantIds` exist on moment DTOs as placeholders for Phase 4 (Participants). Today moments store empty participant lists.

### CloudLink

**Table:** `cloud_links`  
**Why:** Large media (YouTube, Google Drive, etc.) stays in the cloud — Memora stores URL + provider + title, not multi-GB files.

| Field | Notes |
|-------|-------|
| adventureId | Required parent |
| momentId | Optional attachment to one moment |
| providerId | FK → cloud_link_providers |

### Place

**Table:** `places`  
**Why:** Saved locations within an adventure context (wishlist / map features evolving). Linked to `place_categories`.

### ReferenceData

Not one entity — see [REFERENCE_DATA.md](./REFERENCE_DATA.md). Lookup tables: statuses, visibilities, moment types, day activity types, equipment categories, cloud providers, place categories.

## Base entity audit fields

All domain entities extend `BaseEntity`:

- `id` (UUID, generated)
- `createdAt`, `updatedAt` (instant, UTC)
- `createdBy`, `updatedBy` (UUID, JPA auditing)

Reference tables use similar audit columns after migration V7.

## Ownership rules

- A profile owns adventures and equipment
- All mutations verify the current user's profile matches `ownerId`
- Public reads use `PublicPortfolioService` with visibility/status filters — no auth required

## Related docs

- [REFERENCE_DATA.md](./REFERENCE_DATA.md)
- [DATABASE.md](./DATABASE.md)
- [API_GUIDELINES.md](./API_GUIDELINES.md)
