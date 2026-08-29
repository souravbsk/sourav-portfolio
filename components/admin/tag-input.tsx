"use client";

import { useRef, useState } from "react";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Replaces react-tag-input-component. Enter or comma commits a tag, Backspace
 * on an empty field removes the last one, and each chip has its own focusable
 * remove button so the whole control is keyboard-operable.
 */
export function TagInput({
  value,
  onChange,
  id,
  placeholder = "Type and press Enter",
  max = 30,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  id?: string;
  placeholder?: string;
  max?: number;
}) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function commit(raw: string) {
    const tag = raw.trim();
    if (!tag) return;
    if (value.length >= max) return;
    if (value.some((existing) => existing.toLowerCase() === tag.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...value, tag]);
    setDraft("");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit(draft);
      return;
    }

    if (event.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={cn(
        "flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background/40 p-2 transition-[border-color,box-shadow]",
        "focus-within:border-cyan-brand focus-within:ring-2 focus-within:ring-ring/40",
      )}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 rounded-full border border-cyan-brand/30 bg-cyan-brand/10 py-0.5 pl-2.5 pr-1 font-mono text-[0.6875rem] text-cyan-brand"
        >
          {tag}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onChange(value.filter((item) => item !== tag));
            }}
            aria-label={`Remove ${tag}`}
            className="grid size-4 place-items-center rounded-full transition-colors hover:bg-cyan-brand/20"
          >
            <XIcon className="size-3" />
          </button>
        </span>
      ))}

      <input
        ref={inputRef}
        id={id}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => commit(draft)}
        placeholder={value.length === 0 ? placeholder : ""}
        className="min-w-24 flex-1 bg-transparent px-1.5 text-sm outline-none placeholder:text-muted-foreground/70"
      />
    </div>
  );
}
