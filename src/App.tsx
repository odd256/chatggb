import { useState, useRef, useCallback, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { ChatPanel } from "@/components/chat/ChatPanel";
import {
  GeoGebraBoard,
  type GeoGebraBoardHandle,
} from "@/components/geogebra/GeoGebraBoard";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { useApiKey } from "@/hooks/useApiKey";
import { ApiConfigContext } from "@/contexts/ApiConfigContext";
import type { GgbAppName } from "@/hooks/useGgbApplet";
import "./App.css";

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  // 全局画板模式："graphing" = 2D，"3d" = 三维
  const [appMode, setAppMode] = useState<GgbAppName>("graphing");
  const boardRef = useRef<GeoGebraBoardHandle>(null);
  const { provider, apiKey, baseUrl, loaded, saveConfig } = useApiKey();
  const hasPromptedSettings = useRef(false);

  useEffect(() => {
    if (!hasPromptedSettings.current && loaded && !apiKey) {
      setSettingsOpen(true);
      hasPromptedSettings.current = true;
    }
  }, [loaded, apiKey]);

  const evalCommand = useCallback((cmd: string) => {
    if (boardRef.current) {
      return boardRef.current.evalCommand(cmd);
    }
    return { success: false, error: "Board not initialized" };
  }, []);

  const handleClearBoard = useCallback(() => {
    boardRef.current?.reset();
  }, []);

  // 切换模式时清空画板（2D/3D 对象不兼容）
  const handleToggleMode = useCallback((mode: GgbAppName) => {
    if (mode === appMode) return;
    setAppMode(mode);
    // GeoGebraBoard 会因 appName 变化而重新挂载，自动清空
  }, [appMode]);

  return (
    <ApiConfigContext.Provider
      value={{ provider, apiKey, baseUrl, loaded, saveConfig }}
    >
      <div className="flex flex-col h-screen">
        <Header
          onOpenSettings={() => setSettingsOpen(true)}
          onClearBoard={handleClearBoard}
          appMode={appMode}
          onToggleMode={handleToggleMode}
        />
        <div className="flex flex-1 min-h-0">
          <div className="w-[30%] min-w-[300px] border-r">
            <ChatPanel
              evalCommand={evalCommand}
              onOpenSettings={() => setSettingsOpen(true)}
              appMode={appMode}
            />
          </div>
          <div className="flex-1">
            <GeoGebraBoard ref={boardRef} className="w-full h-full" appName={appMode} />
          </div>
        </div>
        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          provider={provider}
          apiKey={apiKey}
          baseUrl={baseUrl}
          onSave={saveConfig}
        />
      </div>
    </ApiConfigContext.Provider>
  );
}

export default App;
