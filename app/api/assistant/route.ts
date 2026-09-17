import { ApiError, jsonError, parseBody } from "@/lib/api";
import {
  assistantSystemPrompt,
  buildAssistantContext,
} from "@/lib/assistant-context";
import { streamAssistantReply, getAssistantProvider } from "@/lib/assistant-llm";
import { localAssistantReply, streamLocalReply } from "@/lib/assistant-local";
import { getProfile } from "@/lib/content";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { assistantChatSchema } from "@/lib/validators";

export const maxDuration = 30;

/**
 * Public, streaming chat grounded in the live portfolio + resume records.
 * Rate-limited per IP. The model never sees admin secrets — only public copy.
 */
export async function POST(request: Request) {
  try {
    rateLimit(`assistant:${clientIp(request)}`, {
      limit: 16,
      windowMs: 10 * 60 * 1000,
    });

    const { messages } = await parseBody(request, assistantChatSchema);
    const last = messages.at(-1);

    if (!last || last.role !== "user") {
      throw new ApiError(400, "Send a user message to continue.");
    }

    const [context, profile] = await Promise.all([
      buildAssistantContext(),
      getProfile(),
    ]);

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const write = (payload: string) => {
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        };

        try {
          const provider = getAssistantProvider();
          const iterator = provider
            ? streamAssistantReply({
                system: assistantSystemPrompt(context, profile.name),
                messages,
                signal: request.signal,
              })
            : streamLocalReply(
                localAssistantReply(messages, context, profile.name),
              );

          for await (const text of iterator) {
            write(JSON.stringify({ text }));
          }
          write("[DONE]");
        } catch (error) {
          const message =
            error instanceof ApiError
              ? error.message
              : "The assistant stopped unexpectedly.";
          write(JSON.stringify({ error: message }));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return jsonError(error);
  }
}
