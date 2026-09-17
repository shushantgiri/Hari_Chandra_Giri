"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { deleteAchievement, setAchievementStatus } from "@/lib/admin/achievements-actions";
import { cn } from "@/lib/cn";

interface AchievementSummary {
  id: string;
  title: string;
  year: number | null;
  status: string;
  featured: boolean;
  image_url: string | null;
}

export function AchievementRow({ achievement }: { achievement: AchievementSummary }) {
  const [isPending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const togglePublish = () => {
    const next = achievement.status === "published" ? "draft" : "published";
    startTransition(async () => {
      await setAchievementStatus(achievement.id, next);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteAchievement(achievement.id);
    });
  };

  return (
    <li className="flex items-center gap-4 py-4">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-line bg-ink-2">
        {achievement.image_url ? (
          <Image
            src={achievement.image_url}
            alt=""
            fill
            sizes="56px"
            className="object-cover"
            unoptimized
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-sm font-medium text-paper">{achievement.title}</p>
        <p className="font-sans text-xs text-stone">
          {achievement.year ?? "—"}
          {achievement.featured ? " · Featured" : ""}
        </p>
      </div>

      <button
        type="button"
        onClick={togglePublish}
        disabled={isPending}
        className={cn(
          "shrink-0 border px-2.5 py-1 font-sans text-[0.65rem] uppercase tracking-wide transition-colors duration-200",
          achievement.status === "published"
            ? "border-crimson/60 text-crimson-2"
            : "border-line-strong text-stone",
        )}
      >
        {achievement.status}
      </button>

      <Link
        href={`/admin/achievements/${achievement.id}`}
        aria-label={`Edit ${achievement.title}`}
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
          aria-label={`Delete ${achievement.title}`}
          className="shrink-0 rounded-full p-2 text-stone transition-colors duration-200 hover:text-crimson-2"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      )}
    </li>
  );
}
