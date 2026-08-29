"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ExternalLinkIcon,
  GripVerticalIcon,
  ImageIcon,
  PencilIcon,
} from "lucide-react";
import { toast } from "sonner";

import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/admin-client";
import { cn, externalHref, truncate } from "@/lib/utils";
import type { ProjectData } from "@/types/content";

export function AdminProjectList({ projects }: { projects: ProjectData[] }) {
  const router = useRouter();
  const [items, setItems] = useState(projects);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setItems(projects);
  }, [projects]);

  async function persist(next: ProjectData[]) {
    setItems(next);
    setSaving(true);
    try {
      await apiRequest("/api/projects/reorder", {
        method: "PATCH",
        body: JSON.stringify({ ids: next.map((item) => item._id) }),
      });
      toast.success("Order saved");
      router.refresh();
    } catch (error) {
      setItems(projects);
      toast.error(error instanceof Error ? error.message : "Could not save order");
    } finally {
      setSaving(false);
    }
  }

  function move(fromId: string, toId: string) {
    if (fromId === toId) return items;
    const next = [...items];
    const from = next.findIndex((item) => item._id === fromId);
    const to = next.findIndex((item) => item._id === toId);
    if (from < 0 || to < 0) return items;
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved!);
    return next;
  }

  return (
    <div className="space-y-2.5">
      <p className="text-sm text-muted-foreground">
        Drag the handle to change the public order. Newest projects land at the
        top until you rearrange them.
        {saving ? " Saving…" : null}
      </p>

      <ul className="space-y-2.5">
        {items.map((project) => (
          <li
            key={project._id}
            draggable
            onDragStart={() => setDraggingId(project._id)}
            onDragEnd={() => setDraggingId(null)}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (!draggingId) return;
              const next = move(draggingId, project._id);
              setDraggingId(null);
              if (next !== items) void persist(next);
            }}
            className={cn(
              "panel flex flex-wrap items-center gap-4 p-3.5 md:flex-nowrap",
              draggingId === project._id && "opacity-50",
            )}
          >
            <button
              type="button"
              aria-label={`Drag to reorder ${project.title}`}
              className="grid size-9 shrink-0 cursor-grab place-items-center rounded-lg text-muted-foreground hover:bg-panel-strong hover:text-foreground active:cursor-grabbing"
            >
              <GripVerticalIcon className="size-4" />
            </button>

            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-panel-strong">
              {project.PhotoUrl ? (
                <Image
                  src={project.PhotoUrl}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover object-top"
                />
              ) : (
                <div className="grid h-full place-items-center text-muted-foreground/40">
                  <ImageIcon className="size-4" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate font-medium">{project.title}</p>
                {project.status === "special" && (
                  <Badge variant="violet">Featured</Badge>
                )}
              </div>

              {project.description && (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {truncate(project.description, 96)}
                </p>
              )}

              {project.skills.length > 0 && (
                <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground/70">
                  {project.skills.slice(0, 6).join(" · ")}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {project.liveLink && (
                <Button
                  asChild
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Open ${project.title} live site`}
                >
                  <a
                    href={externalHref(project.liveLink)}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <ExternalLinkIcon />
                  </a>
                </Button>
              )}

              <Button
                asChild
                variant="ghost"
                size="icon-sm"
                aria-label={`Edit ${project.title}`}
              >
                <Link href={`/admin/projects/${project._id}/edit`}>
                  <PencilIcon />
                </Link>
              </Button>

              <DeleteButton
                endpoint={`/api/projects/${project._id}`}
                label="Project"
                name={project.title}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
