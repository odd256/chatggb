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

### 基本几何
- **Point(x,y)** — 创建点。Point({1,2}) → (1,2)。Point(Object,Param) 在对象上取点
- **Line(P1,P2)** — 过两点创建直线。Line(P, Direction) 过点且平行
- **Segment(P1,P2)** — 创建线段。Segment(P, L) 给定长度
- **Ray(P1,P2)** — 从P1过P2的射线
- **Circle(C,R)** — 圆心半径。Circle(C,P) 圆心+点。Circle(P1,P2,P3) 过三点
- **Polygon(P1,P2,...)** — 多边形。Polygon(list) 从点列表
- **PolyLine(P1,P2,...)** — 折线
- **Spline(P1,P2,...)** — 样条曲线

### 点与中点
- **Midpoint(P1,P2)** — 两点中点。Midpoint(Segment) 线段中点
- **Center(Conic)** — 圆锥曲线中心
- **Centroid(Polygon)** — 多边形重心
- **Intersect(O1,O2)** — 两对象交点。Intersect(O1,O2,Index) 第n个交点
- **PointIn(Region)** — 区域内的点
- **ClosestPoint(Obj, Point)** — 对象上最近点

### 线与垂线
- **PerpendicularLine(P, L)** — 过点作垂线
- **ParallelLine(P, L)** — 过点作平行线
- **PerpendicularBisector(P1,P2)** — 线段中垂线。或(Segment)
- **AngleBisector(P, Apex, P)** — 角平分线。或(Line, Line)
- **Tangent(P, Conic)** — 过点切线。Tangent(L, Conic) 平行于直线的切线

### 圆与弧
- **Arc(C, P1, P2)** — 从圆心+两点创建圆弧
- **Circumcircle(P1,P2,P3)** — 外接圆
- **Incircle(P1,P2,P3)** — 内切圆
- **Sector(C, P1, P2)** — 扇形
- **CircumscribedCircle(P1,P2,P3)** — 外接圆(同Circumcircle)

### 测量
- **Distance(P1,P2)** — 两点距离。Distance(P, L) 点到线距离
- **Angle(V1,V2)** — 两向量角度。Angle(L1,L2) 两线角度。Angle(P,Apex,P) 三点角度
- **Area(Polygon)** — 多边形面积。Area(Conic) 圆/椭圆面积
- **Length(Object)** — 对象长度
- **Perimeter(Polygon)** — 周长
- **Radius(Circle)** — 圆半径
- **Circumference(Conic)** — 圆周长
- **Slope(Line)** — 直线斜率

### 变换
- **Reflect(O, Point/Line)** — 关于点或线反射
- **Rotate(O, Angle)** — 绕原点旋转。Rotate(O, Angle, Center) 绕指定点旋转
- **Translate(O, Vector)** — 按向量平移
- **Dilate(O, Factor, Center)** — 以指定点为中心缩放
- **Vector(P1,P2)** — 从P1到P2的向量。Vector(P) 位置向量
- **UnitVector(V/Line)** — 单位向量

### 函数与表达式
- **Function(f, a, b)** — 定义函数，a,b为区间起止
- **If(condition, then, else)** — 条件表达式
- **Text("text", Point)** — 在点处显示文本
- **Slider(min, max, step)** — 创建滑块
- **Button()** — 创建空白按钮
- **Button("label")** — 创建带文字按钮（只有1个参数）

## 重要规则
- 用英文逗号分隔参数，不能用中文逗号
- 点坐标用小括号: (x, y)，不能用中文括号
- 每个命令单独一行，按绘图顺序排列
- 变量名用大写字母（A, B, C...）
- 3D 坐标格式: A = (x, y, z)

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

## 常用命令语法参考

### 3D 基本几何
- **Point(x,y,z)** — 三维点
- **Line(P1,P2)** — 过两点直线（支持3D点）
- **Segment(P1,P2)** — 线段（支持3D）
- **Plane(P1,P2,P3)** — 过三点平面。Plane(P, L) 点+法线
- **Polygon(P1,P2,...)** — 平面多边形（3D点需共面）

### 3D 立体
- **Sphere(C, R)** — 球体
- **Cone(BottomCenter, Top, R)** — 圆锥
- **Cylinder(Bottom1, Bottom2, R)** — 圆柱
- **Cube(P1, P2)** — 立方体（对角线顶点）
- **Tetrahedron(P1,P2,P3,P4)** — 四面体
- **Prism(BasePolygon, HeightVector)** — 棱柱
- **Pyramid(BasePolygon, Top)** — 棱锥
- **Polyhedron(PointsList)** — 多面体

### 测量与变换
- **Distance(P1,P2)** — 3D距离。Distance(P, Plane) 点到面
- **Angle(V1,V2)** — 向量角度。Angle(L1,L2) 线角度。Angle(Plane1, Plane2) 面角度
- **Angle(P1, Apex, P2, Direction)** — 3D定向角度
- **Reflect(O, Plane)** — 关于平面镜像
- **Rotate(O, Angle, Axis)** — 绕轴旋转
- **Translate(O, Vector)** — 3D平移
- **Vector(P1,P2)** — 3D向量

### 曲面
- **Surface(expr, u,a,b, v,c,d)** — 参数曲面
- **Intersect(Obj1, Obj2)** — 相交曲线/点
- **IntersectPath(Plane, Solid)** — 截交线
- **Net(Polyhedron, FaceIndex)** — 展开图

## 重要规则
- 用英文逗号分隔参数，不能用中文逗号
- 3D 坐标用小括号: (x, y, z)
- 每个命令单独一行，按绘图顺序排列
- 变量名用大写字母（A, B, C...）

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
