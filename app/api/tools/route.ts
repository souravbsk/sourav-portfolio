import { NextResponse } from "next/server";

import { jsonOk, parseBody, route } from "@/lib/api";
import { isAdmin } from "@/lib/auth";
import { serialize } from "@/lib/db";
import { Tool } from "@/lib/models";
import { toolCreateSchema } from "@/lib/validators";

export const GET = route(async (request: Request) => {
  const url = new URL(request.url);
  const wantsDrafts = url.searchParams.get("drafts") === "true";

  const query: Record<string, unknown> = {};
  if (!wantsDrafts || !(await isAdmin())) query.published = true;

  const tools = await Tool.find(query).sort({ order: 1, _id: -1 }).lean();
  return jsonOk(serialize(tools));
});

export const POST = route(async (request: Request) => {
  const payload = await parseBody(request, toolCreateSchema);
  const created = await Tool.create(payload);

  return NextResponse.json(serialize(created.toObject()), { status: 201 });
}, { admin: true });
