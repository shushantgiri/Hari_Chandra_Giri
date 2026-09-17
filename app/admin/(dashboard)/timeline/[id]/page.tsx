import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TimelineForm } from "@/components/admin/TimelineForm";
import type { TimelineInput } from "@/lib/admin/timeline-actions";

export const metadata = { title: "Edit Timeline Milestone" };

export default async function EditTimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: milestone }, { data: records }] = await Promise.all([
    supabase.from("timeline_events").select("*").eq("id", id).single(),
    supabase.from("world_records").select("id, title").order("record_date", { ascending: false }),
  ]);

  if (!milestone) {
    notFound();
  }

  const initial: TimelineInput = {
    marker: milestone.marker ?? "",
    title: milestone.title ?? "",
    description: milestone.description ?? "",
    image_url: milestone.image_url,
    record_id: milestone.record_id,
    status: milestone.status === "published" ? "published" : "draft",
  };

  return (
    <div>
      <p className="font-display text-2xl uppercase text-paper">Edit Milestone</p>
      <div className="mt-8">
        <TimelineForm milestoneId={id} initial={initial} records={records ?? []} />
      </div>
    </div>
  );
}
