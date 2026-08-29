import Markdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

/**
 * Post bodies are markdown authored in the admin editor. `rehype-slug` adds the
 * heading ids the in-page table of contents links to.
 */
export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose-post">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          a: ({ href, children, ...props }) => {
            const external = Boolean(href && /^https?:\/\//i.test(href));
            return (
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer noopener" : undefined}
                {...props}
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => (
            // Post images come from arbitrary markdown, so their dimensions are
            // unknown at build time and next/image cannot be used here.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={typeof src === "string" ? src : ""} alt={alt ?? ""} loading="lazy" />
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}

export type TocItem = { id: string; text: string; level: 2 | 3 };

/**
 * Pulls h2/h3 headings straight out of the markdown source. Slugs are produced
 * the same way `rehype-slug` produces them (GitHub-style), so the anchors match
 * the ids that end up in the rendered HTML.
 */
export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = markdown.split("\n");
  let inFence = false;

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const level = match[1]!.length === 2 ? 2 : 3;
    const text = match[2]!.replace(/[*_`]/g, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "-");

    if (id) items.push({ id, text, level });
  }

  return items;
}
