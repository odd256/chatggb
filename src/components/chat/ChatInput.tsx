import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  disabled: boolean;
  disabledReason?: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ChatInput({
  input,
  isLoading,
  disabled,
  disabledReason,
  onChange,
  onSubmit,
}: ChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="border-t p-3">
      <div className="flex gap-2 items-end">
        <Textarea
          value={input}
          onChange={(e) => onChange(e.target.value)}
          placeholder={disabledReason || "用自然语言描述你想绘制的图形..."}
          disabled={disabled}
          className="min-h-[60px] max-h-[120px] resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (input.trim() && !disabled && !isLoading) {
                onSubmit(e as unknown as React.FormEvent);
              }
            }
          }}
        />
        <Button
          type="submit"
          size="icon-lg"
          disabled={disabled || isLoading || !input.trim()}
          title={disabledReason}
        >
          <Send />
        </Button>
      </div>
    </form>
  );
}
