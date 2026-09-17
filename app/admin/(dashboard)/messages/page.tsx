import { createClient } from "@/lib/supabase/server";
import { MessageCard } from "@/components/admin/MessageCard";

export const metadata = { title: "Messages" };

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: messages, error } = await supabase
    .from("messages")
    .select("id, name, email, purpose, message, status, created_at")
    .neq("status", "archived")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-display text-2xl uppercase text-paper">Messages</p>
      <p className="mt-1 font-sans text-sm text-stone">
        Submissions from the public site&apos;s contact form.
      </p>

      {error ? (
        <p className="mt-6 border border-line-strong px-4 py-3 font-sans text-xs text-stone">
          Couldn&apos;t load messages — this app isn&apos;t connected to a real Supabase project
          yet. See .env.local.example.
        </p>
      ) : messages && messages.length > 0 ? (
        <ul className="mt-6 border-t border-line">
          {messages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-center font-sans text-sm text-stone">No messages yet.</p>
      )}
    </div>
  );
}
