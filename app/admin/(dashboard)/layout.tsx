import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/admin/Sidebar";
import { BottomNav } from "@/components/admin/BottomNav";
import { TopBar } from "@/components/admin/TopBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already redirects signed-out visitors, but a Server
  // Component shouldn't trust that alone — check again here.
  if (!user) {
    redirect("/admin/login");
  }

  // Being signed in isn't the same as being an admin — that's a row in
  // public.profiles (see supabase/schema.sql). Someone can have a valid
  // Supabase account and still see nothing, by design.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-2xl uppercase text-paper">Access Pending</p>
        <p className="mt-3 max-w-xs font-sans text-sm text-stone">
          Your account ({user.email}) is signed in but isn&apos;t set up as an admin yet. Ask an
          existing admin to add a row for you in the <code>profiles</code> table.
        </p>
      </div>
    );
  }

  return (
    <div className="lg:pl-64">
      <Sidebar />
      <TopBar email={user.email ?? null} />
      <main id="main-content" className="px-5 pb-24 pt-6 lg:px-8 lg:pb-10">{children}</main>
      <BottomNav />
    </div>
  );
}
