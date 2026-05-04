import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commandsDir = path.join(__dirname, '../.agents/skills/geogebra-skills/references/manual/docs/manual/en/commands');
const outputFile = path.join(__dirname, '../src/services/ai/geogebra-commands.json');

const categoriesToParse = [
  '3D_Commands',
  'Algebra_Commands',
  'Chart_Commands',
  'Conic_Commands',
  'Discrete_Math_Commands',
  'Functions_and_Calculus_Commands',
  'Geometry_Commands',
  'GeoGebra_Commands',
  'List_Commands',
  'Logic_Commands',
  'Optimization_Commands',
  'Probability_Commands',
  'Scripting_Commands',
  'Spreadsheet_Commands',
  'Statistics_Commands',
  'Financial_Commands',
  'Text_Commands',
  'Transformation_Commands',
  'Vector_and_Matrix_Commands',
  'CAS_Specific_Commands'
];

const result = {
  categories: {},
  docs: {}
};

function cleanMarkdown(md) {
  const lines = md.split('\n');
  let startIdx = 0;
  let endIdx = lines.length;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('# ') && lines[i].includes('Command')) {
      startIdx = i + 1;
    }
    if (lines[i].includes('© GeoGebra®')) {
      endIdx = i;
      break;
    }
  }
  
  let content = lines.slice(startIdx, endIdx).join('\n').trim();
  
  // 清理无用的导航链接和多语言文本
  content = content.replace(/\[Edit this Page\]\(.*?\)/g, '');
  content = content.replace(/English\s*\n\s*\[Česky\][\s\S]*?(?=\n\n)/g, '');
  
  return content.trim();
}

for (const category of categoriesToParse) {
  const categoryPath = path.join(commandsDir, category, 'index.md');
  if (!fs.existsSync(categoryPath)) {
    console.warn(`Warning: Category file not found: ${categoryPath}`);
    continue;
  }
  
  const content = fs.readFileSync(categoryPath, 'utf8');
  const regex = /\*\s+\[(.*?)\]\(\.\.\/(.*?)\/\)/g;
  let match;
  const commands = [];
  
  while ((match = regex.exec(content)) !== null) {
    const cmdName = match[1];
    const cmdFolder = match[2];
    commands.push(cmdName);
    
    if (!result.docs[cmdName]) {
      const docPath = path.join(commandsDir, cmdFolder, 'index.md');
      if (fs.existsSync(docPath)) {
        const docContent = fs.readFileSync(docPath, 'utf8');
        result.docs[cmdName] = cleanMarkdown(docContent);
      }
    }
  }
  
  result.categories[category] = commands;
}

fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
console.log(`Successfully generated ${outputFile}`);
