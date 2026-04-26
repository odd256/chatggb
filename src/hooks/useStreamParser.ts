import { useEffect, useRef, useState } from "react";
import { getTextFromParts } from "@/lib/ai";

export interface CommandResult {
  command: string;
  success: boolean;
  error?: string;
}

interface ParsedOutput {
  explanation: string;
  commands: string[];
}

interface UIPart {
  type: string;
  text?: string;
}

interface UIMessage {
  id: string;
  role: string;
  parts: UIPart[];
}

export function useStreamParser(
  messages: UIMessage[],
  evalCommand: (cmd: string) => { success: boolean; error?: string },
) {
  const [explanation, setExplanation] = useState("");
  const [commandResults, setCommandResults] = useState<CommandResult[]>([]);
  const lastParsedIndex = useRef(-1);
  const executedCommands = useRef<Set<string>>(new Set());

  useEffect(() => {
    for (let i = lastParsedIndex.current + 1; i < messages.length; i++) {
      const msg = messages[i];
      if (msg.role !== "assistant") continue;

      const content = getTextFromParts(msg.parts);
      if (!content) continue;

      try {
        const parsed: ParsedOutput = JSON.parse(content);
        if (parsed.explanation) {
          setExplanation(parsed.explanation);
        }
        if (Array.isArray(parsed.commands)) {
          for (const cmd of parsed.commands) {
            if (executedCommands.current.has(cmd)) continue;
            executedCommands.current.add(cmd);
            const result = evalCommand(cmd);
            setCommandResults((prev) => [
              ...prev,
              { command: cmd, ...result },
            ]);
          }
        }
        lastParsedIndex.current = i;
      } catch {
        // JSON 尚未完整，等待更多 chunk
      }
    }
  }, [messages, evalCommand]);

  const clearDisplay = () => {
    setExplanation("");
    setCommandResults([]);
  };

  return { explanation, commandResults, clearDisplay };
}
