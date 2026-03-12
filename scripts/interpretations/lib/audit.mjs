const DEFAULT_THRESHOLDS = {
  houses: 80,
  planetInSign: 170,
  synastryInterpretation: 170,
  synastryContext: 140,
  transits: 320,
  similarity: 0.78
};

const FORMULA_PATTERNS = [
  /work together beautifully/i,
  /merge into one powerful force/i,
  /work together harmoniously, creating opportunities/i,
  /balance each other perfectly/i,
  /requires conscious adaptation/i,
  /^Natural .* harmony\./i,
  /^Perfect .* alignment\.?/i,
  /^Supportive .* connection\.?/i,
  /^Polarized .* create powerful complementary dynamics\.?/i
];

export function auditInterpretationContent(compiled, thresholds = DEFAULT_THRESHOLDS) {
  const findings = [];

  for (const [sign, houses] of Object.entries(compiled.houses)) {
    for (const [house, text] of Object.entries(houses)) {
      pushTooShort(findings, 'houses', `${sign}.${house}`, text, thresholds.houses);
    }
  }

  for (const [planet, signs] of Object.entries(compiled.planets.PLANET_IN_SIGN_INTERPRETATIONS)) {
    for (const [sign, text] of Object.entries(signs)) {
      pushTooShort(findings, 'planets', `${planet}.${sign}`, text, thresholds.planetInSign);
    }
  }

  for (const [family, data] of Object.entries(compiled.synastry)) {
    const similarityPool = [];
    for (const [pair, entry] of Object.entries(data.planets)) {
      pushTooShort(findings, 'synastry', `${family}.${pair}.interpretation`, entry.interpretation, thresholds.synastryInterpretation);
      checkFormula(findings, 'synastry', `${family}.${pair}.interpretation`, entry.interpretation);
      similarityPool.push({ id: `${family}.${pair}.interpretation`, text: entry.interpretation });
      for (const contextName of ['romance', 'friendship', 'family', 'business']) {
        const text = entry[contextName] || '';
        pushTooShort(findings, 'synastry', `${family}.${pair}.${contextName}`, text, thresholds.synastryContext);
        checkFormula(findings, 'synastry', `${family}.${pair}.${contextName}`, text);
        similarityPool.push({ id: `${family}.${pair}.${contextName}`, text });
      }
    }
    findings.push(...findSimilarityFindings('synastry', similarityPool, thresholds.similarity));
  }

  for (const [family, entries] of Object.entries(compiled.transits)) {
    const similarityPool = [];
    for (const [key, text] of Object.entries(entries)) {
      pushTooShort(findings, 'transits', `${family}.${key}`, text, thresholds.transits);
      similarityPool.push({ id: `${family}.${key}`, text });
    }
    findings.push(...findSimilarityFindings('transits', similarityPool, thresholds.similarity));
  }

  return findings.sort((a, b) => a.family.localeCompare(b.family) || a.path.localeCompare(b.path));
}

export function normalizeForSimilarity(text) {
  return text
    .toLowerCase()
    .replace(/[a-z]+_[a-z]+/g, ' ')
    .replace(/\b(sun|moon|mercury|venus|mars|jupiter|saturn|uranus|neptune|pluto|chiron|lilith|node|asc|mc|fortune|vertex)\b/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function pushTooShort(findings, family, path, text, minLength) {
  if (text.trim().length < minLength) {
    findings.push({ family, path, kind: 'too_short', detail: `${text.trim().length} < ${minLength}` });
  }
}

function checkFormula(findings, family, path, text) {
  if (FORMULA_PATTERNS.some((pattern) => pattern.test(text.trim()))) {
    findings.push({ family, path, kind: 'formulaic_pattern', detail: 'Matched known repetitive phrasing pattern' });
  }
}

function findSimilarityFindings(family, entries, threshold) {
  const findings = [];
  for (let index = 0; index < entries.length; index += 1) {
    for (let compareIndex = index + 1; compareIndex < entries.length; compareIndex += 1) {
      const left = entries[index];
      const right = entries[compareIndex];
      const similarity = trigramJaccard(normalizeForSimilarity(left.text), normalizeForSimilarity(right.text));
      if (similarity > threshold) {
        findings.push({
          family,
          path: left.id,
          relatedPath: right.id,
          kind: 'high_similarity',
          detail: similarity.toFixed(2)
        });
      }
    }
  }
  return findings;
}

function trigramJaccard(left, right) {
  const leftSet = buildTrigrams(left);
  const rightSet = buildTrigrams(right);

  if (leftSet.size === 0 || rightSet.size === 0) return 0;

  let intersection = 0;
  for (const token of leftSet) {
    if (rightSet.has(token)) intersection += 1;
  }

  const union = leftSet.size + rightSet.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function buildTrigrams(text) {
  const value = `  ${text}  `;
  const tokens = new Set();
  for (let index = 0; index < value.length - 2; index += 1) {
    tokens.add(value.slice(index, index + 3));
  }
  return tokens;
}
