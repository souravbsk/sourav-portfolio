"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

export function TiltFrame({
  children,
  className,
  max = 9,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 160, damping: 18, mass: 0.4 });
  const springY = useSpring(rotateY, { stiffness: 160, damping: 18, mass: 0.4 });

  function onMove(event: React.PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * max);
    rotateX.set(-py * max);
  }

  function onLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{
        rotateX: prefersReducedMotion ? 0 : springX,
        rotateY: prefersReducedMotion ? 0 : springY,
        transformPerspective: 900,
      }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
