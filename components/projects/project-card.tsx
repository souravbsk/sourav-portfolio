"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ImageIcon,
  SparklesIcon,
} from "lucide-react";
import { useReducedMotion } from "motion/react";

import { cn, stripHtml, truncate } from "@/lib/utils";
import type { ProjectData } from "@/types/content";

const SLIDE_MS = 4000;

function projectImages(project: ProjectData) {
  const seen = new Set<string>();
  const images: string[] = [];

  for (const url of [project.PhotoUrl, ...project.projectSS]) {
    const trimmed = url?.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    images.push(trimmed);
  }

  return images;
}

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
      onPointerMove={(event) => {
        const node = event.currentTarget;
        const rect = node.getBoundingClientRect();
        node.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        node.style.setProperty("--my", `${event.clientY - rect.top}px`);
      }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-border/80 bg-panel",
        "shadow-[0_18px_50px_-28px_rgb(6_11_24/0.55)] transition-[transform,box-shadow] duration-500",
        "hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-24px_rgb(15_155_144/0.28)]",
        isSpecial && "ring-1 ring-violet-brand/35",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(280px circle at var(--mx, 50%) var(--my, 20%), color-mix(in oklab, var(--brand-cyan) 32%, transparent), transparent 64%)",
        }}
      />
      <ProjectCardSlider
        images={projectImages(project)}
        title={project.title}
        indexLabel={String(index + 1).padStart(2, "0")}
        priority={priority}
        onOpen={() => onOpen(project)}
      />

      <button
        type="button"
        onClick={() => onOpen(project)}
        className="glass relative flex flex-1 flex-col gap-3 border-t border-white/10 p-4 text-left"
        aria-label={`Open details for ${project.title}`}
      >
        {isSpecial && (
          <span className="inline-flex w-fit items-center gap-1 rounded-full border border-violet-brand/30 bg-violet-brand/15 px-2.5 py-0.5 font-mono text-[0.625rem] tracking-wide text-violet-brand">
            <SparklesIcon className="size-3" />
            Featured
          </span>
        )}

        <h3 className="font-display text-xl font-semibold leading-snug tracking-tight">
          {project.title}
        </h3>

        {project.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {truncate(stripHtml(project.description), 110)}
          </p>
        )}

        {visibleSkills.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {visibleSkills.map((skill) => (
              <li key={skill}>
                <span className="inline-flex rounded-full border border-cyan-brand/25 bg-cyan-brand/10 px-2.5 py-1 font-mono text-[0.625rem] tracking-wide text-cyan-brand">
                  {skill}
                </span>
              </li>
            ))}
            {extraSkills > 0 && (
              <li>
                <span className="inline-flex rounded-full border border-border bg-background/50 px-2.5 py-1 font-mono text-[0.625rem] text-muted-foreground">
                  +{extraSkills}
                </span>
              </li>
            )}
          </ul>
        )}
      </button>
    </article>
  );
}

function ProjectCardSlider({
  images,
  title,
  indexLabel,
  priority,
  onOpen,
}: {
  images: string[];
  title: string;
  indexLabel: string;
  priority: boolean;
  onOpen: () => void;
}) {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const count = images.length;
  const imageKey = images.join("\0");

  const step = useCallback(
    (delta: number) => {
      if (count < 2) return;
      setSlide((current) => (current + delta + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (count < 2 || paused || prefersReducedMotion) return;

    const timer = window.setInterval(() => step(1), SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [count, paused, prefersReducedMotion, step]);

  useEffect(() => {
    setSlide(0);
  }, [imageKey]);

  return (
    <div
      className="relative aspect-16/10 overflow-hidden bg-panel-strong"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {count === 0 ? (
        <div className="grid h-full place-items-center text-muted-foreground/40">
          <ImageIcon className="size-8" />
        </div>
      ) : (
        <>
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
            {images.map((src, imageIndex) => (
              <Image
                key={`${src}-${imageIndex}`}
                src={src}
                alt={`${title} screenshot ${imageIndex + 1} of ${count}`}
                fill
                priority={priority && imageIndex === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
                className={cn(
                  "object-cover object-top transition-opacity duration-700 ease-out",
                  imageIndex === slide
                    ? "z-1 opacity-100"
                    : "z-0 opacity-0",
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onOpen}
            className="absolute inset-0 z-10"
            aria-label={`Open details for ${title}`}
          />
        </>
      )}

      <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex items-start justify-between gap-2">
        <span className="glass rounded-full px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.18em] text-foreground/80">
          {indexLabel}
        </span>
        <span className="glass grid size-9 place-items-center rounded-full text-foreground transition-transform duration-500 group-hover:rotate-45">
          <ArrowUpRightIcon className="size-4" />
        </span>
      </div>

      {count > 1 && (
        <>
          <SliderArrow direction="prev" onClick={() => step(-1)} />
          <SliderArrow direction="next" onClick={() => step(1)} />

          <span className="glass pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full px-2.5 py-1 font-mono text-[0.625rem] text-foreground">
            {slide + 1} / {count}
          </span>
        </>
      )}
    </div>
  );
}

function SliderArrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous screenshot" : "Next screenshot"}
      className={cn(
        "glass absolute top-1/2 z-20 grid size-8 -translate-y-1/2 place-items-center rounded-full text-foreground",
        "opacity-90 transition-opacity hover:opacity-100",
        direction === "prev" ? "left-3" : "right-3",
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}
