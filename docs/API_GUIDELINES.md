# API Guidelines

Base URL: `http://localhost:8080/api` (production: your API host + `/api`)

All authenticated requests: `Authorization: Bearer <jwt>`

OpenAPI: `/api/swagger-ui.html`

## Versioning

Current API is **unversioned v0** — all paths are stable under `/api`. Breaking changes require migration notes in CHANGELOG and coordinated frontend updates.

Future: prefix `/api/v1/` when external clients exist. Until then, maintain backward compatibility within the monorepo.

## Response envelope

### Success

```json
{
  "data": { }
}
```

Wrapper: `ApiResponse<T>` — `@JsonInclude(NON_NULL)` omits null fields.

List endpoints return `{ "data": [ ... ] }`. No pagination wrapper yet — lists are owner-scoped and expected to remain moderate size; pagination is a future addition.

### Error

```json
{
  "message": "Human-readable summary",
  "code": "RESOURCE_NOT_FOUND",
  "status": 404,
  "timestamp": "2026-07-06T12:00:00Z",
  "path": "/api/adventures/...",
  "fieldErrors": [
    { "field": "title", "message": "must not be blank" }
  ]
}
```

`ErrorResponse` record — see `GlobalExceptionHandler`.

## DTO naming

| Suffix | Use |
|--------|-----|
| `*Dto` | Response bodies |
| `Create*Request` | POST bodies |
| `Update*Request` | PATCH bodies (partial) |
| `*Response` | Composite auth responses (`AuthResponse`, `MeResponse`) |

Java records, camelCase JSON properties.

## Request naming conventions

- Nouns for resources: `/adventures`, `/moments`, `/equipment`
- Nested where ownership is clear: `/adventures/{id}/days`, `/days/{id}/moments`
- Actions as sub-resources when needed: `/adventures/dashboard`, `/adventures/summaries`
- Public reads under `/public/**` — no auth

## HTTP methods

| Method | Use |
|--------|-----|
| GET | Read |
| POST | Create (returns 201 + body) |
| PATCH | Partial update |
| DELETE | Remove (204 No Content) |
| OPTIONS | CORS preflight (permitted all) |

PUT is avoided — prefer PATCH for updates.

## HTTP status codes

| Code | When |
|------|------|
| 200 | Successful GET/PATCH |
| 201 | Successful POST create |
| 204 | Successful DELETE |
| 400 | Validation failure, bad request (`VALIDATION_ERROR`, `MemoraException`) |
| 401 | Missing/invalid JWT (`UNAUTHORIZED`) |
| 403 | Authenticated but not allowed (`FORBIDDEN`) |
| 404 | Resource not found (`RESOURCE_NOT_FOUND`) |
| 409 | Conflict — duplicate email/username (`EMAIL_TAKEN`, `USERNAME_TAKEN`) |
| 500 | Unexpected server error (`INTERNAL_ERROR`) |

Frontend `ApiError` parses these for user messaging.

## Validation

- Jakarta validation on request DTOs (`@NotBlank`, `@Size`, …)
- Controller: `@Valid @RequestBody`
- Failures → 400 with `fieldErrors` array
- Business rules in services → `MemoraException` or `ConflictException`

## Pagination, sorting, filtering

**Not implemented globally yet.** Adventure lists return all owned items for the current profile.

**Planned pattern:**

```
GET /adventures?page=0&size=20&sort=startDate,desc&status=IN_PROGRESS
```

Response:

```json
{
  "data": [ ],
  "page": 0,
  "size": 20,
  "totalElements": 42,
  "totalPages": 3
}
```

Until then, do not assume pagination fields exist.

## Authentication endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| GET | `/me` | Required |
| PATCH | `/me/profile` | Required |

Register/login return `{ data: { accessToken, user, profile } }`.

## Media upload

| Method | Path | Auth | Body |
|--------|------|------|------|
| POST | `/media/upload` | **Required** | `multipart/form-data`, field `file` |

Constraints: image content types only (JPEG, PNG, GIF, WebP, SVG); max 5 MB.

Response `201`:

```json
{
  "data": {
    "url": "https://media.example.com/images/uuid.jpg",
    "key": "images/uuid.jpg",
    "fileName": "uuid.jpg",
    "contentType": "image/jpeg",
    "size": 123456
  }
}
```

Store `url` on `Adventure.coverImageUrl` or `Moment.photoUrl`. Do not expose upload as a manual URL paste flow in the UI.

Local dev only: `GET /api/media/files/**` serves uploaded files when `STORAGE_PROVIDER=local`. Disabled when using R2/S3.

## Adventure endpoints (equipment)

Create and update adventures accept optional `equipmentIds: string[]`:

- **Create:** links equipment after adventure insert (same transaction)
- **Update:** `equipmentIds` present → replace all links; `null` → leave unchanged; `[]` → clear all

Equipment must belong to the adventure owner.

Separate attach/detach endpoints on `/adventures/{id}/equipment` remain for inline management on the adventure detail page.

## Moment endpoints (photo)

Create/update moments accept optional `photoUrl` (string, max 2048). Update supports `clearPhoto: true` to remove.

One photo per moment for MVP — no gallery array on the API.

## Public endpoints

| Method | Path |
|--------|------|
| GET | `/public/profiles/{username}` |
| GET | `/public/profiles/{username}/adventures/{slug}` |
| GET | `/status` |
| GET | `/reference/*` |
| GET | `/actuator/health` |
| GET | `/media/files/**` | Local storage only |

Configured in `SecurityConfig` as `permitAll` (upload requires auth).

Public adventure detail returns: adventure, days, moments (with `photoUrl`), equipment, cloud links.

## Reference data endpoints

Read-only, locale via `Accept-Language` or query param per `ReferenceService` implementation.

## Swagger / OpenAPI

- Document all controllers with `@Operation` summaries where present
- Bearer auth scheme for try-it-out
- Keep swagger UI enabled in dev/staging; restrict in production if needed

## Frontend client rules

1. Use `endpoints.ts` — never hardcode paths in components
2. Unwrap `response.data` in feature `api.ts`
3. Throw `ApiError` on `!response.ok`
4. Map error `code` to translated user strings in UI layer
5. Use `apiClient.upload()` for `FormData` — not JSON

## Related docs

- [SECURITY.md](./SECURITY.md)
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)
