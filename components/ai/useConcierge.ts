"use client";

import { useCallback, useRef, useState } from "react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Shared Design Concierge state machine. Streams replies from /api/chat token by
 * token. Used by both the floating Chatbot and the in-page Concierge panel so
 * the conversation logic lives in exactly one place.
 */
export function useConcierge(welcome: string, errorText: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: welcome },
  ]);
  const [streaming, setStreaming] = useState(false);
  // Mirror of messages for building request history without stale closures.
  const ref = useRef<ChatMessage[]>([{ role: "assistant", content: welcome }]);

  const setAll = useCallback((next: ChatMessage[]) => {
    ref.current = next;
    setMessages(next);
  }, []);

  const send = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!clean || streaming) return;

      const history = [...ref.current, { role: "user", content: clean } as ChatMessage];
      // Render the user turn + an empty assistant placeholder to fill as we stream.
      setAll([...history, { role: "assistant", content: "" }]);
      setStreaming(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          const next = [...history, { role: "assistant", content: acc } as ChatMessage];
          setAll(next);
        }
        if (!acc.trim()) {
          setAll([...history, { role: "assistant", content: errorText }]);
        }
      } catch {
        setAll([...history, { role: "assistant", content: errorText }]);
      } finally {
        setStreaming(false);
      }
    },
    [streaming, setAll, errorText],
  );

  return { messages, streaming, send };
}
