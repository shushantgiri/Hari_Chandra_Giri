-- ============================================================================
-- Seed the 7 verified World Records into a real Supabase project.
--
-- Run this AFTER supabase/schema.sql, in the SQL Editor. Safe to re-run —
-- it upserts on id, so running it twice won't duplicate rows.
--
-- Once this has run, the public site reads these rows directly (see
-- lib/records.ts) instead of falling back to its built-in seed data — this
-- is what actually closes the Admin → Supabase → Public loop.
-- ============================================================================

insert into public.world_records
  (id, title, result, unit, record_date, location, organization, verification_url, description, featured, status, certificate_image_url, cover_image_url)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'Fastest time to descend 50 stairs walking on hands',
    '12.65', 'SECONDS', '2021-11-21', 'Dang, Lumbini Province, Nepal', 'Guinness World Records',
    'https://www.guinnessworldrecords.com/world-records/115793-fastest-time-to-descend-fifty-steps-walking-on-hands',
    'Hari''s first Guinness World Records title. It broke a record that had stood for seven years.',
    false, 'published', '/images/certificates/50-stairs.jpg', null
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Fastest 10 m walking on hands with a football between the legs',
    '4.49', 'SECONDS', '2022-05-04', 'Kathmandu, Nepal', 'Guinness World Records',
    'https://www.guinnessworldrecords.com/news/2024/11/nepalese-mans-mission-to-break-world-records-with-incredible-hand-walking-skills',
    'Set on a running track in Kathmandu, on the same day as his 50 m football record.',
    false, 'published', '/images/certificates/10m-with-football.jpg', null
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'Fastest 50 m walking on hands with a football between the legs',
    '25.58', 'SECONDS', '2022-05-04', 'Kathmandu, Nepal', 'Guinness World Records',
    'https://www.guinnessworldrecords.com/world-records/424610-fastest-50-meters-walking-on-hands-with-a-football-soccer-ball-between-the-legs',
    'Two titles in one day, both on a Kathmandu running track.',
    false, 'published', '/images/certificates/50m-with-football.jpg', null
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'Fastest time to descend 75 stairs on the hands',
    '25.03', 'SECONDS', '2023-03-12', 'Jamchen Vijaya Stupa, Nepal', 'Guinness World Records',
    'https://www.guinnessworldrecords.com/world-records/72497-inverted-stair-walking',
    'Descended the steps of a Buddhist temple overlooking the Kathmandu Valley, averaging three steps a second.',
    false, 'published', '/images/certificates/75-stairs.jpg', '/images/records/75-stairs.jpg'
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'Most skips on an upright tyre in one minute',
    '120', 'SKIPS / 1 MIN', '2024-03-25', 'Kathmandu, Nepal', 'Guinness World Records',
    'https://www.guinnessworldrecords.com/news/2024/11/nepalese-mans-mission-to-break-world-records-with-incredible-hand-walking-skills',
    'A change of discipline — traded hand-balance for footwork, upright on a tyre.',
    false, 'published', '/images/certificates/120-skips-tyre.jpg', '/images/records/120-skips-tyre.jpg'
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    'Fastest time to drink 500 ml of lemon juice in a handstand',
    '24.00', 'SECONDS', '2025-09-10', 'London, United Kingdom', 'Guinness World Records',
    'https://www.guinnessworldrecords.jp/world-records/779510-fastest-time-to-drink-500-ml-of-lemon-juice-handstand',
    'During a visit to the Guinness World Records London HQ, a quick demonstration turned into one more title: 500 ml of lemon juice, gone in 24 seconds, upside down.',
    false, 'published', '/images/certificates/lemon-juice-handstand.jpg', '/images/lemon-juice-handstand.jpg'
  ),
  (
    '77777777-7777-4777-8777-777777777777',
    'Fastest time to descend 100 stairs walking on hands',
    '44.71', 'SECONDS', '2026-01-04', 'Yunyang, Chongqing, China', 'Guinness World Records',
    'https://www.guinnessworldrecords.com/news/2026/6/athletes-most-dangerous-stunt-yet-as-he-hand-walks-down-100-stairs-at-super-speed',
    'Over two stairs a second, upside down. Six months of training preceded the attempt, including drills on both wet and dry steps.',
    true, 'published', '/images/certificates/100-stairs.jpg', '/images/records/100-stairs.jpg'
  )
on conflict (id) do update set
  title = excluded.title,
  result = excluded.result,
  unit = excluded.unit,
  record_date = excluded.record_date,
  location = excluded.location,
  organization = excluded.organization,
  verification_url = excluded.verification_url,
  description = excluded.description,
  featured = excluded.featured,
  status = excluded.status,
  certificate_image_url = excluded.certificate_image_url,
  cover_image_url = excluded.cover_image_url;
-- The certificate scans ship with the site in /public/images/certificates,
-- which is what the paths above point at. Uploading a replacement scan to a
-- record in /admin overrides its path here. Cover photos are left blank —
-- add them through the admin.
