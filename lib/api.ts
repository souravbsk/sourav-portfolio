import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z, type ZodType } from "zod";

import { isAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const unauthorized = () => new ApiError(401, "Authentication required");
export const notFound = (what = "Resource") => new ApiError(404, `${what} not found`);

/**
 * A missing or unreachable database is a temporary infrastructure problem, not a
 * bug in the request, so it gets a 503 rather than being folded into the generic
 * 500. The underlying message is logged but never returned, since it can contain
 * the connection string.
 */
let loggedDbFailure = false;

function dbUnavailable(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  // The cause is almost always configuration or an outage, so it is identical
  // for every request. The stack is logged once; after that one line per
  // request is enough to see it is still failing without burying real errors.
  if (loggedDbFailure) {
    console.error(`[api] database connection failed: ${message}`);
  } else {
    loggedDbFailure = true;
    console.error("[api] database connection failed:", error);
  }

  const looksLikeSrvFailure =
    /querySrv/i.test(message) || message.includes("ECONNREFUSED");

  return new ApiError(
    503,
    looksLikeSrvFailure
      ? "Could not reach MongoDB DNS. Check Atlas Network Access and try again — Windows often needs IPv4 or a public DNS for mongodb+srv."
      : "Database unavailable, try again shortly",
  );
}

/**
 * The security boundary for every mutating route. `proxy.ts` only performs an
 * optimistic redirect for UX, so this check — run inside the handler itself —
 * is what actually prevents unauthenticated writes.
 */
export async function requireAdmin() {
  if (!(await isAdmin())) throw unauthorized();
}

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function jsonError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, details: error.details ?? undefined },
      { status: error.status },
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: "Validation failed", details: z.treeifyError(error) },
      { status: 422 },
    );
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: Object.fromEntries(
          Object.entries(error.errors).map(([key, value]) => [key, value.message]),
        ),
      },
      { status: 422 },
    );
  }

  // Duplicate key on a unique index (slug collisions, in practice).
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  ) {
    return NextResponse.json(
      { error: "That slug is already taken" },
      { status: 409 },
    );
  }

  console.error("[api]", error);
  return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
}

/**
 * Wraps a route handler with authorisation, a database connection, and uniform
 * error mapping.
 *
 * Pass `{ admin: true }` for anything that writes. The check runs *before* the
 * database connection on purpose: an unauthenticated request should be rejected
 * without doing any work, and if the check ran after connecting then an
 * unreachable database would mask it behind a 503 and hide whether the route was
 * guarded at all.
 */
export function route<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response>,
  options: { admin?: boolean } = {},
) {
  return async (...args: Args): Promise<Response> => {
    try {
      if (options.admin) await requireAdmin();

      try {
        await connectToDatabase();
      } catch (error) {
        throw dbUnavailable(error);
      }

      return await handler(...args);
    } catch (error) {
      return jsonError(error);
    }
  };
}

export async function parseBody<T extends ZodType>(
  request: Request,
  schema: T,
): Promise<z.output<T>> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    throw new ApiError(400, "Request body must be valid JSON");
  }
  return schema.parse(raw);
}

export function assertObjectId(id: string) {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  return id;
}
