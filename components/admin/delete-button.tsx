"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/admin-client";

export function DeleteButton({
  endpoint,
  label,
  name,
  onDeleted,
}: {
  endpoint: string;
  label: string;
  name: string;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setPending(true);
    try {
      await apiRequest(endpoint, { method: "DELETE" });
      toast.success(`${label} deleted`);
      setOpen(false);
      onDeleted?.();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete ${name}`}
          className="text-muted-foreground hover:text-destructive"
        >
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {label.toLowerCase()}?</AlertDialogTitle>
          <AlertDialogDescription>
            “{name}” will be removed permanently. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Keep it</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
            disabled={pending}
          >
            {pending ? <LoaderIcon className="animate-spin" /> : <TrashIcon />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
