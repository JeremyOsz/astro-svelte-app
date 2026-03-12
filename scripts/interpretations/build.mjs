import fs from 'node:fs/promises';
import path from 'node:path';

import { auditInterpretationContent } from './lib/audit.mjs';
import { compileAllInterpretations } from './lib/compiler.mjs';
import {
  GENERATED_ROOT,
  GENERATED_WARNING,
  SYNASTRY_FAMILIES,
  TRANSIT_FAMILIES
} from './lib/definitions.mjs';

const shouldWrite = process.argv.includes('--write');
const shouldCheck = process.argv.includes('--check');

const compiled = await compileAllInterpretations();
const outputs = buildGeneratedFiles(compiled);
const findings = auditInterpretationContent(compiled);

if (shouldWrite) {
  await Promise.all(outputs.map(async ({ filePath, content }) => {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf8');
  }));
  console.log(`Wrote ${outputs.length} generated interpretation files.`);
} else {
  console.log(`Prepared ${outputs.length} generated interpretation files. Pass --write to update them.`);
}

console.log(`Audit findings: ${findings.length}`);
for (const finding of findings.slice(0, 20)) {
  console.log(`- [${finding.family}] ${finding.path} ${finding.kind} ${finding.detail}`);
}
if (findings.length > 20) {
  console.log(`- ... ${findings.length - 20} more findings`);
}

if (shouldCheck) {
  const mismatches = await compareExistingOutputs(outputs);
  if (mismatches.length > 0) {
    console.error('Generated interpretation files are out of date:');
    mismatches.forEach((file) => console.error(`- ${file}`));
    process.exitCode = 1;
  }
}

function buildGeneratedFiles(compiledData) {
  const files = [
    {
      filePath: path.join(GENERATED_ROOT, 'aspects.ts'),
      content: renderModule([{ exportName: 'ASPECT_INTERPRETATIONS', value: compiledData.aspects }])
    },
    {
      filePath: path.join(GENERATED_ROOT, 'planets.ts'),
      content: renderModule([
        { exportName: 'PLANET_INTERPRETATIONS', value: compiledData.planets.PLANET_INTERPRETATIONS },
        { exportName: 'PLANET_IN_SIGN_INTERPRETATIONS', value: compiledData.planets.PLANET_IN_SIGN_INTERPRETATIONS }
      ])
    },
    {
      filePath: path.join(GENERATED_ROOT, 'houses.ts'),
      content: renderModule([{ exportName: 'SIGN_IN_HOUSE_INTERPRETATIONS', value: compiledData.houses }])
    }
  ];

  for (const [slug, label] of SYNASTRY_FAMILIES) {
    files.push({
      filePath: path.join(GENERATED_ROOT, 'synastry', `${slug}.ts`),
      content: renderModule([{ exportName: getFamilyExportName(label), value: compiledData.synastry[label] }])
    });
  }

  for (const [slug, label] of TRANSIT_FAMILIES) {
    files.push({
      filePath: path.join(GENERATED_ROOT, 'transits', `${slug}.ts`),
      content: renderModule([{ exportName: getFamilyExportName(label), value: compiledData.transits[label] }])
    });
  }

  return files;
}

function renderModule(exportsList) {
  const body = exportsList
    .map(({ exportName, value }) => `export const ${exportName} = ${JSON.stringify(value, null, 2)};`)
    .join('\n\n');

  return `${GENERATED_WARNING}\n\n${body}\n`;
}

async function compareExistingOutputs(outputs) {
  const mismatches = [];
  await Promise.all(outputs.map(async ({ filePath, content }) => {
    try {
      const existing = await fs.readFile(filePath, 'utf8');
      if (existing !== content) mismatches.push(path.relative(process.cwd(), filePath));
    } catch {
      mismatches.push(path.relative(process.cwd(), filePath));
    }
  }));
  return mismatches.sort();
}

function getFamilyExportName(label) {
  if (label === 'Angular' || label === 'Minor') {
    return `${label.toUpperCase()}_ASPECT_INTERPRETATIONS`;
  }
  return `${label.toUpperCase()}_INTERPRETATIONS`;
}
