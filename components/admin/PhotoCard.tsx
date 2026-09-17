"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Loader2, Trash2 } from "lucide-react";
import { deletePhoto, setPhotoStatus } from "@/lib/admin/photos-actions";
import { cn } from "@/lib/cn";

interface PhotoSummary {
  id: string;
  url: string;
  title: string | null;
  status: string;
  storage_path: string;
  created_at: string;
}

export function PhotoCard({ photo }: { photo: PhotoSummary }) {
  const [isPending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const toggleStatus = () => {
    const next = photo.status === "published" ? "draft" : "published";
    startTransition(async () => {
      await setPhotoStatus(photo.id, next);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deletePhoto(photo.id, photo.storage_path);
    });
  };

  return (
    <div className="group relative aspect-square overflow-hidden border border-line">
      <Image src={photo.url} alt={photo.title ?? ""} fill sizes="200px" className="object-cover" unoptimized />

      <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-ink/85 via-transparent to-ink/40 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
        <div className="flex justify-end">
          {confirmingDelete ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-full bg-crimson px-2 py-1 font-sans text-[0.6rem] uppercase text-paper"
            >
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" aria-hidden /> : "Confirm"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              aria-label="Delete photo"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/70 text-paper"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={toggleStatus}
          disabled={isPending}
          className={cn(
            "self-start rounded-full px-2 py-1 font-sans text-[0.6rem] uppercase tracking-wide",
            photo.status === "published" ? "bg-crimson text-paper" : "bg-ink/70 text-stone",
          )}
        >
          {photo.status}
        </button>
      </div>
    </div>
  );
}
