import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { LoginForm } from "@/app/admin/login/login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const [session, { next }] = await Promise.all([auth(), searchParams]);

  if (session?.user?.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="bg-grid grid min-h-dvh place-items-center px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="size-3.5" />
            Back to site
          </Link>
          <ThemeToggle />
        </div>

        <div className="panel panel-glow p-7">
          <p className="eyebrow">Restricted</p>
          <h1 className="mt-2 font-display text-2xl font-semibold">
            Admin sign in
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This dashboard manages everything on the site. Only the owner
            account can sign in.
          </p>

          <div className="mt-7">
            <LoginForm next={next ?? "/admin"} />
          </div>
        </div>
      </div>
    </div>
  );
}
