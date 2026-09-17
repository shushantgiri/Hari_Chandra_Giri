import { Video } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata = { title: "Videos" };

export default function VideosPage() {
  return (
    <ComingSoon
      title="Videos"
      description="Add video links, thumbnails and titles for the public site's Watch the Records section."
      icon={Video}
    />
  );
}
