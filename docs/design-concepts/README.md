# Design Concepts

Ten visual redesign directions for Memora — **comparison only**. The production app still uses the current **Quiet Journal** theme until one direction is chosen and wired in.

## Preview

Open in the browser:

- English: `/en/design-concepts`
- Ukrainian: `/uk/design-concepts`

Each card shows a mini homepage + dashboard mockup, color swatches, buttons, inputs, and status colors for that concept.

## Concepts

| # | ID | Name | Mode |
|---|-----|------|------|
| 1 | `scandinavian-light` | Clean Scandinavian | light |
| 2 | `apple-minimal-light` | Apple-like Minimal | light |
| 3 | `glass-light` | Modern Glassmorphism | light |
| 4 | `premium-banking-light` | Premium Banking | light |
| 5 | `soft-saas-light` | Soft Neutral SaaS | light |
| 6 | `github-dark` | GitHub-inspired Dark | dark |
| 7 | `linear-vercel-dark` | Linear / Vercel Style | dark |
| 8 | `material3-modern` | Material 3 Modern | light |
| 9 | `enterprise-professional-light` | Enterprise Professional | light |
| 10 | `luxury-dark` | Luxury Dark | dark |

## Source files

| File | Purpose |
|------|---------|
| `src/lib/design-system/concepts/types.ts` | TypeScript interfaces |
| `src/lib/design-system/concepts/concepts.ts` | Full token data for all 10 concepts |
| `src/lib/design-system/concepts/css-variables.ts` | Helpers to emit CSS custom properties |
| `src/lib/design-system/concepts/concepts.css` | Scoped preview CSS (`[data-design-concept="…"]`) |
| `src/components/design-system/design-concept-preview-card.tsx` | Preview card component |
| `src/app/[locale]/(marketing)/design-concepts/page.tsx` | Comparison page |

## Token structure (per concept)

Each concept defines:

- **Colors** — primary, secondary, accent, background, surface, foreground, border
- **Typography** — heading/body fonts, h1–h3, body, label sizes
- **Radius** — sm, md, lg, pill
- **Shadows** — sm, md, lg
- **Components** — buttons, forms, cards, tables, navigation, icons
- **Status** — success, warning, error, info
- **Charts** — style notes
- **Spacing** — 4- or 8-point grid values
- **Motion** — duration, easing, interaction style

## Next step (after choosing one)

1. Map concept tokens to shadcn semantic vars in `globals.css` (`--background`, `--primary`, etc.).
2. Update font loading in the root layout if new typefaces are needed.
3. Adjust shared components (`JournalCard`, `FormField`, nav) to match the chosen personality.
4. Remove or hide the comparison page if no longer needed.

## Usage in code

```ts
import {
  designConcepts,
  getDesignConceptById,
  conceptToCssProperties,
} from "@/lib/design-system/concepts";

const concept = getDesignConceptById("scandinavian-light");
const cssVars = conceptToCssProperties(concept!);
```

Preview scope in markup:

```html
<div data-design-concept="scandinavian-light">
  <div class="concept-preview-root">…</div>
</div>
```
