"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderIcon, PlusIcon, SaveIcon } from "lucide-react";
import { toast } from "sonner";

import { AdminCard } from "@/components/admin/admin-page";
import { DeleteButton } from "@/components/admin/delete-button";
import { Field, FieldRow } from "@/components/admin/field";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest, RequestError } from "@/lib/admin-client";
import { SKILL_GROUPS, SKILL_GROUP_LABELS, type SkillGroup } from "@/lib/taxonomy";
import type { SkillData } from "@/types/content";

type Draft = {
  title: string;
  icon: string;
  group: SkillGroup;
  level: number;
  order: number;
};

const EMPTY: Draft = {
  title: "",
  icon: "",
  group: "frontend",
  level: 4,
  order: 0,
};

export function SkillManager({ skills }: { skills: SkillData[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setErrors({});

    try {
      await apiRequest("/api/skills", {
        method: "POST",
        body: JSON.stringify({
          ...draft,
          order: draft.order || skills.length + 1,
        }),
      });
      toast.success("Skill added");
      setDraft(EMPTY);
      router.refresh();
    } catch (error) {
      if (error instanceof RequestError) {
        setErrors(error.fieldErrors);
        toast.error(error.message);
      } else {
        toast.error("Could not add the skill");
      }
    } finally {
      setPending(false);
    }
  }

  async function patchSkill(id: string, changes: Partial<SkillData>) {
    setSavingId(id);
    try {
      await apiRequest(`/api/skills/${id}`, {
        method: "PATCH",
        body: JSON.stringify(changes),
      });
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <AdminCard
        title="Add a skill"
        description="Icons are uploaded through the server. Existing skills already point at the images in /public/skilimage."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <FieldRow>
            <Field id="skill-title" label="Name" error={errors.title}>
              <Input
                id="skill-title"
                value={draft.title}
                required
                onChange={(event) =>
                  setDraft({ ...draft, title: event.target.value })
                }
                placeholder="TypeScript"
                aria-invalid={Boolean(errors.title)}
              />
            </Field>

            <Field label="Group" error={errors.group}>
              <Select
                value={draft.group}
                onValueChange={(value) =>
                  setDraft({ ...draft, group: value as SkillGroup })
                }
              >
                <SelectTrigger aria-label="Group">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_GROUPS.map((group) => (
                    <SelectItem key={group} value={group}>
                      {SKILL_GROUP_LABELS[group]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldRow>

          <FieldRow>
            <Field
              id="skill-level"
              label="Confidence (1–5)"
              error={errors.level}
            >
              <Input
                id="skill-level"
                type="number"
                min={1}
                max={5}
                value={draft.level}
                onChange={(event) =>
                  setDraft({ ...draft, level: Number(event.target.value) || 1 })
                }
              />
            </Field>

            <Field id="skill-order" label="Sort order" error={errors.order}>
              <Input
                id="skill-order"
                type="number"
                value={draft.order}
                onChange={(event) =>
                  setDraft({ ...draft, order: Number(event.target.value) || 0 })
                }
                placeholder="Leave 0 to append"
              />
            </Field>
          </FieldRow>

          <Field label="Icon" error={errors.icon}>
            <ImageUploader
              value={draft.icon ? [draft.icon] : []}
              onChange={(urls) => setDraft({ ...draft, icon: urls[0] ?? "" })}
              label="icon"
            />
          </Field>

          <Button type="submit" variant="gradient" disabled={pending}>
            {pending ? (
              <>
                <LoaderIcon className="animate-spin" />
                Adding
              </>
            ) : (
              <>
                <PlusIcon />
                Add skill
              </>
            )}
          </Button>
        </form>
      </AdminCard>

      <AdminCard
        title={`Current skills (${skills.length})`}
        description="Edit inline — changes save when a field loses focus."
      >
        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground">No skills yet.</p>
        ) : (
          <ul className="space-y-2">
            {skills.map((skill) => (
              <li
                key={skill._id}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-2.5"
              >
                <div className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-panel-strong">
                  {skill.icon ? (
                    <Image
                      src={skill.icon}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-contain p-1.5"
                    />
                  ) : (
                    <span className="font-mono text-[0.625rem] text-muted-foreground">
                      {skill.title.slice(0, 2)}
                    </span>
                  )}
                </div>

                <Input
                  defaultValue={skill.title}
                  aria-label={`${skill.title} name`}
                  onBlur={(event) => {
                    const title = event.target.value.trim();
                    if (title && title !== skill.title) {
                      void patchSkill(skill._id, { title });
                    }
                  }}
                  className="h-9 w-40 flex-1"
                />

                <Select
                  defaultValue={skill.group}
                  onValueChange={(value) =>
                    void patchSkill(skill._id, { group: value as SkillGroup })
                  }
                >
                  <SelectTrigger
                    aria-label={`${skill.title} group`}
                    className="h-9 w-36"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_GROUPS.map((group) => (
                      <SelectItem key={group} value={group}>
                        {SKILL_GROUP_LABELS[group]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  min={1}
                  max={5}
                  defaultValue={skill.level}
                  aria-label={`${skill.title} confidence`}
                  onBlur={(event) => {
                    const level = Number(event.target.value);
                    if (level >= 1 && level <= 5 && level !== skill.level) {
                      void patchSkill(skill._id, { level });
                    }
                  }}
                  className="h-9 w-16"
                />

                <Input
                  type="number"
                  defaultValue={skill.order}
                  aria-label={`${skill.title} sort order`}
                  onBlur={(event) => {
                    const order = Number(event.target.value);
                    if (order !== skill.order) {
                      void patchSkill(skill._id, { order });
                    }
                  }}
                  className="h-9 w-20"
                />

                {savingId === skill._id ? (
                  <span className="grid size-8 place-items-center text-muted-foreground">
                    <SaveIcon className="size-3.5 animate-pulse" />
                  </span>
                ) : (
                  <DeleteButton
                    endpoint={`/api/skills/${skill._id}`}
                    label="Skill"
                    name={skill.title}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}
