import fs from 'node:fs/promises';
import path from 'node:path';

import {
  serializeAspects,
  serializeHouses,
  serializePlanets,
  serializeSynastryFamily,
  serializeTransitFamily
} from './lib/markdown.mjs';
import {
  CONTENT_ROOT,
  REPO_ROOT,
  SYNASTRY_FAMILIES,
  TRANSIT_FAMILIES
} from './lib/definitions.mjs';
import { loadTsExportObject } from './lib/ts-loader.mjs';

const shouldWrite = process.argv.includes('--write');

const current = loadCurrentRuntimeData();
const files = [
  { filePath: path.join(CONTENT_ROOT, 'aspects.md'), content: serializeAspects(current.aspects) },
  { filePath: path.join(CONTENT_ROOT, 'planets.md'), content: serializePlanets(current.planets, current.planetInSign) },
  { filePath: path.join(CONTENT_ROOT, 'houses.md'), content: serializeHouses(current.houses) }
];

for (const [slug, label] of SYNASTRY_FAMILIES) {
  files.push({
    filePath: path.join(CONTENT_ROOT, 'synastry', `${slug}.md`),
    content: serializeSynastryFamily(label, current.synastry[label])
  });
}

for (const [slug, label] of TRANSIT_FAMILIES) {
  files.push({
    filePath: path.join(CONTENT_ROOT, 'transits', `${slug}.md`),
    content: serializeTransitFamily(label, current.transits[label])
  });
}

if (shouldWrite) {
  await Promise.all(files.map(async ({ filePath, content }) => {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf8');
  }));
  console.log(`Wrote ${files.length} markdown interpretation files.`);
} else {
  console.log(`Prepared ${files.length} markdown interpretation files. Pass --write to create them.`);
}

function loadCurrentRuntimeData() {
  const dataRoot = path.join(REPO_ROOT, 'src/lib/data/interpretations');
  const aspects = loadTsExportObject(path.join(dataRoot, 'aspects.ts'), 'ASPECT_INTERPRETATIONS');
  const planets = loadTsExportObject(path.join(dataRoot, 'planets.ts'), 'PLANET_INTERPRETATIONS');
  const planetInSign = loadTsExportObject(path.join(dataRoot, 'planets.ts'), 'PLANET_IN_SIGN_INTERPRETATIONS');
  const houses = loadTsExportObject(path.join(dataRoot, 'houses.ts'), 'SIGN_IN_HOUSE_INTERPRETATIONS');
  const synastry = Object.fromEntries(
    SYNASTRY_FAMILIES.map(([slug, label]) => [
      label,
      loadTsExportObject(path.join(dataRoot, 'synastry', `${slug}.ts`), getFamilyExportName(label))
    ])
  );
  const transits = Object.fromEntries(
    TRANSIT_FAMILIES.map(([slug, label]) => [
      label,
      loadTsExportObject(path.join(dataRoot, 'transits', `${slug}.ts`), getFamilyExportName(label))
    ])
  );

  return { aspects, planets, planetInSign, houses, synastry, transits };
}

function getFamilyExportName(label) {
  if (label === 'Angular' || label === 'Minor') {
    return `${label.toUpperCase()}_ASPECT_INTERPRETATIONS`;
  }
  return `${label.toUpperCase()}_INTERPRETATIONS`;
}
