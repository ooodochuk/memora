# Design Concepts

Ten **editorial travel-journal** directions for Memora — photo-first, magazine feel. **Comparison only**; production still uses Quiet Journal until one is chosen.

## Preview

- `/en/design-concepts`
- `/uk/design-concepts`

Each card shows a magazine-style cover, photo grid, day chapter, and palette — not a SaaS dashboard.

## Concepts

| # | ID | Name | Mode | Mood |
|---|-----|------|------|------|
| 1 | `kinfolk-light` | Kinfolk Journal | light | Soft linen, sage & clay |
| 2 | `conde-travel-light` | Condé Travel | light | Fashion magazine, black & red |
| 3 | `golden-hour-light` | Golden Hour | light | Sunset warmth, amber light |
| 4 | `gallery-white-light` | Gallery White | light | Museum catalogue, pure white |
| 5 | `postcard-vintage-light` | Vintage Postcard | light | 1950s travel posters |
| 6 | `midnight-cinema-dark` | Midnight Cinema | dark | Letterbox film stills |
| 7 | `darkroom-dark` | Darkroom | dark | Photographer safelight red |
| 8 | `noir-portfolio-dark` | Noir Portfolio | dark | B&W high contrast |
| 9 | `velvet-evening-dark` | Velvet Evening | dark | Burgundy & gold luxury |
| 10 | `aperture-dark` | Aperture | dark | Pro photo portfolio |

## Source files

| File | Purpose |
|------|---------|
| `src/lib/design-system/concepts/concepts.ts` | Full token data |
| `src/lib/design-system/concepts/concepts.css` | Scoped preview CSS |
| `src/components/design-system/design-concept-preview-card.tsx` | Editorial preview card |

## Next step

Pick 1–2 favorites → wire tokens into `globals.css` → restyle shared components with real photos.
