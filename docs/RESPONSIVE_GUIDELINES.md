# Responsive Guidelines

Mobile first. Memora must feel native on a phone and use desktop space intentionally — never a stretched phone layout.

Cursor rule: `.cursor/rules/memora-ux-architecture.mdc`

## Supported breakpoints

Design and QA at these viewport widths (CSS pixels):

| Width | Typical device |
|-------|----------------|
| 320 | Small phone (SE) |
| 375 | iPhone standard |
| 390 | iPhone 14/15 |
| 430 | iPhone Pro Max |
| 768 | Tablet portrait |
| 820 | iPad Air |
| 1024 | Tablet landscape / small laptop |
| 1280 | Laptop |
| 1440 | Desktop |
| 1728 | MacBook Pro 16" |
| 1920 | Full HD monitor |

Tailwind defaults: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536.

## Container sizes

| Purpose | Max width | Token |
|---------|-----------|-------|
| Authentication | `max-w-md` | `auth` |
| Forms | `max-w-3xl` | `form` |
| Dashboard, adventure detail, lists | `max-w-screen-2xl` | `dashboard` |
| Marketing prose | `max-w-2xl` | `prose` |

**Never** center a tiny column on a 1920px monitor for primary content. Use full container width with comfortable padding.

`PageContainer` — `src/components/design-system/page-container.tsx`

## Grid system

```tsx
grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```

| Viewport | Columns |
|----------|---------|
| Mobile | 1 |
| Tablet (`sm`+) | 2 |
| Laptop (`lg`+) | 3 |
| Desktop (`xl`+) | 4 |

Cards use `auto-rows-fr` for equal height rows.

## Navigation

| Viewport | Dashboard | Marketing |
|----------|-----------|-----------|
| Mobile | Drawer menu | Hamburger sheet |
| Tablet | Collapsible sidebar | Top nav |
| Desktop | Persistent sidebar | Top nav + inline links |

Touch targets: minimum **44×44px** for icon buttons and primary actions.

## Forms

| Viewport | Layout |
|----------|--------|
| Mobile | Single column, sticky footer (Save/Cancel) |
| Desktop | Two columns when it reduces scrolling |

No inner scroll traps — page scrolls as one surface (`ResponsiveFormScreen`).

## Desktop

- Sidebar + content area within `max-w-screen-2xl`
- Side sheets for create/edit (planned migration from full pages on large screens)
- Stats row: horizontal flex, equal-width pills

## Tablet

- Collapsible sidebar or icon rail
- Grids at 2 columns
- Forms may use two columns at `lg`

## Mobile

- Single column everything
- Dedicated screens for create/edit (not modals)
- Large footer buttons (`h-12` minimum)
- Reduce typography one step — `text-2xl` titles, not `text-4xl`

## Large monitors

- Content caps at `screen-2xl` — margins breathe on sides
- Do not float tiny cards in vast empty space — use grid density
- Public portfolio: prose-width for reading; adventure grids fill container

## No wasted whitespace

Common failures to fix in QA:

- Huge hero void without cover image
- Stats bar floating far from profile header
- Single narrow column on 1440px dashboard
- Broken grid leaving one orphan card per row

## Images

- `object-cover` always
- Hero: `min-h` with gradient fallback when no cover
- Card covers: consistent aspect ratio (`aspect-video` or gallery card standard)

## QA checklist

Before merging UI:

- [ ] No horizontal overflow at 320px
- [ ] Tap targets pass 44px rule
- [ ] Grid columns match breakpoint table
- [ ] Container token matches page type
- [ ] Dark mode readable
- [ ] Both `en` and `uk` string lengths fit (Ukrainian often longer)

## Related docs

- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
- [UX_GUIDELINES.md](./UX_GUIDELINES.md)
