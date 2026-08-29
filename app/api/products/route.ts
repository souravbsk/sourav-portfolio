import { NextResponse } from "next/server";

import { jsonOk, parseBody, route } from "@/lib/api";
import { isAdmin } from "@/lib/auth";
import { serialize } from "@/lib/db";
import { Product } from "@/lib/models";
import { productCreateSchema } from "@/lib/validators";

export const GET = route(async (request: Request) => {
  const url = new URL(request.url);
  const wantsDrafts = url.searchParams.get("drafts") === "true";

  const query: Record<string, unknown> = {};
  if (!wantsDrafts || !(await isAdmin())) query.published = true;

  const products = await Product.find(query).sort({ order: 1, _id: -1 }).lean();
  return jsonOk(serialize(products));
});

export const POST = route(async (request: Request) => {
  const payload = await parseBody(request, productCreateSchema);
  const created = await Product.create(payload);

  return NextResponse.json(serialize(created.toObject()), { status: 201 });
}, { admin: true });
