import type { Metadata } from "next";

import { ResumeContactRail } from "@/components/resume/resume-contact-rail";
import { ResumeViewerClient } from "@/components/resume/resume-viewer-client";
import { getProfile } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resume",
  description: "Read the PDF here, or download it. Phone and email sit beside it.",
};

export default async function ResumePage() {
  const profile = await getProfile();

  return (
    <div className="container-page pt-28 pb-16 md:pt-32">
      <div className="mb-8">
        <p className="eyebrow">Resume</p>
        <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
          {profile.name}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          The file from the dashboard, shown with a PDF viewer — not a restyled
          copy of the same text.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <ResumeContactRail profile={profile} />

        {profile.resumeFileUrl ? (
          <ResumeViewerClient fileUrl={profile.resumeFileUrl} />
        ) : (
          <div className="panel grid min-h-80 place-items-center p-8 text-center text-sm text-muted-foreground">
            Upload a resume PDF in the dashboard to preview it here.
          </div>
        )}
      </div>
    </div>
  );
}
