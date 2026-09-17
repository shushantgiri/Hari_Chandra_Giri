"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { updateAthleteProfile, type ProfileInput } from "@/lib/admin/profile-actions";

export function ProfileForm({ initial }: { initial: ProfileInput }) {
  const [values, setValues] = useState<ProfileInput>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof ProfileInput>(key: K, value: ProfileInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  async function save() {
    setIsSaving(true);
    setError(null);

    const result = await updateAthleteProfile(values);

    setIsSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSaved(true);
  }

  return (
    <div className="mx-auto max-w-xl pb-28">
      <div className="space-y-5">
        <ImagePicker
          folder="profile"
          value={values.portrait_url}
          onChange={(url) => update("portrait_url", url)}
          label="Portrait"
        />

        <Field label="Full Name" required>
          <input
            value={values.full_name}
            onChange={(e) => update("full_name", e.target.value)}
            className="mt-2 w-full border-b border-line-strong bg-transparent py-2.5 font-sans text-base text-paper outline-none focus:border-paper"
          />
        </Field>

        <Field label="Bio">
          <textarea
            value={values.bio}
            onChange={(e) => update("bio", e.target.value)}
            rows={5}
            className="mt-2 w-full resize-none border border-line-strong bg-transparent px-3 py-2.5 font-sans text-base text-paper outline-none focus:border-paper"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Discipline">
            <input
              value={values.discipline}
              onChange={(e) => update("discipline", e.target.value)}
              className="mt-2 w-full border-b border-line-strong bg-transparent py-2.5 font-sans text-base text-paper outline-none focus:border-paper"
            />
          </Field>
          <Field label="Country">
            <input
              value={values.country}
              onChange={(e) => update("country", e.target.value)}
              className="mt-2 w-full border-b border-line-strong bg-transparent py-2.5 font-sans text-base text-paper outline-none focus:border-paper"
            />
          </Field>
        </div>

        <Field label="Affiliation">
          <input
            value={values.affiliation}
            onChange={(e) => update("affiliation", e.target.value)}
            className="mt-2 w-full border-b border-line-strong bg-transparent py-2.5 font-sans text-base text-paper outline-none focus:border-paper"
          />
        </Field>

        {error ? (
          <p role="alert" className="font-sans text-sm text-crimson-2">
            {error}
          </p>
        ) : null}
        {saved ? <p className="font-sans text-sm text-crimson-2">Saved.</p> : null}

        <div className="border-t border-line pt-6">
          <button
            type="button"
            disabled={isSaving}
            onClick={save}
            className="flex w-full items-center justify-center gap-2 border border-paper bg-paper px-6 py-3.5 font-sans text-sm font-medium uppercase tracking-[0.1em] text-ink transition-colors duration-300 hover:bg-transparent hover:text-paper disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            Save Changes
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
