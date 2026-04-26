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

    let lastW = 0;
    let lastH = 0;
    let timer: ReturnType<typeof setTimeout>;

    const syncSize = () => {
      const el = wrapperRef.current;
      if (!el || !applet) return;
      const rect = el.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w <= 0 || h <= 0) return;
      if (Math.abs(w - lastW) < 10 && Math.abs(h - lastH) < 10) return;
      lastW = w;
      lastH = h;
      try {
        applet.setSize(w, h);
      } catch {}
    };

    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => requestAnimationFrame(syncSize), 200);
    });
    observer.observe(wrapperRef.current);
    requestAnimationFrame(syncSize);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
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
