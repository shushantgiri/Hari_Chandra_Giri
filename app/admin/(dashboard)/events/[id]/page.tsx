import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EventForm } from "@/components/admin/EventForm";
import type { EventInput } from "@/lib/admin/events-actions";

export const metadata = { title: "Edit Event" };

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase.from("events").select("*").eq("id", id).single();

  if (!event) {
    notFound();
  }

  const initial: EventInput = {
    name: event.name ?? "",
    event_date: event.event_date ?? "",
    event_time: event.event_time ?? "",
    location: event.location ?? "",
    description: event.description ?? "",
    cover_image_url: event.cover_image_url,
    external_link: event.external_link ?? "",
    featured: event.featured ?? false,
    status: event.status === "published" || event.status === "past" ? event.status : "draft",
  };

  return (
    <div>
      <p className="font-display text-2xl uppercase text-paper">Edit Event</p>
      <div className="mt-8">
        <EventForm eventId={id} initial={initial} />
      </div>
    </div>
  );
}
