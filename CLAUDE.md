# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

```bash
bun install          # Install dependencies
bun run dev          # Start Vite dev server (port 1420)
bun run build        # TypeScript check + Vite production build
bun run tauri dev    # Full Tauri desktop app (Vite + Rust backend)
bun run tauri build  # Build distributable desktop binary
```

No lint or test scripts are configured.

## Architecture

This is a **Tauri v2 desktop app** that combines an AI chat interface with embedded GeoGebra for mathematical visualization. Users describe what they want to draw in natural language; the AI returns GeoGebra commands which are executed on a live GeoGebra canvas.

### Tech Stack

- **Package manager:** Bun (lockfile is `bun.lock`)
- **Frontend:** React 19 + TypeScript + Vite 7
- **Desktop shell:** Tauri v2 (Rust backend for native window management and config persistence)
- **UI:** shadcn/ui (Radix Nova style) + Tailwind CSS v4 + Lucide icons
- **AI SDK:** Vercel AI SDK (`@ai-sdk/react`'s `useChat` + `@ai-sdk/openai`)
- **Math rendering:** GeoGebra (loaded at runtime via `/deployggb.js`)

### Data Flow: Chat → GeoGebra

```
User types message
  → ChatInput → ChatPanel.onSubmit
    → ChatSession.sendMessage (useChat from @ai-sdk/react)
      → TextStreamChatTransport (custom fetch wrapping OpenAI-compatible SSE)
        → AI streams back JSON: { explanation, commands: [...] }
          → useStreamParser extracts explanation + commands, deduplicates
            → evalCommand(cmd) → GeoGebraBoard → ggbApplet.evalCommand(cmd)
```

The AI responds in strict JSON with an `explanation` string and a `commands` array. The system prompts in [src/services/ai/prompts.ts](src/services/ai/prompts.ts) use a **category-based approach**: instead of listing individual commands, they provide GeoGebra command categories (Geometry, Conic, 3D, Transformation, Vector, Function, etc.) with brief descriptions, letting the LLM draw on its training knowledge to select specific commands within each category. The full command reference is sourced from the [GeoGebra documentation](https://geogebra.github.io/docs/manual/en/Commands/) (20 categories in total).

### Source Layout

```
src/
  main.tsx                  # React entry point
  App.tsx                   # Root component: 2D/3D mode switching, holds refs to both boards, ApiConfigContext provider
  App.css                   # Tailwind v4 imports, CSS variables (light/dark), prose styles
  components/
    chat/
      ChatPanel.tsx         # Chat UI container: creates transport, provider selector (2D/3D toggle)
      ChatSession.tsx       # Wraps useChat(), wires transport + dynamic system prompt per appMode
      MessageList.tsx       # Scrollable message list with auto-scroll, loading indicator
      MessageBubble.tsx     # Single message: user text or assistant markdown + command result badges
      ChatInput.tsx         # Textarea + send button, Enter to submit
    geogebra/
      GeoGebraBoard.tsx     # GeoGebra div/iframe, ResizeObserver size sync, loading/error states
    layout/
      Header.tsx            # Title bar with Tauri window controls (minimize/maximize/close) + clear/settings
    settings/
      SettingsDialog.tsx    # Provider selection, API key input, base URL override
    ui/                     # shadcn components: Button, Badge, Dialog, Input, Label, Textarea
  contexts/
    ApiConfigContext.tsx     # React context: provider, apiKey, baseUrl, loaded, saveConfig
  hooks/
    useApiKey.ts            # Tauri invoke("get_config"/"set_config") — Rust backend persists config to disk
    useGgbApplet.ts         # GeoGebra script loading (singleton), GGBApplet injection, evalCommand/reset
    useStreamParser.ts      # Parses streaming AI JSON, deduplicates commands, returns explanation + results
  services/
    ai/                     # Provider configs, system prompts (2D/3D), agent runner, tools
  lib/
    utils.ts                # cn() helper (clsx + tailwind-merge)
src-tauri/
  src/
    main.rs                 # Tauri entry point
    lib.rs                  # Tauri commands: get_config/set_config — reads/writes config.json in app data dir
```

### Key Patterns

- **Dual-mode 2D/3D:** `App.tsx` renders two `GeoGebraBoard` instances (graphing + 3D). Only the active mode is visible; the inactive one gets `pointer-events-none invisible`. Each mode has its own `ChatPanel` instance so chat history and system prompt match the active canvas.
- **Dynamic system prompts:** `ChatSession` accepts an `appMode` prop and calls `getSystemPrompt(appMode)` to populate the initial system message. `getSystemPrompt` returns `SYSTEM_PROMPT_2D` or `SYSTEM_PROMPT_3D` from [src/services/ai/prompts.ts](src/services/ai/prompts.ts).
- **Config persistence:** API keys and provider settings are stored via Tauri's Rust backend using `invoke("get_config")` / `invoke("set_config", ...)`. The Rust side reads/writes a `config.json` file in the Tauri app data directory, keyed by provider ID.
- **GeoGebra lifecycle:** The `deployggb.js` script is loaded once globally (singleton pattern in `useGgbApplet.ts`). On mode switch, the old GGBApplet instance is destroyed (`remove()`) and a new one is created with a fresh random container ID to avoid conflicts between instances.
- **SSE parsing:** The custom `parseOpenAiSseStream` function strips `data:` prefixes and extracts `choices[0].delta.content` from OpenAI-compatible SSE, yielding clean text chunks to the AI SDK's `TextStreamChatTransport`. This avoids depending on the AI SDK's built-in OpenAI transport.
- **No router:** Single-page desktop app — no routing library needed.

### AI Provider Configuration

All provider info is in [src/services/ai/config.ts](src/services/ai/config.ts). Four providers are supported: Kimi (default), GLM, DeepSeek, and OpenAI. Each has its own API endpoint, default model, and key acquisition URL. Users configure their provider, API key, and optional base URL override via the Settings dialog.

### Configuration Files

- **[components.json](components.json)** — shadcn/ui config: Radix Nova style, Lucide icons, CSS variables theming
- **[opencode.json](opencode.json)** — OpenCode agent config (DeepSeek provider with local endpoint)
- **[skills-lock.json](skills-lock.json)** — Locked versions for installed agent skills
