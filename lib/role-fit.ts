import { stripHtml } from "@/lib/utils";
import type { ProjectData } from "@/types/content";

const ALIASES: Record<string, string[]> = {
  next: ["nextjs", "next.js", "next js"],
  react: ["reactjs", "react.js"],
  node: ["nodejs", "node.js", "node js"],
  wordpress: ["wp", "elementor", "woocommerce"],
  mongo: ["mongodb", "mongoose"],
  express: ["expressjs", "express.js"],
  typescript: ["ts"],
  javascript: ["js"],
  redux: ["rtk", "redux toolkit"],
  fullstack: ["full-stack", "full stack", "mern"],
  frontend: ["front-end", "front end"],
  backend: ["back-end", "back end"],
};

const STOP = new Set([
  "the",
  "and",
  "for",
  "with",
  "you",
  "your",
  "our",
  "this",
  "that",
  "from",
  "have",
  "will",
  "are",
  "was",
  "were",
  "been",
  "being",
  "into",
  "about",
  "role",
  "job",
  "we",
  "a",
  "an",
  "to",
  "of",
  "in",
  "on",
  "or",
  "as",
  "is",
  "be",
]);

export type RoleFitResult = {
  query: string;
  ranked: { id: string; score: number }[];
  matchedSkills: string[];
  headline: string;
  brief: string;
};

function tokenize(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9.+#]+/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !STOP.has(token));
}

function expand(tokens: string[]) {
  const extra: string[] = [];
  for (const token of tokens) {
    extra.push(token);
    for (const [canon, list] of Object.entries(ALIASES)) {
      if (token === canon || list.includes(token)) {
        extra.push(canon, ...list);
      }
    }
  }
  return new Set(extra);
}

function haystack(project: ProjectData) {
  return [
    project.title,
    stripHtml(project.description),
    project.category,
    project.skills.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

export function matchRoleToProjects(
  query: string,
  projects: ProjectData[],
): RoleFitResult | null {
  const tokens = tokenize(query);
  if (tokens.length === 0) return null;

  const terms = expand(tokens);
  const skillHits = new Map<string, number>();

  const ranked = projects
    .map((project) => {
      const text = haystack(project);
      let score = 0;
      const hits: string[] = [];

      for (const skill of project.skills) {
        const needle = skill.toLowerCase();
        const parts = tokenize(skill);
        const matched =
          terms.has(needle) ||
          parts.some((part) => terms.has(part)) ||
          [...terms].some((term) => needle.includes(term) && term.length > 3);

        if (matched) {
          score += 6;
          hits.push(skill);
          skillHits.set(skill, (skillHits.get(skill) ?? 0) + 1);
        }
      }

      for (const term of terms) {
        if (term.length < 3) continue;
        if (text.includes(term)) score += 2;
      }

      return { id: project._id, score, hits, title: project.title };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) {
    return {
      query,
      ranked: [],
      matchedSkills: [],
      headline: "Nothing in the shipped work maps cleanly onto that brief.",
      brief: "",
    };
  }

  const matchedSkills = [...skillHits.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([skill]) => skill);

  const top = ranked.slice(0, 3);
  const headline =
    ranked.length === 1
      ? `${top[0].title} is the closest thing he has shipped for that brief.`
      : `${ranked.length} shipped projects overlap this role — start with ${top[0].title}.`;

  const brief = [
    `Sourav Basak — fit notes for “${query.trim().slice(0, 80)}"`,
    matchedSkills.length
      ? `Matched stack: ${matchedSkills.join(", ")}`
      : null,
    `Look at: ${top.map((row) => row.title).join("; ")}`,
    `Full work: this site’s Work section and /resume`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    query,
    ranked: ranked.map(({ id, score }) => ({ id, score })),
    matchedSkills,
    headline,
    brief,
  };
}

export function fitLabel(score: number) {
  if (score >= 14) return "Strong fit";
  if (score >= 6) return "Fits";
  return "Related";
}
