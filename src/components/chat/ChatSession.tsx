import { useChat } from "@ai-sdk/react";
import { useImperativeHandle, forwardRef, useEffect } from "react";
import { MessageList } from "./MessageList";
import type { ChatTransport } from "ai";

interface ChatSessionProps {
  transport: ChatTransport<any>;
  onInputConsumed: () => void;
  onLoadingChange: (loading: boolean) => void;
}

export interface ChatSessionHandle {
  sendMessage: (text: string) => void;
}

export const ChatSession = forwardRef<ChatSessionHandle, ChatSessionProps>(
  function ChatSession(
    { transport, onInputConsumed, onLoadingChange },
    ref,
  ) {
    const { messages, sendMessage, status } = useChat({
      transport,
      onError: (error) => {
        console.error("Chat error:", error);
      },
    });

    const isLoading = status === "submitted" || status === "streaming";

    useEffect(() => {
      onLoadingChange(isLoading);
    }, [isLoading, onLoadingChange]);

    useImperativeHandle(
      ref,
      () => ({
        sendMessage: (text: string) => {
          sendMessage({ text });
          onInputConsumed();
        },
      }),
      [sendMessage, onInputConsumed],
    );

    return (
      <MessageList
        messages={messages}
        status={status}
      />
    );
  },
);
