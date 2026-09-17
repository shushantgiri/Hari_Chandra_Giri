import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RecordRow } from "@/components/admin/RecordRow";

export const metadata = { title: "World Records" };

export default async function RecordsListPage() {
  const supabase = await createClient();
  const { data: records, error } = await supabase
    .from("world_records")
    .select("id, title, result, unit, status, featured, cover_image_url")
    .order("record_date", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl uppercase text-paper">World Records</p>
        <Link
          href="/admin/records/new"
          className="flex items-center gap-1.5 border border-paper bg-paper px-4 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.1em] text-ink transition-colors duration-300 hover:bg-transparent hover:text-paper"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add
        </Link>
      </div>

      {error ? (
        <p className="mt-6 border border-line-strong px-4 py-3 font-sans text-xs text-stone">
          Couldn&apos;t load records — this app isn&apos;t connected to a real Supabase project
          yet. See .env.local.example.
        </p>
      ) : records && records.length > 0 ? (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {records.map((record) => (
            <RecordRow key={record.id} record={record} />
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-center font-sans text-sm text-stone">
          No records yet.{" "}
          <Link href="/admin/records/new" className="text-paper underline">
            Add the first one
          </Link>
          .
        </p>
      )}
    </div>
  );
}
