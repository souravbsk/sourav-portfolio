import mongoose from "mongoose";

import { connectToDatabase, serialize } from "@/lib/db";
import {
  BlogPost,
  Experience,
  Message,
  Product,
  Profile,
  Project,
  Skill,
  Tool,
} from "@/lib/models";
import {
  DEFAULT_EXPERIENCES,
  DEFAULT_PRODUCTS,
  DEFAULT_PROFILE,
  DEFAULT_SKILLS,
} from "@/lib/default-content";
import type {
  BlogPostData,
  ExperienceData,
  MessageData,
  ProductData,
  ProfileData,
  ProjectData,
  SkillData,
  ToolData,
} from "@/types/content";

/**
 * The public pages must render even if the database is unreachable or has not
 * been seeded yet, so every reader here degrades to the fallback content in
 * `default-content.ts` instead of throwing a 500 at a visitor.
 */
let warnedAboutFallback = false;

async function withDb<T>(read: () => Promise<T>, fallback: T): Promise<T> {
  try {
    await connectToDatabase();
    return await read();
  } catch (error) {
    // A build renders many pages, and each one failing the same way would print
    // the same stack dozens of times. One clear line is more useful.
    if (!warnedAboutFallback) {
      warnedAboutFallback = true;
      console.warn(
        `[content] Database unavailable, serving fallback content: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
    return fallback;
  }
}

export async function getProfile(): Promise<ProfileData> {
  return withDb(async () => {
    const doc = await Profile.findOne({ key: "primary" }).lean();
    if (!doc) return DEFAULT_PROFILE;
    const { _id, key, createdAt, updatedAt, ...rest } = serialize(
      doc,
    ) as unknown as ProfileData & Record<string, unknown>;
    void _id;
    void key;
    void createdAt;
    void updatedAt;
    return {
      ...DEFAULT_PROFILE,
      ...rest,
      education:
        Array.isArray(rest.education) && rest.education.length > 0
          ? rest.education
          : DEFAULT_PROFILE.education,
      languages:
        Array.isArray(rest.languages) && rest.languages.length > 0
          ? rest.languages
          : DEFAULT_PROFILE.languages,
      courses:
        Array.isArray(rest.courses) && rest.courses.length > 0
          ? rest.courses
          : DEFAULT_PROFILE.courses,
    } as ProfileData;
  }, DEFAULT_PROFILE);
}

export async function getSkills(): Promise<SkillData[]> {
  const fallback = DEFAULT_SKILLS.map((skill, index) => ({
    ...skill,
    _id: `fallback-skill-${index}`,
  }));

  return withDb(async () => {
    const docs = await Skill.find().sort({ order: 1, _id: 1 }).lean();
    if (docs.length === 0) return fallback;
    return serialize(docs) as unknown as SkillData[];
  }, fallback);
}

export async function getExperiences(): Promise<ExperienceData[]> {
  const fallback = DEFAULT_EXPERIENCES.map((item, index) => ({
    ...item,
    _id: `fallback-experience-${index}`,
  }));

  return withDb(async () => {
    const docs = await Experience.find().sort({ order: 1, _id: 1 }).lean();
    if (docs.length === 0) return fallback;
    return serialize(docs) as unknown as ExperienceData[];
  }, fallback);
}

/**
 * The old Express route filtered by regex against the `skills` array, while the
 * admin form wrote a `category` that nothing read. We filter on `category` and
 * fall back to the legacy skills regex so documents created before the category
 * field existed still appear under the right tab.
 */
export function projectFilter(tab?: string | null) {
  if (!tab || tab === "all") return {};

  const legacy: Record<string, Record<string, unknown>> = {
    frontend: {
      $and: [
        { skills: { $not: { $regex: "express", $options: "i" } } },
        { skills: { $regex: "^(react|nextjs|next js)$", $options: "i" } },
      ],
    },
    fullstack: {
      $and: [
        { skills: { $regex: "react", $options: "i" } },
        { skills: { $regex: "express", $options: "i" } },
      ],
    },
    wordpress: { skills: { $regex: "wordpress", $options: "i" } },
  };

  const categories = ["html", "react", "mern", "next", "wordpress"];
  if (categories.includes(tab)) {
    const legacyFallback = legacy[tab];
    if (legacyFallback) {
      return { $or: [{ category: tab }, legacyFallback] };
    }
    return { category: tab };
  }

  return legacy[tab] ?? {};
}

export async function getProjects(tab?: string | null): Promise<ProjectData[]> {
  return withDb(async () => {
    const docs = await Project.find(projectFilter(tab))
      .sort({ order: 1, createdAt: -1, _id: -1 })
      .lean();
    return normaliseProjects(docs);
  }, []);
}

export async function getProject(id: string): Promise<ProjectData | null> {
  return withDb(async () => {
    const doc = await Project.findById(id).lean();
    if (!doc) return null;
    return normaliseProjects([doc])[0] ?? null;
  }, null);
}

/**
 * Legacy documents may carry either `PhotoUrl` or `photoUrl`, and none of them
 * have `category`, `order` or timestamps. Filling the gaps here keeps every
 * consumer free of defensive checks.
 */
function normaliseProjects(docs: unknown[]): ProjectData[] {
  return (serialize(docs) as Record<string, unknown>[]).map((doc) => ({
    _id: String(doc._id),
    title: (doc.title as string) ?? "Untitled project",
    description: (doc.description as string) ?? "",
    liveLink: (doc.liveLink as string) ?? "",
    clientLink: (doc.clientLink as string) ?? "",
    serverLink: (doc.serverLink as string) ?? "",
    skills: Array.isArray(doc.skills) ? (doc.skills as string[]) : [],
    PhotoUrl:
      (doc.PhotoUrl as string) || (doc.photoUrl as string) || "",
    projectSS: Array.isArray(doc.projectSS) ? (doc.projectSS as string[]) : [],
    status: (doc.status as ProjectData["status"]) ?? "normal",
    category: (doc.category as ProjectData["category"]) ?? "react",
    order: typeof doc.order === "number" ? doc.order : 0,
    createdAt: doc.createdAt as string | undefined,
  }));
}

export async function getPosts({
  category,
  includeDrafts = false,
}: { category?: string; includeDrafts?: boolean } = {}): Promise<BlogPostData[]> {
  return withDb(async () => {
    const query: Record<string, unknown> = {};
    if (!includeDrafts) query.published = true;
    if (category && category !== "all") query.category = category;

    const docs = await BlogPost.find(query)
      .sort({ publishedAt: -1, createdAt: -1, _id: -1 })
      .lean();
    return serialize(docs) as unknown as BlogPostData[];
  }, []);
}

export async function getPostBySlug(
  slug: string,
  { includeDrafts = false }: { includeDrafts?: boolean } = {},
): Promise<BlogPostData | null> {
  return withDb(async () => {
    const query: Record<string, unknown> = { slug };
    if (!includeDrafts) query.published = true;
    const doc = await BlogPost.findOne(query).lean();
    return doc ? (serialize(doc) as unknown as BlogPostData) : null;
  }, null);
}

export async function getPostById(id: string): Promise<BlogPostData | null> {
  return withDb(async () => {
    const doc = await BlogPost.findById(id).lean();
    return doc ? (serialize(doc) as unknown as BlogPostData) : null;
  }, null);
}

export async function getBlogCategories(): Promise<
  { category: string; count: number }[]
> {
  return withDb(async () => {
    const rows = await BlogPost.aggregate<{ _id: string; count: number }>([
      { $match: { published: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]);
    return rows.map((row) => ({ category: row._id, count: row.count }));
  }, []);
}

export async function getTools({
  includeDrafts = false,
}: { includeDrafts?: boolean } = {}): Promise<ToolData[]> {
  return withDb(async () => {
    const query = includeDrafts ? {} : { published: true };
    const docs = await Tool.find(query).sort({ order: 1, _id: -1 }).lean();
    return serialize(docs) as unknown as ToolData[];
  }, []);
}

/** Accepts a slug or an ObjectId: the public site links by slug, admin by id. */
export async function getToolBySlug(
  slugOrId: string,
): Promise<ToolData | null> {
  return withDb(async () => {
    const query = mongoose.isValidObjectId(slugOrId)
      ? { _id: new mongoose.Types.ObjectId(slugOrId) }
      : { slug: slugOrId.toLowerCase() };

    const doc = await Tool.findOne(query).lean();
    return doc ? (serialize(doc) as unknown as ToolData) : null;
  }, null);
}

export async function getMessages(): Promise<MessageData[]> {
  return withDb(async () => {
    const docs = await Message.find({ archived: false })
      .sort({ createdAt: -1 })
      .lean();
    return serialize(docs) as unknown as MessageData[];
  }, []);
}

export async function getProducts({
  includeDrafts = false,
}: { includeDrafts?: boolean } = {}): Promise<ProductData[]> {
  const fallback = DEFAULT_PRODUCTS.map((product, index) => ({
    ...product,
    _id: `fallback-product-${index}`,
  }));

  return withDb(async () => {
    const query = includeDrafts ? {} : { published: true };
    const docs = await Product.find(query).sort({ order: 1, _id: -1 }).lean();
    return serialize(docs) as unknown as ProductData[];
  }, fallback);
}

export async function getAdminCounts() {
  return withDb(
    async () => {
      const [projects, posts, drafts, tools, products, unread] =
        await Promise.all([
          Project.countDocuments(),
          BlogPost.countDocuments({ published: true }),
          BlogPost.countDocuments({ published: false }),
          Tool.countDocuments(),
          Product.countDocuments(),
          Message.countDocuments({ read: false, archived: false }),
        ]);
      return { projects, posts, drafts, tools, products, unread };
    },
    { projects: 0, posts: 0, drafts: 0, tools: 0, products: 0, unread: 0 },
  );
}
