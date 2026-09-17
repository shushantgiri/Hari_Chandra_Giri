import { EventForm } from "@/components/admin/EventForm";

export const metadata = { title: "Add Event" };

export default function NewEventPage() {
  return (
    <div>
      <p className="font-display text-2xl uppercase text-paper">Add Event</p>
      <div className="mt-8">
        <EventForm />
      </div>
    </div>
  );
}
