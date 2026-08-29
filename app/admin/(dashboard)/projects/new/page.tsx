import { AdminPageHeader } from "@/components/admin/admin-page";
import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <>
      <AdminPageHeader
        title="New project"
        description="It appears on the landing page as soon as you save."
        backHref="/admin/projects"
      />
      <ProjectForm />
    </>
  );
}
