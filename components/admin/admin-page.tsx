import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  backHref,
  actions,
}: {
  title: string;
  description?: string;
  backHref?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-8">
      {backHref && (
        <Link
          href={backHref}
          className="mb-3 inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back
        </Link>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}

export function AdminCard({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("panel p-5 md:p-6", className)}>
      {title && (
        <div className="mb-5">
          <h2 className="font-display text-base font-semibold">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="panel flex flex-col items-center gap-3 p-12 text-center">
      <p className="font-display text-base font-semibold">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action}
    </div>
  );
}
