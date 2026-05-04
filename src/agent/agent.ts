import { createOpenAI } from "@ai-sdk/openai";
import { ToolLoopAgent, DirectChatTransport } from "ai";
import { getSystemPrompt } from "./prompts";
import { createGgbTools } from "./tools";
import type { ProviderConfig } from "./config";
import type { GgbAppName } from "@/hooks/useGgbApplet";

export interface BoardAPI {
  evalCommand: (cmd: string) => { success: boolean; error?: string };
  getBoardState: () => any[];
  deleteObject: (name: string) => { success: boolean; error?: string };
  resetCanvas: () => void;
  undo: () => { success: boolean; error?: string };
  redo: () => { success: boolean; error?: string };
  getSelectedObjects: () => string[];
  setValue: (name: string, value: number) => { success: boolean; error?: string };
  setVisible: (name: string, visible: boolean) => { success: boolean; error?: string };
  startAnimation: () => { success: boolean; error?: string };
  stopAnimation: () => { success: boolean; error?: string };
  setAnimating: (name: string, animating: boolean) => { success: boolean; error?: string };
  setAnimationSpeed: (name: string, speed: number) => { success: boolean; error?: string };
  setShowGrid: (visible: boolean) => { success: boolean; error?: string };
  setShowAxes: (visible: boolean) => { success: boolean; error?: string };
  setActive: (name: string, active: boolean) => { success: boolean; error?: string };
  setPointSize: (name: string, size: number) => { success: boolean; error?: string };
  setColor: (name: string, r: number, g: number, b: number) => { success: boolean; error?: string };
  setCaption: (name: string, caption: string) => { success: boolean; error?: string };
  setConditionToShowObject: (name: string, condition: string) => { success: boolean; error?: string };
  setLineThickness: (name: string, thickness: number) => { success: boolean; error?: string };
  exportXML: () => string;
  importXML: (xml: string) => boolean;
  mode: GgbAppName;
}

export function createAgentTransport(
  apiKey: string,
  provider: ProviderConfig,
  baseUrl: string | undefined,
  board: BoardAPI,
) {
  const apiEndpoint = (baseUrl || provider.api).replace(/\/chat\/completions$/, "");

  const openai = createOpenAI({
    apiKey,
    baseURL: apiEndpoint,
  });

  const agent = new ToolLoopAgent({
    model: openai.chat(provider.model),
    instructions: getSystemPrompt(board.mode),
    tools: createGgbTools(board),
  });

  return new DirectChatTransport({ agent });
}
