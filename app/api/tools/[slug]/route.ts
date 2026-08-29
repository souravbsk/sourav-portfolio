import mongoose from "mongoose";

import { jsonOk, notFound, parseBody, route } from "@/lib/api";
import { isAdmin } from "@/lib/auth";
import { serialize } from "@/lib/db";
import { Tool } from "@/lib/models";
import { toolUpdateSchema } from "@/lib/validators";

type Context = { params: Promise<{ slug: string }> };

function identify(slugOrId: string) {
  return mongoose.isValidObjectId(slugOrId)
    ? { _id: new mongoose.Types.ObjectId(slugOrId) }
    : { slug: slugOrId.toLowerCase() };
}

export const GET = route(async (_request: Request, { params }: Context) => {
  const { slug } = await params;

  const query: Record<string, unknown> = identify(slug);
  if (!(await isAdmin())) query.published = true;

  const tool = await Tool.findOne(query).lean();
  if (!tool) throw notFound("Tool");

  return jsonOk(serialize(tool));
});

export const PATCH = route(async (request: Request, { params }: Context) => {
  const { slug } = await params;
  const payload = await parseBody(request, toolUpdateSchema);

  const updated = await Tool.findOneAndUpdate(
    identify(slug),
    { $set: payload },
    { new: true, runValidators: true },
  ).lean();

  if (!updated) throw notFound("Tool");
  return jsonOk(serialize(updated));
}, { admin: true });

export const DELETE = route(async (_request: Request, { params }: Context) => {
  const { slug } = await params;
  const deleted = await Tool.findOneAndDelete(identify(slug)).lean();
  if (!deleted) throw notFound("Tool");

  return jsonOk({ ok: true });
}, { admin: true });
