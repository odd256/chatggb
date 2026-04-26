import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";
import { getTextFromParts } from "@/lib/ai";
import type { CommandResult } from "@/hooks/useStreamParser";

interface UIPart {
  type: string;
  text?: string;
}

interface MessageBubbleProps {
  role: "user" | "assistant" | "system";
  parts: UIPart[];
  explanation?: string;
  commandResults?: CommandResult[];
}

export function MessageBubble({
  role,
  parts,
  explanation,
  commandResults,
}: MessageBubbleProps) {
  const isUser = role === "user";
  const content = getTextFromParts(parts);

  return (
    <div
      className={cn(
        "flex flex-col mb-4",
        isUser ? "items-end" : "items-start",
      )}
    >
      <div
        className={cn(
          "max-w-[90%] rounded-lg px-3 py-2 text-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>
              {explanation || content || "..."}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {!isUser && commandResults && commandResults.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {commandResults.map((r, i) => (
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
          ))}
        </div>
      )}
    </div>
  );
}
