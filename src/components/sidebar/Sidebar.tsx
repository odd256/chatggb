import { useSession } from "@/contexts/SessionContext";
import { ConversationItem } from "./ConversationItem";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { GgbAppName } from "@/hooks/useGgbApplet";

interface SidebarProps {
  appMode?: GgbAppName;
  onSessionSwitch?: () => void;
}

export function Sidebar({ appMode = "graphing", onSessionSwitch }: SidebarProps) {
  const {
    conversations,
    activeId,
    switchSession,
    createSession,
    deleteSession,
    renameSession,
  } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const handleNew = async (mode: GgbAppName) => {
    await createSession(mode);
    onSessionSwitch?.();
  };

  const handleSwitch = async (id: string) => {
    await switchSession(id);
    onSessionSwitch?.();
  };

  if (collapsed) {
    return (
      <div className="w-10 border-r flex flex-col items-center py-2 gap-2 shrink-0">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCollapsed(false)}
          title="展开侧边栏"
        >
          <ChevronRight className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => handleNew(appMode)}
          title="新建 2D 会话"
        >
          <Plus className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-[240px] border-r flex flex-col shrink-0">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <span className="text-sm font-medium">会话</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleNew(appMode)}
            title="新建 2D 会话"
          >
            <Plus className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCollapsed(true)}
            title="收起侧边栏"
          >
            <ChevronLeft className="size-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {conversations.length === 0 ? (
          <div className="text-xs text-muted-foreground text-center py-8">
            暂无会话
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeId}
              onClick={() => handleSwitch(conv.id)}
              onDelete={() => deleteSession(conv.id)}
              onRename={(title) => renameSession(conv.id, title)}
            />
          ))
        )}
      </div>
    </div>
  );
}
