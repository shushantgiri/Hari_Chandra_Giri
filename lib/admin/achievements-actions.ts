"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface AchievementInput {
  title: string;
  year: string;
  description: string;
  image_url: string | null;
  featured: boolean;
  status: "draft" | "published";
}

export interface ActionResult {
  error: string | null;
}

function toRow(input: AchievementInput) {
  return {
    title: input.title,
    year: input.year ? Number(input.year) : null,
    description: input.description || null,
    image_url: input.image_url || null,
    featured: input.featured,
    status: input.status,
  };
}

function revalidateEverywhere() {
  revalidatePath("/admin/achievements");
  revalidatePath("/about");
  revalidatePath("/");
}

export async function createAchievement(input: AchievementInput): Promise<ActionResult> {
  if (!input.title.trim()) return { error: "Title is required." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("achievements")
    .insert(toRow(input))
    .select("id")
    .single();

  if (error) return { error: error.message };

  await supabase.rpc("log_activity", {
    p_action: "create",
    p_entity_type: "achievements",
    p_entity_id: data.id,
  });

  revalidateEverywhere();
  return { error: null };
}

export async function updateAchievement(id: string, input: AchievementInput): Promise<ActionResult> {
  if (!input.title.trim()) return { error: "Title is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("achievements").update(toRow(input)).eq("id", id);
  if (error) return { error: error.message };

  await supabase.rpc("log_activity", {
    p_action: "update",
    p_entity_type: "achievements",
    p_entity_id: id,
  });

  revalidateEverywhere();
  return { error: null };
}

export async function deleteAchievement(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("achievements").delete().eq("id", id);
  if (error) return { error: error.message };

  await supabase.rpc("log_activity", {
    p_action: "delete",
    p_entity_type: "achievements",
    p_entity_id: id,
  });

  revalidateEverywhere();
  return { error: null };
}

export async function setAchievementStatus(
  id: string,
  status: "draft" | "published",
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("achievements").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidateEverywhere();
  return { error: null };
}
