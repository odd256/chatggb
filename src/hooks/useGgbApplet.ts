import { useEffect, useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    GGBApplet: any;
    ggbApplet: any;
  }
}

// 支持的 GeoGebra 应用模式
export type GgbAppName = "graphing" | "3d";

interface CommandResult {
  success: boolean;
  error?: string;
}

let ggbScriptLoading = false;
let ggbScriptLoaded = false;
const loadCallbacks: Array<() => void> = [];

function loadGgbScript(): Promise<void> {
  if (ggbScriptLoaded) return Promise.resolve();
  return new Promise((resolve, reject) => {
    loadCallbacks.push(resolve);

    if (ggbScriptLoading) return;
    ggbScriptLoading = true;

    const script = document.createElement("script");
    script.src = "/deployggb.js";
    script.async = true;
    script.onload = () => {
      ggbScriptLoaded = true;
      loadCallbacks.forEach((cb) => cb());
      loadCallbacks.length = 0;
    };
    script.onerror = () => reject(new Error("GeoGebra 脚本加载失败"));
    document.body.appendChild(script);
  });
}

interface UseGgbAppletOptions {
  // "graphing" = 2D 图形计算器，"3d" = 三维计算器
  appName?: GgbAppName;
}

export function useGgbApplet({ appName = "graphing" }: UseGgbAppletOptions = {}) {
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const ggbRef = useRef<any>(null);
  // 每次 appName 变化都生成新 id，避免与上一个实例冲突
  const ggbId = useRef(`ggb_${Math.random().toString(36).slice(2)}`);

  const isFirstMount = useRef(true);

  // 用 state 存储 containerId，确保 React 重渲染后 div 已存在再 inject
  const [containerId, setContainerId] = useState(ggbId.current);

  useEffect(() => {
    // 初次挂载不需要重新生成 id，直接跳过
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    // appName 切换：生成新 id，让 div 先用新 id 出现在 DOM，再执行注入
    const newId = `ggb_${Math.random().toString(36).slice(2)}`;
    ggbId.current = newId;
    setContainerId(newId);
    setIsReady(false);
    setLoadError(null);
  }, [appName]);

  useEffect(() => {
    // containerId 更新后（div 已存在），才执行实际注入
    let cancelled = false;
    const id = containerId;

    loadGgbScript()
      .then(() => {
        if (cancelled) return;

        const params: Record<string, any> = {
          id,
          // 仅 3D 模式需要显式设置 appName（参考 integration-main/example-3d.html）
          // 2D 模式不传此参数，与原来一致，避免本地 deployggb.js 兼容问题
          ...(appName === "3d" ? { appName: "3d" } : {}),
          showToolBar: true,
          showMenuBar: true,
          showAlgebraInput: false,
          language: "zh",
          borderColor: "transparent",
          enableRightClick: false,
          // 关键修复：禁用内置的缩放机制，使用外部容器尺寸
          disableAutoScale: true,
          width: "100%",
          height: "100%",
          appletOnLoad: function (api: any) {
            if (cancelled) return;
            ggbRef.current = api || (window as any)[id] || window.ggbApplet;
            setIsReady(true);
          },
        };

        const applet = new window.GGBApplet(params, true);
        applet.inject(id);
      })
      .catch((e) => {
        if (!cancelled) {
          setLoadError(e.message || "GeoGebra 加载失败");
        }
      });

    return () => {
      cancelled = true;
      // 销毁旧 applet，切换模式时清空画板
      if (ggbRef.current) {
        try {
          ggbRef.current.remove();
        } catch {}
        ggbRef.current = null;
      }
    };
  }, [containerId, appName]);

  const evalCommand = useCallback(
    (cmd: string): CommandResult => {
      if (!ggbRef.current) {
        return { success: false, error: "GeoGebra 尚未就绪" };
      }
      try {
        ggbRef.current.evalCommand(cmd);
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message || String(e) };
      }
    },
    [isReady],
  );

  const reset = useCallback(() => {
    if (ggbRef.current) {
      ggbRef.current.reset();
    }
  }, []);

  const getBoardState = useCallback(() => {
    if (!ggbRef.current) return [];
    const api = ggbRef.current;
    const count = api.getObjectNumber();
    const objects = [];
    for (let i = 0; i < count; i++) {
      const name = api.getObjectName(i);
      const type = api.getObjectType(name);
      const definition = api.getDefinitionString(name);
      const value = api.getValueString(name);
      objects.push({ name, type, definition, value });
    }
    return objects;
  }, []);

  const deleteObject = useCallback((name: string) => {
    if (!ggbRef.current) return { success: false, error: "GeoGebra 尚未就绪" };
    try {
      if (!ggbRef.current.exists(name)) {
        return { success: false, error: `对象 "${name}" 不存在` };
      }
      ggbRef.current.deleteObject(name);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || String(e) };
    }
  }, []);

  const undo = useCallback(() => {
    if (!ggbRef.current) return { success: false, error: "GeoGebra 尚未就绪" };
    try {
      ggbRef.current.undo();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || String(e) };
    }
  }, []);

  const getSelectedObjects = useCallback(() => {
    if (!ggbRef.current) return [];
    try {
      // getSelectedObjectNames() returns a JavaScript Array of Strings
      const names = ggbRef.current.getSelectedObjectNames();
      return Array.isArray(names) ? names : [];
    } catch (e: any) {
      return [];
    }
  }, []);

  return { isReady, loadError, evalCommand, reset, getBoardState, deleteObject, undo, getSelectedObjects, ggbRef, containerId };
}
