# Athlete Management — Admin PWA setup

This is the mobile-first admin system at `/admin`, backed by
Supabase. This document is the honest map of what's real, what's not, and
exactly what to do to make it live.

## This phase: closing the loop

Previously, `/admin` could save data, but the public site still read from
static files — editing a record in the admin didn't actually change
anything a visitor saw. That's fixed for Records specifically:

- The public site's Records pages, Hero's record count, Featured Record,
  the Journey's record badges, Gallery, Certificates, the footer's verify
  link, and the JSON-LD structured data all now read from Supabase
  (`lib/records.ts`), falling back to the 7 verified records built in if
  Supabase has nothing published yet.
- New: `/records/[slug]` — a dedicated page per record (large photo,
  result, story, certificate, a link to another record), with pretty URLs
  derived from the title.
- The admin moved from `/control-center` to `/admin`, per the latest brief.

**Not yet Supabase-wired**: Journey milestones, the Gallery/Certificates'
underlying photos (they still pull from the Records data, not an actual
photo library), Achievements, Awards. Same pattern as Records, applied to
each — a well-understood next step, not a mystery, but real remaining work.

**Not started from the newest brief**: a dedicated public Achievements/
Awards section, the simplified navigation (Home/About/Journey/Records/
Achievements/Gallery/Contact), folding Events and Press into something
smaller, multi-user roles beyond admin/editor, and real-time/push
notifications for new messages.

## What's fully built and tested

- **Database schema** (`supabase/schema.sql`) — all 14 tables, Row Level
  Security policies, and storage bucket setup. This was tested against a
  real local Postgres instance with a Supabase Auth stand-in — not just
  written and hoped. Verified directly: anonymous visitors see only
  published rows, a signed-in user with no `profiles` row still can't see
  drafts or write anything, and an actual admin can do both.
- **PWA shell** — installable manifest scoped to `/admin` only (it
  will not make your public site installable), a service worker with
  offline fallback, and real app icons.
- **Auth** — Supabase email/password sign-in, middleware-protected routes,
  and a second check inside the app itself: being signed in is not the same
  as being an admin (see "Creating your first admin user" below).
- **Responsive shell** — bottom navigation with bottom sheets for grouped
  sections on mobile, a sidebar on desktop, matching the nav structure from
  the brief exactly (Home / Content / Media / Messages / More).
- **World Records** — full CRUD. List, a 3-step add/edit form (Details →
  Media & Verification → Review), publish/draft toggle, delete. This is the
  reference pattern — see "Extending this to other content types" below.
- **Achievements** — full CRUD, single-page form (title, year, description,
  image, featured, publish/draft).
- **Events** — full CRUD with native date and time pickers, external link,
  featured, publish/draft.
- **Timeline** — full CRUD for the Journey milestones shown on the public
  site, including a dropdown to optionally link a milestone to an existing
  World Record.
- **Athlete Profile** — a singleton form (no list — there's only one
  athlete) for name, bio, discipline, country, affiliation and portrait.
- **Photos** — the upload flow the brief calls "extremely important":
  camera or gallery, multi-select, client-side compression before upload,
  per-photo preview and progress, then publish or save as draft. Plus a
  library grid with publish/archive-style status toggle and delete.
- **Messages** — the public contact form's submissions, with mark-as-read
  (automatic on open), archive, delete, and a reply-by-email link.
- **Activity Log** — real, not a stub. Every create/update/delete already
  calls a logging function; this screen just reads it back.

Every field name in every form was cross-checked directly against
`supabase/schema.sql` — the columns really exist, spelled exactly that way.

## What's a real, working stub

Awards, Galleries, Videos, Press/News, Site Settings, SEO, Social Links, and
Admin Users all have real navigation entries and real pages — they explain
that they follow the exact same pattern as World Records, rather than
404ing or pretending to be finished. Their database tables already exist in
the schema.

## What's not built at all

- **Push notifications.** This needs VAPID keys, a subscription-storage
  table, and a server-side function that sends them — a meaningfully
  separate piece of work.
- **Full offline write queue.** The service worker caches the app shell for
  offline *viewing*. It does not yet queue up an offline photo upload or
  form save and retry it when connection returns — that needs its own
  state machine (Saved / Pending / Failed / Offline, per the brief) and is
  a good next slice, not a subtle add-on.
- **The remaining 8 CRUD screens** (Awards, Galleries, Videos, Press,
  Settings, SEO, Social Links, Admin Users) — same pattern, meaningful
  remaining effort.

## Setting this up for real

### 1. Create a Supabase project

Free tier is fine to start: [supabase.com](https://supabase.com) → New
Project.

### 2. Run the schema

Supabase Dashboard → SQL Editor → New query → paste the entire contents of
`supabase/schema.sql` → Run. It's safe to re-run if you need to.

### 3. Seed your real records (optional but recommended)

Same place, new query → paste `supabase/seed.sql` → Run. This inserts your
7 verified records for real. Without this step, the public site still shows
those exact same 7 records — they're built in as a fallback — but they
aren't actually *in* your database yet, so editing them in `/admin` won't
do anything until you either run this seed or add them manually.

### 4. Set your environment variables

Copy `.env.local.example` to `.env.local`, and fill in your project's URL
and anon key (Dashboard → Project Settings → API).

### 5. Creating your first admin user

There's no public sign-up screen on purpose — this app should only ever
have as many users as you explicitly create.

1. Supabase Dashboard → Authentication → Users → Add user. Set an email and
   password.
2. Copy that user's ID (UUID).
3. Dashboard → Table Editor → `profiles` → Insert row: `id` = that UUID,
   `role` = `admin`.

Without step 3, that person can sign in but sees "Access Pending" — signing
in and being an admin are deliberately two different things.

### 6. Install it on a phone

Once deployed, open `yoursite.com/admin/login` on a phone browser,
sign in, then use the browser's "Add to Home Screen." It'll behave like a
native app from there — its own icon, no browser chrome.

## Extending this to other content types

Every stub page says this, but concretely: to build out, say, Awards —

1. The table already exists (`public.awards` in the schema).
2. Copy `lib/admin/achievements-actions.ts` → `awards-actions.ts` (Awards'
   fields are almost identical to Achievements' — title, organization,
   year, image, status), adjust field names.
3. Copy `components/admin/AchievementForm.tsx` → `AwardForm.tsx`, adjust.
4. Copy `AchievementRow.tsx` and the list page, same adjustment.
5. Replace the `ComingSoon` in `app/admin/(dashboard)/awards/page.tsx`
   with the real list.

If a content type needs to link to another table the way Timeline links to
World Records, `components/admin/TimelineForm.tsx` is the reference for
that — fetch the options server-side in the page, pass them down as a prop,
render a `<select>`.
