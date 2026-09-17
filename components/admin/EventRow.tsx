"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { deleteEvent, setEventStatus } from "@/lib/admin/events-actions";
import { cn } from "@/lib/cn";

interface EventSummary {
  id: string;
  name: string;
  event_date: string | null;
  location: string | null;
  status: string;
}

export function EventRow({ event }: { event: EventSummary }) {
  const [isPending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const togglePublish = () => {
    const next = event.status === "published" ? "draft" : "published";
    startTransition(async () => {
      await setEventStatus(event.id, next);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteEvent(event.id);
    });
  };

  return (
    <li className="flex items-center gap-4 py-4">
      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-sm font-medium text-paper">{event.name}</p>
        <p className="truncate font-sans text-xs text-stone">
          {event.event_date ?? "No date"}
          {event.location ? ` · ${event.location}` : ""}
        </p>
      </div>

      <button
        type="button"
        onClick={togglePublish}
        disabled={isPending}
        className={cn(
          "shrink-0 border px-2.5 py-1 font-sans text-[0.65rem] uppercase tracking-wide transition-colors duration-200",
          event.status === "published"
            ? "border-crimson/60 text-crimson-2"
            : "border-line-strong text-stone",
        )}
      >
        {event.status}
      </button>

      <Link
        href={`/admin/events/${event.id}`}
        aria-label={`Edit ${event.name}`}
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
          aria-label={`Delete ${event.name}`}
          className="shrink-0 rounded-full p-2 text-stone transition-colors duration-200 hover:text-crimson-2"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      )}
    </li>
  );
}
