import { z } from "zod";

import {
  EXPERIENCE_ICONS,
  PROJECT_CATEGORIES,
  SKILL_GROUPS,
  TOOL_EMBED_TYPES,
} from "@/lib/taxonomy";

const optionalUrlish = z
  .string()
  .trim()
  .max(600)
  .optional()
  .transform((value) => value ?? "");

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Slug is required")
  .max(160)
  .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only");

const stringArray = z.array(z.string().trim().min(1).max(120)).max(40).default([]);

export const projectCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(160),
  description: z.string().trim().max(5000).default(""),
  liveLink: optionalUrlish,
  clientLink: optionalUrlish,
  serverLink: optionalUrlish,
  skills: stringArray,
  PhotoUrl: optionalUrlish,
  projectSS: z.array(z.string().trim().min(1)).max(24).default([]),
  status: z.enum(["special", "normal"]).default("normal"),
  category: z.enum(PROJECT_CATEGORIES).default("react"),
  order: z.number().int().min(-9999).max(9999).default(0),
});

export const projectUpdateSchema = projectCreateSchema.partial();

export const projectReorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(200),
});

export const blogPostCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug,
  category: slug,
  coverImage: optionalUrlish,
  excerpt: z.string().trim().max(400).default(""),
  content: z.string().max(200_000).default(""),
  tags: stringArray,
  published: z.boolean().default(false),
  publishedAt: z.union([z.string(), z.null()]).optional(),
});

export const blogPostUpdateSchema = blogPostCreateSchema.partial();

export const toolCreateSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(140),
  slug,
  description: z.string().trim().max(1000).default(""),
  icon: optionalUrlish,
  url: optionalUrlish,
  embedType: z.enum(TOOL_EMBED_TYPES).default("link"),
  tags: stringArray,
  order: z.number().int().min(-999).max(999).default(0),
  published: z.boolean().default(false),
});

export const toolUpdateSchema = toolCreateSchema.partial();

export const skillCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(80),
  icon: optionalUrlish,
  group: z.enum(SKILL_GROUPS).default("frontend"),
  level: z.number().int().min(1).max(5).default(4),
  order: z.number().int().min(-999).max(999).default(0),
  featured: z.boolean().default(true),
});

export const skillUpdateSchema = skillCreateSchema.partial();

export const experienceCreateSchema = z.object({
  role: z.string().trim().min(1, "Role is required").max(140),
  company: z.string().trim().min(1, "Company is required").max(140),
  companyUrl: optionalUrlish,
  period: z.string().trim().max(80).default(""),
  description: z.string().trim().max(2000).default(""),
  highlights: stringArray,
  icon: z.enum(EXPERIENCE_ICONS).default("briefcase"),
  current: z.boolean().default(false),
  order: z.number().int().min(-999).max(999).default(0),
});

export const experienceUpdateSchema = experienceCreateSchema.partial();

const socialSchema = z.object({
  label: z.string().trim().min(1).max(60),
  url: z.string().trim().min(1).max(400),
  icon: z
    .enum(["github", "linkedin", "facebook", "stackoverflow", "mail", "twitter", "globe"])
    .default("globe"),
});

const statSchema = z.object({
  value: z.string().trim().min(1).max(20),
  label: z.string().trim().min(1).max(60),
});

const namedPeriodSchema = z.object({
  heading: z.string().trim().min(1).max(160),
  subheading: z.string().trim().max(160).default(""),
  period: z.string().trim().max(80).default(""),
});

const languageSchema = z.object({
  name: z.string().trim().min(1).max(60),
  level: z.string().trim().max(60).default(""),
});

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  headline: z.string().trim().max(220).optional(),
  roles: z.array(z.string().trim().min(1).max(80)).max(12).optional(),
  bio: z.string().trim().max(4000).optional(),
  shortBio: z.string().trim().max(400).optional(),
  avatarUrl: optionalUrlish.optional(),
  email: z.union([z.literal(""), z.string().trim().email()]).optional(),
  phone: z.string().trim().max(40).optional(),
  location: z.string().trim().max(120).optional(),
  availability: z.string().trim().max(120).optional(),
  socials: z.array(socialSchema).max(12).optional(),
  stats: z.array(statSchema).max(6).optional(),
  resumeFileUrl: optionalUrlish.optional(),
  resumeSummary: z.string().trim().max(2000).optional(),
  education: z.array(namedPeriodSchema).max(8).optional(),
  languages: z.array(languageSchema).max(8).optional(),
  courses: z.array(namedPeriodSchema).max(8).optional(),
  seoTitle: z.string().trim().max(70).optional(),
  seoDescription: z.string().trim().max(200).optional(),
});

export const productCreateSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(140),
  url: z.string().trim().min(1, "A link is required").max(600),
  description: z.string().trim().max(200).default(""),
  order: z.number().int().min(-999).max(999).default(0),
  published: z.boolean().default(true),
});

export const productUpdateSchema = productCreateSchema.partial();

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell me your name").max(120),
  email: z.string().trim().email("A valid email is required").max(200),
  phone: z.string().trim().max(40).default(""),
  subject: z.string().trim().max(200).default(""),
  message: z.string().trim().min(10, "A little more detail, please").max(5000),
  // Never filled by a human; a value here means a bot walked the form.
  honeypot: z.string().max(0).optional(),
});
