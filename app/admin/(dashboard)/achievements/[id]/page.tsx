import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AchievementForm } from "@/components/admin/AchievementForm";
import type { AchievementInput } from "@/lib/admin/achievements-actions";

export const metadata = { title: "Edit Achievement" };

export default async function EditAchievementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: achievement } = await supabase
    .from("achievements")
    .select("*")
    .eq("id", id)
    .single();

  if (!achievement) {
    notFound();
  }

  const initial: AchievementInput = {
    title: achievement.title ?? "",
    year: achievement.year ? String(achievement.year) : "",
    description: achievement.description ?? "",
    image_url: achievement.image_url,
    featured: achievement.featured ?? false,
    status: achievement.status === "published" ? "published" : "draft",
  };

  return (
    <div>
      <p className="font-display text-2xl uppercase text-paper">Edit Achievement</p>
      <div className="mt-8">
        <AchievementForm achievementId={id} initial={initial} />
      </div>
    </div>
  );
}
