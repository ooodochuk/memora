# Branding

## Product name

**Memora**

- Capital M in product UI and titles
- Tagline (EN): *Travel, remembered.*
- Tagline (UK): *Пригоди, що залишаються.*

Do not abbreviate to "Mem" in user-facing copy. Code identifiers may use `memora` (lowercase).

## Voice and tone

| Attribute | Meaning in practice |
|-----------|---------------------|
| **Friendly** | Write like a thoughtful travel companion, not a corporation |
| **Minimal** | Short sentences; cut filler; one idea per line |
| **Inspirational** | Evoke curiosity and wanderlust without hype |
| **Calm** | No urgency tricks, no alarm colors for normal actions |

Avoid: "Submit", "Entity", "Record", "Sync failed", "Invalid payload".  
Prefer: "Save", "Add moment", "Could not save — try again".

## User-facing terminology

Use these words consistently in UI, marketing, and documentation aimed at users.

| Use | Meaning |
|-----|---------|
| **Adventure** | A journey or trip (one container for days and moments) |
| **Day** | One calendar day within an adventure |
| **Moment** | A single memory entry (meal, hike, photo, note, etc.) |
| **Equipment** | Gear in the user's inventory, linkable to adventures |
| **Location** | A place on the map attached to a moment |
| **Journal** | The personal, private documenting experience |
| **Portfolio** | The public profile and published adventures |
| **Cloud link** | External media URL (video, album) attached to a moment or adventure |

### Avoid in user-facing copy

| Avoid | Use instead |
|-------|-------------|
| Trip (in new UI) | Adventure — *legacy code may still say "trip"* |
| Event | Moment |
| User profile settings | Profile / Account |
| CRUD, DTO, endpoint | *(never show)* |
| Status code, 401 | Sign in again |
| Form validation error | Plain language field hint |

Internal code may use `Trip`, `TripEvent`, `Event` as legacy aliases during migration. New UI strings must say **Adventure** and **Moment**.

## Typography in brand moments

- **Display / headings:** Playfair Display (`font-heading`) — editorial, journal-like
- **UI / body:** Source Sans 3 (`font-sans`) — readable at all sizes

Do not use display fonts for buttons, labels, or dense UI.

## Visual personality

- Warm earth tones and semantic `brand` token for primary actions
- Film-grain and soft gradients on marketing hero sections sparingly
- Cards feel like journal pages — bordered, rounded, subtle shadow
- Photography always `object-cover`; never stretched

## Languages

All user-visible strings exist in **English** and **Ukrainian**. Ukrainian is a first-class locale, not an afterthought. See [LOCALIZATION.md](./LOCALIZATION.md).

## Public URLs

| URL | Purpose |
|-----|---------|
| `/` | Marketing home |
| `/profile/{username}` | Public portfolio |
| `/profile/{username}/trips/{slug}` | Public adventure |
| `/dashboard` | Private journal (authenticated) |

Legacy `/u/{username}` redirects to `/profile/{username}`.
