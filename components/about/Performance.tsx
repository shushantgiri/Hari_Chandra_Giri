import { Reveal } from "@/components/ui/Reveal";

const ATTRIBUTES = [
  { title: "Control", description: "Balance and body control" },
  { title: "Precision", description: "Movement accuracy under pressure" },
  { title: "Power", description: "Upper-body strength" },
  { title: "Speed", description: "Fast movement, sustained" },
  { title: "Discipline", description: "Years of repetition" },
];

export function Performance() {
  return (
    <section className="wrap py-16 sm:py-20">
      <ul className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-10 sm:grid-cols-5">
        {ATTRIBUTES.map((attribute, index) => (
          <li key={attribute.title}>
            <Reveal delay={index * 0.05}>
              <p className="font-display text-2xl uppercase text-paper sm:text-3xl">
                {attribute.title}
              </p>
              <p className="mt-2 font-sans text-sm text-stone">{attribute.description}</p>
              <span aria-hidden className="mt-4 block h-px w-8 bg-crimson" />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
