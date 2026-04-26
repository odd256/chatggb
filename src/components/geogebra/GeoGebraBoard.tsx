import { useGgbApplet, type GgbAppName } from "@/hooks/useGgbApplet";
import { useImperativeHandle, forwardRef, useEffect, useRef } from "react";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface GeoGebraBoardHandle {
  evalCommand: (cmd: string) => { success: boolean; error?: string };
  reset: () => void;
}

interface GeoGebraBoardProps {
  className?: string;
  // 画板模式："graphing" = 2D，"3d" = 三维
  appName?: GgbAppName;
}

export const GeoGebraBoard = forwardRef<
  GeoGebraBoardHandle,
  GeoGebraBoardProps
>(function GeoGebraBoard({ className, appName = "graphing" }, ref) {
  const { isReady, loadError, evalCommand, reset, ggbRef, containerId } =
    useGgbApplet({ appName });
  const wrapperRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(
    ref,
    () => ({ evalCommand, reset }),
    [evalCommand, reset],
  );

  useEffect(() => {
    if (!isReady || !wrapperRef.current) return;
    const applet = ggbRef.current;
    if (!applet) return;

    const syncSize = () => {
      const el = wrapperRef.current;
      if (!el || !applet) return;
      // 使用 clientWidth/clientHeight 获取内部可用空间，更适合这种绝对定位场景
      const w = el.clientWidth;
      const h = el.clientHeight;
      
      if (w <= 0 || h <= 0) return;
      
      try {
        // GeoGebra 有时需要强制触发内部重绘
        applet.setSize(w, h);
        if (applet.recalculateEnvironments) {
          applet.recalculateEnvironments();
        }
      } catch (e) {
        console.error("GeoGebra resize error:", e);
      }
    };

    // 移除 200ms 的延迟防抖，改为直接使用 requestAnimationFrame 确保平滑度
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(syncSize);
    });

    observer.observe(wrapperRef.current);
    // 初始同步
    syncSize();

    return () => {
      observer.disconnect();
    };
  }, [isReady, ggbRef]);

  return (
    <div
      ref={wrapperRef}
      className={`relative ${className || ""}`}
    >
      <div id={containerId} className="absolute inset-0" />

      {!isReady && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="size-8 animate-spin" />
            <span className="text-sm">
              正在加载 GeoGebra {appName === "3d" ? "3D 计算器" : "图形计算器"}...
            </span>
          </div>
        </div>
      )}

      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="flex flex-col items-center gap-3 text-destructive">
            <AlertTriangle className="size-8" />
            <span className="text-sm">{loadError}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="size-3" />
              重试
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});
