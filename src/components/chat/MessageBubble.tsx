import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";
import { getTextFromParts } from "@/agent";

interface MessageBubbleProps {
  role: "user" | "assistant" | "system";
  parts: any[];
}

export function MessageBubble({
  role,
  parts,
}: MessageBubbleProps) {
  const isUser = role === "user";

  const textParts = parts.filter((p) => p.type === "text" || p.text);
  const textContent = getTextFromParts(textParts);

  // 按 toolCallId 分组工具调用和结果
  const groupedToolParts = (() => {
    const toolMap: Record<string, any> = {};
    parts.forEach((p) => {
      if (p.type === "tool-call" || p.type === "tool-result") {
        const id = p.toolCallId;
        if (!toolMap[id]) {
          toolMap[id] = { ...p, state: p.type === "tool-call" ? "call" : "result" };
        } else {
          Object.assign(toolMap[id], p);
          if (p.type === "tool-result") {
            toolMap[id].state = "result";
          }
        }
      }
    });
    return Object.values(toolMap);
  })();

  return (
    <div
      className={cn(
        "flex flex-col mb-4",
        isUser ? "items-end" : "items-start",
      )}
    >
      {textContent && (
        <div
          className={cn(
            "max-w-[90%] rounded-lg px-3 py-2 text-sm mb-2",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground",
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{textContent}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{textContent}</ReactMarkdown>
            </div>
          )}
        </div>
      )}

      {groupedToolParts?.map((toolInvocation) => {
        const { toolName, toolCallId, state } = toolInvocation;

        if (toolName === "evalCommand") {
          return (
            <div key={toolCallId} className="flex flex-col gap-2 max-w-[90%]">
              {state === "result" && toolInvocation.result?.explanation && (
                <div className="bg-muted text-foreground rounded-lg px-3 py-2 text-sm">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{toolInvocation.result.explanation}</ReactMarkdown>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-1 mt-1.5">
                {state === "call" ? (
                  <Badge variant="outline" className="text-xs text-muted-foreground animate-pulse">
                    正在绘制图形...
                  </Badge>
                ) : (
                  toolInvocation.result?.results?.map((r: any, i: number) => (
                    <Badge
                      key={`${r.command}-${i}`}
                      variant={r.success ? "default" : "destructive"}
                      className="text-xs gap-1 cursor-default"
                      title={r.error || r.command}
                    >
                      {r.success ? (
                        <CheckCircle className="size-3" />
                      ) : (
                        <XCircle className="size-3" />
                      )}
                      {r.command.length > 30
                        ? r.command.slice(0, 30) + "..."
                        : r.command}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          );
        }

        return (
          <div key={toolCallId} className="text-xs text-muted-foreground">
            {state === "call" ? `调用工具 ${toolName}...` : `完成工具 ${toolName}`}
          </div>
        );
      })}
    </div>
  );
}
