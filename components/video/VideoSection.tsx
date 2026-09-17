"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Play, X } from "lucide-react";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow, SectionTitle } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

/**
 * Real footage, all on YouTube. Each entry is either one video (id) or a
 * whole playlist (list) — Hari's own channel's uploads play as a playlist,
 * so the site shows whatever he posts next without any change here.
 * Nothing loads from YouTube until a video is opened.
 */
interface VideoItem {
  key: string;
  /** YouTube video id, e.g. "heELyuaOH14" */
  id?: string;
  /** YouTube playlist id, e.g. a channel's uploads ("UU…") */
  list?: string;
  title: string;
  meta: string;
  /** Poster for a playlist (a single video takes its own YouTube thumbnail) */
  poster?: string;
}

const CHANNEL_ID = "UCPuew-BcclwCXw80063Fsow";
const HARI_CHANNEL_URL = `https://www.youtube.com/channel/${CHANNEL_ID}`;
const GWR_FILM_URL =
  "https://www.guinnessworldrecords.com/openvideo/v/" +
  "hari-chandra-giris-hand-walking-world-records";

const VIDEOS: VideoItem[] = [
  {
    key: "channel",
    // A channel's uploads playlist is its id with "UC" swapped for "UU".
    list: "UU" + CHANNEL_ID.slice(2),
    title: "Latest from Hari's channel",
    meta: "HG Fitness · YouTube",
    poster: "/images/records/75-stairs.jpg",
  },
  {
    key: "2025-title",
    id: "heELyuaOH14",
    title: "Another world records title",
    meta: "News report · 2025",
  },
  {
    key: "fifth-record",
    id: "7uwxF8Ep1M4",
    title: "The fifth world record",
    meta: "News report · 2024",
  },
  {
    key: "miracle-man",
    id: "wTHzAkUssek",
    title: "The Miracle Man of Nepal",
    meta: "Balance Media Network · 2021",
  },
];

const PARAMS = "autoplay=1&rel=0&modestbranding=1&playsinline=1";

function embedUrl(video: VideoItem) {
  const base = "https://www.youtube-nocookie.com/embed/";
  return video.list
    ? `${base}videoseries?list=${video.list}&${PARAMS}`
    : `${base}${video.id}?${PARAMS}`;
}

function watchUrl(video: VideoItem) {
  return video.list
    ? `https://www.youtube.com/playlist?list=${video.list}`
    : `https://www.youtube.com/watch?v=${video.id}`;
}

function thumb(video: VideoItem, size: "hq" | "max") {
  if (video.poster) return video.poster;
  const file = size === "max" ? "maxresdefault" : "hqdefault";
  return `https://i.ytimg.com/vi/${video.id}/${file}.jpg`;
}

export function VideoSection() {
  const [open, setOpen] = useState<VideoItem | null>(null);
  const [mounted, setMounted] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  // Player popup: Escape closes, the page behind stops scrolling.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
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
  }, [open]);

  return (
    <section id="media" className="wrap py-16 sm:py-20">
      <Reveal>
        <Eyebrow>Footage</Eyebrow>
        <SectionTitle className="mt-3">Watch the Records</SectionTitle>
      </Reveal>

      {/* One clean row: a still for each film, its name underneath */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-10 lg:grid-cols-4">
        {VIDEOS.map((video, i) => (
          <Reveal key={video.key} delay={i * 0.06}>
            <button
              type="button"
              onClick={() => setOpen(video)}
              aria-label={`Play — ${video.title}`}
              className="group block w-full text-left"
            >
              <span className="relative block aspect-video w-full overflow-hidden bg-ink-2">
                <Poster video={video} size="hq" sizes="(min-width: 1024px) 25vw, 50vw" />
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                    "flex h-11 w-11 items-center justify-center sm:h-12 sm:w-12",
                    "rounded-full border border-paper/70 bg-ink/45 backdrop-blur-sm",
                    "transition-transform duration-300 group-hover:scale-105",
                  )}
                >
                  <Play className="ml-0.5 h-4 w-4 fill-current text-paper" />
                </span>
              </span>
              <span className="mt-3 block font-display text-lg uppercase leading-none text-paper sm:text-xl">
                {video.title}
              </span>
              <span className="mt-1.5 block font-sans text-[11px] uppercase tracking-[0.15em] text-stone">
                {video.meta}
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
        <ArrowLink href={GWR_FILM_URL}>The Guinness World Records film</ArrowLink>
        <ArrowLink href={HARI_CHANNEL_URL}>Hari on YouTube</ArrowLink>
      </div>

      {/* Player popup — big, and only loaded from YouTube once opened */}
      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label={open.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "fixed inset-0 z-[60] flex items-center justify-center",
                    "bg-ink/95 p-4 sm:p-10",
                  )}
                  onClick={() => setOpen(null)}
                >
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={() => setOpen(null)}
                    aria-label="Close"
                    className={cn(
                      "fixed right-4 top-4 z-10 rounded-full p-2 text-paper/80",
                      "transition-colors duration-300 hover:bg-paper/10 hover:text-paper",
                      "sm:right-8 sm:top-8",
                    )}
                  >
                    <X className="h-6 w-6" aria-hidden />
                  </button>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    onClick={(event) => event.stopPropagation()}
                    className="w-[min(92vw,calc(78vh*16/9))]"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-ink-2">
                      <iframe
                        src={embedUrl(open)}
                        title={open.title}
                        allow={
                          "accelerometer; autoplay; clipboard-write; encrypted-media; " +
                          "gyroscope; picture-in-picture; web-share"
                        }
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-display text-xl uppercase text-paper sm:text-2xl">
                          {open.title}
                        </p>
                        <p className="mt-1 font-sans text-[11px] uppercase tracking-[0.15em] text-stone">
                          {open.meta}
                        </p>
                      </div>
                      <ArrowLink href={watchUrl(open)} className="shrink-0">
                        Open on YouTube
                      </ArrowLink>
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
 * A video's still. Our own photo for the playlist; otherwise YouTube's
 * thumbnail for that video. If YouTube has no thumbnail, the dark frame stays.
 */
function Poster({
  video,
  size,
  sizes,
}: {
  video: VideoItem;
  size: "hq" | "max";
  sizes: string;
}) {
  const [src, setSrc] = useState(() => thumb(video, size));
  const [failed, setFailed] = useState(false);
  const hover = cn(
    "object-cover transition-transform duration-700 ease-out",
    "group-hover:scale-[1.04]",
  );

  if (video.poster) {
    return <Image src={video.poster} alt="" fill sizes={sizes} className={hover} />;
  }
  if (failed) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      onError={() => {
        if (src !== thumb(video, "hq")) setSrc(thumb(video, "hq"));
        else setFailed(true);
      }}
      className={cn("absolute inset-0 h-full w-full", hover)}
    />
  );
}
