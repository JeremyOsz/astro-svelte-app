// @ts-nocheck — build-time script; checked implicitly via pipeline tests
import { SYNASTRY_CONTEXTS } from './definitions.mjs';

export function serializeSynastryFamily(name, family) {
  const lines = [`# Synastry ${name}`];

  if (family.orb) lines.push('', `orb: ${family.orb}`);
  if (family.nature) lines.push(`nature: ${family.nature}`);
  if (family.general) lines.push('', '### General', family.general);

  for (const [key, entry] of Object.entries(family.planets)) {
    lines.push('', `## ${key}`, `compatibility: ${entry.compatibility}`, `intensity: ${entry.intensity}`);
    lines.push('', '### Interpretation', entry.interpretation);
    lines.push('', '### Romance', entry.romance || '');
    lines.push('', '### Friendship', entry.friendship || '');
    lines.push('', '### Family', entry.family || '');
    lines.push('', '### Business', entry.business || '');
  }

  return `${lines.join('\n').trim()}\n`;
}

export function serializeTransitFamily(name, entries) {
  const lines = [`# Transit ${name}`];

  for (const [key, interpretation] of Object.entries(entries)) {
    lines.push('', `## ${key}`, '### Interpretation', interpretation);
  }

  return `${lines.join('\n').trim()}\n`;
}

export function serializePlanets(planets, planetInSign) {
  const lines = ['# Planet Interpretations'];

  for (const [planet, data] of Object.entries(planets)) {
    lines.push('', `## ${planet}`, '### Description', data.description, '', '### Keywords', data.keywords.join(', '));

    const signEntries = planetInSign[planet] || {};
    for (const [sign, interpretation] of Object.entries(signEntries)) {
      lines.push('', `### ${sign}`, interpretation);
    }
  }

  return `${lines.join('\n').trim()}\n`;
}

export function serializeHouses(houses) {
  const lines = ['# Sign In House Interpretations'];

  for (const [sign, houseEntries] of Object.entries(houses)) {
    lines.push('', `## ${sign}`);
    for (const [house, interpretation] of Object.entries(houseEntries)) {
      lines.push('', `### House ${house}`, interpretation);
    }
  }

  return `${lines.join('\n').trim()}\n`;
}

export function serializeAspects(aspects) {
  const lines = ['# Aspect Interpretations'];

  for (const [aspect, data] of Object.entries(aspects)) {
    lines.push('', `## ${aspect}`, `orb: ${data.orb}`, `nature: ${data.nature}`, '', '### General', data.general);
    for (const [planetKey, interpretation] of Object.entries(data.planets)) {
      lines.push('', `### ${planetKey}`, interpretation);
    }
  }

  return `${lines.join('\n').trim()}\n`;
}

export function ensureRequiredContexts(sectionMap, entryHeading) {
  for (const contextName of SYNASTRY_CONTEXTS) {
    if (!sectionMap.has(contextName)) {
      throw new Error(`Missing ${contextName} section for ${entryHeading}`);
    }
  }
}
