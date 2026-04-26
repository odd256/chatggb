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

const RETRY_MARKER = "___GGB_RETRY___";
const MAX_RETRIES = 3;

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

  const lastProcessedMsgId = useRef<string | null>(null);
  const retryCount = useRef(0);

    useEffect(() => {
      if (status !== "ready") return;

      const visible = messages.filter((m) => m.role !== "system");
      const lastUser = [...visible]
        .reverse()
        .find((m) => (m.role as string) === "user");
      if (!lastUser) return;

      const lastAssistant =
        visible.length > 0 &&
        (visible[visible.length - 1].role as string) === "assistant"
          ? visible[visible.length - 1]
          : null;
      if (!lastAssistant || lastAssistant.id === lastProcessedMsgId.current)
        return;
      lastProcessedMsgId.current = lastAssistant.id;

      const isRetry = getTextContent(lastUser).startsWith(RETRY_MARKER);
      if (!isRetry) {
        retryCount.current = 0;
      }

      const failed = commandResults.filter((r) => !r.success);
      if (failed.length === 0) {
        retryCount.current = 0;
        return;
      }

      if (retryCount.current >= MAX_RETRIES) return;
      retryCount.current++;

      const errorList = failed
        .map((r) => `- "${r.command}"\n  错误: ${r.error}`)
        .join("\n");

      sendMessage({
        text: `${RETRY_MARKER}\n以下命令执行失败，请逐个分析错误原因并修正，然后仅输出 JSON（只包含修正后的 commands 数组）：\n\n${errorList}\n\n输出格式: {"explanation":"修正说明","commands":["正确命令1","正确命令2"]}`,
      });
    }, [status, commandResults, messages, sendMessage]);

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

function getTextContent(msg: { parts?: Array<{ type: string; text?: string }> }): string {
  return (msg.parts || [])
    .filter((p) => p.type === "text")
    .map((p) => p.text || "")
    .join("");
}
