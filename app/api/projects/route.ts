import { NextResponse } from "next/server";

import { jsonOk, parseBody, route } from "@/lib/api";
import { projectFilter } from "@/lib/content";
import { serialize } from "@/lib/db";
import { Project } from "@/lib/models";
import { projectCreateSchema } from "@/lib/validators";

export const GET = route(async (request: Request) => {
  const url = new URL(request.url);
  // `tab` is the new name; `tabValue` is what the previous front end sent.
  const tab = url.searchParams.get("tab") ?? url.searchParams.get("tabValue");

  const projects = await Project.find(projectFilter(tab))
    .sort({ order: 1, createdAt: -1, _id: -1 })
    .lean();

  return jsonOk(serialize(projects));
});

export const POST = route(async (request: Request) => {
  const payload = await parseBody(request, projectCreateSchema);

  // New work goes to the front unless the admin set an explicit order.
  if (payload.order === 0) {
    const front = await Project.findOne().sort({ order: 1 }).select("order").lean();
    payload.order = (typeof front?.order === "number" ? front.order : 0) - 1;
  }

  const created = await Project.create(payload);

  return NextResponse.json(serialize(created.toObject()), { status: 201 });
}, { admin: true });
