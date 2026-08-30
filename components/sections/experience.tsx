import Link from "next/link";
import {
  BriefcaseIcon,
  CodeIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  ServerIcon,
} from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ReactIcon, WordpressIcon } from "@/components/site/brand-icons";
import { SectionHeading } from "@/components/site/section-heading";
import { Badge } from "@/components/ui/badge";
import { externalHref } from "@/lib/utils";
import type { ExperienceData } from "@/types/content";

const ICONS = {
  wordpress: WordpressIcon,
  react: ReactIcon,
  database: DatabaseIcon,
  code: CodeIcon,
  server: ServerIcon,
  briefcase: BriefcaseIcon,
} as const;

export function Experience({ items }: { items: ExperienceData[] }) {
  if (items.length === 0) return null;

  return (
    <section id="experience" className="scroll-mt-24 py-16 md:py-20">
      <div className="container-page">
        <SectionHeading eyebrow="04 — Experience" title="Where I have worked" />

        <RevealGroup as="ul" stagger={0.1} className="relative mt-8">
          {/* Single hairline rail behind the markers rather than a per-item
              border, so the timeline reads as one continuous line. */}
          <span
            aria-hidden
            className="absolute left-5 top-2 bottom-2 w-px bg-linear-to-b from-cyan-brand/50 via-violet-brand/35 to-transparent"
          />

          {items.map((item) => {
            const Icon = ICONS[item.icon] ?? BriefcaseIcon;
            const href = externalHref(item.companyUrl);

            return (
              <RevealItem
                key={item._id}
                as="li"
                className="relative pb-8 pl-16 last:pb-0"
              >
                <span className="absolute left-0 top-0 grid size-10 place-items-center rounded-full border border-border bg-background text-muted-foreground">
                  <Icon className="size-4.5" />
                </span>

                <div className="panel panel-glow p-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h3 className="font-display text-lg font-semibold">
                      {item.role}
                    </h3>
                    {item.current && <Badge variant="cyan">Current</Badge>}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    {href ? (
                      <Link
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 text-sm text-violet-brand hover:underline"
                      >
                        {item.company}
                        <ExternalLinkIcon className="size-3" />
                      </Link>
                    ) : (
                      <span className="text-sm text-violet-brand">
                        {item.company}
                      </span>
                    )}
                    {item.period && (
                      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground">
                        {item.period}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <div
                      className="prose prose-sm prose-neutral dark:prose-invert mt-3 max-w-none text-sm leading-relaxed text-muted-foreground [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_p]:mt-0"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  )}

                  {item.highlights.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {item.highlights.map((highlight) => (
                        <li key={highlight}>
                          <Badge variant="outline">{highlight}</Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
