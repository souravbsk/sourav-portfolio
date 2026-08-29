import { z } from "zod";

import {
  assertObjectId,
  jsonOk,
  notFound,
  parseBody,
  route,
} from "@/lib/api";
import { serialize } from "@/lib/db";
import { Message } from "@/lib/models";

type Context = { params: Promise<{ id: string }> };

const messagePatchSchema = z.object({
  read: z.boolean().optional(),
  archived: z.boolean().optional(),
});

export const PATCH = route(async (request: Request, { params }: Context) => {
  const { id } = await params;
  const payload = await parseBody(request, messagePatchSchema);

  const updated = await Message.findByIdAndUpdate(
    assertObjectId(id),
    { $set: payload },
    { new: true, runValidators: true },
  ).lean();

  if (!updated) throw notFound("Message");
  return jsonOk(serialize(updated));
}, { admin: true });

export const DELETE = route(async (_request: Request, { params }: Context) => {
  const { id } = await params;
  const deleted = await Message.findByIdAndDelete(assertObjectId(id)).lean();
  if (!deleted) throw notFound("Message");

  return jsonOk({ ok: true, id });
}, { admin: true });
