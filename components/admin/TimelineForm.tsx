"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ImagePicker } from "@/components/admin/ImagePicker";
import {
  createTimelineEvent,
  updateTimelineEvent,
  type TimelineInput,
} from "@/lib/admin/timeline-actions";

const EMPTY: TimelineInput = {
  marker: "",
  title: "",
  description: "",
  image_url: null,
  record_id: null,
  status: "draft",
};

export function TimelineForm({
  milestoneId,
  initial,
  records,
}: {
  milestoneId?: string;
  initial?: TimelineInput;
  /** For the "link to a record" dropdown — fetched server-side by the page. */
  records: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<TimelineInput>(initial ?? EMPTY);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof TimelineInput>(key: K, value: TimelineInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function save(status: "draft" | "published") {
    setIsSaving(true);
    setError(null);

    const payload = { ...values, status };
    const result = milestoneId
      ? await updateTimelineEvent(milestoneId, payload)
      : await createTimelineEvent(payload);

    setIsSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/admin/timeline");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-xl pb-28">
      <div className="space-y-5">
        <Field label="Marker" required>
          <input
            value={values.marker}
            onChange={(e) => update("marker", e.target.value)}
            placeholder="e.g. AGE 8, or 2026"
            className="mt-2 w-full border-b border-line-strong bg-transparent py-2.5 font-sans text-base text-paper outline-none focus:border-paper"
          />
        </Field>

        <Field label="Title" required>
          <input
            value={values.title}
            onChange={(e) => update("title", e.target.value)}
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

        <Field label="Link to a World Record (optional)">
          <select
            value={values.record_id ?? ""}
            onChange={(e) => update("record_id", e.target.value || null)}
            className="mt-2 w-full border-b border-line-strong bg-transparent py-2.5 font-sans text-base text-paper outline-none focus:border-paper"
          >
            <option value="" className="bg-ink">
              None
            </option>
            {records.map((record) => (
              <option key={record.id} value={record.id} className="bg-ink">
                {record.title}
              </option>
            ))}
          </select>
        </Field>

        <ImagePicker
          folder="timeline"
          value={values.image_url}
          onChange={(url) => update("image_url", url)}
          label="Image"
        />

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
