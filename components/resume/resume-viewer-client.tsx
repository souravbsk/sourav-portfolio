"use client";

import nextDynamic from "next/dynamic";

const ResumeViewer = nextDynamic(
  () =>
    import("@/components/resume/resume-viewer").then((mod) => mod.ResumeViewer),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-80 place-items-center rounded-2xl border border-border text-sm text-muted-foreground">
        Opening resume…
      </div>
    ),
  },
);

export function ResumeViewerClient({ fileUrl }: { fileUrl: string }) {
  return <ResumeViewer fileUrl={fileUrl} />;
}
