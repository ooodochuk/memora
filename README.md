# Memora

Memora is a premium adventure memory platform — document adventures, days, moments, and equipment. Share a public portfolio when you're ready.

**Documentation:** [`docs/README.md`](./docs/README.md)

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui
- **Data:** TanStack Query, Zod, React Hook Form
- **i18n:** next-intl (English, Ukrainian)
- **API:** REST backend ([memora-backend](https://github.com/ooodochuk/memora-backend)) — Java 21, Spring Boot 3, PostgreSQL
- **Media:** Cloudflare R2 (S3-compatible) for production photos

## Local development

### Prerequisites

- Node.js 22+
- [memora-backend](https://github.com/ooodochuk/memora-backend) cloned as a sibling directory (for real API mode)

### Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

### With the real API

1. Start Postgres and the API from `memora-backend`:

```bash
cd ../memora-backend
docker compose up -d
./gradlew bootRun
```

2. Set in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_USE_MOCKS=false
```

3. Register at `/en/register`, then sign in at `/en/login`.

### Mock mode

With `NEXT_PUBLIC_USE_MOCKS=true` (default in `.env.example`), the app uses local fixture data — no backend required.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes (API mode) | Backend base URL, e.g. `http://localhost:8080/api` |
| `NEXT_PUBLIC_USE_MOCKS` | No | `true` = fixture data; `false` = HTTP API (default: `true`) |
| `NEXT_PUBLIC_MEDIA_BASE_URL` | Prod (R2) | Public CDN base URL for uploaded images (must match backend `S3_PUBLIC_BASE_URL`) |
| `NEXT_PUBLIC_MOCK_DELAY_MS` | No | Artificial delay in mock mode for loading UI tests |

Copy `.env.example` to `.env.local` for development. See `.env.production.example` for production/Docker reference values.

## Deployment notes

### Vercel / Node hosting

1. Set `NEXT_PUBLIC_API_URL` to your production API URL at **build time**.
2. Set `NEXT_PUBLIC_USE_MOCKS=false`.
3. Set `NEXT_PUBLIC_MEDIA_BASE_URL` to your R2/CDN public URL.
4. Build: `npm run build` → `npm run start`.

### Docker (frontend only)

```bash
docker compose up --build
```

Requires the API running separately (e.g. from [memora-backend](https://github.com/ooodochuk/memora-backend)). Pass `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_MEDIA_BASE_URL` as build args or in `.env` when building the image.

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api (memora-backend) |

For HTTPS, put a reverse proxy (nginx, Caddy) in front of both services.

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
```

## Documentation

Product and architecture docs live in [`docs/`](./docs/README.md) — start with [PRODUCT.md](./docs/PRODUCT.md) and [ARCHITECTURE_DECISIONS.md](./docs/ARCHITECTURE_DECISIONS.md).
