import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Lightweight public links for the header Products dropdown. These are not
 * portfolio case studies — just a name and a URL the admin can change.
 */
const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 140 },
    url: { type: String, required: true, trim: true, maxlength: 600 },
    description: { type: String, default: "", trim: true, maxlength: 200 },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.index({ published: 1, order: 1 });

export type ProductDoc = InferSchemaType<typeof productSchema>;

export const Product: Model<ProductDoc> =
  (models.Product as Model<ProductDoc>) ||
  model<ProductDoc>("Product", productSchema, "ProductsLinks");
