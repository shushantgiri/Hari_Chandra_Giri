import { createClient } from "@/lib/supabase/server";
import { TimelineForm } from "@/components/admin/TimelineForm";

export const metadata = { title: "Add Timeline Milestone" };

export default async function NewTimelinePage() {
  const supabase = await createClient();
  const { data: records } = await supabase
    .from("world_records")
    .select("id, title")
    .order("record_date", { ascending: false });

  return (
    <div>
      <p className="font-display text-2xl uppercase text-paper">Add Milestone</p>
      <div className="mt-8">
        <TimelineForm records={records ?? []} />
      </div>
    </div>
  );
}
