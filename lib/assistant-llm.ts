import { ApiError } from "@/lib/api";

export type ChatTurn = { role: "user" | "assistant"; content: string };

type GeminiProvider = {
  apiKey: string;
  model: string;
};

/**
 * Google Gemini Flash via AI Studio. The free tier is the only LLM this
 * portfolio uses — there is no OpenAI / paid fallback.
 */
export function getAssistantProvider(): GeminiProvider | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  return {
    apiKey,
    model: process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash",
  };
}

export async function* streamAssistantReply({
  system,
  messages,
  signal,
}: {
  system: string;
  messages: ChatTurn[];
  signal?: AbortSignal;
}): AsyncGenerator<string> {
  const provider = getAssistantProvider();
  if (!provider) {
    throw new ApiError(
      503,
      "The AI assistant is not configured yet. Add a free GEMINI_API_KEY from Google AI Studio.",
    );
  }

  const url = new URL(
    `https://generativelanguage.googleapis.com/v1beta/models/${provider.model}:streamGenerateContent`,
  );
  url.searchParams.set("alt", "sse");
  url.searchParams.set("key", provider.apiKey);

  const contents = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents,
      generationConfig: { temperature: 0.4, maxOutputTokens: 700 },
    }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw await providerError(response);
  }

  for await (const payload of readSse(response.body)) {
    try {
      const json = JSON.parse(payload) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const text = json.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("");
      if (text) yield text;
    } catch {
      // ignore malformed frames
    }
  }
}

async function* readSse(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() ?? "";

    for (const block of blocks) {
      const data = block
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim())
        .join("");
      if (data) yield data;
    }
  }

  if (buffer.trim()) {
    const data = buffer
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trim())
      .join("");
    if (data) yield data;
  }
}

async function providerError(response: Response) {
  const body = await response.text().catch(() => "");
  const looksLikeQuota = response.status === 429 || /quota|rate/i.test(body);

  return new ApiError(
    looksLikeQuota ? 429 : 502,
    looksLikeQuota
      ? "The assistant is busy. Try again in a moment."
      : "Gemini could not answer just now.",
  );
}
