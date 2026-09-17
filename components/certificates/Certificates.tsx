"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow, SectionTitle } from "@/components/ui/typography";
import { cn } from "@/lib/cn";
import type { AthleteRecord } from "@/lib/records";

const EASE = [0.16, 1, 0.3, 1] as const;

/** How long each certificate holds the centre before the row moves on. */
const AUTO_ADVANCE_MS = 4200;
/** 1 = the row slides left (next certificate comes in from the right). -1 reverses it. */
const AUTO_ADVANCE_DIRECTION = 1;
/** A drag counts as a swipe past this distance (px) or speed (px/s). */
const SWIPE_DISTANCE_PX = 50;
const SWIPE_VELOCITY = 350;

/**
 * Where a certificate sits, by how many steps it is from the centre.
 * x is a % of one card's width, so the whole row scales with the card.
 */
const SLOTS = [
  { x: 0, scale: 1, opacity: 1, blur: 0 },
  { x: 72, scale: 0.8, opacity: 0.55, blur: 2 },
  { x: 132, scale: 0.64, opacity: 0.22, blur: 5 },
] as const;
/** Anything further out is parked here, invisible, ready to slide in. */
const OFFSTAGE = { x: 180, scale: 0.5, opacity: 0, blur: 6 } as const;

const wrap = (i: number, total: number) => ((i % total) + total) % total;

/** Shortest signed distance from the active card, so the row loops seamlessly. */
function offsetFrom(index: number, active: number, total: number) {
  let offset = index - active;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

/** Open on the newest real certificate photo; failing that, the featured record. */
function initialIndex(records: AthleteRecord[]) {
  for (let i = records.length - 1; i >= 0; i -= 1) {
    if (records[i].certificateImage) return i;
  }
  const featured = records.findIndex((record) => record.featured);
  return featured === -1 ? Math.max(records.length - 1, 0) : featured;
}

export function Certificates({ records }: { records: AthleteRecord[] }) {
  const shouldReduceMotion = useReducedMotion();
  const total = records.length;

  const [active, setActive] = useState(() => initialIndex(records));
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set the moment a drag starts, cleared just after it ends, so the click
  // that the browser fires at the end of a drag doesn't open the popup.
  const draggedRef = useRef(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const goTo = (index: number) => setActive(wrap(index, total));
  const next = () => setActive((current) => wrap(current + 1, total));
  const prev = () => setActive((current) => wrap(current - 1, total));

  useEffect(() => setMounted(true), []);

  // Auto-advance. Re-armed on every change, so a manual move always gets a
  // full beat before the row carries on. Pauses on hover, focus, drag, while
  // the popup is open, and never runs under reduced-motion.
  useEffect(() => {
    if (total < 2 || hovering || focused || dragging || open || shouldReduceMotion) return;
    const id = setTimeout(
      () => setActive((current) => wrap(current + AUTO_ADVANCE_DIRECTION, total)),
      AUTO_ADVANCE_MS,
    );
    return () => clearTimeout(id);
  }, [active, total, hovering, focused, dragging, open, shouldReduceMotion]);

  // Popup: Escape closes, arrow keys page, the page behind stops scrolling,
  // and focus comes back to where it was afterwards.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      else if (event.key === "ArrowRight") setActive((current) => wrap(current + 1, total));
      else if (event.key === "ArrowLeft") setActive((current) => wrap(current - 1, total));
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      // Back to whichever card is in the centre now — it may have changed
      // while paging inside the popup. (The centre card is the only one
      // that's focusable.)
      const centreCard = rowRef.current?.querySelector<HTMLButtonElement>('button[tabindex="0"]');
      (centreCard ?? previouslyFocused)?.focus();
    };
  }, [open, total]);

  if (total === 0) return null;

  const current = records[active];
  // With fewer than five cards, only the immediate neighbours are shown —
  // otherwise a card would visibly fly across the stage when the row wraps.
  const maxVisible = total >= 5 ? 2 : 1;

  return (
    <section className="overflow-hidden py-16 sm:py-20">
      <div className="wrap">
        <Eyebrow>Official Records</Eyebrow>
        <SectionTitle className="mt-3">The Proof</SectionTitle>
      </div>

      {/* The row. The active certificate is sharp and centred; the ones either
          side sit behind it, smaller and softly blurred. */}
      <div
        className="relative mt-8 sm:mt-10"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        // Keyboard focus pauses the row (so it holds still while someone
        // tabs through it); focus left behind by a mouse click does not.
        onFocus={(event) => setFocused(event.target.matches(":focus-visible"))}
        onBlur={() => setFocused(false)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            next();
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            prev();
          }
        }}
      >
        <motion.div
          ref={rowRef}
          className={cn(
            "relative mx-auto aspect-[7/10] w-[min(68vw,calc(0.7*clamp(20rem,42vh,47.5rem)))] select-none",
            total > 1 && (dragging ? "cursor-grabbing" : "cursor-grab"),
          )}
          style={{ touchAction: "pan-y" }}
          drag={total > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          dragMomentum={false}
          onDragStart={() => {
            draggedRef.current = true;
            setDragging(true);
          }}
          onDragEnd={(_, info) => {
            setDragging(false);
            if (info.offset.x < -SWIPE_DISTANCE_PX || info.velocity.x < -SWIPE_VELOCITY) next();
            else if (info.offset.x > SWIPE_DISTANCE_PX || info.velocity.x > SWIPE_VELOCITY) prev();
            setTimeout(() => {
              draggedRef.current = false;
            }, 0);
          }}
        >
          {records.map((record, index) => {
            const offset = offsetFrom(index, active, total);
            const distance = Math.abs(offset);
            const isActive = distance === 0;
            const visible = distance <= maxVisible;
            const slot = visible ? SLOTS[distance] : OFFSTAGE;
            const side = Math.sign(offset);

            return (
              <motion.button
                key={record.id}
                type="button"
                tabIndex={isActive ? 0 : -1}
                aria-hidden={!isActive}
                aria-label={isActive ? `Open certificate — ${record.shortTitle}` : undefined}
                onClick={() => {
                  if (draggedRef.current) return;
                  if (isActive) setOpen(true);
                  else goTo(index);
                }}
                initial={false}
                animate={{
                  x: `${side * slot.x}%`,
                  scale: slot.scale,
                  opacity: slot.opacity,
                  filter: `blur(${slot.blur}px)`,
                }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: EASE }}
                style={{ zIndex: 10 - distance, pointerEvents: visible ? "auto" : "none" }}
                className={cn(
                  "absolute inset-0 overflow-hidden bg-ink-2",
                  isActive
                    ? "cursor-zoom-in shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]"
                    : "cursor-pointer",
                )}
              >
                <CertificatePlate record={record} variant="stage" />
              </motion.button>
            );
          })}
        </motion.div>

        {/* Caption for whichever certificate is in the centre */}
        <div className="wrap mt-5 text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -6 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <p className="font-display text-xl uppercase text-paper sm:text-2xl">
                {current.shortTitle}
              </p>
              <p className="mt-1 font-sans text-xs text-stone sm:text-sm">
                {current.location} · {current.date}
              </p>
            </motion.div>
          </AnimatePresence>

          {total > 1 ? (
            <div className="mt-4 flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous certificate"
                className="rounded-full p-1.5 text-stone transition-colors duration-300 hover:text-paper"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <div className="flex items-center gap-2">
                {records.map((record, index) => (
                  <button
                    key={record.id}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`Go to ${record.shortTitle}`}
                    aria-current={index === active ? "true" : undefined}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      index === active ? "w-8 bg-crimson" : "w-3 bg-paper/25 hover:bg-paper/50",
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={next}
                aria-label="Next certificate"
                className="rounded-full p-1.5 text-stone transition-colors duration-300 hover:text-paper"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Popup — rendered at the body level so no ancestor transform can
          trap the fixed overlay inside the section. */}
      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label={`Certificate — ${current.shortTitle}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-ink/95 p-4 sm:p-10"
                  onClick={() => setOpen(false)}
                >
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="fixed right-4 top-4 z-10 rounded-full p-2 text-paper/80 transition-colors duration-300 hover:bg-paper/10 hover:text-paper sm:right-8 sm:top-8"
                  >
                    <X className="h-6 w-6" aria-hidden />
                  </button>

                  {total > 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          prev();
                        }}
                        aria-label="Previous certificate"
                        className="fixed left-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-paper/70 transition-colors duration-300 hover:bg-paper/10 hover:text-paper sm:left-6"
                      >
                        <ChevronLeft className="h-7 w-7" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          next();
                        }}
                        aria-label="Next certificate"
                        className="fixed right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-paper/70 transition-colors duration-300 hover:bg-paper/10 hover:text-paper sm:right-6"
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
                    className="my-auto w-full max-w-4xl"
                  >
                    <div className="relative mx-auto h-[60vh] w-full overflow-hidden sm:h-[72vh]">
                      <CertificatePlate record={current} variant="popup" />
                    </div>
                    <div className="mt-6 text-center">
                      <p className="font-display text-2xl uppercase text-paper sm:text-3xl">
                        {current.shortTitle}
                      </p>
                      <p className="mt-2 font-sans text-sm text-stone">
                        {current.location} · {current.date}
                      </p>
                      <div className="mt-4 flex justify-center">
                        <ArrowLink href={current.officialUrl}>
                          Verify on Guinness World Records
                        </ArrowLink>
                      </div>
                      {total > 1 ? (
                        <p className="mt-4 font-sans text-xs text-stone">
                          {String(active + 1).padStart(2, "0")} /{" "}
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

/**
 * One certificate. The real photo where there is one; otherwise a plain
 * paper plate carrying the record's details and an honest "scan pending"
 * — never a mocked-up certificate. The moment a certificate photo is added
 * to the record in /admin, the plate is replaced by it automatically.
 */
function CertificatePlate({
  record,
  variant,
}: {
  record: AthleteRecord;
  variant: "stage" | "popup";
}) {
  if (record.certificateImage) {
    return (
      <Image
        src={record.certificateImage}
        alt={`Guinness World Records certificate — ${record.fullTitle}`}
        fill
        sizes={variant === "popup" ? "(min-width: 1024px) 40rem, 100vw" : "(min-width: 640px) 540px, 68vw"}
        className="pointer-events-none object-contain"
        draggable={false}
        // Load with the page rather than on scroll, so the row is never
        // caught with empty frames the first time someone reaches it.
        loading={variant === "stage" ? "eager" : undefined}
      />
    );
  }

  const big = variant === "popup";

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-paper px-6 pb-8 pt-6 text-center text-ink sm:px-10">
      <span aria-hidden className="pointer-events-none absolute inset-[10px] border border-ink/15" />
      <span aria-hidden className="pointer-events-none absolute inset-[14px] border border-ink/[0.08]" />

      <p
        className={cn(
          "font-sans font-medium uppercase tracking-[0.3em] text-ink/50",
          big ? "text-xs" : "text-[9px] sm:text-[10px]",
        )}
      >
        World Record · {record.year}
      </p>
      <p
        className={cn(
          "mt-3 max-w-[18ch] font-display uppercase leading-[0.95] text-ink",
          big ? "text-3xl sm:text-5xl" : "text-xl sm:text-3xl",
        )}
      >
        {record.fullTitle}
      </p>
      <p className={cn("mt-3 font-display text-crimson", big ? "text-5xl sm:text-7xl" : "text-3xl sm:text-5xl")}>
        {record.result}
        <span
          className={cn(
            "ml-2 align-middle font-sans font-medium uppercase tracking-[0.2em] text-ink/60",
            big ? "text-xs sm:text-sm" : "text-[9px] sm:text-xs",
          )}
        >
          {record.unit}
        </span>
      </p>
      <p className={cn("mt-3 font-sans text-ink/60", big ? "text-sm" : "text-[10px] sm:text-xs")}>
        {record.date} · {record.location}
      </p>

      <p
        className={cn(
          "absolute inset-x-0 bottom-4 font-sans font-medium uppercase tracking-[0.3em] text-ink/40",
          big ? "text-[11px]" : "text-[8px] sm:text-[9px]",
        )}
      >
        Certificate scan pending
      </p>
    </div>
  );
}
