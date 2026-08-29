import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-grid grid min-h-dvh place-items-center px-6">
      <div className="text-center">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
          404
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
          <span className="text-gradient">Nothing here</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          That page does not exist, or it moved when the site was rebuilt.
        </p>
        <Button asChild variant="gradient" size="lg" className="mt-8">
          <Link href="/">
            <ArrowLeftIcon />
            Back to the portfolio
          </Link>
        </Button>
      </div>
    </div>
  );
}
