import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, SectionTitle } from "@/components/ui/typography";

/**
 * The portrait for this section. To use a different photo, drop the file
 * into /public/images and change this one line — nothing else.
 */
const PORTRAIT = {
  src: "/images/lemon-juice-handstand.jpg",
  alt: "Hari Chandra Giri in a handstand, drinking lemon juice during his Guinness World Records attempt in London",
  /** Which part of the photo to keep if it has to be cropped: "x% y%" */
  focus: "50% 40%",
};

const META = [
  { label: "Discipline", value: "Hand-Walking" },
  { label: "Country", value: "Nepal" },
  { label: "Speciality", value: "Balance / Control" },
  { label: "Affiliation", value: "Nepal Army, since 2014" },
];

export function About({ heading = true }: { heading?: boolean }) {
  return (
    // Sized to sit within one screen on a laptop or desktop: the section is
    // never taller than the viewport (minus the header), and the photo's
    // height follows the screen rather than the column width.
    <section
      id="about"
      className="wrap flex flex-col justify-center py-16 sm:py-20 lg:min-h-[calc(100svh-5rem)] lg:py-12"
    >
      {heading ? (
        <Reveal>
          <Eyebrow>Who Is Hari</Eyebrow>
        </Reveal>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-16">
        <Reveal className="lg:col-span-5">
          <div className="relative h-[min(58vh,26rem)] w-full overflow-hidden bg-ink-2 sm:h-[min(62vh,32rem)] lg:h-[min(70vh,40rem)]">
            <Image
              src={PORTRAIT.src}
              alt={PORTRAIT.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
              style={{ objectPosition: PORTRAIT.focus }}
            />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <SectionTitle as="h2">More Than a Record</SectionTitle>

          <div className="mt-5 max-w-xl space-y-4 font-sans text-base leading-relaxed text-stone sm:text-lg">
            <p>
              Hari Chandra Giri started walking on his hands at eight years old, long before
              records were part of the plan. What began as a childhood skill became years of
              quiet, repetitive training.
            </p>
            <p>
              He is based at the Nepal Army Sports Centre, where he has served since 2014. Every
              record attempt since — on stairs, on football pitches, upside down with a drink in
              hand — has come from the same discipline: control the body completely, then move
              fast.
            </p>
            <p>
              Seven Guinness World Records later, he continues to represent Nepal on a stage most
              of the world only ever sees the right way up.
            </p>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid-cols-4">
            {META.map((item) => (
              <div key={item.label}>
                <dt className="font-sans text-xs uppercase tracking-[0.15em] text-stone">
                  {item.label}
                </dt>
                <dd className="mt-1.5 font-sans text-sm font-medium text-paper sm:text-base">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
