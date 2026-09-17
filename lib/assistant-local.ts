import type { ChatTurn } from "@/lib/assistant-llm";

function sectionMap(context: string) {
  const blocks = context.split(/\n## /);
  const map = new Map<string, string>();
  for (const block of blocks) {
    const [title, ...rest] = block.split("\n");
    if (!title) continue;
    map.set(title.replace(/^#\s*/, "").trim().toLowerCase(), rest.join("\n").trim());
  }
  return map;
}

function takeLines(block: string, max = 8) {
  return block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, max)
    .join("\n");
}

function includesAny(haystack: string, needles: string[]) {
  return needles.some((needle) => haystack.includes(needle));
}

function normalizeQuestion(question: string) {
  return question
    .toLowerCase()
    .replace(/\bexperi[ae]n[cs]e?s?\b/g, "experience")
    .replace(/\bexperince\b/g, "experience")
    .replace(/\byoe\b/g, "years of experience");
}

function statsLine(sections: Map<string, string>, needle: RegExp) {
  const stats = sections.get("stats") ?? "";
  const line = stats
    .split("\n")
    .map((item) => item.replace(/^- /, "").trim())
    .find((item) => needle.test(item));
  return line ?? "";
}

function headerFields(context: string, fallbackName: string) {
  const header = context.split("\n## ")[0] ?? "";
  const lines = header
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const name =
    lines[0]?.replace(/^#\s*/, "").trim() || fallbackName;
  const rest = lines.filter((line) => !line.startsWith("#"));
  const field = (label: string) => {
    const match = rest.find((line) =>
      line.toLowerCase().startsWith(`${label.toLowerCase()}:`),
    );
    return match?.slice(label.length + 1).trim() ?? "";
  };

  const headline = rest[0] ?? "";
  const bio =
    rest.find(
      (line) =>
        line !== headline &&
        !/^(availability|location|email|phone|resume pdf)\s*:/i.test(line),
    ) ?? "";

  return {
    name,
    headline,
    bio,
    availability: field("Availability"),
    location: field("Location"),
    email: field("Email"),
    phone: field("Phone"),
  };
}

/**
 * Used when no LLM key is configured. It still answers from the same public
 * briefing the model would see, so the chat is useful on day one and stays
 * honest about what is on the site.
 */
export function localAssistantReply(
  messages: ChatTurn[],
  context: string,
  name: string,
) {
  const question = messages.at(-1)?.content ?? "";
  const q = normalizeQuestion(question);
  const sections = sectionMap(context);
  const profile = headerFields(context, name);
  const years =
    statsLine(sections, /year/i) ||
    statsLine(sections, /experience/i);

  if (
    includesAny(q, [
      "developer name",
      "his name",
      "her name",
      "your name",
      "who is this",
      "who is he",
      "who is sourav",
      "what's his name",
      "whats his name",
      "what is his name",
      "what is this developer",
      "called",
    ]) ||
    (includesAny(q, ["name"]) &&
      includesAny(q, ["developer", "person", "guy", "engineer", "who"]))
  ) {
    return `${profile.name}. ${profile.headline}`.trim();
  }

  if (
    includesAny(q, [
      "who are you",
      "what are you",
      "are you ai",
      "are you a bot",
    ])
  ) {
    return `I'm ${profile.name}'s portfolio assistant. I answer from this site and resume — projects, stack, experience, and how to get in touch.`;
  }

  if (
    includesAny(q, [
      "email",
      "phone",
      "contact",
      "reach",
      "get in touch",
      "how can i contact",
    ])
  ) {
    const social = sections.get("social") ?? "";
    return [
      `You can reach ${profile.name} from the contact form on this site, or directly:`,
      "",
      profile.email && `Email: ${profile.email}`,
      profile.phone && `Phone: ${profile.phone}`,
      profile.location && `Location: ${profile.location}`,
      social ? `\n${takeLines(social, 6)}` : "",
      "",
      "The contact form is on the homepage at /#contact.",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (
    includesAny(q, [
      "available",
      "availability",
      "freelance",
      "hire",
      "open to",
    ])
  ) {
    const availability =
      profile.availability || "Availability is listed on the homepage hero.";
    return `Availability: ${availability.replace(/^Availability:\s*/i, "")}\n\nIf it looks like a fit, the fastest path is the contact form at /#contact.`;
  }

  if (
    includesAny(q, [
      "where",
      "location",
      "based",
      "live",
      "city",
      "country",
    ])
  ) {
    return profile.location
      ? `${profile.name} is based in ${profile.location}.`
      : `Location is not listed. The contact form at /#contact is the next step.`;
  }

  if (
    includesAny(q, [
      "stack",
      "skill",
      "technolog",
      "language",
      "framework",
      "tool",
    ])
  ) {
    const skills = sections.get("skills") ?? "Skills are listed on the homepage.";
    return `Here is ${profile.name}'s current stack, taken from the site:\n\n${takeLines(skills, 18)}`;
  }

  if (
    includesAny(q, [
      "years of experience",
      "year of experience",
      "years experience",
      "year experience",
      "how many year",
      "how long",
    ]) ||
    (includesAny(q, ["year", "years"]) &&
      includesAny(q, ["experience", "exp", "how"]))
  ) {
    const experience = sections.get("experience") ?? "";
    const current = experience
      .split("\n")
      .map((line) => line.replace(/^- /, "").trim())
      .find((line) => /current/i.test(line));
    return [
      years
        ? `${profile.name} has ${years.replace(/\s+/g, " ")}.`
        : `${profile.name}'s years of experience are listed in the hero stats.`,
      current ? `Current role: ${current}` : null,
      "Full timeline is in the Experience section and on /resume.",
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (
    includesAny(q, ["experience", "work history", "company", "job", "career"])
  ) {
    const experience =
      sections.get("experience") ??
      "Experience is listed in the Experience section.";
    return [
      years ? `${profile.name} has ${years.replace(/\s+/g, " ")}.` : null,
      `Recent roles from the resume/site:\n\n${takeLines(experience, 12)}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (includesAny(q, ["resume", "cv", "education", "degree", "course"])) {
    const summary = sections.get("resume summary") ?? "";
    const education = sections.get("education") ?? "";
    const courses = sections.get("courses") ?? "";
    return [
      summary && `Summary:\n${summary}`,
      education && `Education:\n${takeLines(education, 8)}`,
      courses && `Courses:\n${takeLines(courses, 8)}`,
      `The formatted PDF lives at /resume.`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (
    includesAny(q, [
      "project",
      "portfolio",
      "shipped",
      "built",
      "website",
      "look at",
    ])
  ) {
    const projects = sections.get("projects") ?? "Projects are on /projects.";
    const featured = projects
      .split(/\n- /)
      .filter((chunk) => /featured/i.test(chunk))
      .slice(0, 4)
      .map((chunk) => `- ${chunk.trim()}`);
    const body = featured.length > 0 ? featured.join("\n\n") : takeLines(projects, 16);
    return `A few things ${profile.name} has shipped:\n\n${body}\n\nOpen any card on /#work for screenshots and source.`;
  }

  if (includesAny(q, ["blog", "writing", "article", "post"])) {
    const writing = sections.get("writing") ?? "Writing lives at /blog.";
    return `Published writing:\n\n${takeLines(writing, 10)}\n\nMore at /blog.`;
  }

  if (
    includesAny(q, [
      "what does he do",
      "what do you do",
      "about",
      "who is",
      "bio",
      "intro",
    ])
  ) {
    return [profile.headline, profile.bio].filter(Boolean).join("\n\n");
  }

  return `${profile.name} is a ${profile.headline || "full-stack developer"}. Ask about his projects, stack, experience, resume, or how to get in touch.`;
}

export async function* streamLocalReply(text: string) {
  const parts = text.split(/(\s+)/).filter((part) => part.length > 0);
  for (const part of parts) {
    yield part;
    await new Promise((resolve) => setTimeout(resolve, part.trim() ? 16 : 8));
  }
}
