import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/taxonomy";

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: "", trim: true, maxlength: 5000 },
    liveLink: { type: String, default: "", trim: true },
    clientLink: { type: String, default: "", trim: true },
    serverLink: { type: String, default: "", trim: true },
    skills: { type: [String], default: [] },

    // Capital "P" is deliberate: every document written by the previous version
    // of this site uses `PhotoUrl`, and renaming it would blank every image.
    PhotoUrl: { type: String, default: "" },
    // A handful of documents may predate that spelling.
    photoUrl: { type: String, default: undefined },

    projectSS: { type: [String], default: [] },
    status: {
      type: String,
      enum: PROJECT_STATUSES,
      default: "normal",
    },
    category: {
      type: String,
      enum: PROJECT_CATEGORIES,
      default: "react",
    },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    // Legacy documents have no `createdAt`; this keeps them valid on update.
    minimize: false,
  },
);

projectSchema.index({ category: 1, order: 1 });

export type ProjectDoc = InferSchemaType<typeof projectSchema>;

// Third argument pins the collection to the existing `Projects` name, which
// Mongoose would otherwise pluralise to `projects` and silently read as empty.
export const Project: Model<ProjectDoc> =
  (models.Project as Model<ProjectDoc>) ||
  model<ProjectDoc>("Project", projectSchema, "Projects");
