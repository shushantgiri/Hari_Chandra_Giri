import type { Metadata, Viewport } from "next";
import "@fontsource/bebas-neue/400.css";
import "@fontsource-variable/inter/wght.css";
import "@/app/globals.css";
import { ServiceWorkerRegister } from "@/components/admin/ServiceWorkerRegister";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Athlete Management",
    template: "%s — Athlete Management",
  },
  description: "Manage Hari Chandra Giri's official website.",
  manifest: "/admin-manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Athlete Mgmt",
  },
  // Keep this out of search results — it's a private tool, not a page for visitors.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

// This is a SEPARATE root layout from the public site's (see app/(site)/layout.tsx)
// — its own <html>/<body>, no shared Navbar/Footer. Next.js supports multiple
// root layouts via sibling route groups/folders that don't share a parent
// layout; that's what (site) and admin are here.
export default function ControlCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink text-paper antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
