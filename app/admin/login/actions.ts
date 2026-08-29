"use server";

import { headers } from "next/headers";
import { AuthError } from "next-auth";

import { signIn } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";

export type LoginState = { error?: string };

export async function login(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  // Only allow same-origin destinations so `?next=` cannot be used as an open
  // redirect to somewhere off-site after a successful sign-in.
  const redirectTo = next.startsWith("/") && !next.startsWith("//") ? next : "/admin";

  try {
    const headerList = await headers();
    const ip =
      headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headerList.get("x-real-ip") ??
      "unknown";

    rateLimit(`login:${ip}`, { limit: 8, windowMs: 10 * 60 * 1000 });

    await signIn("credentials", { email, password, redirectTo });

    return {};
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message };
    }

    if (error instanceof AuthError) {
      return { error: "Those credentials did not work." };
    }

    // A successful sign-in throws NEXT_REDIRECT, which must propagate.
    throw error;
  }
}
