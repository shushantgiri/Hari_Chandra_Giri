import Link from "next/link";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { cn } from "@/lib/cn";

type CTAProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent";
  className?: string;
  external?: boolean;
  /** Trailing icon — "arrow" (default) or "play" for watch/video CTAs. */
  icon?: "arrow" | "play";
};

/**
 * Primary / secondary / accent call-to-action. Typography and a thin border
 * carry the design, per the brief — no oversized rounded, glowing buttons.
 */
export function CTAButton({
  href,
  children,
  variant = "primary",
  className,
  external,
  icon = "arrow",
}: CTAProps) {
  const base =
    "group inline-flex items-center gap-2.5 border px-6 py-3.5 font-sans text-sm font-medium uppercase tracking-[0.12em] transition-colors duration-300 ease-out";
  const variants: Record<NonNullable<CTAProps["variant"]>, string> = {
    primary: "border-paper bg-paper text-ink hover:bg-transparent hover:text-paper",
    secondary: "border-line-strong text-paper hover:border-paper",
    accent: "border-crimson bg-crimson text-paper hover:bg-transparent hover:text-crimson-2",
  };

  const Icon = icon === "play" ? Play : ArrowRight;

  const content = (
    <>
      <span>{children}</span>
      {icon === "play" ? (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current">
          <Icon aria-hidden className="h-2 w-2 fill-current" />
        </span>
      ) : (
        <Icon
          aria-hidden
          className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1.5"
        />
      )}
    </>
  );

  const classes = cn(base, variants[variant], className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

/**
 * Small "VIEW RECORD →" style link used in timeline rows, press rows and
 * verification links. External by default since it usually points off-site
 * to Guinness World Records.
 */
export function ArrowLink({
  href,
  children,
  external = true,
  className,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  const Icon = external ? ArrowUpRight : ArrowRight;

  const classes = cn(
    "group inline-flex items-center gap-1.5 font-sans text-xs sm:text-sm font-medium uppercase tracking-[0.1em] text-paper transition-colors duration-300 hover:text-crimson-2",
    className,
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        <Icon className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
      <Icon className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}
