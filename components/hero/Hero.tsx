"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { CTAButton } from "@/components/ui/Button";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ recordCount }: { recordCount: number }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 90]);
  const typeY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 140]);

  const stagger = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.55,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 26 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.6 : 0.9, ease: EASE },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink"
    >
      {/* The photograph. On phones it fills the screen behind the copy; on
          desktop it becomes a tall panel on the right, fading into the ink
          so the name sits on clean dark space beside it. One-time vertical
          wipe on load, gentle drift on scroll. */}
      <motion.div
        style={{ y: photoY }}
        initial={shouldReduceMotion ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
        animate={shouldReduceMotion ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ duration: shouldReduceMotion ? 0.6 : 1.3, ease: EASE }}
        className="absolute inset-y-0 right-0 h-[112%] w-full lg:w-[54%] 2xl:w-1/2"
        aria-hidden
      >
        <Image
          src="/images/lemon-juice-handstand.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 54vw, 100vw"
          className="object-cover object-[50%_35%] lg:object-center"
        />
        {/* Blend the panel into the page: left edge, bottom edge, and a
            light overall tint so the copy always wins */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/55 via-40% to-ink/10 lg:from-ink lg:via-ink/35 lg:via-30% lg:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 via-40% to-ink/40" />
        {/* Keep the header and the top-right tagline legible over the photo */}
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-ink/90 via-ink/40 to-transparent" />
      </motion.div>

      {/* "Small steps. Bigger records." — upper right, desktop only */}
      <div className="absolute inset-x-0 top-28 z-10 hidden lg:block">
        <div className="wrap flex justify-end">
          <div className="flex items-start gap-3">
            <span aria-hidden className="mt-1 h-16 w-px shrink-0 bg-crimson" />
            <p className="font-sans text-sm font-medium uppercase leading-snug tracking-[0.12em] text-paper">
              Small Steps.
              <br />
              Bigger Records.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        style={{ y: typeY }}
        className="wrap relative z-10 flex h-full flex-col justify-end pb-14 pt-24 sm:justify-center sm:pb-0"
      >
        <motion.p
          variants={item}
          className="flex items-center gap-3 font-sans text-xs font-medium uppercase tracking-[0.25em] text-stone sm:text-sm"
        >
          <span aria-hidden className="h-px w-6 bg-crimson" />
          Nepal · World Record Athlete
        </motion.p>

        <motion.h1
          variants={item}
          // Capped by screen height as well as width: on a wide, short
          // screen (a laptop with the browser's bars taking space) the
          // name shrinks so the buttons never fall off the bottom.
          className="mt-4 font-display text-[clamp(2.75rem,8vh,3.75rem)] uppercase leading-[0.9] text-paper sm:text-[clamp(3.5rem,9.5vh,6rem)] lg:text-[clamp(4rem,11.5vh,7.5rem)] 2xl:text-[clamp(4rem,11.5vh,8.5rem)]"
        >
          Hari
          <br />
          Chandra
          <br />
          <span className="whitespace-nowrap">
            Giri
            {/* Signature flourish, sized from the name so it always sits
                beside "Giri". Decorative: the heading already reads the name. */}
            <span
              aria-hidden
              className="ml-5 hidden -rotate-3 align-baseline font-signature text-[0.34em] normal-case tracking-normal text-crimson-2 sm:inline-block"
            >
              Hari Chandra Giri
            </span>
          </span>
        </motion.h1>

        <motion.p variants={item} className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-display text-4xl text-crimson-2 sm:text-5xl">{recordCount}×</span>
          <span className="font-display text-2xl uppercase tracking-wide text-paper sm:text-3xl">
            World Record Holder
          </span>
        </motion.p>

        <motion.p
          variants={item}
          className="mt-3 max-w-sm font-sans text-sm uppercase tracking-[0.1em] text-paper/70 sm:text-base"
        >
          Hand-walking. Balance. Precision.
        </motion.p>

        <motion.div variants={item} className="mt-7 flex flex-wrap items-center gap-4">
          <CTAButton href="/records" variant="accent">
            Explore Records
          </CTAButton>
          <CTAButton href="/media" variant="secondary" icon="play">
            Watch the Records
          </CTAButton>
        </motion.div>
      </motion.div>

      {/* Nepal badge — bottom right, desktop only */}
      <div className="absolute bottom-7 right-6 z-10 hidden items-center gap-2 sm:right-8 lg:flex">
        <NepalFlag className="h-3.5 w-[1.1rem] shrink-0" />
        <span className="font-sans text-xs font-medium uppercase tracking-[0.15em] text-paper/80">
          Nepal
        </span>
        <span aria-hidden className="h-px w-6 bg-paper/30" />
      </div>

    </section>
  );
}

/** Simplified — not a pixel-precise heraldic rendering, just enough to read as Nepal's flag at badge size. */
function NepalFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 64" className={className} aria-hidden>
      <polygon
        points="1,2 40,15 1,28"
        className="fill-crimson"
        stroke="#00308f"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <polygon
        points="1,24 46,44 1,62"
        className="fill-crimson"
        stroke="#00308f"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="15" cy="11" r="2.6" className="fill-paper" />
      <circle cx="17" cy="39" r="3.2" className="fill-paper" />
    </svg>
  );
}
