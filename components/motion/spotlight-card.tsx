"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Pointer-tracked highlight. The gradient position is written to CSS custom
 * properties rather than React state on every mousemove, so hovering a grid of
 * cards does not trigger a render per frame.
 */
export function SpotlightCard({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
  }

  // All three permitted tags take the same props here, but TypeScript resolves
  // a union of tag names to the intersection of their prop types, which nothing
  // can satisfy. Narrowing to one tag keeps the ref and handler types usable.
  const Element = Tag as "div";

  return (
    <Element
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      className={cn("group/spotlight relative overflow-hidden", className)}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background:
            "radial-gradient(340px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), var(--glow-cyan), transparent 70%)",
        }}
      />
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </Element>
  );
}
