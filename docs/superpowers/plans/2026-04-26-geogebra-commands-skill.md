# Geogebra Commands Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a build script that scrapes the GeoGebra manual's command reference and generates a skill + injects core commands into the AI system prompt.

**Architecture:** A one-shot Bun script parses ~500 `.adoc` command files from the `geogebra/manual` GitHub repo and produces a compressed `SKILL.md` skill and a system prompt quick-reference snippet.

**Tech Stack:** Bun, Node.js built-in `fetch` and `fs`, TypeScript (existing project)

---

### Task 1: Create build script skeleton

**Files:**
- Create: `scripts/build-geogebra-skill.mjs`

- [ ] **Step 1: Write the skeleton script**

```javascript
#!/usr/bin/env bun

const REPO = "geogebra/manual";
const COMMANDS_API = `https://api.github.com/repos/${REPO}/contents/en/modules/ROOT/pages/commands`;
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/main/en/modules/ROOT/pages/commands`;

const CATEGORY_FILES = [
  "3D_Commands.adoc",
  "Algebra_Commands.adoc",
  "Chart_Commands.adoc",
  "Conic_Commands.adoc",
  "Discrete_Math_Commands.adoc",
  "Functions_and_Calculus_Commands.adoc",
  "Geometry_Commands.adoc",
  "GeoGebra_Commands.adoc",
  "List_Commands.adoc",
  "Logic_Commands.adoc",
  "Optimization_Commands.adoc",
  "Probability_Commands.adoc",
  "Scripting_Commands.adoc",
  "Spreadsheet_Commands.adoc",
  "Statistics_Commands.adoc",
  "Financial_Commands.adoc",
  "Text_Commands.adoc",
  "Transformation_Commands.adoc",
  "Vector_and_Matrix_Commands.adoc",
  "CAS_Specific_Commands.adoc",
];

// Display names for categories (friendly names for SKILL.md headings)
const CATEGORY_NAMES = {
  "3D_Commands": "3D Commands",
  "Algebra_Commands": "Algebra Commands",
  "Chart_Commands": "Chart Commands",
  "Conic_Commands": "Conic Commands",
  "Discrete_Math_Commands": "Discrete Math Commands",
  "Functions_and_Calculus_Commands": "Function & Calculus Commands",
  "Geometry_Commands": "Geometry Commands",
  "GeoGebra_Commands": "GeoGebra Commands",
  "List_Commands": "List Commands",
  "Logic_Commands": "Logic Commands",
  "Optimization_Commands": "Optimization Commands",
  "Probability_Commands": "Probability Commands",
  "Scripting_Commands": "Scripting Commands",
  "Spreadsheet_Commands": "Spreadsheet Commands",
  "Statistics_Commands": "Statistics Commands",
  "Financial_Commands": "Financial Commands",
  "Text_Commands": "Text Commands",
  "Transformation_Commands": "Transformation Commands",
  "Vector_and_Matrix_Commands": "Vector & Matrix Commands",
  "CAS_Specific_Commands": "CAS Specific Commands",
};

const SKILL_PATH = new URL("../.agents/skills/geogebra-commands/SKILL.md", import.meta.url).pathname;
const JSON_PATH = new URL("../scripts/geogebra-commands.json", import.meta.url).pathname;

async function main() {
  console.log("Fetching command file list...");
  const fileList = await fetchFileList();

  const categoryFiles = fileList.filter(f => CATEGORY_FILES.includes(f.name));
  const commandFiles = fileList.filter(f =>
    f.name.endsWith(".adoc") && !CATEGORY_FILES.includes(f.name)
  );

  console.log(`Found ${commandFiles.length} command files, ${categoryFiles.length} category files`);

  // Parse category overviews to get command → category mapping
  const commandToCategory = await buildCategoryMap(categoryFiles);

  // Parse all individual command files
  const commands = [];
  for (const file of commandFiles) {
    const content = await fetchRawFile(file);
    const parsed = parseCommandFile(file.name.replace(".adoc", ""), content);
    if (parsed) {
      parsed.category = commandToCategory[parsed.name] || "Uncategorized";
      commands.push(parsed);
    }
  }

  // Write JSON intermediate
  const structured = groupByCategory(commands);
  Bun.write(JSON_PATH, JSON.stringify(structured, null, 2));
  console.log(`Written ${JSON_PATH}`);

  // Write SKILL.md
  const skillMd = generateSkillMd(structured);
  await Bun.write(SKILL_PATH, skillMd);
  console.log(`Written ${SKILL_PATH}`);

  // Print system prompt snippet
  console.log("\n=== System Prompt Snippet ===");
  console.log(generateSystemPromptSnippet(commands));
}

async function fetchFileList() {
  const res = await fetch(COMMANDS_API, {
    headers: { "Accept": "application/vnd.github.v3+json" },
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  return res.json();
}

async function fetchRawFile(file) {
  if (file._content) return file._content;
  const url = `${RAW_BASE}/${file.name}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${file.name}: ${res.status}`);
  return res.text();
}

main().catch(err => {
  console.error("Build failed:", err);
  process.exit(1);
});
```

- [ ] **Step 2: Verify skeleton runs (will fail on missing functions)**

Run: `bun run scripts/build-geogebra-skill.mjs`
Expected: ReferenceError for `buildCategoryMap`, `parseCommandFile`, `groupByCategory`, `generateSkillMd`, `generateSystemPromptSnippet`

- [ ] **Step 3: Commit**

```bash
git add scripts/build-geogebra-skill.mjs
git commit -m "feat: add build-geogebra-skill script skeleton"
```

---

### Task 2: Implement category parser

**Files:**
- Modify: `scripts/build-geogebra-skill.mjs` (append functions)

- [ ] **Step 1: Add `buildCategoryMap` function**

Insert after `main()` and before the `main().catch(...)` line:

```javascript
async function buildCategoryMap(categoryFiles) {
  const mapping = {};
  for (const file of categoryFiles) {
    const content = await fetchRawFile(file);
    const lines = content.split("\n");
    // Category key from filename: "Algebra_Commands.adoc" → "Algebra_Commands"
    const categoryKey = file.name.replace(".adoc", "");

    for (const line of lines) {
      // Match: * xref:/commands/AreEqual.adoc[AreEqual]
      const match = line.match(/^\* xref:\/commands\/(\w+)\.adoc\[/);
      if (match) {
        mapping[match[1]] = categoryKey;
      }
    }
  }
  return mapping;
}
```

- [ ] **Step 2: Verify category mapping works**

Add temporary debug output before `const commands = []`:

```javascript
console.log("Category map sample:", Object.entries(commandToCategory).slice(0, 5));
```

Run: `bun run scripts/build-geogebra-skill.mjs`
Expected: See output like `[['AreEqual', 'Algebra_Commands'], ...]`

- [ ] **Step 3: Remove debug output and commit**

```bash
git add scripts/build-geogebra-skill.mjs
git commit -m "feat: implement category mapping parser"
```

---

### Task 3: Implement individual command file parser

**Files:**
- Modify: `scripts/build-geogebra-skill.mjs` (append `parseCommandFile`)

- [ ] **Step 1: Add `parseCommandFile` function**

```javascript
function parseCommandFile(name, content) {
  const lines = content.split("\n");

  // Verify title matches
  const titleLine = lines.find(l => l.startsWith("= "));
  if (!titleLine) return null;

  const signatures = [];
  let currentSig = null;
  let inExample = false;
  let inNote = false;
  let exampleBuffer = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip metadata and conditionals
    if (line.startsWith(":") || line.startsWith("ifdef") || line.startsWith("endif") || line.startsWith("===")) {
      continue;
    }

    // Skip title line
    if (line === titleLine) continue;

    // Handle note blocks - skip entirely
    if (line.trim() === "[NOTE]") {
      inNote = true;
      continue;
    }
    if (inNote && /^====\s*$/.test(line.trim())) {
      inNote = false;
      // Check if this ends a note or an example
      continue;
    }
    if (inNote) continue;

    // Handle example blocks
    if (line.trim() === "[EXAMPLE]") {
      if (currentSig) currentSig.examples = currentSig.examples || [];
      exampleBuffer = "";
      continue;
    }

    // Detect start/end of example block (==== markers)
    const isSep = /^====\s*$/.test(line.trim());
    if (isSep) {
      if (inExample) {
        // End of example block
        flushExample();
        inExample = false;
      } else {
        // Start of example block
        inExample = true;
        exampleBuffer = "";
      }
      continue;
    }

    if (inExample) {
      exampleBuffer += line + "\n";
      continue;
    }

    // Detect command syntax: Name( params ) or Name( params )::
    const sigMatch = line.match(/^(\w+\s*\(.*\))\s*(::)?\s*$/);
    if (sigMatch) {
      // Previous signature is done
      if (currentSig && currentSig.syntax) {
        signatures.push(currentSig);
      }
      currentSig = {
        syntax: cleanupSyntax(sigMatch[1]),
        desc: "",
        examples: [],
      };
      continue;
    }

    // Accumulate description text
    if (currentSig) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("[") && !trimmed.startsWith("* xref")) {
        if (currentSig.desc) currentSig.desc += " ";
        currentSig.desc += trimmed;
      }
    }
  }

  // Don't forget the last signature
  if (currentSig && currentSig.syntax) {
    signatures.push(currentSig);
    flushExampleTo(currentSig);
  }

  if (signatures.length === 0) return null;

  // Compress: take the most descriptive signatures (limit to 3)
  const topSignatures = signatures
    .filter(s => s.desc.length > 0)
    .slice(0, 3);

  return {
    name,
    syntax: topSignatures.map(s => s.syntax),
    desc: topSignatures.map(s => s.desc),
    examples: topSignatures.flatMap(s => s.examples).slice(0, 2),
  };

  function flushExample() {
    if (currentSig && exampleBuffer.trim()) {
      const cleaned = exampleBuffer.trim()
        .replace(/`\+\+/g, "").replace(/\+\+`/g, "")  // strip `++ ++`
        .replace(/\bimage:[^\s\]]+/g, "")               // strip image: directives
        .replace(/\s+/g, " ")
        .trim();
      if (cleaned) {
        currentSig.examples.push(cleaned);
      }
    }
    exampleBuffer = "";
  }

  function flushExampleTo(sig) {
    if (exampleBuffer.trim()) {
      sig.examples = sig.examples || [];
      const cleaned = exampleBuffer.trim()
        .replace(/`\+\+/g, "").replace(/\+\+`/g, "")
        .replace(/\bimage:[^\s\]]+/g, "")
        .replace(/\s+/g, " ")
        .trim();
      if (cleaned) {
        sig.examples.push(cleaned);
      }
    }
    exampleBuffer = "";
  }
}

function cleanupSyntax(sig) {
  return sig
    .replace(/`\+\+/g, "").replace(/\+\+`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
```

- [ ] **Step 2: Test parser with one known command file**

Add temporary test code:

```javascript
// Test: fetch Angle.adoc and parse it
const angleContent = await fetchRawFile({ name: "Angle.adoc" });
const parsed = parseCommandFile("Angle", angleContent);
console.log("Parsed Angle:", JSON.stringify(parsed, null, 2));
```

Run: `bun run scripts/build-geogebra-skill.mjs`
Expected: Angle command with ~8 syntax variants, descriptions, and examples

- [ ] **Step 3: Remove test code, verify full run, commit**

```bash
git add scripts/build-geogebra-skill.mjs
git commit -m "feat: implement command file parser"
```

---

### Task 4: Implement SKILL.md generator

**Files:**
- Modify: `scripts/build-geogebra-skill.mjs` (append `groupByCategory` and `generateSkillMd`)

- [ ] **Step 1: Add `groupByCategory` and `generateSkillMd` functions**

```javascript
function groupByCategory(commands) {
  const grouped = {};
  for (const cmd of commands) {
    const cat = cmd.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(cmd);
  }
  return grouped;
}

function generateSkillMd(grouped) {
  let md = `---
name: geogebra-commands
description: |
  Complete GeoGebra command reference for use with evalCommand() API.
  Contains syntax, parameters, and examples for all GeoGebra commands.
  Use when generating GeoGebra commands from natural language descriptions,
  looking up specific command syntax, or verifying command availability.
  Triggers on: GeoGebra commands, GGB command, geometric construction,
  graphing calculator, evalCommand.
---

# GeoGebra Commands Reference

> Complete command reference extracted from the official GeoGebra manual.
> All commands can be passed to \\\`applet.evalCommand(cmd)\\\` in the GeoGebra JS API.

`;

  for (const [catKey, cmds] of Object.entries(grouped)) {
    const catName = CATEGORY_NAMES[catKey] || catKey;
    md += `## ${catName}\n\n`;

    for (const cmd of cmds) {
      const syn = cmd.syntax.join(" | ");
      const d = cmd.desc[0] || "";
      // Truncate long descriptions
      const desc = d.length > 120 ? d.slice(0, 120) + "..." : d;
      const exStr = cmd.examples.length > 0
        ? ` e.g. ${cmd.examples[0].slice(0, 80)}`
        : "";

      md += `- **${cmd.name}(${syn.split("(")[1]?.replace(")", "") || "..."})** | ${desc}${exStr}\n`;
    }

    md += `\n`;
  }

  return md;
}
```

- [ ] **Step 2: Run script and verify SKILL.md is generated**

Run: `bun run scripts/build-geogebra-skill.mjs`
Check: `.agents/skills/geogebra-commands/SKILL.md` exists and contains categorized commands

- [ ] **Step 3: Commit**

```bash
git add scripts/build-geogebra-skill.mjs .agents/skills/geogebra-commands/SKILL.md
git commit -m "feat: implement SKILL.md generator"
```

---

### Task 5: Implement system prompt snippet generator

**Files:**
- Modify: `scripts/build-geogebra-skill.mjs` (append `generateSystemPromptSnippet`)

- [ ] **Step 1: Add `generateSystemPromptSnippet` function**

```javascript
function generateSystemPromptSnippet(commands) {
  // Manually curated set of core commands for 2D/3D system prompt
  // These are the most commonly used when drawing from natural language
  const ALL_CORE = [
    "## Core GeoGebra Command Reference (常用绘图命令)\n",
  ].join("\n");

  // We'll generate this from the script but also add manual curation below
  const lines = [];
  const seen = new Set();

  // Priority commands that are ALWAYS included
  const priorityCommandNames = [
    "Point", "Line", "Segment", "Ray", "Circle", "Polygon",
    "Midpoint", "Center", "Intersect", "PerpendicularLine",
    "ParallelLine", "Tangent", "Angle", "Distance", "Area",
    "Length", "Perimeter", "Radius", "Circumference",
    "Reflect", "Rotate", "Translate", "Dilate",
    "Vector", "UnitVector", "Direction",
    "Plane", "Sphere", "Cone", "Cylinder", "Cube",
    "Tetrahedron", "Prism", "Pyramid",
    "PolyLine", "Spline", "Function", "If", "Text",
    "Slider", "Button",
    "PointIn", "ClosestPoint", "Barycenter",
    "PerpendicularBisector", "AngleBisector",
    "Circumcircle", "Incircle", "CircumscribedCircle",
  ];

  for (const name of priorityCommandNames) {
    const cmd = commands.find(c => c.name === name);
    if (!cmd || seen.has(name)) continue;
    seen.add(name);
    const syn = cmd.syntax.slice(0, 3).join(" | ");
    const brief = (cmd.desc[0] || "").split(".")[0].trim();
    lines.push(`${name}: ${syn}${brief ? " — " + brief : ""}`);
    if (cmd.examples[0]) {
      lines.push(`  e.g. ${cmd.examples[0].slice(0, 100)}`);
    }
  }

  const rules = [
    "",
    "## 重要规则",
    "- 用英文逗号分隔参数，不能用中文逗号",
    "- 点坐标用小括号: (x, y)，不能用中文括号",
    "- 每个命令单独一行，按绘图顺序排列",
    "- 变量名用大写字母（A, B, C...）",
    "- 3D 坐标格式: A = (x, y, z)",
  ];

  return [...lines, ...rules].join("\n");
}
```

- [ ] **Step 2: Run and verify snippet output**

Run: `bun run scripts/build-geogebra-skill.mjs`
Expected: Console output shows a formatted system prompt snippet with ~40 core commands

- [ ] **Step 3: Commit**

```bash
git add scripts/build-geogebra-skill.mjs
git commit -m "feat: implement system prompt snippet generator"
```

---

### Task 6: Enhance AI system prompts

**Files:**
- Modify: `src/lib/ai.ts`

- [ ] **Step 1: Run the build script to get the latest snippet**

Run: `bun run scripts/build-geogebra-skill.mjs`
Copy the "System Prompt Snippet" output block from the console.

- [ ] **Step 2: Update `SYSTEM_PROMPT_2D`**

Replace the current "常用命令语法参考" section (lines 64-67) with the generated snippet, plus add 2D-specific commands:

```typescript
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
[PASTE THE GENERATED SNIPPET HERE — the output from build-geogebra-skill.mjs]

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
```

- [ ] **Step 3: Update `SYSTEM_PROMPT_3D`**

Replace its "常用 3D 命令语法参考" section (lines 100-110) with the generated snippet:

```typescript
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
[PASTE THE GENERATED SNIPPET HERE — the output from build-geogebra-skill.mjs]

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
```

- [ ] **Step 4: Run typecheck**

Run: `bun run --bun npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/lib/ai.ts
git commit -m "feat: inject GeoGebra command quick-reference into system prompts"
```

---

### Task 7: Add GitHub API auth support & final polish

**Files:**
- Modify: `scripts/build-geogebra-skill.mjs`

- [ ] **Step 1: Add `GITHUB_TOKEN` support for higher rate limits**

At the top of `fetchFileList` and `fetchRawFile`, add Authorization header if env var is set:

```javascript
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const AUTH_HEADERS = GITHUB_TOKEN
  ? { Authorization: `Bearer ${GITHUB_TOKEN}` }
  : {};

// In fetchFileList, add:
const res = await fetch(COMMANDS_API, {
  headers: { "Accept": "application/vnd.github.v3+json", ...AUTH_HEADERS },
});

// In fetchRawFile, add:
const res = await fetch(url, { headers: { ...AUTH_HEADERS } });
```

- [ ] **Step 2: Add delay and retry for rate limiting**

```javascript
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, options);
    if (res.status === 403 && res.headers.get("x-ratelimit-remaining") === "0") {
      const resetTime = parseInt(res.headers.get("x-ratelimit-reset") || "0") * 1000;
      const waitMs = Math.max(resetTime - Date.now(), 1000);
      console.warn(`Rate limited, waiting ${Math.round(waitMs / 1000)}s...`);
      await new Promise(r => setTimeout(r, waitMs));
      continue;
    }
    if (!res.ok && i < retries - 1) {
      console.warn(`Fetch failed for ${url}, retrying (${i + 1}/${retries})...`);
      await new Promise(r => setTimeout(r, 1000));
      continue;
    }
    return res;
  }
  throw new Error(`Failed after ${retries} retries: ${url}`);
}
```

Update `fetchFileList` and `fetchRawFile` to use `fetchWithRetry`.

- [ ] **Step 3: Run full build one final time**

Run: `bun run scripts/build-geogebra-skill.mjs`
Expected: No errors, all files generated

- [ ] **Step 4: Commit**

```bash
git add scripts/build-geogebra-skill.mjs
git commit -m "feat: add GitHub auth support and retry logic"
```
