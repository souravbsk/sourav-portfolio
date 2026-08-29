import { NextResponse } from "next/server";

import { jsonOk, parseBody, route } from "@/lib/api";
import { isAdmin } from "@/lib/auth";
import { serialize } from "@/lib/db";
import { BlogPost } from "@/lib/models";
import { blogPostCreateSchema } from "@/lib/validators";

export const GET = route(async (request: Request) => {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const wantsDrafts = url.searchParams.get("drafts") === "true";

  const query: Record<string, unknown> = {};
  if (category && category !== "all") query.category = category;

  // Drafts are only ever visible to an authenticated admin.
  if (!wantsDrafts || !(await isAdmin())) query.published = true;

  const posts = await BlogPost.find(query)
    .sort({ publishedAt: -1, createdAt: -1, _id: -1 })
    .lean();

  return jsonOk(serialize(posts));
});

export const POST = route(async (request: Request) => {
  const payload = await parseBody(request, blogPostCreateSchema);

  const created = await BlogPost.create({
    ...payload,
    publishedAt: payload.published
      ? (payload.publishedAt ? new Date(payload.publishedAt) : new Date())
      : null,
  });

  return NextResponse.json(serialize(created.toObject()), { status: 201 });
}, { admin: true });
