import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AchievementRow } from "@/components/admin/AchievementRow";

export const metadata = { title: "Achievements" };

export default async function AchievementsPage() {
  const supabase = await createClient();
  const { data: achievements, error } = await supabase
    .from("achievements")
    .select("id, title, year, status, featured, image_url")
    .order("year", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl uppercase text-paper">Achievements</p>
        <Link
          href="/admin/achievements/new"
          className="flex items-center gap-1.5 border border-paper bg-paper px-4 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.1em] text-ink transition-colors duration-300 hover:bg-transparent hover:text-paper"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add
        </Link>
      </div>

      {error ? (
        <p className="mt-6 border border-line-strong px-4 py-3 font-sans text-xs text-stone">
          Couldn&apos;t load achievements — this app isn&apos;t connected to a real Supabase
          project yet.
        </p>
      ) : achievements && achievements.length > 0 ? (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {achievements.map((achievement) => (
            <AchievementRow key={achievement.id} achievement={achievement} />
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-center font-sans text-sm text-stone">
          No achievements yet.{" "}
          <Link href="/admin/achievements/new" className="text-paper underline">
            Add the first one
          </Link>
          .
        </p>
      )}
    </div>
  );
}
