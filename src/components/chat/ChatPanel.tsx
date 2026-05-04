import {
  useMemo,
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ChatInput } from "./ChatInput";
import { ChatSession, type ChatSessionHandle } from "./ChatSession";
import { useApiConfig } from "@/contexts/ApiConfigContext";
import { useBoardAPI } from "@/contexts/BoardContext";
import { useSession } from "@/contexts/SessionContext";
import { createAgentTransport, getProvider } from "@/agent";
import type { GgbAppName } from "@/hooks/useGgbApplet";
import type { UIMessage } from "ai";

export interface ChatPanelHandle {
  undo: () => void;
}

interface ChatPanelProps {
  onOpenSettings: () => void;
  onCanUndoChange?: (canUndo: boolean) => void;
  appMode: GgbAppName;
  onToggleMode?: (mode: GgbAppName) => void;
}

export const ChatPanel = forwardRef<ChatPanelHandle, ChatPanelProps>(
  function ChatPanel({ onOpenSettings, appMode, onToggleMode, onCanUndoChange }, ref) {
    const { provider, apiKey, baseUrl, loaded } = useApiConfig();
    const board = useBoardAPI();
    const {
      activeId,
      activeConversation,
      createSession,
      saveCurrentSession,
    } = useSession();
    const hasKey = loaded && apiKey.length > 0;
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const sessionRef = useRef<ChatSessionHandle>(null);
    const inputRef = useRef(input);
    inputRef.current = input;

    // Snapshot stack for undo: each entry is the board XML before a user message
    const snapshotStackRef = useRef<string[]>([]);
    const onCanUndoChangeRef = useRef(onCanUndoChange);
    onCanUndoChangeRef.current = onCanUndoChange;

    // Track the session ID to detect session switches
    const activeIdRef = useRef(activeId);
    const lastRestoredIdRef = useRef<string | null>(null);
    const pendingSendRef = useRef<string | null>(null);

    const transport = useMemo(() => {
      if (!hasKey) return undefined;
      const p = getProvider(provider);
      if (!p) return undefined;
      return createAgentTransport(apiKey, p, baseUrl || undefined, board);
    }, [apiKey, provider, baseUrl, hasKey, board]);

    // Initial messages from the active conversation
    const initialMessages: UIMessage[] = useMemo(() => {
      if (!activeConversation) return [];
      return (activeConversation.messages as UIMessage[]) ?? [];
    }, [activeConversation]);

    // Save messages + board snapshot to the current session
    const handleMessagesChange = useCallback(
      (messages: UIMessage[]) => {
        if (!activeId) return;
        if (messages.length === 0) return;
        const snapshot = board.exportXML();
        saveCurrentSession(messages, snapshot);
      },
      [activeId, saveCurrentSession, board],
    );

    // Restore board when switching sessions
    useEffect(() => {
      activeIdRef.current = activeId;

      if (activeId && activeId !== lastRestoredIdRef.current) {
        lastRestoredIdRef.current = activeId;

        // Clear snapshot stack when switching sessions
        snapshotStackRef.current = [];
        onCanUndoChangeRef.current?.(false);

        // Restore board state from the conversation snapshot
        const snapshot = activeConversation?.snapshot;
        if (snapshot) {
          board.importXML(snapshot);
        } else {
          board.resetCanvas();
        }
      }

      // Flush pending send after session auto-creation
      if (activeId && pendingSendRef.current) {
        const text = pendingSendRef.current;
        pendingSendRef.current = null;
        requestAnimationFrame(() => {
          sessionRef.current?.sendMessage(text);
          setInput("");
        });
      }
    }, [activeId, activeConversation, board]);

    // Undo: pop snapshot, remove last user+assistant messages, restore board
    const undo = useCallback(() => {
      const stack = snapshotStackRef.current;
      if (stack.length === 0) return;

      const snapshot = stack.pop()!;
      onCanUndoChangeRef.current?.(stack.length > 0);

      // Remove the last assistant + user message pair
      sessionRef.current?.setMessages((prev: UIMessage[]) => {
        const msgs = [...prev];
        // Remove trailing assistant message(s)
        while (msgs.length > 0 && msgs[msgs.length - 1].role === "assistant") {
          msgs.pop();
        }
        // Remove the user message before them
        if (msgs.length > 0 && msgs[msgs.length - 1].role === "user") {
          msgs.pop();
        }
        return msgs;
      });

      // Restore board to the previous snapshot
      board.importXML(snapshot);
    }, [board]);

    // Expose undo to parent via ref
    useImperativeHandle(ref, () => ({ undo }), [undo]);

    const onSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hasKey) {
          onOpenSettings();
          return;
        }
        const text = inputRef.current.trim();
        if (!text) return;

        // Save board snapshot before sending (for undo)
        snapshotStackRef.current.push(board.exportXML());
        onCanUndoChangeRef.current?.(true);

        // Auto-create a session if none is active
        if (!activeIdRef.current) {
          pendingSendRef.current = text;
          await createSession(appMode);
          return;
        }

        if (sessionRef.current) {
          sessionRef.current.sendMessage(text);
          setInput("");
        }
      },
      [hasKey, onOpenSettings, appMode, createSession, board],
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
            key={activeId ?? "no-session"}
            ref={sessionRef}
            transport={transport}
            initialMessages={initialMessages}
            onInputConsumed={() => setInput("")}
            onLoadingChange={setSending}
            onMessagesChange={handleMessagesChange}
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
  },
);
