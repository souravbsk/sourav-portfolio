"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileTextIcon, LoaderIcon, UploadIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { uploadResume } from "@/lib/admin-client";
import { cn } from "@/lib/utils";

function fileNameFromUrl(url: string) {
  if (!url) return "";
  try {
    const path = url.split("?")[0] ?? url;
    return decodeURIComponent(path.split("/").pop() || "resume.pdf");
  } catch {
    return "resume.pdf";
  }
}

export function ResumeUploader({
  value,
  onChange,
  id = "resumeFile",
}: {
  value: string;
  onChange: (url: string) => void;
  id?: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function handleFile(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadResume(file);
      onChange(result.url);
      toast.success("Latest resume saved — previous file replaced");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFile(event.dataTransfer.files);
        }}
        className={cn(
          "rounded-xl border border-dashed p-5 text-center transition-colors",
          dragging
            ? "border-cyan-brand bg-cyan-brand/5"
            : "border-border bg-background/30",
        )}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="application/pdf,.pdf"
          onChange={(event) => void handleFile(event.target.files)}
          className="sr-only"
        />

        <div className="flex flex-col items-center gap-2">
          <span className="grid size-10 place-items-center rounded-full bg-panel-strong text-muted-foreground">
            {uploading ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <FileTextIcon className="size-4" />
            )}
          </span>

          <p className="text-sm text-muted-foreground">
            Drop a PDF here to replace the live resume
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            <UploadIcon />
            {uploading ? "Uploading…" : value ? "Replace PDF" : "Upload PDF"}
          </Button>

          <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground/70">
            PDF only · max 12MB · latest file overwrites the previous one
          </p>
        </div>
      </div>

      {value && (
        <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <FileTextIcon className="size-3.5 shrink-0" />
          <a
            href={value}
            target="_blank"
            rel="noreferrer noopener"
            className="truncate text-cyan-brand hover:underline"
          >
            {fileNameFromUrl(value)}
          </a>
        </p>
      )}
    </div>
  );
}
