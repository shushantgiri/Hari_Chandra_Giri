import { RecordForm } from "@/components/admin/RecordForm";

export const metadata = { title: "Add Record" };

export default function NewRecordPage() {
  return (
    <div>
      <p className="font-display text-2xl uppercase text-paper">Add Record</p>
      <div className="mt-8">
        <RecordForm />
      </div>
    </div>
  );
}
