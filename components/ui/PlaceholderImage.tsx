import { cn } from "@/lib/cn";

/**
 * Stands in for real photography. Tasteful, on-brand, and explicitly
 * labelled (in a corner caption, the way a photo credit reads) rather than
 * a broken image icon or a stock photo of someone else.
 *
 * Swap for a real <Image src="/images/..." alt="..." fill /> once
 * photography is available — see /public/images/README.md.
 */
export function PlaceholderImage({
  label,
  className,
  captionClassName,
  showCaption = true,
}: {
  label: string;
  className?: string;
  captionClassName?: string;
  showCaption?: boolean;
}) {
  return (
    <div role="img" aria-label={label} className={cn("photo-placeholder", className)}>
      {showCaption ? (
        <span
          className={cn(
            "absolute bottom-3 right-3 z-10 max-w-[80%] text-right font-sans text-[0.6rem] uppercase leading-snug tracking-[0.15em] text-paper/35",
            captionClassName,
          )}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}
