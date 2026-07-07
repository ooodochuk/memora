# Reference Data

Memora stores configurable lookup values in **database tables**, not Java enums. This allows new types, translations, and admin management without redeploying code.

## Why not Java enums?

| Enums | Reference tables |
|-------|------------------|
| Require code change + deploy for new values | Insert row + optional admin UI |
| Single language | `name_en` + `name_uk` columns |
| Hard to deactivate old values | `active` flag + `sort_order` |
| Cannot attach icons/colors per row easily | `icon`, `color` columns on some tables |

Frontend may still use TypeScript union types for compile-time safety; backend validates against DB FKs.

## Tables

| Table | Entity | Used by |
|-------|--------|---------|
| `adventure_statuses` | `AdventureStatus` | Adventure lifecycle |
| `adventure_visibilities` | `AdventureVisibility` | Public / private / unlisted |
| `day_activity_types` | `DayActivityType` | Day activity chips |
| `moment_types` | `MomentType` | Moment type picker |
| `equipment_categories` | `EquipmentCategory` | Equipment inventory |
| `cloud_link_providers` | `CloudLinkProvider` | Cloud link provider |
| `place_categories` | `PlaceCategory` | Saved places |

## Schema pattern

Reference rows typically include:

```sql
id UUID PRIMARY KEY
code VARCHAR UNIQUE NOT NULL    -- stable machine code, e.g. 'FOOD', 'IN_PROGRESS'
name_en VARCHAR NOT NULL
name_uk VARCHAR NOT NULL
active BOOLEAN DEFAULT true
sort_order INT
icon VARCHAR NULL
color VARCHAR NULL
created_at, updated_at, created_by, updated_by
```

Seeded in `V3__seed_reference_data.sql` with **fixed UUIDs** for deterministic tests.

## Java layer

Entities extend `LocalizedReferenceEntity` (or `EquipmentCategory` with extra fields).

**Repositories:** Spring Data JPA per reference type.

**API:** `ReferenceController` at `/reference/*` returns active rows:

- `GET /reference/adventure-statuses`
- `GET /reference/adventure-visibilities`
- `GET /reference/day-activity-types`
- `GET /reference/moment-types`
- `GET /reference/equipment-categories`
- `GET /reference/cloud-link-providers`

DTO: `ReferenceItemDto` (`id`, `code`, `name`, `icon`, `color`, `sortOrder`).

Name resolved by locale via `ReferenceLabels.resolveName(entity, locale)`.

## Frontend code mapping

`ReferenceCodeMapper` (backend) and feature API layers map between:

- Frontend: `published`, `public`, `hike` (lowercase, UX-friendly)
- Database: `IN_PROGRESS`, `PUBLIC`, `HIKE` (stable codes)

Never store frontend codes in FK columns — always resolve to reference row IDs on write.

## Equipment categories special case

`equipment_categories` supports:

- `is_default = true` — system categories (seeded in V5)
- `user_id` — future per-user custom categories

## Moment types (seeded codes)

`SLEEP`, `FOOD`, `HIKE`, `BIKE`, `TRANSPORT`, `PLACE_VISIT`, `PHOTO_VIDEO`, `EXPENSE`, `NOTE`, `TIP`

Align with `TRIP_EVENT_MODAL_TYPE_OPTIONS` in frontend validation.

## Adventure status codes

Includes planning, draft, in-progress (published), archived states. Public portfolio filters on **visibility PUBLIC** + **status IN_PROGRESS**.

## Future admin panel (Phase 6)

Admin UI will:

- List / edit reference rows
- Toggle `active` without deleting historical FKs
- Add translations for new languages
- Reorder via `sort_order`

Until then, new reference values ship via Flyway seed migrations or SQL scripts in controlled releases.

## Adding new reference data

1. Add Flyway migration (new rows or new table)
2. Add JPA entity + repository if new table
3. Expose via `ReferenceController` endpoint
4. Seed bilingual names
5. Update frontend types and pickers
6. Document in this file

Do not add Java enums for the same concept.

## Related docs

- [DATABASE.md](./DATABASE.md)
- [LOCALIZATION.md](./LOCALIZATION.md)
- [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md)
