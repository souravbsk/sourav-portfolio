import {
  assertObjectId,
  jsonOk,
  notFound,
  parseBody,
  route,
} from "@/lib/api";
import { serialize } from "@/lib/db";
import { Experience } from "@/lib/models";
import { experienceUpdateSchema } from "@/lib/validators";

type Context = { params: Promise<{ id: string }> };

export const PATCH = route(async (request: Request, { params }: Context) => {
  const { id } = await params;
  const payload = await parseBody(request, experienceUpdateSchema);

  const updated = await Experience.findByIdAndUpdate(
    assertObjectId(id),
    { $set: payload },
    { new: true, runValidators: true },
  ).lean();

  if (!updated) throw notFound("Experience entry");
  return jsonOk(serialize(updated));
}, { admin: true });

export const DELETE = route(async (_request: Request, { params }: Context) => {
  const { id } = await params;
  const deleted = await Experience.findByIdAndDelete(assertObjectId(id)).lean();
  if (!deleted) throw notFound("Experience entry");

  return jsonOk({ ok: true, id });
}, { admin: true });
