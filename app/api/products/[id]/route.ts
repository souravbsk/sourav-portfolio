import {
  assertObjectId,
  jsonOk,
  notFound,
  parseBody,
  route,
} from "@/lib/api";
import { serialize } from "@/lib/db";
import { Product } from "@/lib/models";
import { productUpdateSchema } from "@/lib/validators";

type Context = { params: Promise<{ id: string }> };

export const PATCH = route(async (request: Request, { params }: Context) => {
  const { id } = await params;
  const payload = await parseBody(request, productUpdateSchema);

  const updated = await Product.findByIdAndUpdate(
    assertObjectId(id),
    { $set: payload },
    { new: true, runValidators: true },
  ).lean();

  if (!updated) throw notFound("Product");
  return jsonOk(serialize(updated));
}, { admin: true });

export const DELETE = route(async (_request: Request, { params }: Context) => {
  const { id } = await params;
  const deleted = await Product.findByIdAndDelete(assertObjectId(id)).lean();
  if (!deleted) throw notFound("Product");

  return jsonOk({ ok: true, id });
}, { admin: true });
