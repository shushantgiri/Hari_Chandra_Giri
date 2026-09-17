"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";

type NavLink = { href: string; label: string };

const EASE = [0.16, 1, 0.3, 1] as const;

export function MobileMenu({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
}) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Escape closes; so does growing past the phone/tablet breakpoint, since
  // the desktop nav takes over there and the overlay would otherwise linger.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) onClose();
    };
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onChange);
    };
  }, [open, onClose]);

  const rise = (index: number) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 22 },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: shouldReduceMotion ? 0 : 0.06 * index + 0.08,
      duration: shouldReduceMotion ? 0.2 : 0.55,
      ease: EASE,
    },
  });

  // Rendered at the body level: the header's backdrop blur would otherwise
  // trap a fixed overlay inside its own 4rem-tall box.
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 top-16 z-40 flex flex-col bg-ink md:hidden"
        >
          <nav aria-label="Mobile" className="wrap flex flex-1 flex-col overflow-y-auto pb-8 pt-6">
            {/* The pages, numbered, large enough to hit with a thumb */}
            <ul className="flex flex-col">
              {links.map((link, index) => (
                <motion.li key={link.href} {...rise(index)} className="border-b border-line">
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="group flex items-center gap-5 py-5"
                  >
                    <span className="w-6 font-sans text-xs font-semibold tracking-[0.2em] text-crimson-2">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-5xl uppercase leading-none text-paper">
                      {link.label}
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="ml-auto h-5 w-5 text-stone transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </Link>
                </motion.li>
              ))}
            </ul>

            {/* The two actions from the desktop bar, side by side */}
            <motion.div {...rise(links.length)} className="mt-8 grid grid-cols-2 gap-3">
              <Link
                href="/media"
                onClick={onClose}
                className="flex items-center justify-center gap-2 border border-crimson/70 px-4 py-4 font-sans text-sm uppercase tracking-[0.12em] text-paper"
              >
                <Play aria-hidden className="h-3 w-3 fill-current text-crimson-2" />
                Watch
              </Link>
              <Link
                href="/contact"
                onClick={onClose}
                className="flex items-center justify-center border border-paper bg-paper px-4 py-4 font-sans text-sm uppercase tracking-[0.12em] text-ink"
              >
                Contact
              </Link>
            </motion.div>

            {/* A little identity at the foot of the menu */}
            <motion.div
              {...rise(links.length + 1)}
              className="mt-auto flex items-end justify-between pt-10"
            >
              <p className="max-w-[9rem] font-sans text-[11px] uppercase leading-relaxed tracking-[0.2em] text-stone">
                Nepal · World Record Athlete
              </p>
              <span aria-hidden className="-rotate-3 whitespace-nowrap font-signature text-2xl text-crimson-2">
                Hari Chandra Giri
              </span>
            </motion.div>
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
