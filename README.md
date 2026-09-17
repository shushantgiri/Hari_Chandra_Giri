# Hari Chandra Giri — Official Athlete Website

A premium, editorial website for Nepalese hand-walking athlete and
seven-time Guinness World Records holder Hari Chandra Giri. Built with
Next.js (App Router), React, TypeScript, Tailwind CSS v4 and Motion
(Framer Motion).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build
npm run start   # serve the production build
```

## Admin system

There's now a mobile-first admin PWA at `/control-center` for managing the
site's content (records, photos, messages) without touching code — see
**[ADMIN-SETUP.md](./ADMIN-SETUP.md)** for what's built, what isn't, and how
to connect it to a real Supabase project.

## What's real, and what's a placeholder

Every fact on this site — all seven records, dates, locations, and the
Nepal Army affiliation — is sourced from Guinness World Records' own
published record pages and news desk, plus wire coverage. Sources are the
`officialUrl` on each record in `lib/records.ts`, and `lib/press.ts`.

**Nothing else is invented.** Specifically, no real image files, video
files, certificate scans, social media links, or upcoming-event countdown
are included, because none were supplied. Instead:

- Every photo is a generated placeholder (warm gradient + grain + a small
  corner caption describing what should go there) — see
  `components/ui/PlaceholderImage.tsx` and the `README.md` in
  `/public/images`, `/public/videos`, `/public/certificates`.
- The footer's social links array is empty on purpose — nothing renders
  until you add verified profile URLs (`components/footer/Footer.tsx`).
- The "What's Next" section reads "More records are still ahead" because
  no future record attempt has been officially announced. Update
  `components/future/Future.tsx` if/when one is.
- The contact form posts to a working API route (`app/api/contact/route.ts`)
  that validates input and returns success, but doesn't send an email yet —
  it has a `TODO` with a ready-to-uncomment example for a provider like
  Resend.

Search the codebase for `PlaceholderImage` and `TODO` to find every spot
that's ready for real content.

## Architecture

```
app/
  layout.tsx          Root layout — fonts, metadata, JSON-LD, Navbar/Footer
  page.tsx             Home — the full one-page narrative
  globals.css          Design tokens (Tailwind v4 @theme) + base styles
  sitemap.ts, robots.ts, opengraph-image.tsx, icon.tsx
  records/  journey/  about/  media/  contact/
                       Dedicated, deep-linkable pages that reuse the same
                       section components as the home page

components/
  navigation/          Navbar + fullscreen mobile menu
  hero/                Hero: load animation + scroll parallax
  records/             Record intro, Featured Record (44.71), Records timeline
  journey/             The Journey timeline
  about/               About + Performance (attributes, no fake percentages)
  gallery/              "In Motion" asymmetric photo gallery
  video/                "Watch the Records" + lightbox
  press/                Verified press coverage
  certificates/         "The Proof" — links out to official verification
  nepal/                Quiet "From Nepal, to the world" section
  future/               "What's Next"
  contact/              Contact form (6 enquiry categories)
  footer/
  ui/                  Reveal (scroll animation), PlaceholderImage, Button,
                       ArrowLink, typography primitives — the shared design
                       system every section is built from

lib/
  records.ts           All 7 records — single source of truth
  journey.ts           Journey milestones
  press.ts             Verified press mentions
  seo.ts               Site-wide SEO constants + Person JSON-LD
```

Records, journey milestones and press mentions are all data-driven from
`lib/`, not hardcoded into JSX — add an eighth record to `lib/records.ts`
and it flows through the hero count, the featured section, the timeline,
and the JSON-LD automatically.

## Design system

- **Colors** — near-black `#0B0B0B` (ink), warm off-white `#F4F1EA` (paper),
  neutral `#A5A29A` (stone), and a deep, Nepal-inspired crimson `#A6231F`
  used sparingly for accents, records, and active states. Defined once in
  `app/globals.css` under `@theme`.
- **Type** — Bebas Neue for display/headlines, Inter for body/UI. Both
  loaded via `next/font/google` (self-hosted, no render-blocking request).
- **Motion** — one shared `<Reveal>` scroll-in wrapper used everywhere, plus
  bespoke scroll-tied parallax in the Hero and Featured Record sections.
  Everything respects `prefers-reduced-motion` (falls back to simple
  opacity fades, no parallax, no clip-path wipes).

## Before deploying

1. Add real photography, video and certificate scans (see the READMEs in
   `/public`).
2. Set `SITE_URL` in `lib/seo.ts` to the real domain.
3. Wire the contact form to a real email/inbox in
   `app/api/contact/route.ts`.
4. Add verified social profile URLs to `SOCIAL_LINKS` in
   `components/footer/Footer.tsx`, if desired.
5. Configure `images.remotePatterns` in `next.config.ts` if photography
   ends up hosted externally (a CMS or CDN) rather than in `/public`.
