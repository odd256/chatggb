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
      `%c[execute_geogebra_commands] ${explanation} — ${failed.length}/${results.length} 条命令失败`,
      "color: #ef4444; font-weight: bold",
    );
    for (const r of failed) {
      console.log(`%c  ✗ ${r.command}`, "color: #ef4444", r.error);
    }
  } else {
    console.log(
      `%c[execute_geogebra_commands] ${explanation} — 全部 ${results.length} 条命令成功`,
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
    execute_geogebra_commands: {
      description:
        "执行一组 GeoGebra 命令以在画板上进行各种操作。支持所有合法的 GeoGebra Script 命令，包括：绘图命令（A = (1,2), Segment(A,B), Circle(O,1)）、属性设置（SetColor(A,255,0,0), SetVisible(A,true), SetPointSize(A,5)）、动画控制（StartAnimation(A,true), SetValue(slider,5)）、显示控制（ShowGrid(true), ShowAxes(true)）、删除（Delete(A)）、条件可见性（SetConditionToShowObject(circle1, step >= 1)）。所有命令都统一通过此工具执行。",
      inputSchema: z.object({
        explanation: z.string().describe("中文简要描述你当前执行的操作目的"),
        commands: z.array(z.string()).describe("GeoGebra 命令数组，按执行顺序排列。支持所有 GeoGebra Script 命令"),
      }),
      execute: async ({ commands, explanation }: { commands: string[]; explanation: string }) => {
        return logToolCallAsync("execute_geogebra_commands", { explanation, commands }, async () => {
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
    get_all_objects_info: {
      description: "获取当前 GeoGebra 画板上所有几何元素的名称、类型、定义和当前值。在执行绘图操作前应首先调用此工具了解画板当前状态。",
      inputSchema: z.object({}),
      execute: async () =>
        logToolCallAsync("get_all_objects_info", {}, async () => {
          const objects = board.getBoardState();
          return { objects };
        }),
    },
    get_object_value: {
      description: "通过名称获取单个 GeoGebra 对象的详细信息（类型、定义、当前值）。当用户询问特定对象的坐标、面积等数值时使用。",
      inputSchema: z.object({
        name: z.string().describe("要查询的对象名称，如 A, eq1, poly1, slider1 等"),
      }),
      execute: async ({ name }: { name: string }) =>
        logToolCallAsync("get_object_value", { name }, async () => {
          const objects = board.getBoardState();
          const obj = objects.find((o: any) => o.name === name);
          if (!obj) {
            return { error: `对象 "${name}" 不存在` };
          }
          return { object: obj };
        }),
    },
    set_viewport: {
      description: "调整 GeoGebra 画板的坐标系可视范围。分别设置 x 轴和 y 轴的最小/最大值来控制显示区域，确保图形完整显示在画布中。",
      inputSchema: z.object({
        xMin: z.number().describe("x 轴最小值"),
        xMax: z.number().describe("x 轴最大值"),
        yMin: z.number().describe("y 轴最小值"),
        yMax: z.number().describe("y 轴最大值"),
      }),
      execute: async ({ xMin, xMax, yMin, yMax }: { xMin: number; xMax: number; yMin: number; yMax: number }) =>
        logToolCallAsync("set_viewport", { xMin, xMax, yMin, yMax }, async () => {
          const res = board.setCoordSystem(xMin, xMax, yMin, yMax);
          if (!res.success) return res;
          return { success: true, viewport: { xMin, xMax, yMin, yMax } };
        }),
    },
    clear_canvas: {
      description: "清空 GeoGebra 画板上的所有对象，恢复到初始空白状态。仅在用户明确要求清空时使用。",
      inputSchema: z.object({}),
      execute: async () =>
        logToolCallAsync("clear_canvas", {}, async () => {
          board.resetCanvas();
          return { success: true };
        }),
    },
    search_category_command: {
      description:
        "检索属于某个特定分类的所有 GeoGebra 命令名称列表。可用的分类包括：3D_Commands, Algebra_Commands, Chart_Commands, Conic_Commands, Discrete_Math_Commands, Functions_and_Calculus_Commands, Geometry_Commands, GeoGebra_Commands, List_Commands, Logic_Commands, Optimization_Commands, Probability_Commands, Scripting_Commands, Spreadsheet_Commands, Statistics_Commands, Financial_Commands, Text_Commands, Transformation_Commands, Vector_and_Matrix_Commands, CAS_Specific_Commands",
      inputSchema: z.object({
        category: z.string().describe("分类名称，例如 'Geometry_Commands'"),
      }),
      execute: async ({ category }: { category: string }) =>
        logToolCallAsync("search_category_command", { category }, async () => {
          const categories = (commandsData as any).categories;
          if (!categories[category]) {
            return { error: `未找到该分类: ${category}。请确保使用了上方描述中列出的精确分类名称。` };
          }
          return { commands: categories[category] };
        }),
    },
    search_command_doc: {
      description:
        "检索某个具体 GeoGebra 命令的详细文档（包含命令签名、参数说明和使用样例）。在尝试使用不熟悉的 GeoGebra 命令前，请通过此工具获取准确的用法。",
      inputSchema: z.object({
        commandName: z.string().describe("具体的命令名称，例如 'Angle', 'FitLine', 'Intersect'"),
      }),
      execute: async ({ commandName }: { commandName: string }) =>
        logToolCallAsync("search_command_doc", { commandName }, async () => {
          const docs = (commandsData as any).docs;
          const exactKey = Object.keys(docs).find((k) => k.toLowerCase() === commandName.toLowerCase());
          if (!exactKey) {
            return { error: `未找到命令: ${commandName}` };
          }
          return { command: exactKey, doc: docs[exactKey] };
        }),
    },
  };
}
