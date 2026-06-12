# Grailed Clone — Two-Week Demo Build

A clone-then-redesign demo project based on Grailed.com, a peer-to-peer fashion resale marketplace. Built over two weeks: Week 1 reproduces the core offer flow, Week 2 introduces a net-new Buyer Offer Transparency Panel.

## Team

- **Jillian Krebsbach** 
- **Tiffany Arnold** 

## Tech Stack

- **Frontend:** Next.js, TypeScript, React Context for state management
- **Backend:** Supabase (Auth, Postgres, RLS), direct client queries — no API route handlers
- **Data:** Seeded demo data only — no live data, no real authentication beyond seeded users, no payment logic

## Golden Path (5 Screens)

1. **Login** — email/password, seeded demo credentials
2. **Browse / Feed** — item grid with brand/category filters
3. **Item Detail (PDP)** — image, measurements, price, seller, Make Offer CTA
4. **Make Offer Modal** — two-step flow (enter offer → review offer)
5. **Seller Offer Response** — inbox with Accept/Decline actions

## Scope by Week

### Week 1 — Core Marketplace Clone
- Faithful reproduction of the existing Grailed offer flow
- Make Offer modal is a two-step overlay: Step 1 (enter offer, floor validation against `min_offer_price`) → Step 2 (review, confirm, success animation)
- Seller inbox: passive offer list with Accept/Decline, instant state updates
- No Competitive/Low indicator, no price context UI — these are Week 2 additions
- All Week 2 seed fields populated now to avoid mid-build migrations

### Week 2 — Buyer Offer Transparency Panel
- Real-time Competitive/Low label on Make Offer Step 1 (replaces the floor error; non-blocking — any valid amount > $1 can be submitted)
- PDP gains a Price Context Area (lowest ask in 30 days, last sold price, acceptance rate) and an Offer Transparency Panel sidebar (competitive range bar)
- Seller inbox gains Competitive/Low tags per offer row and a watcher nudge card (`watchers_count`, suggested offer range) — informational only
- Pro/Coming Soon badges on buyer sniping threshold and seller auto-responder (static UI only)

### Cut from Scope
- Seller Profile
- Saved Searches
- Counter-offers, expiry timers, notifications, payments, real auth

## Data Model

| Table | Purpose |
|---|---|
| `profiles` | Seeded demo users — 1 buyer, 2 sellers |
| `listings` | 12–20 demo items across 3–4 brands |
| `offers` | Pre-seeded + buyer-submitted offers |
| `hero_slides` | Browse feed hero content |
| `favorites` | Favorited listings |

Key `listings` fields seeded in Week 1 for Week 2 use: `original_price`, `min_offer_price`, `competitive_range_min`, `competitive_range_max`, `last_sold_price`, `lowest_ask`, `offer_acceptance_rate`, `watchers_count`.

Key `offers` fields: `is_competitive`, `updated_at`.

> Note: `offers` has no `seller_id` column — the seller relationship is resolved via `listings` through subquery-based RLS policies.

## Endpoints / Data Access

All data access is via direct Supabase client queries (no custom API routes):

- `items` list → Browse feed
- `items/:id` + price context → PDP
- `offers?seller_id=` → Seller inbox
- Insert into `offers` → offer submission
- Update `offers.status` → Accept/Decline

## Working Patterns

- **API contract discipline:** JSON contracts agreed at the start of each day; FE uses `// TEMP STUB` and moves on after 20 minutes blocked on a BE endpoint
- **Seed data:** all Week 2 fields seeded during Week 1; one "hero item" fully populated for Week 2 offer logic demo
- **UI sourcing:** inspect element + screenshots fed into Claude Code for all components
- **Coordination:** async via calls/texts — decisions discussed in conversation before being committed to docs or code

## Demo Constraints

- Desktop and mobile responsive
- All accessibility: 4.5:1 contrast minimum, full keyboard/tab navigation, ARIA labels
- 1–2 concurrent demo users, no load testing
- Target: under 200ms per UI interaction (measured locally)

## Status

Build audit complete (see "Grailed Clone — Build Audit" Google Doc). RLS policies deployed and login/role redirects confirmed working. Schema migration (missing `listings`/`offers` columns) and seed data insertion (15 items) are complete. Pending: condition filter bug fix in `browse/page.tsx`, resolution of remaining `data.ts` mock layer references, audit of Make Offer Modal and Seller Offer Response screens.