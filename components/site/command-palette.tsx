"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  CompassIcon,
  FileTextIcon,
  FolderIcon,
  MoonIcon,
  PackageIcon,
  SunIcon,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { truncate } from "@/lib/utils";
import type { BlogPostData, ProductData, ProjectData } from "@/types/content";

export function CommandPalette({
  open,
  onOpenChange,
  projects,
  posts,
  products = [],
  sections,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: ProjectData[];
  posts: BlogPostData[];
  products?: ProductData[];
  sections: { href: string; label: string }[];
}) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search projects, writing and sections…" />
      <CommandList>
        <CommandEmpty>Nothing matched that.</CommandEmpty>

        <CommandGroup heading="Go to">
          {sections.map((section) => (
            <CommandItem
              key={section.href}
              value={`go ${section.label}`}
              onSelect={() => go(section.href)}
            >
              <CompassIcon />
              <span>{section.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        {products.filter((product) => product.published && product.url).length >
          0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Products">
              {products
                .filter((product) => product.published && product.url)
                .map((product) => (
                  <CommandItem
                    key={product._id}
                    value={`product ${product.name} ${product.description}`}
                    onSelect={() => {
                      onOpenChange(false);
                      window.open(product.url, "_blank", "noopener,noreferrer");
                    }}
                  >
                    <PackageIcon />
                    <span className="truncate">{product.name}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
          </>
        )}

        {projects.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Projects">
              {projects.slice(0, 12).map((project) => (
                <CommandItem
                  key={project._id}
                  value={`project ${project.title} ${project.skills.join(" ")}`}
                  onSelect={() => go(`/projects?open=${project._id}`)}
                >
                  <FolderIcon />
                  <span className="truncate">{project.title}</span>
                  <CommandShortcut>{project.category}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {posts.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Writing">
              {posts.slice(0, 12).map((post) => (
                <CommandItem
                  key={post._id}
                  value={`post ${post.title} ${post.category}`}
                  onSelect={() => go(`/blog/${post.category}/${post.slug}`)}
                >
                  <FileTextIcon />
                  <span className="truncate">{truncate(post.title, 54)}</span>
                  <CommandShortcut>{post.category}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        <CommandGroup heading="Preferences">
          <CommandItem
            value="toggle theme dark light appearance"
            onSelect={() => {
              setTheme(resolvedTheme === "light" ? "dark" : "light");
              onOpenChange(false);
            }}
          >
            {resolvedTheme === "light" ? <MoonIcon /> : <SunIcon />}
            <span>
              Switch to {resolvedTheme === "light" ? "dark" : "light"} theme
            </span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
