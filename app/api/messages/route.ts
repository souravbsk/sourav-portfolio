import { jsonOk, route } from "@/lib/api";
import { serialize } from "@/lib/db";
import { Message } from "@/lib/models";

// Reading the inbox is admin-only: it contains visitors' names and emails.
export const GET = route(async (request: Request) => {
  const url = new URL(request.url);
  const includeArchived = url.searchParams.get("archived") === "true";

  const messages = await Message.find(includeArchived ? {} : { archived: false })
    .sort({ createdAt: -1 })
    .lean();

  return jsonOk(serialize(messages));
}, { admin: true });
