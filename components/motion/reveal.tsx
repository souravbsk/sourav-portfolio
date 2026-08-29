"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 22 },
  down: { x: 0, y: -22 },
  left: { x: 26, y: 0 },
  right: { x: -26, y: 0 },
  none: { x: 0, y: 0 },
};

export type RevealProps = {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  /** Milliseconds-free: seconds, matching Framer's own units. */
  duration?: number;
  as?: "div" | "section" | "li" | "article" | "span" | "header" | "footer";
};

/**
 * Single scroll-reveal primitive used across the whole site.
 *
 * `once: true` means an element animates the first time it enters the viewport
 * and then stays put, and when the visitor prefers reduced motion the variants
 * collapse to a plain opacity-1 state so nothing translates at all.
 */
export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.55,
  as = "div",
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const offset = OFFSET[direction];

  const variants: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, x: offset.x, y: offset.y },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
        },
      };

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -80px 0px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

/** Parent wrapper that staggers any `RevealItem` children beneath it. */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "section";
}) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -60px 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: prefersReducedMotion
            ? {}
            : { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(className)}
      variants={
        prefersReducedMotion
          ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
          : {
              hidden: { opacity: 0, y: 18 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              },
            }
      }
    >
      {children}
    </MotionTag>
  );
}
