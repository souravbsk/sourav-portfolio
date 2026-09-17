"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type AssistantContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  messages: AssistantMessage[];
  streaming: boolean;
  error: string | null;
  send: (text: string) => Promise<void>;
  stop: () => void;
  clear: () => void;
};

const AssistantContext = createContext<AssistantContextValue | null>(null);

function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`;
}

async function readAssistantStream(
  response: Response,
  onText: (chunk: string) => void,
  signal: AbortSignal,
) {
  if (!response.body) {
    throw new Error("The assistant returned an empty reply.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (!signal.aborted) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";

    for (const frame of frames) {
      const data = frame
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim())
        .join("");

      if (!data || data === "[DONE]") continue;

      const payload = JSON.parse(data) as { text?: string; error?: string };
      if (payload.error) throw new Error(payload.error);
      if (payload.text) onText(payload.text);
    }
  }
}

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
  }, []);

  const clear = useCallback(() => {
    stop();
    setMessages([]);
    setError(null);
  }, [stop]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || streaming) return;

      stop();
      setError(null);
      setOpen(true);

      const userMessage: AssistantMessage = {
        id: newId(),
        role: "user",
        content: text,
      };
      const assistantMessage: AssistantMessage = {
        id: newId(),
        role: "assistant",
        content: "",
      };

      const history = [...messages, userMessage];
      setMessages([...history, assistantMessage]);
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history.map(({ role, content }) => ({ role, content })),
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(payload?.error ?? "The assistant could not reply.");
        }

        await readAssistantStream(
          response,
          (chunk) => {
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantMessage.id
                  ? { ...message, content: message.content + chunk }
                  : message,
              ),
            );
          },
          controller.signal,
        );
      } catch (caught) {
        if (controller.signal.aborted) return;

        const message =
          caught instanceof Error
            ? caught.message
            : "The assistant could not reply.";
        setError(message);
        setMessages((current) =>
          current.map((item) =>
            item.id === assistantMessage.id && !item.content
              ? { ...item, content: message }
              : item,
          ),
        );
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        setStreaming(false);
      }
    },
    [messages, stop, streaming],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "j" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) stop();
  }, [open, stop]);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      messages,
      streaming,
      error,
      send,
      stop,
      clear,
    }),
    [clear, error, messages, open, send, stop, streaming],
  );

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const value = useContext(AssistantContext);
  if (!value) {
    throw new Error("useAssistant must be used inside AssistantProvider");
  }
  return value;
}
