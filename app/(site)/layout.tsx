import type { Metadata, Viewport } from "next";
// Self-hosted via Fontsource rather than next/font/google: identical
// self-hosting outcome (no runtime request to Google), but the font files
// ship with the npm package instead of being fetched at build time.
import "@fontsource/bebas-neue/400.css";
import "@fontsource-variable/inter/wght.css";
import "@fontsource/caveat/600.css";
import "@/app/globals.css";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL, buildSiteJsonLd } from "@/lib/seo";
import { getRecords } from "@/lib/records";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Hari Chandra Giri",
    "hand walking",
    "Guinness World Records",
    "Nepal athlete",
    "world record",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  category: "sports",
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    // The thumbnail shown when the site is shared (WhatsApp, Facebook,
    // LinkedIn, iMessage…). It's a plain file: replace /public/og.jpg to change it.
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0b0b0b",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const records = await getRecords();
  const latestRecord = records[records.length - 1];

  return (
    <html lang="en">
      <body className="bg-ink text-paper antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer latestRecord={latestRecord} />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSiteJsonLd(records)) }}
        />
      </body>
    </html>
  );
}
