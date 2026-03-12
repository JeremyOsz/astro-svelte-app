import fs from 'node:fs/promises';
import path from 'node:path';

import {
  CONTENT_ROOT,
  MAJOR_ASPECT_FAMILIES,
  SYNASTRY_FAMILIES,
  TRANSIT_FAMILIES,
  VALID_COMPATIBILITY,
  VALID_INTENSITY
} from './definitions.mjs';
import { ensureRequiredContexts } from './markdown.mjs';

export async function compileAllInterpretations(contentRoot = CONTENT_ROOT) {
  const [aspectsMarkdown, planetsMarkdown, housesMarkdown] = await Promise.all([
    fs.readFile(path.join(contentRoot, 'aspects.md'), 'utf8'),
    fs.readFile(path.join(contentRoot, 'planets.md'), 'utf8'),
    fs.readFile(path.join(contentRoot, 'houses.md'), 'utf8')
  ]);

  const synastryEntries = await Promise.all(
    SYNASTRY_FAMILIES.map(async ([slug, label]) => {
      const markdown = await fs.readFile(path.join(contentRoot, 'synastry', `${slug}.md`), 'utf8');
      return [label, parseSynastryFamilyMarkdown(markdown, label)];
    })
  );

  const transitEntries = await Promise.all(
    TRANSIT_FAMILIES.map(async ([slug, label]) => {
      const markdown = await fs.readFile(path.join(contentRoot, 'transits', `${slug}.md`), 'utf8');
      return [label, parseTransitFamilyMarkdown(markdown)];
    })
  );

  return {
    aspects: parseAspectFamilyMarkdown(aspectsMarkdown),
    planets: parsePlanetsMarkdown(planetsMarkdown),
    houses: parseHousesMarkdown(housesMarkdown),
    synastry: Object.fromEntries(synastryEntries),
    transits: Object.fromEntries(transitEntries)
  };
}

export function parseSynastryFamilyMarkdown(markdown, aspectLabel) {
  const document = parseStructuredMarkdown(markdown);
  const rootMetadata = parseMetadata(document.root.metadata, ['orb', 'nature']);
  const family = {
    general: document.root.sections.get('General') || '',
    orb: rootMetadata.orb || '',
    nature: rootMetadata.nature || '',
    planets: {}
  };

  for (const entry of document.entries) {
    ensureRequiredContexts(entry.sections, entry.heading);
    const metadata = parseMetadata(entry.metadata, ['compatibility', 'intensity']);
    const [person1Planet, person2Planet] = splitPairHeading(entry.heading);

    if (!VALID_COMPATIBILITY.has(metadata.compatibility)) {
      throw new Error(`Unsupported compatibility for ${entry.heading}: ${metadata.compatibility}`);
    }

    if (!VALID_INTENSITY.has(metadata.intensity)) {
      throw new Error(`Unsupported intensity for ${entry.heading}: ${metadata.intensity}`);
    }

    family.planets[entry.heading] = {
      aspect: aspectLabel,
      person1Planet,
      person2Planet,
      interpretation: entry.sections.get('Interpretation'),
      compatibility: metadata.compatibility,
      intensity: metadata.intensity,
      romance: entry.sections.get('Romance'),
      friendship: entry.sections.get('Friendship'),
      family: entry.sections.get('Family'),
      business: entry.sections.get('Business')
    };
  }

  return family;
}

export function parseTransitFamilyMarkdown(markdown) {
  const document = parseStructuredMarkdown(markdown);
  const result = {};

  for (const entry of document.entries) {
    if (entry.sections.size !== 1 || !entry.sections.has('Interpretation')) {
      throw new Error(`Transit entry ${entry.heading} must contain exactly one Interpretation section`);
    }
    result[entry.heading] = entry.sections.get('Interpretation');
  }

  return result;
}

export function parsePlanetsMarkdown(markdown) {
  const document = parseStructuredMarkdown(markdown);
  const PLANET_INTERPRETATIONS = {};
  const PLANET_IN_SIGN_INTERPRETATIONS = {};

  for (const entry of document.entries) {
    if (!entry.sections.has('Description')) {
      throw new Error(`Missing Description section for ${entry.heading}`);
    }
    if (!entry.sections.has('Keywords')) {
      throw new Error(`Missing Keywords section for ${entry.heading}`);
    }

    const keywords = entry.sections
      .get('Keywords')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    PLANET_INTERPRETATIONS[entry.heading] = {
      description: entry.sections.get('Description'),
      keywords
    };

    const signs = {};
    for (const [heading, text] of entry.sections.entries()) {
      if (heading === 'Description' || heading === 'Keywords') continue;
      signs[heading] = text;
    }
    PLANET_IN_SIGN_INTERPRETATIONS[entry.heading] = signs;
  }

  return { PLANET_INTERPRETATIONS, PLANET_IN_SIGN_INTERPRETATIONS };
}

export function parseHousesMarkdown(markdown) {
  const document = parseStructuredMarkdown(markdown);
  const result = {};

  for (const entry of document.entries) {
    const houses = {};

    for (const [heading, text] of entry.sections.entries()) {
      const match = /^House\s+(\d{1,2})$/.exec(heading);
      if (!match) {
        throw new Error(`Unsupported house heading ${heading} in ${entry.heading}`);
      }
      houses[match[1]] = text;
    }

    result[entry.heading] = houses;
  }

  return result;
}

export function parseAspectFamilyMarkdown(markdown) {
  const document = parseStructuredMarkdown(markdown);
  const result = {};

  for (const entry of document.entries) {
    if (!MAJOR_ASPECT_FAMILIES.includes(entry.heading) && entry.heading !== 'Quincunx') {
      throw new Error(`Unsupported aspect family ${entry.heading}`);
    }

    const metadata = parseMetadata(entry.metadata, ['orb', 'nature']);
    if (!entry.sections.has('General')) {
      throw new Error(`Missing General section for aspect ${entry.heading}`);
    }

    const planets = {};
    for (const [heading, text] of entry.sections.entries()) {
      if (heading === 'General') continue;
      planets[heading] = text;
    }

    result[entry.heading] = {
      general: entry.sections.get('General'),
      orb: metadata.orb || '',
      nature: metadata.nature || '',
      planets
    };
  }

  return result;
}

function parseStructuredMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const root = createEntry('__root__');
  const entries = [];
  let currentEntry = root;
  let currentSection = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith('# ')) {
      continue;
    }

    if (line.startsWith('## ')) {
      const heading = line.slice(3).trim();
      if (entries.some((entry) => entry.heading === heading)) {
        throw new Error(`Duplicate entry heading: ${heading}`);
      }
      currentEntry = createEntry(heading);
      entries.push(currentEntry);
      currentSection = null;
      continue;
    }

    if (line.startsWith('### ')) {
      const heading = line.slice(4).trim();
      if (currentEntry.sections.has(heading)) {
        throw new Error(`Duplicate section heading: ${heading}`);
      }
      currentEntry.sections.set(heading, '');
      currentSection = heading;
      continue;
    }

    if (currentSection) {
      const previous = currentEntry.sections.get(currentSection);
      currentEntry.sections.set(currentSection, appendLine(previous, line));
      continue;
    }

    currentEntry.metadata.push(line);
  }

  root.metadata = compactMetadata(root.metadata);
  for (const entry of entries) {
    entry.metadata = compactMetadata(entry.metadata);
    for (const [heading, text] of entry.sections.entries()) {
      entry.sections.set(heading, text.trim());
    }
  }
  for (const [heading, text] of root.sections.entries()) {
    root.sections.set(heading, text.trim());
  }

  return { root, entries };
}

function createEntry(heading) {
  return {
    heading,
    metadata: [],
    sections: new Map()
  };
}

function compactMetadata(lines) {
  const trimmed = lines.join('\n').trim();
  return trimmed ? trimmed.split('\n').map((line) => line.trim()).filter(Boolean) : [];
}

function appendLine(previous, line) {
  return previous ? `${previous}\n${line}` : line;
}

function parseMetadata(lines, allowedKeys) {
  const result = {};

  for (const line of lines) {
    const match = /^([A-Za-z][A-Za-z\s-]*):\s*(.+)$/.exec(line);
    if (!match) {
      throw new Error(`Invalid metadata line: ${line}`);
    }

    const key = match[1].trim();
    if (!allowedKeys.includes(key)) {
      throw new Error(`Unsupported metadata key: ${key}`);
    }
    result[key] = match[2].trim();
  }

  return result;
}

function splitPairHeading(heading) {
  const separatorIndex = heading.indexOf('_');
  if (separatorIndex === -1) {
    throw new Error(`Expected pair heading, received ${heading}`);
  }
  return [heading.slice(0, separatorIndex), heading.slice(separatorIndex + 1)];
}
