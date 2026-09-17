"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { ArrowLink } from "@/components/ui/Button";
import type { AthleteRecord } from "@/lib/records";

/**
 * The photo behind the featured record. A wide (landscape) shot works best
 * here — a portrait one gets cropped to a strip. Set to undefined to use the
 * featured record's own photo instead.
 */
const FEATURED_BACKDROP: string | undefined = "/images/records/75-stairs.jpg";

export function FeaturedRecord({ record: featuredRecord }: { record: AthleteRecord }) {
  const ref = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.55], [shouldReduceMotion ? 1 : 0.85, 1]);
  const imageX = useTransform(
    scrollYProgress,
    [0, 1],
    [shouldReduceMotion ? 0 : -36, shouldReduceMotion ? 0 : 36],
  );

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink-2 py-24 sm:py-32">
      <div className="absolute inset-0" aria-hidden>
        <motion.div style={{ x: imageX }} className="relative h-full w-[112%]">
          {featuredRecord.image ? (
            <Image
              src={FEATURED_BACKDROP ?? featuredRecord.image}
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-40"
            />
          ) : (
            <PlaceholderImage
              label={`${featuredRecord.shortTitle}, ${featuredRecord.location} — cinematic still`}
              className="h-full w-full opacity-35"
              showCaption={false}
            />
          )}
        </motion.div>
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/75 to-ink-2/45"
        aria-hidden
      />

      <div className="wrap relative z-10 text-center">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-stone sm:text-sm">
          Featured Record — {featuredRecord.year}
        </p>

        <motion.p
          style={{ scale }}
          className="mt-4 font-display text-[6rem] leading-none text-paper sm:text-[10rem] lg:text-[13rem]"
        >
          {featuredRecord.result}
        </motion.p>

        <p className="mt-1 font-sans text-sm font-semibold uppercase tracking-[0.35em] text-crimson-2 sm:text-base">
          {featuredRecord.unit}
        </p>

        <p className="mx-auto mt-8 max-w-lg font-display text-2xl uppercase leading-tight text-paper sm:text-3xl">
          {featuredRecord.shortTitle}
          <br />
          Walked on Hands
        </p>

        <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-1 border-t border-line pt-6 font-sans text-sm text-stone">
          <p className="text-paper">{featuredRecord.fullTitle}</p>
          <p>
            {featuredRecord.date} · {featuredRecord.location}
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <ArrowLink href={featuredRecord.officialUrl}>Verify on Guinness World Records</ArrowLink>
        </div>
      </div>
    </section>
  );
}
