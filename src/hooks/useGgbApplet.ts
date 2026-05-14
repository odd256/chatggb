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

  /** 解析 FuncName(arg1, arg2, ...) 的参数列表，正确处理嵌套括号 */
  function parseArgs(argsStr: string): string[] {
    const args: string[] = [];
    let depth = 0;
    let current = "";
    for (const ch of argsStr) {
      if (ch === "(") depth++;
      else if (ch === ")") depth--;
      if (ch === "," && depth === 0) {
        args.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    if (current.trim()) args.push(current.trim());
    return args;
  }

  const evalCommand = useCallback(
    (cmd: string): CommandResult => {
      if (!ggbRef.current) {
        return { success: false, error: "GeoGebra 尚未就绪" };
      }
      const api = ggbRef.current;
      try {
        // 自动重定向不支持 evalCommand 的命令到 JS API
        // 兼容圆括号 FuncName(...) 和方括号 FuncName[...] 两种写法
        const match = cmd.match(/^(\w+)\(([\s\S]*)\)$/) || cmd.match(/^(\w+)\[([\s\S]*)\]$/);
        if (match) {
          const func = match[1].toLowerCase();
          const args = parseArgs(match[2]);
          // 统一小写匹配，兼容 SetColor / setColor / setcolor 等写法
          if (func === "setcolor" && args.length >= 4) {
            const [name, r, g, b] = args;
            if (api.exists(name)) { api.setColor(name, +r, +g, +b); return { success: true }; }
          } else if (func === "setpointsize" && args.length >= 2) {
            const [name, size] = args;
            if (api.exists(name)) { api.setPointSize(name, +size); return { success: true }; }
          } else if (func === "setlinethickness" && args.length >= 2) {
            const [name, thickness] = args;
            if (api.exists(name)) { api.setLineThickness(name, +thickness); return { success: true }; }
          } else if (func === "setvisible" && args.length >= 2) {
            const [name, vis] = args;
            if (api.exists(name)) { api.setVisible(name, vis === "true"); return { success: true }; }
          } else if (func === "setactive" && args.length >= 2) {
            const [name, act] = args;
            if (api.exists(name)) { api.setActive(name, act === "true"); return { success: true }; }
          } else if (func === "showgrid" && args.length >= 1) {
            if (typeof api.setShowGrid === "function") { api.setShowGrid(args[0] === "true"); } else { api.evalCommand(`ShowGrid(${args[0]})`); }
            return { success: true };
          } else if (func === "showaxes" && args.length >= 1) {
            const v = args[0] === "true";
            if (typeof api.setShowAxes === "function") { api.setShowAxes(v, v); } else { api.evalCommand(args.length >= 2 ? `ShowAxes(${args[0]}, ${args[1]})` : `ShowAxes(${args[0]})`); }
            return { success: true };
          } else if (func === "setvalue" && args.length >= 2) {
            const [name, val] = args;
            if (api.exists(name)) { api.setValue(name, +val); return { success: true }; }
          } else if (func === "setcaption" && args.length >= 2) {
            const name = args[0];
            const caption = args.slice(1).join(",").replace(/^["']|["']$/g, "");
            if (api.exists(name)) { api.setCaption(name, caption); return { success: true }; }
          } else if (func === "setanimating" && args.length >= 2) {
            const [name, anim] = args;
            if (api.exists(name)) { api.evalCommand(`StartAnimation(${name}, ${anim})`); return { success: true }; }
          } else if (func === "setanimationspeed" && args.length >= 2) {
            const [name, speed] = args;
            if (api.exists(name)) { api.evalCommand(`${name}.speed = ${speed}`); return { success: true }; }
          } else if (func === "setconditiontoshowobject" && args.length >= 2) {
            const name = args[0];
            const condition = args.slice(1).join(",");
            if (api.exists(name)) { api.setConditionToShowObject(name, condition); return { success: true }; }
          } else if (func === "deleteobject" && args.length >= 1) {
            const name = args[0].replace(/^["']|["']$/g, "");
            if (api.exists(name)) { api.deleteObject(name); return { success: true }; }
          }
        }
        // 默认：原生 evalCommand
        const ok = api.evalCommand(cmd);
        if (!ok) {
          const code = api.getErrorCode?.();
          return { success: false, error: code ? `GeoGebra 错误码: ${code}` : "命令执行失败" };
        }
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

  const setValue = useCallback((name: string, value: number) => {
    if (!ggbRef.current) return { success: false, error: "GeoGebra 尚未就绪" };
    try {
      if (!ggbRef.current.exists(name)) {
        return { success: false, error: `对象 "${name}" 不存在` };
      }
      ggbRef.current.setValue(name, value);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || String(e) };
    }
  }, []);

  const setVisible = useCallback((name: string, visible: boolean) => {
    if (!ggbRef.current) return { success: false, error: "GeoGebra 尚未就绪" };
    try {
      if (!ggbRef.current.exists(name)) {
        return { success: false, error: `对象 "${name}" 不存在` };
      }
      ggbRef.current.setVisible(name, visible);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || String(e) };
    }
  }, []);

  const startAnimation = useCallback(() => {
    if (!ggbRef.current) return { success: false, error: "GeoGebra 尚未就绪" };
    try {
      ggbRef.current.startAnimation();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || String(e) };
    }
  }, []);

  const stopAnimation = useCallback(() => {
    if (!ggbRef.current) return { success: false, error: "GeoGebra 尚未就绪" };
    try {
      ggbRef.current.stopAnimation();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || String(e) };
    }
  }, []);

  const setAnimating = useCallback((name: string, animating: boolean) => {
    if (!ggbRef.current) return { success: false, error: "GeoGebra 尚未就绪" };
    try {
      if (!ggbRef.current.exists(name)) {
        return { success: false, error: `对象 "${name}" 不存在` };
      }
      // StartAnimation(name, true/false) 控制单个对象的动画开关
      ggbRef.current.evalCommand(`StartAnimation(${name}, ${animating})`);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || String(e) };
    }
  }, []);

  const setAnimationSpeed = useCallback((name: string, speed: number) => {
    if (!ggbRef.current) return { success: false, error: "GeoGebra 尚未就绪" };
    try {
      if (!ggbRef.current.exists(name)) {
        return { success: false, error: `对象 "${name}" 不存在` };
      }
      // GeoGebra 没有 SetAnimationSpeed 命令，通过设置对象的 speed 属性实现
      ggbRef.current.evalCommand(`${name}.speed = ${speed}`);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || String(e) };
    }
  }, []);

  const setShowGrid = useCallback((visible: boolean) => {
    if (!ggbRef.current) return { success: false, error: "GeoGebra 尚未就绪" };
    try {
      const api = ggbRef.current;
      if (typeof api.setShowGrid === "function") {
        api.setShowGrid(visible);
      } else {
        // web simple 版本可能没有 setShowGrid 方法，fallback 到 evalCommand
        api.evalCommand(`ShowGrid(${visible})`);
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || String(e) };
    }
  }, []);

  const setShowAxes = useCallback((visible: boolean) => {
    if (!ggbRef.current) return { success: false, error: "GeoGebra 尚未就绪" };
    try {
      const api = ggbRef.current;
      if (typeof api.setShowAxes === "function") {
        api.setShowAxes(visible, visible);
      } else {
        api.evalCommand(`ShowAxes(${visible}, ${visible})`);
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || String(e) };
    }
  }, []);

  const setActive = useCallback((name: string, active: boolean) => {
    if (!ggbRef.current) return { success: false, error: "GeoGebra 尚未就绪" };
    try {
      if (!ggbRef.current.exists(name)) {
        return { success: false, error: `对象 "${name}" 不存在` };
      }
      ggbRef.current.setActive(name, active);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || String(e) };
    }
  }, []);

  const setPointSize = useCallback((name: string, size: number) => {
    if (!ggbRef.current) return { success: false, error: "GeoGebra 尚未就绪" };
    try {
      if (!ggbRef.current.exists(name)) {
        return { success: false, error: `对象 "${name}" 不存在` };
      }
      ggbRef.current.setPointSize(name, size);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || String(e) };
    }
  }, []);

  const setColor = useCallback((name: string, r: number, g: number, b: number) => {
    if (!ggbRef.current) return { success: false, error: "GeoGebra 尚未就绪" };
    try {
      if (!ggbRef.current.exists(name)) {
        return { success: false, error: `对象 "${name}" 不存在` };
      }
      ggbRef.current.setColor(name, r, g, b);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || String(e) };
    }
  }, []);

  const setCaption = useCallback((name: string, caption: string) => {
    if (!ggbRef.current) return { success: false, error: "GeoGebra 尚未就绪" };
    try {
      if (!ggbRef.current.exists(name)) {
        return { success: false, error: `对象 "${name}" 不存在` };
      }
      ggbRef.current.setCaption(name, caption);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || String(e) };
    }
  }, []);

  const setConditionToShowObject = useCallback((name: string, condition: string) => {
    if (!ggbRef.current) return { success: false, error: "GeoGebra 尚未就绪" };
    try {
      if (!ggbRef.current.exists(name)) {
        return { success: false, error: `对象 "${name}" 不存在` };
      }
      ggbRef.current.setConditionToShowObject(name, condition);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || String(e) };
    }
  }, []);

  const setLineThickness = useCallback((name: string, thickness: number) => {
    if (!ggbRef.current) return { success: false, error: "GeoGebra 尚未就绪" };
    try {
      if (!ggbRef.current.exists(name)) {
        return { success: false, error: `对象 "${name}" 不存在` };
      }
      ggbRef.current.setLineThickness(name, thickness);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || String(e) };
    }
  }, []);

  const setCoordSystem = useCallback(
    (xMin: number, xMax: number, yMin: number, yMax: number): { success: boolean; error?: string } => {
      if (!ggbRef.current) {
        return { success: false, error: "GeoGebra 尚未就绪" };
      }
      try {
        ggbRef.current.setCoordSystem(xMin, xMax, yMin, yMax);
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message || String(e) };
      }
    },
    [],
  );

  const exportXML = useCallback((): string => {
    if (!ggbRef.current) return "";
    try {
      return ggbRef.current.getXML();
    } catch {
      return "";
    }
  }, []);

  const importXML = useCallback((xml: string): boolean => {
    if (!ggbRef.current || !xml) return false;
    try {
      ggbRef.current.reset();
      ggbRef.current.evalXML(xml);
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    isReady,
    loadError,
    evalCommand,
    reset,
    getBoardState,
    deleteObject,
    getSelectedObjects,
    setValue,
    setVisible,
    startAnimation,
    stopAnimation,
    setAnimating,
    setAnimationSpeed,
    setShowGrid,
    setShowAxes,
    setActive,
    setPointSize,
    setColor,
    setCaption,
    setConditionToShowObject,
    setLineThickness,
    setCoordSystem,
    exportXML,
    importXML,
    ggbRef,
    containerId
  };
}
