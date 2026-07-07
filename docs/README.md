# Memora Documentation

Memora is a premium adventure memory platform — a personal travel journal and public portfolio for documenting journeys day by day.

This `/docs` directory is the **single source of truth** for product, architecture, and development standards. Read it before implementing features or making structural changes.

## Documentation index

| Document | Purpose |
|----------|---------|
| [PRODUCT.md](./PRODUCT.md) | Vision, audience, philosophy |
| [BRANDING.md](./BRANDING.md) | Name, voice, user-facing terminology |
| [UX_GUIDELINES.md](./UX_GUIDELINES.md) | Interaction patterns and UX principles |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Visual language, components, tokens |
| [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) | Next.js app structure and patterns |
| [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) | Spring Boot layers and conventions |
| [DOMAIN_MODEL.md](./DOMAIN_MODEL.md) | Business entities and relationships |
| [REFERENCE_DATA.md](./REFERENCE_DATA.md) | Configurable lookup tables |
| [API_GUIDELINES.md](./API_GUIDELINES.md) | REST API conventions |
| [DATABASE.md](./DATABASE.md) | PostgreSQL schema and migrations |
| [SECURITY.md](./SECURITY.md) | Authentication and authorization |
| [LOCALIZATION.md](./LOCALIZATION.md) | English and Ukrainian support |
| [RESPONSIVE_GUIDELINES.md](./RESPONSIVE_GUIDELINES.md) | Breakpoints and layout rules |
| [ROADMAP.md](./ROADMAP.md) | Product phases |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute code |
| [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) | Record of key technical decisions |

Cursor rules in `.cursor/rules/memora-ux-architecture.mdc` complement this documentation for day-to-day UI work.

---

## Project vision

Help people preserve and share the emotional texture of their travels — not manage logistics. Memora should feel like opening a beautiful journal or photo album, not using enterprise software.

## Mission

Build a long-lived, maintainable platform where travellers can:

1. Document adventures as **days** and **moments**
2. Attach **photos**, **locations**, and **cloud media**
3. Curate **equipment** they used
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

Backend JWT and CORS: `memora-backend/src/main/resources/application.yml`. Dev Postgres runs on port **5433** via `memora-backend/docker-compose.yml`.

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
│   ├── docker-compose.yml   # Frontend container only
│   └── .cursor/rules/
│
└── memora-backend/          # API repository (sibling)
    ├── src/main/java/com/memora/
    │   ├── adventure/       # Adventures
    │   ├── day/             # Days
    │   ├── moment/          # Moments
    │   ├── equipment/       # Equipment
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

Production deployment uses **two Docker images**:

1. **memora-backend** — PostgreSQL volume + API (port 8080)
2. **memora** — Next.js standalone (port 3000)

Set `JWT_SECRET` to at least 256 bits for HS256 in production. Configure `CORS_ALLOWED_ORIGINS` to your frontend origin.

Flyway runs migrations automatically on backend startup. JPA `ddl-auto` is `validate` — schema changes must go through SQL migrations only.
