import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface AthleteRecord {
  /** Stable slug, used for anchors, React keys, and /records/[slug] URLs. */
  id: string;
  slug: string;
  year: number;
  /** Full display date, as precise as the public record allows. */
  date: string;
  shortTitle: string;
  fullTitle: string;
  result: string;
  unit: string;
  location: string;
  description: string;
  officialUrl: string;
  featured?: boolean;
  image?: string;
  /** Further photographs of the attempt, shown on the record's own page. */
  photos?: string[];
  certificateImage?: string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// The original 7 verified records — drawn from Guinness World Records' own
// published record pages and news desk, plus wire coverage (UPI). This is
// the fallback shown if Supabase has no published records yet (e.g. before
// the schema is seeded) or isn't reachable. Once real rows exist in
// world_records, THOSE are what the site shows — this array stops being
// the source of truth the moment an admin publishes the first record.
const SEED_RECORDS: Omit<AthleteRecord, "slug">[] = [
  {
    id: "50-stairs",
    year: 2021,
    date: "21 November 2021",
    shortTitle: "50 Stairs",
    fullTitle: "Fastest time to descend 50 stairs walking on hands",
    result: "12.65",
    unit: "SECONDS",
    location: "Dang, Lumbini Province, Nepal",
    description:
      "Hari's first Guinness World Records title. It broke a record that had stood for seven years.",
    officialUrl:
      "https://www.guinnessworldrecords.com/world-records/115793-fastest-time-to-descend-fifty-steps-walking-on-hands",
    certificateImage: "/images/certificates/50-stairs.jpg",
  },
  {
    id: "10m-football",
    year: 2022,
    date: "4 May 2022",
    shortTitle: "10M with Football",
    fullTitle: "Fastest 10 m walking on hands with a football between the legs",
    result: "4.49",
    unit: "SECONDS",
    location: "Kathmandu, Nepal",
    description:
      "Set on a running track in Kathmandu, on the same day as his 50 m football record.",
    officialUrl:
      "https://www.guinnessworldrecords.com/news/2024/11/nepalese-mans-mission-to-break-world-records-with-incredible-hand-walking-skills",
    certificateImage: "/images/certificates/10m-with-football.jpg",
  },
  {
    id: "50m-football",
    year: 2022,
    date: "4 May 2022",
    shortTitle: "50M with Football",
    fullTitle: "Fastest 50 m walking on hands with a football between the legs",
    result: "25.58",
    unit: "SECONDS",
    location: "Kathmandu, Nepal",
    description: "Two titles in one day, both on a Kathmandu running track.",
    officialUrl:
      "https://www.guinnessworldrecords.com/world-records/424610-fastest-50-meters-walking-on-hands-with-a-football-soccer-ball-between-the-legs",
    certificateImage: "/images/certificates/50m-with-football.jpg",
  },
  {
    id: "75-stairs",
    year: 2023,
    date: "12 March 2023",
    shortTitle: "75 Stairs",
    fullTitle: "Fastest time to descend 75 stairs on the hands",
    result: "25.03",
    unit: "SECONDS",
    location: "Jamchen Vijaya Stupa, Nepal",
    description:
      "Descended the steps of a Buddhist temple overlooking the Kathmandu Valley, averaging three steps a second.",
    officialUrl:
      "https://www.guinnessworldrecords.com/world-records/72497-inverted-stair-walking",
    image: "/images/records/75-stairs.jpg",
    certificateImage: "/images/certificates/75-stairs.jpg",
  },
  {
    id: "tyre-skips",
    year: 2024,
    date: "25 March 2024",
    shortTitle: "120 Skips, Tyre",
    fullTitle: "Most skips on an upright tyre in one minute",
    result: "120",
    unit: "SKIPS / 1 MIN",
    location: "Kathmandu, Nepal",
    description: "A change of discipline — traded hand-balance for footwork, upright on a tyre.",
    officialUrl:
      "https://www.guinnessworldrecords.com/news/2024/11/nepalese-mans-mission-to-break-world-records-with-incredible-hand-walking-skills",
    image: "/images/records/120-skips-tyre.jpg",
    certificateImage: "/images/certificates/120-skips-tyre.jpg",
  },
  {
    id: "lemon-handstand",
    year: 2025,
    date: "10 September 2025",
    shortTitle: "Lemon Juice Handstand",
    fullTitle: "Fastest time to drink 500 ml of lemon juice in a handstand",
    result: "24.00",
    unit: "SECONDS",
    location: "London, United Kingdom",
    description:
      "During a visit to the Guinness World Records London HQ, a quick demonstration turned into one more title: 500 ml of lemon juice, gone in 24 seconds, upside down.",
    officialUrl:
      "https://www.guinnessworldrecords.jp/world-records/779510-fastest-time-to-drink-500-ml-of-lemon-juice-handstand",
    image: "/images/lemon-juice-handstand.jpg",
    certificateImage: "/images/certificates/lemon-juice-handstand.jpg",
  },
  {
    id: "100-stairs",
    year: 2026,
    date: "4 January 2026",
    shortTitle: "100 Stairs",
    fullTitle: "Fastest time to descend 100 stairs walking on hands",
    result: "44.71",
    unit: "SECONDS",
    location: "Yunyang, Chongqing, China",
    description:
      "Over two stairs a second, upside down. Six months of training preceded the attempt, including drills on both wet and dry steps.",
    officialUrl:
      "https://www.guinnessworldrecords.com/news/2026/6/athletes-most-dangerous-stunt-yet-as-he-hand-walks-down-100-stairs-at-super-speed",
    featured: true,
    image: "/images/records/100-stairs.jpg",
    photos: ["/images/records/100-stairs-2.jpg"],
    certificateImage: "/images/certificates/100-stairs.jpg",
  },
];

function withSlug(record: Omit<AthleteRecord, "slug">): AthleteRecord {
  return { ...record, slug: slugify(record.shortTitle) };
}

const SEEDED: AthleteRecord[] = SEED_RECORDS.map(withSlug);

function formatDisplayDate(isoDate: string | null): string {
  if (!isoDate) return "";
  const d = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

interface WorldRecordRow {
  id: string;
  title: string;
  result: string;
  unit: string;
  record_date: string | null;
  location: string | null;
  description: string | null;
  verification_url: string | null;
  cover_image_url: string | null;
  certificate_image_url: string | null;
  featured: boolean | null;
}

/**
 * The built-in copy of one of the original records, if a database row is
 * that record. Matched on the official title (or, failing that, result and
 * year), so renaming in the admin doesn't silently break it.
 */
function seedTwin(row: WorldRecordRow): AthleteRecord | undefined {
  const title = row.title.trim().toLowerCase();
  const year = row.record_date ? new Date(row.record_date).getUTCFullYear() : 0;
  return (
    SEEDED.find((seed) => seed.fullTitle.toLowerCase() === title) ??
    SEEDED.find((seed) => seed.result === row.result && seed.year === year)
  );
}

function mapRow(row: WorldRecordRow): AthleteRecord {
  // The certificate scans and photos for the original seven live in
  // /public/images. If a database row for one of them has no image of its
  // own yet, it borrows the built-in one — so the site never shows an empty
  // frame for a record that has a real certificate. Anything uploaded
  // through the admin wins over the built-in file.
  const twin = seedTwin(row);
  const shortTitle = twin?.shortTitle ?? row.title;

  return {
    id: row.id,
    slug: slugify(shortTitle),
    year: row.record_date ? new Date(row.record_date).getUTCFullYear() : 0,
    date: formatDisplayDate(row.record_date),
    shortTitle,
    fullTitle: row.title,
    result: row.result,
    unit: row.unit,
    location: row.location ?? "",
    description: row.description ?? twin?.description ?? "",
    officialUrl: row.verification_url ?? "",
    featured: row.featured ?? false,
    image: row.cover_image_url ?? twin?.image,
    photos: twin?.photos,
    certificateImage: row.certificate_image_url ?? twin?.certificateImage,
  };
}

/**
 * The single source of truth for records on the public site. Cached per
 * request (React's cache()) so the layout, the page, and every section that
 * needs records only trigger one actual query, no matter how many of them
 * call this.
 */
export const getRecords = cache(async (): Promise<AthleteRecord[]> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("world_records")
      .select(
        "id, title, result, unit, record_date, location, description, verification_url, cover_image_url, certificate_image_url, featured",
      )
      .eq("status", "published")
      .order("record_date", { ascending: true });

    if (error || !data || data.length === 0) {
      return SEEDED;
    }

    return data.map(mapRow);
  } catch {
    return SEEDED;
  }
});

export async function getFeaturedRecord(): Promise<AthleteRecord> {
  const records = await getRecords();
  return records.find((record) => record.featured) ?? records[records.length - 1];
}

export async function getRecordBySlug(slug: string): Promise<AthleteRecord | undefined> {
  const records = await getRecords();
  return records.find((record) => record.slug === slug);
}
