"use client";

import { ChevronDownIcon, ExternalLinkIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, externalHref } from "@/lib/utils";
import type { ProductData } from "@/types/content";

export function ProductsMenu({
  products,
  className,
}: {
  products: ProductData[];
  className?: string;
}) {
  const live = products.filter((product) => product.published && product.url);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground outline-none transition-colors hover:text-foreground data-[state=open]:text-cyan-brand",
          className,
        )}
      >
        Products
        <ChevronDownIcon className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-56">
        <DropdownMenuLabel>Shipped products</DropdownMenuLabel>
        {live.length === 0 ? (
          <p className="px-2.5 py-2 text-sm text-muted-foreground">
            Links are added from the dashboard.
          </p>
        ) : (
          live.map((product) => (
            <DropdownMenuItem key={product._id} asChild>
              <a
                href={externalHref(product.url) ?? product.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{product.name}</span>
                  {product.description && (
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {product.description}
                    </span>
                  )}
                </span>
                <ExternalLinkIcon className="text-muted-foreground" />
              </a>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
