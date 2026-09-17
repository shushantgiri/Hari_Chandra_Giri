import Link from "next/link";
import { Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PhotoCard } from "@/components/admin/PhotoCard";

export const metadata = { title: "Photos" };

export default async function PhotosPage() {
  const supabase = await createClient();
  const { data: photos, error } = await supabase
    .from("photos")
    .select("id, url, title, status, storage_path, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl uppercase text-paper">Photos</p>
        <Link
          href="/admin/photos/upload"
          className="flex items-center gap-1.5 border border-paper bg-paper px-4 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.1em] text-ink transition-colors duration-300 hover:bg-transparent hover:text-paper"
        >
          <Upload className="h-4 w-4" aria-hidden />
          Upload
        </Link>
      </div>

      {error ? (
        <p className="mt-6 border border-line-strong px-4 py-3 font-sans text-xs text-stone">
          Couldn&apos;t load photos — this app isn&apos;t connected to a real Supabase project
          yet. See .env.local.example.
        </p>
      ) : photos && photos.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center font-sans text-sm text-stone">
          No photos yet.{" "}
          <Link href="/admin/photos/upload" className="text-paper underline">
            Upload the first ones
          </Link>
          .
        </p>
      )}
    </div>
  );
}
