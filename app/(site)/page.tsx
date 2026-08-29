import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Skills } from "@/components/sections/skills";
import { Work } from "@/components/sections/work";
import {
  getExperiences,
  getProfile,
  getProjects,
  getSkills,
} from "@/lib/content";

// Content is admin-editable, so pages are rendered per request rather than
// cached at build time; an edit in the dashboard shows up on the next load.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, skills, projects, experiences] = await Promise.all([
    getProfile(),
    getSkills(),
    getProjects(),
    getExperiences(),
  ]);

  return (
    <>
      <Hero profile={profile} />
      <About profile={profile} />
      <Skills skills={skills} />
      <Work projects={projects} />
      <Experience items={experiences} />
      <Contact profile={profile} />
    </>
  );
}
