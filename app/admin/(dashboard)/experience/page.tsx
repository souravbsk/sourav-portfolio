import { AdminPageHeader } from "@/components/admin/admin-page";
import { ExperienceManager } from "@/components/admin/experience-manager";
import { getExperiences } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const items = await getExperiences();

  return (
    <>
      <AdminPageHeader
        title="Experience"
        description="Drives the timeline on the landing page."
      />
      <ExperienceManager items={items} />
    </>
  );
}
