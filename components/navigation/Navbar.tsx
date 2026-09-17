"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, Play, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { NAV_LINKS } from "@/lib/nav";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-out",
        scrolled || menuOpen
          ? "border-b border-line bg-ink/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="wrap flex h-16 items-center justify-between sm:h-20">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="font-display text-[1.35rem] tracking-wide text-paper sm:text-[1.7rem]"
        >
          Hari Chandra Giri
        </Link>

        <nav aria-label="Primary" className="hidden md:flex md:items-center md:gap-9">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-sm uppercase tracking-[0.12em] text-paper/80 transition-colors duration-300 hover:text-paper"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex md:items-center md:gap-6">
          <Link
            href="/contact"
            className="font-sans text-sm uppercase tracking-[0.12em] text-paper/80 transition-colors duration-300 hover:text-paper"
          >
            Contact
          </Link>
          <Link
            href="/media"
            className="group flex items-center gap-2 border border-crimson/70 px-4 py-2 font-sans text-sm uppercase tracking-[0.12em] text-paper transition-colors duration-300 hover:border-crimson-2"
          >
            <Play aria-hidden className="h-3 w-3 fill-current text-crimson-2" />
            Watch
          </Link>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 flex h-11 w-11 items-center justify-center text-paper md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
        </button>
      </div>

      <MobileMenu open={menuOpen} onClose={closeMenu} links={NAV_LINKS} />
    </header>
  );
}
