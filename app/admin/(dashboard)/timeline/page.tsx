import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { TimelineRow } from "@/components/admin/TimelineRow";

export const metadata = { title: "Timeline" };

export default async function TimelinePage() {
  const supabase = await createClient();
  const { data: milestones, error } = await supabase
    .from("timeline_events")
    .select("id, marker, title, status")
    .order("sort_order", { ascending: true });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl uppercase text-paper">Timeline</p>
        <Link
          href="/admin/timeline/new"
          className="flex items-center gap-1.5 border border-paper bg-paper px-4 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.1em] text-ink transition-colors duration-300 hover:bg-transparent hover:text-paper"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add
        </Link>
      </div>
      <p className="mt-1 font-sans text-sm text-stone">
        The Journey milestones shown on the public site.
      </p>

      {error ? (
        <p className="mt-6 border border-line-strong px-4 py-3 font-sans text-xs text-stone">
          Couldn&apos;t load the timeline — this app isn&apos;t connected to a real Supabase
          project yet.
        </p>
      ) : milestones && milestones.length > 0 ? (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {milestones.map((milestone) => (
            <TimelineRow key={milestone.id} milestone={milestone} />
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-center font-sans text-sm text-stone">
          No milestones yet.{" "}
          <Link href="/admin/timeline/new" className="text-paper underline">
            Add the first one
          </Link>
          .
        </p>
      )}
    </div>
  );
}
