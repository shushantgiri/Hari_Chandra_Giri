"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { createEvent, updateEvent, type EventInput } from "@/lib/admin/events-actions";

const EMPTY: EventInput = {
  name: "",
  event_date: "",
  event_time: "",
  location: "",
  description: "",
  cover_image_url: null,
  external_link: "",
  featured: false,
  status: "draft",
};

export function EventForm({ eventId, initial }: { eventId?: string; initial?: EventInput }) {
  const router = useRouter();
  const [values, setValues] = useState<EventInput>(initial ?? EMPTY);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof EventInput>(key: K, value: EventInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function save(status: "draft" | "published") {
    setIsSaving(true);
    setError(null);

    const payload = { ...values, status };
    const result = eventId ? await updateEvent(eventId, payload) : await createEvent(payload);

    setIsSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/admin/events");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-xl pb-28">
      <div className="space-y-5">
        <Field label="Event Name" required>
          <input
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className="mt-2 w-full border-b border-line-strong bg-transparent py-2.5 font-sans text-base text-paper outline-none focus:border-paper"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Date">
            <input
              type="date"
              value={values.event_date}
              onChange={(e) => update("event_date", e.target.value)}
              className="mt-2 w-full border-b border-line-strong bg-transparent py-2.5 font-sans text-base text-paper outline-none focus:border-paper [color-scheme:dark]"
            />
          </Field>
          <Field label="Time">
            <input
              type="time"
              value={values.event_time}
              onChange={(e) => update("event_time", e.target.value)}
              className="mt-2 w-full border-b border-line-strong bg-transparent py-2.5 font-sans text-base text-paper outline-none focus:border-paper [color-scheme:dark]"
            />
          </Field>
        </div>

        <Field label="Location">
          <input
            value={values.location}
            onChange={(e) => update("location", e.target.value)}
            className="mt-2 w-full border-b border-line-strong bg-transparent py-2.5 font-sans text-base text-paper outline-none focus:border-paper"
          />
        </Field>

        <Field label="Description">
          <textarea
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            className="mt-2 w-full resize-none border border-line-strong bg-transparent px-3 py-2.5 font-sans text-base text-paper outline-none focus:border-paper"
          />
        </Field>

        <Field label="External Link">
          <input
            value={values.external_link}
            onChange={(e) => update("external_link", e.target.value)}
            placeholder="https://…"
            className="mt-2 w-full border-b border-line-strong bg-transparent py-2.5 font-sans text-base text-paper outline-none focus:border-paper"
          />
        </Field>

        <ImagePicker
          folder="events"
          value={values.cover_image_url}
          onChange={(url) => update("cover_image_url", url)}
          label="Cover Image"
        />

        <label className="flex items-center justify-between border border-line px-4 py-3.5">
          <span className="font-sans text-sm text-paper">Featured</span>
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="h-5 w-5 accent-crimson"
          />
        </label>

        {error ? (
          <p role="alert" className="font-sans text-sm text-crimson-2">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => save("draft")}
            className="flex-1 border border-line-strong px-6 py-3.5 font-sans text-sm font-medium uppercase tracking-[0.1em] text-paper transition-colors duration-300 hover:border-paper disabled:opacity-60"
          >
            Save as Draft
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => save("published")}
            className="flex flex-1 items-center justify-center gap-2 border border-crimson bg-crimson px-6 py-3.5 font-sans text-sm font-medium uppercase tracking-[0.1em] text-paper transition-colors duration-300 hover:bg-transparent hover:text-crimson-2 disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="font-sans text-xs uppercase tracking-[0.15em] text-stone">
        {label}
        {required ? <span className="text-crimson-2"> *</span> : null}
      </label>
      {children}
    </div>
  );
}
