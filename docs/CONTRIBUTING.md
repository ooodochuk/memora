# Contributing

Thank you for helping build Memora. This project is designed to stay maintainable for years — follow these rules so every contribution fits the whole.

## Before you start

1. Read [docs/README.md](./README.md) and the doc relevant to your work
2. Read `.cursor/rules/memora-ux-architecture.mdc` for UI tasks
3. Check [ROADMAP.md](./ROADMAP.md) — align with current phase

## Code style

### TypeScript / React

- Functional components, hooks for logic
- Strict TypeScript — no `any` without comment
- `cn()` for class names
- `"use client"` only when needed
- Named exports preferred

### Java

- Java 21 features where clear
- Records for DTOs
- Lombok for entity boilerplate only
- MapStruct for entity ↔ DTO mapping
- Services own transactions and authorization

### Formatting

- Match surrounding file style
- ESLint for frontend (`npm run lint`)
- Backend: standard Java conventions, 4-space indent

## Branch naming

```
feature/short-description
fix/issue-short-description
docs/what-changed
refactor/area-name
```

Examples: `feature/public-portfolio-maps`, `fix/moment-form-validation`

## Commit messages

Imperative mood, concise, explain **why**:

```
Add public portfolio integration test

Restarting backend without SecurityConfig changes caused 401 on /public/**.
Test asserts anonymous access returns 404 not 401.
```

Avoid: `wip`, `fix stuff`, `updates`

## Pull request rules

1. **Scope:** One logical change per PR — easier review and revert
2. **Description:** What, why, how to test
3. **i18n:** Both `en.json` and `uk.json` updated for UI strings
4. **Migrations:** Flyway SQL for schema changes — never JPA auto-ddl
5. **Docs:** Update `/docs` if behavior or architecture changes
6. **No secrets:** Never commit `.env`, JWT secrets, or credentials
7. **Screenshots:** Include for UI changes (mobile + desktop if layout differs)

### PR checklist

- [ ] `npm run lint` passes
- [ ] `cd ../memora-backend && ./gradlew test` passes (when backend touched)
- [ ] `npx tsc --noEmit` passes (when frontend touched)
- [ ] Tested with `NEXT_PUBLIC_USE_MOCKS=false` against local API for API work
- [ ] Responsive check at 375px and 1280px minimum

## Architecture rules

### Frontend

- Feature code in `src/features/<name>/`
- API paths in `src/api/endpoints.ts`
- Routes in `src/constants/routes.ts`
- Validations in `src/lib/validations/`
- No direct `fetch` in components — use feature `api.ts` + hooks

### Backend

- Controller → Service → Repository
- Ownership checks in services
- Public routes explicitly in `SecurityConfig`
- Exceptions via `MemoraException` hierarchy — not raw `ResponseEntity` in controllers

### Domain language

User-facing: **Adventure, Day, Moment** ([BRANDING.md](./BRANDING.md))  
Code may retain `Trip` aliases until migration completes — do not add new user-visible "trip" strings.

## Component rules

- Reuse `components/design-system/` and `components/ui/`
- No page-specific styling that duplicates tokens
- Cards, forms, and typography from design system
- Dialogs for confirm only — create/edit use page or sheet

## Database changes

1. Create `V{n}__description.sql` in `memora-backend/src/main/resources/db/migration/`
2. Update JPA entity
3. Update DTOs and mappers
4. Document in [DATABASE.md](./DATABASE.md) migration table

## API changes

1. Update backend DTO + controller
2. Update `src/features/*/types.ts` and `api.ts`
3. Document breaking changes in PR description
4. Align with [API_GUIDELINES.md](./API_GUIDELINES.md)

## Questions

When unsure, prefer:

- Simpler UX ([UX_GUIDELINES.md](./UX_GUIDELINES.md))
- Fewer required fields
- Reference tables over enums ([REFERENCE_DATA.md](./REFERENCE_DATA.md))
- Document the decision in [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md)
