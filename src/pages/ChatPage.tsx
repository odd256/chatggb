import { useState, useRef, useCallback, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { ChatPanel } from "@/components/chat/ChatPanel";
import {
  GeoGebraBoard,
  type GeoGebraBoardHandle,
} from "@/components/canvas/GeoGebraBoard";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { BoardContext, type BoardAPI } from "@/contexts/BoardContext";
import type { GgbAppName } from "@/hooks/useGgbApplet";

interface ChatPageProps {
  onOpenSettings: () => void;
}

export function ChatPage({ onOpenSettings }: ChatPageProps) {
  const [appMode, setAppMode] = useState<GgbAppName>("graphing");
  const board2dRef = useRef<GeoGebraBoardHandle>(null);
  const board3dRef = useRef<GeoGebraBoardHandle>(null);

  const boardRef = appMode === "graphing" ? board2dRef : board3dRef;

  // Board API — all methods delegate to the active board ref
  const evalCommand = useCallback(
    (cmd: string) =>
      boardRef.current?.evalCommand(cmd) ?? {
        success: false,
        error: "Board not initialized",
      },
    [boardRef],
  );

  const resetCanvas = useCallback(
    () => boardRef.current?.reset(),
    [boardRef],
  );

  const getBoardState = useCallback(
    () => boardRef.current?.getBoardState() ?? [],
    [boardRef],
  );

  const setCoordSystem = useCallback(
    (xMin: number, xMax: number, yMin: number, yMax: number) =>
      boardRef.current?.setCoordSystem(xMin, xMax, yMin, yMax) ?? {
        success: false,
        error: "Board not initialized",
      },
    [boardRef],
  );

  const exportXML = useCallback(
    () => boardRef.current?.exportXML() ?? "",
    [boardRef],
  );

  const importXML = useCallback(
    (xml: string) => boardRef.current?.importXML(xml) ?? false,
    [boardRef],
  );

  // BoardContext value
  const boardAPI: BoardAPI = useMemo(
    () => ({
      evalCommand,
      getBoardState,
      resetCanvas,
      setCoordSystem,
      exportXML,
      importXML,
      mode: appMode,
    }),
    [
      evalCommand,
      getBoardState,
      resetCanvas,
      setCoordSystem,
      exportXML,
      importXML,
      appMode,
    ],
  );

  const handleToggleMode = useCallback(
    (mode: GgbAppName) => {
      if (mode === appMode) return;
      setAppMode(mode);
    },
    [appMode],
  );

  const handleClearBoard = useCallback(() => {
    boardRef.current?.reset();
  }, [boardRef]);

  return (
    <BoardContext.Provider value={boardAPI}>
      <div className="flex flex-col h-screen">
        <Header onClearBoard={handleClearBoard} />
        <div className="flex flex-1 min-h-0">
          <Sidebar appMode={appMode} />
          <div className="w-[30%] min-w-[300px] border-r">
            <ChatPanel
              onOpenSettings={onOpenSettings}
              appMode={appMode}
              onToggleMode={handleToggleMode}
            />
          </div>
          <div className="flex-1 relative">
            <div
              className={
                appMode === "graphing"
                  ? "absolute inset-0"
                  : "absolute inset-0 pointer-events-none invisible"
              }
            >
              <GeoGebraBoard
                ref={board2dRef}
                className="w-full h-full"
                appName="graphing"
              />
            </div>
            <div
              className={
                appMode === "3d"
                  ? "absolute inset-0"
                  : "absolute inset-0 pointer-events-none invisible"
              }
            >
              <GeoGebraBoard
                ref={board3dRef}
                className="w-full h-full"
                appName="3d"
              />
            </div>
          </div>
        </div>
      </div>
    </BoardContext.Provider>
  );
}
