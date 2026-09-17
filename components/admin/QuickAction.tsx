import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2.5 border border-line px-3 py-5 text-center transition-colors duration-200 hover:border-line-strong"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong text-crimson-2">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <span className="font-sans text-xs font-medium text-paper">{label}</span>
    </Link>
  );
}
