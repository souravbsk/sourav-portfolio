import Image from "next/image";

import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { SKILL_GROUP_LABELS, type SkillGroup } from "@/lib/taxonomy";
import type { SkillData } from "@/types/content";

const GROUP_ORDER: SkillGroup[] = [
  "frontend",
  "backend",
  "database",
  "tooling",
  "cms",
  "ai",
];

export function Skills({ skills }: { skills: SkillData[] }) {
  const grouped = GROUP_ORDER.map((group) => ({
    group,
    label: SKILL_GROUP_LABELS[group],
    items: skills.filter((skill) => skill.group === group),
  })).filter((entry) => entry.items.length > 0);

  if (grouped.length === 0) return null;

  return (
    <section id="skills" className="scroll-mt-24 py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="02 — Toolkit"
          title="What I build with"
          description="Grouped by where each one sits in a project rather than listed as one long wall of logos."
        />

        <div className="mt-12 space-y-10">
          {grouped.map((entry) => (
            <div key={entry.group}>
              <div className="mb-4 flex items-center gap-3">
                <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
                  {entry.label}
                </h3>
                <span className="h-px flex-1 bg-border" />
                <span className="font-mono text-[0.6875rem] text-muted-foreground/70">
                  {String(entry.items.length).padStart(2, "0")}
                </span>
              </div>

              <RevealGroup
                as="ul"
                stagger={0.04}
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              >
                {entry.items.map((skill) => (
                  <RevealItem key={skill._id} as="li">
                    <div className="panel panel-glow group flex items-center gap-3 p-3.5 transition-transform duration-300 hover:-translate-y-1">
                      <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-panel-strong">
                        {skill.icon ? (
                          <Image
                            src={skill.icon}
                            alt=""
                            width={24}
                            height={24}
                            className="size-6 object-contain transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <span className="font-mono text-xs text-muted-foreground">
                            {skill.title.slice(0, 2)}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {skill.title}
                        </p>
                        {/* Five dots rather than a percentage: an honest coarse
                            signal instead of a made-up number. */}
                        <div className="mt-1.5 flex gap-1" aria-hidden>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <span
                              key={index}
                              className={
                                index < skill.level
                                  ? "size-1 rounded-full bg-cyan-brand"
                                  : "size-1 rounded-full bg-border"
                              }
                            />
                          ))}
                        </div>
                        <span className="sr-only">
                          Confidence {skill.level} out of 5
                        </span>
                      </div>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
