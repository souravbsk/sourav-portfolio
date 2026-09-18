/** Same-origin PDF served from /api/resume/file. */
export const RESUME_FILE_PATH = "/api/resume/file";

export function resumeViewHref(fileUrl?: string) {
  const stored = fileUrl?.match(/[?&]t=(\d+)/)?.[1];
  const version = stored || "latest";
  return `${RESUME_FILE_PATH}?v=${version}`;
}

export function resumeDownloadHref(fileUrl?: string) {
  return `${resumeViewHref(fileUrl)}&download=1`;
}
