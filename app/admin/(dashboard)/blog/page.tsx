import Link from "next/link";
import { ExternalLinkIcon, PencilIcon, PlusIcon } from "lucide-react";

import { AdminPageHeader, EmptyState } from "@/components/admin/admin-page";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/content";
import { formatDate, readingTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getPosts({ includeDrafts: true });
  const drafts = posts.filter((post) => !post.published).length;

  return (
    <>
      <AdminPageHeader
        title="Blog"
        description={`${posts.length} post${posts.length === 1 ? "" : "s"}${drafts > 0 ? `, ${drafts} in draft` : ""}.`}
        actions={
          <Button asChild variant="gradient">
            <Link href="/admin/blog/new">
              <PlusIcon />
              New post
            </Link>
          </Button>
        }
      />

      {posts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description="Write your first post. It stays a draft until you publish it."
          action={
            <Button asChild variant="gradient" className="mt-2">
              <Link href="/admin/blog/new">
                <PlusIcon />
                New post
              </Link>
            </Button>
          }
        />
      ) : (
        <ul className="space-y-2.5">
          {posts.map((post) => (
            <li
              key={post._id}
              className="panel flex flex-wrap items-center gap-4 p-3.5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium">{post.title}</p>
                  <Badge variant={post.published ? "cyan" : "outline"}>
                    {post.published ? "Live" : "Draft"}
                  </Badge>
                  <Badge variant="violet">{post.category}</Badge>
                </div>

                <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground/70">
                  /blog/{post.category}/{post.slug} · {readingTime(post.content)}{" "}
                  min
                  {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ""}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {post.published && (
                  <Button
                    asChild
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`View ${post.title}`}
                  >
                    <Link
                      href={`/blog/${post.category}/${post.slug}`}
                      target="_blank"
                    >
                      <ExternalLinkIcon />
                    </Link>
                  </Button>
                )}

                <Button
                  asChild
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Edit ${post.title}`}
                >
                  <Link href={`/admin/blog/${post._id}/edit`}>
                    <PencilIcon />
                  </Link>
                </Button>

                <DeleteButton
                  endpoint={`/api/blog/${post._id}`}
                  label="Post"
                  name={post.title}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
