"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/admin/image-compress";
import { cn } from "@/lib/cn";

type UploadStatus = "idle" | "uploading" | "done" | "error";

export function ImagePicker({
  folder,
  value,
  onChange,
  label = "Cover Photo",
}: {
  /** Storage folder prefix, e.g. "records", "achievements", "events". */
  folder: string;
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleFile(file: File) {
    setStatus("uploading");
    setErrorMessage(null);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const compressed = await compressImage(file);
      const supabase = createClient();
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, compressed, { contentType: "image/jpeg", upsert: false });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(path);

      setStatus("done");
      onChange(publicUrl);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Upload failed. Try again.");
      onChange(null);
    }
  }

  function clear() {
    setPreviewUrl(null);
    setStatus("idle");
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <p className="font-sans text-xs uppercase tracking-[0.15em] text-stone">{label}</p>

      <div className="mt-2">
        {previewUrl ? (
          <div className="relative aspect-[4/3] w-full max-w-xs overflow-hidden border border-line">
            <Image src={previewUrl} alt="" fill sizes="320px" className="object-cover" unoptimized />

            {status === "uploading" ? (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/60">
                <Loader2 className="h-6 w-6 animate-spin text-paper" aria-hidden />
              </div>
            ) : null}

            <button
              type="button"
              onClick={clear}
              aria-label="Remove photo"
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink/70 text-paper"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex aspect-[4/3] w-full max-w-xs flex-col items-center justify-center gap-2 border border-dashed border-line-strong text-stone transition-colors duration-200 hover:border-paper hover:text-paper",
            )}
          >
            <Camera className="h-6 w-6" aria-hidden />
            <span className="font-sans text-xs uppercase tracking-wide">Take or Choose Photo</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {status === "error" && errorMessage ? (
        <p role="alert" className="mt-2 font-sans text-xs text-crimson-2">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
