-- ============================================================================
-- Hari Chandra Giri — Admin CMS database schema
--
-- Run this once, in full, in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New query → paste this whole file → Run).
--
-- This is idempotent (safe to re-run): every statement uses
-- "if not exists" / "create or replace" / "on conflict do nothing".
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- Admin users
-- Supabase Auth already manages auth.users (email, password, sessions). This
-- table extends it with the one thing Auth doesn't track: role. A row here
-- is what makes someone an admin of the CMS — creating an Auth user alone
-- does NOT grant access.
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

-- Reusable check used by every policy below: is the current request from a
-- signed-in admin/editor? security definer so it can read public.profiles
-- even though the row-level policy on profiles itself would otherwise apply.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- Athlete profile — singleton (one row, id is always 1)
-- ----------------------------------------------------------------------------
create table if not exists public.athlete_profile (
  id int primary key default 1 check (id = 1),
  full_name text not null default 'Hari Chandra Giri',
  bio text,
  discipline text default 'Hand-Walking',
  country text default 'Nepal',
  affiliation text default 'Nepal Army Sports Centre',
  portrait_url text,
  updated_at timestamptz not null default now()
);
insert into public.athlete_profile (id) values (1) on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- World Records
-- ----------------------------------------------------------------------------
create table if not exists public.world_records (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  result text not null,
  unit text not null default 'SECONDS',
  record_date date,
  location text,
  organization text not null default 'Guinness World Records',
  verification_url text,
  description text,
  cover_image_url text,
  certificate_image_url text,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists world_records_set_updated_at on public.world_records;
create trigger world_records_set_updated_at before update on public.world_records
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Achievements
-- ----------------------------------------------------------------------------
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  year int,
  description text,
  image_url text,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists achievements_set_updated_at on public.achievements;
create trigger achievements_set_updated_at before update on public.achievements
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Timeline (Journey milestones) — optionally tied to a world record
-- ----------------------------------------------------------------------------
create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  marker text not null,
  title text not null,
  description text,
  image_url text,
  record_id uuid references public.world_records (id) on delete set null,
  sort_order int not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists timeline_events_set_updated_at on public.timeline_events;
create trigger timeline_events_set_updated_at before update on public.timeline_events
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Events
-- ----------------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  event_date date,
  event_time time,
  location text,
  description text,
  cover_image_url text,
  external_link text,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'past')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at before update on public.events
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Awards
-- ----------------------------------------------------------------------------
create table if not exists public.awards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text,
  year int,
  image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists awards_set_updated_at on public.awards;
create trigger awards_set_updated_at before update on public.awards
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Galleries + Photos
-- ----------------------------------------------------------------------------
create table if not exists public.galleries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_photo_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists galleries_set_updated_at on public.galleries;
create trigger galleries_set_updated_at before update on public.galleries
  for each row execute function public.set_updated_at();

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid references public.galleries (id) on delete set null,
  record_id uuid references public.world_records (id) on delete set null,
  storage_path text not null,
  url text not null,
  title text,
  alt_text text,
  sort_order int not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists photos_set_updated_at on public.photos;
create trigger photos_set_updated_at before update on public.photos
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Media: videos + press mentions
-- ----------------------------------------------------------------------------
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  video_url text,
  thumbnail_url text,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists videos_set_updated_at on public.videos;
create trigger videos_set_updated_at before update on public.videos
  for each row execute function public.set_updated_at();

create table if not exists public.press_mentions (
  id uuid primary key default gen_random_uuid(),
  publication text not null,
  headline text not null,
  url text not null,
  press_date date,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists press_mentions_set_updated_at on public.press_mentions;
create trigger press_mentions_set_updated_at before update on public.press_mentions
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Messages (contact form submissions)
-- ----------------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  purpose text,
  message text not null,
  status text not null default 'unread' check (status in ('unread', 'read', 'archived')),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Site settings — singleton
-- ----------------------------------------------------------------------------
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  seo_title text,
  seo_description text,
  social_links jsonb not null default '{}'::jsonb,
  notification_prefs jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Activity log — who did what, for the "Activity Log" admin screen
-- ----------------------------------------------------------------------------
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Row Level Security
--
-- Pattern used throughout: anyone (including signed-out visitors, i.e. the
-- public website) can read rows with status = 'published'. Only a signed-in
-- admin/editor (a row in public.profiles) can read drafts or write anything.
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.athlete_profile enable row level security;
alter table public.world_records enable row level security;
alter table public.achievements enable row level security;
alter table public.timeline_events enable row level security;
alter table public.events enable row level security;
alter table public.awards enable row level security;
alter table public.galleries enable row level security;
alter table public.photos enable row level security;
alter table public.videos enable row level security;
alter table public.press_mentions enable row level security;
alter table public.messages enable row level security;
alter table public.site_settings enable row level security;
alter table public.activity_log enable row level security;

drop policy if exists "profiles_self_or_admin_read" on public.profiles;
create policy "profiles_self_or_admin_read" on public.profiles for select
  using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles_admin_write" on public.profiles;
create policy "profiles_admin_write" on public.profiles for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "athlete_profile_public_read" on public.athlete_profile;
create policy "athlete_profile_public_read" on public.athlete_profile for select using (true);
drop policy if exists "athlete_profile_admin_write" on public.athlete_profile;
create policy "athlete_profile_admin_write" on public.athlete_profile for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings for select using (true);
drop policy if exists "site_settings_admin_write" on public.site_settings;
create policy "site_settings_admin_write" on public.site_settings for all
  using (public.is_admin()) with check (public.is_admin());

-- The same four-policy shape, repeated per public content table:
-- public read of published rows (admins see everything), admin-only writes.
do $$
declare
  t text;
begin
  foreach t in array array[
    'world_records', 'achievements', 'timeline_events', 'events',
    'awards', 'galleries', 'photos', 'videos', 'press_mentions'
  ]
  loop
    execute format('drop policy if exists "%s_public_read" on public.%I', t, t);
    execute format(
      'create policy "%s_public_read" on public.%I for select using (status = ''published'' or public.is_admin())',
      t, t
    );
    execute format('drop policy if exists "%s_admin_insert" on public.%I', t, t);
    execute format(
      'create policy "%s_admin_insert" on public.%I for insert with check (public.is_admin())',
      t, t
    );
    execute format('drop policy if exists "%s_admin_update" on public.%I', t, t);
    execute format(
      'create policy "%s_admin_update" on public.%I for update using (public.is_admin()) with check (public.is_admin())',
      t, t
    );
    execute format('drop policy if exists "%s_admin_delete" on public.%I', t, t);
    execute format(
      'create policy "%s_admin_delete" on public.%I for delete using (public.is_admin())',
      t, t
    );
  end loop;
end $$;

-- messages: anyone can submit (the public contact form), only admins can
-- read, update (mark read/archived) or delete.
drop policy if exists "messages_public_insert" on public.messages;
create policy "messages_public_insert" on public.messages for insert with check (true);
drop policy if exists "messages_admin_read" on public.messages;
create policy "messages_admin_read" on public.messages for select using (public.is_admin());
drop policy if exists "messages_admin_update" on public.messages;
create policy "messages_admin_update" on public.messages for update
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "messages_admin_delete" on public.messages;
create policy "messages_admin_delete" on public.messages for delete using (public.is_admin());

-- activity_log: admin-only, append-only from the app (writes happen via a
-- security-definer function below, not direct inserts from the client).
drop policy if exists "activity_log_admin_read" on public.activity_log;
create policy "activity_log_admin_read" on public.activity_log for select using (public.is_admin());

create or replace function public.log_activity(
  p_action text, p_entity_type text, p_entity_id uuid
) returns void
language sql
security definer
set search_path = public
as $$
  insert into public.activity_log (actor_id, action, entity_type, entity_id)
  values (auth.uid(), p_action, p_entity_type, p_entity_id);
$$;

-- ============================================================================
-- Storage
--
-- One public bucket, folder-prefixed by content type
-- (photos/, records/, events/, achievements/, certificates/, press/).
-- Public read (so the live site can show images without auth), admin-only
-- write. Run this section too — it's part of the same file.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "media_admin_write" on storage.objects;
create policy "media_admin_write" on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects for update
  using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin());
