import mongoose from "mongoose";

import { jsonOk, notFound, parseBody, route } from "@/lib/api";
import { isAdmin } from "@/lib/auth";
import { serialize } from "@/lib/db";
import { BlogPost } from "@/lib/models";
import { blogPostUpdateSchema } from "@/lib/validators";

type Context = { params: Promise<{ slug: string }> };

/**
 * Accepts either a slug or an ObjectId. The public site links by slug; the
 * admin editor holds an id, which stays stable even when the slug is renamed.
 */
function identify(slugOrId: string) {
  return mongoose.isValidObjectId(slugOrId)
    ? { _id: new mongoose.Types.ObjectId(slugOrId) }
    : { slug: slugOrId.toLowerCase() };
}

export const GET = route(async (_request: Request, { params }: Context) => {
  const { slug } = await params;

  const query: Record<string, unknown> = identify(slug);
  if (!(await isAdmin())) query.published = true;

  const post = await BlogPost.findOne(query).lean();
  if (!post) throw notFound("Post");

  return jsonOk(serialize(post));
});

export const PATCH = route(async (request: Request, { params }: Context) => {
  const { slug } = await params;
  const payload = await parseBody(request, blogPostUpdateSchema);

  const existing = await BlogPost.findOne(identify(slug));
  if (!existing) throw notFound("Post");

  const update: Record<string, unknown> = { ...payload };

  // Stamp publishedAt the first time a post goes live; clear it if unpublished.
  if (payload.published === true && !existing.publishedAt) {
    update.publishedAt = payload.publishedAt
      ? new Date(payload.publishedAt)
      : new Date();
  } else if (payload.published === false) {
    update.publishedAt = null;
  } else if (payload.publishedAt) {
    update.publishedAt = new Date(payload.publishedAt);
  }

  const updated = await BlogPost.findByIdAndUpdate(
    existing._id,
    { $set: update },
    { new: true, runValidators: true },
  ).lean();

  return jsonOk(serialize(updated));
}, { admin: true });

export const DELETE = route(async (_request: Request, { params }: Context) => {
  const { slug } = await params;
  const deleted = await BlogPost.findOneAndDelete(identify(slug)).lean();
  if (!deleted) throw notFound("Post");

  return jsonOk({ ok: true });
}, { admin: true });
