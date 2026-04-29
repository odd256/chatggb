import { useMemo, useState, useRef, useCallback } from "react";
import { ChatInput } from "./ChatInput";
import { ChatSession, type ChatSessionHandle } from "./ChatSession";
import { useApiConfig } from "@/contexts/ApiConfigContext";
import { createAgentTransport, getProvider } from "@/services/ai";
import type { GgbAppName } from "@/hooks/useGgbApplet";

interface ChatPanelProps {
  evalCommand: (cmd: string) => { success: boolean; error?: string };
  getBoardState: () => any[];
  deleteObject: (name: string) => { success: boolean; error?: string };
  resetCanvas: () => void;
  undo: () => { success: boolean; error?: string };
  getSelectedObjects: () => string[];
  onOpenSettings: () => void;
  // 当前画板模式，透传给 ChatSession
  appMode: GgbAppName;
  onToggleMode?: (mode: GgbAppName) => void;
}

export function ChatPanel({ evalCommand, getBoardState, deleteObject, resetCanvas, undo, getSelectedObjects, onOpenSettings, appMode, onToggleMode }: ChatPanelProps) {
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
    return createAgentTransport(apiKey, p, baseUrl || undefined, evalCommand, getBoardState, deleteObject, resetCanvas, undo, getSelectedObjects, appMode);
  }, [apiKey, provider, baseUrl, hasKey, evalCommand, appMode]);

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
      <div className="px-3 py-1.5 border-b flex items-center justify-between min-h-[40px]">
        <span className="text-sm font-medium">{providerName}</span>
        <div className="flex items-center gap-3">
          {!hasKey && loaded && (
            <button
              onClick={onOpenSettings}
              className="text-xs text-primary hover:underline"
            >
              请先配置 API Key
            </button>
          )}
          {onToggleMode && (
            <div className="flex items-center gap-1 rounded-md border p-0.5 bg-muted/40">
              <button
                onClick={() => onToggleMode("graphing")}
                className={`px-2 py-0.5 text-[10px] rounded font-medium transition-colors ${
                  appMode === "graphing"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="切换到 2D 图形计算器"
              >
                2D
              </button>
              <button
                onClick={() => onToggleMode("3d")}
                className={`px-2 py-0.5 text-[10px] rounded font-medium transition-colors ${
                  appMode === "3d"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="切换到 3D 计算器"
              >
                3D
              </button>
            </div>
          )}
        </div>
      </div>

      {hasKey && transport ? (
        <ChatSession
          ref={sessionRef}
          transport={transport}
          onInputConsumed={() => setInput("")}
          onLoadingChange={setSending}
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
