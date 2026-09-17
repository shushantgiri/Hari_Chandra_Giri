"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Folder, Home, Image as ImageIcon, MessageSquare, MoreHorizontal, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { NAV_SECTIONS, type NavSection } from "@/lib/admin/nav";

const ICONS = {
  home: Home,
  content: Folder,
  media: ImageIcon,
  messages: MessageSquare,
  more: MoreHorizontal,
} as const;

export function BottomNav() {
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<NavSection | null>(null);

  const isSectionActive = (section: NavSection) => {
    if (section.href) return pathname === section.href;
    return section.items?.some((item) => pathname.startsWith(item.href)) ?? false;
  };

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      >
        <div className="grid grid-cols-5">
          {NAV_SECTIONS.map((section) => {
            const Icon = ICONS[section.icon];
            const active = isSectionActive(section);

            if (section.href) {
              return (
                <Link
                  key={section.label}
                  href={section.href}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 font-sans text-[0.65rem] uppercase tracking-wide transition-colors duration-200",
                    active ? "text-crimson-2" : "text-stone",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                  {section.label}
                </Link>
              );
            }

            return (
              <button
                key={section.label}
                type="button"
                onClick={() => setOpenSection(section)}
                aria-haspopup="true"
                aria-expanded={openSection?.label === section.label}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 font-sans text-[0.65rem] uppercase tracking-wide transition-colors duration-200",
                  active ? "text-crimson-2" : "text-stone",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {section.label}
              </button>
            );
          })}
        </div>
      </nav>

      <AnimatePresence>
        {openSection ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-ink/70 lg:hidden"
            onClick={() => setOpenSection(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-line bg-ink-2 pb-[calc(env(safe-area-inset-bottom)+1rem)]"
            >
              <div className="flex items-center justify-between px-5 pt-5">
                <p className="font-display text-lg uppercase text-paper">{openSection.label}</p>
                <button
                  type="button"
                  onClick={() => setOpenSection(null)}
                  aria-label="Close"
                  className="rounded-full p-1.5 text-stone hover:text-paper"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
              <ul className="mt-2 px-2 pb-2">
                {openSection.items?.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpenSection(null)}
                      className="block rounded-lg px-3 py-3.5 font-sans text-base text-paper transition-colors duration-200 hover:bg-paper/5"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
