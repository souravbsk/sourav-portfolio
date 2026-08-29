import { NextResponse } from "next/server";

import { parseBody, route } from "@/lib/api";
import { serialize } from "@/lib/db";
import { Message } from "@/lib/models";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validators";

/**
 * The only public write endpoint on the site. It is rate limited per IP and
 * carries a honeypot field, and it stores the message rather than forwarding
 * it through a browser-side email service with embedded keys.
 */
export const POST = route(async (request: Request) => {
  rateLimit(`contact:${clientIp(request)}`, {
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });

  const { honeypot, ...payload } = await parseBody(request, contactSchema);

  // A filled honeypot is a bot. Return success so it does not retry.
  if (honeypot) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const created = await Message.create(payload);

  return NextResponse.json(
    { ok: true, id: serialize(created.toObject())._id },
    { status: 201 },
  );
});
