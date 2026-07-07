# Backend Architecture

## Repository

Backend source code lives in the **`memora-backend`** repository — a sibling of this frontend project, not inside `memora/`.

```
~/memora/           # Next.js (frontend + docs)
~/memora-backend/   # Spring Boot API
```

## Overview

Memora API is a **Spring Boot 3.4** monolith (Java 21) exposing REST JSON under context path `/api`. Persistence is **PostgreSQL** via JPA; schema is managed exclusively by **Flyway**.

**Base package:** `com.memora`  
**Entry point:** `MemoraApplication.java`

## Package structure

Feature packages follow the same vertical slice:

```
com.memora.<feature>/
├── <Feature>Controller.java
├── <Feature>Service.java
├── <Feature>Repository.java
├── <Feature>.java              # JPA entity
├── <Feature>Mapper.java        # MapStruct (where used)
└── dto/                        # Request/response records
```

### Packages

| Package | Responsibility |
|---------|----------------|
| `auth` | Register, login |
| `user` | User entity |
| `profile` | Profile CRUD for current user |
| `adventure` | Adventures, dashboard, equipment links |
| `day` | Days and day activities |
| `moment` | Moments (events) |
| `equipment` | Inventory and categories |
| `media` | Cloud links, places |
| `reference` | Read-only reference data API |
| `publicportfolio` | Unauthenticated public reads |
| `security` | JWT, filters, security config |
| `config` | CORS, OpenAPI, JPA auditing |
| `common` | ApiResponse, exceptions, base entities, utilities |

## Layers

```
HTTP Request
    → Controller (@RestController, @Valid DTOs)
    → Service (@Transactional business logic)
    → Repository (Spring Data JPA)
    → PostgreSQL
```

**Controllers** are thin: validate input, call service, wrap in `ApiResponse.of(...)`.

**Services** enforce ownership via `CurrentUserProvider` / `CurrentProfileProvider` and `requireOwned*` helpers.

**Repositories** are Spring Data interfaces — query methods and `@Query` where needed.

## DTOs

Request/response types are **Java records** in `dto/` subpackages:

- `CreateAdventureRequest`, `UpdateAdventureRequest`
- `CreateMomentRequest`, `MomentDto`
- etc.

Validation: Jakarta Bean Validation (`@NotBlank`, `@Size`, `@Valid` on controller parameters).

API JSON uses **camelCase** field names matching frontend TypeScript types.

## MapStruct

MapStruct generates mappers (e.g. `AdventureMapper`, `MomentMapper`, `ProfileMapper`) at compile time with `componentModel = spring`. Mappers convert entities → DTOs and apply reference code formatting.

## Reference data integration

Domain entities FK to reference tables (`AdventureStatus`, `MomentType`, …), not Java enums. `ReferenceCodeMapper` bridges frontend lowercase codes (`published`) to DB codes (`IN_PROGRESS`, `PUBLIC`, etc.).

See [REFERENCE_DATA.md](./REFERENCE_DATA.md).

## Authentication

Stateless JWT — see [SECURITY.md](./SECURITY.md).

- `JwtAuthenticationFilter` sets principal = `UUID` userId
- `CurrentUserProvider.getCurrentUserId()` in services
- `CurrentProfileProvider` resolves profile for adventure ownership

## Exception handling

`GlobalExceptionHandler` (`@RestControllerAdvice`) maps exceptions to `ErrorResponse` JSON.

| Exception | HTTP | Code |
|-----------|------|------|
| `ResourceNotFoundException` | 404 | `RESOURCE_NOT_FOUND` |
| `UnauthorizedException` | 401 | `UNAUTHORIZED` |
| `AccessDeniedException` | 403 | `FORBIDDEN` |
| `ConflictException` | 409 | `EMAIL_TAKEN`, etc. |
| `MethodArgumentNotValidException` | 400 | `VALIDATION_ERROR` + fieldErrors |
| `MemoraException` | varies | custom code |
| Other | 500 | `INTERNAL_ERROR` |

## Transactions

`@Transactional` on service methods. Read-only for queries. Writes default to read-write. No `open-in-view` — lazy loading outside transactions is avoided.

## API documentation

springdoc-openapi 2.x:

- OpenAPI JSON: `/api/v3/api-docs`
- Swagger UI: `/api/swagger-ui.html`
- Bearer JWT security scheme configured in `OpenApiConfig`

## Configuration

| File | Purpose |
|------|---------|
| `application.yml` | Defaults (port 8080, context `/api`, JWT, CORS) |
| `application-dev.yml` | Postgres on 5433, SQL logging |

Environment variables for Docker: `SPRING_DATASOURCE_*`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`.

## Testing

- JUnit 5 + Spring Boot Test
- `MockMvc` integration tests with **Testcontainers** PostgreSQL
- Tests in `src/test/java/com/memora/`

## Related docs

- [API_GUIDELINES.md](./API_GUIDELINES.md)
- [DATABASE.md](./DATABASE.md)
- [DOMAIN_MODEL.md](./DOMAIN_MODEL.md)
