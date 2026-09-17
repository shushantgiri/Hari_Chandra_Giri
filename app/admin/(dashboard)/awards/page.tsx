import { Award } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata = { title: "Awards" };

export default function AwardsPage() {
  return (
    <ComingSoon
      title="Awards"
      description="Title, organization, year and an image per award."
      icon={Award}
    />
  );
}
