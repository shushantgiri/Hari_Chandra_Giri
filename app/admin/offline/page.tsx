import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line-strong">
        <WifiOff className="h-6 w-6 text-stone" aria-hidden />
      </span>
      <h1 className="mt-6 font-display text-2xl uppercase text-paper">You&apos;re Offline</h1>
      <p className="mt-2 max-w-xs font-sans text-sm text-stone">
        This page hasn&apos;t been saved for offline use yet. Reconnect and it&apos;ll load
        normally.
      </p>
    </div>
  );
}
