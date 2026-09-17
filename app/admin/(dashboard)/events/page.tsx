import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EventRow } from "@/components/admin/EventRow";

export const metadata = { title: "Events" };

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: events, error } = await supabase
    .from("events")
    .select("id, name, event_date, location, status")
    .order("event_date", { ascending: true });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl uppercase text-paper">Events</p>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-1.5 border border-paper bg-paper px-4 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.1em] text-ink transition-colors duration-300 hover:bg-transparent hover:text-paper"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add
        </Link>
      </div>

      {error ? (
        <p className="mt-6 border border-line-strong px-4 py-3 font-sans text-xs text-stone">
          Couldn&apos;t load events — this app isn&apos;t connected to a real Supabase project
          yet.
        </p>
      ) : events && events.length > 0 ? (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {events.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-center font-sans text-sm text-stone">
          No events yet.{" "}
          <Link href="/admin/events/new" className="text-paper underline">
            Add the first one
          </Link>
          .
        </p>
      )}
    </div>
  );
}
