import { PhotoUploadFlow } from "@/components/admin/PhotoUploadFlow";

export const metadata = { title: "Upload Photos" };

export default function PhotoUploadPage() {
  return (
    <div>
      <p className="font-display text-2xl uppercase text-paper">Upload Photos</p>
      <div className="mt-8">
        <PhotoUploadFlow />
      </div>
    </div>
  );
}
