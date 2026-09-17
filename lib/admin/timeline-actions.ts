"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface TimelineInput {
  marker: string;
  title: string;
  description: string;
  image_url: string | null;
  record_id: string | null;
  status: "draft" | "published";
}

export interface ActionResult {
  error: string | null;
}

function toRow(input: TimelineInput) {
  return {
    marker: input.marker,
    title: input.title,
    description: input.description || null,
    image_url: input.image_url || null,
    record_id: input.record_id || null,
    status: input.status,
  };
}

function revalidateEverywhere() {
  revalidatePath("/admin/timeline");
  revalidatePath("/journey");
  revalidatePath("/");
}

export async function createTimelineEvent(input: TimelineInput): Promise<ActionResult> {
  if (!input.marker.trim() || !input.title.trim()) {
    return { error: "Marker and title are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("timeline_events")
    .insert(toRow(input))
    .select("id")
    .single();

  if (error) return { error: error.message };

  await supabase.rpc("log_activity", {
    p_action: "create",
    p_entity_type: "timeline_events",
    p_entity_id: data.id,
  });

  revalidateEverywhere();
  return { error: null };
}

export async function updateTimelineEvent(id: string, input: TimelineInput): Promise<ActionResult> {
  if (!input.marker.trim() || !input.title.trim()) {
    return { error: "Marker and title are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("timeline_events").update(toRow(input)).eq("id", id);
  if (error) return { error: error.message };

  await supabase.rpc("log_activity", {
    p_action: "update",
    p_entity_type: "timeline_events",
    p_entity_id: id,
  });

  revalidateEverywhere();
  return { error: null };
}

export async function deleteTimelineEvent(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("timeline_events").delete().eq("id", id);
  if (error) return { error: error.message };

  await supabase.rpc("log_activity", {
    p_action: "delete",
    p_entity_type: "timeline_events",
    p_entity_id: id,
  });

  revalidateEverywhere();
  return { error: null };
}
