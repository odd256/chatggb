import { z } from "zod";
import commandsData from "./geogebra-commands.json";
import type { BoardAPI } from "./agent";

export interface EvalResult {
  command: string;
  success: boolean;
  error?: string;
}

function logToolCallAsync<T>(toolName: string, input: any, fn: () => Promise<T>): Promise<T> {
  console.log(`%c[Tool Call] ${toolName}`, "color: #6366f1; font-weight: bold", input);
  return fn().then((result) => {
    console.log(`%c[Tool Result] ${toolName}`, "color: #22c55e", result);
    return result;
  });
}

function logEvalResults(explanation: string, results: EvalResult[]) {
  const failed = results.filter((r) => !r.success);
  if (failed.length > 0) {
    console.log(
      `%c[evalCommand] ${explanation} — ${failed.length}/${results.length} 条命令失败`,
      "color: #ef4444; font-weight: bold",
    );
    for (const r of failed) {
      console.log(`%c  ✗ ${r.command}`, "color: #ef4444", r.error);
    }
  } else {
    console.log(
      `%c[evalCommand] ${explanation} — 全部 ${results.length} 条命令成功`,
      "color: #22c55e",
    );
  }
  for (const r of results) {
    const style = r.success ? "color: #94a3b8" : "color: #ef4444; font-weight: bold";
    console.log(`%c  ${r.success ? "✓" : "✗"} ${r.command}`, style, r.success ? "" : r.error);
  }
}

export function createGgbTools(board: BoardAPI) {
  return {
    evalCommand: {
      description: "执行一组 GeoGebra 命令以在画板上绘制图形",
      inputSchema: z.object({
        explanation: z.string().describe("中文简要描述你绘制的内容"),
        commands: z.array(z.string()).describe("GeoGebra 命令数组，按执行顺序排列"),
      }),
      execute: async ({ commands, explanation }: { commands: string[]; explanation: string }) => {
        return logToolCallAsync("evalCommand", { explanation, commands }, async () => {
          const results: EvalResult[] = [];
          for (const cmd of commands) {
            const trimmed = cmd.trim();
            if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("#")) {
              results.push({ command: cmd, success: true });
              continue;
            }
            const res = board.evalCommand(cmd);
            results.push({ command: cmd, ...res });
          }
          logEvalResults(explanation, results);
          return { explanation, results };
        });
      },
    },
    getBoardState: {
      description: "获取当前 GeoGebra 画板上所有的几何元素及其定义和当前值",
      inputSchema: z.object({}),
      execute: async () => logToolCallAsync("getBoardState", {}, async () => {
        const objects = board.getBoardState();
        return { objects };
      }),
    },
    deleteObject: {
      description: "从 GeoGebra 画板中删除指定的几何对象",
      inputSchema: z.object({
        name: z.string().describe("要删除的对象名称（如 A, eq1, poly1 等）"),
      }),
      execute: async ({ name }: { name: string }) =>
        logToolCallAsync("deleteObject", { name }, async () => board.deleteObject(name)),
    },
    resetCanvas: {
      description: "将 GeoGebra 画板重置到初始空白状态，删除所有已有的对象",
      inputSchema: z.object({}),
      execute: async () => logToolCallAsync("resetCanvas", {}, async () => {
        board.resetCanvas();
        return { success: true };
      }),
    },
    getSelectedObjects: {
      description: "获取当前用户在 GeoGebra 画板中选中的几何对象的标签（名称）列表",
      inputSchema: z.object({}),
      execute: async () => logToolCallAsync("getSelectedObjects", {}, async () => {
        const objects = board.getSelectedObjects();
        return { objects };
      }),
    },
    setValue: {
      description: "设置 GeoGebra 对象（如滑块、数字、点等）的数值",
      inputSchema: z.object({
        name: z.string().describe("对象名称"),
        value: z.number().describe("要设置的数值"),
      }),
      execute: async ({ name, value }: { name: string; value: number }) =>
        logToolCallAsync("setValue", { name, value }, async () => board.setValue(name, value)),
    },
    setVisible: {
      description: "设置 GeoGebra 对象的可见性（显示或隐藏）",
      inputSchema: z.object({
        name: z.string().describe("对象名称"),
        visible: z.boolean().describe("是否可见"),
      }),
      execute: async ({ name, visible }: { name: string; visible: boolean }) =>
        logToolCallAsync("setVisible", { name, visible }, async () => board.setVisible(name, visible)),
    },
    startAnimation: {
      description: "开始播放画板上的动画。注意：只有被设置为 'animating' 状态的对象才会移动。",
      inputSchema: z.object({}),
      execute: async () => logToolCallAsync("startAnimation", {}, async () => board.startAnimation()),
    },
    stopAnimation: {
      description: "停止播放画板上的所有动画。",
      inputSchema: z.object({}),
      execute: async () => logToolCallAsync("stopAnimation", {}, async () => board.stopAnimation()),
    },
    setAnimating: {
      description: "设置某个对象是否参与动画。设为 true 后，当全局动画开始时该对象将自动移动（如滑块、点等）。",
      inputSchema: z.object({
        name: z.string().describe("对象名称"),
        animating: z.boolean().describe("是否开启该对象的动画属性"),
      }),
      execute: async ({ name, animating }: { name: string; animating: boolean }) =>
        logToolCallAsync("setAnimating", { name, animating }, async () => board.setAnimating(name, animating)),
    },
    setAnimationSpeed: {
      description: "设置某个对象的动画速度。注意：动画速度最好在创建 Slider 时通过 Speed 参数设定，此工具为运行时修改的备选方案。",
      inputSchema: z.object({
        name: z.string().describe("对象名称"),
        speed: z.number().describe("动画速度（如 1.0 为正常速度）"),
      }),
      execute: async ({ name, speed }: { name: string; speed: number }) =>
        logToolCallAsync("setAnimationSpeed", { name, speed }, async () => board.setAnimationSpeed(name, speed)),
    },
    setShowGrid: {
      description: "设置 GeoGebra 画板网格的显示或隐藏",
      inputSchema: z.object({
        visible: z.boolean().describe("是否显示网格"),
      }),
      execute: async ({ visible }: { visible: boolean }) =>
        logToolCallAsync("setShowGrid", { visible }, async () => board.setShowGrid(visible)),
    },
    setShowAxes: {
      description: "设置 GeoGebra 画板坐标轴的显示或隐藏",
      inputSchema: z.object({
        visible: z.boolean().describe("是否显示坐标轴"),
      }),
      execute: async ({ visible }: { visible: boolean }) =>
        logToolCallAsync("setShowAxes", { visible }, async () => board.setShowAxes(visible)),
    },
    setActive: {
      description: "设置 GeoGebra 对象是否处于激活状态。非激活状态的滑块不可拖动。",
      inputSchema: z.object({
        name: z.string().describe("对象名称"),
        active: z.boolean().describe("是否激活"),
      }),
      execute: async ({ name, active }: { name: string; active: boolean }) =>
        logToolCallAsync("setActive", { name, active }, async () => board.setActive(name, active)),
    },
    setPointSize: {
      description: "设置 GeoGebra 点对象的显示大小",
      inputSchema: z.object({
        name: z.string().describe("点对象名称"),
        size: z.number().describe("点的大小（1-9）"),
      }),
      execute: async ({ name, size }: { name: string; size: number }) =>
        logToolCallAsync("setPointSize", { name, size }, async () => board.setPointSize(name, size)),
    },
    setColor: {
      description: "设置 GeoGebra 对象的颜色",
      inputSchema: z.object({
        name: z.string().describe("对象名称"),
        r: z.number().describe("红色分量 (0-255)"),
        g: z.number().describe("绿色分量 (0-255)"),
        b: z.number().describe("蓝色分量 (0-255)"),
      }),
      execute: async ({ name, r, g, b }: { name: string; r: number; g: number; b: number }) =>
        logToolCallAsync("setColor", { name, r, g, b }, async () => board.setColor(name, r, g, b)),
    },
    setCaption: {
      description: "设置 GeoGebra 对象的文本标签（caption）",
      inputSchema: z.object({
        name: z.string().describe("对象名称"),
        caption: z.string().describe("标签文本"),
      }),
      execute: async ({ name, caption }: { name: string; caption: string }) =>
        logToolCallAsync("setCaption", { name, caption }, async () => board.setCaption(name, caption)),
    },
    setConditionToShowObject: {
      description: "设置 GeoGebra 对象的条件可见性。当条件表达式求值为 true 时对象可见，否则隐藏。例如：setConditionToShowObject('circle1', 'step >= 1')",
      inputSchema: z.object({
        name: z.string().describe("对象名称"),
        condition: z.string().describe("条件表达式，如 'step >= 1'"),
      }),
      execute: async ({ name, condition }: { name: string; condition: string }) =>
        logToolCallAsync("setConditionToShowObject", { name, condition }, async () => board.setConditionToShowObject(name, condition)),
    },
    setLineThickness: {
      description: "设置 GeoGebra 对象的线条粗细",
      inputSchema: z.object({
        name: z.string().describe("对象名称"),
        thickness: z.number().describe("线条粗细（1-13）"),
      }),
      execute: async ({ name, thickness }: { name: string; thickness: number }) =>
        logToolCallAsync("setLineThickness", { name, thickness }, async () => board.setLineThickness(name, thickness)),
    },
    searchCategoryCommand: {
      description: "检索属于某个特定分类的所有 GeoGebra 命令名称列表。可用的分类包括：3D_Commands, Algebra_Commands, Chart_Commands, Conic_Commands, Discrete_Math_Commands, Functions_and_Calculus_Commands, Geometry_Commands, GeoGebra_Commands, List_Commands, Logic_Commands, Optimization_Commands, Probability_Commands, Scripting_Commands, Spreadsheet_Commands, Statistics_Commands, Financial_Commands, Text_Commands, Transformation_Commands, Vector_and_Matrix_Commands, CAS_Specific_Commands",
      inputSchema: z.object({
        category: z.string().describe("分类名称，例如 'Geometry_Commands'"),
      }),
      execute: async ({ category }: { category: string }) =>
        logToolCallAsync("searchCategoryCommand", { category }, async () => {
          const categories = (commandsData as any).categories;
          if (!categories[category]) {
            return { error: `未找到该分类: ${category}。请确保使用了上方描述中列出的精确分类名称。` };
          }
          return { commands: categories[category] };
        }),
    },
    searchCommandDoc: {
      description: "检索某个具体 GeoGebra 命令的详细文档（包含命令签名、参数说明和使用样例）。在尝试使用复杂的 GeoGebra 命令前，请通过此工具获取准确的用法。",
      inputSchema: z.object({
        commandName: z.string().describe("具体的命令名称，例如 'Angle', 'FitLine', 'Intersect'"),
      }),
      execute: async ({ commandName }: { commandName: string }) =>
        logToolCallAsync("searchCommandDoc", { commandName }, async () => {
          const docs = (commandsData as any).docs;
          const exactKey = Object.keys(docs).find(k => k.toLowerCase() === commandName.toLowerCase());
          if (!exactKey) {
            return { error: `未找到命令: ${commandName}` };
          }
          return { command: exactKey, doc: docs[exactKey] };
        }),
    },
  };
}
