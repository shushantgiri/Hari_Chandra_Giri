import { Reveal } from "@/components/ui/Reveal";

export function NepalSection() {
  return (
    <section className="relative overflow-hidden border-y border-line py-24 sm:py-32">
      {/* A quiet crimson glow instead of a photograph — the section is the words */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-crimson/10 blur-3xl"
      />

      <div className="wrap relative z-10 text-center">
        <Reveal>
          <p className="font-display text-5xl uppercase leading-[0.92] text-paper sm:text-7xl lg:text-8xl">
            From Nepal.
            <br />
            <span className="text-crimson-2">To the world.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
