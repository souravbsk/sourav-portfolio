import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Contact form submissions. The previous site posted straight to EmailJS from
 * the browser with the keys in the bundle; storing them server-side removes
 * that exposure and gives the admin dashboard an inbox.
 */
const messageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, default: "", trim: true, maxlength: 40 },
    subject: { type: String, default: "", trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    read: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true },
);

messageSchema.index({ createdAt: -1 });

export type MessageDoc = InferSchemaType<typeof messageSchema>;

export const Message: Model<MessageDoc> =
  (models.Message as Model<MessageDoc>) ||
  model<MessageDoc>("Message", messageSchema, "Messages");
