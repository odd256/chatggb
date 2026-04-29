import { z } from "zod";

export interface EvalResult {
  command: string;
  success: boolean;
  error?: string;
}

export function createGgbTools(
  evalCommand: (cmd: string) => { success: boolean; error?: string },
  getBoardState: () => any[],
  deleteObject: (name: string) => { success: boolean; error?: string },
  resetCanvas: () => void,
  undo: () => { success: boolean; error?: string },
  getSelectedObjects: () => string[]
) {
  return {
    evalCommand: {
      description: "执行一组 GeoGebra 命令以在画板上绘制图形",
      inputSchema: z.object({
        explanation: z.string().describe("中文简要描述你绘制的内容"),
        commands: z.array(z.string()).describe("GeoGebra 命令数组，按执行顺序排列"),
      }),
      execute: async ({ commands, explanation }: { commands: string[]; explanation: string }) => {
        const results: EvalResult[] = [];
        for (const cmd of commands) {
          const res = evalCommand(cmd);
          results.push({ command: cmd, ...res });
        }
        return { explanation, results };
      },
    },
    getBoardState: {
      description: "获取当前 GeoGebra 画板上所有的几何元素及其定义和当前值",
      inputSchema: z.object({}),
      execute: async () => {
        const objects = getBoardState();
        return { objects };
      },
    },
    deleteObject: {
      description: "从 GeoGebra 画板中删除指定的几何对象",
      inputSchema: z.object({
        name: z.string().describe("要删除的对象名称（如 A, eq1, poly1 等）"),
      }),
      execute: async ({ name }: { name: string }) => {
        const result = deleteObject(name);
        return result;
      },
    },
    resetCanvas: {
      description: "将 GeoGebra 画板重置到初始空白状态，删除所有已有的对象",
      inputSchema: z.object({}),
      execute: async () => {
        resetCanvas();
        return { success: true };
      },
    },
    undo: {
      description: "在 GeoGebra 画板中执行撤销（Undo）一步操作，恢复到上一个状态",
      inputSchema: z.object({}),
      execute: async () => {
        const result = undo();
        return result;
      },
    },
    getSelectedObjects: {
      description: "获取当前用户在 GeoGebra 画板中选中的几何对象的标签（名称）列表",
      inputSchema: z.object({}),
      execute: async () => {
        const objects = getSelectedObjects();
        return { objects };
      },
    },
  };
}
