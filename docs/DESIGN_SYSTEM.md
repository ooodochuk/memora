# Design System

Memora uses **one design system** across marketing, dashboard, and public portfolio. Do not invent per-page styles.

**Stack:** Tailwind CSS 4 · shadcn/ui · `@base-ui/react` primitives · semantic CSS variables in `src/app/globals.css`

**Code locations:**

- Tokens: `src/lib/design-system/tokens.ts`
- Components: `src/components/design-system/`
- Primitives: `src/components/ui/`

## Typography

| Role | Classes | Font |
|------|---------|------|
| Page title | `text-2xl lg:text-3xl xl:text-4xl font-heading font-medium` | Playfair Display |
| Section title | `text-lg sm:text-xl font-heading font-medium` | Playfair Display |
| Body | `text-sm sm:text-base` | Source Sans 3 |
| Lead / subtitle | `text-base text-muted-foreground` | Source Sans 3 |
| Eyebrow | `text-xs uppercase tracking-widest text-primary` | Source Sans 3 |
| Meta | `text-xs text-muted-foreground` | Source Sans 3 |

Use `Heading`, `Lead`, `Eyebrow`, `MetaText` from `components/design-system/typography` — do not duplicate.

**Rule:** No decorative fonts on buttons, labels, or dense UI.

## Spacing

Use Tailwind scale only: `px-4`, `px-6`, `px-8`, `py-4`, `gap-4`, `gap-6`, `gap-8`.

Page horizontal padding: `px-5 sm:px-6 lg:px-10` (`pagePadding` token).

Section vertical rhythm: `sectionSpacing` in tokens (`sm`, `md`, `lg`).

Avoid arbitrary values like `mt-[13px]` unless fixing a one-off bug — prefer scale.

## Grid

Card grids use CSS Grid with responsive columns:

| Breakpoint | Columns |
|------------|---------|
| Default (mobile) | 1 |
| `sm` / tablet | 2 |
| `lg` / laptop | 3 |
| `xl` / desktop | 4 |

```tsx
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
```

Never hardcode fixed card widths.

## Cards

Shared patterns via `JournalCard`:

- Rounded corners (`rounded-2xl` on containers)
- `border border-border`
- `bg-card` with subtle `shadow-sm`
- Consistent padding variants: `sm`, `md`, `lg`
- Hover: subtle border or background shift — not aggressive lift

Trip/adventure cards use `TripGalleryCard` / `TripCard` with optional cover image on top. Missing cover shows gradient placeholder via `CoverImage`.

## Buttons

From `components/ui/button` variants:

| Variant | Use |
|---------|-----|
| `warm` | Primary CTA (save, create, sign up) |
| `default` | Secondary emphasis |
| `outline` | Secondary actions |
| `ghost` | Tertiary / nav |
| `destructive` | Delete confirm |

Sizes: `sm` in dense UI, `default` standard, `lg` on mobile form footers (44px+ touch).

## Forms

- `FormField` wraps label + control + hint/error
- `ResponsiveFormScreen` for full-page forms with header + sticky footer
- `react-hook-form` + `zod` resolvers in `src/lib/validations/`
- Hints only when necessary — prefer optional field labels
- Single column on mobile; `min-w-0` on grids to prevent overflow

## Image components

### `ImageUploadField`

Reusable upload control (`components/design-system/image-upload-field.tsx`):

| Feature | Behavior |
|---------|----------|
| Upload | Device file picker + drag-and-drop |
| Preview | Shows uploaded image |
| Replace / Remove | Actions without leaving form |
| States | Loading spinner, validation error, upload failure |
| Layout | Single column on mobile; preview + actions side-by-side from `md` |
| Constraints | JPEG, PNG, GIF, WebP; max 5 MB |

Used for adventure cover image and moment photo. Do not add manual URL inputs for these fields.

### `CoverImage`

Shared cover renderer with gradient placeholder fallback when `src` is missing or fails to load (`components/design-system/cover-image.tsx`). Uses `unoptimized` for Memora-hosted and object-storage URLs.

## Inputs

shadcn `Input`, `Textarea`, `Select` with full width on mobile. Time inputs for optional scheduling. Number inputs for optional distance/elevation — empty must not fail validation.

## Icons

**Lucide React** exclusively. Stroke width ~1.75 for consistency with event type icons.

Event types map to colors via `eventTypeStyles()` and CSS variables `--event-*`.

## Badges

- `StatusBadge`, `VisibilityBadge` for adventure state
- `EventTypeBadge` / `EventTypeIcon` for moment types
- `IconBadge` for feature marketing cards
- **Soon** / **Скоро** badge on disabled nav items (Places, Wishlist)

## Dark mode

- `next-themes` with default **dark**
- All colors via semantic tokens: `background`, `foreground`, `muted`, `border`, `primary`, `brand`, `destructive`
- Domain colors: `--event-*`, `--status-*` defined in `globals.css`
- Never hardcode `#000` / `#fff` in components

## Responsive containers

From `containerSizes` in tokens:

| Token | Class | Use |
|-------|-------|-----|
| `auth` | `max-w-md` | Login, register |
| `form` | `max-w-3xl` | Create/edit forms |
| `dashboard` | `max-w-screen-2xl` | Dashboard, adventure detail, lists |
| `prose` | `max-w-2xl` | Marketing copy, settings |

`PageContainer` defaults to `dashboard`. Pass `narrow` for prose width.

## Tailwind rules

- Use `cn()` from `lib/utils` for conditional classes
- Prefer semantic tokens over raw colors: `bg-background`, `text-muted-foreground`
- `object-cover` on all photos
- `unoptimized` on Next.js `Image` for Memora upload and CDN URLs (`isMemoraUploadedUrl`)
- No inline styles except dynamic map/event colors from tokens

## shadcn/ui usage

Add primitives to `components/ui/` via shadcn CLI when needed. Customize with Memora tokens — do not fork unrelated themes.

Current primitives: accordion, avatar, badge, button, card, dialog, dropdown-menu, input, label, select, separator, sheet, skeleton, tabs, textarea, tooltip.

## Component consistency checklist

Before shipping UI:

- [ ] Uses `PageContainer` or documented container width
- [ ] Uses design-system typography components
- [ ] Cards match `JournalCard` spacing
- [ ] Works in dark mode
- [ ] Strings from `messages/*.json`
- [ ] Touch targets ≥ 44px on mobile actions
- [ ] Image upload uses `ImageUploadField` — not URL paste
- [ ] No horizontal overflow at 320px
