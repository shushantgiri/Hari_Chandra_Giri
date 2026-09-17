import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata = { title: "Site Settings" };

export default function SettingsPage() {
  return (
    <ComingSoon
      title="Site Settings"
      description="General site configuration — the site_settings table (see supabase/schema.sql) already has a row waiting for this screen."
      icon={Settings}
    />
  );
}
