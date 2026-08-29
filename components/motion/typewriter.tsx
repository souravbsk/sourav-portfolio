"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";

type Phase = "typing" | "holding" | "deleting";

type State = {
  index: number;
  /** Characters of the current word that are currently visible. */
  length: number;
  phase: Phase;
};

/**
 * Replaces the typewriter-effect dependency the old site used. When motion is
 * reduced it renders the first role as static text instead of cycling.
 *
 * Every transition happens inside the timeout callback rather than in the effect
 * body, so a render is only ever triggered by the timer firing.
 */
export function Typewriter({
  words,
  className,
  typeSpeed = 70,
  deleteSpeed = 38,
  holdMs = 1600,
}: {
  words: string[];
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  holdMs?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [state, setState] = useState<State>({
    index: 0,
    length: 0,
    phase: "typing",
  });

  // `words` is a fresh array on every parent render, which would restart the
  // effect each time. Collapsing it to a string gives the memo a stable key.
  const wordsKey = words.join("\u0000");
  const list = useMemo(() => wordsKey.split("\u0000"), [wordsKey]);

  const { index, length, phase } = state;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const delay =
      phase === "holding"
        ? holdMs
        : phase === "typing"
          ? typeSpeed
          : deleteSpeed;

    const id = window.setTimeout(() => {
      setState((current) => {
        const word = list[current.index % list.length] ?? "";

        if (current.phase === "typing") {
          return current.length >= word.length
            ? { ...current, phase: "holding" }
            : { ...current, length: current.length + 1 };
        }

        if (current.phase === "holding") {
          return { ...current, phase: "deleting" };
        }

        return current.length <= 0
          ? {
              index: (current.index + 1) % list.length,
              length: 0,
              phase: "typing",
            }
          : { ...current, length: current.length - 1 };
      });
    }, delay);

    return () => window.clearTimeout(id);
  }, [
    deleteSpeed,
    holdMs,
    index,
    length,
    list,
    phase,
    prefersReducedMotion,
    typeSpeed,
  ]);

  const word = list[index % list.length] ?? "";

  if (prefersReducedMotion) {
    return <span className={className}>{list[0]}</span>;
  }

  return (
    <span className={className}>
      <span aria-live="polite">{word.slice(0, length)}</span>
      <span
        aria-hidden
        className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.12em] animate-pulse bg-cyan-brand"
      />
    </span>
  );
}
