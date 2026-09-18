"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { ProjectCard } from "@/components/projects/project-card";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { RoleFitBar } from "@/components/projects/role-fit-bar";
import { fitLabel, matchRoleToProjects, type RoleFitResult } from "@/lib/role-fit";
import { cn } from "@/lib/utils";
import type { ProjectData } from "@/types/content";

export function ProjectGrid({
  projects,
  limit,
  openId,
  showFilter = false,
  showRoleFit = false,
}: {
  projects: ProjectData[];
  limit?: number;
  /** Lets the command palette deep-link straight into a project's details. */
  openId?: string;
  /** Tech-stack chips. Off on the landing Work strip; on for the archive. */
  showFilter?: boolean;
  /** Recruiter paste-a-JD matcher. Rare on personal sites; on for Work. */
  showRoleFit?: boolean;
}) {
  const [skill, setSkill] = useState("all");
  const [fit, setFit] = useState<RoleFitResult | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // The open project is derived from an id rather than held as its own copy of
  // the object, so an edit that changes the list is reflected in an open dialog
  // and the deep link needs no effect to sync it in.
  const [openedId, setOpenedId] = useState<string | null>(openId ?? null);

  const active = useMemo(
    () => projects.find((project) => project._id === openedId) ?? null,
    [openedId, projects],
  );

  const skills = useMemo(() => {
    const unique = new Set<string>();
    for (const project of projects) {
      for (const item of project.skills) {
        const trimmed = item.trim();
        if (trimmed) unique.add(trimmed);
      }
    }
    return [...unique].sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const visible = useMemo(() => {
    const filtered =
      skill === "all"
        ? projects
        : projects.filter((project) =>
            project.skills.some((item) => item === skill),
          );

    const ranked = fit
      ? [...filtered].sort((a, b) => {
          const scoreA = fit.ranked.find((row) => row.id === a._id)?.score ?? -1;
          const scoreB = fit.ranked.find((row) => row.id === b._id)?.score ?? -1;
          return scoreB - scoreA;
        })
      : filtered;

    return limit ? ranked.slice(0, limit) : ranked;
  }, [fit, limit, projects, skill]);

  if (projects.length === 0) {
    return (
      <div className="panel mt-10 p-12 text-center">
        <p className="text-sm text-muted-foreground">
          No projects published yet.
        </p>
      </div>
    );
  }

  return (
    <>
      {showRoleFit && (
        <RoleFitBar
          result={fit}
          onMatch={(query) => setFit(matchRoleToProjects(query, projects))}
          onClear={() => setFit(null)}
        />
      )}

      {showFilter && skills.length > 1 && (
        <div
          role="tablist"
          aria-label="Filter projects by tech stack"
          className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1"
        >
          {["all", ...skills].map((option) => {
            const selected = skill === option;
            return (
              <button
                key={option}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => setSkill(option)}
                className={cn(
                  "relative shrink-0 rounded-full border px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors",
                  selected
                    ? "border-cyan-brand/50 text-cyan-brand"
                    : "border-border text-muted-foreground hover:border-cyan-brand/30 hover:text-foreground",
                )}
              >
                {selected && !prefersReducedMotion && (
                  <motion.span
                    layoutId="project-skill-pill"
                    className="absolute inset-0 rounded-full bg-cyan-brand/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">
                  {option === "all" ? "All stacks" : option}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project, index) => (
            <motion.div
              key={project._id}
              layout={!prefersReducedMotion}
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className={
                fit && !fit.ranked.some((row) => row.id === project._id)
                  ? "opacity-45"
                  : undefined
              }
            >
              <ProjectCard
                project={project}
                onOpen={(item) => setOpenedId(item._id)}
                priority={index < 3}
                index={index}
                fitLabel={
                  fit
                    ? (() => {
                        const score = fit.ranked.find(
                          (row) => row.id === project._id,
                        )?.score;
                        return score ? fitLabel(score) : undefined;
                      })()
                    : undefined
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {visible.length === 0 && (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Nothing built with that stack yet.
        </p>
      )}

      <ProjectDialog
        project={active}
        onOpenChange={(open) => {
          if (!open) setOpenedId(null);
        }}
      />
    </>
  );
}
