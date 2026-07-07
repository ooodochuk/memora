# Security

## Overview

Memora API uses **stateless JWT authentication** — no server-side sessions. Every protected request must include a valid Bearer token unless explicitly listed as public in `SecurityConfig`.

## Authentication flow

### Registration

`POST /api/auth/register`

1. Validate email uniqueness, username uniqueness
2. Hash password with **BCrypt** (`PasswordEncoder` bean)
3. Create `User` + `Profile`
4. Issue JWT via `JwtService.generateAccessToken(userId, email)`
5. Return token + user + profile in `AuthResponse`

### Login

`POST /api/auth/login`

1. Find user by email
2. `passwordEncoder.matches(raw, hash)`
3. Issue JWT on success; 401 on failure

### Authenticated requests

1. Client sends `Authorization: Bearer <token>`
2. `JwtAuthenticationFilter` validates signature and expiry
3. Sets `SecurityContext` principal = `UUID` userId
4. Services resolve profile via `CurrentProfileProvider`

### Frontend token storage

- Token in `localStorage` (`memora_access_token`)
- `apiClient.setAuthToken()` on login
- Cleared on logout
- Dashboard routes guarded client-side; API enforces server-side

## JWT configuration

`memora.security.jwt` in `application.yml`:

| Property | Description |
|----------|-------------|
| `secret` | HMAC key (Base64 or UTF-8 bytes) — **must be strong in production** |
| `expiration-ms` | Default 24 hours |

Library: **jjwt 0.12.x**

Claims: subject = user UUID, email claim for debugging.

## Password hashing

**BCrypt** via Spring Security `BCryptPasswordEncoder`. Never log or return password hashes.

## Authorization

### Current model: ownership

No role-based access in Phase 1. Authorization = **does this profile own the resource?**

- Adventures, equipment: `owner_id` = current profile
- Days, moments: owned through parent adventure
- Profile update: current user's profile only
- Media upload: authenticated users only; files associated via entity URLs they control

Violations → `AccessDeniedException` (403) or `ResourceNotFoundException` (404) to avoid leaking existence.

### Roles (future)

Phase 6 Admin Panel may introduce:

- `ROLE_USER` — default
- `ROLE_ADMIN` — reference data, moderation

Design services to accept role checks without rewriting ownership logic.

## Protected vs public endpoints

**Public (`permitAll`):**

- `/auth/register`, `/auth/login`
- `/public/**`
- `/reference/**` (read-only lookup)
- `/status`, `/actuator/health`, `/actuator/info`
- `/media/files/**` (local storage file serving only — not upload)
- Swagger UI paths
- `OPTIONS /**`

**Authenticated (examples):**

- `/media/upload` — image upload
- `/adventures/**`, `/moments/**`, `/equipment/**`
- All other CRUD routes

Restart backend after `SecurityConfig` changes — stale processes cause false 401 on new public paths.

## Object storage credentials

S3/R2 access keys (`S3_ACCESS_KEY`, `S3_SECRET_KEY`) are **server-side only** — never exposed to the frontend. The browser receives public CDN URLs after upload, not storage credentials.

## CORS

`CorsProperties` + `WebConfig`:

- Allowed origins from `memora.cors.allowed-origins` (env `CORS_ALLOWED_ORIGINS`)
- Credentials allowed
- Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS

Production: set exact frontend origin, not `*`.

## Error responses

401 → `RestAuthenticationEntryPoint` — JSON `UNAUTHORIZED`  
403 → `RestAccessDeniedHandler` — JSON `FORBIDDEN`

Never redirect to HTML login pages — API is JSON-only.

## Security checklist for new endpoints

- [ ] Added to `SecurityConfig` if public
- [ ] Service calls `requireOwned*` or equivalent
- [ ] No user input in raw SQL
- [ ] DTO validation with `@Valid`
- [ ] Secrets only via environment variables in production
- [ ] Integration test for auth required / public access
- [ ] Upload endpoints validate content type and size

## Related docs

- [API_GUIDELINES.md](./API_GUIDELINES.md)
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
