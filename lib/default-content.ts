import type {
  ExperienceData,
  ProductData,
  ProfileData,
  SkillData,
} from "@/types/content";

/**
 * Every string here is carried over from the resume and the previous version of
 * the site. Dates, employers and skills match the resume; copy has been
 * tightened where it was awkward, but no employer, date, role or figure has
 * been invented.
 *
 * This module seeds the database and also renders as a fallback if the site is
 * deployed before `npm run seed` has been run.
 */

export const DEFAULT_PROFILE: ProfileData = {
  name: "Sourav Basak",
  headline:
    "Full-stack developer at Sabhyasha, shipping React, Next.js and WordPress products — and using AI to move faster.",
  roles: [
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "MERN Stack Developer",
    "WordPress Developer",
  ],
  bio: "I am a Full Stack Developer at Sabhyasha Retail Tech, building buyer and seller products on React, Next.js, Node and WordPress. Before that I led work at Apna Byte, interned at Stackkaroo, and still take WordPress contract work with Brand & Visual. I care about clean interfaces, reliable APIs, and shipping something you can run in production. I use AI tools in the day-to-day — not as a shortcut, as a way to write, review and ship faster.",
  shortBio:
    "Full-stack developer at Sabhyasha. React, Next.js, WordPress, and AI-assisted shipping.",
  avatarUrl: "/images/avatar.jpg",
  email: "souravbsk01@gmail.com",
  phone: "+8801629351823",
  location: "Kishoreganj, Bangladesh",
  availability: "Open to new projects",
  socials: [
    { label: "GitHub", url: "https://github.com/souravbsk", icon: "github" },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/souravbsk/",
      icon: "linkedin",
    },
    {
      label: "Stack Overflow",
      url: "https://stackoverflow.com/users/21434261/sourav-basak",
      icon: "stackoverflow",
    },
    { label: "Facebook", url: "https://www.facebook.com/souravbsk", icon: "facebook" },
    { label: "Email", url: "mailto:souravbsk01@gmail.com", icon: "mail" },
  ],
  stats: [
    { value: "3+", label: "Years of experience" },
    { value: "9+", label: "Projects completed" },
    { value: "4", label: "Teams worked with" },
  ],
  resumeFileUrl: "/resume/sourav-basak-resume.pdf",
  resumeSummary:
    "Full Stack Developer at Sabhyasha Retail Tech. Proficient in WordPress, JavaScript, React, Next.js, MongoDB and Express. Comfortable with AI-assisted development. Nine personal projects shipped, and I am always eager to learn the next thing.",
  education: [
    {
      heading: "BBA Honours",
      subheading: "National University",
      period: "2019 — Present",
    },
  ],
  languages: [
    { name: "Bangla", level: "Native" },
    { name: "English", level: "Fluent" },
    { name: "Hindi", level: "Intermediate" },
  ],
  courses: [
    {
      heading: "Complete Web Development",
      subheading: "Programming Hero",
      period: "Jan 2023 — May 2023",
    },
  ],
  seoTitle: "Sourav Basak — Full Stack Developer",
  seoDescription:
    "Portfolio of Sourav Basak, a full-stack developer working with React, Next.js, the MERN stack and WordPress.",
};

type SkillSeed = Omit<SkillData, "_id">;

export const DEFAULT_SKILLS: SkillSeed[] = [
  { title: "HTML5", icon: "/skilimage/html.png", group: "frontend", level: 5, order: 1, featured: true },
  { title: "CSS3", icon: "/skilimage/css.png", group: "frontend", level: 5, order: 2, featured: true },
  { title: "Bootstrap", icon: "/skilimage/bootstrap.png", group: "frontend", level: 4, order: 3, featured: true },
  { title: "Tailwind CSS", icon: "/skilimage/tailwind.png", group: "frontend", level: 5, order: 4, featured: true },
  { title: "JavaScript", icon: "/skilimage/javascript.png", group: "frontend", level: 5, order: 5, featured: true },
  { title: "React", icon: "/skilimage/react.png", group: "frontend", level: 5, order: 6, featured: true },
  { title: "Next.js", icon: "/skilimage/next-js.png", group: "frontend", level: 4, order: 7, featured: true },
  { title: "Redux Toolkit", icon: "/skilimage/redux-tookit.png", group: "frontend", level: 4, order: 8, featured: true },
  { title: "React Router", icon: "/skilimage/react-router.png", group: "frontend", level: 4, order: 9, featured: true },
  { title: "React Bootstrap", icon: "/skilimage/bootstrap.png", group: "frontend", level: 4, order: 10, featured: true },
  { title: "Daisy UI", icon: "/skilimage/tailwind.png", group: "frontend", level: 4, order: 11, featured: true },
  { title: "Flowbite", icon: "/skilimage/tailwind.png", group: "frontend", level: 3, order: 12, featured: true },
  { title: "Sass", icon: "/skilimage/sass.png", group: "frontend", level: 4, order: 13, featured: true },
  { title: "Node.js", icon: "/skilimage/node-js.png", group: "backend", level: 3, order: 14, featured: true },
  { title: "Express.js", icon: "/skilimage/express-js.png", group: "backend", level: 4, order: 15, featured: true },
  { title: "REST API", icon: "", group: "backend", level: 4, order: 16, featured: true },
  { title: "Firebase", icon: "/skilimage/firebase.png", group: "backend", level: 4, order: 17, featured: true },
  { title: "MongoDB", icon: "/skilimage/mongodb.png", group: "database", level: 4, order: 18, featured: true },
  { title: "MySQL", icon: "", group: "database", level: 3, order: 19, featured: true },
  { title: "Git", icon: "/skilimage/git.png", group: "tooling", level: 4, order: 20, featured: true },
  { title: "GitHub", icon: "/skilimage/git.png", group: "tooling", level: 4, order: 21, featured: true },
  { title: "VS Code", icon: "", group: "tooling", level: 5, order: 22, featured: true },
  { title: "Chrome DevTools", icon: "", group: "tooling", level: 4, order: 23, featured: true },
  { title: "Figma", icon: "", group: "tooling", level: 3, order: 24, featured: true },
  { title: "JWT", icon: "", group: "tooling", level: 4, order: 25, featured: true },
  { title: "Vercel", icon: "", group: "tooling", level: 4, order: 26, featured: true },
  { title: "Netlify", icon: "", group: "tooling", level: 3, order: 27, featured: true },
  { title: "WordPress", icon: "/skilimage/wordpress.png", group: "cms", level: 5, order: 28, featured: true },
  { title: "ChatGPT", icon: "", group: "ai", level: 4, order: 29, featured: true },
  { title: "Cursor", icon: "", group: "ai", level: 4, order: 30, featured: true },
  { title: "GitHub Copilot", icon: "", group: "ai", level: 3, order: 31, featured: true },
];

type ExperienceSeed = Omit<ExperienceData, "_id">;

export const DEFAULT_EXPERIENCES: ExperienceSeed[] = [
  {
    role: "Full Stack Software Developer",
    company: "Sabhyasha Retail Tech",
    companyUrl: "https://www.sabhyasha.com",
    period: "Jan 2024 — Present",
    description:
      "Building and scaling the Sabhyasha buyer app and Artisans’ Wizard seller platform — React, Next.js, APIs and the day-to-day of an ONDC marketplace for rural and women-led sellers.",
    highlights: ["React", "Next.js", "ONDC", "APIs", "Product"],
    icon: "react",
    current: true,
    order: 1,
  },
  {
    role: "Junior Web Developer (Contractual)",
    company: "Brand & Visual",
    companyUrl: "",
    period: "Apr 2022 — Present",
    description:
      "Ongoing WordPress contract work: Elementor layouts, theme customisation, PSD to HTML, content, cPanel, migrations and bug fixing.",
    highlights: ["WordPress", "Elementor", "cPanel", "Contract"],
    icon: "wordpress",
    current: false,
    order: 2,
  },
  {
    role: "Software Developer",
    company: "Apna Byte",
    companyUrl: "",
    period: "Aug 2023 — Jan 2024",
    description:
      "React websites, Figma-to-Next layouts, API integration, design and concept work. Building APIs with Express, CRUD and REST, and acting as team lead.",
    highlights: ["React", "Next.js", "Express", "REST API", "Team lead"],
    icon: "code",
    current: false,
    order: 3,
  },
  {
    role: "MERN Stack Developer (Intern)",
    company: "Stackkaroo",
    companyUrl: "",
    period: "Jun 2023 — Aug 2023",
    description:
      "Next.js websites, bug fixing, Figma-to-Next layouts, content upload, API integration, and creating APIs with Express, CRUD and REST.",
    highlights: ["Next.js", "React", "Express", "REST API", "Figma to Next"],
    icon: "database",
    current: false,
    order: 4,
  },
];

type ProductSeed = Omit<ProductData, "_id">;

/**
 * Header Products dropdown. Add or edit these from /admin/products — the
 * public menu only lists published rows with a URL.
 */
export const DEFAULT_PRODUCTS: ProductSeed[] = [];
