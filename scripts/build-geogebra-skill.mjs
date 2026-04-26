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

async function buildCategoryMap(categoryFiles) {
  const mapping = {};
  for (const file of categoryFiles) {
    const content = await fetchRawFile(file);
    const lines = content.split("\n");
    const categoryKey = file.name.replace(".adoc", "");

    for (const line of lines) {
      const match = line.match(/^\* xref:\/commands\/(\w+)\.adoc\[/);
      if (match) {
        mapping[match[1]] = categoryKey;
      }
    }
  }
  return mapping;
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

function parseCommandFile(name, content) {
  const lines = content.split("\n");

  const titleLine = lines.find(l => l.startsWith("= "));
  if (!titleLine) return null;

  const signatures = [];
  let currentSig = null;
  let inExample = false;
  let inNote = false;
  let noteOpenerSeen = false;
  let exampleBuffer = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith(":") || line.startsWith("ifdef") || line.startsWith("endif") || line.match(/^={3}\s/)) {
      continue;
    }

    if (line === titleLine) continue;

    if (line.trim() === "[NOTE]") {
      inNote = true;
      noteOpenerSeen = false;
      continue;
    }
    if (inNote && /^====\s*$/.test(line.trim())) {
      if (!noteOpenerSeen) {
        noteOpenerSeen = true;
      } else {
        inNote = false;
        noteOpenerSeen = false;
      }
      continue;
    }
    if (inNote) continue;

    if (line.trim() === "[EXAMPLE]") {
      if (currentSig) currentSig.examples = currentSig.examples || [];
      exampleBuffer = "";
      continue;
    }

    const isSep = /^====\s*$/.test(line.trim());
    if (isSep) {
      if (inExample) {
        flushExample();
        inExample = false;
      } else {
        inExample = true;
        exampleBuffer = "";
      }
      continue;
    }

    if (inExample) {
      exampleBuffer += line + "\n";
      continue;
    }

    const sigMatch = line.match(/^(\w+\s*\(.*\))\s*(::)?\s*$/);
    if (sigMatch) {
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

    if (currentSig) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("[") && !trimmed.startsWith("* xref")) {
        if (currentSig.desc) currentSig.desc += " ";
        currentSig.desc += trimmed;
      }
    }
  }

  if (currentSig && currentSig.syntax) {
    signatures.push(currentSig);
    flushExampleTo(currentSig);
  }

  if (signatures.length === 0) return null;

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
        .replace(/`\+\+/g, "").replace(/\+\+`/g, "")
        .replace(/\bimage:[^\s\]]+/g, "")
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

main().catch(err => {
  console.error("Build failed:", err);
  process.exit(1);
});
