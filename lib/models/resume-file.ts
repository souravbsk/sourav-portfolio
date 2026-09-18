import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Latest resume PDF only. One document, overwritten on each dashboard upload,
 * so /resume never depends on Cloudinary's raw-file delivery.
 */
const resumeFileSchema = new Schema(
  {
    key: { type: String, default: "primary", unique: true, immutable: true },
    filename: { type: String, default: "resume.pdf", trim: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
);

export type ResumeFileDoc = InferSchemaType<typeof resumeFileSchema>;

export const ResumeFile: Model<ResumeFileDoc> =
  (models.ResumeFile as Model<ResumeFileDoc>) ||
  model<ResumeFileDoc>("ResumeFile", resumeFileSchema, "ResumeFile");
