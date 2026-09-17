"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { scrollToHash } from "@/lib/utils";

/** Corrects native `#hash` landing on load, back/forward, and other-page links. */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (location.hash.length <= 1) return;

    const timer = window.setTimeout(() => {
      scrollToHash(location.hash);
    }, 80);

    function onPopState() {
      if (location.hash.length > 1) scrollToHash(location.hash);
    }

    window.addEventListener("popstate", onPopState);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("popstate", onPopState);
    };
  }, [pathname]);

  return null;
}
