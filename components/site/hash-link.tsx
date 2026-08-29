"use client";

import type { ComponentProps } from "react";

import { scrollToHash } from "@/lib/utils";

/**
 * In-page section link. Lives in a client component so Server Components
 * (Hero) can use it without passing an `onClick` across the boundary.
 */
export function HashLink({
  href,
  onNavigate,
  ...props
}: ComponentProps<"a"> & { href: string; onNavigate?: () => void }) {
  return (
    <a
      href={href}
      {...props}
      onClick={(event) => {
        const hashIndex = href.indexOf("#");
        if (hashIndex === -1) return;

        const path = href.slice(0, hashIndex) || "/";
        const here = window.location.pathname || "/";
        if (path !== "/" && path !== here) return;
        if (path === "/" && here !== "/") return;

        event.preventDefault();
        const hash = href.slice(hashIndex);
        if (scrollToHash(hash)) {
          window.history.pushState(null, "", path === "/" ? `/${hash}` : href);
        }
        onNavigate?.();
      }}
    />
  );
}
