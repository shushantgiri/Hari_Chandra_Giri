"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface RecordInput {
  title: string;
  category: string;
  result: string;
  unit: string;
  record_date: string;
  location: string;
  organization: string;
  verification_url: string;
  description: string;
  cover_image_url: string | null;
  featured: boolean;
  status: "draft" | "published";
}

export interface ActionResult {
  error: string | null;
}

function toRow(input: RecordInput) {
  return {
    title: input.title,
    category: input.category || null,
    result: input.result,
    unit: input.unit || "SECONDS",
    record_date: input.record_date || null,
    location: input.location || null,
    organization: input.organization || "Guinness World Records",
    verification_url: input.verification_url || null,
    description: input.description || null,
    cover_image_url: input.cover_image_url || null,
    featured: input.featured,
    status: input.status,
  };
}

function revalidateEverywhere() {
  revalidatePath("/admin/records");
  revalidatePath("/records");
  revalidatePath("/");
}

export async function createRecord(input: RecordInput): Promise<ActionResult> {
  if (!input.title.trim() || !input.result.trim()) {
    return { error: "Title and result are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("world_records")
    .insert(toRow(input))
    .select("id")
    .single();

  if (error) return { error: error.message };

  await supabase.rpc("log_activity", {
    p_action: "create",
    p_entity_type: "world_records",
    p_entity_id: data.id,
  });

  revalidateEverywhere();
  return { error: null };
}

export async function updateRecord(id: string, input: RecordInput): Promise<ActionResult> {
  if (!input.title.trim() || !input.result.trim()) {
    return { error: "Title and result are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("world_records").update(toRow(input)).eq("id", id);

  if (error) return { error: error.message };

  await supabase.rpc("log_activity", {
    p_action: "update",
    p_entity_type: "world_records",
    p_entity_id: id,
  });

  revalidateEverywhere();
  return { error: null };
}

export async function deleteRecord(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("world_records").delete().eq("id", id);
  if (error) return { error: error.message };

  await supabase.rpc("log_activity", {
    p_action: "delete",
    p_entity_type: "world_records",
    p_entity_id: id,
  });

  revalidateEverywhere();
  return { error: null };
}

export async function setRecordStatus(
  id: string,
  status: "draft" | "published",
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("world_records").update({ status }).eq("id", id);
  if (error) return { error: error.message };

  revalidateEverywhere();
  return { error: null };
}
