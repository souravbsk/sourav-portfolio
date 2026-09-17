import { revalidatePath } from "next/cache";

import { ApiError, jsonOk, route } from "@/lib/api";
import { MAX_RESUME_BYTES, uploadResumeBuffer } from "@/lib/cloudinary";
import { serialize } from "@/lib/db";
import { Profile } from "@/lib/models";

function isPdf(file: File) {
  return (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

/**
 * Admin-only PDF upload. Always writes to the same Cloudinary public id and
 * the same Profile.resumeFileUrl field, so a new file replaces the previous
 * one instead of accumulating history.
 */
export const POST = route(async (request: Request) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    throw new ApiError(400, "Expected multipart/form-data");
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new ApiError(400, "No PDF provided");
  }

  if (!isPdf(file)) {
    throw new ApiError(415, "Resume must be a PDF");
  }

  if (file.size > MAX_RESUME_BYTES) {
    throw new ApiError(
      413,
      `Resume is larger than ${Math.round(MAX_RESUME_BYTES / 1024 / 1024)}MB`,
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { url } = await uploadResumeBuffer(buffer);

  const updated = await Profile.findOneAndUpdate(
    { key: "primary" },
    { $set: { resumeFileUrl: url } },
    { new: true, runValidators: true },
  ).lean();

  if (!updated) {
    throw new ApiError(404, "Save your profile first, then upload a resume.");
  }

  revalidatePath("/");
  revalidatePath("/resume");

  return jsonOk({
    url,
    profile: serialize(updated),
  });
}, { admin: true });
