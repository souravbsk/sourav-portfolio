"use client";

import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Hero visual: a developer at a laptop, shipping a product window.
 * CSS-only so it stays light, theme-aware, and readable on a phone.
 */
export function BuilderScene({ className }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className={cn(
        "relative aspect-square w-full max-w-md md:max-w-lg lg:max-w-xl",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_45%,var(--glow-violet),transparent_65%)] blur-2xl" />

      <div className="absolute inset-[8%] grid place-items-center">
        <div className="relative w-full max-w-[22rem]">
          <ProductWindow paused={Boolean(prefersReducedMotion)} />
          <Laptop paused={Boolean(prefersReducedMotion)} />
          <Developer paused={Boolean(prefersReducedMotion)} />
        </div>
      </div>
    </div>
  );
}

function ProductWindow({ paused }: { paused: boolean }) {
  return (
    <div
      className={cn(
        "absolute -top-2 right-0 z-20 w-[58%] overflow-hidden rounded-xl border border-border bg-background/90 shadow-xl backdrop-blur-md",
        !paused && "animate-[float-soft_5.5s_ease-in-out_infinite]",
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-border px-2.5 py-1.5">
        <span className="size-1.5 rounded-full bg-rose-400/80" />
        <span className="size-1.5 rounded-full bg-amber-400/80" />
        <span className="size-1.5 rounded-full bg-emerald-400/80" />
        <span className="ml-1.5 truncate font-mono text-[0.5625rem] text-muted-foreground">
          product.app
        </span>
      </div>
      <div className="space-y-2 p-2.5">
        <div className="h-1.5 w-2/5 rounded-full bg-[linear-gradient(90deg,var(--brand-cyan),var(--brand-violet))]" />
        <div className="grid grid-cols-3 gap-1.5">
          {["A", "B", "C"].map((label, index) => (
            <div
              key={label}
              className={cn(
                "rounded-md border border-border bg-panel p-1.5",
                !paused && "animate-[block-in_1.2s_ease_both]",
              )}
              style={{ animationDelay: paused ? undefined : `${0.35 + index * 0.18}s` }}
            >
              <div className="mb-1 size-4 rounded-sm bg-cyan-brand/25" />
              <div className="h-1 w-full rounded-full bg-border" />
              <div className="mt-1 h-1 w-2/3 rounded-full bg-border" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="h-1.5 w-16 rounded-full bg-border" />
          <div className="h-4 w-10 rounded-full bg-cyan-brand/80" />
        </div>
      </div>
    </div>
  );
}

function Laptop({ paused }: { paused: boolean }) {
  return (
    <div className="relative z-10 mx-auto w-[78%] pt-16">
      <div className="overflow-hidden rounded-t-lg border border-border bg-[#0b1220] shadow-lg">
        <div className="flex items-center gap-1 border-b border-white/10 px-2 py-1">
          <span className="size-1 rounded-full bg-white/25" />
          <span className="size-1 rounded-full bg-white/25" />
          <span className="size-1 rounded-full bg-white/25" />
          <span className="ml-1 font-mono text-[0.5rem] text-white/40">
            app/page.tsx
          </span>
        </div>
        <pre className="space-y-1 p-2.5 font-mono text-[0.55rem] leading-relaxed text-cyan-200/80">
          <CodeLine paused={paused} delay="0s" text="export default function App() {" />
          <CodeLine paused={paused} delay="0.8s" text="  return <Product />" />
          <CodeLine paused={paused} delay="1.6s" text="}" />
        </pre>
      </div>
      <div className="h-2 rounded-b-md bg-linear-to-b from-zinc-400 to-zinc-500" />
      <div className="mx-auto h-1.5 w-[88%] rounded-b-xl bg-zinc-600" />
    </div>
  );
}

function CodeLine({
  text,
  delay,
  paused,
}: {
  text: string;
  delay: string;
  paused: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden whitespace-nowrap",
        !paused && "animate-[type-line_3.6s_steps(24)_infinite]",
      )}
      style={{ animationDelay: paused ? undefined : delay }}
    >
      {text}
    </div>
  );
}

function Developer({ paused }: { paused: boolean }) {
  return (
    <div className="absolute bottom-2 left-[8%] z-20 flex items-end gap-0">
      <div className="relative">
        <div className="mx-auto size-8 rounded-full bg-[linear-gradient(160deg,#1a1f2e,#2a3144)] ring-2 ring-cyan-brand/40" />
        <div className="mx-auto mt-0.5 h-10 w-11 rounded-t-2xl bg-[linear-gradient(180deg,#111827,#1f2937)]" />
        <div
          className={cn(
            "absolute -right-2 top-9 h-2 w-7 origin-left rounded-full bg-[#1f2937]",
            !paused && "animate-[type-hands_0.55s_ease-in-out_infinite]",
          )}
        />
      </div>
    </div>
  );
}
