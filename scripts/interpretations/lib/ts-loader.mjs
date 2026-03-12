import fs from 'node:fs';
import vm from 'node:vm';

export function loadTsExportObject(filePath, exportName) {
  const source = fs.readFileSync(filePath, 'utf8');
  const sanitized = sanitizeTsModule(source, exportName);
  const context = { globalThis: { __exports: {} } };
  vm.createContext(context);
  vm.runInContext(sanitized, context, { filename: filePath });
  const value = context.globalThis.__exports[exportName];

  if (value === undefined) {
    throw new Error(`Unable to load export ${exportName} from ${filePath}`);
  }

  return value;
}

function sanitizeTsModule(source, exportName) {
  return source
    .replace(/^import[^;]+;\n?/gm, '')
    .replace(/^export type[\s\S]+?;\n?/gm, '')
    .replace(/^export interface[\s\S]+?^}\n?/gm, '')
    .replace(/^export const (\w+)\s*:\s*[^=]+=/gm, 'globalThis.__exports.$1 =')
    .replace(/^export const (\w+)\s*=/gm, 'globalThis.__exports.$1 =')
    .replace(/\s+as const;/g, ';');
}
