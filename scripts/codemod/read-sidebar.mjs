// Extracts the Starlight `sidebar` array from legacy/astro/astro.config.mjs without importing Astro.
// The config can't be imported because its integrations are no longer installed, so we bracket-match the
// array literal and evaluate it as a plain JS expression. It contains only object/array/string/boolean literals.
import { readFileSync } from 'node:fs';

export function readSidebar(configPath = 'legacy/astro/astro.config.mjs') {
  const src = readFileSync(configPath, 'utf8');
  const start = src.indexOf('[', src.indexOf('sidebar:'));
  if (start < 0) throw new Error('sidebar: [ not found');
  let depth = 0;
  let quote = null;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (quote) {
      if (ch === '\\') i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') quote = ch;
    else if (ch === '[') depth++;
    else if (ch === ']' && --depth === 0) return new Function(`return ${src.slice(start, i + 1)}`)();
  }
  throw new Error('unterminated sidebar array');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(readSidebar(), null, 2));
}
