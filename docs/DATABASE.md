# Database

## Engine

**PostgreSQL 16** — primary data store for all application state.

Local dev: Docker in **`memora-backend`** (`docker compose up -d` — Postgres on port **5433**).

## Migrations

**Flyway** — `classpath:db/migration`, `baseline-on-migrate: true`.

JPA `ddl-auto: validate` — Hibernate never auto-alters schema. **All schema changes = new SQL migration.**

### Migration history

| Version | File | Summary |
|---------|------|---------|
| V1 | `V1__initial_schema.sql` | users, profiles |
| V2 | `V2__reference_tables.sql` | Reference lookup tables |
| V3 | `V3__seed_reference_data.sql` | Bilingual reference seeds (`PHOTO_VIDEO`, not `DRONE` moment type) |
| V4 | `V4__domain_tables.sql` | adventures, days, moments, equipment, cloud_links, places |
| V5 | `V5__seed_equipment_categories.sql` | Default equipment categories (includes `DRONE` gear category) |
| V6 | `V6__adventure_type_and_tags.sql` | adventure_type, tags[] |
| V7 | `V7__reference_audit_columns.sql` | Audit columns on reference tables |
| V8 | `V8__profile_tagline.sql` | profiles.tagline |
| V9 | `V9__add_archived_adventure_status.sql` | Archived status |
| V10 | `V10__moment_photo_url.sql` | moments.photo_url |

### Naming new migrations

```
V{n}__short_description.sql
```

Never edit applied migrations in production — always add `V{n+1}`.

## UUID strategy

- Extension: `pgcrypto` (`gen_random_uuid()`)
- All primary keys: **UUID**
- JWT subject = user UUID
- Reference seeds use **fixed UUIDs** in V3/V5 for test stability

## Indexes

Add indexes in migrations for:

- Foreign keys used in joins (`owner_id`, `adventure_id`, `day_id`)
- Unique constraints: `users.email`, `profiles.username`, `adventures(slug, owner_id)` where applicable
- Lookup: `profiles.username` case-insensitive search (implementation per migration)

Review query plans when lists grow — add indexes before pagination ships.

## Relationships

Referential integrity via PostgreSQL FK constraints in Flyway SQL.

**Cascade policy:** Prefer soft ownership checks in services; explicit `ON DELETE CASCADE` only where orphan rows are impossible to recover (document in migration comments).

### Adventure equipment

`adventure_equipment` join table links `adventures` ↔ `equipment_items`. Replaced atomically on adventure update when `equipmentIds` is sent. Equipment rows are never duplicated per adventure.

## Naming conventions

| Element | Convention | Example |
|---------|------------|---------|
| Tables | snake_case plural | `adventure_equipment` |
| Columns | snake_case | `created_at`, `owner_id` |
| FK columns | `{entity}_id` | `moment_type_id` |
| Join tables | both entity names | `adventure_equipment` |
| Java entities | PascalCase singular | `AdventureEquipment` |

## Audit fields

Domain tables via `BaseEntity`:

```text
created_at TIMESTAMPTZ NOT NULL
updated_at TIMESTAMPTZ NOT NULL
created_by UUID
updated_by UUID
```

Populated by JPA auditing (`JpaAuditingConfig`, `SecurityAuditorAware`).

Reference tables gained audit columns in V7.

## Timezone

JVM and JDBC configured for **UTC**. Store instants as `timestamptz`. Display in user locale on frontend.

## JSON / arrays

- `adventures.tags` — `TEXT[]`
- Moment location stored as embedded columns / JSON per `V4` definition
- `adventures.cover_image_url`, `moments.photo_url` — `VARCHAR(2048)` public object-storage URLs

## Media storage (not in DB)

Binary files live in **object storage** (Cloudflare R2 in production). Database stores URL strings only — not BLOBs. Upload metadata `key` returned from API; optional future migration to track storage keys for cleanup.

## Future migrations

Planned schema work (see [ROADMAP.md](./ROADMAP.md)):

- Photo albums / gallery tables (multiple photos per moment)
- Participants table
- Storage key cleanup / orphan file tracking
- Social graph (follows)
- Admin audit log
- Full-text search indexes for public portfolios
- Places / wishlist domain tables when product ships

Each requires Flyway migration + entity update + API changelog.

## Backup and restore

Production: schedule `pg_dump` on volume `memora_pg_data`. Test restore procedure before relying on backups.

Object storage (R2): enable bucket versioning and lifecycle rules separately from Postgres backups.

## Related docs

- [DOMAIN_MODEL.md](./DOMAIN_MODEL.md)
- [REFERENCE_DATA.md](./REFERENCE_DATA.md)
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
