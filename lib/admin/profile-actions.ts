"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ProfileInput {
  full_name: string;
  bio: string;
  discipline: string;
  country: string;
  affiliation: string;
  portrait_url: string | null;
}

export interface ActionResult {
  error: string | null;
}

export async function updateAthleteProfile(input: ProfileInput): Promise<ActionResult> {
  if (!input.full_name.trim()) return { error: "Name is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("athlete_profile")
    .update({
      full_name: input.full_name,
      bio: input.bio || null,
      discipline: input.discipline || null,
      country: input.country || null,
      affiliation: input.affiliation || null,
      portrait_url: input.portrait_url || null,
    })
    .eq("id", 1);

  if (error) return { error: error.message };

  await supabase.rpc("log_activity", {
    p_action: "update",
    p_entity_type: "athlete_profile",
    p_entity_id: null,
  });

  revalidatePath("/admin/profile");
  revalidatePath("/about");
  revalidatePath("/");
  return { error: null };
}
