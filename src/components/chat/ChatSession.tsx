import { useChat } from "@ai-sdk/react";
import { useImperativeHandle, forwardRef, useEffect } from "react";
import { MessageList } from "./MessageList";
import type { ChatTransport, UIMessage } from "ai";

interface ChatSessionProps {
  transport: ChatTransport<any>;
  initialMessages?: UIMessage[];
  onInputConsumed: () => void;
  onLoadingChange: (loading: boolean) => void;
  onMessagesChange?: (messages: UIMessage[]) => void;
}

export interface ChatSessionHandle {
  sendMessage: (text: string) => void;
}

export const ChatSession = forwardRef<ChatSessionHandle, ChatSessionProps>(
  function ChatSession(
    { transport, initialMessages, onInputConsumed, onLoadingChange, onMessagesChange },
    ref,
  ) {
    const { messages, sendMessage, status } = useChat({
      transport,
      messages: initialMessages,
      onError: (error) => {
        console.error("Chat error:", error);
      },
    });

    const isLoading = status === "submitted" || status === "streaming";

    useEffect(() => {
      onLoadingChange(isLoading);
    }, [isLoading, onLoadingChange]);

    useEffect(() => {
      onMessagesChange?.(messages);
    }, [messages, onMessagesChange]);

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
