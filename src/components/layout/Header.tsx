import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Square, X } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
interface HeaderProps {
  onClearBoard: () => void;
}

export function Header({ onClearBoard }: HeaderProps) {
  const handleMinimize = useCallback(() => {
    getCurrentWindow().minimize();
  }, []);

  const handleToggleMaximize = useCallback(() => {
    getCurrentWindow().toggleMaximize();
  }, []);

  const handleClose = useCallback(() => {
    getCurrentWindow().close();
  }, []);

  return (
    <header
      data-tauri-drag-region
      className="flex items-center justify-between h-9 border-b bg-background shrink-0 select-none"
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm ml-3">Chat GGB</span>
      </div>

      <div className="flex items-center">
        <div data-tauri-drag-region="false" className="flex items-center gap-0.5 mr-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClearBoard}
            title="清空画板"
          >
            <Trash2 />
          </Button>
        </div>

        <div data-tauri-drag-region="false" className="flex items-center">
          <button
            onClick={handleMinimize}
            className="inline-flex items-center justify-center size-9 rounded-none text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="最小化"
          >
            <Minus className="size-4" />
          </button>
          <button
            onClick={handleToggleMaximize}
            className="inline-flex items-center justify-center size-9 rounded-none text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="最大化"
          >
            <Square className="size-3.5" />
          </button>
          <button
            onClick={handleClose}
            className="inline-flex items-center justify-center size-9 rounded-none text-muted-foreground hover:bg-destructive hover:text-white transition-colors"
            title="关闭"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
