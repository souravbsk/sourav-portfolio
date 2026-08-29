import { NextResponse } from "next/server";

import { jsonOk, parseBody, route } from "@/lib/api";
import { serialize } from "@/lib/db";
import { Skill } from "@/lib/models";
import { skillCreateSchema } from "@/lib/validators";

export const GET = route(async () => {
  const skills = await Skill.find().sort({ order: 1, _id: 1 }).lean();
  return jsonOk(serialize(skills));
});

export const POST = route(async (request: Request) => {
  const payload = await parseBody(request, skillCreateSchema);
  const created = await Skill.create(payload);

  return NextResponse.json(serialize(created.toObject()), { status: 201 });
}, { admin: true });
