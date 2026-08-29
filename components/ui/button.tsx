import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98] shadow-[0_1px_0_0_rgb(255_255_255/0.12)_inset]",
        gradient:
          "text-primary-foreground active:scale-[0.98] bg-[linear-gradient(100deg,var(--brand-cyan),var(--brand-violet))] hover:brightness-110",
        outline:
          "border border-border bg-transparent hover:bg-panel-strong hover:border-cyan-brand/60",
        secondary: "bg-secondary text-secondary-foreground hover:brightness-95 dark:hover:brightness-125",
        ghost: "hover:bg-panel-strong",
        destructive:
          "bg-destructive text-destructive-foreground hover:brightness-110 active:scale-[0.98]",
        link: "text-cyan-brand underline-offset-4 hover:underline rounded-sm",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "size-10",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
