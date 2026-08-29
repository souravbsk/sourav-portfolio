import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const blogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers and hyphens"],
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, "Category may only contain lowercase letters, numbers and hyphens"],
    },
    coverImage: { type: String, default: "" },
    excerpt: { type: String, default: "", trim: true, maxlength: 400 },
    content: { type: String, default: "" },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

blogPostSchema.index({ published: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1 });

export type BlogPostDoc = InferSchemaType<typeof blogPostSchema>;

export const BlogPost: Model<BlogPostDoc> =
  (models.BlogPost as Model<BlogPostDoc>) ||
  model<BlogPostDoc>("BlogPost", blogPostSchema, "BlogPosts");
