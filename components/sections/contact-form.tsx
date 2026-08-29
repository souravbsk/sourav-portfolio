"use client";

import { useState } from "react";
import { CheckIcon, LoaderIcon, SendIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FieldErrors = Partial<
  Record<"name" | "email" | "phone" | "subject" | "message", string>
>;

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setPending(true);
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        // The API returns a zod tree for 422; surface it per field.
        const tree = payload?.details?.properties as
          | Record<string, { errors?: string[] }>
          | undefined;

        if (tree) {
          setErrors(
            Object.fromEntries(
              Object.entries(tree).map(([field, value]) => [
                field,
                value.errors?.[0] ?? "Invalid value",
              ]),
            ) as FieldErrors,
          );
        }

        toast.error(payload?.error ?? "Could not send your message");
        return;
      }

      form.reset();
      setSent(true);
      toast.success("Message sent. I will get back to you soon.");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Bots fill this; humans never see it. */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="honeypot">Leave this empty</label>
        <input id="honeypot" name="honeypot" tabIndex={-1} autoComplete="off" />
      </div>

      <Field id="name" label="Name" error={errors.name}>
        <Input
          id="name"
          name="name"
          required
          autoComplete="name"
          placeholder="Your name"
          aria-invalid={Boolean(errors.name)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="email" label="Email" error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={Boolean(errors.email)}
          />
        </Field>

        <Field id="phone" label="Phone" error={errors.phone} optional>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Optional"
            aria-invalid={Boolean(errors.phone)}
          />
        </Field>
      </div>

      <Field id="subject" label="Subject" error={errors.subject} optional>
        <Input
          id="subject"
          name="subject"
          placeholder="What is this about?"
          aria-invalid={Boolean(errors.subject)}
        />
      </Field>

      <Field id="message" label="Message" error={errors.message}>
        <Textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell me about the project, timeline and what success looks like."
          aria-invalid={Boolean(errors.message)}
        />
      </Field>

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        disabled={pending}
        className="w-full"
      >
        {pending ? (
          <>
            <LoaderIcon className="animate-spin" />
            Sending
          </>
        ) : sent ? (
          <>
            <CheckIcon />
            Sent — send another
          </>
        ) : (
          <>
            <SendIcon />
            Send message
          </>
        )}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {optional && (
          <span className="normal-case tracking-normal opacity-60">
            optional
          </span>
        )}
      </Label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
