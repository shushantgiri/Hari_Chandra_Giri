import { AchievementForm } from "@/components/admin/AchievementForm";

export const metadata = { title: "Add Achievement" };

export default function NewAchievementPage() {
  return (
    <div>
      <p className="font-display text-2xl uppercase text-paper">Add Achievement</p>
      <div className="mt-8">
        <AchievementForm />
      </div>
    </div>
  );
}
