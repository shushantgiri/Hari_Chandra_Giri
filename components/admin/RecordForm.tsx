"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { createRecord, updateRecord, type RecordInput } from "@/lib/admin/records-actions";
import { cn } from "@/lib/cn";

const STEPS = ["Details", "Media & Verification", "Review"] as const;

const EMPTY: RecordInput = {
  title: "",
  category: "",
  result: "",
  unit: "SECONDS",
  record_date: "",
  location: "",
  organization: "Guinness World Records",
  verification_url: "",
  description: "",
  cover_image_url: null,
  featured: false,
  status: "draft",
};

export function RecordForm({
  recordId,
  initial,
}: {
  /** Present when editing an existing record; absent when creating one. */
  recordId?: string;
  initial?: RecordInput;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<RecordInput>(initial ?? EMPTY);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof RecordInput>(key: K, value: RecordInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function validateStep(current: number): string | null {
    if (current === 0 && (!values.title.trim() || !values.result.trim())) {
      return "Record title and the result/achievement value are required.";
    }
    return null;
  }

  function goNext() {
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function save(status: "draft" | "published") {
    setIsSaving(true);
    setError(null);

    const payload = { ...values, status };
    const result = recordId ? await updateRecord(recordId, payload) : await createRecord(payload);

    setIsSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/admin/records");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-xl pb-28">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, index) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-sans text-xs",
                index <= step ? "bg-crimson text-paper" : "border border-line-strong text-stone",
              )}
            >
              {index + 1}
            </span>
            <span
              className={cn(
                "hidden font-sans text-xs uppercase tracking-wide sm:block",
                index === step ? "text-paper" : "text-stone",
              )}
            >
              {label}
            </span>
            {index < STEPS.length - 1 ? (
              <span aria-hidden className="h-px flex-1 bg-line" />
            ) : null}
          </div>
        ))}
      </div>

      {/* Step 1 — Details */}
      {step === 0 ? (
        <div className="mt-8 space-y-5">
          <Field label="Record Title" required>
            <input
              value={values.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Fastest time to descend 100 stairs on hands"
              className="mt-2 w-full border-b border-line-strong bg-transparent py-2.5 font-sans text-base text-paper outline-none focus:border-paper"
            />
          </Field>

          <Field label="Category">
            <input
              value={values.category}
              onChange={(e) => update("category", e.target.value)}
              placeholder="e.g. Hand-Walking"
              className="mt-2 w-full border-b border-line-strong bg-transparent py-2.5 font-sans text-base text-paper outline-none focus:border-paper"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Result / Achievement" required>
              <input
                value={values.result}
                onChange={(e) => update("result", e.target.value)}
                placeholder="44.71"
                className="mt-2 w-full border-b border-line-strong bg-transparent py-2.5 font-sans text-base text-paper outline-none focus:border-paper"
              />
            </Field>
            <Field label="Unit">
              <input
                value={values.unit}
                onChange={(e) => update("unit", e.target.value)}
                placeholder="SECONDS"
                className="mt-2 w-full border-b border-line-strong bg-transparent py-2.5 font-sans text-base text-paper outline-none focus:border-paper"
              />
            </Field>
          </div>

          <Field label="Date">
            <input
              type="date"
              value={values.record_date}
              onChange={(e) => update("record_date", e.target.value)}
              className="mt-2 w-full border-b border-line-strong bg-transparent py-2.5 font-sans text-base text-paper outline-none focus:border-paper [color-scheme:dark]"
            />
          </Field>

          <Field label="Location">
            <input
              value={values.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="City, Country"
              className="mt-2 w-full border-b border-line-strong bg-transparent py-2.5 font-sans text-base text-paper outline-none focus:border-paper"
            />
          </Field>

          <Field label="Organization">
            <input
              value={values.organization}
              onChange={(e) => update("organization", e.target.value)}
              className="mt-2 w-full border-b border-line-strong bg-transparent py-2.5 font-sans text-base text-paper outline-none focus:border-paper"
            />
          </Field>
        </div>
      ) : null}

      {/* Step 2 — Media & Verification */}
      {step === 1 ? (
        <div className="mt-8 space-y-5">
          <ImagePicker
            folder="records"
            value={values.cover_image_url}
            onChange={(url) => update("cover_image_url", url)}
          />

          <Field label="Verification Link / Document">
            <input
              value={values.verification_url}
              onChange={(e) => update("verification_url", e.target.value)}
              placeholder="https://www.guinnessworldrecords.com/..."
              className="mt-2 w-full border-b border-line-strong bg-transparent py-2.5 font-sans text-base text-paper outline-none focus:border-paper"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              rows={5}
              className="mt-2 w-full resize-none border border-line-strong bg-transparent px-3 py-2.5 font-sans text-base text-paper outline-none focus:border-paper"
            />
          </Field>
        </div>
      ) : null}

      {/* Step 3 — Review */}
      {step === 2 ? (
        <div className="mt-8">
          <div className="divide-y divide-line border-y border-line">
            <ReviewRow label="Title" value={values.title} />
            <ReviewRow label="Category" value={values.category || "—"} />
            <ReviewRow label="Result" value={`${values.result || "—"} ${values.unit}`} />
            <ReviewRow label="Date" value={values.record_date || "—"} />
            <ReviewRow label="Location" value={values.location || "—"} />
            <ReviewRow label="Organization" value={values.organization || "—"} />
            <ReviewRow label="Verification" value={values.verification_url || "—"} />
            <ReviewRow label="Cover Photo" value={values.cover_image_url ? "Attached" : "None"} />
          </div>

          <label className="mt-6 flex items-center justify-between border border-line px-4 py-3.5">
            <span className="font-sans text-sm text-paper">Featured</span>
            <input
              type="checkbox"
              checked={values.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="h-5 w-5 accent-crimson"
            />
          </label>

          {error ? (
            <p role="alert" className="mt-4 font-sans text-sm text-crimson-2">
              {error}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
      ) : null}

      {/* Step navigation (steps 1–2 only; step 3 has its own Save/Publish) */}
      {step < 2 ? (
        <>
          {error ? (
            <p role="alert" className="mt-4 font-sans text-sm text-crimson-2">
              {error}
            </p>
          ) : null}
          <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="flex items-center gap-1.5 font-sans text-sm text-stone transition-colors duration-200 hover:text-paper disabled:invisible"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-1.5 border border-paper bg-paper px-6 py-3 font-sans text-sm font-medium uppercase tracking-[0.1em] text-ink transition-colors duration-300 hover:bg-transparent hover:text-paper"
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </>
      ) : null}
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

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <span className="font-sans text-xs uppercase tracking-wide text-stone">{label}</span>
      <span className="max-w-[60%] text-right font-sans text-sm text-paper">{value}</span>
    </div>
  );
}
