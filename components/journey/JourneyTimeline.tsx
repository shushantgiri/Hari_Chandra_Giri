"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink, CTAButton } from "@/components/ui/Button";
import { Eyebrow, SectionTitle } from "@/components/ui/typography";
import { cn } from "@/lib/cn";
import { journey } from "@/lib/journey";
import type { AthleteRecord } from "@/lib/records";

const EASE = [0.16, 1, 0.3, 1] as const;
const CHAPTER_IDS = journey.map((milestone) => milestone.id);
const anchorFor = (id: string) => `journey-${id}`;

/**
 * Milestone ids "2021"–"2026" are record years, so a chapter that IS a
 * verified record shows the record itself — result, place, date, links —
 * instead of a blank photo. 2022 had two records in one day; both show.
 * Ids that aren't years ("start", "army") simply have no records.
 */
function recordsForMilestone(id: string, records: AthleteRecord[]): AthleteRecord[] {
  const year = Number(id);
  if (Number.isNaN(year)) return [];
  return records.filter((record) => record.year === year);
}

/** Which chapter is in the reader's eyeline right now, for the sticky nav. */
function useCurrentChapter(ids: string[]) {
  const [current, setCurrent] = useState(ids[0]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(anchorFor(id)))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setCurrent(visible[0].target.id.replace("journey-", ""));
      },
      // A thin line 40% down the viewport. Chapters run edge to edge, so
      // exactly one crosses it at a time, and the hand-off happens the
      // moment the next chapter's heading reaches it.
      { rootMargin: "-40% 0px -59% 0px", threshold: 0 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ids]);

  return current;
}

export function JourneyTimeline({ records }: { records: AthleteRecord[] }) {
  const shouldReduceMotion = useReducedMotion();
  const current = useCurrentChapter(CHAPTER_IDS);
  const currentIndex = Math.max(CHAPTER_IDS.indexOf(current), 0);
  const total = journey.length;

  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  // The line beside the chapters draws itself as the reader scrolls.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.55", "end 0.55"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // On phones the chapter nav is a horizontal strip — keep the current
  // chapter scrolled into its middle. (Scrolling the strip itself, not the
  // page, so this never fights the reader's own scrolling.)
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || window.innerWidth >= 1024) return;
    const link = nav.querySelector<HTMLElement>(`a[href="#${anchorFor(current)}"]`);
    if (!link) return;
    nav.scrollTo({
      left: link.offsetLeft - nav.clientWidth / 2 + link.clientWidth / 2,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  }, [current, shouldReduceMotion]);

  const years = records.map((record) => record.year);
  const firstYear = years.length ? Math.min(...years) : undefined;
  const lastYear = years.length ? Math.max(...years) : undefined;

  const stats = [
    { value: "8", label: "Age he started" },
    { value: firstYear ? String(firstYear) : "—", label: "First world record" },
    { value: String(records.length), label: records.length === 1 ? "World record" : "World records" },
    {
      value: firstYear && lastYear ? `${firstYear}–${lastYear}` : "—",
      label: "Years of titles",
    },
  ];

  return (
    <>
      {/* ——— Opening ——— */}
      <section className="wrap pb-16 pt-14 sm:pb-24 sm:pt-20">
        <Reveal>
          <Eyebrow>Age 8 to World Record Holder</Eyebrow>
          <SectionTitle as="h2" className="mt-3 text-4xl sm:text-6xl lg:text-7xl">
            The Journey
          </SectionTitle>
          <p className="mt-6 max-w-2xl font-display text-2xl uppercase leading-[1.05] text-paper sm:text-3xl lg:text-4xl">
            Nearly two decades of practice, mostly unseen, before his first
            <span className="text-crimson-2"> Guinness World Records</span> title.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-12 grid grid-cols-2 gap-px border border-line bg-line sm:mt-16 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-ink px-5 py-6 sm:px-7 sm:py-8">
              <p className="font-display text-4xl leading-none text-paper sm:text-5xl">{stat.value}</p>
              <p className="mt-2 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-stone sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ——— Chapters ——— */}
      <section id="journey" className="wrap pb-24 sm:pb-32">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Chapter navigation. A sticky strip on phones; a sticky rail on
              desktop. Highlights the chapter being read, and jumps on tap. */}
          <nav
            ref={navRef}
            aria-label="Chapters"
            className={cn(
              "sticky top-16 z-20 -mx-[clamp(1.25rem,5vw,3rem)] flex gap-1 overflow-x-auto border-b border-line bg-ink/90 px-[clamp(1.25rem,5vw,3rem)] py-3 backdrop-blur-md sm:top-20",
              "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              "lg:top-28 lg:col-span-3 lg:mx-0 lg:flex-col lg:gap-0 lg:self-start lg:overflow-visible lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none",
            )}
          >
            {journey.map((milestone, index) => {
              const isCurrent = index === currentIndex;
              const isPast = index < currentIndex;
              return (
                <a
                  key={milestone.id}
                  href={`#${anchorFor(milestone.id)}`}
                  aria-current={isCurrent ? "location" : undefined}
                  className={cn(
                    "group flex shrink-0 items-center gap-3 whitespace-nowrap px-3 py-1.5 font-sans text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300",
                    "lg:px-0 lg:py-2.5",
                    isCurrent ? "text-paper" : isPast ? "text-stone hover:text-paper" : "text-stone/60 hover:text-paper",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "hidden h-px shrink-0 bg-crimson transition-[width] duration-500 ease-out lg:block",
                      isCurrent ? "w-7" : "w-0",
                    )}
                  />
                  <span
                    className={cn(
                      "border-b pb-0.5 transition-colors duration-300 lg:border-0 lg:pb-0",
                      isCurrent ? "border-crimson" : "border-transparent",
                    )}
                  >
                    {milestone.marker}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* The chapters themselves, along a line that draws as you scroll */}
          <ol ref={listRef} className="relative mt-12 lg:col-span-9 lg:mt-0">
            <span aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-line" />
            <motion.span
              aria-hidden
              style={{ scaleY: shouldReduceMotion ? 1 : lineScale }}
              className="absolute bottom-0 left-0 top-0 w-px origin-top bg-crimson"
            />

            {journey.map((milestone, index) => {
              const milestoneRecords = recordsForMilestone(milestone.id, records);
              const reached = index <= currentIndex;

              return (
                <li
                  key={milestone.id}
                  id={anchorFor(milestone.id)}
                  className={cn(
                    "relative scroll-mt-36 pl-8 sm:pl-14 lg:scroll-mt-28",
                    index < total - 1 && "pb-20 sm:pb-28",
                  )}
                >
                  {/* Dot on the line — fills once the reader reaches it */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-0 top-2 h-3 w-3 -translate-x-1/2 rounded-full border transition-colors duration-500",
                      reached ? "border-crimson bg-crimson" : "border-line-strong bg-ink",
                    )}
                  />

                  <Reveal>
                    <div className="flex items-center gap-4">
                      <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-crimson-2">
                        {milestone.marker}
                      </span>
                      <span aria-hidden className="h-px w-10 bg-line" />
                      <span className="font-sans text-xs text-stone">
                        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="mt-4 max-w-2xl font-display text-4xl uppercase leading-[0.95] text-paper sm:text-6xl">
                      {milestone.title}
                    </h3>
                  </Reveal>

                  {milestoneRecords.length > 0 ? (
                    <div className="mt-8 grid gap-4 sm:mt-10">
                      {milestoneRecords.map((record, recordIndex) => (
                        <Reveal key={record.id} delay={0.1 + recordIndex * 0.08}>
                          <RecordPlate record={record} shouldReduceMotion={Boolean(shouldReduceMotion)} />
                        </Reveal>
                      ))}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>

        {/* ——— Where it goes next ——— */}
        <Reveal className="mt-24 border-t border-line pt-14 sm:mt-32 sm:pt-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow>Next Chapter</Eyebrow>
              <p className="mt-3 max-w-xl font-display text-3xl uppercase leading-[1.02] text-paper sm:text-5xl">
                {records.length ? `${records.length} titles so far.` : "The record book, so far."}
                <br />
                <span className="text-stone">The next attempt is already in training.</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <CTAButton href="/records">See the records</CTAButton>
              <ArrowLink href="/contact" external={false}>
                Get in touch
              </ArrowLink>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

/**
 * A verified record, as it sits inside its chapter: the real result, place
 * and date, its photo where one exists, and a way through to the record's
 * own page and its Guinness World Records source. Never a mock-up.
 */
function RecordPlate({
  record,
  shouldReduceMotion,
}: {
  record: AthleteRecord;
  shouldReduceMotion: boolean;
}) {
  return (
    <motion.article
      whileHover={shouldReduceMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="group grid overflow-hidden border border-line bg-ink-2 sm:grid-cols-12"
    >
      {record.image ? (
        <div className="relative aspect-[4/3] sm:col-span-4 sm:aspect-auto sm:min-h-[220px]">
          <Image
            src={record.image}
            alt={record.fullTitle}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
      ) : null}

      <div className={cn("p-5 sm:p-7", record.image ? "sm:col-span-8" : "sm:col-span-12")}>
        <div className="flex items-center gap-2">
          <ShieldCheck aria-hidden className="h-3.5 w-3.5 shrink-0 text-crimson-2" />
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-stone">
            Guinness World Records · {record.date}
          </p>
        </div>

        <p className="mt-3 font-display text-2xl uppercase leading-[0.98] text-paper sm:text-3xl">
          {record.fullTitle}
        </p>

        <p className="mt-4 font-display text-5xl leading-none text-crimson-2 sm:text-6xl">
          {record.result}
          <span className="ml-2 align-middle font-sans text-xs font-medium uppercase tracking-[0.2em] text-stone">
            {record.unit}
          </span>
        </p>

        <p className="mt-3 font-sans text-sm text-stone">{record.location}</p>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <ArrowLink href={`/records/${record.slug}`} external={false}>
            The full story
          </ArrowLink>
          <ArrowLink href={record.officialUrl}>Verify</ArrowLink>
        </div>
      </div>
    </motion.article>
  );
}
