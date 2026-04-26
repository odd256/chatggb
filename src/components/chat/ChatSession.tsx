import { useChat } from "@ai-sdk/react";
import { useImperativeHandle, forwardRef, useEffect, useRef } from "react";
import { MessageList } from "./MessageList";
import { useStreamParser } from "@/hooks/useStreamParser";
import { getSystemPrompt } from "@/lib/ai";
import type { ChatTransport } from "ai";
import type { GgbAppName } from "@/hooks/useGgbApplet";

interface ChatSessionProps {
  transport: ChatTransport<any>;
  evalCommand: (cmd: string) => { success: boolean; error?: string };
  onInputConsumed: () => void;
  onLoadingChange: (loading: boolean) => void;
  // 当前画板模式，决定使用哪套 System Prompt
  appMode: GgbAppName;
}

export interface ChatSessionHandle {
  sendMessage: (text: string) => void;
}



export const ChatSession = forwardRef<ChatSessionHandle, ChatSessionProps>(
  function ChatSession(
    { transport, evalCommand, onInputConsumed, onLoadingChange, appMode },
    ref,
  ) {
    const { messages, sendMessage, status } = useChat({
      messages: [
        {
          id: "system",
          role: "system" as const,
          // 根据 appMode 动态切换 System Prompt
          parts: [{ type: "text" as const, text: getSystemPrompt(appMode) }],
        },
      ],
      transport,
      onError: (error) => {
        console.error("Chat error:", error);
      },
    });

    const isLoading = status === "submitted" || status === "streaming";

    useEffect(() => {
      onLoadingChange(isLoading);
    });

    useImperativeHandle(
      ref,
      () => ({
        sendMessage: (text: string) => {
          clearDisplayRef.current();
          sendMessage({ text });
          onInputConsumed();
        },
      }),
      [sendMessage, onInputConsumed],
    );

  const { explanation, commandResults, clearDisplay } = useStreamParser(
    messages,
    evalCommand,
  );

  const clearDisplayRef = useRef(clearDisplay);
  clearDisplayRef.current = clearDisplay;





    return (
      <MessageList
        messages={messages}
        explanation={explanation}
        commandResults={commandResults}
        status={status}
      />
    );
  },
);


