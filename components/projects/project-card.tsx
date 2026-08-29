"use client";

import Image from "next/image";
import { ArrowUpRightIcon, ImageIcon, SparklesIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn, truncate } from "@/lib/utils";
import type { ProjectData } from "@/types/content";

export function ProjectCard({
  project,
  onOpen,
  priority = false,
  index = 0,
}: {
  project: ProjectData;
  onOpen: (project: ProjectData) => void;
  priority?: boolean;
  index?: number;
}) {
  const isSpecial = project.status === "special";
  const visibleSkills = project.skills.slice(0, 4);
  const extraSkills = project.skills.length - visibleSkills.length;

  return (
    <article
      className={cn(
        "group relative h-full overflow-hidden rounded-[1.35rem] border border-border bg-panel-strong",
        isSpecial && "ring-1 ring-violet-brand/40",
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="relative flex h-full min-h-80 w-full flex-col text-left"
        aria-label={`Open details for ${project.title}`}
      >
        <div className="absolute inset-0">
          {project.PhotoUrl ? (
            <Image
              src={project.PhotoUrl}
              alt={project.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="grid h-full place-items-center bg-panel text-muted-foreground/40">
              <ImageIcon className="size-8" />
            </div>
          )}

          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-black/15"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/55"
          />
          <div
            aria-hidden
            className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-full group-hover:opacity-100"
          />
        </div>

        <div className="relative flex flex-1 flex-col justify-between p-5">
          <div className="flex items-start justify-between gap-3">
            <span className="font-mono text-[0.625rem] tracking-[0.22em] text-white/70">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="grid size-9 place-items-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRightIcon className="size-4" />
            </span>
          </div>

          <div className="space-y-3">
            {isSpecial && (
              <Badge variant="violet" className="bg-black/50 backdrop-blur">
                <SparklesIcon />
                Featured
              </Badge>
            )}

            <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight text-white">
              {project.title}
            </h3>

            {project.description && (
              <p className="line-clamp-2 text-sm leading-relaxed text-white/70">
                {truncate(project.description, 110)}
              </p>
            )}

            {visibleSkills.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {visibleSkills.map((skill) => (
                  <li key={skill} className="max-w-full">
                    <span className="inline-flex max-w-full truncate rounded-full border border-border bg-background px-2.5 py-1 font-mono text-[0.6875rem] font-medium tracking-wide text-foreground shadow-sm">
                      {skill}
                    </span>
                  </li>
                ))}
                {extraSkills > 0 && (
                  <li>
                    <span className="inline-flex rounded-full border border-border bg-background px-2.5 py-1 font-mono text-[0.6875rem] font-medium text-muted-foreground shadow-sm">
                      +{extraSkills}
                    </span>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </button>
    </article>
  );
}
