"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderIcon, SaveIcon } from "lucide-react";
import { toast } from "sonner";

import { AdminCard } from "@/components/admin/admin-page";
import { Field, FieldRow } from "@/components/admin/field";
import { ImageUploader } from "@/components/admin/image-uploader";
import { TagInput } from "@/components/admin/tag-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, RequestError } from "@/lib/admin-client";
import { TOOL_EMBED_TYPES, type ToolEmbedType } from "@/lib/taxonomy";
import { slugify } from "@/lib/utils";
import type { ToolData } from "@/types/content";

const EMBED_LABELS: Record<ToolEmbedType, string> = {
  link: "Link out to another site",
  iframe: "Embed in an iframe on this site",
  internal: "Built into this site",
};

type FormState = {
  name: string;
  slug: string;
  description: string;
  icon: string;
  url: string;
  embedType: ToolEmbedType;
  tags: string[];
  order: number;
  published: boolean;
};

export function ToolForm({ tool }: { tool?: ToolData }) {
  const router = useRouter();
  const isEdit = Boolean(tool);

  const [form, setForm] = useState<FormState>({
    name: tool?.name ?? "",
    slug: tool?.slug ?? "",
    description: tool?.description ?? "",
    icon: tool?.icon ?? "",
    url: tool?.url ?? "",
    embedType: tool?.embedType ?? "link",
    tags: tool?.tags ?? [],
    order: tool?.order ?? 0,
    published: tool?.published ?? false,
  });

  const [slugLocked, setSlugLocked] = useState(isEdit);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setErrors({});

    try {
      await apiRequest(isEdit ? `/api/tools/${tool!._id}` : "/api/tools", {
        method: isEdit ? "PATCH" : "POST",
        body: JSON.stringify({ ...form, slug: form.slug || slugify(form.name) }),
      });

      toast.success(isEdit ? "Tool updated" : "Tool created");
      router.push("/admin/tools");
      router.refresh();
    } catch (error) {
      if (error instanceof RequestError) {
        setErrors(error.fieldErrors);
        toast.error(error.message);
      } else {
        toast.error("Could not save the tool");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AdminCard title="Tool details">
        <div className="space-y-4">
          <FieldRow>
            <Field id="name" label="Name" error={errors.name}>
              <Input
                id="name"
                value={form.name}
                required
                onChange={(event) => {
                  const name = event.target.value;
                  setForm((current) => ({
                    ...current,
                    name,
                    slug: slugLocked ? current.slug : slugify(name),
                  }));
                }}
                aria-invalid={Boolean(errors.name)}
              />
            </Field>

            <Field id="slug" label="Slug" error={errors.slug}>
              <Input
                id="slug"
                value={form.slug}
                required
                onChange={(event) => {
                  setSlugLocked(true);
                  set("slug", slugify(event.target.value));
                }}
                aria-invalid={Boolean(errors.slug)}
              />
            </Field>
          </FieldRow>

          <Field id="description" label="Description" error={errors.description}>
            <Textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(event) => set("description", event.target.value)}
              placeholder="What the tool does and who it is for."
            />
          </Field>

          <FieldRow>
            <Field id="url" label="URL" error={errors.url}>
              <Input
                id="url"
                value={form.url}
                onChange={(event) => set("url", event.target.value)}
                placeholder="https://…"
              />
            </Field>

            <Field label="How it opens" error={errors.embedType}>
              <Select
                value={form.embedType}
                onValueChange={(value) =>
                  set("embedType", value as ToolEmbedType)
                }
              >
                <SelectTrigger aria-label="Embed type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TOOL_EMBED_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {EMBED_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldRow>

          <FieldRow>
            <Field id="tags" label="Tags" error={errors.tags}>
              <TagInput
                id="tags"
                value={form.tags}
                onChange={(value) => set("tags", value)}
              />
            </Field>

            <Field
              id="order"
              label="Sort order"
              hint="Lower shows first."
              error={errors.order}
            >
              <Input
                id="order"
                type="number"
                value={form.order}
                onChange={(event) =>
                  set("order", Number(event.target.value) || 0)
                }
              />
            </Field>
          </FieldRow>
        </div>
      </AdminCard>

      <AdminCard title="Icon">
        <ImageUploader
          value={form.icon ? [form.icon] : []}
          onChange={(urls) => set("icon", urls[0] ?? "")}
          label="icon"
        />
      </AdminCard>

      <AdminCard>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-base font-semibold">Published</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Unpublished tools are only visible here in the dashboard.
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
              {isEdit ? "Save changes" : "Create tool"}
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => router.push("/admin/tools")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
