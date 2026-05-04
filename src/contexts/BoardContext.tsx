import { createContext, useContext } from "react";
import type { BoardAPI } from "@/agent";

export type { BoardAPI };

export const BoardContext = createContext<BoardAPI | null>(null);

export function useBoardAPI(): BoardAPI {
  const ctx = useContext(BoardContext);
  if (!ctx) {
    throw new Error("useBoardAPI must be used within a BoardContext.Provider");
  }
  return ctx;
}
