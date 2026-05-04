import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MessageSquare, Trash2, Pencil } from "lucide-react";
import type { ConversationMeta } from "@/hooks/useConversations";

interface ConversationItemProps {
  conversation: ConversationMeta;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
  onDelete,
  onRename,
}: ConversationItemProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSubmitRename = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== conversation.title) {
      onRename(trimmed);
    } else {
      setEditTitle(conversation.title);
    }
    setEditing(false);
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "hover:bg-muted text-muted-foreground hover:text-foreground",
      )}
      onClick={() => {
        if (!editing) onClick();
      }}
    >
      <MessageSquare className="size-4 shrink-0" />
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSubmitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmitRename();
              if (e.key === "Escape") {
                setEditTitle(conversation.title);
                setEditing(false);
              }
            }}
            className="w-full bg-transparent border-b border-foreground/30 outline-none text-sm"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="truncate block">{conversation.title}</span>
        )}
        <span className="text-[10px] text-muted-foreground/70">
          {conversation.mode === "3d" ? "3D" : "2D"}
        </span>
      </div>
      <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
          className="p-1 rounded hover:bg-muted-foreground/10"
          title="重命名"
        >
          <Pencil className="size-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 rounded hover:bg-destructive/10 hover:text-destructive"
          title="删除"
        >
          <Trash2 className="size-3" />
        </button>
      </div>
    </div>
  );
}
