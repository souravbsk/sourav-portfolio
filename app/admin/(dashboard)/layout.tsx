import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { auth, signOut } from "@/lib/auth";
import { getAdminCounts } from "@/lib/content";

/**
 * The authorisation boundary for the dashboard. `/admin/login` deliberately
 * sits outside this route group so signing in is never gated by the gate.
 *
 * `proxy.ts` also redirects unauthenticated visitors, but only by looking for a
 * cookie; this is the check that actually validates the session.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/admin/login");
  }

  const counts = await getAdminCounts();

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <AdminShell
      email={session.user?.email ?? "admin"}
      unread={counts.unread}
      signOutAction={handleSignOut}
    >
      {children}
    </AdminShell>
  );
}
