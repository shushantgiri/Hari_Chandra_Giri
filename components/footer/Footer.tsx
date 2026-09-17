import Link from "next/link";
import { NAV_LINKS } from "@/lib/nav";
import type { AthleteRecord } from "@/lib/records";

// Add verified profile URLs here once available. Icons/labels only render
// for entries present in this list — nothing links out on a guessed handle.
const SOCIAL_LINKS: { label: string; href: string }[] = [];

// latestRecord is still passed by the layout; the footer no longer uses it.
export function Footer(_props: { latestRecord?: AthleteRecord }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-ink">
      <div className="wrap py-16 sm:py-20">
        <div className="flex flex-col gap-12 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-3xl uppercase text-paper">Hari Chandra Giri</p>
            <p className="mt-2 font-sans text-sm uppercase tracking-[0.15em] text-stone">
              World Record Athlete · Nepal
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-sm uppercase tracking-[0.1em] text-stone transition-colors duration-300 hover:text-paper"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="font-sans text-sm uppercase tracking-[0.1em] text-stone transition-colors duration-300 hover:text-paper"
            >
              Contact
            </Link>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-xs text-stone/70">
            © {year} Hari Chandra Giri. All rights reserved.
          </p>

          {SOCIAL_LINKS.length > 0 ? (
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-xs uppercase tracking-[0.1em] text-stone transition-colors duration-300 hover:text-paper"
                >
                  {social.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
