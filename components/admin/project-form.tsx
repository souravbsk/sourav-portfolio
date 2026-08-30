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
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, RequestError } from "@/lib/admin-client";
import {
  PROJECT_CATEGORIES,
  PROJECT_CATEGORY_LABELS,
  type ProjectCategory,
} from "@/lib/taxonomy";
import type { ProjectData } from "@/types/content";
import { RichTextEditor } from "./rich-text-editor";

type FormState = {
  title: string;
  description: string;
  liveLink: string;
  clientLink: string;
  serverLink: string;
  skills: string[];
  PhotoUrl: string;
  projectSS: string[];
  status: "special" | "normal";
  category: ProjectCategory;
};

function initialState(project?: ProjectData): FormState {
  return {
    title: project?.title ?? "",
    description: project?.description ?? "",
    liveLink: project?.liveLink ?? "",
    clientLink: project?.clientLink ?? "",
    serverLink: project?.serverLink ?? "",
    skills: project?.skills ?? [],
    PhotoUrl: project?.PhotoUrl ?? "",
    projectSS: project?.projectSS ?? [],
    status: project?.status ?? "normal",
    category: project?.category ?? "react",
  };
}

export function ProjectForm({ project }: { project?: ProjectData }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => initialState(project));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const isEdit = Boolean(project);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setErrors({});

    try {
      await apiRequest(
        isEdit ? `/api/projects/${project!._id}` : "/api/projects",
        {
          method: isEdit ? "PATCH" : "POST",
          body: JSON.stringify(form),
        },
      );

      toast.success(isEdit ? "Project updated" : "Project created");
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      if (error instanceof RequestError) {
        setErrors(error.fieldErrors);
        toast.error(error.message);
      } else {
        toast.error("Could not save the project");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AdminCard title="Basics">
        <div className="space-y-4">
          <Field id="title" label="Title" error={errors.title}>
            <Input
              id="title"
              value={form.title}
              onChange={(event) => set("title", event.target.value)}
              required
              placeholder="Project name"
              aria-invalid={Boolean(errors.title)}
            />
          </Field>

          <Field
            id="description"
            label="Description"
            hint="Shown on the card and in the detail dialog."
            error={errors.description}
          >
            <RichTextEditor
              id="description"
              value={form.description}
              onChange={(html) => set("description", html)}
              placeholder="What the project does and what you built."
            />
          </Field>

          <Field
            id="skills"
            label="Skills"
            hint="Enter or comma to add. These show as tags on the card."
            error={errors.skills}
          >
            <TagInput
              id="skills"
              value={form.skills}
              onChange={(value) => set("skills", value)}
              placeholder="React, Express, MongoDB…"
            />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Links">
        <div className="space-y-4">
          <Field id="liveLink" label="Live site" error={errors.liveLink}>
            <Input
              id="liveLink"
              value={form.liveLink}
              onChange={(event) => set("liveLink", event.target.value)}
              placeholder="https://example.com"
            />
          </Field>

          <FieldRow>
            <Field
              id="clientLink"
              label="Client repo"
              error={errors.clientLink}
            >
              <Input
                id="clientLink"
                value={form.clientLink}
                onChange={(event) => set("clientLink", event.target.value)}
                placeholder="https://github.com/…"
              />
            </Field>

            <Field
              id="serverLink"
              label="Server repo"
              error={errors.serverLink}
            >
              <Input
                id="serverLink"
                value={form.serverLink}
                onChange={(event) => set("serverLink", event.target.value)}
                placeholder="Optional"
              />
            </Field>
          </FieldRow>
        </div>
      </AdminCard>

      <AdminCard
        title="Images"
        description="Uploaded through the server — no credentials reach the browser."
      >
        <div className="space-y-6">
          <Field label="Cover image" error={errors.PhotoUrl}>
            <ImageUploader
              value={form.PhotoUrl ? [form.PhotoUrl] : []}
              onChange={(urls) => set("PhotoUrl", urls[0] ?? "")}
              label="cover"
            />
          </Field>

          <Field label="Screenshot gallery" error={errors.projectSS}>
            <ImageUploader
              value={form.projectSS}
              onChange={(urls) => set("projectSS", urls)}
              multiple
              label="screenshots"
            />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Classification">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category" error={errors.category}>
            <Select
              value={form.category}
              onValueChange={(value) =>
                set("category", value as ProjectCategory)
              }
            >
              <SelectTrigger aria-label="Category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {PROJECT_CATEGORY_LABELS[category]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Status" error={errors.status}>
            <Select
              value={form.status}
              onValueChange={(value) =>
                set("status", value as FormState["status"])
              }
            >
              <SelectTrigger aria-label="Status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="special">Featured</SelectItem>
              </SelectContent>
            </Select>
          </Field>
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
              {isEdit ? "Save changes" : "Create project"}
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => router.push("/admin/projects")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
