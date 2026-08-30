"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderIcon, PlusIcon, SaveIcon } from "lucide-react";
import { toast } from "sonner";

import { AdminCard } from "@/components/admin/admin-page";
import { DeleteButton } from "@/components/admin/delete-button";
import { Field, FieldRow } from "@/components/admin/field";
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
import { EXPERIENCE_ICONS, type ExperienceIcon } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";
import type { ExperienceData } from "@/types/content";
import { RichTextEditor } from "./rich-text-editor";

type Draft = Omit<ExperienceData, "_id">;

const EMPTY: Draft = {
  role: "",
  company: "",
  companyUrl: "",
  period: "",
  description: "",
  highlights: [],
  icon: "briefcase",
  current: false,
  order: 0,
};

const HIGHLIGHT_OPTIONS = [
  "React",
  "Next.js",
  "WordPress",
  "Node.js",
  "Express",
  "MongoDB",
  "REST API",
  "TypeScript",
  "ONDC",
  "APIs",
  "Product",
  "Elementor",
  "cPanel",
  "Team lead",
  "Figma to Next",
  "MERN",
  "Contract",
] as const;

function isFallbackId(id: string) {
  return id.startsWith("fallback-");
}

function toDraft(item: ExperienceData): Draft {
  const { _id: _id, ...rest } = item;
  return rest;
}

function toggleHighlight(current: string[], option: string) {
  return current.some((item) => item.toLowerCase() === option.toLowerCase())
    ? current.filter((item) => item.toLowerCase() !== option.toLowerCase())
    : [...current, option];
}

function HighlightOptions({
  value,
  onChange,
  id,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  id?: string;
}) {
  const extras = value.filter(
    (item) =>
      !HIGHLIGHT_OPTIONS.some(
        (option) => option.toLowerCase() === item.toLowerCase(),
      ),
  );

  return (
    <div className="space-y-2.5">
      <div
        role="group"
        aria-label="Highlight options"
        className="flex flex-wrap gap-1.5"
      >
        {HIGHLIGHT_OPTIONS.map((option) => {
          const selected = value.some(
            (item) => item.toLowerCase() === option.toLowerCase(),
          );
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(toggleHighlight(value, option))}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-[0.6875rem] tracking-wide transition-colors",
                selected
                  ? "border-cyan-brand/50 bg-cyan-brand/15 text-cyan-brand"
                  : "border-border text-muted-foreground hover:border-cyan-brand/30 hover:text-foreground",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      <TagInput
        id={id}
        value={value}
        onChange={onChange}
        placeholder="Or type a custom highlight and press Enter"
      />

      {extras.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Custom: {extras.join(", ")}
        </p>
      )}
    </div>
  );
}

function ExperienceFields({
  form,
  setForm,
  errors,
  idPrefix,
}: {
  form: Draft;
  setForm: (next: Draft) => void;
  errors: Record<string, string>;
  idPrefix: string;
}) {
  return (
    <div className="space-y-4">
      <FieldRow>
        <Field id={`${idPrefix}-role`} label="Role" error={errors.role}>
          <Input
            id={`${idPrefix}-role`}
            value={form.role}
            required
            onChange={(event) => setForm({ ...form, role: event.target.value })}
            placeholder="Software Developer"
            aria-invalid={Boolean(errors.role)}
          />
        </Field>

        <Field
          id={`${idPrefix}-company`}
          label="Company"
          error={errors.company}
        >
          <Input
            id={`${idPrefix}-company`}
            value={form.company}
            required
            onChange={(event) =>
              setForm({ ...form, company: event.target.value })
            }
            aria-invalid={Boolean(errors.company)}
          />
        </Field>
      </FieldRow>

      <FieldRow>
        <Field id={`${idPrefix}-period`} label="Period" error={errors.period}>
          <Input
            id={`${idPrefix}-period`}
            value={form.period}
            onChange={(event) =>
              setForm({ ...form, period: event.target.value })
            }
            placeholder="2022 — Present"
          />
        </Field>

        <Field
          id={`${idPrefix}-url`}
          label="Company URL"
          error={errors.companyUrl}
        >
          <Input
            id={`${idPrefix}-url`}
            value={form.companyUrl}
            onChange={(event) =>
              setForm({ ...form, companyUrl: event.target.value })
            }
            placeholder="Optional"
          />
        </Field>
      </FieldRow>
      <Field
        id={`${idPrefix}-desc`}
        label="Description"
        error={errors.description}
      >
        <RichTextEditor
          id={`${idPrefix}-desc`}
          value={form.description}
          onChange={(html) => setForm({ ...form, description: html })}
        />
      </Field>

      <Field
        id={`${idPrefix}-highlights`}
        label="Highlights"
        hint="Click an option to toggle it, or type your own."
        error={errors.highlights}
      >
        <HighlightOptions
          id={`${idPrefix}-highlights`}
          value={form.highlights}
          onChange={(highlights) => setForm({ ...form, highlights })}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Timeline icon" error={errors.icon}>
          <Select
            value={form.icon}
            onValueChange={(value) =>
              setForm({ ...form, icon: value as ExperienceIcon })
            }
          >
            <SelectTrigger aria-label="Timeline icon">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_ICONS.map((icon) => (
                <SelectItem key={icon} value={icon}>
                  {icon}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field id={`${idPrefix}-order`} label="Sort order" error={errors.order}>
          <Input
            id={`${idPrefix}-order`}
            type="number"
            value={form.order}
            onChange={(event) =>
              setForm({ ...form, order: Number(event.target.value) || 0 })
            }
          />
        </Field>

        <Field label="Current role">
          <div className="flex h-11 items-center">
            <Switch
              checked={form.current}
              onCheckedChange={(checked) =>
                setForm({ ...form, current: checked })
              }
              aria-label="Current role"
            />
          </div>
        </Field>
      </div>
    </div>
  );
}

function ExperienceEditor({
  item,
  allItems,
}: {
  item: ExperienceData;
  allItems: ExperienceData[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<Draft>(() => toDraft(item));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(toDraft(item));
  }, [item]);

  async function handleSave() {
    setSaving(true);
    setErrors({});

    try {
      if (isFallbackId(item._id)) {
        for (const row of allItems) {
          const payload = row._id === item._id ? form : toDraft(row);
          await apiRequest("/api/experience", {
            method: "POST",
            body: JSON.stringify(payload),
          });
        }
        toast.success("Timeline saved. You can keep editing from here.");
      } else {
        await apiRequest(`/api/experience/${item._id}`, {
          method: "PATCH",
          body: JSON.stringify(form),
        });
        toast.success("Entry updated");
      }
      router.refresh();
    } catch (error) {
      if (error instanceof RequestError) {
        setErrors(error.fieldErrors);
        toast.error(error.message);
      } else {
        toast.error("Could not save the entry");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <li className="space-y-4 rounded-lg border border-border p-3.5">
      <ExperienceFields
        form={form}
        setForm={setForm}
        errors={errors}
        idPrefix={item._id}
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          type="button"
          variant="gradient"
          onClick={() => void handleSave()}
          disabled={saving}
        >
          {saving ? (
            <>
              <LoaderIcon className="animate-spin" />
              Saving
            </>
          ) : (
            <>
              <SaveIcon />
              Save changes
            </>
          )}
        </Button>

        {!isFallbackId(item._id) && (
          <DeleteButton
            endpoint={`/api/experience/${item._id}`}
            label="Entry"
            name={`${item.role} at ${item.company}`}
          />
        )}
      </div>
    </li>
  );
}

export function ExperienceManager({ items }: { items: ExperienceData[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const showingFallbacks = useMemo(
    () => items.some((item) => isFallbackId(item._id)),
    [items],
  );

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setErrors({});

    try {
      if (showingFallbacks) {
        for (const row of items) {
          await apiRequest("/api/experience", {
            method: "POST",
            body: JSON.stringify(toDraft(row)),
          });
        }
      }

      await apiRequest("/api/experience", {
        method: "POST",
        body: JSON.stringify({
          ...draft,
          order: draft.order || items.length + 1,
        }),
      });
      toast.success("Entry added");
      setDraft(EMPTY);
      router.refresh();
    } catch (error) {
      if (error instanceof RequestError) {
        setErrors(error.fieldErrors);
        toast.error(error.message);
      } else {
        toast.error("Could not add the entry");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-5">
      <AdminCard
        title="Add an entry"
        description="Periods are free text so they can read the way your resume reads, for example “Jun 2023 — Aug 2023”."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <ExperienceFields
            form={draft}
            setForm={setDraft}
            errors={errors}
            idPrefix="new"
          />

          <Button type="submit" variant="gradient" disabled={pending}>
            {pending ? (
              <>
                <LoaderIcon className="animate-spin" />
                Adding
              </>
            ) : (
              <>
                <PlusIcon />
                Add entry
              </>
            )}
          </Button>
        </form>
      </AdminCard>

      <AdminCard
        title={`Timeline (${items.length})`}
        description={
          showingFallbacks
            ? "These rows are still the site fallback. Press Save changes on any entry to write them into the database — then edits will stick."
            : "Edit any field, toggle highlight options, then press Save changes."
        }
      >
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No entries yet.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <ExperienceEditor key={item._id} item={item} allItems={items} />
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}
