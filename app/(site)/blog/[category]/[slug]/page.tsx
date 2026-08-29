import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeftIcon, ClockIcon } from "lucide-react";

import { MarkdownContent, extractToc } from "@/components/blog/markdown";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { Badge } from "@/components/ui/badge";
import { getPostBySlug } from "@/lib/content";
import { formatDate, readingTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ category: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { category, slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  // The category is part of the canonical URL, so a stale or hand-edited one
  // redirects rather than serving the same post under two addresses.
  if (post.category !== category) {
    redirect(`/blog/${post.category}/${post.slug}`);
  }

  const toc = extractToc(post.content);
  const minutes = readingTime(post.content);

  return (
    <article className="container-page pt-28 pb-16 md:pt-32">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" />
        All writing
      </Link>

      <header className="mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="violet">{post.category}</Badge>
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground">
            <ClockIcon className="size-3" />
            {minutes} min read
          </span>
          <time
            dateTime={post.publishedAt ?? undefined}
            className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground"
          >
            {formatDate(post.publishedAt ?? post.createdAt)}
          </time>
        </div>

        <h1 className="balance mt-4 font-display text-3xl font-semibold leading-tight md:text-4xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="balance mt-4 text-lg leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        )}
      </header>

      {post.coverImage && (
        <div className="relative mt-10 aspect-16/8 overflow-hidden rounded-2xl border border-border bg-panel-strong">
          <Image
            src={post.coverImage}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="max-w-3xl">
          <MarkdownContent content={post.content} />

          {post.tags.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-1.5 border-t border-border pt-6">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Badge variant="outline">#{tag}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents items={toc} />
          </div>
        </aside>
      </div>
    </article>
  );
}
