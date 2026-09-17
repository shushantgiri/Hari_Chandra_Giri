import { Hero } from "@/components/hero/Hero";
import { FeaturedRecord } from "@/components/records/FeaturedRecord";
import { RecordsTimeline } from "@/components/records/RecordsTimeline";
import { About } from "@/components/about/About";
import { Gallery } from "@/components/gallery/Gallery";
import { VideoSection } from "@/components/video/VideoSection";
import { Certificates } from "@/components/certificates/Certificates";
import { NepalSection } from "@/components/nepal/NepalSection";
import { ContactForm } from "@/components/contact/ContactForm";
import { getRecords, getFeaturedRecord } from "@/lib/records";

// The homepage is the full narrative journey described in the brief:
// open → the record → the records → the athlete → the proof → contact. Each section is also reusable on its own
// dedicated route (see app/records, app/journey, etc.) for direct linking.
//
// Records come from Supabase (see lib/records.ts) — fetched once here and
// passed down, since several of these are Client Components that can't
// fetch their own server data.
export default async function HomePage() {
  const [records, featuredRecord] = await Promise.all([getRecords(), getFeaturedRecord()]);

  return (
    <>
      <Hero recordCount={records.length} />
      <FeaturedRecord record={featuredRecord} />
      <RecordsTimeline records={records} />
      <About />
      <Gallery records={records} />
      <VideoSection />
      <Certificates records={records} />
      <NepalSection />
      <ContactForm />
    </>
  );
}
