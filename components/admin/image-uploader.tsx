"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlusIcon, LoaderIcon, TrashIcon, UploadIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { uploadImages } from "@/lib/admin-client";
import { cn } from "@/lib/utils";

/**
 * Posts to /api/upload, which signs and performs the Cloudinary upload
 * server-side and returns only the resulting URL. No credential of any kind
 * reaches this component — the fix for the previous site's inlined imgbb key.
 */
export function ImageUploader({
  value,
  onChange,
  multiple = false,
  label = "Image",
  id,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  label?: string;
  id?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList).slice(0, multiple ? 8 : 1);

    setUploading(true);
    try {
      const result = await uploadImages(files);
      onChange(multiple ? [...value, ...result.urls] : [result.urls[0]!]);
      toast.success(
        files.length > 1 ? `${files.length} images uploaded` : "Image uploaded",
      );
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
          void handleFiles(event.dataTransfer.files);
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
          accept="image/*"
          multiple={multiple}
          onChange={(event) => void handleFiles(event.target.files)}
          className="sr-only"
        />

        <div className="flex flex-col items-center gap-2">
          <span className="grid size-10 place-items-center rounded-full bg-panel-strong text-muted-foreground">
            {uploading ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <ImagePlusIcon className="size-4" />
            )}
          </span>

          <p className="text-sm text-muted-foreground">
            Drop {multiple ? "images" : "an image"} here, or
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            <UploadIcon />
            {uploading ? "Uploading…" : `Choose ${label.toLowerCase()}`}
          </Button>

          <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground/70">
            PNG, JPG, WebP or SVG · max 8MB
          </p>
        </div>
      </div>

      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2.5">
          {value.map((url, index) => (
            <li key={`${url}-${index}`} className="relative">
              <div className="relative size-20 overflow-hidden rounded-lg border border-border bg-panel-strong">
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover object-top"
                />
              </div>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                aria-label="Remove image"
                className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full border border-border bg-background text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
              >
                <TrashIcon className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
