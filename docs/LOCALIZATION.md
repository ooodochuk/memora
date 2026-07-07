# Localization

Memora ships in **English** and **Ukrainian** as equal first-class locales.

## Supported languages

| Code | Language | Default |
|------|----------|---------|
| `en` | English | Yes (default) |
| `uk` | Ukrainian | No |

Configured in `src/constants/index.ts` → `LOCALES`, `DEFAULT_LOCALE`.

URLs always include locale: `/en/dashboard`, `/uk/profile/username`.

## Frontend localization

### Stack

- **next-intl** v4
- Message files: `messages/en.json`, `messages/uk.json`
- Routing: `src/i18n/routing.ts` — `localePrefix: "always"`
- Middleware: `src/middleware.ts` matcher `/(en|uk)/:path*`

### Rules

1. **No hardcoded UI strings** in components — use `useTranslations` (client) or `getTranslations` (server)
2. Namespace by feature: `dashboard.tripEventModal`, `publicProfile`, `auth`, etc.
3. Add keys to **both** `en.json` and `uk.json` in the same PR
4. Use ICU plurals where counts appear: `{count, plural, one {# day} other {# days}}`
5. Metadata titles via `lib/i18n/page-metadata.ts` helpers

### Navigation

Always import from `@/i18n/navigation`:

```tsx
import { Link, redirect, useRouter } from "@/i18n/navigation";
```

Paths in `routes.ts` are locale-relative.

### Locale switcher

`LocaleSwitcher` in site header — preserves current path when switching language.

## Translation keys

Organize JSON hierarchically:

```json
{
  "dashboard": {
    "pages": {
      "tripDetail": {
        "actions": {
          "addEvent": "Add moment"
        }
      }
    }
  }
}
```

Access: `t("dashboard.pages.tripDetail.actions.addEvent")`.

Prefer descriptive key paths over generic `label1`.

## Reference data localization

Backend reference tables store **`name_en`** and **`name_uk`** per row.

API resolves display name via `ReferenceLabels.resolveName(entity, locale)` based on `Accept-Language` or service locale parameter.

Frontend maps stable **`code`** (e.g. `FOOD`) to icons/colors; display name comes from API reference fetch.

Do not duplicate reference labels in JSON message files — single source in database seeds.

## User-generated content

Adventure titles, moment notes, bios — **not translated** by the system. They remain in the language the user wrote.

## Date and number formatting

Use `Intl` APIs or next-intl formatters with active locale. Stats show localized number grouping (`toLocaleString()`).

## Adding a new language (future)

1. Add locale code to `LOCALES`
2. Create `messages/{code}.json`
3. Add reference column or translation table migration
4. Update middleware matcher
5. QA all routes and plural rules

## Related docs

- [BRANDING.md](./BRANDING.md)
- [REFERENCE_DATA.md](./REFERENCE_DATA.md)
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)
