import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, ClockIcon } from "lucide-react";

import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { formatDate, readingTime, truncate } from "@/lib/utils";
import type { BlogPostData } from "@/types/content";

export function PostCard({ post }: { post: BlogPostData }) {
  const minutes = readingTime(post.content);

  return (
    <SpotlightCard as="article" className="panel panel-glow h-full">
      <Link
        href={`/blog/${post.category}/${post.slug}`}
        className="flex h-full flex-col"
      >
        {post.coverImage && (
          <div className="relative aspect-16/9 overflow-hidden rounded-t-xl bg-panel-strong">
            <Image
              src={post.coverImage}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-cover transition-transform duration-500 group-hover/spotlight:scale-105"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center gap-2">
            <Badge variant="violet">{post.category}</Badge>
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
              <ClockIcon className="size-3" />
              {minutes} min
            </span>
          </div>

          <h3 className="font-display text-lg font-semibold leading-snug">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {truncate(post.excerpt, 140)}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between pt-3">
            <time
              dateTime={post.publishedAt ?? undefined}
              className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground"
            >
              {formatDate(post.publishedAt ?? post.createdAt)}
            </time>
            <ArrowUpRightIcon className="size-4 text-muted-foreground transition-colors group-hover/spotlight:text-cyan-brand" />
          </div>
        </div>
      </Link>
    </SpotlightCard>
  );
}
