import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

import { TOOL_EMBED_TYPES } from "@/lib/taxonomy";

const toolSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 140 },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers and hyphens"],
    },
    description: { type: String, default: "", trim: true, maxlength: 1000 },
    icon: { type: String, default: "" },
    url: { type: String, default: "", trim: true },
    embedType: { type: String, enum: TOOL_EMBED_TYPES, default: "link" },
    tags: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);

toolSchema.index({ published: 1, order: 1 });

export type ToolDoc = InferSchemaType<typeof toolSchema>;

export const Tool: Model<ToolDoc> =
  (models.Tool as Model<ToolDoc>) ||
  model<ToolDoc>("Tool", toolSchema, "Tools");
