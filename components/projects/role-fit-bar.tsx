"use client";

import { useState } from "react";
import { CopyIcon, SparklesIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { RoleFitResult } from "@/lib/role-fit";
import { cn } from "@/lib/utils";

const EXAMPLES = [
  "Next.js seller dashboard, TypeScript, REST APIs",
  "WordPress + Elementor portfolio site",
  "Full-stack MERN engineer for an e-commerce admin",
];

export function RoleFitBar({
  result,
  onMatch,
  onClear,
}: {
  result: RoleFitResult | null;
  onMatch: (query: string) => void;
  onClear: () => void;
}) {
  const [value, setValue] = useState("");

  function submit(query = value) {
    const trimmed = query.trim();
    if (!trimmed) return;
    setValue(trimmed);
    onMatch(trimmed);
  }

  async function copyBrief() {
    if (!result?.brief) return;
    try {
      await navigator.clipboard.writeText(result.brief);
      toast.success("Brief copied — paste it into the hiring thread");
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-cyan-brand/20 bg-panel/70 p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-cyan-brand">
            <SparklesIcon className="size-3.5" />
            Role fit
          </p>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Paste a job title or a few lines from the JD. The grid rearranges to
            the work that actually overlaps — most portfolios cannot do this.
          </p>
        </div>
        {result && (
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            <XIcon />
            Clear
          </Button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              submit();
            }
          }}
          rows={2}
          placeholder="e.g. Senior Next.js engineer for a multi-vendor dashboard…"
          className="min-h-20 flex-1"
          aria-label="Role or job description to match"
        />
        <Button
          type="button"
          variant="gradient"
          className="sm:self-end"
          onClick={() => submit()}
          disabled={!value.trim()}
        >
          Match my work
        </Button>
      </div>

      <ul className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <li key={example}>
            <button
              type="button"
              onClick={() => submit(example)}
              className="rounded-full border border-border px-3 py-1 font-mono text-[0.625rem] text-muted-foreground transition-colors hover:border-cyan-brand/40 hover:text-foreground"
            >
              {example}
            </button>
          </li>
        ))}
      </ul>

      {result && (
        <div className="mt-4 rounded-xl border border-border bg-background/50 p-4">
          <p className="text-sm leading-relaxed text-foreground">
            {result.headline}
          </p>
          {result.matchedSkills.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {result.matchedSkills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-cyan-brand/30 bg-cyan-brand/10 px-2.5 py-1 font-mono text-[0.625rem] text-cyan-brand"
                >
                  {skill}
                </li>
              ))}
            </ul>
          )}
          {result.brief && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn("mt-4")}
              onClick={() => void copyBrief()}
            >
              <CopyIcon />
              Copy a 4-line hiring brief
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
