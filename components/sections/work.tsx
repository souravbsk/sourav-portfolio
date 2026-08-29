import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { ProjectGrid } from "@/components/projects/project-grid";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import type { ProjectData } from "@/types/content";

export function Work({ projects }: { projects: ProjectData[] }) {
  return (
    <section id="work" className="scroll-mt-24 py-24 md:py-32">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="03 — Selected work"
            title="Things I have shipped"
            description="Client work and personal builds. Open any card for screenshots and source."
          />

          {projects.length > 6 && (
            <Button asChild variant="outline">
              <Link href="/projects">
                All {projects.length} projects
                <ArrowRightIcon />
              </Link>
            </Button>
          )}
        </div>

        <ProjectGrid projects={projects} limit={6} />
      </div>
    </section>
  );
}
