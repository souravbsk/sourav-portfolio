import Link from "next/link";
import {
  ArrowRightIcon,
  BriefcaseIcon,
  FolderIcon,
  InboxIcon,
  NotebookPenIcon,
  PackageIcon,
  PlusIcon,
  SparklesIcon,
  UserIcon,
  WrenchIcon,
} from "lucide-react";

import { AdminCard, AdminPageHeader } from "@/components/admin/admin-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminCounts, getMessages, getProjects } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [counts, projects, messages] = await Promise.all([
    getAdminCounts(),
    getProjects(),
    getMessages(),
  ]);

  const stats = [
    { label: "Projects", value: counts.projects, href: "/admin/projects", icon: FolderIcon },
    { label: "Published posts", value: counts.posts, href: "/admin/blog", icon: NotebookPenIcon },
    { label: "Drafts", value: counts.drafts, href: "/admin/blog", icon: NotebookPenIcon },
    { label: "Tools", value: counts.tools, href: "/admin/tools", icon: WrenchIcon },
    { label: "Products", value: counts.products, href: "/admin/products", icon: PackageIcon },
    { label: "Unread messages", value: counts.unread, href: "/admin/messages", icon: InboxIcon },
  ];

  return (
    <>
      <AdminPageHeader
        title="Overview"
        description="Everything on the public site is editable from here — no code changes, no redeploy."
        actions={
          <Button asChild variant="gradient">
            <Link href="/admin/projects/new">
              <PlusIcon />
              New project
            </Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="panel panel-glow group p-4 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <stat.icon className="size-4 text-muted-foreground" />
              <ArrowRightIcon className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-4 font-display text-3xl font-semibold">
              {stat.value}
            </p>
            <p className="mt-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <AdminCard title="Recent messages">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing yet. Contact form submissions land here.
            </p>
          ) : (
            <ul className="space-y-2">
              {messages.slice(0, 5).map((message) => (
                <li
                  key={message._id}
                  className="flex items-center gap-3 rounded-lg border border-border p-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {message.name}
                      </p>
                      {!message.read && <Badge variant="cyan">New</Badge>}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {message.subject || "(no subject)"}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground/70">
                    {formatDate(message.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/admin/messages">
              Open inbox
              <ArrowRightIcon />
            </Link>
          </Button>
        </AdminCard>

        <AdminCard title="Recent projects">
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects yet.</p>
          ) : (
            <ul className="space-y-2">
              {projects.slice(0, 5).map((project) => (
                <li
                  key={project._id}
                  className="flex items-center gap-3 rounded-lg border border-border p-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {project.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {project.skills.slice(0, 4).join(" · ")}
                    </p>
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="shrink-0"
                  >
                    <Link href={`/admin/projects/${project._id}/edit`}>Edit</Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>

      <AdminCard title="Jump to" className="mt-5">
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/admin/profile", label: "Profile & resume", icon: UserIcon },
            { href: "/admin/skills", label: "Skills", icon: SparklesIcon },
            { href: "/admin/experience", label: "Experience", icon: BriefcaseIcon },
            { href: "/admin/products", label: "Products", icon: PackageIcon },
            { href: "/admin/tools", label: "Tools", icon: WrenchIcon },
          ].map((item) => (
            <Button key={item.href} asChild variant="outline" size="sm">
              <Link href={item.href}>
                <item.icon />
                {item.label}
              </Link>
            </Button>
          ))}
        </div>
      </AdminCard>
    </>
  );
}
