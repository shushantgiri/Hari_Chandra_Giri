"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { deleteRecord, setRecordStatus } from "@/lib/admin/records-actions";
import { cn } from "@/lib/cn";

interface RecordSummary {
  id: string;
  title: string;
  result: string;
  unit: string;
  status: string;
  featured: boolean;
  cover_image_url: string | null;
}

export function RecordRow({ record }: { record: RecordSummary }) {
  const [isPending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const togglePublish = () => {
    const next = record.status === "published" ? "draft" : "published";
    startTransition(async () => {
      await setRecordStatus(record.id, next);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteRecord(record.id);
    });
  };

  return (
    <li className="flex items-center gap-4 py-4">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-line bg-ink-2">
        {record.cover_image_url ? (
          <Image src={record.cover_image_url} alt="" fill sizes="56px" className="object-cover" unoptimized />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-sm font-medium text-paper">{record.title}</p>
        <p className="font-sans text-xs text-stone">
          {record.result} {record.unit}
          {record.featured ? " · Featured" : ""}
        </p>
      </div>

      <button
        type="button"
        onClick={togglePublish}
        disabled={isPending}
        className={cn(
          "shrink-0 border px-2.5 py-1 font-sans text-[0.65rem] uppercase tracking-wide transition-colors duration-200",
          record.status === "published"
            ? "border-crimson/60 text-crimson-2"
            : "border-line-strong text-stone",
        )}
      >
        {record.status}
      </button>

      <Link
        href={`/admin/records/${record.id}`}
        aria-label={`Edit ${record.title}`}
        className="shrink-0 rounded-full p-2 text-stone transition-colors duration-200 hover:text-paper"
      >
        <Pencil className="h-4 w-4" aria-hidden />
      </Link>

      {confirmingDelete ? (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="shrink-0 font-sans text-[0.65rem] uppercase text-crimson-2"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : "Confirm?"}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmingDelete(true)}
          aria-label={`Delete ${record.title}`}
          className="shrink-0 rounded-full p-2 text-stone transition-colors duration-200 hover:text-crimson-2"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      )}
    </li>
  );
}
