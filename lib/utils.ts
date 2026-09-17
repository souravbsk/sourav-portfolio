import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatDate(value?: string | Date | null) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Rough reading time, at the ~200 wpm figure most reading-time widgets use. */
export function readingTime(markdown: string) {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function truncate(input: string, max: number) {
  if (input.length <= max) return input;
  return `${input.slice(0, max).trimEnd()}…`;
}

/**
 * Normalises a URL typed into the admin forms. Bare domains are a common
 * paste, and an href without a scheme resolves as a relative path.
 */
export function externalHref(url?: string | null) {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (/^(https?:)?\/\//i.test(trimmed) || /^(mailto|tel):/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function stripHtml(html: string) {
  return html
    .replace(/<\/(p|li|h[1-6]|div)>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Same-page section jump. Aligns the heading — not the section's empty
 * padding — just under the sticky header so the previous block is gone.
 */
export function scrollToHash(hash: string) {
  const id = hash.replace(/^[#/]+/, "");
  const node = document.getElementById(id);
  if (!node) return false;

  const header = document.querySelector("header");
  const navOffset = (header?.getBoundingClientRect().bottom ?? 56) + 12;
  const paddingTop = Number.parseFloat(getComputedStyle(node).paddingTop) || 0;
  const top = Math.max(
    0,
    window.scrollY + node.getBoundingClientRect().top + paddingTop - navOffset,
  );

  const html = document.documentElement;
  html.style.setProperty("scroll-behavior", "auto", "important");
  window.scrollTo({ top, behavior: "instant" });
  html.style.removeProperty("scroll-behavior");
  return true;
}
