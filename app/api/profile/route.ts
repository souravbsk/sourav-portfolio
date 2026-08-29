import { jsonOk, parseBody, route } from "@/lib/api";
import { getProfile } from "@/lib/content";
import { serialize } from "@/lib/db";
import { Profile } from "@/lib/models";
import { profileUpdateSchema } from "@/lib/validators";

export const GET = route(async () => {
  return jsonOk(await getProfile());
});

export const PATCH = route(async (request: Request) => {
  const payload = await parseBody(request, profileUpdateSchema);

  const updated = await Profile.findOneAndUpdate(
    { key: "primary" },
    { $set: payload },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  ).lean();

  return jsonOk(serialize(updated));
}, { admin: true });
