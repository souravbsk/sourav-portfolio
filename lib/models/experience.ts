import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

import { EXPERIENCE_ICONS } from "@/lib/taxonomy";

const experienceSchema = new Schema(
  {
    role: { type: String, required: true, trim: true, maxlength: 140 },
    company: { type: String, required: true, trim: true, maxlength: 140 },
    companyUrl: { type: String, default: "", trim: true },
    // Free text rather than dates: the source data reads "2022 - present" and
    // "Jun 2023 - Aug 2023", and inventing exact days would be inaccurate.
    period: { type: String, default: "", trim: true, maxlength: 80 },
    description: { type: String, default: "", trim: true, maxlength: 2000 },
    highlights: { type: [String], default: [] },
    icon: { type: String, enum: EXPERIENCE_ICONS, default: "briefcase" },
    current: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

experienceSchema.index({ order: 1 });

export type ExperienceDoc = InferSchemaType<typeof experienceSchema>;

export const Experience: Model<ExperienceDoc> =
  (models.Experience as Model<ExperienceDoc>) ||
  model<ExperienceDoc>("Experience", experienceSchema, "Experiences");
