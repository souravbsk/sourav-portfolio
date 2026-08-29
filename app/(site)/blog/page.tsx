import type { Metadata } from "next";
import Link from "next/link";

import { PostCard } from "@/components/blog/post-card";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { getBlogCategories, getPosts } from "@/lib/content";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on building for the web — React, Next.js, and WordPress.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [posts, categories] = await Promise.all([
    getPosts({ category }),
    getBlogCategories(),
  ]);

  const total = categories.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <div className="container-page pt-28 pb-16 md:pt-32">
      <SectionHeading
        eyebrow="Writing"
        title="Notes and write-ups"
        description="Things I worked out the hard way, written down so the next person does not have to."
      />

      {categories.length > 0 && (
        <nav
          aria-label="Filter posts by category"
          className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1"
        >
          <CategoryPill href="/blog" label="All" count={total} active={!category} />
          {categories.map((entry) => (
            <CategoryPill
              key={entry.category}
              href={`/blog?category=${entry.category}`}
              label={entry.category}
              count={entry.count}
              active={category === entry.category}
            />
          ))}
        </nav>
      )}

      {posts.length === 0 ? (
        <div className="panel mt-10 p-12 text-center">
          <p className="text-sm text-muted-foreground">
            {category
              ? `Nothing published under “${category}” yet.`
              : "No posts published yet."}
          </p>
        </div>
      ) : (
        <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <RevealItem key={post._id}>
              <PostCard post={post} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  );
}

function CategoryPill({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors",
        active
          ? "border-cyan-brand/50 bg-cyan-brand/10 text-cyan-brand"
          : "border-border text-muted-foreground hover:border-cyan-brand/30 hover:text-foreground",
      )}
    >
      {label}
      <span className="opacity-60">{count}</span>
    </Link>
  );
}
