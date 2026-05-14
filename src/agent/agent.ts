import { createOpenAI } from "@ai-sdk/openai";
import { ToolLoopAgent, DirectChatTransport } from "ai";
import { getSystemPrompt } from "./prompts";
import { createGgbTools } from "./tools";
import type { ProviderConfig } from "./config";
import type { GgbAppName } from "@/hooks/useGgbApplet";

export interface BoardAPI {
  evalCommand: (cmd: string) => { success: boolean; error?: string };
  getBoardState: () => any[];
  resetCanvas: () => void;
  setCoordSystem: (xMin: number, xMax: number, yMin: number, yMax: number) => { success: boolean; error?: string };
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
