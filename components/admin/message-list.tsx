"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArchiveIcon, MailOpenIcon, MailIcon, ReplyIcon } from "lucide-react";
import { toast } from "sonner";

import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState } from "@/components/admin/admin-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/admin-client";
import { cn, formatDate } from "@/lib/utils";
import type { MessageData } from "@/types/content";

export function MessageList({ messages }: { messages: MessageData[] }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function patch(id: string, changes: Partial<MessageData>) {
    setBusyId(id);
    try {
      await apiRequest(`/api/messages/${id}`, {
        method: "PATCH",
        body: JSON.stringify(changes),
      });
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  if (messages.length === 0) {
    return (
      <EmptyState
        title="No messages"
        description="Submissions from the contact form land here instead of being emailed from the browser."
      />
    );
  }

  return (
    <ul className="space-y-2.5">
      {messages.map((message) => {
        const open = expanded === message._id;

        return (
          <li
            key={message._id}
            className={cn(
              "panel p-4 transition-colors",
              !message.read && "border-cyan-brand/35",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setExpanded(open ? null : message._id);
                  if (!message.read) void patch(message._id, { read: true });
                }}
                aria-expanded={open}
                className="min-w-0 flex-1 text-left"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium">{message.name}</p>
                  {!message.read && <Badge variant="cyan">New</Badge>}
                </div>

                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {message.subject || "(no subject)"} · {message.email}
                </p>

                <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground/70">
                  {formatDate(message.createdAt)}
                </p>
              </button>

              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={message.read ? "Mark as unread" : "Mark as read"}
                  disabled={busyId === message._id}
                  onClick={() => void patch(message._id, { read: !message.read })}
                >
                  {message.read ? <MailIcon /> : <MailOpenIcon />}
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Reply to ${message.name}`}
                >
                  <a
                    href={`mailto:${message.email}?subject=${encodeURIComponent(
                      `Re: ${message.subject || "your message"}`,
                    )}`}
                  >
                    <ReplyIcon />
                  </a>
                </Button>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Archive"
                  disabled={busyId === message._id}
                  onClick={() => void patch(message._id, { archived: true })}
                >
                  <ArchiveIcon />
                </Button>

                <DeleteButton
                  endpoint={`/api/messages/${message._id}`}
                  label="Message"
                  name={`${message.name}'s message`}
                />
              </div>
            </div>

            {open && (
              <div className="mt-4 space-y-3 border-t border-border pt-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.message}
                </p>

                <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd className="truncate">{message.email}</dd>
                  </div>
                  {message.phone && (
                    <div className="flex gap-2">
                      <dt className="text-muted-foreground">Phone</dt>
                      <dd>{message.phone}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
