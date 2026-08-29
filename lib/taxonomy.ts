/**
 * Shared enums and display labels for the content models.
 *
 * These live outside `lib/models/` on purpose. The model files import Mongoose,
 * and Mongoose pulls in the MongoDB driver, which requires Node built-ins like
 * `tls` and `net`. A client component that imported a category list from a model
 * file would drag that whole chain into the browser bundle and fail the build.
 * Keeping the constants here means both the schemas and the client components
 * can share one source of truth.
 */

export const PROJECT_CATEGORIES = [
  "html",
  "react",
  "mern",
  "next",
  "wordpress",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  html: "HTML / CSS / JS",
  react: "React",
  mern: "MERN",
  next: "Next.js",
  wordpress: "WordPress",
};

export const PROJECT_STATUSES = ["special", "normal"] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const SKILL_GROUPS = [
  "frontend",
  "backend",
  "database",
  "tooling",
  "cms",
  "ai",
] as const;

export type SkillGroup = (typeof SKILL_GROUPS)[number];

export const SKILL_GROUP_LABELS: Record<SkillGroup, string> = {
  frontend: "Front end",
  backend: "Back end",
  database: "Data",
  tooling: "Toolkit",
  cms: "CMS",
  ai: "AI",
};

export const EXPERIENCE_ICONS = [
  "wordpress",
  "react",
  "database",
  "code",
  "server",
  "briefcase",
] as const;

export type ExperienceIcon = (typeof EXPERIENCE_ICONS)[number];

export const TOOL_EMBED_TYPES = ["link", "iframe", "internal"] as const;

export type ToolEmbedType = (typeof TOOL_EMBED_TYPES)[number];
