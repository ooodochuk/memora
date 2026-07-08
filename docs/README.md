# Memora Documentation

Memora is a premium adventure memory platform — a personal travel journal and public portfolio for documenting journeys day by day.

This `/docs` directory is the **single source of truth** for product, architecture, and development standards. Read it before implementing features or making structural changes.

## Documentation index

| Document | Purpose |
|----------|---------|
| [PRODUCT.md](./PRODUCT.md) | Vision, audience, philosophy, media & equipment rules |
| [BRANDING.md](./BRANDING.md) | Name, voice, user-facing terminology |
| [UX_GUIDELINES.md](./UX_GUIDELINES.md) | Interaction patterns and UX principles |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Visual language, `ImageUploadField`, components |
| [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) | Next.js app structure and patterns |
| [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) | Spring Boot layers, `MediaStorageService` |
| [DOMAIN_MODEL.md](./DOMAIN_MODEL.md) | Business entities and relationships |
| [REFERENCE_DATA.md](./REFERENCE_DATA.md) | Configurable lookup tables (`PHOTO_VIDEO`, etc.) |
| [API_GUIDELINES.md](./API_GUIDELINES.md) | REST API conventions, media upload |
| [DATABASE.md](./DATABASE.md) | PostgreSQL schema and migrations |
| [SECURITY.md](./SECURITY.md) | Authentication and authorization |
| [LOCALIZATION.md](./LOCALIZATION.md) | English and Ukrainian support |
| [RESPONSIVE_GUIDELINES.md](./RESPONSIVE_GUIDELINES.md) | Breakpoints and layout rules |
| [ROADMAP.md](./ROADMAP.md) | Product phases |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute code |
| [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) | Record of key technical decisions (ADR-001–024) |
| [QUALITY_AUDIT.md](./QUALITY_AUDIT.md) | Full quality audit — scores, risks, readiness |
| [QUALITY_ACTION_PLAN.md](./QUALITY_ACTION_PLAN.md) | Prioritized P0–P3 fix list |

Cursor rules in `.cursor/rules/memora-ux-architecture.mdc` complement this documentation for day-to-day UI work.

---

## Project vision

Help people preserve and share the emotional texture of their travels — not manage logistics. Memora should feel like opening a beautiful journal or photo album, not using enterprise software.

## Mission

Build a long-lived, maintainable platform where travellers can:

1. Document adventures as **days** and **moments**
2. Upload **photos** (object storage) and link **cloud media**
3. Attach optional **locations** and **equipment** from inventory
4. Publish a **public portfolio** when ready

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui, semantic design tokens |
| Client state | TanStack Query, React Hook Form, Zod |
| i18n | next-intl (English, Ukrainian) |
| Backend | Spring Boot 3.4, Java 21 |
| Database | PostgreSQL 16, Flyway |
| Auth | JWT (stateless), BCrypt passwords |
| Media | Cloudflare R2 (S3-compatible API) via `MediaStorageService` |
| API docs | springdoc-openapi (Swagger UI) |
| Containers | Docker Compose per repo (see below) |

## Repositories

Memora uses **two separate projects**:

| Repository | Path (typical) | Contents |
|------------|----------------|----------|
| **memora** | `~/memora/` | Next.js frontend, `docs/`, this documentation |
| **memora-backend** | `~/memora-backend/` | Spring Boot API, Flyway migrations, Gradle |

Keep them as **sibling directories**. The API is not nested inside the frontend project.

## Local development

### Prerequisites

- Node.js 22+
- Java 21 (for API)
- Docker (for PostgreSQL)
- Gradle wrapper in `memora-backend/`

### Environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_USE_MOCKS=false
```

For mock-only UI work without a backend:

```env
NEXT_PUBLIC_USE_MOCKS=true
```

For production-style image URLs (optional local dev):

```env
NEXT_PUBLIC_MEDIA_BASE_URL=https://your-r2-cdn.example.com
```

Backend: see `memora-backend/README.md` for JWT, CORS, and `STORAGE_PROVIDER` (default `local` for dev). Dev Postgres runs on port **5433** via `memora-backend/docker-compose.yml`.

### Start services

**Postgres + API** (from `memora-backend`):

```bash
cd ../memora-backend
docker compose up -d
./gradlew bootRun
```

**Frontend only** (from `memora`):

```bash
npm install
npm run dev
```

**Frontend Docker** (API must already run):

```bash
docker compose up --build
```

## Folder structure

```
~/projects/
├── memora/                  # Frontend repository
│   ├── docs/                # Product + architecture documentation
│   ├── messages/            # i18n JSON (en, uk)
│   ├── src/                 # Next.js App Router
│   │   ├── features/        # auth, adventures, media, equipment, …
│   │   └── components/      # design-system, dashboard, trips
│   ├── docker-compose.yml   # Frontend container only
│   └── .cursor/rules/
│
└── memora-backend/          # API repository (sibling)
    ├── src/main/java/com/memora/
    │   ├── adventure/       # Adventures + equipment links
    │   ├── day/             # Days
    │   ├── moment/          # Moments + photoUrl
    │   ├── equipment/       # Equipment inventory
    │   ├── media/           # Upload API + storage
    │   ├── auth/            # Auth
    │   ├── profile/         # Profiles
    │   ├── reference/       # Reference data
    │   ├── publicportfolio/ # Public API
    │   └── security/        # JWT
    ├── src/main/resources/db/migration/
    └── docker-compose.yml   # Postgres + API
```

App: `http://localhost:3000/en` or `http://localhost:3000/uk`

## Running the application

| Command | Description |
|---------|-------------|
| `npm run dev` | Frontend dev server (Turbopack) |
| `npm run build` | Production frontend build |
| `npm run start` | Serve production frontend |
| `npm run lint` | ESLint |
| `cd ../memora-backend && ./gradlew bootRun` | Run API |
| `cd ../memora-backend && ./gradlew test` | Backend tests |
| `docker compose up --build` | Frontend container (this repo) |
| `cd ../memora-backend && docker compose up -d` | Postgres + API |

## Deployment overview

Production deployment uses **two services**:

1. **memora-backend** — PostgreSQL + API (Railway)
2. **memora** — Next.js (Vercel)

**Backend (production media):**

```env
STORAGE_PROVIDER=r2
S3_ENDPOINT=...
S3_BUCKET=...
S3_REGION=auto
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_PUBLIC_BASE_URL=...
```

**Frontend:**

```env
NEXT_PUBLIC_API_URL=https://your-api.example/api
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_MEDIA_BASE_URL=https://your-r2-cdn.example.com
```

Set `JWT_SECRET` to at least 256 bits for HS256. Configure `CORS_ALLOWED_ORIGINS` to your frontend origin.

Flyway runs migrations automatically on backend startup. JPA `ddl-auto` is `validate` — schema changes must go through SQL migrations only.

## Key product rules (quick reference)

| Topic | Rule |
|-------|------|
| Images | Upload from device — no manual URL paste for covers/photos |
| Adventure cover | Optional; gradient placeholder when missing |
| Moment photo | One optional photo (MVP); shown on cards and public page |
| Moment type | `PHOTO_VIDEO` — not `DRONE` |
| Location | Lightweight pin on moment — not Place creation |
| Equipment | Profile inventory linked to adventures; shown public + private |
| Places / Wishlist | Nav visible, Soon badge, not shipped yet |

See [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) ADR-016–024 for rationale.
