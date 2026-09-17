"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Check, Loader2, Plus, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/admin/image-compress";
import { createPhotos } from "@/lib/admin/photos-actions";
import { cn } from "@/lib/cn";

interface PendingPhoto {
  id: string;
  file: File;
  previewUrl: string;
  title: string;
  status: "uploading" | "done" | "error";
  storagePath?: string;
  publicUrl?: string;
  errorMessage?: string;
}

export function PhotoUploadFlow() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  function addFiles(files: FileList) {
    const newPhotos: PendingPhoto[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      title: "",
      status: "uploading",
    }));

    setPhotos((current) => [...current, ...newPhotos]);
    newPhotos.forEach(uploadOne);
  }

  async function uploadOne(photo: PendingPhoto) {
    try {
      const compressed = await compressImage(photo.file);
      const supabase = createClient();
      const path = `photos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, compressed, { contentType: "image/jpeg" });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(path);

      setPhotos((current) =>
        current.map((p) =>
          p.id === photo.id ? { ...p, status: "done", storagePath: path, publicUrl } : p,
        ),
      );
    } catch (error) {
      setPhotos((current) =>
        current.map((p) =>
          p.id === photo.id
            ? {
                ...p,
                status: "error",
                errorMessage: error instanceof Error ? error.message : "Upload failed",
              }
            : p,
        ),
      );
    }
  }

  function removePhoto(id: string) {
    setPhotos((current) => current.filter((p) => p.id !== id));
  }

  function setTitle(id: string, title: string) {
    setPhotos((current) => current.map((p) => (p.id === id ? { ...p, title } : p)));
  }

  const readyPhotos = photos.filter((p) => p.status === "done");
  const stillUploading = photos.some((p) => p.status === "uploading");

  async function publish(status: "draft" | "published") {
    setIsPublishing(true);
    setPublishError(null);

    const result = await createPhotos(
      readyPhotos.map((p) => ({
        storage_path: p.storagePath!,
        url: p.publicUrl!,
        title: p.title,
      })),
      status,
    );

    setIsPublishing(false);

    if (result.error) {
      setPublishError(result.error);
      return;
    }

    router.push("/admin/photos");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-xl pb-28">
      {photos.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 border border-dashed border-line-strong text-stone transition-colors duration-200 hover:border-paper hover:text-paper"
        >
          <Camera className="h-8 w-8" aria-hidden />
          <span className="font-sans text-sm uppercase tracking-wide">
            Take Photos or Choose from Gallery
          </span>
        </button>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo) => (
              <div key={photo.id} className="relative">
                <div className="relative aspect-square overflow-hidden border border-line">
                  <Image
                    src={photo.previewUrl}
                    alt=""
                    fill
                    sizes="200px"
                    className="object-cover"
                    unoptimized
                  />
                  {photo.status === "uploading" ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-ink/60">
                      <Loader2 className="h-5 w-5 animate-spin text-paper" aria-hidden />
                    </div>
                  ) : null}
                  {photo.status === "done" ? (
                    <span className="absolute bottom-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-crimson">
                      <Check className="h-3 w-3 text-paper" aria-hidden />
                    </span>
                  ) : null}
                  {photo.status === "error" ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-ink/80 px-2 text-center">
                      <span className="font-sans text-[0.6rem] text-crimson-2">
                        {photo.errorMessage}
                      </span>
                    </div>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    aria-label="Remove"
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-paper"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
                {photo.status === "done" ? (
                  <input
                    value={photo.title}
                    onChange={(e) => setTitle(photo.id, e.target.value)}
                    placeholder="Title (optional)"
                    className="mt-1.5 w-full border-b border-line bg-transparent py-1 font-sans text-xs text-paper outline-none focus:border-paper"
                  />
                ) : null}
              </div>
            ))}

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex aspect-square flex-col items-center justify-center gap-1.5 border border-dashed border-line-strong text-stone transition-colors duration-200 hover:border-paper hover:text-paper"
            >
              <Plus className="h-5 w-5" aria-hidden />
              <span className="font-sans text-[0.65rem] uppercase">Add More</span>
            </button>
          </div>

          {publishError ? (
            <p role="alert" className="mt-4 font-sans text-sm text-crimson-2">
              {publishError}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={stillUploading || readyPhotos.length === 0 || isPublishing}
              onClick={() => publish("draft")}
              className="flex-1 border border-line-strong px-6 py-3.5 font-sans text-sm font-medium uppercase tracking-[0.1em] text-paper transition-colors duration-300 hover:border-paper disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              type="button"
              disabled={stillUploading || readyPhotos.length === 0 || isPublishing}
              onClick={() => publish("published")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 border border-crimson bg-crimson px-6 py-3.5 font-sans text-sm font-medium uppercase tracking-[0.1em] text-paper transition-colors duration-300 hover:bg-transparent hover:text-crimson-2 disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Publish {readyPhotos.length > 0 ? `(${readyPhotos.length})` : ""}
            </button>
          </div>
          {stillUploading ? (
            <p className="mt-3 text-center font-sans text-xs text-stone">
              Waiting for uploads to finish…
            </p>
          ) : null}
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(event) => {
          if (event.target.files && event.target.files.length > 0) {
            addFiles(event.target.files);
            event.target.value = "";
          }
        }}
      />
    </div>
  );
}
