"use client";

import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { MoonIcon, SunIcon } from "lucide-react";

import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  // The resolved theme is unknown until the client runs, so the icon is held
  // back for one paint rather than rendering the wrong one and swapping.
  const hydrated = useHydrated();

  const isDark = resolvedTheme !== "light";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative grid size-9 place-items-center overflow-hidden rounded-full border border-border text-muted-foreground transition-colors hover:border-cyan-brand/50 hover:text-foreground",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--glow-cyan), transparent 70%)",
        }}
      />
      <AnimatePresence initial={false} mode="wait">
        {hydrated ? (
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative"
          >
            {isDark ? (
              <MoonIcon className="size-4" />
            ) : (
              <SunIcon className="size-4" />
            )}
          </motion.span>
        ) : (
          <span className="size-4" />
        )}
      </AnimatePresence>
    </button>
  );
}
