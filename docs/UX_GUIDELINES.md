# UX Guidelines

Memora UX is governed by one test: **would this feel natural in Telegram, Apple Photos, or Notion?** If not, redesign.

Cursor rule: `.cursor/rules/memora-ux-architecture.mdc`

## Core principles

### Minimal friction

Ask only what is needed to save a memory. Default forms to type + title. Everything else is optional and hidden until requested.

### Story first

Screens tell a narrative: adventure overview → days → moments. Stats and metadata support the story; they never dominate.

### Photos first

Hero images, cover art, and moment photos get layout priority. Empty image states should invite adding media, not show broken placeholders.

### Everything optional

Time, location, distance, elevation, meal type, cloud links — never block save when omitted. Validation errors must be visible and in plain language.

### Progressive disclosure

Use collapsible sections ("Time and more details") for advanced fields. Do not show ten inputs on first paint.

### No unnecessary forms

Prefer inline editing, quick pickers, and dedicated screens over long wizards. One primary action per screen.

### No popup-heavy UX

**Dialogs** are for confirmations and destructive actions only — not for creating or editing adventures, days, moments, or equipment.

### Mobile first

Design for 375px width first. Touch targets ≥ 44px. Thumb-reachable primary actions.

### Native feeling

Sticky footers on forms, drawer navigation on mobile, sheets on desktop — patterns users already know from OS apps.

## When to use each pattern

### Page

Use a **full page** when:

- Browsing an adventure timeline or public portfolio
- Marketing home and feature discovery
- Authentication (login, register)
- Mobile create/edit flows (dedicated screen with back navigation)

Pages scroll naturally — no nested scroll containers inside forms.

### Side sheet

Use a **right side sheet** (desktop/tablet) when:

- Creating or editing an adventure, day, moment, or equipment item
- Quick edits without leaving context

On **mobile**, the same flow becomes a **dedicated page** — not a centered modal.

### Dialog

Use a **dialog** only when:

- Confirming delete ("Remove this moment?")
- Irreversible actions
- Short alerts that need explicit OK/Cancel

Never use dialogs for multi-field forms.

### Accordion

Use **accordions** for **days** within an adventure:

- Collapsed by default
- Header: day number, date, activity chips, moment count, expand icon
- Full width, minimal chrome
- Expanding reveals moments in chronological order

### Cards

Use **cards** for:

- Adventure summaries in lists and grids
- Equipment items
- Statistics pills
- Public trip cards on portfolios
- Moment summaries in timelines (icon + title + optional meta)

Cards share one visual system: radius, border, padding, shadow, hover. See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).

## Navigation

| Viewport | Pattern |
|----------|---------|
| Desktop | Persistent sidebar in dashboard |
| Tablet | Collapsible sidebar |
| Mobile | Drawer / hamburger menu |

Marketing site uses top header with auth-aware links (journal → profile when signed in, login/register when guest).

## Forms

- Sticky **Save** / **Add** in footer
- Cancel returns without saving
- Show validation at field level + one summary if submit blocked
- Two columns on desktop when it reduces scroll; single column on mobile

## Moments UX

- Large type icon (picker grid)
- Title required; description optional
- Location via map picker — optional
- Photos via URL or upload — optional
- Time fields in advanced section — optional

## Accessibility

- Visible focus rings
- Keyboard navigation for pickers and accordions
- `aria-label` on icon-only buttons
- Sufficient color contrast in light and dark mode

## What Memora is not

Do not introduce: data tables with 20 columns, bulk edit checkboxes, admin-style filters on consumer screens, wizard steps with "Step 3 of 7", or notification spam.
