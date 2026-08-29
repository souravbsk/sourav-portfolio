"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderIcon, PlusIcon, SaveIcon, TrashIcon } from "lucide-react";
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
import type {
  CourseItem,
  EducationItem,
  LanguageItem,
  ProfileData,
  Social,
  SocialIcon,
  Stat,
} from "@/types/content";

const SOCIAL_ICONS: SocialIcon[] = [
  "github",
  "linkedin",
  "facebook",
  "stackoverflow",
  "twitter",
  "mail",
  "globe",
];

export function ProfileForm({ profile }: { profile: ProfileData }) {
  const router = useRouter();
  const [form, setForm] = useState<ProfileData>({
    ...profile,
    education: profile.education ?? [],
    languages: profile.languages ?? [],
    courses: profile.courses ?? [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  function set<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setErrors({});

    try {
      await apiRequest("/api/profile", {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      toast.success("Profile saved");
      router.refresh();
    } catch (error) {
      if (error instanceof RequestError) {
        setErrors(error.fieldErrors);
        toast.error(error.message);
      } else {
        toast.error("Could not save the profile");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AdminCard title="Identity" description="Drives the hero and the header.">
        <div className="space-y-4">
          <FieldRow>
            <Field id="name" label="Name" error={errors.name}>
              <Input
                id="name"
                value={form.name}
                onChange={(event) => set("name", event.target.value)}
                required
              />
            </Field>

            <Field
              id="availability"
              label="Availability badge"
              hint="Leave blank to hide the badge."
              error={errors.availability}
            >
              <Input
                id="availability"
                value={form.availability}
                onChange={(event) => set("availability", event.target.value)}
                placeholder="Open to new projects"
              />
            </Field>
          </FieldRow>

          <Field
            id="headline"
            label="Headline"
            hint="The paragraph directly under the typewriter in the hero."
            error={errors.headline}
          >
            <Textarea
              id="headline"
              rows={2}
              value={form.headline}
              onChange={(event) => set("headline", event.target.value)}
            />
          </Field>

          <Field
            id="roles"
            label="Typewriter roles"
            hint="Cycled in the hero. The first one also appears on the resume."
            error={errors.roles}
          >
            <TagInput
              id="roles"
              value={form.roles}
              onChange={(value) => set("roles", value)}
              placeholder="Full Stack Developer…"
            />
          </Field>

          <Field label="Portrait" error={errors.avatarUrl}>
            <ImageUploader
              value={form.avatarUrl ? [form.avatarUrl] : []}
              onChange={(urls) => set("avatarUrl", urls[0] ?? "")}
              label="portrait"
            />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="About" description="The long-form About section.">
        <div className="space-y-4">
          <Field id="bio" label="Bio" error={errors.bio}>
            <Textarea
              id="bio"
              rows={7}
              value={form.bio}
              onChange={(event) => set("bio", event.target.value)}
            />
          </Field>

          <Field
            id="shortBio"
            label="Short bio"
            hint="Used as the fallback meta description."
            error={errors.shortBio}
          >
            <Textarea
              id="shortBio"
              rows={2}
              value={form.shortBio}
              onChange={(event) => set("shortBio", event.target.value)}
            />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Contact">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field id="email" label="Email" error={errors.email}>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => set("email", event.target.value)}
              aria-invalid={Boolean(errors.email)}
            />
          </Field>

          <Field id="phone" label="Phone" error={errors.phone}>
            <Input
              id="phone"
              value={form.phone}
              onChange={(event) => set("phone", event.target.value)}
            />
          </Field>

          <Field id="location" label="Location" error={errors.location}>
            <Input
              id="location"
              value={form.location}
              onChange={(event) => set("location", event.target.value)}
            />
          </Field>
        </div>
      </AdminCard>

      <AdminCard
        title="Social links"
        description="Shown in the hero, the footer, the contact section and the resume."
      >
        <RepeatableList<Social>
          items={form.socials}
          onChange={(socials) => set("socials", socials)}
          emptyItem={{ label: "", url: "", icon: "globe" }}
          addLabel="Add link"
          max={12}
          render={(item, update) => (
            <div className="grid flex-1 gap-2.5 sm:grid-cols-[1fr_1.6fr_9rem]">
              <Input
                value={item.label}
                onChange={(event) => update({ ...item, label: event.target.value })}
                placeholder="Label"
                aria-label="Link label"
              />
              <Input
                value={item.url}
                onChange={(event) => update({ ...item, url: event.target.value })}
                placeholder="https://…"
                aria-label="Link URL"
              />
              <Select
                value={item.icon}
                onValueChange={(value) =>
                  update({ ...item, icon: value as SocialIcon })
                }
              >
                <SelectTrigger aria-label="Link icon">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOCIAL_ICONS.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </AdminCard>

      <AdminCard
        title="Hero stats"
        description="The three figures under the hero. Keep them true."
      >
        <RepeatableList<Stat>
          items={form.stats}
          onChange={(stats) => set("stats", stats)}
          emptyItem={{ value: "", label: "" }}
          addLabel="Add stat"
          max={6}
          render={(item, update) => (
            <div className="grid flex-1 gap-2.5 sm:grid-cols-[7rem_1fr]">
              <Input
                value={item.value}
                onChange={(event) => update({ ...item, value: event.target.value })}
                placeholder="2+"
                aria-label="Stat value"
              />
              <Input
                value={item.label}
                onChange={(event) => update({ ...item, label: event.target.value })}
                placeholder="Years of experience"
                aria-label="Stat label"
              />
            </div>
          )}
        />
      </AdminCard>

      <AdminCard
        title="Resume"
        description="The /resume page is a formatted document. Experience and skills come from their own dashboard pages; education, languages and courses are edited here."
      >
        <div className="space-y-5">
          <Field
            id="resumeFileUrl"
            label="Resume PDF URL"
            hint="Optional download. A path like /resume/your-resume.pdf, or an uploaded file URL."
            error={errors.resumeFileUrl}
          >
            <Input
              id="resumeFileUrl"
              value={form.resumeFileUrl}
              onChange={(event) => set("resumeFileUrl", event.target.value)}
            />
          </Field>

          <Field id="resumeSummary" label="Summary" error={errors.resumeSummary}>
            <Textarea
              id="resumeSummary"
              rows={4}
              value={form.resumeSummary}
              onChange={(event) => set("resumeSummary", event.target.value)}
            />
          </Field>

          <div>
            <p className="eyebrow mb-2">Education</p>
            <RepeatableList<EducationItem>
              items={form.education}
              onChange={(education) => set("education", education)}
              emptyItem={{ heading: "", subheading: "", period: "" }}
              addLabel="Add education"
              max={8}
              render={(item, update) => (
                <div className="grid flex-1 gap-2.5 sm:grid-cols-3">
                  <Input
                    value={item.heading}
                    onChange={(event) =>
                      update({ ...item, heading: event.target.value })
                    }
                    placeholder="Degree"
                    aria-label="Degree"
                  />
                  <Input
                    value={item.subheading}
                    onChange={(event) =>
                      update({ ...item, subheading: event.target.value })
                    }
                    placeholder="Institution"
                    aria-label="Institution"
                  />
                  <Input
                    value={item.period}
                    onChange={(event) =>
                      update({ ...item, period: event.target.value })
                    }
                    placeholder="2019 — Present"
                    aria-label="Period"
                  />
                </div>
              )}
            />
          </div>

          <div>
            <p className="eyebrow mb-2">Languages</p>
            <RepeatableList<LanguageItem>
              items={form.languages}
              onChange={(languages) => set("languages", languages)}
              emptyItem={{ name: "", level: "" }}
              addLabel="Add language"
              max={8}
              render={(item, update) => (
                <div className="grid flex-1 gap-2.5 sm:grid-cols-2">
                  <Input
                    value={item.name}
                    onChange={(event) =>
                      update({ ...item, name: event.target.value })
                    }
                    placeholder="English"
                    aria-label="Language"
                  />
                  <Input
                    value={item.level}
                    onChange={(event) =>
                      update({ ...item, level: event.target.value })
                    }
                    placeholder="Fluent"
                    aria-label="Level"
                  />
                </div>
              )}
            />
          </div>

          <div>
            <p className="eyebrow mb-2">Courses</p>
            <RepeatableList<CourseItem>
              items={form.courses}
              onChange={(courses) => set("courses", courses)}
              emptyItem={{ heading: "", subheading: "", period: "" }}
              addLabel="Add course"
              max={8}
              render={(item, update) => (
                <div className="grid flex-1 gap-2.5 sm:grid-cols-3">
                  <Input
                    value={item.heading}
                    onChange={(event) =>
                      update({ ...item, heading: event.target.value })
                    }
                    placeholder="Course name"
                    aria-label="Course"
                  />
                  <Input
                    value={item.subheading}
                    onChange={(event) =>
                      update({ ...item, subheading: event.target.value })
                    }
                    placeholder="Issuer"
                    aria-label="Issuer"
                  />
                  <Input
                    value={item.period}
                    onChange={(event) =>
                      update({ ...item, period: event.target.value })
                    }
                    placeholder="Jan 2023 — May 2023"
                    aria-label="Period"
                  />
                </div>
              )}
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard title="SEO">
        <div className="space-y-4">
          <Field
            id="seoTitle"
            label="Title"
            hint="Up to 70 characters."
            error={errors.seoTitle}
          >
            <Input
              id="seoTitle"
              value={form.seoTitle}
              onChange={(event) => set("seoTitle", event.target.value)}
              maxLength={70}
            />
          </Field>

          <Field
            id="seoDescription"
            label="Description"
            hint="Up to 200 characters."
            error={errors.seoDescription}
          >
            <Textarea
              id="seoDescription"
              rows={2}
              value={form.seoDescription}
              onChange={(event) => set("seoDescription", event.target.value)}
              maxLength={200}
            />
          </Field>
        </div>
      </AdminCard>

      <div className="sticky bottom-4 z-10">
        <div className="panel flex items-center justify-between gap-4 p-3 backdrop-blur-xl">
          <p className="text-sm text-muted-foreground">
            Changes go live as soon as you save.
          </p>
          <Button type="submit" variant="gradient" disabled={pending}>
            {pending ? (
              <>
                <LoaderIcon className="animate-spin" />
                Saving
              </>
            ) : (
              <>
                <SaveIcon />
                Save profile
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

/** Add/remove wrapper shared by the socials, stats and resume editors. */
function RepeatableList<T>({
  items,
  onChange,
  emptyItem,
  addLabel,
  max,
  render,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  emptyItem: T;
  addLabel: string;
  max: number;
  render: (item: T, update: (next: T) => void) => React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          {render(item, (next) => {
            const copy = [...items];
            copy[index] = next;
            onChange(copy);
          })}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <TrashIcon />
          </Button>
        </div>
      ))}

      {items.length < max && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...items, structuredClone(emptyItem)])}
        >
          <PlusIcon />
          {addLabel}
        </Button>
      )}
    </div>
  );
}

