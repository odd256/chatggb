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
  const [appMode, setAppMode] = useState<GgbAppName>("graphing");
  const board2dRef = useRef<GeoGebraBoardHandle>(null);
  const board3dRef = useRef<GeoGebraBoardHandle>(null);
  const { provider, apiKey, baseUrl, loaded, saveConfig } = useApiKey();
  const hasPromptedSettings = useRef(false);

  useEffect(() => {
    if (!hasPromptedSettings.current && loaded && !apiKey) {
      setSettingsOpen(true);
      hasPromptedSettings.current = true;
    }
  }, [loaded, apiKey]);

  const evalCommand = useCallback((cmd: string) => {
    const ref = appMode === "graphing" ? board2dRef : board3dRef;
    return ref.current?.evalCommand(cmd) ?? { success: false, error: "Board not initialized" };
  }, [appMode]);

  const handleClearBoard = useCallback(() => {
    (appMode === "graphing" ? board2dRef : board3dRef).current?.reset();
  }, [appMode]);

  const handleToggleMode = useCallback((mode: GgbAppName) => {
    if (mode === appMode) return;
    setAppMode(mode);
  }, [appMode]);

  return (
    <ApiConfigContext.Provider
      value={{ provider, apiKey, baseUrl, loaded, saveConfig }}
    >
      <div className="flex flex-col h-screen">
        <Header
          onOpenSettings={() => setSettingsOpen(true)}
          onClearBoard={handleClearBoard}
        />
        <div className="flex flex-1 min-h-0">
          <div className="w-[30%] min-w-[300px] border-r">
            <div className={appMode === "graphing" ? "h-full" : "hidden"}>
              <ChatPanel
                evalCommand={evalCommand}
                onOpenSettings={() => setSettingsOpen(true)}
                appMode="graphing"
                onToggleMode={handleToggleMode}
              />
            </div>
            <div className={appMode === "3d" ? "h-full" : "hidden"}>
              <ChatPanel
                evalCommand={evalCommand}
                onOpenSettings={() => setSettingsOpen(true)}
                appMode="3d"
                onToggleMode={handleToggleMode}
              />
            </div>
          </div>
          <div className="flex-1 relative">
            <div className={appMode === "graphing" ? "absolute inset-0" : "absolute inset-0 pointer-events-none invisible"}>
              <GeoGebraBoard ref={board2dRef} className="w-full h-full" appName="graphing" />
            </div>
            <div className={appMode === "3d" ? "absolute inset-0" : "absolute inset-0 pointer-events-none invisible"}>
              <GeoGebraBoard ref={board3dRef} className="w-full h-full" appName="3d" />
            </div>
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
