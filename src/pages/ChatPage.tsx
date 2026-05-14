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

  const deleteObject = useCallback(
    (name: string) =>
      boardRef.current?.deleteObject(name) ?? {
        success: false,
        error: "Board not initialized",
      },
    [boardRef],
  );

  const getSelectedObjects = useCallback(
    () => boardRef.current?.getSelectedObjects() ?? [],
    [boardRef],
  );

  const setValue = useCallback(
    (name: string, value: number) =>
      boardRef.current?.setValue(name, value) ?? {
        success: false,
        error: "Board not initialized",
      },
    [boardRef],
  );

  const setVisible = useCallback(
    (name: string, visible: boolean) =>
      boardRef.current?.setVisible(name, visible) ?? {
        success: false,
        error: "Board not initialized",
      },
    [boardRef],
  );

  const startAnimation = useCallback(
    () =>
      boardRef.current?.startAnimation() ?? {
        success: false,
        error: "Board not initialized",
      },
    [boardRef],
  );

  const stopAnimation = useCallback(
    () =>
      boardRef.current?.stopAnimation() ?? {
        success: false,
        error: "Board not initialized",
      },
    [boardRef],
  );

  const setAnimating = useCallback(
    (name: string, animating: boolean) =>
      boardRef.current?.setAnimating(name, animating) ?? {
        success: false,
        error: "Board not initialized",
      },
    [boardRef],
  );

  const setAnimationSpeed = useCallback(
    (name: string, speed: number) =>
      boardRef.current?.setAnimationSpeed(name, speed) ?? {
        success: false,
        error: "Board not initialized",
      },
    [boardRef],
  );

  const setShowGrid = useCallback(
    (visible: boolean) =>
      boardRef.current?.setShowGrid(visible) ?? {
        success: false,
        error: "Board not initialized",
      },
    [boardRef],
  );

  const setShowAxes = useCallback(
    (visible: boolean) =>
      boardRef.current?.setShowAxes(visible) ?? {
        success: false,
        error: "Board not initialized",
      },
    [boardRef],
  );

  const setActive = useCallback(
    (name: string, active: boolean) =>
      boardRef.current?.setActive(name, active) ?? {
        success: false,
        error: "Board not initialized",
      },
    [boardRef],
  );

  const setPointSize = useCallback(
    (name: string, size: number) =>
      boardRef.current?.setPointSize(name, size) ?? {
        success: false,
        error: "Board not initialized",
      },
    [boardRef],
  );

  const setColor = useCallback(
    (name: string, r: number, g: number, b: number) =>
      boardRef.current?.setColor(name, r, g, b) ?? {
        success: false,
        error: "Board not initialized",
      },
    [boardRef],
  );

  const setCaption = useCallback(
    (name: string, caption: string) =>
      boardRef.current?.setCaption(name, caption) ?? {
        success: false,
        error: "Board not initialized",
      },
    [boardRef],
  );

  const setConditionToShowObject = useCallback(
    (name: string, condition: string) =>
      boardRef.current?.setConditionToShowObject(name, condition) ?? {
        success: false,
        error: "Board not initialized",
      },
    [boardRef],
  );

  const setLineThickness = useCallback(
    (name: string, thickness: number) =>
      boardRef.current?.setLineThickness(name, thickness) ?? {
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
      deleteObject,
      resetCanvas,
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
      exportXML,
      importXML,
      mode: appMode,
    }),
    [
      evalCommand,
      getBoardState,
      deleteObject,
      resetCanvas,
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
