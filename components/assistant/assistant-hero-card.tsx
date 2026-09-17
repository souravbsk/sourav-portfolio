"use client";

import { SparklesIcon } from "lucide-react";
import { motion } from "motion/react";

import { useAssistant } from "@/components/assistant/assistant-provider";
import { ASSISTANT_PROMPTS } from "@/lib/assistant-prompts";
import { cn } from "@/lib/utils";

export function AssistantHeroCard({ className }: { className?: string }) {
  const { setOpen, send } = useAssistant();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "glass w-full max-w-md rounded-[1.4rem] p-4 shadow-[0_24px_60px_-28px_rgb(15_155_144/0.35)] md:max-w-lg lg:max-w-xl",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--brand-cyan),var(--brand-violet))] text-primary-foreground">
          <SparklesIcon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-semibold">Ask my AI</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Chat about projects, stack, resume, and availability.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 rounded-full border border-cyan-brand/30 bg-cyan-brand/10 px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-cyan-brand transition-colors hover:bg-cyan-brand/20"
        >
          Open
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {ASSISTANT_PROMPTS.slice(0, 3).map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => void send(prompt)}
            className="rounded-full border border-white/10 bg-background/35 px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-cyan-brand/40 hover:text-foreground"
          >
            {prompt}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export function AssistantHeaderButton() {
  const { setOpen } = useAssistant();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Ask Sourav's AI"
      className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-cyan-brand/30 bg-cyan-brand/8 px-2.5 py-1.5 font-mono text-[0.6875rem] text-cyan-brand transition-colors hover:border-cyan-brand/60 hover:bg-cyan-brand/14 sm:px-3"
    >
      <span className="absolute inset-0 animate-[assistant-glow_2.8s_ease-out_infinite] rounded-full" />
      <SparklesIcon className="size-3.5" />
      <span className="hidden sm:inline">Ask AI</span>
    </button>
  );
}
