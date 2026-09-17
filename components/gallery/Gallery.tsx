"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow, SectionTitle } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import type { AthleteRecord } from "@/lib/records";

const EASE = [0.16, 1, 0.3, 1] as const;

const overlayButton = cn(
  "fixed z-10 rounded-full p-2 text-paper/70",
  "transition-colors duration-300 hover:bg-paper/10 hover:text-paper",
);

/**
 * The records that have a photograph, newest first, as one clean row of
 * frames. A record joins the row the moment a photo is added to it in
 * /admin; until then it simply isn't here.
 */
export function Gallery({ records }: { records: AthleteRecord[] }) {
  const photos = records.filter((record) => record.image).reverse();
  const total = photos.length;

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Popup: Escape closes, arrows page, the page behind stops scrolling.
  useEffect(() => {
    if (open === null) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
      else if (event.key === "ArrowRight") {
        setOpen((i) => (i === null ? i : (i + 1) % total));
      } else if (event.key === "ArrowLeft") {
        setOpen((i) => (i === null ? i : (i - 1 + total) % total));
      }
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, total]);

  if (total === 0) return null;
  const current = open === null ? null : photos[open];

  const goPrev = () => setOpen((i) => (i === null ? i : (i - 1 + total) % total));
  const goNext = () => setOpen((i) => (i === null ? i : (i + 1) % total));

  return (
    <section className="wrap py-16 sm:py-20">
      <Reveal>
        <Eyebrow>In Motion</Eyebrow>
        <SectionTitle className="mt-3">The Records, in Frame</SectionTitle>
      </Reveal>

      {/* On phones: one row, swipe left to right. On desktop: the frames
          wrap and centre, so any number of photos lines up cleanly. */}
      <div
        className={cn(
          "mt-8 flex gap-4 sm:mt-10",
          "-mx-[clamp(1.25rem,5vw,3rem)] snap-x snap-mandatory overflow-x-auto",
          "px-[clamp(1.25rem,5vw,3rem)] pb-2 scroll-px-[clamp(1.25rem,5vw,3rem)]",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "lg:mx-0 lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-0 lg:pb-0",
        )}
      >
        {photos.map((record, i) => (
          <Reveal
            key={record.id}
            delay={Math.min(i, 4) * 0.06}
            className="w-[68vw] shrink-0 snap-start sm:w-[40vw] lg:w-[calc(25%-0.75rem)]"
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`${record.shortTitle}, ${record.year} — open`}
              className="group block w-full text-left"
            >
              <span className="relative block aspect-[4/5] w-full overflow-hidden bg-ink-2">
                <Image
                  src={record.image!}
                  alt={record.fullTitle}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className={cn(
                    "object-cover transition-transform duration-700 ease-out",
                    "group-hover:scale-[1.04]",
                  )}
                />
              </span>
              <span className="mt-3 block font-display text-lg uppercase leading-none text-paper sm:text-xl">
                {record.shortTitle}
              </span>
              <span className="mt-1.5 block font-sans text-[11px] uppercase tracking-[0.15em] text-stone">
                <span className="text-crimson-2">{record.result}</span> {record.unit} · {record.year}
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {/* Popup — the photo whole, with the record's details */}
      {mounted
        ? createPortal(
          <AnimatePresence>
            {current ? (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={`${current.shortTitle}, ${current.year}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "fixed inset-0 z-[60] flex items-center justify-center",
                  "overflow-y-auto bg-ink/95 p-4 sm:p-10",
                )}
                onClick={() => setOpen(null)}
              >
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setOpen(null)}
                  aria-label="Close"
                  className={cn(overlayButton, "right-4 top-4 sm:right-8 sm:top-8")}
                >
                  <X className="h-6 w-6" aria-hidden />
                </button>

                {total > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        goPrev();
                      }}
                      aria-label="Previous"
                      className={cn(overlayButton, "left-2 top-1/2 -translate-y-1/2 sm:left-6")}
                    >
                      <ChevronLeft className="h-7 w-7" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        goNext();
                      }}
                      aria-label="Next"
                      className={cn(overlayButton, "right-2 top-1/2 -translate-y-1/2 sm:right-6")}
                    >
                      <ChevronRight className="h-7 w-7" aria-hidden />
                    </button>
                  </>
                ) : null}

                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  onClick={(event) => event.stopPropagation()}
                  className={cn(
                    "my-auto grid w-full max-w-5xl gap-8",
                    "lg:grid-cols-12 lg:items-center lg:gap-12",
                  )}
                >
                  <div
                    className={cn(
                      "relative h-[46vh] w-full overflow-hidden bg-ink-2",
                      "sm:h-[58vh] lg:col-span-7 lg:h-[66vh]",
                    )}
                  >
                    {/* Whole and uncropped, whatever its shape, on a blurred copy */}
                    <Image
                      src={current.image!}
                      alt=""
                      aria-hidden
                      fill
                      sizes="60vw"
                      className="scale-110 object-cover opacity-40 blur-2xl"
                    />
                    <Image
                      src={current.image!}
                      alt={current.fullTitle}
                      fill
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="object-contain"
                    />
                  </div>
                  <div className="lg:col-span-5">
                    <p
                      className={cn(
                        "font-sans text-xs font-semibold uppercase",
                        "tracking-[0.25em] text-crimson-2",
                      )}
                    >
                      {current.year}
                    </p>
                    <p
                      className={cn(
                        "mt-3 font-display text-3xl uppercase leading-[0.95]",
                        "text-paper sm:text-5xl",
                      )}
                    >
                      {current.fullTitle}
                    </p>
                    <p className="mt-5 font-display text-5xl leading-none text-paper sm:text-6xl">
                      {current.result}
                      <span
                        className={cn(
                          "ml-2 align-middle font-sans text-xs font-medium uppercase",
                          "tracking-[0.2em] text-stone",
                        )}
                      >
                        {current.unit}
                      </span>
                    </p>
                    <p className="mt-4 font-sans text-sm text-stone">
                      {current.location} · {current.date}
                    </p>
                    <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                      <ArrowLink href={`/records/${current.slug}`} external={false}>
                        The full story
                      </ArrowLink>
                      <ArrowLink href={current.officialUrl}>Verify</ArrowLink>
                    </div>
                    {total > 1 ? (
                      <p className="mt-8 font-sans text-xs text-stone">
                        {String((open ?? 0) + 1).padStart(2, "0")} /{" "}
                        {String(total).padStart(2, "0")}
                      </p>
                    ) : null}
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body,
        )
        : null}
    </section>
  );
}