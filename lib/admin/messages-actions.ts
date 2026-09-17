"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  error: string | null;
}

export async function setMessageStatus(
  id: string,
  status: "unread" | "read" | "archived",
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("messages").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return { error: null };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return { error: null };
}
