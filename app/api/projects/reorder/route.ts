import { jsonOk, parseBody, route } from "@/lib/api";
import { Project } from "@/lib/models";
import { projectReorderSchema } from "@/lib/validators";

export const PATCH = route(async (request: Request) => {
  const { ids } = await parseBody(request, projectReorderSchema);

  await Promise.all(
    ids.map((id, index) =>
      Project.findByIdAndUpdate(id, { $set: { order: index } }),
    ),
  );

  return jsonOk({ ok: true, count: ids.length });
}, { admin: true });
