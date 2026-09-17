"use client";

import { useState, useTransition } from "react";
import { Archive, Loader2, Mail, Trash2 } from "lucide-react";
import { deleteMessage, setMessageStatus } from "@/lib/admin/messages-actions";
import { cn } from "@/lib/cn";

interface MessageSummary {
  id: string;
  name: string;
  email: string;
  purpose: string | null;
  message: string;
  status: string;
  created_at: string;
}

export function MessageCard({ message }: { message: MessageSummary }) {
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);

  function openMessage() {
    setExpanded((v) => !v);
    if (message.status === "unread") {
      startTransition(async () => {
        await setMessageStatus(message.id, "read");
      });
    }
  }

  return (
    <li className="border-b border-line py-4">
      <button type="button" onClick={openMessage} className="flex w-full items-start gap-3 text-left">
        <span
          aria-hidden
          className={cn(
            "mt-1.5 h-2 w-2 shrink-0 rounded-full",
            message.status === "unread" ? "bg-crimson" : "bg-transparent",
          )}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-sans text-sm font-medium text-paper">{message.name}</p>
            <p className="shrink-0 font-sans text-xs text-stone">
              {new Date(message.created_at).toLocaleDateString()}
            </p>
          </div>
          <p className="mt-0.5 truncate font-sans text-xs text-stone">
            {message.purpose ? `${message.purpose} · ` : ""}
            {message.email}
          </p>
          {!expanded ? (
            <p className="mt-1 truncate font-sans text-sm text-stone">{message.message}</p>
          ) : null}
        </div>
      </button>

      {expanded ? (
        <div className="mt-3 pl-5">
          <p className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-paper">
            {message.message}
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <a
              href={`mailto:${message.email}`}
              className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-wide text-paper transition-colors duration-200 hover:text-crimson-2"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden />
              Reply by Email
            </a>
            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await setMessageStatus(message.id, "archived");
                })
              }
              className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-wide text-stone transition-colors duration-200 hover:text-paper"
            >
              <Archive className="h-3.5 w-3.5" aria-hidden />
              Archive
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await deleteMessage(message.id);
                })
              }
              className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-wide text-stone transition-colors duration-200 hover:text-crimson-2"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
              Delete
            </button>
          </div>
        </div>
      ) : null}
    </li>
  );
}
