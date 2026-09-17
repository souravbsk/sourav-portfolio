"use client";

import Image from "next/image";
import { ExternalLinkIcon, SparklesIcon, XIcon } from "lucide-react";

import { GithubIcon } from "@/components/site/brand-icons";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, externalHref } from "@/lib/utils";
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
      <DialogContent
        showClose={false}
        overlayClassName="bg-black/55 backdrop-blur-md"
        className="glass flex max-h-[min(92vh,52rem)] max-w-5xl flex-col gap-0 overflow-hidden border-white/15 bg-background/70 p-0 shadow-[0_40px_80px_-24px_rgb(0_0_0/0.55)] sm:rounded-[1.6rem]"
      >
        {project && (
          <>
            <DialogClose
              aria-label="Close"
              className="glass absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-full text-foreground transition-transform hover:scale-105"
            >
              <XIcon className="size-4" />
            </DialogClose>

            <div className="relative isolate min-h-44 shrink-0 overflow-hidden md:min-h-56">
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
                className="absolute inset-0 bg-linear-to-t from-background/80 via-background/10 to-transparent"
              />

              <div className="relative z-10 flex h-full min-h-44 items-end p-4 md:min-h-56 md:p-6">
                <div className="glass flex max-w-3xl flex-wrap items-center gap-3 rounded-2xl px-4 py-3">
                  {project.status === "special" && (
                    <Badge variant="violet" className="w-fit">
                      <SparklesIcon />
                      Featured
                    </Badge>
                  )}
                  <DialogTitle className="font-display text-xl leading-tight text-foreground md:text-3xl">
                    {project.title}
                  </DialogTitle>
                </div>
              </div>
            </div>

            <div className="grid min-h-0 flex-1 gap-6 overflow-y-auto overscroll-contain p-5 md:grid-cols-[minmax(0,1fr)_15.5rem] md:p-7">
              <div className="min-w-0 space-y-5">
                <DialogDescription className="sr-only">
                  {project.description
                    ? `Details for ${project.title}`
                    : `Project details for ${project.title}`}
                </DialogDescription>
                {project.description ? (
                  <div
                    className={cn(
                      "prose-project max-h-[min(22rem,46vh)] overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-background/40 p-4",
                      "text-[0.95rem] leading-relaxed",
                      "[&_a]:underline [&_a]:underline-offset-2",
                      "[&_strong]:font-semibold [&_em]:italic",
                      "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5",
                      "[&_p]:mt-0 [&_p+p]:mt-3 [&_li+li]:mt-1.5",
                    )}
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                ) : null}

                {project.projectSS.length > 0 ? (
                  <ProjectGallery
                    images={project.projectSS}
                    title={project.title}
                  />
                ) : (
                  project.PhotoUrl && (
                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-panel-strong">
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

              <aside className="glass h-fit space-y-5 rounded-2xl p-4 md:sticky md:top-0">
                {project.skills.length > 0 && (
                  <div>
                    <p className="eyebrow mb-3">Tech stack</p>
                    <ul className="flex flex-wrap gap-1.5">
                      {project.skills.map((skill) => (
                        <li key={skill}>
                          <span className="inline-flex rounded-full border border-cyan-brand/25 bg-cyan-brand/10 px-2.5 py-1 font-mono text-[0.625rem] tracking-wide text-cyan-brand">
                            {skill}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2.5">
                  <p className="eyebrow">Open</p>
                  {project.liveLink && (
                    <Button
                      asChild
                      variant="gradient"
                      className="w-full justify-start"
                    >
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
                    <Button
                      asChild
                      variant="outline"
                      className="w-full justify-start"
                    >
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
                    <Button
                      asChild
                      variant="outline"
                      className="w-full justify-start"
                    >
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
