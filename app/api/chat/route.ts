import { NextRequest } from "next/server";
import { getAnthropic } from "@/lib/ai/anthropic";
import { AI_MODEL, AI_LIMITS, hasAnthropic } from "@/lib/ai/env";
import {
  buildConciergeSystemPrompt,
  scriptedConciergeReply,
} from "@/lib/ai/knowledge";
import { checkRateLimit, tooManyRequests } from "@/lib/ai/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Stream a single text payload (used for the no-key scripted fallback). */
function streamText(text: string): Response {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export async function POST(req: NextRequest) {
  const limit = checkRateLimit(req, "chat", 30, 60_000);
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const raw = Array.isArray(body.messages) ? body.messages : [];
  // Sanitize: keep only valid roles/strings, trim, drop empties, cap history.
  const messages: ChatMessage[] = raw
    .filter(
      (m): m is ChatMessage =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, AI_LIMITS.maxChatChars),
    }))
    .slice(-AI_LIMITS.maxChatHistory);

  // Conversation must start with a user turn and contain at least one.
  while (messages.length && messages[0].role !== "user") messages.shift();
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return Response.json({ error: "No user message." }, { status: 400 });
  }

  // Graceful fallback: scripted reply when Claude isn't configured.
  if (!hasAnthropic()) {
    return streamText(scriptedConciergeReply(lastUser.content));
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let sentAnything = false;
      try {
        const claude = getAnthropic().messages.stream({
          model: AI_MODEL,
          max_tokens: 1024,
          // Snappy, low-latency concierge replies; thinking left off by default.
          output_config: { effort: "low" },
          system: buildConciergeSystemPrompt(),
          messages,
        });

        for await (const event of claude) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            sentAnything = true;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        console.error("[/api/chat] Claude error:", err);
        if (!sentAnything) {
          controller.enqueue(
            encoder.encode(scriptedConciergeReply(lastUser.content)),
          );
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
