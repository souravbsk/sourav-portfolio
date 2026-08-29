import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-[linear-gradient(90deg,var(--brand-cyan),transparent)]" />
        <span className="eyebrow">{eyebrow}</span>
      </div>

      <h2 className="text-3xl font-semibold md:text-4xl">{title}</h2>

      {description && (
        <p
          className={cn(
            "balance max-w-2xl text-base leading-relaxed text-muted-foreground",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
