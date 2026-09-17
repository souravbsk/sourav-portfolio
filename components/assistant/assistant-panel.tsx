"use client";

import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpIcon,
  RotateCcwIcon,
  SparklesIcon,
  SquareIcon,
  XIcon,
} from "lucide-react";

import { useAssistant } from "@/components/assistant/assistant-provider";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ASSISTANT_PROMPTS } from "@/lib/assistant-prompts";
import { cn } from "@/lib/utils";

export function AssistantPanel() {
  const { open, setOpen, messages, streaming, send, stop, clear } =
    useAssistant();
  const prefersReducedMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");
  const empty = messages.length === 0;

  useEffect(() => {
    if (!open) return;
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [messages, open, streaming]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 180);
    return () => window.clearTimeout(timer);
  }, [open]);

  function submitDraft() {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    void send(text);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogOverlay className="bg-black/45 backdrop-blur-md" />
        <DialogPrimitive.Content
          className={cn(
            "glass fixed inset-y-0 right-0 z-50 flex h-dvh w-full max-w-[28rem] flex-col overflow-hidden border-white/15 bg-background/70 p-0",
            "left-auto top-0 translate-x-0 translate-y-0 rounded-none shadow-[-24px_0_80px_-32px_rgb(0_0_0/0.55)]",
            "sm:rounded-l-[1.6rem]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
          )}
        >
          <header className="flex shrink-0 items-start gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--brand-cyan),var(--brand-violet))] text-primary-foreground">
              <SparklesIcon className="size-4" />
            </span>
            <div className="min-w-0 flex-1 pr-16">
              <DialogTitle className="font-display text-lg font-semibold leading-tight">
                Ask Sourav&apos;s AI
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-sm text-muted-foreground">
                Answers from this portfolio and resume.
              </DialogDescription>
            </div>
            <div className="absolute right-3 top-3 flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => {
                  clear();
                  setDraft("");
                  window.setTimeout(() => inputRef.current?.focus(), 60);
                }}
                disabled={empty && !streaming}
                aria-label="Reset chat"
                title="Reset chat"
                className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground disabled:pointer-events-none disabled:opacity-35"
              >
                <RotateCcwIcon className="size-4" />
              </button>
              <DialogClose
                aria-label="Close assistant"
                className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              >
                <XIcon className="size-4" />
              </DialogClose>
            </div>
          </header>

          <div
            ref={scrollerRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5"
          >
            {empty ? (
              <PromptList onPick={(prompt) => void send(prompt)} />
            ) : (
              <ul className="space-y-3">
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <motion.li
                      key={message.id}
                      layout={!prefersReducedMotion}
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 10 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ChatBubble
                        role={message.role}
                        content={message.content}
                        pending={
                          streaming &&
                          message.role === "assistant" &&
                          message.id === messages.at(-1)?.id
                        }
                      />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>

          <form
            className="shrink-0 border-t border-white/10 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-5"
            onSubmit={(event) => {
              event.preventDefault();
              submitDraft();
            }}
          >
            <label className="sr-only" htmlFor="assistant-input">
              Ask about Sourav
            </label>
            <div className="flex items-center gap-2 rounded-full border border-white/12 bg-background/40 py-1.5 pl-4 pr-1.5">
              <input
                id="assistant-input"
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask about work, stack, or availability…"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {streaming ? (
                <button
                  type="button"
                  onClick={stop}
                  aria-label="Stop reply"
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-white/15 text-foreground"
                >
                  <SquareIcon className="size-3 fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  aria-label="Send"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--brand-cyan),var(--brand-violet))] text-primary-foreground transition-opacity disabled:opacity-40"
                >
                  <ArrowUpIcon className="size-4" />
                </button>
              )}
            </div>
            <p className="mt-2 text-center font-mono text-[0.625rem] tracking-[0.14em] text-muted-foreground/70">
              ⌘J to toggle · grounded in live site data
            </p>
          </form>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

function PromptList({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        Ask anything about Sourav&apos;s work, stack, or availability.
      </p>
      <ul className="space-y-2.5">
        {ASSISTANT_PROMPTS.map((prompt, index) => (
          <motion.li
            key={prompt}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index, duration: 0.28 }}
          >
            <button
              type="button"
              onClick={() => onPick(prompt)}
              className={cn(
                "w-full rounded-full border px-4 py-2.5 text-left text-sm transition-colors",
                index === 0
                  ? "border-cyan-brand/45 bg-cyan-brand/10 text-foreground shadow-[0_0_24px_rgb(63_230_214/0.12)]"
                  : "border-white/12 bg-background/20 text-foreground/90 hover:border-cyan-brand/35 hover:bg-cyan-brand/8",
              )}
            >
              {prompt}
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function ChatBubble({
  role,
  content,
  pending,
}: {
  role: "user" | "assistant";
  content: string;
  pending: boolean;
}) {
  const isUser = role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-md bg-[linear-gradient(135deg,var(--brand-cyan),var(--brand-violet))] text-primary-foreground"
            : "rounded-bl-md border border-white/10 bg-background/35",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : content ? (
          <div className="prose-assistant">
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
            {pending && <Caret />}
          </div>
        ) : (
          <TypingDots />
        )}
      </div>
    </div>
  );
}

function Caret() {
  return (
    <span className="ml-0.5 inline-block h-3.5 w-0.5 translate-y-0.5 animate-pulse bg-cyan-brand align-middle" />
  );
}

function TypingDots() {
  return (
    <span className="flex h-5 items-center gap-1 px-1" aria-label="Thinking">
      <span className="size-1.5 animate-bounce rounded-full bg-cyan-brand [animation-delay:-0.2s]" />
      <span className="size-1.5 animate-bounce rounded-full bg-violet-brand [animation-delay:-0.1s]" />
      <span className="size-1.5 animate-bounce rounded-full bg-cyan-brand" />
    </span>
  );
}
