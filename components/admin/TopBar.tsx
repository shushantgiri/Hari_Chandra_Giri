import { LogOut } from "lucide-react";
import { signOut } from "@/lib/admin/auth-actions";

export function TopBar({ email }: { email: string | null }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-ink/95 px-5 py-4 backdrop-blur-md lg:px-8">
      <div>
        <p className="font-sans text-xs uppercase tracking-[0.15em] text-stone">Signed in as</p>
        <p className="font-sans text-sm text-paper">{email ?? "—"}</p>
      </div>
      <form action={signOut}>
        <button
          type="submit"
          aria-label="Sign out"
          className="flex items-center gap-2 rounded-lg border border-line-strong px-3 py-2 font-sans text-xs uppercase tracking-wide text-stone transition-colors duration-200 hover:border-paper hover:text-paper"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden />
          Sign Out
        </button>
      </form>
    </header>
  );
}
