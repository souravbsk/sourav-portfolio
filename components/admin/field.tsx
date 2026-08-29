import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function Field({
  id,
  label,
  hint,
  error,
  className,
  children,
}: {
  id?: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted-foreground/80">{hint}</p>
      )}
    </div>
  );
}

export function FieldRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>{children}</div>
  );
}
