"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { deleteTimelineEvent } from "@/lib/admin/timeline-actions";

interface TimelineSummary {
  id: string;
  marker: string;
  title: string;
  status: string;
}

export function TimelineRow({ milestone }: { milestone: TimelineSummary }) {
  const [isPending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      await deleteTimelineEvent(milestone.id);
    });
  };

  return (
    <li className="flex items-center gap-4 py-4">
      <span className="w-16 shrink-0 font-display text-lg uppercase text-crimson-2">
        {milestone.marker}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-sm font-medium text-paper">{milestone.title}</p>
        <p className="font-sans text-xs text-stone">{milestone.status}</p>
      </div>

      <Link
        href={`/admin/timeline/${milestone.id}`}
        aria-label={`Edit ${milestone.title}`}
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
          aria-label={`Delete ${milestone.title}`}
          className="shrink-0 rounded-full p-2 text-stone transition-colors duration-200 hover:text-crimson-2"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      )}
    </li>
  );
}
