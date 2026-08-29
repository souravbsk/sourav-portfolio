import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

import { SKILL_GROUPS } from "@/lib/taxonomy";

const skillSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },
    icon: { type: String, default: "" },
    group: { type: String, enum: SKILL_GROUPS, default: "frontend" },
    // 1-5, rendered as a compact meter rather than a fake percentage.
    level: { type: Number, min: 1, max: 5, default: 4 },
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: true },
  },
  { timestamps: true },
);

skillSchema.index({ order: 1 });

export type SkillDoc = InferSchemaType<typeof skillSchema>;

export const Skill: Model<SkillDoc> =
  (models.Skill as Model<SkillDoc>) ||
  model<SkillDoc>("Skill", skillSchema, "Skills");
