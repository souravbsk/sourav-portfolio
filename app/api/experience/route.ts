import { NextResponse } from "next/server";

import { jsonOk, parseBody, route } from "@/lib/api";
import { serialize } from "@/lib/db";
import { Experience } from "@/lib/models";
import { experienceCreateSchema } from "@/lib/validators";

export const GET = route(async () => {
  const items = await Experience.find().sort({ order: 1, _id: 1 }).lean();
  return jsonOk(serialize(items));
});

export const POST = route(async (request: Request) => {
  const payload = await parseBody(request, experienceCreateSchema);
  const created = await Experience.create(payload);

  return NextResponse.json(serialize(created.toObject()), { status: 201 });
}, { admin: true });
