"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  error: string | null;
}

export interface NewPhoto {
  storage_path: string;
  url: string;
  title: string;
}

function revalidateEverywhere() {
  revalidatePath("/admin/photos");
  revalidatePath("/media");
  revalidatePath("/");
}

/** Called once after all files in a batch have finished uploading to
 *  Storage — creates their database rows together. */
export async function createPhotos(
  photos: NewPhoto[],
  status: "draft" | "published",
): Promise<ActionResult> {
  if (photos.length === 0) {
    return { error: "No photos to save." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("photos").insert(
    photos.map((photo) => ({
      storage_path: photo.storage_path,
      url: photo.url,
      title: photo.title || null,
      status,
    })),
  );

  if (error) return { error: error.message };

  await supabase.rpc("log_activity", {
    p_action: "create",
    p_entity_type: "photos",
    p_entity_id: null,
  });

  revalidateEverywhere();
  return { error: null };
}

export async function setPhotoStatus(
  id: string,
  status: "draft" | "published",
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("photos").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidateEverywhere();
  return { error: null };
}

export async function deletePhoto(id: string, storagePath: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { error: storageError } = await supabase.storage.from("media").remove([storagePath]);
  if (storageError) return { error: storageError.message };

  const { error } = await supabase.from("photos").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidateEverywhere();
  return { error: null };
}
