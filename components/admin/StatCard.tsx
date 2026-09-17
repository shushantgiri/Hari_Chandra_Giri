export function StatCard({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="border border-line px-4 py-5">
      <p className="font-display text-4xl text-paper">{value === null ? "—" : value}</p>
      <p className="mt-1 font-sans text-xs uppercase tracking-[0.1em] text-stone">{label}</p>
    </div>
  );
}
