import Link from "next/link";
import { PlusIcon } from "lucide-react";

import {
  AdminPageHeader,
  EmptyState,
} from "@/components/admin/admin-page";
import { AdminProjectList } from "@/components/admin/project-list";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <AdminPageHeader
        title="Projects"
        description={`${projects.length} project${projects.length === 1 ? "" : "s"} on the site.`}
        actions={
          <Button asChild variant="gradient">
            <Link href="/admin/projects/new">
              <PlusIcon />
              New project
            </Link>
          </Button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Add your first project and it will appear on the landing page immediately."
          action={
            <Button asChild variant="gradient" className="mt-2">
              <Link href="/admin/projects/new">
                <PlusIcon />
                New project
              </Link>
            </Button>
          }
        />
      ) : (
        <AdminProjectList projects={projects} />
      )}
    </>
  );
}
