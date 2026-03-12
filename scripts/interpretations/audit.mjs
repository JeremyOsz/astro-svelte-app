import fs from 'node:fs/promises';
import path from 'node:path';

import { auditInterpretationContent } from './lib/audit.mjs';
import { compileAllInterpretations } from './lib/compiler.mjs';
import { REVIEW_NOTES_ROOT } from './lib/definitions.mjs';

const shouldWrite = process.argv.includes('--write');
const compiled = await compileAllInterpretations();
const findings = auditInterpretationContent(compiled);
const report = renderReport(findings);

console.log(report);

if (shouldWrite) {
  const reportPath = path.join(REVIEW_NOTES_ROOT, 'latest-audit.md');
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, report, 'utf8');
}

function renderReport(allFindings) {
  const grouped = groupByFamily(allFindings);
  const lines = ['# Interpretation Audit Report', '', `Total findings: ${allFindings.length}`, ''];

  for (const [family, familyFindings] of Object.entries(grouped)) {
    lines.push(`## ${family}`, '', `Count: ${familyFindings.length}`, '');
    for (const finding of familyFindings.slice(0, 30)) {
      const related = finding.relatedPath ? ` -> ${finding.relatedPath}` : '';
      lines.push(`- \`${finding.path}\`${related}: ${finding.kind} (${finding.detail})`);
    }
    if (familyFindings.length > 30) {
      lines.push(`- ... ${familyFindings.length - 30} more`);
    }
    lines.push('');
  }

  return `${lines.join('\n').trim()}\n`;
}

function groupByFamily(findings) {
  return findings.reduce((accumulator, finding) => {
    accumulator[finding.family] ||= [];
    accumulator[finding.family].push(finding);
    return accumulator;
  }, {});
}
