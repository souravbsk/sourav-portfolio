"use client";

import { BuilderScene } from "@/components/three/builder-scene";
import { cn } from "@/lib/utils";

export function HeroVisual({ className }: { className?: string }) {
  return <BuilderScene className={cn(className)} />;
}
