import { ApiError, route } from "@/lib/api";
import { getProfile } from "@/lib/content";
import {
  fetchRemotePdf,
  loadBundledResumePdf,
  loadStoredResumePdf,
} from "@/lib/resume-store";

export const dynamic = "force-dynamic";

function pdfHeaders(download: boolean) {
  return {
    "Content-Type": "application/pdf",
    "Cache-Control": "private, no-store, max-age=0, must-revalidate",
    "Content-Disposition": `${download ? "attachment" : "inline"}; filename="sourav-basak-resume.pdf"`,
  };
}

/**
 * Public PDF stream for /resume. Prefers the Mongo copy from the dashboard
 * upload, then the bundled public file, then a Cloudinary URL if one exists.
 */
export const GET = route(async (request: Request) => {
  const download = new URL(request.url).searchParams.get("download") === "1";

  const stored = await loadStoredResumePdf();
  if (stored) {
    return new Response(stored, { headers: pdfHeaders(download) });
  }

  const profile = await getProfile();
  const source = profile.resumeFileUrl?.trim() ?? "";

  if (source.startsWith("https://")) {
    const remote = await fetchRemotePdf(source);
    if (remote) {
      return new Response(remote, { headers: pdfHeaders(download) });
    }
  }

  const bundled = await loadBundledResumePdf();
  if (bundled) {
    return new Response(bundled, { headers: pdfHeaders(download) });
  }

  throw new ApiError(404, "No resume uploaded");
});
