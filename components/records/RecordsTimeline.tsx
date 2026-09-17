import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow, SectionTitle } from "@/components/ui/typography";
import { cn } from "@/lib/cn";
import type { AthleteRecord } from "@/lib/records";

export function RecordsTimeline({
  records,
  heading = true,
}: {
  records: AthleteRecord[];
  heading?: boolean;
}) {
  return (
    <section id="records" className="wrap py-24 sm:py-32">
      {heading ? (
        <Reveal>
          <Eyebrow>
            Verified Titles, {records[0]?.year}—{records[records.length - 1]?.year}
          </Eyebrow>
          <SectionTitle className="mt-3">The Records</SectionTitle>
        </Reveal>
      ) : null}

      <ol className={cn("divide-y divide-line border-y border-line", heading && "mt-16")}>
        {records.map((record, index) => (
          <li key={record.id}>
            <Reveal delay={Math.min(index * 0.05, 0.3)}>
              <div
                className={cn(
                  "grid grid-cols-2 items-start gap-x-6 gap-y-3 py-7 sm:grid-cols-12 sm:items-center sm:py-8",
                  record.featured && "bg-crimson/[0.05]",
                )}
              >
                <span className="col-span-2 font-display text-3xl text-stone sm:col-span-2 sm:text-4xl">
                  {record.year}
                </span>

                <div className="col-span-2 sm:col-span-5">
                  <Link href={`/records/${record.slug}`} className="group inline-block">
                    <p
                      className={cn(
                        "font-sans text-base font-medium underline-offset-4 group-hover:underline sm:text-lg",
                        record.featured ? "text-crimson-2" : "text-paper",
                      )}
                    >
                      {record.shortTitle}
                    </p>
                  </Link>
                  <p className="mt-1 font-sans text-sm text-stone">{record.location}</p>
                </div>

                <div className="col-span-1 sm:col-span-3">
                  <p className="font-display text-2xl text-paper sm:text-3xl">
                    {record.result}
                    <span className="ml-1.5 font-sans text-[0.65rem] uppercase tracking-wide text-stone">
                      {record.unit}
                    </span>
                  </p>
                </div>

                <div className="col-span-1 flex sm:col-span-2 sm:justify-end">
                  <ArrowLink href={record.officialUrl}>View Record</ArrowLink>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
