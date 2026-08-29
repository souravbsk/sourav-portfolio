import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page";
import { ToolForm } from "@/components/admin/tool-form";
import { getToolBySlug } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function EditToolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // The lookup accepts an id or a slug, so the admin URL can use either.
  const tool = await getToolBySlug(id);

  if (!tool) notFound();

  return (
    <>
      <AdminPageHeader
        title="Edit tool"
        description={tool.name}
        backHref="/admin/tools"
      />
      <ToolForm tool={tool} />
    </>
  );
}
