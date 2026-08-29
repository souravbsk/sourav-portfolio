import type {
  ExperienceIcon,
  ProjectCategory,
  SkillGroup,
  ToolEmbedType,
} from "@/lib/taxonomy";

/**
 * Plain, JSON-serialisable shapes. Server components read Mongoose documents
 * and pass these across the client boundary, so nothing here may contain an
 * ObjectId or a Date instance.
 */

export type SocialIcon =
  | "github"
  | "linkedin"
  | "facebook"
  | "stackoverflow"
  | "mail"
  | "twitter"
  | "globe";

export type Social = {
  label: string;
  url: string;
  icon: SocialIcon;
};

export type Stat = {
  value: string;
  label: string;
};

export type ResumeEntry = {
  heading: string;
  subheading: string;
  period: string;
  bullets: string[];
};

export type ResumeSectionData = {
  title: string;
  entries: ResumeEntry[];
  body: string;
};

export type EducationItem = {
  heading: string;
  subheading: string;
  period: string;
};

export type LanguageItem = {
  name: string;
  level: string;
};

export type CourseItem = {
  heading: string;
  subheading: string;
  period: string;
};

export type ProfileData = {
  name: string;
  headline: string;
  roles: string[];
  bio: string;
  shortBio: string;
  avatarUrl: string;
  email: string;
  phone: string;
  location: string;
  availability: string;
  socials: Social[];
  stats: Stat[];
  resumeFileUrl: string;
  resumeSummary: string;
  education: EducationItem[];
  languages: LanguageItem[];
  courses: CourseItem[];
  seoTitle: string;
  seoDescription: string;
};

export type ProductData = {
  _id: string;
  name: string;
  url: string;
  description: string;
  order: number;
  published: boolean;
};

export type ProjectData = {
  _id: string;
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
  order: number;
  createdAt?: string;
};

export type BlogPostData = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  coverImage: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ToolData = {
  _id: string;
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

export type SkillData = {
  _id: string;
  title: string;
  icon: string;
  group: SkillGroup;
  level: number;
  order: number;
  featured: boolean;
};

export type ExperienceData = {
  _id: string;
  role: string;
  company: string;
  companyUrl: string;
  period: string;
  description: string;
  highlights: string[];
  icon: ExperienceIcon;
  current: boolean;
  order: number;
};

export type MessageData = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  archived: boolean;
  createdAt: string;
};
