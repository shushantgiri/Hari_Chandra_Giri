import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { ArrowLink } from "@/components/ui/Button";
import { getRecords, getRecordBySlug } from "@/lib/records";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const record = await getRecordBySlug(slug);

  if (!record) return {};

  return {
    title: record.shortTitle,
    description: `${record.fullTitle} — ${record.result} ${record.unit}, ${record.location}, ${record.date}.`,
    alternates: { canonical: `/records/${slug}` },
  };
}

export default async function RecordDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [record, allRecords] = await Promise.all([getRecordBySlug(slug), getRecords()]);

  if (!record) {
    notFound();
  }

  const index = allRecords.findIndex((r) => r.slug === slug);
  const related = allRecords[index + 1] ?? allRecords[index - 1] ?? null;

  return (
    <div>
      {/* Large action photograph */}
      <div className="relative h-[65svh] min-h-[420px] w-full overflow-hidden bg-ink-2">
        {record.image ? (
          <>
            {/* The photo, whole, on a blurred copy of itself — so a portrait
                shot isn't cropped to a strip on a wide screen */}
            <Image src={record.image} alt="" aria-hidden fill sizes="100vw" className="scale-110 object-cover opacity-40 blur-2xl" />
            <Image
              src={record.image}
              alt={record.fullTitle}
              fill
              sizes="100vw"
              priority
              className="object-contain"
            />
          </>
        ) : (
          <PlaceholderImage
            label={`${record.shortTitle} — action photograph`}
            className="h-full w-full"
            showCaption={false}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
      </div>

      <div className="wrap relative z-10 -mt-16 pb-24 sm:-mt-24 sm:pb-32">
        <p className="font-display text-[5rem] leading-none text-paper sm:text-[7.5rem]">
          {record.result}
        </p>
        <p className="mt-1 font-sans text-sm font-semibold uppercase tracking-[0.3em] text-crimson-2">
          {record.unit}
        </p>

        <h1 className="mt-6 max-w-3xl font-display text-3xl uppercase leading-[1.05] text-paper sm:text-5xl">
          {record.fullTitle}
        </h1>

        <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-stone sm:text-lg">
          {record.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-6 font-sans text-sm text-stone">
          <span>{record.date}</span>
          <span>{record.location}</span>
        </div>

        <div className="mt-8">
          <ArrowLink href={record.officialUrl}>Verify on Guinness World Records</ArrowLink>
        </div>

        {record.photos?.length ? (
          <div className="mt-16 border-t border-line pt-10">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-stone">The Attempt</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {record.photos.map((photo) => (
                <div key={photo} className="relative aspect-[3/4] overflow-hidden bg-ink-2">
                  <Image src={photo} alt={record.fullTitle} fill sizes="(min-width: 640px) 33vw, 50vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {record.certificateImage ? (
          <div className="mt-16 border-t border-line pt-10">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-stone">Certificate</p>
            <div className="relative mt-4 aspect-[7/10] w-full max-w-sm overflow-hidden">
              <Image
                src={record.certificateImage}
                alt={`Guinness World Records certificate for ${record.fullTitle}`}
                fill
                sizes="(min-width: 640px) 384px, 100vw"
                className="object-contain"
              />
            </div>
          </div>
        ) : null}

        {related ? (
          <div className="mt-16 border-t border-line pt-8">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-stone">
              Another Record
            </p>
            <Link
              href={`/records/${related.slug}`}
              className="mt-2 inline-block font-display text-2xl uppercase text-paper underline-offset-4 hover:underline sm:text-3xl"
            >
              {related.shortTitle} →
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
