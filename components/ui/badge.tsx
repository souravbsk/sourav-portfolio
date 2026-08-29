import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[0.6875rem] tracking-wide [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-transparent bg-panel-strong text-foreground",
        outline: "border-border text-muted-foreground",
        cyan: "border-cyan-brand/35 bg-cyan-brand/10 text-cyan-brand",
        violet: "border-violet-brand/35 bg-violet-brand/10 text-violet-brand",
        warm: "border-warm-brand/35 bg-warm-brand/10 text-warm-brand",
        destructive: "border-transparent bg-destructive/15 text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
