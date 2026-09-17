import { cn } from "@/lib/cn";

/**
 * Small tracked-out label used above section headlines and in the hero.
 * Used deliberately, not on every heading — see each section for whether
 * it earns one.
 */
export function Eyebrow({
  children,
  className,
  tone = "stone",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "stone" | "crimson" | "paper";
}) {
  const toneClass =
    tone === "crimson" ? "text-crimson-2" : tone === "paper" ? "text-paper" : "text-stone";

  return (
    <p
      className={cn(
        "font-sans text-xs sm:text-sm font-medium uppercase tracking-[0.2em]",
        toneClass,
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionTitle({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3";
}) {
  return (
    <Tag
      className={cn(
        "font-display uppercase leading-[0.95] text-paper",
        "text-3xl sm:text-4xl lg:text-5xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function BodyText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("font-sans text-base sm:text-lg leading-relaxed text-stone", className)}>
      {children}
    </p>
  );
}
