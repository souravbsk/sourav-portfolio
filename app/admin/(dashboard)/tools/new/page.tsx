import { AdminPageHeader } from "@/components/admin/admin-page";
import { ToolForm } from "@/components/admin/tool-form";

export default function NewToolPage() {
  return (
    <>
      <AdminPageHeader
        title="New tool"
        description="Publish it when it is ready; drafts stay private."
        backHref="/admin/tools"
      />
      <ToolForm />
    </>
  );
}
