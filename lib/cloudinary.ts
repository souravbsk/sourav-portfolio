import { v2 as cloudinary } from "cloudinary";

/**
 * Configured from server-only environment variables. None of these carry a
 * NEXT_PUBLIC_ prefix, so Next.js will not inline them into any client bundle —
 * this is the fix for the imgbb key that the previous site shipped to browsers.
 */
export function getCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

export const UPLOAD_FOLDER = process.env.CLOUDINARY_FOLDER || "sourav-portfolio";

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export const ALLOWED_UPLOAD_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
];

export async function uploadBuffer(
  buffer: Buffer,
  { folder = UPLOAD_FOLDER }: { folder?: string } = {},
): Promise<{ url: string; publicId: string; width?: number; height?: number }> {
  const client = getCloudinary();

  return new Promise((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload failed"));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        });
      },
    );

    stream.end(buffer);
  });
}
