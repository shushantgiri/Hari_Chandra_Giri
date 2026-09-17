import { Calendar, Camera, MessageSquare, PlusCircle, Trophy, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/StatCard";
import { QuickAction } from "@/components/admin/QuickAction";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/** Returns a row count, or null if the query fails (e.g. Supabase isn't
 *  connected yet) — the UI shows "—" rather than crashing the dashboard. */
async function safeCount(
  query: PromiseLike<{ count: number | null; error: unknown }>,
): Promise<number | null> {
  try {
    const { count, error } = await query;
    if (error) return null;
    return count ?? 0;
  } catch {
    return null;
  }
}

export default async function DashboardHomePage() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [records, achievements, photos, events] = await Promise.all([
    safeCount(supabase.from("world_records").select("*", { count: "exact", head: true })),
    safeCount(supabase.from("achievements").select("*", { count: "exact", head: true })),
    safeCount(supabase.from("photos").select("*", { count: "exact", head: true })),
    safeCount(
      supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .gte("event_date", today),
    ),
  ]);

  const notConnected = [records, achievements, photos, events].every((value) => value === null);

  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-display text-3xl uppercase text-paper">{greeting()}</p>
      <p className="mt-1 font-sans text-sm text-stone">Manage Athlete Website</p>

      {notConnected ? (
        <p className="mt-4 border border-line-strong px-4 py-3 font-sans text-xs text-stone">
          Stats will appear here once this app is connected to a real Supabase project — see
          .env.local.example.
        </p>
      ) : null}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <StatCard label="World Records" value={records} />
        <StatCard label="Achievements" value={achievements} />
        <StatCard label="Photos" value={photos} />
        <StatCard label="Upcoming Events" value={events} />
      </div>

      <p className="mt-8 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-stone">
        Quick Actions
      </p>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <QuickAction href="/admin/records/new" icon={PlusCircle} label="Add Record" />
        <QuickAction href="/admin/photos/upload" icon={Camera} label="Upload Photos" />
        <QuickAction href="/admin/achievements" icon={Trophy} label="Add Achievement" />
        <QuickAction href="/admin/events" icon={Calendar} label="Add Event" />
        <QuickAction href="/admin/photos" icon={Upload} label="Publish Media" />
        <QuickAction href="/admin/messages" icon={MessageSquare} label="Messages" />
      </div>
    </div>
  );
}
