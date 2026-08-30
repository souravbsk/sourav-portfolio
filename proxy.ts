import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js 16 renamed `middleware.ts` to `proxy.ts` and the exported function
 * from `middleware` to `proxy`. A leftover `middleware.ts` is silently ignored
 * at build time, so the rename matters.
 *
 * This is NOT the authorisation boundary. It only checks whether a session
 * cookie is present so a logged-out visitor is redirected immediately instead
 * of rendering an admin shell first. The real checks are the `auth()` call in
 * `app/admin/(dashboard)/layout.tsx` and `requireAdmin()` inside every mutating
 * route handler — a forged cookie gets past this file and fails both of those.
 */
const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "__Host-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Never bounce the login page away. A leftover or invalid session cookie
  // used to send /admin/login → /admin, while the dashboard sent /admin →
  // /admin/login, which is an infinite 307 loop.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const hasSessionCookie = SESSION_COOKIES.some((name) =>
    Boolean(request.cookies.get(name)?.value),
  );

  if (!hasSessionCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
