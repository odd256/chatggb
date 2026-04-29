import { createOpenAI } from "@ai-sdk/openai";
import { ToolLoopAgent, DirectChatTransport } from "ai";
import { getSystemPrompt } from "./prompts";
import { createGgbTools } from "./tools";
import type { ProviderConfig } from "./config";
import type { GgbAppName } from "@/hooks/useGgbApplet";

export function createAgentTransport(
  apiKey: string,
  provider: ProviderConfig,
  baseUrl: string | undefined,
  evalCommand: (cmd: string) => { success: boolean; error?: string },
  getBoardState: () => any[],
  deleteObject: (name: string) => { success: boolean; error?: string },
  resetCanvas: () => void,
  undo: () => { success: boolean; error?: string },
  getSelectedObjects: () => string[],
  appMode: GgbAppName,
) {
  // 剔除旧 API 遗留路径以匹配 createOpenAI
  const apiEndpoint = (baseUrl || provider.api).replace(/\/chat\/completions$/, "");

  const openai = createOpenAI({
    apiKey,
    baseURL: apiEndpoint,
  });

  const agent = new ToolLoopAgent({
    model: openai.chat(provider.model),
    instructions: getSystemPrompt(appMode),
    tools: createGgbTools(evalCommand, getBoardState, deleteObject, resetCanvas, undo, getSelectedObjects),
  });

  return new DirectChatTransport({ agent });
}
