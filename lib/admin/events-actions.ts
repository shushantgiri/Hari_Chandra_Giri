"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface EventInput {
  name: string;
  event_date: string;
  event_time: string;
  location: string;
  description: string;
  cover_image_url: string | null;
  external_link: string;
  featured: boolean;
  status: "draft" | "published" | "past";
}

export interface ActionResult {
  error: string | null;
}

function toRow(input: EventInput) {
  return {
    name: input.name,
    event_date: input.event_date || null,
    event_time: input.event_time || null,
    location: input.location || null,
    description: input.description || null,
    cover_image_url: input.cover_image_url || null,
    external_link: input.external_link || null,
    featured: input.featured,
    status: input.status,
  };
}

function revalidateEverywhere() {
  revalidatePath("/admin/events");
  revalidatePath("/");
}

export async function createEvent(input: EventInput): Promise<ActionResult> {
  if (!input.name.trim()) return { error: "Event name is required." };

  const supabase = await createClient();
  const { data, error } = await supabase.from("events").insert(toRow(input)).select("id").single();
  if (error) return { error: error.message };

  await supabase.rpc("log_activity", {
    p_action: "create",
    p_entity_type: "events",
    p_entity_id: data.id,
  });

  revalidateEverywhere();
  return { error: null };
}

export async function updateEvent(id: string, input: EventInput): Promise<ActionResult> {
  if (!input.name.trim()) return { error: "Event name is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("events").update(toRow(input)).eq("id", id);
  if (error) return { error: error.message };

  await supabase.rpc("log_activity", { p_action: "update", p_entity_type: "events", p_entity_id: id });

  revalidateEverywhere();
  return { error: null };
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return { error: error.message };

  await supabase.rpc("log_activity", { p_action: "delete", p_entity_type: "events", p_entity_id: id });

  revalidateEverywhere();
  return { error: null };
}

export async function setEventStatus(
  id: string,
  status: "draft" | "published" | "past",
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("events").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidateEverywhere();
  return { error: null };
}
