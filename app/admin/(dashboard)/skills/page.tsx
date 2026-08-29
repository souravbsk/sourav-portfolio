import { AdminPageHeader } from "@/components/admin/admin-page";
import { SkillManager } from "@/components/admin/skill-manager";
import { getSkills } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await getSkills();

  return (
    <>
      <AdminPageHeader
        title="Skills"
        description="Drives the Toolkit section on the landing page and the skills block on the resume."
      />
      <SkillManager skills={skills} />
    </>
  );
}
