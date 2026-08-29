import Image from "next/image";
import Link from "next/link";
import { PencilIcon, PlusIcon, WrenchIcon } from "lucide-react";

import { AdminPageHeader, EmptyState } from "@/components/admin/admin-page";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTools } from "@/lib/content";
import { truncate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminToolsPage() {
  const tools = await getTools({ includeDrafts: true });

  return (
    <>
      <AdminPageHeader
        title="Tools"
        description="The data layer and CRUD are ready — add tools whenever you build them, no code changes needed."
        actions={
          <Button asChild variant="gradient">
            <Link href="/admin/tools/new">
              <PlusIcon />
              New tool
            </Link>
          </Button>
        }
      />

      {tools.length === 0 ? (
        <EmptyState
          title="No tools yet"
          description="This section is wired up and waiting. When you have a tool to publish, add it here and it will show up on the site."
          action={
            <Button asChild variant="gradient" className="mt-2">
              <Link href="/admin/tools/new">
                <PlusIcon />
                New tool
              </Link>
            </Button>
          }
        />
      ) : (
        <ul className="space-y-2.5">
          {tools.map((tool) => (
            <li
              key={tool._id}
              className="panel flex flex-wrap items-center gap-4 p-3.5"
            >
              <div className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-panel-strong">
                {tool.icon ? (
                  <Image
                    src={tool.icon}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-contain p-2"
                  />
                ) : (
                  <WrenchIcon className="size-4 text-muted-foreground/50" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium">{tool.name}</p>
                  <Badge variant={tool.published ? "cyan" : "outline"}>
                    {tool.published ? "Live" : "Draft"}
                  </Badge>
                  <Badge variant="outline">{tool.embedType}</Badge>
                </div>
                {tool.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {truncate(tool.description, 96)}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Button
                  asChild
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Edit ${tool.name}`}
                >
                  <Link href={`/admin/tools/${tool._id}/edit`}>
                    <PencilIcon />
                  </Link>
                </Button>

                <DeleteButton
                  endpoint={`/api/tools/${tool._id}`}
                  label="Tool"
                  name={tool.name}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
