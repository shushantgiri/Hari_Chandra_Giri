import type { Metadata } from "next";
import { VideoSection } from "@/components/video/VideoSection";
import { Gallery } from "@/components/gallery/Gallery";
import { getRecords } from "@/lib/records";

export const metadata: Metadata = {
  title: "Media",
  description:
    "Video and photography from Hari Chandra Giri's world-record hand-walking career.",
  alternates: { canonical: "/media" },
};

export default async function MediaPage() {
  const records = await getRecords();

  return (
    <div className="pt-16 sm:pt-20">
      <VideoSection />
      <Gallery records={records} />
    </div>
  );
}
