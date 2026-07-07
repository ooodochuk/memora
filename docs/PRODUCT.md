# Product

## What is Memora?

Memora is an **adventure memory platform** — a personal journal for documenting trips as stories, not spreadsheets.

Users organize life around **adventures** (journeys), break them into **days**, and capture **moments** (meals, hikes, photos, notes, places). They can attach locations, photos, cloud video links, and equipment. When ready, they publish a **public portfolio** — a traveller profile others can browse without logging in.

Memora is **not** a travel management application. It does not optimize itineraries, manage bookings, or replace TripIt, Google Maps, or a CRM. It is where memories live after (or during) the journey.

## Target audience

**Primary:** Active travellers who document trips for themselves — hikers, bikepackers, road trippers, slow travellers, digital nomads who care about narrative and visuals.

**Secondary:** Friends and followers who read public portfolios — inspiration, not collaboration tools.

**Not targeting (today):** Travel agencies, tour operators, corporate travel desks, or teams needing workflow automation.

## Product philosophy

### Story first

The unit of meaning is the **day** and the **moment**, not database rows. UI should read like a journal entry, not a form submission.

### Photos first

Images carry emotion. Layouts should privilege photography and cover art. Text supports visuals, not the reverse.

### Everything optional

Except a title and type, almost nothing is required. Time, location, distance, elevation, meal type — all optional. Lower friction means more memories captured.

### Progressive disclosure

Show the minimum first. Advanced fields (time, distance, cloud links) live behind expandable sections — never overwhelm on first open.

### Calm and premium

The product should feel like Apple Photos or a well-designed notebook app — not a noisy admin panel. No popup-heavy UX, no modal mazes for creating content.

### Mobile first

Most memories are captured on a phone. Desktop is for editing, browsing archives, and enjoying wider layouts — not a different product.

## Long-term vision

Memora becomes the default **personal travel archive** people are proud to share:

- A private journal that grows with every trip
- A public face (`/profile/{username}`) that showcases published adventures
- Cloud-native media (large videos via links, not uploads-only)
- Maps that show where life happened, attached to moments
- Optional social layer (follow, discover) without turning into a feed-first network
- Native mobile apps that feel as polished as the web experience
- Admin tools to manage reference data and moderate public content

## Core principles

1. **Memories over metrics** — stats support the story; they are not the product.
2. **Ownership** — users own their data; adventures belong to one profile.
3. **Publish intentionally** — visibility is explicit (`public` / `private` / `unlisted`).
4. **Stable vocabulary** — Adventure, Day, Moment everywhere (see [BRANDING.md](./BRANDING.md)).
5. **Configurable, not hardcoded** — statuses, types, and categories live in reference tables (see [REFERENCE_DATA.md](./REFERENCE_DATA.md)).
6. **API-first** — the web app is one client; the backend is the long-lived core.
7. **Maintain for years** — documentation, migrations, and conventions matter as much as features.

## Emotional question per screen

| Screen | Question |
|--------|----------|
| Home | Where have I been? |
| Adventure | What happened on this journey? |
| Day | How did this day unfold? |
| Profile | Who am I as a traveller? |

If a feature does not help answer one of these, reconsider it.
