import { useMemo, useState, useRef, useCallback } from "react";
import { ChatInput } from "./ChatInput";
import { ChatSession, type ChatSessionHandle } from "./ChatSession";
import { useApiConfig } from "@/contexts/ApiConfigContext";
import { createChatTransport, getProvider } from "@/lib/ai";
import type { GgbAppName } from "@/hooks/useGgbApplet";

interface ChatPanelProps {
  evalCommand: (cmd: string) => { success: boolean; error?: string };
  onOpenSettings: () => void;
  // 当前画板模式，透传给 ChatSession
  appMode: GgbAppName;
}

export function ChatPanel({ evalCommand, onOpenSettings, appMode }: ChatPanelProps) {
  const { provider, apiKey, baseUrl, loaded } = useApiConfig();
  const hasKey = loaded && apiKey.length > 0;
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const sessionRef = useRef<ChatSessionHandle>(null);
  const inputRef = useRef(input);
  inputRef.current = input;

  const transport = useMemo(() => {
    if (!hasKey) return undefined;
    const p = getProvider(provider);
    if (!p) return undefined;
    return createChatTransport(apiKey, p, baseUrl || undefined);
  }, [apiKey, provider, baseUrl, hasKey]);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!hasKey) {
        onOpenSettings();
        return;
      }
      const text = inputRef.current.trim();
      if (text && sessionRef.current) {
        sessionRef.current.sendMessage(text);
        setInput("");
      }
    },
    [hasKey, onOpenSettings],
  );

  const providerName = getProvider(provider)?.name ?? provider;

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b flex items-center justify-between">
        <span className="text-sm font-medium">{providerName}</span>
        {!hasKey && loaded && (
          <button
            onClick={onOpenSettings}
            className="text-xs text-primary hover:underline"
          >
            请先配置 API Key
          </button>
        )}
      </div>

      {hasKey && transport ? (
        <ChatSession
          ref={sessionRef}
          transport={transport}
          evalCommand={evalCommand}
          onInputConsumed={() => setInput("")}
          onLoadingChange={setSending}
          appMode={appMode}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm p-4 text-center">
          {!loaded ? "正在加载..." : "请先配置 API Key"}
        </div>
      )}

      <ChatInput
        input={input}
        isLoading={sending}
        disabled={!loaded}
        disabledReason={
          !loaded
            ? "正在加载..."
            : !hasKey
              ? "请先配置 API Key"
              : undefined
        }
        onChange={setInput}
        onSubmit={onSubmit}
      />
    </div>
  );
}
