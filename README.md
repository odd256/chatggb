# ChatGGB

ChatGGB 是一款结合了人工智能（AI）与 GeoGebra 的智能数学绘图工具。用户可以通过自然语言描述来生成复杂的几何图形，无论是 2D 几何还是 3D 建模。

## ✨ 特性

- **自然语言绘图**：只需输入“画一个半径为 3 的球体”或“绘制一个直角三角形”，AI 即可自动生成 GeoGebra 命令并实时渲染。
- **多模式支持**：支持 2D 几何绘图（Graphing）和 3D 三维建模。
- **多模型集成**：支持 Kimi、智谱 GLM、DeepSeek 及 OpenAI 等多种 AI 模型。
- **跨平台体验**：基于 Tauri 构建，提供原生桌面应用体验。
- **实时交互**：支持在对话框中直接修改和调整生成的图形。

## 🛠️ 技术栈

- **前端**：React 19 + TypeScript + Vite
- **UI 组件**：Tailwind CSS v4 + Shadcn UI + Lucide Icons
- **AI 框架**：Vercel AI SDK
- **后端/桌面**：Tauri v2 (Rust)
- **数学引擎**：GeoGebra Web API

## 🚀 快速开始

### 1. 安装依赖

确保你已经安装了 [Node.js](https://nodejs.org/) 和 [Rust](https://www.rust-lang.org/) 环境。

```bash
bun install
```

### 2. 运行桌面应用

```bash
bun run tauri dev
```

## ⚙️ 配置

首次运行应用时，请在设置界面配置你的 AI 提供商及 API Key。
目前支持以下渠道：
- **Kimi (月之暗面)**
- **智谱 GLM**
- **DeepSeek**
- **OpenAI**

## 🗺️ 路线图 (TODOs)

- [ ] 引入更多 GeoGebra 知识库以提升复杂场景下的生成质量。
- [ ] 支持导出生成的 GeoGebra 文件 (.ggb)。
- [ ] 增加更多自定义绘图参数的 UI 调节面板。