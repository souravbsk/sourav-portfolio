import { ApiError, jsonOk, route } from "@/lib/api";
import {
  ALLOWED_UPLOAD_TYPES,
  MAX_UPLOAD_BYTES,
  uploadBuffer,
} from "@/lib/cloudinary";

/**
 * Admin-only, multipart, server-side upload. The response contains the
 * resulting URL and nothing else — the Cloudinary key and secret are read from
 * server-only env vars and never cross the network boundary.
 */
export const POST = route(async (request: Request) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    throw new ApiError(400, "Expected multipart/form-data");
  }

  const entries = form.getAll("file").filter((entry): entry is File => entry instanceof File);

  if (entries.length === 0) {
    throw new ApiError(400, "No file provided");
  }

  if (entries.length > 8) {
    throw new ApiError(400, "Upload at most 8 images at a time");
  }

  const folder = (form.get("folder") as string | null)?.trim();

  const uploads = [];

  for (const file of entries) {
    if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) {
      throw new ApiError(415, `Unsupported file type: ${file.type || "unknown"}`);
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      throw new ApiError(
        413,
        `${file.name} is larger than ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}MB`,
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadBuffer(buffer, folder ? { folder } : {});
    uploads.push(result);
  }

  return jsonOk({
    url: uploads[0]!.url,
    urls: uploads.map((upload) => upload.url),
    uploads,
  });
}, { admin: true });
