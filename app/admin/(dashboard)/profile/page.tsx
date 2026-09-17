import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/admin/ProfileForm";
import type { ProfileInput } from "@/lib/admin/profile-actions";

export const metadata = { title: "Athlete Profile" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("athlete_profile")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    return (
      <div className="mx-auto max-w-xl">
        <p className="font-display text-2xl uppercase text-paper">Athlete Profile</p>
        <p className="mt-6 border border-line-strong px-4 py-3 font-sans text-xs text-stone">
          Couldn&apos;t load the profile — this app isn&apos;t connected to a real Supabase
          project yet.
        </p>
      </div>
    );
  }

  const initial: ProfileInput = {
    full_name: profile?.full_name ?? "Hari Chandra Giri",
    bio: profile?.bio ?? "",
    discipline: profile?.discipline ?? "Hand-Walking",
    country: profile?.country ?? "Nepal",
    affiliation: profile?.affiliation ?? "Nepal Army Sports Centre",
    portrait_url: profile?.portrait_url ?? null,
  };

  return (
    <div>
      <p className="font-display text-2xl uppercase text-paper">Athlete Profile</p>
      <div className="mt-8">
        <ProfileForm initial={initial} />
      </div>
    </div>
  );
}
