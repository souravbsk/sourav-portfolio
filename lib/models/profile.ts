import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Singleton document holding every piece of copy on the landing page, the
 * resume page and the footer. Pinned with `key: "primary"` so an accidental
 * second insert is impossible.
 */
const socialSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    icon: {
      type: String,
      enum: ["github", "linkedin", "facebook", "stackoverflow", "mail", "twitter", "globe"],
      default: "globe",
    },
  },
  { _id: false },
);

const statSchema = new Schema(
  {
    value: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const profileSchema = new Schema(
  {
    key: { type: String, default: "primary", unique: true, immutable: true },

    name: { type: String, required: true, trim: true, maxlength: 120 },
    headline: { type: String, default: "", trim: true, maxlength: 220 },
    // Cycled by the hero typewriter.
    roles: { type: [String], default: [] },
    bio: { type: String, default: "", trim: true, maxlength: 4000 },
    shortBio: { type: String, default: "", trim: true, maxlength: 400 },

    avatarUrl: { type: String, default: "" },
    email: { type: String, default: "", trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    availability: { type: String, default: "", trim: true, maxlength: 120 },

    socials: { type: [socialSchema], default: [] },
    stats: { type: [statSchema], default: [] },

    resumeFileUrl: { type: String, default: "" },
    resumeSummary: { type: String, default: "", trim: true, maxlength: 2000 },
    education: {
      type: [
        {
          heading: { type: String, default: "", trim: true },
          subheading: { type: String, default: "", trim: true },
          period: { type: String, default: "", trim: true },
          _id: false,
        },
      ],
      default: [],
    },
    languages: {
      type: [
        {
          name: { type: String, default: "", trim: true },
          level: { type: String, default: "", trim: true },
          _id: false,
        },
      ],
      default: [],
    },
    courses: {
      type: [
        {
          heading: { type: String, default: "", trim: true },
          subheading: { type: String, default: "", trim: true },
          period: { type: String, default: "", trim: true },
          _id: false,
        },
      ],
      default: [],
    },

    seoTitle: { type: String, default: "", trim: true, maxlength: 70 },
    seoDescription: { type: String, default: "", trim: true, maxlength: 200 },
  },
  { timestamps: true },
);

export type ProfileDoc = InferSchemaType<typeof profileSchema>;
export type SocialLink = InferSchemaType<typeof socialSchema>;

export const Profile: Model<ProfileDoc> =
  (models.Profile as Model<ProfileDoc>) ||
  model<ProfileDoc>("Profile", profileSchema, "Profile");
