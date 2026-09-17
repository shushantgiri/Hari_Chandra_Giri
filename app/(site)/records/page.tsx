import type { Metadata } from "next";
import { FeaturedRecord } from "@/components/records/FeaturedRecord";
import { RecordsTimeline } from "@/components/records/RecordsTimeline";
import { getRecords, getFeaturedRecord } from "@/lib/records";

export const metadata: Metadata = {
  title: "Records",
  description:
    "All of Hari Chandra Giri's verified Guinness World Records, with dates, locations and official verification links.",
  alternates: { canonical: "/records" },
};

export default async function RecordsPage() {
  const [records, featuredRecord] = await Promise.all([getRecords(), getFeaturedRecord()]);

  return (
    <div className="pt-16 sm:pt-20">
      <FeaturedRecord record={featuredRecord} />
      <RecordsTimeline records={records} />
    </div>
  );
}
