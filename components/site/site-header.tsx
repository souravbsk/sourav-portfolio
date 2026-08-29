"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { MenuIcon, SearchIcon } from "lucide-react";

import { CommandPalette } from "@/components/site/command-palette";
import { ProductsMenu } from "@/components/site/products-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn, externalHref } from "@/lib/utils";
import type { BlogPostData, ProductData, ProjectData } from "@/types/content";

const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/blog", label: "Writing" },
  { href: "/resume", label: "Resume" },
];

export function SiteHeader({
  projects,
  posts,
  products,
}: {
  projects: ProjectData[];
  posts: BlogPostData[];
  products: ProductData[];
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
          scrolled
            ? "border-b border-border bg-background/80 backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <div className="container-page flex h-14 items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-md font-mono text-sm tracking-tight"
          >
            <span className="text-muted-foreground transition-colors group-hover:text-cyan-brand">
              &lt;
            </span>
            <span className="font-display text-base font-semibold">
              Sourav Basak
            </span>
            <span className="text-muted-foreground transition-colors group-hover:text-violet-brand">
              /&gt;
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV_LINKS.map((link) => {
              const active =
                link.href.startsWith("/#")
                  ? false
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors",
                    active
                      ? "text-cyan-brand"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <ProductsMenu products={products} />
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Open search"
              className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-[0.6875rem] text-muted-foreground transition-colors hover:border-cyan-brand/50 hover:text-foreground sm:flex"
            >
              <SearchIcon className="size-3.5" />
              <span>Search</span>
              <kbd className="rounded border border-border px-1 py-0.5 text-[0.5625rem]">
                ⌘K
              </kbd>
            </button>

            <ThemeToggle />

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="lg:hidden"
                  aria-label="Open menu"
                >
                  <MenuIcon />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="gap-6">
                <SheetTitle className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
                  Navigate
                </SheetTitle>
                <nav className="flex flex-col gap-1" aria-label="Mobile">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-3 py-3 font-display text-lg transition-colors hover:bg-panel-strong"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <p className="mt-3 px-3 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                    Products
                  </p>
                  {products.filter((product) => product.published && product.url)
                    .length === 0 ? (
                    <p className="px-3 py-2 text-sm text-muted-foreground">
                      Links are added from the dashboard.
                    </p>
                  ) : (
                    products
                      .filter((product) => product.published && product.url)
                      .map((product) => (
                        <a
                          key={product._id}
                          href={externalHref(product.url) ?? product.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          onClick={() => setMobileOpen(false)}
                          className="rounded-lg px-3 py-3 font-display text-lg transition-colors hover:bg-panel-strong"
                        >
                          {product.name}
                        </a>
                      ))
                  )}
                </nav>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileOpen(false);
                    setPaletteOpen(true);
                  }}
                  className="mt-auto"
                >
                  <SearchIcon />
                  Search everything
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Reading position for the whole page, doubling as the header's only
            decorative element so the bar itself can stay slim. */}
        <motion.div
          aria-hidden
          style={{ scaleX: progress }}
          className="h-px origin-left bg-[linear-gradient(90deg,var(--brand-cyan),var(--brand-violet))]"
        />
      </header>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        projects={projects}
        posts={posts}
        products={products}
        sections={NAV_LINKS}
      />
    </>
  );
}
