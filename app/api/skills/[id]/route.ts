import {
  assertObjectId,
  jsonOk,
  notFound,
  parseBody,
  route,
} from "@/lib/api";
import { serialize } from "@/lib/db";
import { Skill } from "@/lib/models";
import { skillUpdateSchema } from "@/lib/validators";

type Context = { params: Promise<{ id: string }> };

export const PATCH = route(async (request: Request, { params }: Context) => {
  const { id } = await params;
  const payload = await parseBody(request, skillUpdateSchema);

  const updated = await Skill.findByIdAndUpdate(
    assertObjectId(id),
    { $set: payload },
    { new: true, runValidators: true },
  ).lean();

  if (!updated) throw notFound("Skill");
  return jsonOk(serialize(updated));
}, { admin: true });

export const DELETE = route(async (_request: Request, { params }: Context) => {
  const { id } = await params;
  const deleted = await Skill.findByIdAndDelete(assertObjectId(id)).lean();
  if (!deleted) throw notFound("Skill");

  return jsonOk({ ok: true, id });
}, { admin: true });
