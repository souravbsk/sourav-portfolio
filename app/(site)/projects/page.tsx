import type { Metadata } from "next";

import { ProjectGrid } from "@/components/projects/project-grid";
import { SectionHeading } from "@/components/site/section-heading";
import { getProjects } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description: "Client work and personal builds, with source and screenshots.",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ open?: string }>;
}) {
  const [projects, { open }] = await Promise.all([getProjects(), searchParams]);

  return (
    <div className="container-page pt-28 pb-16 md:pt-32">
      <SectionHeading
        eyebrow="Archive"
        title="Every project"
        description="The full set, newest first. Open any card for screenshots and source links."
      />

      {/* Keyed on the deep link so navigating from ?open=a to ?open=b remounts
          the grid and opens the new project, instead of keeping stale state. */}
      <ProjectGrid
        key={open ?? "none"}
        projects={projects}
        openId={open}
        showFilter
      />
    </div>
  );
}
