import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Activity Log" };

export default async function ActivityPage() {
  const supabase = await createClient();
  const { data: entries, error } = await supabase
    .from("activity_log")
    .select("id, action, entity_type, entity_id, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-display text-2xl uppercase text-paper">Activity Log</p>
      <p className="mt-1 font-sans text-sm text-stone">
        Every create, update and delete made through this app.
      </p>

      {error ? (
        <p className="mt-6 border border-line-strong px-4 py-3 font-sans text-xs text-stone">
          Couldn&apos;t load the activity log — this app isn&apos;t connected to a real Supabase
          project yet.
        </p>
      ) : entries && entries.length > 0 ? (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between gap-4 py-3">
              <p className="font-sans text-sm text-paper">
                <span className="uppercase text-crimson-2">{entry.action}</span>{" "}
                {entry.entity_type.replace("_", " ")}
              </p>
              <p className="shrink-0 font-sans text-xs text-stone">
                {new Date(entry.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-center font-sans text-sm text-stone">No activity yet.</p>
      )}
    </div>
  );
}
