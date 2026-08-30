"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeIcon, LoaderIcon, PencilIcon, SaveIcon } from "lucide-react";
import { toast } from "sonner";

import { AdminCard } from "@/components/admin/admin-page";
import { Field, FieldRow } from "@/components/admin/field";
import { ImageUploader } from "@/components/admin/image-uploader";
import { TagInput } from "@/components/admin/tag-input";
import { MarkdownContent } from "@/components/blog/markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, RequestError } from "@/lib/admin-client";
import { readingTime, slugify } from "@/lib/utils";
import type { BlogPostData } from "@/types/content";

type FormState = {
  title: string;
  slug: string;
  category: string;
  coverImage: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
};

export function BlogForm({ post }: { post?: BlogPostData }) {
  const router = useRouter();
  const isEdit = Boolean(post);

  const [form, setForm] = useState<FormState>({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    category: post?.category ?? "",
    coverImage: post?.coverImage ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    tags: post?.tags ?? [],
    published: post?.published ?? true,
  });

  // The slug stops auto-following the title once the post exists, so an
  // existing published URL is never silently rewritten by a title tweak.
  const [slugLocked, setSlugLocked] = useState(isEdit);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [preview, setPreview] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setErrors({});

    try {
      await apiRequest(isEdit ? `/api/blog/${post!._id}` : "/api/blog", {
        method: isEdit ? "PATCH" : "POST",
        body: JSON.stringify({
          ...form,
          slug: form.slug || slugify(form.title),
          category: slugify(form.category),
        }),
      });

      toast.success(isEdit ? "Post updated" : "Post created");
      router.push("/admin/blog");
      router.refresh();
    } catch (error) {
      if (error instanceof RequestError) {
        setErrors(error.fieldErrors);
        toast.error(error.message);
      } else {
        toast.error("Could not save the post");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AdminCard title="Post details">
        <div className="space-y-4">
          <Field id="title" label="Title" error={errors.title}>
            <Input
              id="title"
              value={form.title}
              required
              onChange={(event) => {
                const title = event.target.value;
                setForm((current) => ({
                  ...current,
                  title,
                  slug: slugLocked ? current.slug : slugify(title),
                }));
              }}
              placeholder="What did you work out?"
              aria-invalid={Boolean(errors.title)}
            />
          </Field>

          <FieldRow>
            <Field
              id="slug"
              label="Slug"
              hint="Lowercase letters, numbers and hyphens."
              error={errors.slug}
            >
              <Input
                id="slug"
                value={form.slug}
                required
                onChange={(event) => {
                  setSlugLocked(true);
                  set("slug", slugify(event.target.value));
                }}
                placeholder="my-first-post"
                aria-invalid={Boolean(errors.slug)}
              />
            </Field>

            <Field
              id="category"
              label="Category"
              hint="Becomes part of the URL: /blog/category/slug"
              error={errors.category}
            >
              <Input
                id="category"
                value={form.category}
                required
                onChange={(event) => set("category", event.target.value)}
                onBlur={() => set("category", slugify(form.category))}
                placeholder="react"
                aria-invalid={Boolean(errors.category)}
              />
            </Field>
          </FieldRow>

          <Field
            id="excerpt"
            label="Excerpt"
            hint="Shown on the blog index and used as the meta description."
            error={errors.excerpt}
          >
            <Textarea
              id="excerpt"
              rows={3}
              value={form.excerpt}
              onChange={(event) => set("excerpt", event.target.value)}
            />
          </Field>

          <Field
            id="tags"
            label="Tags"
            error={errors.tags}
          >
            <TagInput
              id="tags"
              value={form.tags}
              onChange={(value) => set("tags", value)}
            />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Cover image">
        <ImageUploader
          value={form.coverImage ? [form.coverImage] : []}
          onChange={(urls) => set("coverImage", urls[0] ?? "")}
          label="cover"
        />
      </AdminCard>

      <AdminCard>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-semibold">Content</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Markdown. {readingTime(form.content)} min read.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreview((value) => !value)}
          >
            {preview ? <PencilIcon /> : <EyeIcon />}
            {preview ? "Write" : "Preview"}
          </Button>
        </div>

        {preview ? (
          <div className="min-h-64 rounded-lg border border-border bg-background/30 p-5">
            {form.content ? (
              <MarkdownContent content={form.content} />
            ) : (
              <p className="text-sm text-muted-foreground">Nothing to preview.</p>
            )}
          </div>
        ) : (
          <Textarea
            aria-label="Post content in markdown"
            value={form.content}
            onChange={(event) => set("content", event.target.value)}
            rows={22}
            className="font-mono text-[0.8125rem] leading-relaxed"
            placeholder={"## A heading\n\nWrite the post here."}
          />
        )}
      </AdminCard>

      <AdminCard>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-base font-semibold">Published</p>
            <p className="mt-1 text-sm text-muted-foreground">
              On: the post appears on the homepage and /blog. Off: draft only.
            </p>
          </div>
          <Switch
            checked={form.published}
            onCheckedChange={(checked) => set("published", checked)}
            aria-label="Published"
          />
        </div>
      </AdminCard>

      <div className="flex flex-wrap gap-2.5">
        <Button type="submit" variant="gradient" size="lg" disabled={pending}>
          {pending ? (
            <>
              <LoaderIcon className="animate-spin" />
              Saving
            </>
          ) : (
            <>
              <SaveIcon />
              {isEdit ? "Save changes" : "Create post"}
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => router.push("/admin/blog")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
