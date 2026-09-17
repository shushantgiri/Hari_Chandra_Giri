import { Search } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata = { title: "SEO" };

export default function SeoPage() {
  return (
    <ComingSoon
      title="SEO"
      description="Edit the site title and description used in search results and social share cards."
      icon={Search}
    />
  );
}
