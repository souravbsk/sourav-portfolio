"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Replaces the Swiper + lightgallery pair the old site loaded for this. Arrow
 * keys and Escape work, focus is trapped by the dialog it renders inside, and
 * the thumbnails are a real horizontal list rather than a coverflow carousel.
 */
export function ProjectGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const count = images.length;

  const step = useCallback(
    (delta: number) => setIndex((current) => (current + delta + count) % count),
    [count],
  );

  useEffect(() => {
    if (!expanded) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "Escape") setExpanded(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded, step]);

  if (count === 0) return null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-panel-strong">
        <Image
          key={images[index]}
          src={images[index]!}
          alt={`${title} screenshot ${index + 1} of ${count}`}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="animate-in fade-in object-contain object-top duration-300"
        />

        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label="Expand screenshot"
          className="absolute inset-0 cursor-zoom-in"
        />

        {count > 1 && (
          <>
            <GalleryArrow direction="prev" onClick={() => step(-1)} />
            <GalleryArrow direction="next" onClick={() => step(1)} />
            <span className="absolute bottom-3 right-3 rounded-full bg-background/80 px-2.5 py-1 font-mono text-[0.625rem] text-muted-foreground backdrop-blur">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {images.map((image, thumbIndex) => (
            <li key={`${image}-${thumbIndex}`}>
              <button
                type="button"
                onClick={() => setIndex(thumbIndex)}
                aria-label={`Show screenshot ${thumbIndex + 1}`}
                aria-current={thumbIndex === index}
                className={cn(
                  "relative size-14 shrink-0 overflow-hidden rounded-lg border transition-all",
                  thumbIndex === index
                    ? "border-cyan-brand opacity-100"
                    : "border-border opacity-55 hover:opacity-90",
                )}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover object-top"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {expanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} screenshot, expanded`}
          className="fixed inset-0 z-[70] flex flex-col bg-background/96 backdrop-blur-lg animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
              {title} — {index + 1} / {count}
            </p>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              aria-label="Close expanded view"
              autoFocus
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-panel-strong hover:text-foreground"
            >
              <XIcon className="size-4" />
            </button>
          </div>

          <div className="relative flex-1">
            <Image
              src={images[index]!}
              alt={`${title} screenshot ${index + 1}`}
              fill
              sizes="100vw"
              className="object-contain p-4 md:p-10"
            />
            {count > 1 && (
              <>
                <GalleryArrow direction="prev" onClick={() => step(-1)} />
                <GalleryArrow direction="next" onClick={() => step(1)} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function GalleryArrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous screenshot" : "Next screenshot"}
      className={cn(
        "absolute top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/85 text-foreground backdrop-blur transition-colors hover:border-cyan-brand/60",
        direction === "prev" ? "left-3" : "right-3",
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}
