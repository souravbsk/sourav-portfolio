import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-lg border border-input bg-background/40 px-3.5 py-2 text-sm shadow-xs transition-[color,box-shadow,border-color] outline-none",
        "placeholder:text-muted-foreground/70",
        "focus-visible:border-cyan-brand focus-visible:ring-2 focus-visible:ring-ring/40",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:mr-3 file:rounded-md file:border-0 file:bg-panel-strong file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
