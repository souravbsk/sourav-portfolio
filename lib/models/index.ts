/**
 * Server-only barrel. Importing anything from here pulls in Mongoose, so client
 * components must import shared enums and labels from `@/lib/taxonomy` instead.
 */
export { Project } from "./project";
export type { ProjectDoc } from "./project";

export { BlogPost } from "./blog-post";
export type { BlogPostDoc } from "./blog-post";

export { Tool } from "./tool";
export type { ToolDoc } from "./tool";

export { Product } from "./product";
export type { ProductDoc } from "./product";

export { Profile } from "./profile";
export type { ProfileDoc, SocialLink } from "./profile";

export { Skill } from "./skill";
export type { SkillDoc } from "./skill";

export { Experience } from "./experience";
export type { ExperienceDoc } from "./experience";

export { Message } from "./message";
export type { MessageDoc } from "./message";
