import { Layers } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata = { title: "Galleries" };

export default function GalleriesPage() {
  return (
    <ComingSoon
      title="Galleries"
      description="Group photos (already uploaded in Media → Photos) into named galleries with a cover image."
      icon={Layers}
    />
  );
}
