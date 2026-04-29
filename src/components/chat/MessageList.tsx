import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import type { UIMessage } from "ai";

interface MessageListProps {
  messages: UIMessage[];
  status: string;
}

export function MessageList({
  messages,
  status,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const visibleMessages = messages.filter((m) => m.role !== "system");

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4">
      {visibleMessages.length === 0 && (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          <p>在下方输入自然语言描述，AI 将自动生成 GeoGebra 图形</p>
        </div>
      )}

      {visibleMessages.map((msg) => (
        <MessageBubble
          key={msg.id}
          role={msg.role as "user" | "assistant"}
          parts={msg.parts as any[]}
        />
      ))}

      {status === "submitted" && (
        <div className="flex items-center gap-2 text-muted-foreground text-xs px-3">
          <div className="size-2 rounded-full bg-primary animate-pulse" />
          思考中...
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
