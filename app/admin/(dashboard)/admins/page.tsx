import { Users } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata = { title: "Admin Users" };

export default function AdminsPage() {
  return (
    <ComingSoon
      title="Admin Users"
      description="Manage who can sign in here. Until this screen is built: create the person's account in Supabase Auth, then add a matching row in the profiles table with role 'admin' or 'editor' (Supabase Dashboard → Table Editor)."
      icon={Users}
    />
  );
}
