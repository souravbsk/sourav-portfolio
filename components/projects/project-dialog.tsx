"use client";

import Image from "next/image";
import { ExternalLinkIcon, SparklesIcon } from "lucide-react";

import { GithubIcon } from "@/components/site/brand-icons";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { externalHref } from "@/lib/utils";
import type { ProjectData } from "@/types/content";

export function ProjectDialog({
  project,
  onOpenChange,
}: {
  project: ProjectData | null;
  onOpenChange: (open: boolean) => void;
}) {
  const hero = project?.PhotoUrl || project?.projectSS[0] || "";

  return (
    <Dialog open={Boolean(project)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-5xl gap-0 overflow-hidden overflow-y-auto p-0 sm:rounded-3xl">
        {project && (
          <>
            <div className="relative isolate min-h-56 overflow-hidden bg-panel-strong md:min-h-72">
              {hero && (
                <Image
                  src={hero}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 960px"
                  className="object-cover object-top"
                />
              )}
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-popover via-popover/75 to-background/55"
              />

              <div className="relative z-10 flex h-full min-h-56 flex-col justify-end gap-3 px-6 pb-6 pt-16 md:min-h-72 md:px-8">
                {project.status === "special" && (
                  <Badge variant="violet" className="w-fit bg-background/70 backdrop-blur">
                    <SparklesIcon />
                    Featured build
                  </Badge>
                )}
                <DialogTitle className="max-w-3xl font-display text-3xl leading-tight md:text-4xl">
                  {project.title}
                </DialogTitle>
                {project.description && (
                  <DialogDescription className="max-w-2xl text-sm leading-relaxed text-foreground/80 md:text-base">
                    {project.description}
                  </DialogDescription>
                )}
              </div>
            </div>

            <div className="grid gap-8 px-6 py-6 md:grid-cols-[minmax(0,1fr)_240px] md:px-8 md:py-8">
              <div className="min-w-0 space-y-5">
                {project.projectSS.length > 0 ? (
                  <ProjectGallery images={project.projectSS} title={project.title} />
                ) : (
                  project.PhotoUrl && (
                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-panel-strong">
                      <Image
                        src={project.PhotoUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 720px"
                        className="object-cover object-top"
                      />
                    </div>
                  )
                )}
              </div>

              <aside className="space-y-6 md:sticky md:top-4 md:self-start">
                {project.skills.length > 0 && (
                  <div>
                    <p className="eyebrow mb-3">Tech stack</p>
                    <ul className="flex flex-wrap gap-1.5">
                      {project.skills.map((skill) => (
                        <li key={skill}>
                          <Badge variant="cyan">{skill}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2.5">
                  <p className="eyebrow">Open</p>
                  {project.liveLink && (
                    <Button asChild variant="gradient" className="w-full justify-start">
                      <a
                        href={externalHref(project.liveLink)}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        <ExternalLinkIcon />
                        Live site
                      </a>
                    </Button>
                  )}
                  {project.clientLink && (
                    <Button asChild variant="outline" className="w-full justify-start">
                      <a
                        href={externalHref(project.clientLink)}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        <GithubIcon className="size-4" />
                        Client code
                      </a>
                    </Button>
                  )}
                  {project.serverLink && (
                    <Button asChild variant="outline" className="w-full justify-start">
                      <a
                        href={externalHref(project.serverLink)}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        <GithubIcon className="size-4" />
                        Server code
                      </a>
                    </Button>
                  )}
                </div>
              </aside>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
