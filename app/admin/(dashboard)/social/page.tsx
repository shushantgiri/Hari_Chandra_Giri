import { Share2 } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata = { title: "Social Links" };

export default function SocialPage() {
  return (
    <ComingSoon
      title="Social Links"
      description="Add verified Instagram, YouTube and other profile URLs — these will show in the public site's footer once added."
      icon={Share2}
    />
  );
}
