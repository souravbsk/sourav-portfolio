"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BriefcaseIcon,
  ExternalLinkIcon,
  FolderIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  NotebookPenIcon,
  PackageIcon,
  SparklesIcon,
  UserIcon,
  WrenchIcon,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboardIcon },
  { href: "/admin/projects", label: "Projects", icon: FolderIcon },
  { href: "/admin/products", label: "Products", icon: PackageIcon },
  { href: "/admin/blog", label: "Blog", icon: NotebookPenIcon },
  { href: "/admin/tools", label: "Tools", icon: WrenchIcon },
  { href: "/admin/skills", label: "Skills", icon: SparklesIcon },
  { href: "/admin/experience", label: "Experience", icon: BriefcaseIcon },
  { href: "/admin/profile", label: "Profile", icon: UserIcon },
  { href: "/admin/messages", label: "Messages", icon: InboxIcon },
];

export function AdminShell({
  children,
  email,
  unread,
  signOutAction,
}: {
  children: React.ReactNode;
  email: string;
  unread: number;
  signOutAction: () => Promise<void>;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <aside className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-xl lg:h-dvh lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:flex-col lg:items-stretch lg:gap-6 lg:px-4 lg:py-5">
          <Link
            href="/admin"
            className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>

          <nav className="hidden flex-1 lg:block" aria-label="Dashboard">
            <NavList unread={unread} onNavigate={() => undefined} />
          </nav>

          <div className="flex items-center gap-2 lg:flex-col lg:items-stretch">
            <div className="hidden lg:block">
              <p className="truncate font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                Signed in
              </p>
              <p className="truncate text-xs" title={email}>
                {email}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              <Button asChild variant="outline" size="icon-sm" aria-label="View site">
                <Link href="/" target="_blank">
                  <ExternalLinkIcon />
                </Link>
              </Button>

              <form action={signOutAction} className="hidden lg:block lg:flex-1">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <LogOutIcon />
                  Sign out
                </Button>
              </form>

              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className="lg:hidden"
                    aria-label="Open dashboard menu"
                  >
                    <MenuIcon />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetTitle className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Dashboard
                  </SheetTitle>
                  <NavList
                    unread={unread}
                    onNavigate={() => setMobileOpen(false)}
                  />
                  <form action={signOutAction} className="mt-auto">
                    <Button variant="outline" className="w-full">
                      <LogOutIcon />
                      Sign out
                    </Button>
                  </form>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-10">{children}</main>
    </div>
  );
}

function NavList({
  unread,
  onNavigate,
}: {
  unread: number;
  onNavigate: () => void;
}) {
  const pathname = usePathname();

  return (
    <ul className="space-y-0.5">
      {NAV.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-panel-strong text-foreground"
                  : "text-muted-foreground hover:bg-panel-strong/60 hover:text-foreground",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.href === "/admin/messages" && unread > 0 && (
                <Badge variant="cyan">{unread}</Badge>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
