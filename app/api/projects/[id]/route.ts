import {
  assertObjectId,
  jsonOk,
  notFound,
  parseBody,
  route,
} from "@/lib/api";
import { serialize } from "@/lib/db";
import { Project } from "@/lib/models";
import { projectUpdateSchema } from "@/lib/validators";

type Context = { params: Promise<{ id: string }> };

export const GET = route(async (_request: Request, { params }: Context) => {
  const { id } = await params;
  const project = await Project.findById(assertObjectId(id)).lean();
  if (!project) throw notFound("Project");
  return jsonOk(serialize(project));
});

export const PATCH = route(async (request: Request, { params }: Context) => {
  const { id } = await params;
  const payload = await parseBody(request, projectUpdateSchema);

  const updated = await Project.findByIdAndUpdate(
    assertObjectId(id),
    { $set: payload },
    // The old backend trusted req.body wholesale; this runs the schema on write.
    { new: true, runValidators: true },
  ).lean();

  if (!updated) throw notFound("Project");
  return jsonOk(serialize(updated));
}, { admin: true });

export const DELETE = route(async (_request: Request, { params }: Context) => {
  const { id } = await params;
  const deleted = await Project.findByIdAndDelete(assertObjectId(id)).lean();
  if (!deleted) throw notFound("Project");

  return jsonOk({ ok: true, id });
}, { admin: true });
