export function getTextFromParts(
  parts: Array<{ type: string; text?: string }>,
): string {
  return parts
    .filter((p) => p.type === "text" || p.text) // 兼容不同版本的 parts 结构
    .map((p) => p.text || (p as any).content || "")
    .join("");
}
