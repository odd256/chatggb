import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Trash2, Minus, Square, X } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import type { GgbAppName } from "@/hooks/useGgbApplet";

interface HeaderProps {
  onOpenSettings: () => void;
  onClearBoard: () => void;
  appMode: GgbAppName;
  onToggleMode: (mode: GgbAppName) => void;
}

export function Header({ onOpenSettings, onClearBoard, appMode, onToggleMode }: HeaderProps) {
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
        <div
          data-tauri-drag-region="false"
          className="flex items-center gap-1 rounded-md border p-0.5 bg-muted/40"
        >
          <button
            onClick={() => onToggleMode("graphing")}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
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
            className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
              appMode === "3d"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="切换到 3D 计算器"
          >
            3D
          </button>
        </div>
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
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onOpenSettings}
            title="设置"
          >
            <Settings />
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
