import { TextStreamChatTransport } from "ai";
import type { GgbAppName } from "@/hooks/useGgbApplet";

export interface ProviderConfig {
  id: string;
  name: string;
  api: string;
  model: string;
  getKeyUrl: string;
}

export const PROVIDERS: ProviderConfig[] = [
  {
    id: "kimi",
    name: "Kimi (月之暗面)",
    api: "https://api.moonshot.cn/v1/chat/completions",
    model: "moonshot-v1-8k",
    getKeyUrl: "https://platform.moonshot.cn/console/api-keys",
  },
  {
    id: "glm",
    name: "智谱 GLM",
    api: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    model: "glm-4-flash",
    getKeyUrl: "https://open.bigmodel.cn/usercenter/apikeys",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    api: "https://api.deepseek.com/v1/chat/completions",
    model: "deepseek-chat",
    getKeyUrl: "https://platform.deepseek.com/api_keys",
  },
  {
    id: "openai",
    name: "OpenAI",
    api: "https://api.openai.com/v1/chat/completions",
    model: "gpt-4o",
    getKeyUrl: "https://platform.openai.com/api-keys",
  },
];

export function getProvider(id: string): ProviderConfig | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

export const SYSTEM_PROMPT_2D = `你是一个 GeoGebra 几何绘图助手。根据用户的自然语言描述，生成 GeoGebra 命令来绘制图形。

## 输出格式
你必须严格以 JSON 格式回复，不包含任何其他内容：

{
  "explanation": "简短说明你正在绘制什么（中文）",
  "commands": ["GeoGebra命令1", "GeoGebra命令2", "..."]
}

## 规则
- commands 数组中的每条命令都是有效的 GeoGebra 命令
- 使用标准笛卡尔坐标系，点用大写字母命名（A, B, C...）
- 如果用户要求修改已有图形，基于已有元素追加命令
- 坐标使用小数或整数，精确到合理范围
- explanation 用中文简要描述你绘制的内容

## 常用命令语法参考
- **Button()** — 创建空白按钮
- **Button(<标注>)** — 创建带文字标注的按钮，如 Button("开始演示")
- 注意：Button 命令最多只有 1 个参数，不要传入第 2 个参数

## 示例
用户："画一个直角三角形"

{
  "explanation": "绘制一个直角三角形，直角在点 A",
  "commands": [
    "A = (0, 0)",
    "B = (4, 0)",
    "C = (0, 3)",
    "Polygon(A, B, C)"
  ]
}`;

export const SYSTEM_PROMPT_3D = `你是一个 GeoGebra 3D 几何绘图助手。根据用户的自然语言描述，生成 GeoGebra 3D 命令来绘制三维图形。

## 输出格式
你必须严格以 JSON 格式回复，不包含任何其他内容：

{
  "explanation": "简短说明你正在绘制什么（中文）",
  "commands": ["GeoGebra命令1", "GeoGebra命令2", "..."]
}

## 规则
- commands 数组中的每条命令都是有效的 GeoGebra 3D 命令
- 使用三维坐标系，点用大写字母命名（A, B, C...）
- 三维坐标格式：A = (x, y, z)
- 如果用户要求修改已有图形，基于已有元素追加命令
- 坐标使用小数或整数，精确到合理范围
- explanation 用中文简要描述你绘制的内容

## 常用 3D 命令语法参考
- **点**：A = (1, 2, 3)
- **球体**：Sphere(<圆心>, <半径>)，如 Sphere((0,0,0), 2)
- **圆柱**：Cylinder(<底面圆心1>, <底面圆心2>, <半径>)
- **圆锥**：Cone(<底面圆心>, <顶点>, <半径>)
- **棱柱**：Prism(<多边形底面>, <高度向量>)
- **棱锥**：Pyramid(<多边形底面>, <顶点>)
- **平面**：Plane(<点A>, <点B>, <点C>)
- **向量**：v = Vector((0,0,0), (1,2,3))
- **旋转曲面**：Surface(<表达式>, <参数1范围>, <参数2范围>)
- **多面体**：Polyhedron(<顶点列表>)

## 示例
用户："画一个球体"

{
  "explanation": "在原点绘制一个半径为 2 的球体",
  "commands": [
    "O = (0, 0, 0)",
    "Sphere(O, 2)"
  ]
}

用户："画一个正方体"

{
  "explanation": "绘制一个边长为 2 的正方体",
  "commands": [
    "A = (0, 0, 0)",
    "B = (2, 0, 0)",
    "C = (2, 2, 0)",
    "D = (0, 2, 0)",
    "bottom = Polygon(A, B, C, D)",
    "Prism(bottom, (0, 0, 2))"
  ]
}`;

// 根据当前模式返回对应的 System Prompt
export function getSystemPrompt(mode: GgbAppName): string {
  return mode === "3d" ? SYSTEM_PROMPT_3D : SYSTEM_PROMPT_2D;
}

// 兼容旧代码，默认导出 2D prompt
export const SYSTEM_PROMPT = SYSTEM_PROMPT_2D;

function parseOpenAiSseStream(
  response: Response,
): ReadableStream<Uint8Array> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      const text = decoder.decode(value, { stream: true });
      const lines = text.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") continue;
        try {
          const json = JSON.parse(data);
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) {
            controller.enqueue(encoder.encode(delta));
          }
        } catch {
          // skip unparseable lines
        }
      }
    },
  });
}

export function createChatTransport(
  apiKey: string,
  provider: ProviderConfig,
  baseUrl?: string,
) {
  const api = baseUrl || provider.api;

  return new TextStreamChatTransport({
    api,
    fetch: async (_url, init) => {
      const reqBody = init?.body ? JSON.parse(init.body as string) : {};
      const rawMessages = reqBody.messages || [];

      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: provider.model,
          messages: rawMessages.map(
            (m: {
              role: string;
              parts?: Array<{ type: string; text?: string }>;
              content?: string;
            }) => ({
              role: m.role,
              content:
                m.content ||
                (m.parts || [])
                  .filter((p) => p.type === "text")
                  .map((p) => p.text || "")
                  .join(""),
            }),
          ),
          stream: true,
        }),
        signal: init?.signal as AbortSignal | undefined,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `HTTP ${response.status}`);
      }

      return new Response(parseOpenAiSseStream(response));
    },
  });
}

export function getTextFromParts(
  parts: Array<{ type: string; text?: string }>,
): string {
  return parts
    .filter((p) => p.type === "text")
    .map((p) => p.text || "")
    .join("");
}
