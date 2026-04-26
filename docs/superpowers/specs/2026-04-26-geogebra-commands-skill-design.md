# GeoGebra Commands Skill Design

**Date:** 2026-04-26
**Status:** Approved

## Problem

ChatGGB uses AI to translate natural language into GeoGebra commands, but the current system prompt in `src/lib/ai.ts` contains only a handful of hardcoded command examples. The AI model lacks comprehensive knowledge of the ~500+ GeoGebra commands, their syntax variations, and usage patterns, resulting in:
- Incorrect command syntax in generated output
- Missing or non-existent commands being used
- Inefficient retry loops when commands fail

## Solution

Build a skill that captures the complete GeoGebra Commands reference from the official manual (`geogebra/manual` GitHub repo), using a **hybrid approach**:

1. **System prompt snippet** — Core ~30-40 most common commands injected directly into the existing system prompts in `src/lib/ai.ts`, always available at no extra cost.
2. **Full skill reference** — Complete command catalog as `.agents/skills/geogebra-commands/SKILL.md`, loadable on-demand via the `Skill` tool when the model needs less common commands.

## Source Data

- **Repo:** `https://github.com/geogebra/manual`
- **Content path:** `en/modules/ROOT/pages/commands/*.adoc`
- **Format:** AsciiDoc (`.adoc`), one file per command
- **Nav mapping:** `en/modules/ROOT/nav.adoc` provides category structure (21 categories)
- **Categories:** 3D, Algebra, Chart, Conic, Discrete Math, Function, Geometry, GeoGebra, List, Logic, Optimization, Probability, Scripting, Spreadsheet, Statistics, Financial, Text, Transformation, Vector/Matrix, CAS Specific

## Architecture

```
geogebra/manual (GitHub)
  └─ en/modules/ROOT/pages/commands/*.adoc  (~500+ files)
         │
         ▼  scripts/build-geogebra-skill.mjs
         │  (Fetch raw files → Parse → Generate)
         │
    ┌────┴────┐
    ▼         ▼
  SKILL.md    system prompt snippet
  (full ref)  (core quick-ref)
    │            │
    ▼            ▼
  Skill tool    src/lib/ai.ts
  on-demand     always injected
```

## Components

### 1. Build Script (`scripts/build-geogebra-skill.mjs`)

A one-shot Bun/Node script with no external dependencies beyond Node built-ins.

**Flow:**
1. Fetch command file list from `https://api.github.com/repos/geogebra/manual/contents/en/modules/ROOT/pages/commands`
2. Download each `.adoc` file from `raw.githubusercontent.com`
3. Parse each file:
   - Extract command name from title line (`= CommandName Command`)
   - Extract syntax signatures (lines ending with `::`)
   - Extract descriptions (text between signatures and next section)
   - Extract examples from `[EXAMPLE]` blocks
4. Group commands by category using `nav.adoc` mapping
5. Generate two outputs (see below)

**Parsing algorithm:** Simple line-by-line parser, no full AsciiDoc engine needed. Key patterns:
- Title: `/^= (\w+) Command/`
- Signature: `/^(\w+\(.*\))\s*::/`
- Example blocks: enclosed by `====` lines after `[EXAMPLE]`
- Skip: `[NOTE]` blocks, cross-references to `xref:...`, image directives

**Error handling:** Skip files that don't parse cleanly, log a warning, continue.

### 2. Full Skill (`scripts/geogebra-commands.json` + `.agents/skills/geogebra-commands/SKILL.md`)

**SKILL.md structure:**
```markdown
---
name: geogebra-commands
description: |
  Complete GeoGebra command reference for use with evalCommand() API.
  Contains syntax, parameters, and examples for all GeoGebra commands.
  Use when generating GeoGebra commands from natural language descriptions,
  looking up specific command syntax, or verifying command availability.
  Triggers on: GeoGebra commands, GGB, geometric construction, graphing,
  evalCommand, applet.
---

# GeoGebra Commands Reference

## Algebra Commands
- **CommandName(Param, Param)** | Description. Example → result.
...

## Geometry Commands
...
```

**Compression strategy:**
- Each command entry: 1-2 lines max
- Format: `**Name(params)** | Brief desc. Example → result.`
- Skip CAS-only commands that don't apply to `evalCommand()` in the graphing/3D calc modes
- Keep examples only for non-obvious syntax

**Intermediate JSON** (`scripts/geogebra-commands.json`): Structured data for potential reuse (e.g., programmatic access, future tool calls):
```json
{
  "categories": {
    "Algebra Commands": [
      {
        "name": "Point",
        "signatures": [{"syntax": "Point(x, y)", "desc": "Creates point at (x,y)"}],
        "examples": ["Point({1,2}) → (1,2)"]
      }
    ]
  }
}
```

### 3. System Prompt Enhancement (`src/lib/ai.ts`)

Append a compact quick-reference section to both `SYSTEM_PROMPT_2D` and `SYSTEM_PROMPT_3D`:

```
## Core GeoGebra Commands (常用绘图命令)

Point: Point(x,y) | Point({x,y}) | Point(Object, Parameter)
Line: Line(Point, Point) | Line(Point, Direction)
Circle: Circle(Center, Radius) | Circle(Center, Point) | Circle(P1,P2,P3)
Polygon: Polygon(P1,P2,...) | Polygon(List of Points)
Segment: Segment(Point, Point)
Midpoint: Midpoint(Point, Point) | Midpoint(Segment)
Intersect: Intersect(Object1, Object2) | Intersect(Object1, Object2, Index)
Tangent: Tangent(Point, Conic) | Tangent(Line, Conic)
Reflect: Reflect(Object, Point/Line)
Rotate: Rotate(Object, Angle) | Rotate(Object, Angle, Center)
Translate: Translate(Object, Vector)
Dilate: Dilate(Object, Factor, Center)
PerpendicularLine: PerpendicularLine(Point, Line)
ParallelLine: ParallelLine(Point, Line)
Angle: Angle(Vector, Vector) | Angle(Line, Line) | Angle(Point, Apex, Point)
Distance: Distance(Point, Point) | Distance(Point, Line)
Area: Area(Polygon) | Area(Conic)
Center: Center(Conic)
Radius: Radius(Circle)
Circumference: Circumference(Conic)
Vector: Vector(Point, Point) | Vector(Point)
UnitVector: UnitVector(Vector/Line)
Slope: Slope(Line)
Text: Text("text", Point)
Function: Function(f, a, b) — a,b are domain bounds

## 重要规则
- 用英文逗号分隔参数，不能用中文逗号
- 点坐标用小括号: (x, y)，不能用中文括号
- 每个命令单独一行，按绘图顺序排列
```

## Files Modified/Created

| File | Action | Purpose |
|------|--------|---------|
| `scripts/build-geogebra-skill.mjs` | CREATE | One-shot script to build skill from upstream |
| `scripts/geogebra-commands.json` | CREATE (generated) | Intermediate structured data |
| `.agents/skills/geogebra-commands/SKILL.md` | CREATE (generated) | Full command reference skill |
| `src/lib/ai.ts` | MODIFY | Add core quick-reference to system prompts |

## Usage Flow

1. **Normal operation:** System prompt includes core commands → AI knows the basics
2. **Edge case:** AI needs a rare command (e.g., `Bernoulli`, `Barycenter`) → loads `geogebra-commands` skill
3. **Update:** Run `bun run scripts/build-geogebra-skill.mjs` to regenerate from upstream

## Non-Goals

- Real-time auto-sync with upstream (manual re-run is sufficient)
- Tools section of the manual (not relevant to `evalCommand()` API)
- CAS View-specific commands that don't work in graphing/3D modes
- Interactive command builder UI
