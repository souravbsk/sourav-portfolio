"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "data-[state=checked]:bg-cyan-brand data-[state=unchecked]:bg-panel-strong data-[state=unchecked]:border-border",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block size-4.5 rounded-full bg-white shadow-sm transition-transform",
          "data-[state=checked]:translate-x-[1.4rem] data-[state=unchecked]:translate-x-[0.2rem]",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
