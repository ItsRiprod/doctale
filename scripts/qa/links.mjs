#!/usr/bin/env node
// Internal link checker for the static export: every root-relative href in out/**/*.html must resolve to a file.
// usage: node scripts/qa/links.mjs [outDir] [--allow /path/,/path2/]   (exit 1 on broken links)
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const args = process.argv.slice(2);
const outDir = args.find((a) => !a.startsWith('--')) ?? 'out';
const allowIdx = args.indexOf('--allow');
const allow = new Set(allowIdx >= 0 ? args[allowIdx + 1].split(',') : []);

const html = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory() && e.name !== '_next') walk(p);
    else if (p.endsWith('.html')) html.push(p);
  }
})(outDir);

const resolves = (url) => {
  const target = join(outDir, decodeURI(url));
  return (existsSync(target) && statSync(target).isFile()) || existsSync(join(target, 'index.html')) || existsSync(`${target}.html`);
};

const broken = new Map();
for (const file of html) {
  for (const m of readFileSync(file, 'utf8').matchAll(/href="(\/(?!\/)[^"#?]*)/g)) {
    const url = m[1];
    if (allow.has(url) || resolves(url)) continue;
    if (!broken.has(url)) broken.set(url, new Set());
    broken.get(url).add(relative(outDir, file));
  }
}

console.log(`checked ${html.length} pages`);
for (const [url, from] of broken) console.log(`broken: ${url}  <- ${[...from].slice(0, 3).join(', ')}${from.size > 3 ? ` (+${from.size - 3})` : ''}`);
process.exit(broken.size ? 1 : 0);
