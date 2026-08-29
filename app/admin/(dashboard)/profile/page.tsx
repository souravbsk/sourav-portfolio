import { AdminPageHeader } from "@/components/admin/admin-page";
import { ProfileForm } from "@/components/admin/profile-form";
import { getProfile } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <>
      <AdminPageHeader
        title="Profile"
        description="Every piece of copy on the landing page, the footer and the resume lives here."
      />
      <ProfileForm profile={profile} />
    </>
  );
}
