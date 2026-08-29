"use client";

import { useCallback, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, LoaderIcon } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

import { Button } from "@/components/ui/button";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function ResumeViewer({ fileUrl }: { fileUrl: string }) {
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [width, setWidth] = useState(720);
  const [failed, setFailed] = useState(false);

  const measure = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    const update = () => setWidth(Math.min(node.clientWidth, 860));
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (failed) {
    return (
      <div className="panel grid min-h-80 place-items-center p-8 text-center">
        <p className="text-sm text-muted-foreground">
          The PDF could not be previewed in this browser.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <a href={fileUrl} target="_blank" rel="noreferrer">
            Open the file
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        ref={measure}
        className="overflow-hidden rounded-2xl border border-border bg-panel-strong/40 shadow-[0_20px_60px_-28px_rgba(15,20,40,0.45)]"
      >
        <Document
          file={fileUrl}
          loading={
            <div className="grid min-h-80 place-items-center text-muted-foreground">
              <LoaderIcon className="size-5 animate-spin" />
            </div>
          }
          onLoadSuccess={({ numPages }) => {
            setPages(numPages);
            setPage(1);
          }}
          onLoadError={() => setFailed(true)}
        >
          <Page
            pageNumber={page}
            width={width}
            renderAnnotationLayer
            renderTextLayer
          />
        </Document>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            <ChevronLeftIcon />
            Previous
          </Button>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
            Page {page} of {pages}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= pages}
            onClick={() => setPage((current) => Math.min(pages, current + 1))}
          >
            Next
            <ChevronRightIcon />
          </Button>
        </div>
      )}
    </div>
  );
}
