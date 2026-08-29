import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page";
import { ProjectForm } from "@/components/admin/project-form";
import { getProject } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) notFound();

  return (
    <>
      <AdminPageHeader
        title="Edit project"
        description={project.title}
        backHref="/admin/projects"
      />
      <ProjectForm project={project} />
    </>
  );
}
