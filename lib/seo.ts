// Central place for site-wide SEO facts. Update SITE_URL once the site has a
// real domain — everything else (canonical URLs, OG tags, sitemap, JSON-LD)
// derives from it.

// The site's public address. Follows wherever it's deployed: an explicit
// NEXT_PUBLIC_SITE_URL wins, then Vercel's own domain, then the real domain.
// Everything that needs an absolute URL — the share thumbnail, canonical
// links, the sitemap — is built from this, so it must match the live address.
const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelDomain ? `https://${vercelDomain}` : "https://www.harichandragiri.com.np");

export const SITE_NAME = "Hari Chandra Giri";

export const SITE_TITLE = "Hari Chandra Giri — World Record Athlete from Nepal";

export const SITE_DESCRIPTION =
  "Hari Chandra Giri is a Nepal Army athlete and seven-time Guinness World Records holder — " +
  "the fastest in the world down a flight of stairs on his hands. Records, certificates, " +
  "footage and the story from age eight to the record books.";

import type { AthleteRecord } from "@/lib/records";

export function buildSiteJsonLd(records: AthleteRecord[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Hari Chandra Giri",
    url: SITE_URL,
    nationality: "Nepal",
    jobTitle: "Hand-Walking Athlete",
    affiliation: {
      "@type": "Organization",
      name: "Nepal Army Sports Centre",
    },
    award: records.map((record) => `${record.fullTitle} — Guinness World Records, ${record.year}`),
    sameAs: [] as string[],
  };
}