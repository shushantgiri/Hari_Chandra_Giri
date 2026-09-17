"use client";

import { useState, type FormEvent } from "react";
import { Eyebrow, SectionTitle } from "@/components/ui/typography";
import { cn } from "@/lib/cn";

const CATEGORIES = [
  "Media",
  "Events",
  "Brand Partnerships",
  "Demonstrations",
  "Speaking",
  "Record Enquiries",
] as const;

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>(CATEGORIES[0]);
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const payload = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      purpose: category,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Request failed");

      setStatus("success");
      form.reset();
      setCategory(CATEGORIES[0]);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section id="contact" className="wrap py-24 sm:py-32">
        <Eyebrow>Enquiry Sent</Eyebrow>
        <SectionTitle className="mt-3">Thank You</SectionTitle>
        <p className="mt-6 max-w-md font-sans text-base text-stone">
          Your message is in. Hari&apos;s team will get back to you shortly.
        </p>
      </section>
    );
  }

  return (
    <section id="contact" className="wrap py-24 sm:py-32">
      <Eyebrow>Get in Touch</Eyebrow>
      <SectionTitle className="mt-3">Work With Hari</SectionTitle>

      <div className="mt-10 flex flex-wrap gap-2.5" role="group" aria-label="Enquiry purpose">
        {CATEGORIES.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setCategory(option)}
            aria-pressed={category === option}
            className={cn(
              "border px-4 py-2 font-sans text-xs uppercase tracking-[0.1em] transition-colors duration-300 sm:text-sm",
              category === option
                ? "border-crimson bg-crimson text-paper"
                : "border-line-strong text-stone hover:border-paper hover:text-paper",
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-10 grid max-w-xl gap-6">
        <Field label="Name" name="name" type="text" required />
        <Field label="Email" name="email" type="email" required />

        <div>
          <label
            htmlFor="message"
            className="block font-sans text-xs uppercase tracking-[0.15em] text-stone"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="mt-2 w-full resize-none border border-line-strong bg-transparent px-3 py-2.5 font-sans text-base text-paper outline-none transition-colors duration-300 focus:border-paper"
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="group mt-2 inline-flex w-fit items-center gap-2.5 border border-paper bg-paper px-6 py-3.5 font-sans text-sm font-medium uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:bg-transparent hover:text-paper disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send Enquiry"}
        </button>

        {status === "error" ? (
          <p role="alert" className="font-sans text-sm text-crimson-2">
            Something went wrong sending that — please try again, or email directly.
          </p>
        ) : null}
      </form>
    </section>
  );
}

function Field({
  label,
  name,
  type,
  required,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block font-sans text-xs uppercase tracking-[0.15em] text-stone">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full border-b border-line-strong bg-transparent px-0 py-2 font-sans text-base text-paper outline-none transition-colors duration-300 focus:border-paper"
      />
    </div>
  );
}
