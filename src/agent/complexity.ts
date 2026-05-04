export type ComplexityLevel = 1 | 2 | 3;

const LEVEL3_KEYWORDS = [
  "动画", "animation", "animate", "slider", "滑块",
  "按钮", "button", "交互", "interactive", "逐步", "step by step",
  "状态切换", "控制", "暂停", "回退",
];

const LEVEL2_KEYWORDS = [
  "三角形", "triangle", "perpendicular", "垂直", "平行", "parallel",
  "相交", "intersection", "中点", "midpoint", "对称", "symmetry",
  "多边形", "polygon", "圆弧", "arc", "切线", "tangent",
];

export function detectComplexity(message: string): ComplexityLevel {
  const lower = message.toLowerCase();

  for (const kw of LEVEL3_KEYWORDS) {
    if (lower.includes(kw)) return 3;
  }

  let level2Hits = 0;
  for (const kw of LEVEL2_KEYWORDS) {
    if (lower.includes(kw)) level2Hits++;
  }
  if (level2Hits >= 2) return 2;

  // 多个对象名（大写字母作为对象名的启发式）
  const objectNames = message.match(/\b[A-Z][a-z]?\b/g);
  if (objectNames && objectNames.length >= 3) return 2;

  return 1;
}
