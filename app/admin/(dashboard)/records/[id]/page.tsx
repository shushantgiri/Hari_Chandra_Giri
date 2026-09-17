import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RecordForm } from "@/components/admin/RecordForm";
import type { RecordInput } from "@/lib/admin/records-actions";

export const metadata = { title: "Edit Record" };

export default async function EditRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: record } = await supabase.from("world_records").select("*").eq("id", id).single();

  if (!record) {
    notFound();
  }

  const initial: RecordInput = {
    title: record.title ?? "",
    category: record.category ?? "",
    result: record.result ?? "",
    unit: record.unit ?? "SECONDS",
    record_date: record.record_date ?? "",
    location: record.location ?? "",
    organization: record.organization ?? "Guinness World Records",
    verification_url: record.verification_url ?? "",
    description: record.description ?? "",
    cover_image_url: record.cover_image_url,
    featured: record.featured ?? false,
    status: record.status === "published" ? "published" : "draft",
  };

  return (
    <div>
      <p className="font-display text-2xl uppercase text-paper">Edit Record</p>
      <div className="mt-8">
        <RecordForm recordId={id} initial={initial} />
      </div>
    </div>
  );
}
