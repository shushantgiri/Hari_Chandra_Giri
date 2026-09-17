import type { Metadata } from "next";
import { JourneyTimeline } from "@/components/journey/JourneyTimeline";
import { getRecords } from "@/lib/records";

export const metadata: Metadata = {
  title: "Journey",
  description:
    "From age eight to multiple Guinness World Records — the journey of Hari Chandra Giri, hand-walking athlete from Nepal.",
  alternates: { canonical: "/journey" },
};

export default async function JourneyPage() {
  const records = await getRecords();

  return (
    <div className="pt-16 sm:pt-20">
      <JourneyTimeline records={records} />
    </div>
  );
}
