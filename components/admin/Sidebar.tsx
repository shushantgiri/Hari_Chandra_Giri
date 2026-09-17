"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Folder, Home, Image as ImageIcon, MessageSquare, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";
import { NAV_SECTIONS } from "@/lib/admin/nav";

const ICONS = {
  home: Home,
  content: Folder,
  media: ImageIcon,
  messages: MessageSquare,
  more: MoreHorizontal,
} as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-ink-2 lg:flex">
      <Link href="/admin" className="px-6 py-6 font-display text-xl uppercase text-paper">
        Athlete Mgmt
      </Link>

      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 pb-6">
        {NAV_SECTIONS.map((section) => {
          const Icon = ICONS[section.icon];

          if (section.href) {
            const active = pathname === section.href;
            return (
              <Link
                key={section.label}
                href={section.href}
                className={cn(
                  "mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm transition-colors duration-200",
                  active ? "bg-paper/10 text-paper" : "text-stone hover:text-paper",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {section.label}
              </Link>
            );
          }

          return (
            <div key={section.label} className="mb-4 mt-5 first:mt-0">
              <p className="flex items-center gap-2 px-3 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-stone/70">
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {section.label}
              </p>
              <div className="mt-1.5">
                {section.items?.map((item) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block rounded-lg px-3 py-2 font-sans text-sm transition-colors duration-200",
                        active ? "bg-paper/10 text-paper" : "text-stone hover:text-paper",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
