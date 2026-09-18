import { readFile } from "node:fs/promises";
import path from "node:path";

import { ResumeFile } from "@/lib/models";

const LOCAL_RESUME = path.join(
  process.cwd(),
  "public",
  "resume",
  "sourav-basak-resume.pdf",
);

export async function saveResumePdf(data: Buffer, filename = "resume.pdf") {
  await ResumeFile.findOneAndUpdate(
    { key: "primary" },
    { $set: { filename, data } },
    { upsert: true, new: true },
  );
}

export async function loadStoredResumePdf(): Promise<Buffer | null> {
  const doc = await ResumeFile.findOne({ key: "primary" }).lean();
  const buf = toPdfBuffer(doc?.data);
  return buf?.length ? buf : null;
}

function toPdfBuffer(value: unknown): Buffer | null {
  if (!value) return null;
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Uint8Array) return Buffer.from(value);
  if (typeof value === "object" && value && "buffer" in value) {
    const inner = (value as { buffer: ArrayBuffer | Uint8Array }).buffer;
    if (inner) return Buffer.from(inner);
  }
  if (
    typeof value === "object" &&
    value &&
    "data" in value &&
    Array.isArray((value as { data: unknown }).data)
  ) {
    return Buffer.from((value as { data: number[] }).data);
  }
  return null;
}

export async function loadBundledResumePdf(): Promise<Buffer | null> {
  try {
    return await readFile(LOCAL_RESUME);
  } catch {
    return null;
  }
}

export async function fetchRemotePdf(url: string): Promise<Buffer | null> {
  const candidates = cloudinaryUrlCandidates(url);

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, {
        cache: "no-store",
        redirect: "follow",
      });
      if (!response.ok) continue;
      const buf = Buffer.from(await response.arrayBuffer());
      if (buf.subarray(0, 5).toString("utf8").startsWith("%PDF")) return buf;
    } catch {
      // Try the next candidate.
    }
  }

  return null;
}

function cloudinaryUrlCandidates(url: string) {
  let clean = url;
  try {
    const parsed = new URL(url);
    parsed.search = "";
    clean = parsed.toString();
  } catch {
    clean = url.split("?")[0] ?? url;
  }

  const alts = [clean, url];
  if (clean.includes("/raw/upload/")) {
    alts.push(clean.replace("/raw/upload/", "/image/upload/"));
  }
  if (clean.includes("/image/upload/")) {
    alts.push(clean.replace("/image/upload/", "/raw/upload/"));
  }
  if (!clean.toLowerCase().endsWith(".pdf")) {
    alts.push(`${clean}.pdf`);
  }
  return [...new Set(alts)];
}
