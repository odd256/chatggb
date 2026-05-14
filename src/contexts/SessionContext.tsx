import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { GgbAppName } from "@/hooks/useGgbApplet";
import {
  listConversations,
  getConversation,
  saveConversation,
  deleteConversation as deleteConv,
  renameConversation as renameConv,
  setActiveConversation,
  getActiveConversation,
  type ConversationMeta,
  type Conversation,
} from "@/hooks/useConversations";

interface SessionContextValue {
  conversations: ConversationMeta[];
  activeId: string | null;
  activeConversation: Conversation | null;
  loading: boolean;
  switchSession: (id: string) => Promise<void>;
  createSession: (mode: GgbAppName) => Promise<string>;
  deleteSession: (id: string) => Promise<void>;
  renameSession: (id: string, title: string) => Promise<void>;
  saveCurrentSession: (messages: any[], snapshot: string) => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a SessionContext.Provider");
  }
  return ctx;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<ConversationMeta[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeConversation, setActiveConversationState] =
    useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  // Load conversation list on mount and restore last active session
  useEffect(() => {
    listConversations()
      .then(async (list) => {
        setConversations(list);
        const lastId = await getActiveConversation();
        if (lastId && list.some((c) => c.id === lastId)) {
          try {
            const conv = await getConversation(lastId);
            setActiveId(lastId);
            setActiveConversationState(conv);
          } catch {
            // Conversation file may have been deleted, ignore
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const switchSession = useCallback(async (id: string) => {
    const conv = await getConversation(id);
    setActiveId(id);
    setActiveConversationState(conv);
    await setActiveConversation(id);
  }, []);

  const createSession = useCallback(
    async (mode: GgbAppName): Promise<string> => {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const conv: Conversation = {
        id,
        title: "新会话",
        mode,
        createdAt: now,
        updatedAt: now,
        messages: [],
        snapshot: null,
      };
      await saveConversation(conv);
      setConversations((prev) => [
        { id, title: conv.title, mode, createdAt: now, updatedAt: now },
        ...prev,
      ]);
      setActiveId(id);
      setActiveConversationState(conv);
      await setActiveConversation(id);
      return id;
    },
    [],
  );

  const deleteSession = useCallback(
    async (id: string) => {
      await deleteConv(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) {
        setActiveId(null);
        setActiveConversationState(null);
        await setActiveConversation(null);
      }
    },
    [activeId],
  );

  const renameSession = useCallback(async (id: string, title: string) => {
    await renameConv(id, title);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c)),
    );
    setActiveConversationState((prev) =>
      prev && prev.id === id ? { ...prev, title } : prev,
    );
  }, []);

  const saveCurrentSession = useCallback(
    async (messages: any[], snapshot: string) => {
      if (!activeId || !activeConversation) return;

      const title =
        activeConversation.title === "新会话"
          ? extractTitle(messages)
          : activeConversation.title;

      const updated: Conversation = {
        ...activeConversation,
        title,
        messages,
        snapshot,
        updatedAt: new Date().toISOString(),
      };
      await saveConversation(updated);
      setActiveConversationState(updated);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, title, updatedAt: updated.updatedAt }
            : c,
        ),
      );
    },
    [activeId, activeConversation],
  );

  return (
    <SessionContext.Provider
      value={{
        conversations,
        activeId,
        activeConversation,
        loading,
        switchSession,
        createSession,
        deleteSession,
        renameSession,
        saveCurrentSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

function extractTitle(messages: any[]): string {
  for (const msg of messages) {
    if (msg.role === "user") {
      const text =
        typeof msg.content === "string"
          ? msg.content
          : msg.parts?.find((p: any) => p.type === "text")?.text || "";
      if (text) return text.slice(0, 30) + (text.length > 30 ? "..." : "");
    }
  }
  return "新会话";
}
