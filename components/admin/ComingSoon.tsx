import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function ComingSoon({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line-strong text-stone">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <p className="mt-5 font-display text-xl uppercase text-paper">{title}</p>
      <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{description}</p>
      <p className="mt-4 font-sans text-xs text-stone">
        Built the same way as{" "}
        <Link href="/admin/records" className="text-paper underline">
          World Records
        </Link>
        — table, RLS policy and form already follow that pattern in the schema.
      </p>
    </div>
  );
}
