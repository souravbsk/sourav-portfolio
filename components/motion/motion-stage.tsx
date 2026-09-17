"use client";

import { useEffect } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * Site-wide atmosphere: a lagged spotlight that tracks the pointer, plus two
 * large orbs that drift with scroll. CSS variables are written on <html> so
 * other components can react without extra React state per frame.
 */
export function MotionStage() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.35,
  });
  const orbA = useTransform(scrollYProgress, [0, 1], [0, 280]);
  const orbB = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const orbRotate = useTransform(scrollYProgress, [0, 1], [0, 24]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const root = document.documentElement;
    let frame = 0;
    let x = window.innerWidth * 0.6;
    let y = 180;
    let targetX = x;
    let targetY = y;

    root.style.setProperty("--pointer-x", `${x}px`);
    root.style.setProperty("--pointer-y", `${y}px`);

    function tick() {
      x += (targetX - x) * 0.14;
      y += (targetY - y) * 0.14;
      root.style.setProperty("--pointer-x", `${x}px`);
      root.style.setProperty("--pointer-y", `${y}px`);

      if (Math.abs(targetX - x) > 0.35 || Math.abs(targetY - y) > 0.35) {
        frame = window.requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    }

    function onMove(event: PointerEvent) {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5] overflow-hidden mix-blend-multiply dark:mix-blend-screen"
      >
        <div className="motion-pointer-cyan hidden [@media(pointer:fine)]:block" />
        <div className="motion-pointer-violet hidden [@media(pointer:fine)]:block" />
        <motion.div className="motion-grid" style={{ y: gridY }} />
        <motion.div className="motion-orb motion-orb-cyan" style={{ y: orbA }} />
        <motion.div
          className="motion-orb motion-orb-violet"
          style={{ y: orbB, rotate: orbRotate }}
        />
      </div>
      <div
        aria-hidden
        className="motion-cursor-ring hidden [@media(pointer:fine)]:block"
      />
      <motion.div
        aria-hidden
        className="motion-scroll-progress"
        style={{ scaleX: progress }}
      />
    </>
  );
}
