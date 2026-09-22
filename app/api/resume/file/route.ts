import { connectToDatabase } from "@/lib/db";
import { getProfile } from "@/lib/content";
import {
  fetchRemotePdf,
  loadBundledResumePdf,
  loadStoredResumePdf,
} from "@/lib/resume-store";

export const dynamic = "force-dynamic";

const STORE_TIMEOUT_MS = 4000;

function pdfHeaders(download: boolean) {
  return {
    "Content-Type": "application/pdf",
    "Cache-Control": "private, no-store, max-age=0, must-revalidate",
    "Content-Disposition": `${download ? "attachment" : "inline"}; filename="sourav-basak-resume.pdf"`,
  };
}

function pdfResponse(data: Buffer, download: boolean) {
  return new Response(Uint8Array.from(data), { headers: pdfHeaders(download) });
}

function withTimeout<T>(promise: Promise<T>, ms: number) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("resume store timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

async function loadUploadedResume() {
  await connectToDatabase();
  const stored = await loadStoredResumePdf();
  if (stored) return stored;

  const profile = await getProfile();
  const source = profile.resumeFileUrl?.trim() ?? "";
  if (source.startsWith("https://")) {
    return fetchRemotePdf(source);
  }
  return null;
}

/**
 * Public PDF stream for /resume. Mongo first, then Cloudinary, then the
 * bundled file. If the serverless filesystem cannot read /public, redirect
 * to the static URL instead of fetching this origin (that deadlocks in dev).
 */
export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const download = searchParams.get("download") === "1";

  try {
    const stored = await withTimeout(loadUploadedResume(), STORE_TIMEOUT_MS);
    if (stored) {
      return pdfResponse(stored, download);
    }
  } catch (error) {
    console.warn(
      "[resume] stored resume unavailable:",
      error instanceof Error ? error.message : error,
    );
  }

  const bundled = await loadBundledResumePdf();
  if (bundled) {
    return pdfResponse(bundled, download);
  }

  return Response.redirect(`${origin}/resume/sourav-basak-resume.pdf`, 302);
}
